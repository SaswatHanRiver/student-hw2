"use client";

import { formatNumber } from "@/utils/format-number";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

// "Showing 1-10 of 24" + Previous / page numbers / Next
export function Pagination({ page, pageSize, totalCount, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const firstRow = (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, totalCount);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination-summary">
        Showing {formatNumber(firstRow)}-{formatNumber(lastRow)} of {formatNumber(totalCount)}
      </p>

      <div className="pagination-pages">
        <button type="button" className="pagination-button" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={pageNumber === page ? "pagination-button pagination-button-current" : "pagination-button"}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button type="button" className="pagination-button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount}>
          Next
        </button>
      </div>
    </nav>
  );
}
