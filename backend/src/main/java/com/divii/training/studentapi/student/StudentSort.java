package com.divii.training.studentapi.student;

import org.springframework.data.domain.Sort;

/** The sort orders the list allows. Anything else falls back to STUDENT_ID. */
public enum StudentSort {
    STUDENT_ID(Sort.by("studentCode").ascending()),
    NAME(Sort.by("fullName").ascending().and(Sort.by("studentCode"))),
    NEWEST(Sort.by("joinedOn").descending().and(Sort.by("studentCode"))),
    ATTENDANCE_LOW(Sort.by("attendancePercent").ascending().and(Sort.by("studentCode")));

    private final Sort sort;

    StudentSort(Sort sort) {
        this.sort = sort;
    }

    public Sort toSort() {
        return sort;
    }
}
