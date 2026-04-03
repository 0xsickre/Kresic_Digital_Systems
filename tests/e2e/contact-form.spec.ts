import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("shows validation error when consent checkbox is unchecked", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.locator("#contact").evaluate((el) =>
      el.scrollIntoView({ block: "center", inline: "nearest" }),
    );

    const form = page.locator('form[aria-label="Contact form"]');
    await expect(form).toBeVisible({ timeout: 45_000 });

    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-service").selectOption("web_arch");
    await page
      .locator("#contact-message")
      .fill("E2E message with enough characters for validation.");

    await form.locator('button[type="submit"]').click();

    await expect(
      page.getByRole("status").filter({ hasText: /consent/i }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
