/**
 * Renders the legal pages to print-ready PDFs in `public/legal/`.
 *
 * The PDFs are built from the same `htmlBody` the site renders, so the download
 * and the page cannot drift apart. Run after `npm run sync:legal`:
 *   node scripts/generate-legal-pdfs.mjs
 *
 * Set CHROMIUM_PATH when Playwright's bundled browser is not installed.
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { chromium } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "legal");

const DICTS = {
  de: JSON.parse(readFileSync(join(root, "dictionaries", "de.json"), "utf-8")),
  en: JSON.parse(readFileSync(join(root, "dictionaries", "en.json"), "utf-8")),
};

const DOCS = [
  { slug: "impressum", file: "impressum" },
  { slug: "datenschutz", file: "datenschutzerklaerung" },
  { slug: "widerruf", file: "widerrufsbelehrung" },
  { slug: "agb", file: "allgemeine_geschaeftsbedingungen" },
];

const BRAND = "Kresic Digital Systems";
const OWNER = "Danijel Kresic";

function page(locale, title, body) {
  const generated = new Date().toISOString().slice(0, 10);
  const standLabel = locale === "de" ? "Stand" : "Last updated";
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  @page { size: A4; margin: 20mm 18mm 18mm 18mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #111;
  }
  .doc-head { border-bottom: 1.5pt solid #111; padding-bottom: 8pt; margin-bottom: 18pt; }
  .brand { font-size: 12pt; font-weight: 700; letter-spacing: 0.02em; }
  .owner { font-size: 9.5pt; color: #444; margin-top: 2pt; }
  .stand { font-size: 8.5pt; color: #666; margin-top: 6pt; }
  h1 { font-size: 17pt; margin: 0 0 12pt; line-height: 1.25; }
  h2 { font-size: 12.5pt; margin: 18pt 0 6pt; padding-bottom: 3pt; border-bottom: 0.5pt solid #ccc; }
  h3 { font-size: 11pt; margin: 14pt 0 4pt; }
  h4 { font-size: 10.5pt; margin: 12pt 0 3pt; }
  p { margin: 0 0 8pt; }
  ul { margin: 0 0 8pt; padding-left: 16pt; }
  li { margin-bottom: 3pt; }
  a { color: #111; text-decoration: underline; }
  h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
  p, li { orphans: 2; widows: 2; }
</style>
</head>
<body>
  <div class="doc-head">
    <div class="brand">${BRAND}</div>
    <div class="owner">${OWNER}</div>
    <div class="stand">${standLabel}: ${generated}</div>
  </div>
  ${body}
</body>
</html>`;
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

for (const { slug, file } of DOCS) {
  for (const locale of ["de", "en"]) {
    const entry = DICTS[locale][slug];
    const html = page(locale, entry.title, entry.htmlBody.trim());
    const p = await browser.newPage();
    await p.setContent(html, { waitUntil: "load" });
    const out = join(outDir, `${file}_kresic_digital_systems_${locale}.pdf`);
    await p.pdf({
      path: out,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `<div style="width:100%;font-size:7.5pt;color:#777;padding:0 18mm;display:flex;justify-content:space-between;">
        <span>${BRAND} — ${entry.title}</span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`,
      margin: { top: "20mm", right: "18mm", bottom: "18mm", left: "18mm" },
    });
    await p.close();
    console.log(`wrote public/legal/${file}_kresic_digital_systems_${locale}.pdf`);
  }
}

await browser.close();
