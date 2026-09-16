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

  test("German Widerrufsbelehrung renders", async ({ page }) => {
    await page.goto("/de/widerruf");
    await expect(page).toHaveURL(/\/de\/widerruf/);
    await expect(
      page.getByRole("heading", { name: "Widerrufsbelehrung", exact: true }),
    ).toBeVisible();
  });

  /**
   * The terms are split into three parts and only Part A binds everyone, so the
   * consumer and business headings are asserted too: a build that silently
   * dropped one would leave the other applying to a reader it was never
   * written for.
   */
  test("German AGB renders all three parts", async ({ page }) => {
    await page.goto("/de/agb");
    await expect(page).toHaveURL(/\/de\/agb/);
    await expect(
      page.getByRole("heading", {
        name: "Allgemeine Geschäftsbedingungen",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Teil A/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Teil B/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Teil C/ }),
    ).toBeVisible();
  });

  test("English AGB keeps the German version authoritative", async ({
    page,
  }) => {
    await page.goto("/en/agb");
    await expect(
      page.getByRole("heading", {
        name: "General Terms and Conditions",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator("main, body")).toContainText(
      "the German version is authoritative",
    );
  });
});
