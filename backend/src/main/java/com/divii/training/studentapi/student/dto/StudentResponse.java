package com.divii.training.studentapi.student.dto;

import com.divii.training.studentapi.student.Student;
import com.divii.training.studentapi.student.StudentStatus;
import java.time.Instant;
import java.time.LocalDate;

/** What the API returns for one student. id is a string so JS never loses precision. */
public record StudentResponse(
        String id,
        String studentCode,
        String fullName,
        String email,
        Integer grade,
        LocalDate joinedOn,
        Integer attendancePercent,
        StudentStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static StudentResponse from(Student s) {
        return new StudentResponse(String.valueOf(s.getId()), s.getStudentCode(), s.getFullName(), s.getEmail(),
                s.getGrade(), s.getJoinedOn(), s.getAttendancePercent(), s.getStatus(), s.getCreatedAt(), s.getUpdatedAt());
    }
}
