import { describe, expect, it } from "vitest";

import {
  CONTACT_SERVICE_VALUES,
  contactServiceSubjectTag,
  type ContactServiceValue,
} from "@/lib/contact-service";

describe("CONTACT_SERVICE_VALUES", () => {
  it("lists six stable service keys", () => {
    expect(CONTACT_SERVICE_VALUES).toHaveLength(6);
    expect(CONTACT_SERVICE_VALUES).toEqual([
      "web_arch",
      "three_js",
      "ai_automation",
      "security_audit",
      "data_quant",
      "other",
    ]);
  });
});

describe("contactServiceSubjectTag", () => {
  const cases: [ContactServiceValue, string][] = [
    ["web_arch", "Next/React"],
    ["three_js", "WebGL"],
    ["ai_automation", "AI/Auto"],
    ["security_audit", "Sec/Audit"],
    ["data_quant", "Quant"],
    ["other", "Other"],
  ];

  it.each(cases)("maps %s to %s", (value, expected) => {
    expect(contactServiceSubjectTag(value)).toBe(expected);
  });

  it("returns undefined for an invalid runtime value (caller bypasses TypeScript)", () => {
    expect(
      contactServiceSubjectTag("invalid" as ContactServiceValue),
    ).toBeUndefined();
  });
});
