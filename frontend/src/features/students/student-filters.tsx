"use client";

import { SearchInput } from "@/components/search-input/search-input";
import { SelectFilter, type SelectOption } from "@/components/select-filter/select-filter";
import { GRADE_OPTIONS, SORT_LABELS, STATUS_LABELS } from "@/constants/student-list";
import type { StudentSort, StudentStatus } from "@/types/student";

const GRADE_SELECT_OPTIONS: SelectOption[] = [
  { value: "", label: "All grades" },
  ...GRADE_OPTIONS.map((grade) => ({ value: String(grade), label: `Grade ${grade}` })),
];

const STATUS_SELECT_OPTIONS: SelectOption[] = [
  { value: "", label: "All statuses" },
  ...(Object.keys(STATUS_LABELS) as StudentStatus[]).map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

const SORT_SELECT_OPTIONS: SelectOption[] = (Object.keys(SORT_LABELS) as StudentSort[]).map((sort) => ({
  value: sort,
  label: SORT_LABELS[sort],
}));

interface StudentFiltersProps {
  search: string;
  grade: string;
  status: string;
  sort: StudentSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

// Search box + grade + status + sort + Reset
// It holds no state itself: the parent screen owns the values (props down, events up)
export function StudentFilters(props: StudentFiltersProps) {
  return (
    <div className="student-filters">
      <div className="student-filters-search">
        <SearchInput
          id="student-search"
          label="Search"
          value={props.search}
          placeholder="Name, email or student ID"
          onChange={props.onSearchChange}
        />
      </div>

      <SelectFilter id="student-grade-filter" label="Grade" value={props.grade} options={GRADE_SELECT_OPTIONS} onChange={props.onGradeChange} />

      <SelectFilter id="student-status-filter" label="Status" value={props.status} options={STATUS_SELECT_OPTIONS} onChange={props.onStatusChange} />

      <SelectFilter id="student-sort" label="Sort by" value={props.sort} options={SORT_SELECT_OPTIONS} onChange={props.onSortChange} />

      <button type="button" className="btn btn-text" onClick={props.onReset} disabled={!props.hasActiveFilters}>
        Reset
      </button>
    </div>
  );
}
