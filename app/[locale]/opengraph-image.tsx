import { ImageResponse } from "next/og";

import { isLocale } from "@/lib/locale";
import { BRAND_NAME, OWNER_NAME } from "@/lib/site";

/**
 * The card people see when the site is pasted into LinkedIn, Slack or an email.
 *
 * Before this file `openGraph` carried a title and a description and no image at
 * all, so a shared link rendered as a bare row of text — the one place where a
 * B2B site is judged before it is opened.
 *
 * Generated per locale rather than shipped as one PNG: the tagline is the half
 * that has to change between DE and EN, and a static image would freeze it in
 * one language. No custom font is loaded — the local woff2 is a three-glyph
 * subset cut for the `KDS` wordmark, so it cannot set this copy, and Satori's
 * default face is used instead.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND_NAME} — B2B & FinTech Engineering`;

const TAGLINE = {
  de: "Skalierbare B2B-Webanwendungen, quantitative Datenpipelines und Enterprise-Architektur.",
  en: "Scalable B2B web applications, quantitative data pipelines, and enterprise architecture.",
} as const;

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function OpengraphImage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "de";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070b14",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 30, color: "#34d399", fontWeight: 700 }}>
            [
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#f1f5f9",
              fontWeight: 700,
              letterSpacing: 8,
            }}
          >
            KDS
          </div>
          <div style={{ fontSize: 30, color: "#34d399", fontWeight: 700 }}>
            ]
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.1,
            }}
          >
            {BRAND_NAME}
          </div>
          <div style={{ display: "flex", width: 120, height: 5, marginTop: 28, background: "#34d399" }} />
          <div
            style={{
              fontSize: 30,
              color: "#94a3b8",
              marginTop: 28,
              lineHeight: 1.4,
            }}
          >
            {TAGLINE[locale]}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#94a3b8" }}>
          <div style={{ display: "flex" }}>{OWNER_NAME}</div>
          <div style={{ display: "flex", color: "#34d399" }}>kresicds.com</div>
        </div>
      </div>
    ),
    size,
  );
}
