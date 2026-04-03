import { expect, test } from "@playwright/test";

test.describe("legal pages", () => {
  test("English Impressum renders", async ({ page }) => {
    await page.goto("/en/impressum");
    await expect(page).toHaveURL(/\/en\/impressum/);
    await expect(
      page.getByRole("heading", { name: "Site Notice", exact: true }),
    ).toBeVisible();
  });

  test("German Datenschutz renders", async ({ page }) => {
    await page.goto("/de/datenschutz");
    await expect(page).toHaveURL(/\/de\/datenschutz/);
    await expect(
      page.getByRole("heading", {
        name: "Datenschutzerklärung",
        exact: true,
      }),
    ).toBeVisible();
  });
});
