# Riverside Academy Admin — Frontend (AI Frontend Training, Homework 2)

An admin app for a school office: staff list, search, add, view, edit and delete students.
Data comes from our Spring Boot API in ../backend (PostgreSQL).

Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · TanStack Query 5 · axios · SCSS · Playwright
Backend API: NEXT_PUBLIC_API_BASE_URL (local: http://localhost:8080) — start it before the frontend

## Commands
npm run dev              # start the app on localhost:3000 (opens /students/list)
npx tsc --noEmit         # type-check — run after every change
npm run lint             # ESLint
npm run check            # type-check + lint together
npm run build            # production build
npm run test:e2e         # Playwright read-only tests (API must be running)
npm run test:e2e:mutation  # create/edit/delete tests — real data, cleans up after itself
npm run qa:responsive    # list/create/details x 10 WM widths: no sideways scroll, tap sizes, screenshots/

## Folders
src/app/(main)/students/...             pages: list / create / details/[id] / edit/[id]
src/utils/api-integration.ts            API_ENDPOINTS + QUERIES (cache keys)
src/utils/api-client.ts                 axios instance + API error helpers
src/api-services/StudentService.ts      axios calls, one file per domain
src/hooks/API/students/                 TanStack Query hooks (useGet..., useCreate..., useUpdate..., useDelete...)
src/features/students/                  screens, form, form rules, table, filters
src/components/                         reusable UI (heading, state block, skeleton, pagination, tags, inputs, toast, dialog)
src/hooks/                              other hooks (debounce)
src/types/                              TypeScript types
src/constants/                          page size, thresholds, labels, demo states
src/utils/                              formatters (WM date format)
src/styles/                             SCSS, WM file names (_variables, _theme, _mixins, _component, ...)
e2e/                                    Playwright tests
docs/                                   plan, design check, code walkthrough

## Rules
- Follow the style of the file you are editing.
- Reuse components in src/components before making new ones.
- Class names: lowercase-with-hyphens (`student-table-id`), never camelCase or snake_case.
  Use global SCSS classes, not CSS-module camelCase names.
- No hardcoded colours or sizes in components or page SCSS. Colours, spacing, sizes and
  breakpoints come from src/styles/_variables.scss. 1px borders use $border-width.
- Colour variables are named colour + code (`$red-b1`). Every light colour has one dark
  colour with the same name in _theme.scss.
- Media queries use the WM breakpoints via `@include below($bp-768)` etc.
- Dates use the WM English format "May 1, 2016" (utils/format-date.ts).
- No API calls in components: endpoint in api-integration.ts -> service -> hook.
- After a create/edit/delete, invalidate QUERIES.STUDENTS so lists refresh.
- Form rules in features/students/student-form-rules.ts must match backend StudentRequest.java exactly.
- Every list screen shows loading, empty, no-results, error and filled states. No mock data.
- Numbers use the three-digit comma (utils/format-number.ts).
- Comment every main block (WM HTML guideline).
- Company rules are in WM (Notion). Fetch them, don't guess.
