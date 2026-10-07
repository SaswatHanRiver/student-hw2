# Plan — Students list (written before the code)

## What is on the screen
1. App header (product name, signed-in user)
2. Page heading: "Students" + one-line description
3. One card containing:
   - Filter bar: Search, Grade, Status, Reset
   - Table: Student ID, Name + email, Grade, Joined on, Attendance, Status
   - Pagination: "Showing 1-10 of 24", Previous, page numbers, Next

## States
| State | When | What shows |
|---|---|---|
| Loading | data not back yet | table header + 10 skeleton rows |
| Filled | rows exist | table + pagination |
| No results | filters active, 0 rows | message + "Clear filters" |
| Empty | no filters, 0 rows | "No students yet" |
| Error | load failed | red message + "Try again" |

`?state=loading|empty|error` forces a state so the reviewer and Playwright can check each one.

## Components (reuse first, keep small)
Reusable (`src/components`): page-heading, state-block, table-skeleton, pagination,
status-tag, search-input, select-filter, app-header.
Screen-specific (`src/features/students`): student-list-screen, student-filters,
student-table, attendance-bar.

## Data
`useMockStudentList(filters, demoState)` returns `{ data, isLoading, isError, refetch }` —
the same shape a TanStack Query hook returns. In HW2 only this hook changes
(service + hook pattern); the screen stays the same.

## Responsive rules (WM breakpoints)
- Above 991: filters in one row.
- 991 and below: search on its own row, Grade + Status + Reset below.
- 768 and below: table rows become cards (labels from `data-label`), name on top.
- 640 and below: filters stacked; buttons and inputs at least 44px tall for touch.
- Nothing may make the page scroll sideways; if the table is ever too wide it scrolls in its own box.

## Checks
`npx tsc --noEmit`, `npm run lint`, `npm run build`, Playwright behaviour tests,
Playwright responsive test at all 10 widths x 4 states.
