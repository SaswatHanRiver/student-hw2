import type { StudentSort, StudentStatus } from "@/types/student";

// Rows per page in the table
export const STUDENT_PAGE_SIZE = 10;

// Wait this long after the user stops typing before searching
export const SEARCH_DEBOUNCE_MS = 300;

// Attendance thresholds that decide the bar colour
export const ATTENDANCE_GOOD_MIN = 90;
export const ATTENDANCE_FAIR_MIN = 75;

export const GRADE_OPTIONS = [6, 7, 8, 9, 10];

export const STATUS_LABELS: Record<StudentStatus, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On leave",
  GRADUATED: "Graduated",
};

export const SORT_LABELS: Record<StudentSort, string> = {
  STUDENT_ID: "Student ID",
  NAME: "Name (A to Z)",
  NEWEST: "Newest joined",
  ATTENDANCE_LOW: "Lowest attendance",
};

export const DEFAULT_SORT: StudentSort = "STUDENT_ID";

// How long a toast stays on screen
export const TOAST_DURATION_MS = 4000;
