import { z } from "zod";

import {
  CONTACT_SERVICE_VALUES,
  type ContactServiceValue,
} from "@/lib/contact-service";

const serviceEnum = z.enum(
  CONTACT_SERVICE_VALUES as unknown as [
    ContactServiceValue,
    ...ContactServiceValue[],
  ],
);

export const contactFormSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  service: serviceEnum,
  message: z.string().min(10).max(8000),
  consent: z.enum(["on", "true"]),
});

export type ContactFormParsed = z.infer<typeof contactFormSchema>;

export type ContactFormZodMessages = {
  serviceRequired: string;
  messageTooShort: string;
  nameTooShort: string;
  invalidEmail: string;
  consent: string;
  fillAll: string;
};

const ISSUE_PATH_PRIORITY = [
  "consent",
  "service",
  "name",
  "email",
  "message",
] as const;

/** Map Zod issues to one localized message (stable priority when multiple fields fail). */
export function contactFormZodUserMessage(
  issues: z.ZodIssue[],
  t: ContactFormZodMessages,
): string {
  for (const pathKey of ISSUE_PATH_PRIORITY) {
    const hit = issues.some((i) => i.path[0] === pathKey);
    if (!hit) continue;
    if (pathKey === "consent") return t.consent;
    if (pathKey === "service") return t.serviceRequired;
    if (pathKey === "name") return t.nameTooShort;
    if (pathKey === "email") return t.invalidEmail;
    if (pathKey === "message") return t.messageTooShort;
  }
  return t.fillAll;
}
