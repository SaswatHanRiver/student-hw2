# QA build report — Students feature (HW2)

Format: WM | Report (10 parts from training Step 8). Items in [brackets] are filled in after deploy.

**1. Build**
- Branch: `main` · Commit: [short hash after push] · Date: [date]
- Frontend: [Vercel URL]/students/list · API: [Render URL] (Swagger: [Render URL]/swagger-ui.html)
- Free hosting sleeps when idle: the **first request can take about a minute**. Open the API health link first: [Render URL]/actuator/health

**2. TL tasks covered**
- TL | AI Frontend Training — Homework 2 (main task: https://app.notion.com/p/3e9326b2d5fb81298fb5e4afc8157861)

**3. What changed (plain words)**
- New: staff can **add, view, edit and delete** students. Before, the list only showed sample data.
- The list now reads from the real database, with search (name, email, student ID), grade and status filters, sorting, and 10 per page.
- Each student has a details page with Edit and Delete. Delete asks for confirmation first.
- Forms check every field before saving and show the server's message when a value is rejected (e.g. an email already used).

**4. Fixed issues**
- No QA tickets yet (first build). Two issues I found myself during testing:
  - A student that does not exist was retried before showing "not found". Fixed: a 404 is no longer retried, so "Student not found" shows at once.
  - Name / date cells wrapping in the middle of words at 768 px (fixed in HW1, re-checked here).

**5. Test accounts / roles**
- None. The app has no login (not applicable).

**6. Data QA must prepare first**
- Nothing. A fresh database starts with 24 students (Flyway seed).
- Mutation tests use their own unique student IDs (`STU-2099-xxx`) and delete them at the end.
- Do not edit or delete **Ananya Ghosh** (`ananya.ghosh@example.com`); the duplicate-email test uses her.

**7. What to test (numbered)**
1. List opens: 24 enrolled, 10 rows, "Showing 1-10 of 24", dates like "April 2, 2024".
2. Search "ishita" finds 1; "zzzz" shows no results; Clear filters restores.
3. Grade 10 + Graduated filters; Reset; Sort by Name A to Z; Next and Previous pages.
4. Add student with valid values: toast, back on the list, the student is searchable.
5. Add student with nothing filled: every required message, nothing saved.
6. Add student with email `ananya.ghosh@example.com`: message on the Email field, typed values kept.
7. Open a student, then Edit: fields are pre-filled. Change name and attendance, then Save: the list shows the change.
8. Delete: Cancel keeps the student; Delete student removes it.
9. Open `/students/details/999999`: "Student not found".
10. Stop the API (or turn off the network) and open the list: error message + Try again.
11. Check every page at 1920, 1366, 768 and 375.
Full list: `docs/TEST-CASES.md` (37 cases).

**8. Known issues / not covered**
- Filters, page and sort are not kept in the URL. Going back from a details page resets them to the defaults.
- Search treats `%` and `_` as normal characters only partly (SQL `LIKE` wildcards are not escaped).
- No login or roles (out of scope for the homework).
- The WM Error Message List page is still a draft, so the messages are my own wording, identical in API and UI.
- Render free PostgreSQL expires 30 days after creation.

**9. Results** (real output pasted on the Notion page)
- Backend `./mvnw test`: [result]
- `npx tsc --noEmit`: clean · `npm run lint`: clean · `npm run build`: success
- Playwright: `test:e2e` 17 passed · `test:e2e:mutation` 3 passed · `qa:responsive` 30 passed

**10. Screen sizes and browsers checked**
- Widths: 1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375 (list, create, details): no sideways scroll, tap targets at least 24 px.
- Browser: Chromium (Playwright). Manual check in Chrome. Not checked: Safari, Firefox.
