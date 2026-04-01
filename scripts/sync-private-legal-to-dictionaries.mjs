/**
 * Učitava private-legal/*.html.example i upisuje htmlBody u dictionaries/*.json.
 * Pokretanje: node scripts/sync-private-legal-to-dictionaries.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadHtml(slug, locale) {
  const p = join(root, "private-legal", `${slug}.${locale}.html.example`);
  return readFileSync(p, "utf-8").trim();
}

const dePath = join(root, "dictionaries", "de.json");
const enPath = join(root, "dictionaries", "en.json");

const de = JSON.parse(readFileSync(dePath, "utf-8"));
const en = JSON.parse(readFileSync(enPath, "utf-8"));

de.datenschutz = { ...de.datenschutz, htmlBody: loadHtml("datenschutz", "de") };
de.impressum = { ...de.impressum, htmlBody: loadHtml("impressum", "de") };
en.datenschutz = { ...en.datenschutz, htmlBody: loadHtml("datenschutz", "en") };
en.impressum = { ...en.impressum, htmlBody: loadHtml("impressum", "en") };

writeFileSync(dePath, `${JSON.stringify(de, null, 2)}\n`, "utf-8");
writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf-8");

console.log("Updated dictionaries/de.json and dictionaries/en.json from private-legal/*.html.example");
