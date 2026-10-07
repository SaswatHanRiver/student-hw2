package com.divii.training.studentapi.student.dto;

import com.divii.training.studentapi.student.StudentStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Body for create (POST) and edit (PUT). Same rules for both.
 * The frontend form (src/features/students/student-form-rules.ts) copies these rules
 * and messages exactly; change both together.
 */
public record StudentRequest(

        @NotBlank(message = "Student ID is required.")
        @Pattern(regexp = "^STU-\\d{4}-\\d{3}$", message = "Student ID must look like STU-2026-001.")
        String studentCode,

        @NotBlank(message = "Name is required.")
        @Size(min = 2, max = 50, message = "Name must be 2 to 50 characters.")
        String fullName,

        @NotBlank(message = "Email is required.")
        @Size(max = 100, message = "Email must be 100 characters or fewer.")
        @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message = "Enter a valid email address, like name@example.com.")
        String email,

        @NotNull(message = "Grade is required.")
        @Min(value = 6, message = "Grade must be between 6 and 10.")
        @Max(value = 10, message = "Grade must be between 6 and 10.")
        Integer grade,

        @NotNull(message = "Joined on date is required.")
        @PastOrPresent(message = "Joined on date can't be in the future.")
        LocalDate joinedOn,

        @NotNull(message = "Attendance is required.")
        @Min(value = 0, message = "Attendance must be between 0 and 100.")
        @Max(value = 100, message = "Attendance must be between 0 and 100.")
        Integer attendancePercent,

        @NotNull(message = "Status is required.")
        StudentStatus status
) {}
