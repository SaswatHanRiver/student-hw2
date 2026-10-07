package com.divii.training.studentapi.student;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.divii.training.studentapi.common.ConflictException;
import com.divii.training.studentapi.common.NotFoundException;
import com.divii.training.studentapi.common.PageResponse;
import com.divii.training.studentapi.student.dto.StudentResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Web layer only: request parsing, validation messages and error shapes. The service is mocked. */
@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private StudentService service;

    private static final String VALID_BODY = """
            {"studentCode":"STU-2026-100","fullName":"Test Student","email":"test.student@example.com",
             "grade":8,"joinedOn":"2025-04-01","attendancePercent":90,"status":"ACTIVE"}
            """;

    private static StudentResponse sample() {
        return new StudentResponse("1", "STU-2026-100", "Test Student", "test.student@example.com", 8,
                LocalDate.parse("2025-04-01"), 90, StudentStatus.ACTIVE, Instant.EPOCH, Instant.EPOCH);
    }

    @Test
    void listReturnsOnePage() throws Exception {
        when(service.list(eq("ish"), eq(9), eq(StudentStatus.ACTIVE), eq(StudentSort.NAME), eq(1), eq(10)))
                .thenReturn(new PageResponse<>(List.of(sample()), 1, 1, 10));

        mvc.perform(get("/api/v1/students?search=ish&grade=9&status=ACTIVE&sort=NAME&page=1&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.items[0].studentCode").value("STU-2026-100"))
                .andExpect(jsonPath("$.items[0].joinedOn").value("2025-04-01"));
    }

    @Test
    void unknownStatusFilterIs400() throws Exception {
        mvc.perform(get("/api/v1/students?status=SLEEPING"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    @Test
    void createValidReturns201() throws Exception {
        when(service.create(any())).thenReturn(sample());

        mvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    void createWithBadFieldsReturnsEveryFieldMessage() throws Exception {
        String body = """
                {"studentCode":"S-1","fullName":"A","email":"not-an-email",
                 "grade":12,"joinedOn":"2999-01-01","attendancePercent":101,"status":"ACTIVE"}
                """;

        mvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.length()").value(6))
                .andExpect(jsonPath("$.fieldErrors[?(@.field=='studentCode')].message").value("Student ID must look like STU-2026-001."))
                .andExpect(jsonPath("$.fieldErrors[?(@.field=='grade')].message").value("Grade must be between 6 and 10."))
                .andExpect(jsonPath("$.fieldErrors[?(@.field=='joinedOn')].message").value("Joined on date can't be in the future."));

        verify(service, never()).create(any());
    }

    @Test
    void createWithMissingFieldsReturnsRequiredMessages() throws Exception {
        mvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.length()").value(7))
                .andExpect(jsonPath("$.fieldErrors[?(@.field=='fullName')].message").value("Name is required."));
    }

    @Test
    void duplicateEmailIs409OnTheEmailField() throws Exception {
        when(service.create(any())).thenThrow(new ConflictException("email", "This email is already used by another student."));

        mvc.perform(post("/api/v1/students").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DUPLICATE_VALUE"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("email"));
    }

    @Test
    void missingStudentIs404() throws Exception {
        when(service.get(99L)).thenThrow(new NotFoundException("This student doesn't exist or was already deleted."));

        mvc.perform(get("/api/v1/students/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("This student doesn't exist or was already deleted."));
    }
}
