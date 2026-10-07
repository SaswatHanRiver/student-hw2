package com.divii.training.studentapi.common;

/** A unique value (student ID or email) is already used by another record. */
public class ConflictException extends RuntimeException {

    private final String field;

    public ConflictException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
