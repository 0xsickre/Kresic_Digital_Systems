import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  /**
   * A consent checkbox was removed deliberately: handling an enquiry rests on
   * Art. 6(1)(b)/(f) GDPR, so gating submission on consent made that consent
   * non-free under Art. 7(4) and contradicted the privacy policy. What the law
   * does require is the Art. 13 notice, which must stay reachable.
   */
  test("states the legal basis and links the privacy policy, without gating on consent", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await page.locator("#contact").evaluate((el) =>
      el.scrollIntoView({ block: "center", inline: "nearest" }),
    );

    const form = page.locator('form[aria-label="Contact form"]');
    await expect(form).toBeVisible({ timeout: 45_000 });

    await expect(form.locator('input[type="checkbox"]')).toHaveCount(0);
    await expect(form).toContainText("Art. 6(1)(b) and (f) GDPR");

    const privacyLink = form.getByRole("link", { name: "Privacy Policy" });
    await expect(privacyLink).toHaveAttribute("href", "/en/datenschutz");
    await expect(privacyLink).toHaveAttribute("target", "_blank");
  });
});
