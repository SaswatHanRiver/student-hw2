package com.divii.training.studentapi.student;

import java.util.Locale;
import org.springframework.data.jpa.domain.Specification;

/** Optional filters for the list. A null or blank value means "don't filter on this". */
final class StudentSpecifications {

    private StudentSpecifications() {}

    /** Search text matches name, email or student ID (case-insensitive, "contains"). */
    static Specification<Student> matchesSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }
            String pattern = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("fullName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("studentCode")), pattern));
        };
    }

    static Specification<Student> hasGrade(Integer grade) {
        return (root, query, cb) -> grade == null ? null : cb.equal(root.get("grade"), grade);
    }

    static Specification<Student> hasStatus(StudentStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}
