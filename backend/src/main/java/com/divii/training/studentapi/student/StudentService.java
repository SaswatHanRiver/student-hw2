package com.divii.training.studentapi.student;

import com.divii.training.studentapi.common.ConflictException;
import com.divii.training.studentapi.common.NotFoundException;
import com.divii.training.studentapi.common.PageResponse;
import com.divii.training.studentapi.student.dto.StudentRequest;
import com.divii.training.studentapi.student.dto.StudentResponse;
import java.util.Locale;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    static final int MAX_PAGE_SIZE = 100;

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    /** page is 1-based; out-of-range page/size values are clamped instead of failing. */
    @Transactional(readOnly = true)
    public PageResponse<StudentResponse> list(String search, Integer grade, StudentStatus status,
                                              StudentSort sort, int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        Specification<Student> spec = Specification.allOf(
                StudentSpecifications.matchesSearch(search),
                StudentSpecifications.hasGrade(grade),
                StudentSpecifications.hasStatus(status));
        StudentSort safeSort = sort == null ? StudentSort.STUDENT_ID : sort;
        var result = repository.findAll(spec, PageRequest.of(safePage - 1, safeSize, safeSort.toSort()));
        return PageResponse.from(result.map(StudentResponse::from));
    }

    @Transactional(readOnly = true)
    public StudentResponse get(Long id) {
        return StudentResponse.from(find(id));
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        String code = normaliseCode(request.studentCode());
        String email = normaliseEmail(request.email());
        if (repository.existsByStudentCode(code)) {
            throw new ConflictException("studentCode", "This student ID is already used by another student.");
        }
        if (repository.existsByEmail(email)) {
            throw new ConflictException("email", "This email is already used by another student.");
        }
        Student student = new Student();
        apply(student, request, code, email);
        return StudentResponse.from(repository.save(student));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = find(id);
        String code = normaliseCode(request.studentCode());
        String email = normaliseEmail(request.email());
        if (repository.existsByStudentCodeAndIdNot(code, id)) {
            throw new ConflictException("studentCode", "This student ID is already used by another student.");
        }
        if (repository.existsByEmailAndIdNot(email, id)) {
            throw new ConflictException("email", "This email is already used by another student.");
        }
        apply(student, request, code, email);
        return StudentResponse.from(repository.saveAndFlush(student));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }

    private Student find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("This student doesn't exist or was already deleted."));
    }

    private static void apply(Student student, StudentRequest request, String code, String email) {
        student.setStudentCode(code);
        student.setFullName(request.fullName().trim());
        student.setEmail(email);
        student.setGrade(request.grade());
        student.setJoinedOn(request.joinedOn());
        student.setAttendancePercent(request.attendancePercent());
        student.setStatus(request.status());
    }

    private static String normaliseCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private static String normaliseEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
