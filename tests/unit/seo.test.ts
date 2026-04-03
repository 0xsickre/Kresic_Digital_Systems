import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { alternatesForLocale, homeMetadata, siteBaseUrl } from "@/lib/seo";

describe("siteBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns default when NEXT_PUBLIC_SITE_URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    expect(siteBaseUrl()).toBe("https://kresic.digital");
  });

  it("strips a single trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kresicds.com/");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("preserves URLs without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://kresicds.com");
    expect(siteBaseUrl()).toBe("https://kresicds.com");
  });

  it("normalizes path without leading slash via env (still valid origin)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
    expect(siteBaseUrl()).toBe("https://example.test");
  });
});

describe("alternatesForLocale", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds canonical and hreflang for home path", () => {
    const a = alternatesForLocale("en", "/");
    expect(a?.canonical).toBe("https://example.test/en");
    expect(a?.languages?.de).toBe("https://example.test/de");
    expect(a?.languages?.en).toBe("https://example.test/en");
    expect(a?.languages?.["x-default"]).toBe("https://example.test/de");
  });

  it("prefixes a nested path for both locales and x-default (German)", () => {
    const a = alternatesForLocale("de", "/impressum");
    expect(a?.canonical).toBe("https://example.test/de/impressum");
    expect(a?.languages?.de).toBe("https://example.test/de/impressum");
    expect(a?.languages?.en).toBe("https://example.test/en/impressum");
    expect(a?.languages?.["x-default"]).toBe(
      "https://example.test/de/impressum",
    );
  });

  it("normalizes pathname without a leading slash", () => {
    const a = alternatesForLocale("en", "datenschutz");
    expect(a?.canonical).toBe("https://example.test/en/datenschutz");
  });
});

describe("homeMetadata", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns absolute title and Open Graph locale for English", () => {
    const m = homeMetadata("en");
    expect(m.title).toEqual({
      absolute: "Kresic Digital Systems — B2B & FinTech Engineering",
    });
    expect(m.openGraph?.locale).toBe("en_US");
    expect(m.alternates?.canonical).toBe("https://example.test/en");
  });

  it("uses German Open Graph locale for de", () => {
    const m = homeMetadata("de");
    expect(m.openGraph?.locale).toBe("de_DE");
    expect(m.alternates?.canonical).toBe("https://example.test/de");
  });
});
