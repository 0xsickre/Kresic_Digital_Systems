import { expect, test } from "@playwright/test";

test.describe("navigation (desktop header)", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("primary nav links scroll to section anchors on /en", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" }).click();
    await expect(page.locator("#expertise")).toBeVisible();

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("header CTA points to contact section", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Request a project" }).first().click();
    await expect(page.locator("#contact-heading")).toBeVisible();
  });

  test("language switcher navigates from EN to DE", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const deButton = page.getByRole("button", { name: "DE", exact: true });
    await deButton.waitFor({ state: "visible", timeout: 30_000 });
    await deButton.click();
    await expect(page).toHaveURL(/\/de(\/|$)/);
    await expect(page.locator("#main")).toBeVisible();
  });
});
