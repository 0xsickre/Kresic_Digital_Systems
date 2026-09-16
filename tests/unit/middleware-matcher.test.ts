import { describe, expect, it } from "vitest";

import { config } from "@/middleware";

/**
 * The matcher decides which paths get a 308 into `/<locale>/…`. Everything it
 * does not exclude is treated as a page, and a fixed-path asset treated as a
 * page becomes a redirect to a URL that does not exist.
 *
 * This file exists because `/icon` was exactly that: adding `app/icon.tsx` gave
 * the site a favicon route the matcher had never heard of, so the browser's icon
 * request was redirected to `/de/icon` and 404'd. Nothing reported it — a
 * missing favicon looks like a blank tab, not like an error — and the 308 is
 * permanent, so a browser that saw it once kept redirecting itself afterwards.
 */
const matcher = config.matcher[0];
const pattern = new RegExp(`^${matcher}$`);

const runsMiddleware = (path: string) => pattern.test(path);

describe("middleware matcher", () => {
  it.each([
    ["/icon", "the generated favicon"],
    ["/favicon.ico", "the legacy favicon path"],
    ["/robots.txt", "robots"],
    ["/sitemap.xml", "the sitemap"],
    ["/_next/static/chunk.js", "build output"],
    ["/_next/image", "the image optimizer"],
  ])("leaves %s alone (%s)", (path) => {
    expect(runsMiddleware(path)).toBe(false);
  });

  it.each([["/"], ["/impressum"], ["/datenschutz"]])(
    "still localizes %s",
    (path) => {
      expect(runsMiddleware(path)).toBe(true);
    },
  );

  /**
   * Not excluded, and it must not be: it already carries a locale, so it passes
   * through the middleware body untouched rather than being matched out of it.
   */
  it("lets the locale-scoped OG image through the normal path", () => {
    expect(runsMiddleware("/en/opengraph-image")).toBe(true);
  });
});
