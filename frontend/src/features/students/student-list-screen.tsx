"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading/page-heading";
import { Pagination } from "@/components/pagination/pagination";
import { StateBlock } from "@/components/state-block/state-block";
import { DEFAULT_SORT, SEARCH_DEBOUNCE_MS, STUDENT_PAGE_SIZE } from "@/constants/student-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGetStudentList } from "@/hooks/API/students/useGetStudentList";
import type { StudentSort, StudentStatus } from "@/types/student";
import { getApiErrorMessage } from "@/utils/api-client";
import { formatNumber } from "@/utils/format-number";
import { StudentFilters } from "./student-filters";
import { StudentTable } from "./student-table";

// The Students list screen: owns the filter state, asks the API hook for data,
// and decides which state to show (loading / error / empty / no results / filled).
export function StudentListScreen() {
  // Screen-only state (useState): what the user typed / picked
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState<StudentStatus | "">("");
  const [sort, setSort] = useState<StudentSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  // Only search after the user stops typing
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  // Server data lives in TanStack Query, never copied into useState
  const { data, isPending, isError, error, isPlaceholderData, refetch } = useGetStudentList({
    search: debouncedSearch,
    grade,
    status,
    sort,
    page,
    size: STUDENT_PAGE_SIZE,
  });

  const hasActiveFilters = search !== "" || grade !== "" || status !== "";

  // Any filter change goes back to page 1
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleGradeChange = (value: string) => {
    setGrade(value);
    setPage(1);
  };
  const handleStatusChange = (value: string) => {
    setStatus(value as StudentStatus | "");
    setPage(1);
  };
  const handleSortChange = (value: string) => {
    setSort(value as StudentSort);
    setPage(1);
  };
  const handleReset = () => {
    setSearch("");
    setGrade("");
    setStatus("");
    setPage(1);
  };

  const students = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Decide what goes under the filter bar
  const renderBody = () => {
    // 1. Error with nothing to show -> API message + Try again
    if (isError && !data) {
      return (
        <StateBlock
          variant="error"
          testId="state-error"
          title="Couldn't load students"
          message={getApiErrorMessage(error)}
          action={
            <button type="button" className="btn btn-secondary" onClick={() => refetch()}>
              Try again
            </button>
          }
        />
      );
    }

    // 2. First load, or rows to show -> table (skeleton rows on first load)
    if (isPending || students.length > 0) {
      return (
        <>
          <StudentTable
            students={students}
            isLoading={isPending}
            isRefreshing={isPlaceholderData}
            skeletonRows={STUDENT_PAGE_SIZE}
          />
          {!isPending && (
            <Pagination page={page} pageSize={STUDENT_PAGE_SIZE} totalCount={totalCount} onPageChange={setPage} />
          )}
        </>
      );
    }

    // 3. No rows because of filters -> "no results"
    if (hasActiveFilters) {
      return (
        <StateBlock
          testId="state-no-results"
          title="No students match these filters"
          message={
            debouncedSearch
              ? `Nothing found for "${debouncedSearch}". Check the spelling or clear the filters.`
              : "Try another grade or status, or clear the filters."
          }
          action={
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Clear filters
            </button>
          }
        />
      );
    }

    // 4. No rows at all -> empty
    return (
      <StateBlock
        testId="state-empty"
        title="No students yet"
        message="Students appear here once they are enrolled. Add the first one to get started."
        action={
          <Link href="/students/create" className="btn btn-secondary">
            Add student
          </Link>
        }
      />
    );
  };

  return (
    <main className="page-container">
      <PageHeading
        title="Students"
        description="Find a student by name, email or student ID, and filter by grade or status."
        badge={
          data && !hasActiveFilters ? (
            <span className="count-badge" data-testid="student-count">
              {formatNumber(totalCount)} enrolled
            </span>
          ) : undefined
        }
        actions={
          <Link href="/students/create" className="btn btn-primary">
            Add student
          </Link>
        }
      />

      <section className="surface-card" aria-label="Student list">
        <StudentFilters
          search={search}
          grade={grade}
          status={status}
          sort={sort}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={handleSearchChange}
          onGradeChange={handleGradeChange}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onReset={handleReset}
        />
        {renderBody()}
      </section>
    </main>
  );
}
