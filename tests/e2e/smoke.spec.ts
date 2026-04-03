import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("root redirects to a locale segment", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(de|en)\/?$/);
  });

  test("English home exposes main landmark", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#main")).toBeVisible();
  });

  test("German home exposes main landmark", async ({ page }) => {
    await page.goto("/de");
    await expect(page.locator("#main")).toBeVisible();
  });
});
