package com.divii.training.studentapi.common;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Turns every exception into the ApiError shape, with a message a user can understand. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 400 - Bean Validation failed on the request body
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidation(MethodArgumentNotValidException ex) {
        List<ApiError.FieldError> fields = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ApiError.FieldError(error.getField(), error.getDefaultMessage()))
                .toList();
        return new ApiError("VALIDATION_FAILED", "Please check the highlighted fields.", fields);
    }

    // 400 - body is not valid JSON, or an enum / date value can't be read
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleUnreadable(HttpMessageNotReadableException ex) {
        return ApiError.of("INVALID_REQUEST", "The request could not be read. Please check the values and try again.");
    }

    // 400 - path or query parameter has the wrong type (e.g. /students/abc)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ApiError.of("INVALID_REQUEST", "The value for '" + ex.getName() + "' is not valid.");
    }

    // 404
    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(NotFoundException ex) {
        return ApiError.of("NOT_FOUND", ex.getMessage());
    }

    // 409 - duplicate student ID or email; reported on the field so the form can highlight it
    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiError handleConflict(ConflictException ex) {
        return new ApiError("DUPLICATE_VALUE", ex.getMessage(),
                List.of(new ApiError.FieldError(ex.getField(), ex.getMessage())));
    }

    // 500 - anything unexpected: log it, never leak internals to the user
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiError handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        return ApiError.of("SERVER_ERROR", "Something went wrong on our side. Please try again in a moment.");
    }
}
