package com.divii.training.studentapi.common;

import java.util.List;
import org.springframework.data.domain.Page;

/** One page of results. page is 1-based, the way the UI shows it. */
public record PageResponse<T>(List<T> items, long totalCount, int page, int pageSize) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getTotalElements(), page.getNumber() + 1, page.getSize());
    }
}
