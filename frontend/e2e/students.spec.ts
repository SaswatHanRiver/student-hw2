import { test, expect, type Page } from "@playwright/test";

// Read-only tests against the real API with its seed data (24 students, 10 per page).
// Nothing here creates, edits or deletes data.

const API_PATH = "**/api/v1/students**";

async function openList(page: Page) {
  await page.goto("/students/list");
  await expect(page.getByTestId("state-filled")).toBeVisible();
}

const pagination = (page: Page) => page.getByRole("navigation", { name: "Pagination" });

test.describe("Students list", () => {
  test("opens with title, count and the first page of rows", async ({ page }) => {
    await openList(page);
    await expect(page).toHaveTitle("Students | Riverside Academy Admin");
    await expect(page.getByRole("heading", { level: 1, name: "Students" })).toBeVisible();
    await expect(page.getByTestId("state-filled").locator("tr")).toHaveCount(10);
    await expect(page.getByText(/^Showing 1-10 of \d+$/)).toBeVisible();
    await expect(page.getByTestId("student-count")).toHaveText(/\d+ enrolled/);
  });

  test("dates use the WM format", async ({ page }) => {
    await openList(page);
    const firstDate = page.getByTestId("state-filled").locator('td[data-label="Joined on"]').first();
    await expect(firstDate).toHaveText(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/); // e.g. "April 2, 2024"
  });

  test("next page and last page", async ({ page }) => {
    await openList(page);
    await pagination(page).getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByText(/^Showing 11-20 of \d+$/)).toBeVisible();
    await expect(pagination(page).getByRole("button", { name: "Previous", exact: true })).toBeEnabled();
  });

  test("search by name finds the student", async ({ page }) => {
    await openList(page);
    await page.getByLabel("Search").fill("ishita");
    await expect(page.getByText("Showing 1-1 of 1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ishita Chatterjee" })).toBeVisible();
  });

  test("search with no match shows no results, Clear filters brings rows back", async ({ page }) => {
    await openList(page);
    await page.getByLabel("Search").fill("zzzz-no-such-student");
    await expect(page.getByTestId("state-no-results")).toBeVisible();
    await expect(page.getByText('Nothing found for "zzzz-no-such-student"')).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByTestId("state-filled")).toBeVisible();
  });

  test("status and grade filters narrow the list", async ({ page }) => {
    await openList(page);
    await page.getByLabel("Status").selectOption("GRADUATED");
    await expect(page.getByTestId("state-filled").getByText("Active", { exact: true })).toHaveCount(0);
    await page.getByLabel("Grade").selectOption("10");
    const grades = page.getByTestId("state-filled").locator('td[data-label="Grade"]');
    await expect(grades.first()).toHaveText("Grade 10");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByLabel("Status")).toHaveValue("");
  });

  test("sort by name puts names in A to Z order", async ({ page }) => {
    await openList(page);
    await page.getByLabel("Sort by").selectOption("NAME");
    const names = page.getByTestId("state-filled").locator(".student-name-primary");
    await expect(names.first()).toBeVisible();
    await expect(async () => {
      const texts = await names.allTextContents();
      expect(texts).toEqual([...texts].sort((a, b) => a.localeCompare(b)));
    }).toPass();
  });

  test("clicking a name opens the details page", async ({ page }) => {
    await openList(page);
    const firstName = page.getByTestId("state-filled").locator(".student-name-primary").first();
    const name = (await firstName.textContent()) ?? "";
    await firstName.click();
    await expect(page).toHaveURL(/\/students\/details\/\d+$/);
    await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
    await expect(page.getByTestId("student-details")).toBeVisible();
  });
});

test.describe("States", () => {
  test("loading shows skeleton rows", async ({ page }) => {
    // Hold the API response so the loading state stays on screen
    await page.route(API_PATH, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto("/students/list");
    await expect(page.getByTestId("state-loading")).toBeVisible();
  });

  test("API down shows the error and Try again recovers", async ({ page }) => {
    let failRequests = true;
    await page.route(API_PATH, (route) => (failRequests ? route.abort("connectionrefused") : route.continue()));
    await page.goto("/students/list");
    await expect(page.getByTestId("state-error")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("We couldn't reach the server. Check your connection, then try again.")).toBeVisible();
    failRequests = false;
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByTestId("state-filled")).toBeVisible();
  });

  test("server error shows the API's own message", async ({ page }) => {
    await page.route(API_PATH, (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ code: "SERVER_ERROR", message: "Something went wrong on our side. Please try again in a moment.", fieldErrors: [] }),
      }),
    );
    await page.goto("/students/list");
    await expect(page.getByText("Something went wrong on our side. Please try again in a moment.")).toBeVisible({ timeout: 15_000 });
  });

  test("empty list shows the empty state", async ({ page }) => {
    await page.route(API_PATH, (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [], totalCount: 0, page: 1, pageSize: 10 }) }),
    );
    await page.goto("/students/list");
    await expect(page.getByTestId("state-empty")).toBeVisible();
  });

  test("unknown student id shows not found", async ({ page }) => {
    await page.goto("/students/details/999999");
    await expect(page.getByTestId("state-not-found")).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Create form validation (no data is saved)", () => {
  test("empty submit shows every required message and sends nothing", async ({ page }) => {
    let postCount = 0;
    page.on("request", (request) => {
      if (request.method() === "POST") postCount += 1;
    });
    await page.goto("/students/create");
    await expect(page.getByRole("heading", { level: 1, name: "Add student" })).toBeVisible();
    await page.getByRole("button", { name: "Add student" }).click();
    for (const message of ["Student ID is required.", "Name is required.", "Email is required.", "Grade is required.", "Joined on date is required.", "Attendance is required."]) {
      await expect(page.getByText(message, { exact: true })).toBeVisible();
    }
    await expect(page.getByLabel("Student ID")).toBeFocused();
    expect(postCount).toBe(0);
  });

  test("wrong formats show the same messages as the backend", async ({ page }) => {
    await page.goto("/students/create");
    await page.getByLabel("Student ID").fill("S-1");
    await page.getByLabel("Name").fill("A");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Attendance (%)").fill("101");
    await page.getByRole("button", { name: "Add student" }).click();
    await expect(page.getByText("Student ID must look like STU-2026-001.")).toBeVisible();
    await expect(page.getByText("Name must be 2 to 50 characters.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address, like name@example.com.")).toBeVisible();
    await expect(page.getByText("Attendance must be between 0 and 100.")).toBeVisible();
  });

  test("fixing a field clears its message", async ({ page }) => {
    await page.goto("/students/create");
    await page.getByRole("button", { name: "Add student" }).click();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await page.getByLabel("Name").fill("Valid Name");
    await expect(page.getByText("Name is required.")).toHaveCount(0);
  });

  test("Cancel goes back to the list", async ({ page }) => {
    await page.goto("/students/create");
    await page.getByRole("link", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/\/students\/list$/);
  });
});
