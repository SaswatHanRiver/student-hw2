import { test, expect } from "@playwright/test";

// CREATES, EDITS AND DELETES real data. Does not run by default.
// Run with: npm run test:e2e:mutation   (never against a shared/staging API without telling the team)
// It cleans up after itself: the student it creates is deleted at the end.

// Unique per run, so re-running never collides with old data
const runNumber = String(Date.now() % 1000).padStart(3, "0");
const STUDENT_CODE = `STU-2099-${runNumber}`;
const EMAIL = `e2e.student.${Date.now()}@example.com`;
const NAME = "E2E Test Student";
const EDITED_NAME = "E2E Test Student Edited";

test.describe.configure({ mode: "serial" });

test("create, see it in the list, edit, see the change, delete, gone", async ({ page }) => {
  // 1. Create
  await page.goto("/students/create");
  await page.getByLabel("Student ID").fill(STUDENT_CODE);
  await page.getByLabel("Name").fill(NAME);
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Grade").selectOption("8");
  await page.getByLabel("Joined on").fill("2025-04-01");
  await page.getByLabel("Attendance (%)").fill("88");
  await page.getByLabel("Status").selectOption("ACTIVE");
  const save = page.getByRole("button", { name: "Add student" });
  await save.click();

  // Toast, back on the list
  await expect(page.getByTestId("toast")).toHaveText(`${NAME} was added.`);
  await expect(page).toHaveURL(/\/students\/list$/);

  // 2. Shows in the list
  await page.getByLabel("Search").fill(STUDENT_CODE);
  await expect(page.getByText("Showing 1-1 of 1")).toBeVisible();
  await page.getByRole("link", { name: NAME }).click();
  await expect(page.getByRole("heading", { level: 1, name: NAME })).toBeVisible();

  // 3. Edit: form is filled with the saved values
  await page.getByRole("link", { name: "Edit" }).click();
  await expect(page.getByLabel("Name")).toHaveValue(NAME);
  await expect(page.getByLabel("Email")).toHaveValue(EMAIL);
  await expect(page.getByLabel("Attendance (%)")).toHaveValue("88");
  await page.getByLabel("Name").fill(EDITED_NAME);
  await page.getByLabel("Attendance (%)").fill("70");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByTestId("toast")).toHaveText(`Changes to ${EDITED_NAME} were saved.`);

  // 4. The change shows in the list
  await page.getByLabel("Search").fill(STUDENT_CODE);
  await expect(page.getByRole("link", { name: EDITED_NAME })).toBeVisible();
  await expect(page.getByTestId("state-filled").getByText("70%")).toBeVisible();

  // 5. Delete (with confirmation)
  await page.getByRole("link", { name: EDITED_NAME }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("dialog", { name: `Delete ${EDITED_NAME}?` })).toBeVisible();
  await page.getByRole("button", { name: "Delete student" }).click();
  await expect(page.getByTestId("toast")).toHaveText(`${EDITED_NAME} was deleted.`);

  // 6. Gone from the list
  await page.getByLabel("Search").fill(STUDENT_CODE);
  await expect(page.getByTestId("state-no-results")).toBeVisible();
});

test("duplicate email from the server shows on the email field and keeps what was typed", async ({ page }) => {
  await page.goto("/students/create");
  await page.getByLabel("Student ID").fill(`STU-2098-${runNumber}`);
  await page.getByLabel("Name").fill("Duplicate Email Check");
  await page.getByLabel("Email").fill("ananya.ghosh@example.com"); // seed student
  await page.getByLabel("Grade").selectOption("7");
  await page.getByLabel("Joined on").fill("2025-04-01");
  await page.getByLabel("Attendance (%)").fill("90");
  await page.getByRole("button", { name: "Add student" }).click();

  await expect(page.getByTestId("form-server-error")).toHaveText("This email is already used by another student.");
  await expect(page.locator("#student-email-error")).toHaveText("This email is already used by another student.");
  await expect(page.getByLabel("Name")).toHaveValue("Duplicate Email Check");
  await expect(page).toHaveURL(/\/students\/create$/);
});

test("submit button is disabled while saving (no double submit)", async ({ page }) => {
  let posts = 0;
  await page.route("**/api/v1/students", async (route) => {
    if (route.request().method() === "POST") {
      posts += 1;
      // Hold the request so we can click again while it is in flight, then send a validation error back
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ code: "VALIDATION_FAILED", message: "Please check the highlighted fields.", fieldErrors: [{ field: "fullName", message: "Name must be 2 to 50 characters." }] }),
      });
      return;
    }
    await route.continue();
  });
  await page.goto("/students/create");
  await page.getByLabel("Student ID").fill(`STU-2097-${runNumber}`);
  await page.getByLabel("Name").fill("Double Click");
  await page.getByLabel("Email").fill(`double.${Date.now()}@example.com`);
  await page.getByLabel("Grade").selectOption("6");
  await page.getByLabel("Joined on").fill("2025-04-01");
  await page.getByLabel("Attendance (%)").fill("50");
  await page.getByRole("button", { name: "Add student" }).click();
  await expect(page.getByRole("button", { name: "Saving..." })).toBeDisabled();
  await page.getByRole("button", { name: "Saving..." }).click({ force: true });
  await expect(page.locator("#student-fullName-error")).toHaveText("Name must be 2 to 50 characters.");
  expect(posts).toBe(1);
});
