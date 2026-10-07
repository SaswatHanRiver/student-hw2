# Code walkthrough — how to explain this screen in review

Read this with the code open. Each part says what it does, the React/Next.js idea
behind it, and a backend comparison.

## 1. How the URL reaches the screen (Next.js App Router)
- `src/app/layout.tsx` wraps every page: `<html>`, `<body>`, the `AppHeader`, global SCSS.
- `src/app/page.tsx`: `/` redirects to `/students/list`.
- `src/app/(main)/students/list/page.tsx`: folder = URL. `(main)` is a **route group**,
  brackets mean it is not part of the URL. This file is a **server component** (the default).
- It renders `<StudentListScreen />` inside `<Suspense>`. Suspense is needed because the
  screen reads the URL query (`useSearchParams`), and Next.js must know what to show
  while that is not ready.
- Backend comparison: the folder path is like the `@GetMapping` path of a controller.

## 2. Server vs client components
`student-list-screen.tsx`, `student-filters.tsx`, `search-input.tsx`, `select-filter.tsx`,
`pagination.tsx` and the hooks start with `"use client"`, because they use **state**,
**effects** or **event handlers**, which only run in the browser.
Components without it (`page-heading`, `state-block`, `status-tag`, `student-table`)
only turn props into HTML. They are used inside a client component, so they run in the browser too.

## 3. State — who owns what (`student-list-screen.tsx`)
```ts
const [search, setSearch] = useState("");
const [grade, setGrade] = useState("");
const [status, setStatus] = useState<StudentStatus | "">("");
const [page, setPage] = useState(1);
```
- These are **screen-only** values, so `useState` is the right place (training Step 4: "data for this screen only").
- Calling `setSearch(...)` stores the new value and **re-renders** the component.
- Every filter handler also calls `setPage(1)`: after changing a filter you start from page 1.
- `hasActiveFilters` is **derived**: calculated from state on each render, not stored. If you
  can calculate it, don't make it state.

## 4. Props down, events up (`student-filters.tsx`)
`StudentFilters` has **no state of its own**. The screen passes values down as **props**
(`search`, `grade`, `status`) and functions (`onSearchChange`, ...). When the user types,
the child calls the function and the parent updates its state.
Props are read-only: the child never changes `props.search` itself.
Backend comparison: props are method parameters; the callbacks are like passing a listener.

## 5. Controlled inputs (`search-input.tsx`, `select-filter.tsx`)
`<input value={value} onChange={(e) => onChange(e.target.value)} />`
The input shows whatever is in state, and every key press updates state. React state is
the single source of truth, not the DOM.

## 6. Hooks
### `useDebouncedValue(value, 300)` — `hooks/use-debounced-value.ts`
- `useEffect` starts a 300ms timer each time `value` changes.
- The **cleanup function** (`return () => clearTimeout(timer)`) runs before the next effect,
  so typing quickly cancels the old timers. Only the last value "wins".
- Dependency array `[value, delayMs]`: the effect re-runs only when these change.
  Leaving `value` out would freeze it; setting state that is also a dependency could loop.

### `useMockStudentList(filters, demoState)` — `hooks/use-mock-student-list.ts`
- Returns `{ data, isLoading, isError, refetch }`, the same shape as a TanStack Query hook.
- Inside, `useEffect` waits 600ms (fake network), then filters + pages the mock array
  exactly the way a backend would (`queryMockStudents`).
- The cleanup cancels the timer if filters change first, so a slow old result can never
  overwrite a newer one.
- `refetch` bumps `reloadKey`, a dependency of the effect, so the effect runs again.
- `demoState` from `?state=` forces loading / empty / error for review.
  In error mode the first load fails and "Try again" succeeds, to show recovery.
- HW2: this file becomes `StudentService` (axios) + `useGetStudentList` (TanStack Query).
  The screen only needs its import changed.
- Rules of hooks: hooks are called at the top level of a component or another hook,
  never inside `if` or loops.

## 7. Conditional rendering — the five states (`renderBody` in the screen)
Order matters:
1. `isError` -> red `StateBlock` + Try again
2. `isLoading || students.length > 0` -> table (skeleton rows while loading) + pagination when loaded
3. no rows and filters active -> "No students match these filters" + Clear filters
4. no rows, no filters -> "No students yet"

## 8. Lists and keys (`student-table.tsx`)
`students.map((student) => <tr key={student.id}>...)`
`key` must be unique and stable so React knows which row is which between renders.
Never use the array index for data that can be filtered or re-ordered.

## 9. Types
`src/types/student.ts` defines `Student`, `StudentListFilters`, `StudentListPage`.
No `any` anywhere. `StudentStatus` is a union (`"ACTIVE" | "ON_LEAVE" | "GRADUATED"`),
like a Java enum. In HW2 these must match the Spring Boot DTO.

## 10. Styling and WM rules
- `src/styles/style.scss` imports all partials (WM folder names: `_variables`, `_theme`,
  `_mixins`, `_reset`, `_header`, `_button`, `_form-element`, `_component`, `_student-list`).
- Colours: `$blue-b1: var(--blue-b1)`. The real values live in `_theme.scss`, once for
  light and once for dark with the **same name**.
- No hardcoded colours or sizes in component styles: everything is a variable. The only
  inline style is the attendance bar width (`style={{ width: "96%" }}`), because it comes from data.
- Class names are lowercase-with-hyphens (`student-table-name-cell`).
- `@include below($bp-768)` = `@media (max-width: 768px)`.
- Phone/tablet cards: `thead` is visually hidden, each `td` shows its label with
  `content: attr(data-label)`, and `order: -1` moves the name to the top of the card.

## 11. Tests
- `e2e/student-list.spec.ts`: title, 10 rows, paging to page 3, search, no results +
  Clear filters, status filter, error + Try again.
- `e2e/responsive-screenshots.spec.ts`: 10 widths x 4 states. Each test checks the state
  rendered, the page does not scroll sideways, every visible control is at least 24x24px,
  and saves a screenshot.

## Likely review questions (practise these)
- Why does `student-list-screen.tsx` need `"use client"`? (useState, useSearchParams, onClick)
- What happens, step by step, when I type "ish" in the search box?
  (setSearch -> re-render -> debounce timer -> debounced value changes -> hook effect re-runs ->
  isLoading true -> skeleton -> 600ms -> data -> table)
- Why is `page` reset to 1 when a filter changes?
- Why `key={student.id}` and not the index?
- Where would the API call go in HW2, and why not inside the component?
- How does dark mode work without changing any component?
