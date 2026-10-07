# Plan — Students feature (HW2), written before the code

## Scope
List (search, filter, sort, paging) · Create · Details · Edit · Delete, on my own Spring Boot API + PostgreSQL.
HW1's list screen is reused: only its mock hook is replaced by the real API hook.

## Backend (Spring Boot)
1. `student` table via Flyway (V1 schema, V2 the same 24 students as HW1 so the list isn't empty).
2. Entity `Student`, repository with `JpaSpecificationExecutor` for optional filters.
3. `StudentRequest` DTO: one set of Bean Validation rules for create and edit, with user-facing messages.
4. `StudentService`: uniqueness of student ID and email (409), trim / normalise, clamp page and size.
5. `StudentController` at `/api/v1/students`, `GlobalExceptionHandler` maps every error to `{code, message, fieldErrors}`.
6. CORS for the frontend origin, `/actuator/health` for Render, Swagger UI for anyone checking the API.
7. Tests: `@WebMvcTest` for validation messages and error shapes, Mockito for service rules.

## Frontend: the 3 layers from Step 3
1. `src/utils/api-integration.ts`: `API_ENDPOINTS`, `QUERIES` (cache keys)
2. `src/api-services/StudentService.ts`: axios calls only
3. `src/hooks/API/students/`: `useGetStudentList`, `useGetStudentDetails`, `useCreateStudent`, `useUpdateStudent`, `useDeleteStudent`
No component calls axios directly.

## Pages (App Router)
| URL | File |
|---|---|
| `/students/list` | `app/(main)/students/list/page.tsx` |
| `/students/create` | `app/(main)/students/create/page.tsx` |
| `/students/details/[id]` | `app/(main)/students/details/[id]/page.tsx` |
| `/students/edit/[id]` | `app/(main)/students/edit/[id]/page.tsx` |

## Forms
- One `StudentForm` for create and edit. `student-form-rules.ts` copies the backend rules and messages word for word.
- Submit is disabled while saving. On success: toast, the list refreshes (invalidate `["students"]`), go to the list.
- On API error: the message is shown above the form, field errors are shown on their fields, typed values are kept.

## States
List: loading skeleton · filled · no results (Clear filters) · empty (Add student) · error with the API's message + Try again.
Details/Edit: loading · not found (404) · error + Try again.

## WM formats
Dates "May 1, 2016"; numbers with a three-digit comma (`1,234`); error messages are full sentences that say how to fix the problem. The WM Error Message List page is still an empty draft, so these are my own wording, kept identical on both ends.

## Checks
`./mvnw test` · `npm run check` · `npm run build` · `npm run test:e2e` · `npm run test:e2e:mutation` · `npm run qa:responsive`
