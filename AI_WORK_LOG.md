# AI / agent work log

Chronological log of **substantive** changes driven by AI-assisted sessions on this repo.  
**Purpose:** before starting a new task, read the latest entries so new work stays consistent with prior decisions and does not regress fixed behaviour.

## How agents should use this file

1. **Start of task** — Read this file (at least the **Current conventions** section and the last **3–5** dated entries).
2. **End of task** — Append a new entry under **Log** with: date (ISO), short title, what changed (files/areas), intent, and anything the next session must not undo.
3. **Keep entries factual** — No secrets, no API keys, no paste of `.env`.

## Current conventions (do not contradict without explicit user approval)

- **Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind, RSC-first; `"use client"` only when needed.
- **i18n / SEO:** Locale routes under `app/[locale]/…`, `middleware.ts` sets `x-locale`, `withLocale()` for links, `generateMetadata` + `lib/seo.ts` for canonicals/hreflang; root layout sets `<html lang>` from header.
- **Content:** Marketing copy in `dictionaries/de.json` + `en.json`, typed via `dictionaries/types.ts`.
- **Performance:** Hero LCP path stays server-rendered where possible; heavy WebGL behind `dynamic` + `MountWhenVisible` / defer patterns in `components/landing/HeavyVisuals.tsx`, `HeroBackdrop`, etc.
- **Tooling:** `tsconfig` target **ES2022**; `package.json` **browserslist** for modern evergreen; `next.config.mjs` includes `optimizePackageImports` for `lucide-react`, `poweredByHeader: false`.
- **Accessibility:** Primary green CTAs use **`emerald-700`** (hover **`emerald-600`**) with white text for contrast — do not revert to `emerald-500`/`emerald-600` as default fill for small text buttons without checking WCAG.
- **Demo route:** `/demo/market-analytics` **removed**; third featured project card points to **`kds-quant-engine-showcase`**; no `liveDemo` / `demoCta` keys in dictionaries.
- **Licence:** Root **`LICENSE`** is MIT; README licence section matches (do not revert to “all rights reserved” on the codebase without user decision).
- **Git:** User runs commit/push locally unless they explicitly ask the agent to commit; agent proposes commit messages only (see `.cursor/rules/git-commits.mdc`).

## Log (newest first)

### 2026-04-03 — PageSpeed / Lighthouse (perf + a11y)

- **What:** WCAG contrast on primary emerald CTAs (`emerald-700` / hover `emerald-600`) in `LandingHeaderShellClient`, `LegalPageHeader`, skip link in `app/layout.tsx`. `tsconfig` → `ES2022`, `browserslist` in `package.json`, `next.config.mjs` `optimizePackageImports` + `poweredByHeader: false`. Removed unused `framer-motion`. `HeroTextIsland` + `HeroCopyMarkup` are RSC (dropped `"use client"`). README motion row simplified.
- **Why:** PSI ~69 performance, ~96 a11y (contrast on “Request a project”); reduce legacy polyfill pressure and main-thread hydration cost on hero path.
- **Do not undo:** Reverting hero components to client-only without cause; lightening CTA greens without contrast check.

### 2026-04-03 — GitHub: MIT licence

- **What:** Added `LICENSE` (MIT), `package.json` `"license": "MIT"`, README licence section updated with trademark/copy note.

### 2026-04-03 — Docs: README + REPAIR_LOG

- **What:** README aligned with removal of demo route and current stack; REPAIR_LOG supplement **CR1**, historical notes on C4/C5, path fixes for `app/[locale]/…`, O5/O7 wording.

### 2026-04-03 (earlier) — Remove demo terminal; quant card

- **What:** Deleted `app/demo/…`; middleware/sitemap/LanguageSwitcher/GlobalLegalFooter cleaned of `/demo`; nav + `LandingPage` demo CTA removed; dictionaries + types updated; third card → Headless Quant Engine copy + `https://github.com/Kresic1998/kds-quant-engine-showcase`.

---

*Add new entries above this line (newest first).*
