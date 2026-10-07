package com.divii.training.studentapi.student;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.divii.training.studentapi.common.ConflictException;
import com.divii.training.studentapi.common.NotFoundException;
import com.divii.training.studentapi.student.dto.StudentRequest;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/** Business rules: uniqueness, normalising input, not-found. Repository is mocked. */
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository repository;

    @InjectMocks
    private StudentService service;

    private static StudentRequest request(String code, String email) {
        return new StudentRequest(code, "  Test Student  ", email, 8, LocalDate.parse("2025-04-01"), 90, StudentStatus.ACTIVE);
    }

    @Test
    void createTrimsNameAndNormalisesCodeAndEmail() {
        when(repository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.create(request("stu-2026-100", " Test.Student@Example.com "));

        ArgumentCaptor<Student> saved = ArgumentCaptor.forClass(Student.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getStudentCode()).isEqualTo("STU-2026-100");
        assertThat(saved.getValue().getEmail()).isEqualTo("test.student@example.com");
        assertThat(saved.getValue().getFullName()).isEqualTo("Test Student");
    }

    @Test
    void createRejectsDuplicateEmail() {
        when(repository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request("STU-2026-100", "taken@example.com")))
                .isInstanceOf(ConflictException.class)
                .hasMessage("This email is already used by another student.");
        verify(repository, never()).save(any());
    }

    @Test
    void updateAllowsKeepingItsOwnEmail() {
        Student existing = new Student();
        existing.setId(5L);
        when(repository.findById(5L)).thenReturn(Optional.of(existing));
        when(repository.existsByStudentCodeAndIdNot("STU-2026-005", 5L)).thenReturn(false);
        when(repository.existsByEmailAndIdNot("meera.iyer@example.com", 5L)).thenReturn(false);
        when(repository.saveAndFlush(existing)).thenReturn(existing);

        service.update(5L, request("STU-2026-005", "meera.iyer@example.com"));

        verify(repository).saveAndFlush(existing);
    }

    @Test
    void getMissingStudentThrowsNotFound() {
        when(repository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.get(404L)).isInstanceOf(NotFoundException.class);
    }
}
