import { defineConfig, devices } from "@playwright/test";

// Frontend under test: local dev server by default, or the deployed demo via PLAYWRIGHT_BASE_URL
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? "http://localhost:3000";

// Mutation tests (create/edit/delete real data) run only when asked: E2E_MUTATION=1
const runMutation = process.env.E2E_MUTATION === "1";

// Optional: use an already-installed Chrome (set CHROME_PATH). Normally leave this unset.
const executablePath = process.env.CHROME_PATH;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: runMutation ? [] : ["**/*.mutation.spec.ts"],
  timeout: 60_000,
  fullyParallel: false,
  workers: 1, // tests share one database, so run them one at a time
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    launchOptions: executablePath ? { executablePath } : {},
    trace: "retain-on-failure",
  },
  // Starts the frontend automatically when testing locally. The Spring Boot API must already run on :8080.
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000/students/list",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
