package com.divii.training.studentapi.common;

import java.util.List;

/**
 * The one error shape every endpoint returns.
 * code        = stable, machine-readable (the frontend can switch on it)
 * message     = sentence shown to the user
 * fieldErrors = one entry per invalid field (empty when not a validation error)
 */
public record ApiError(String code, String message, List<FieldError> fieldErrors) {

    public record FieldError(String field, String message) {}

    public static ApiError of(String code, String message) {
        return new ApiError(code, message, List.of());
    }
}
