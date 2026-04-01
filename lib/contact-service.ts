/**
 * Contact form "service" field — single source for values used in UI, Zod, and email routing.
 */
export const CONTACT_SERVICE_VALUES = [
  "web_arch",
  "three_js",
  "ai_automation",
  "security_audit",
  "data_quant",
  "other",
] as const;

export type ContactServiceValue = (typeof CONTACT_SERVICE_VALUES)[number];

/** Short ASCII tags for inbox filtering / subject lines. */
const SUBJECT_TAGS: Record<ContactServiceValue, string> = {
  web_arch: "Next/React",
  three_js: "WebGL",
  ai_automation: "AI/Auto",
  security_audit: "Sec/Audit",
  data_quant: "Quant",
  other: "Other",
};

export function contactServiceSubjectTag(value: ContactServiceValue): string {
  return SUBJECT_TAGS[value];
}
