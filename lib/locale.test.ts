import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
  withLocale,
} from "@/lib/locale";

describe("LOCALES / DEFAULT_LOCALE / LOCALE_COOKIE", () => {
  it("exposes exactly de and en in stable order", () => {
    expect(LOCALES).toEqual(["de", "en"]);
  });

  it("defaults to German per product convention", () => {
    expect(DEFAULT_LOCALE).toBe("de");
  });

  it("uses a fixed cookie name for locale persistence", () => {
    expect(LOCALE_COOKIE).toBe("NEXT_LOCALE");
  });
});

describe("isLocale", () => {
  describe("happy path", () => {
    it.each(["de", "en"] as const)("accepts %s", (code) => {
      expect(isLocale(code)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("rejects empty string", () => {
      expect(isLocale("")).toBe(false);
    });

    it("rejects case variants (strict equality)", () => {
      expect(isLocale("DE")).toBe(false);
      expect(isLocale("EN")).toBe(false);
      expect(isLocale("De")).toBe(false);
    });

    it("rejects locale tags with region", () => {
      expect(isLocale("de-DE")).toBe(false);
      expect(isLocale("en-US")).toBe(false);
    });

    it("rejects whitespace-padded strings", () => {
      expect(isLocale(" de")).toBe(false);
      expect(isLocale("en ")).toBe(false);
    });

    it("rejects other ISO-like codes", () => {
      expect(isLocale("fr")).toBe(false);
      expect(isLocale("sr")).toBe(false);
    });

    it("rejects very long garbage strings", () => {
      expect(isLocale("x".repeat(10_000))).toBe(false);
    });
  });

  describe("unexpected runtime types (caller bypasses TypeScript)", () => {
    it("returns false for null (Array.includes does not match)", () => {
      expect(isLocale(null as unknown as string)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isLocale(undefined as unknown as string)).toBe(false);
    });

    it("returns false for a number", () => {
      expect(isLocale(1 as unknown as string)).toBe(false);
    });

    it("returns false for object that stringifies to de (reference equality only)", () => {
      const boxed = { toString: () => "de" } as unknown as string;
      expect(isLocale(boxed)).toBe(false);
    });
  });
});

describe("withLocale", () => {
  describe("happy path", () => {
    it("maps root path to /{locale}", () => {
      expect(withLocale("en", "/")).toBe("/en");
      expect(withLocale("de", "/")).toBe("/de");
    });

    it("prefixes absolute paths", () => {
      expect(withLocale("en", "/impressum")).toBe("/en/impressum");
      expect(withLocale("de", "/datenschutz")).toBe("/de/datenschutz");
    });

    it("normalizes paths without a leading slash", () => {
      expect(withLocale("en", "impressum")).toBe("/en/impressum");
    });
  });

  describe("edge cases", () => {
    it("treats empty string as root", () => {
      expect(withLocale("en", "")).toBe("/en");
    });

    it("preserves nested segments", () => {
      expect(withLocale("de", "/legal/terms")).toBe("/de/legal/terms");
    });

    it("does not collapse duplicate slashes in the path tail (caller responsibility)", () => {
      expect(withLocale("en", "//oops")).toBe("/en//oops");
    });

    it("handles single-segment paths", () => {
      expect(withLocale("de", "/x")).toBe("/de/x");
    });
  });

  describe("unexpected data (still returns a string)", () => {
    it("prefixes locale even when path looks like a URL (no validation)", () => {
      expect(withLocale("en", "https://evil.example")).toBe(
        "/en/https://evil.example",
      );
    });
  });

  describe("error handling", () => {
    it("throws when path is null (startsWith on non-string)", () => {
      expect(() => withLocale("en", null as unknown as string)).toThrow();
    });

    it("throws when path is undefined", () => {
      expect(() => withLocale("de", undefined as unknown as string)).toThrow();
    });
  });
});
