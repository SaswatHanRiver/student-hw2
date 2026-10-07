import { test, expect, type Page } from "@playwright/test";

// WM breakpoints, biggest to smallest
const WIDTHS = [1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375];
const HEIGHT = 900;
const MIN_TARGET_PX = 24; // WCAG 2.2 minimum target size

// Pages to check. Details uses the first student in the list.
const PAGES = [
  { name: "list", open: async (page: Page) => { await page.goto("/students/list"); await expect(page.getByTestId("state-filled")).toBeVisible(); } },
  { name: "create", open: async (page: Page) => { await page.goto("/students/create"); await page.getByRole("button", { name: "Add student" }).click(); await expect(page.getByText("Name is required.")).toBeVisible(); } },
  { name: "details", open: async (page: Page) => { await page.goto("/students/list"); await page.locator(".student-name-primary").first().click(); await expect(page.getByTestId("student-details")).toBeVisible(); } },
];

async function hasSidewaysScroll(page: Page): Promise<boolean> {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

for (const target of PAGES) {
  for (const width of WIDTHS) {
    test(`${target.name} @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await target.open(page);

      expect(await hasSidewaysScroll(page), "page scrolls sideways").toBe(false);

      const controls = page.locator("main button:visible, main input:visible, main select:visible, main a.btn:visible");
      const count = await controls.count();
      for (let index = 0; index < count; index++) {
        const box = await controls.nth(index).boundingBox();
        if (box) {
          expect(box.height, `control ${index} too short`).toBeGreaterThanOrEqual(MIN_TARGET_PX);
          expect(box.width, `control ${index} too narrow`).toBeGreaterThanOrEqual(MIN_TARGET_PX);
        }
      }

      await page.screenshot({ path: `screenshots/${target.name}/${target.name}-${width}.png`, fullPage: true });
    });
  }
}
