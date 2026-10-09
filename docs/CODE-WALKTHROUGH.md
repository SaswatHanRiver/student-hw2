# Code walkthrough (HW2) — what to be ready to explain

HW1's walkthrough (`frontend/docs/CODE-WALKTHROUGH.md`) still applies to the list screen.
This file covers what is new.

## 1. A request from button click to database and back
Typing "ish" in Search:
1. `setSearch("ish")` -> the screen re-renders.
2. `useDebouncedValue` waits 300 ms, then `debouncedSearch` = "ish".
3. `useGetStudentList({search:"ish", ...})` gets a **new query key** `["students","list",{...}]`, so TanStack Query runs `queryFn`.
4. `StudentService.getList` -> axios `GET /api/v1/students?search=ish&sort=STUDENT_ID&page=1&size=10`.
5. Spring: `StudentController.list` -> `StudentService.list` -> `repository.findAll(spec, PageRequest)` -> SQL with `LOWER(...) LIKE '%ish%'`.
6. JSON `{items,totalCount,page,pageSize}` -> cached under that key -> `data` changes -> the table re-renders.
While it loads, `placeholderData: keepPreviousData` keeps the old rows on screen, faded (`isPlaceholderData`).

## 2. The three frontend layers (training Step 3)
| Layer | File | Backend comparison |
|---|---|---|
| Paths + cache keys | `src/utils/api-integration.ts` | constants / route mapping |
| HTTP calls | `src/api-services/StudentService.ts` | a REST client class |
| Hooks for screens | `src/hooks/API/students/*.ts` | service layer the controller calls |
Components never import axios. To change the API, only the service changes.

## 3. TanStack Query: queries vs mutations
- **useQuery** (`useGetStudentList`, `useGetStudentDetails`): reads data. Returns `data`, `isPending` (first load), `isError`, `error`, `refetch`. The result is cached by key.
- **useMutation** (`useCreateStudent`, `useUpdateStudent`, `useDeleteStudent`): writes. Returns `mutate`, `isPending`, `isError`, `error`.
- After a write, `invalidateQueries({ queryKey: ["students"] })` marks **every** key that starts with `"students"` as stale, so the list and details refetch by themselves. This is the "list refreshes after create/edit/delete" rule.
- Delete uses `removeQueries` for that student's details first, because refetching a deleted student would just 404.
- `providers.tsx` creates **one** `QueryClient` (inside `useState`, so it isn't recreated on every render) and sets defaults: retry once, but never retry a 404; never retry a mutation (a retried POST could create two students).

## 4. Where data lives (training Step 4)
- From the API -> TanStack Query only (never copied into `useState`).
- This screen only -> `useState` (filters, page, dialog open, what the user is typing).
- Whole app -> React context, used just for toasts (`ToastProvider` / `useToast`). No Redux needed.

## 5. The form
- **Controlled inputs**: `values` state is the source of truth; every keystroke calls `setField`.
- `student-form-rules.ts` = the frontend copy of `StudentRequest.java`: the same regexes, limits and **identical messages**. If one changes, change both.
- Client errors appear only after the first submit (`hasSubmitted`), then update live as the user fixes things.
- Server errors: `getApiFieldErrors(error)` turns `fieldErrors` from a 400 or 409 into `{ email: "..." }`, shown under the field until the user edits that field (`editedSinceSubmit`).
- **No double submit**: the button is `disabled={isSaving}`, and `handleSubmit` also returns early while saving.
- Typed values are kept on error because the form's state is never reset; only success navigates away.
- Edit mode: `initialValues={toStudentFormValues(student)}` + `key={student.id}`. `useState(initialValues)` only reads its argument on the first render, so the `key` makes React create a fresh form if the student changes.

## 6. Next.js parts
- **Dynamic route** `app/(main)/students/details/[id]/page.tsx`: the folder name in brackets becomes `params.id`.
- In Next.js 15, `params` is a **Promise**, so the page is an `async` server component: `const { id } = await params;`, then it renders the client screen with `id` as a prop.
- `"use client"` is on the screens, hooks and form because they use state, effects, events or TanStack Query.
- Navigation: `<Link>` for normal links; `useRouter().push("/students/list")` after a successful save or delete.
- `NEXT_PUBLIC_API_BASE_URL` is read in the browser, so it **must** start with `NEXT_PUBLIC_`. It is baked in at build time, so change it in Vercel and then redeploy.

## 7. Error handling end to end
| Situation | API returns | Screen shows |
|---|---|---|
| Field invalid | 400 `VALIDATION_FAILED` + `fieldErrors` | Banner + message under each field |
| Duplicate ID / email | 409 `DUPLICATE_VALUE` + one field error | Banner + message under that field |
| Not found | 404 `NOT_FOUND` | "Student not found" + Back to students |
| Server bug | 500 `SERVER_ERROR` (details only in the server log) | The API's message + Try again |
| API unreachable | no response | "We couldn't reach the server…" + Try again |
`GlobalExceptionHandler` (Spring) builds the left column; `getApiErrorMessage` / `getApiFieldErrors` (`utils/api-client.ts`) read it.

## 8. Backend points
- Flyway owns the schema; Hibernate never changes it (`ddl-auto: none`). The same scripts run on PostgreSQL (local) and on H2 in PostgreSQL mode (demo server, profile `h2`).
- `Specification.allOf(...)`: each filter returns `null` when unused, so only the filters actually used go into the WHERE clause.
- Page and size are clamped in the service (page at least 1, size 1 to 100), and the API's page is 1-based like the UI.
- Code and email are normalised (uppercase / lowercase + trim) before the uniqueness check, so `Ana@X.com` and `ana@x.com` count as the same email.
- `id` is sent as a string, so a large `Long` never loses precision in JavaScript.

## 9. Tests
- Backend: `StudentControllerTest` (`@WebMvcTest`: real validation and JSON, mocked service) and `StudentServiceTest` (Mockito: duplicate rules, normalising, not found).
- Frontend: `e2e/students.spec.ts` (read-only), `e2e/students.mutation.spec.ts` (create/edit/delete; only runs with `E2E_MUTATION=1`), `e2e/responsive-screenshots.spec.ts`.
- `page.route(...)` in Playwright simulates slow, failing or empty API responses to test the loading, error and empty states. The app itself has no mock data.

## Likely review questions
1. Why doesn't the list need a manual refresh after a delete?
2. What would happen without `key={student.id}` on the edit form?
3. Why `retry: 0` for mutations?
4. Where would you add a new field, front to back? (migration, entity, DTO + rules, response, TS types, form rules, form, details, table)
5. Why is the details page an `async` function?
