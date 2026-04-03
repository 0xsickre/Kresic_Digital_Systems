# AI / agent work log

Chronological log of **substantive** changes driven by AI-assisted sessions on this repo.  
**Purpose:** before starting a new task, read the latest entries so new work stays consistent with prior decisions and does not regress fixed behaviour.

**Version control:** This file is **tracked in Git** and pushed with the repo so every clone has the same continuity context. **`REPAIR_LOG.md`** is reserved for **major** repairs, audits, and milestone fixes that should stand out for readers; routine agent work is logged **here only** (see Current conventions).

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
- **Licence:** Root **`LICENSE`** is MIT; README licence section matches (do not revert to "all rights reserved" on the codebase without user decision).
- **Git:** User runs commit/push locally unless they explicitly ask the agent to commit; after each completed task the agent outputs a **copy-paste** block: **`cd` to repo root** → **`git status`** → **`git add .`** → **`git commit -m …`** (see `.cursor/rules/git-commit-suggestions.mdc`).
- **Issue drafts:** Paste-ready GitHub/GitLab text: **title** and **body** in **separate** fenced code blocks (see `.cursor/rules/github-issue-drafts.mdc`).
- **Code language:** Identifiers, comments, and technical strings in source files must be **English**; user-facing copy stays in `dictionaries/` (see `.cursor/rules/code-language-english.mdc`).
- **Agent rules:** `.cursor/rules/` contains 7 `.mdc` files (`alwaysApply: true`): `engineering-standards`, `security-performance`, `project-conventions`, `code-language-english`, `git-commit-suggestions`, `github-issue-drafts`, `ai-work-log-protocol`.
- **Logs:** **`AI_WORK_LOG.md`** — routine substantive AI/agent changes; commit and push with the repo. **`REPAIR_LOG.md`** — use **only for larger / highlighted** work (major fixes, audits, milestones worth calling out); do not duplicate every small task there.

## Log (newest first)

### 2026-04-03 — Security: optional SRI for deferred third-party script; HSTS note

- **What:** `components/DeferredThirdPartyScripts.tsx` — when `NEXT_PUBLIC_DEFERRED_SCRIPT_INTEGRITY` is set (with `NEXT_PUBLIC_DEFERRED_SCRIPT_SRC`), pass `integrity` and `crossOrigin="anonymous"` to `next/script`. `.env.example` — document the new variable. `next.config.mjs` — comment that current HSTS is preload-eligible and points to hstspreload.org.
- **Why:** Scanners suggest SRI for external scripts; Next.js app bundles are same-origin and impractical for SRI. Optional env keeps analytics URLs verifiable when the provider documents a hash.

### 2026-04-03 — SEO: shorten site / OG titles to 50 chars (social preview)

- **What:** `lib/seo.ts` — home `title` for `en` and `de` set to `Kresic Digital Systems — B2B & FinTech Engineering` (50 characters). `app/layout.tsx` — `siteTitle` and default `openGraph.title` aligned with the same string.
- **Why:** Share previews flagged titles over 60 characters (DE was 64 with “B2B Software, FinTech & Web Engineering”); optimal band is ~50–60. Shorter title avoids truncation in Facebook / WhatsApp cards.
- **Do not undo:** Do not lengthen home `title` past ~60 characters without re-checking OG debuggers.

### 2026-04-03 — perf: reduce Three.js TBT on desktop (PSI 67 → targeting 90+)

- **What:** Increased `DeferHeavyChild` hero delay from 650ms to 1800ms; set desktop floor to 1800ms and mobile floor to 2000ms (`DeferMount.tsx`). Reduced `MountWhenVisible` `rootMargin` from `100px` to `0px` for project card visuals (`LandingPage.tsx`). Removed `Raycaster`/`Plane`/`Vector3`/`Vector2` from `InfrastructureGrid.tsx` and `Vector2` from `HeroVisual.tsx` — replaced with simple pointer math (~6 KB raw savings). Added `"three"` to `optimizePackageImports` in `next.config.mjs`.
- **Why:** PageSpeed Insights desktop showed TBT of 5,730ms (20 long tasks from Three.js chunk). Root cause: on desktop, `delayMs=650` let Three.js load inside the FCP→TTI window. Mobile was fine (210ms) because of the 1280ms mobile floor + 4G throttle. Pushing init past the TBT window on desktop is the primary fix.
- **Files:** `components/DeferMount.tsx`, `components/HeroBackdrop.tsx`, `components/HeroVisual.tsx`, `components/InfrastructureGrid.tsx`, `components/LandingPage.tsx`, `next.config.mjs`.
- **Do not undo:** Desktop deferral floor of 1800ms — reverting to 650ms re-introduces the TBT regression on desktop Lighthouse runs.

### 2026-04-03 — Log split: `AI_WORK_LOG` always committed; `REPAIR_LOG` for major work only

- **What:** `AI_WORK_LOG.md` — document that this file is tracked in Git; **Current conventions** — `REPAIR_LOG.md` only for larger/highlighted repairs going forward. `REPAIR_LOG.md` — forward-looking scope note at top. `.cursor/rules/ai-work-log-protocol.mdc` — version-control + `REPAIR_LOG` vs `AI_WORK_LOG` rules.
- **Why:** One continuous agent log in Git; repair log stays a showcase for major milestones, not a duplicate of every task.

### 2026-04-03 — `.gitignore`: track `.cursor/commands/` for GitHub

- **What:** `.gitignore` — add `!.cursor/commands/` and `!.cursor/commands/**` alongside existing `.cursor/rules/**` exceptions so slash commands (e.g. `autoreview.md`) are not ignored.
- **Why:** Only `rules/` was un-ignored; `commands/` stayed under `.cursor/*` and could not be committed.

### 2026-04-03 — ai-work-log-protocol: create `AI_WORK_LOG.md` if missing

- **What:** `.cursor/rules/ai-work-log-protocol.mdc` — if `AI_WORK_LOG.md` is absent at repo root, create it before substantive work (minimal template: purpose, how-to, Current conventions placeholder, Log section).
- **Why:** Universal projects may not have the log yet; agents must bootstrap continuity without skipping the protocol.

### 2026-04-03 — Cursor rules overhaul (Senior / Staff level)

- **What:** Reorganised `.cursor/rules/` into multiple focused `.mdc` files, including `engineering-standards`, `security-performance`, `project-conventions`, `code-language-english`, `git-commit-suggestions`, `github-issue-drafts`, and later `ai-work-log-protocol`. All `alwaysApply: true`.
- **Why:** Previous 3 rules covered only formatting/git; no architecture, security, or performance guidance existed as enforced rules.
- **Do not undo:** Removing `engineering-standards` or `security-performance` would drop the baseline quality bar below Senior level.

### 2026-04-03 — Git: version `.cursor/rules/*.mdc` (stop ignoring whole `.cursor/`)

- **What:** `.gitignore` — replace blanket `.cursor/` with `.cursor/*` plus negation for `!.cursor/rules/**`; add `code-language-english.mdc`, `github-issue-drafts.mdc`, `git-commit-suggestions.mdc` to the repo.
- **Why:** `.cursor/` was fully ignored, so `git add .` never staged rule files; commits could describe `.mdc` changes that were not actually in Git.

### 2026-04-03 — Cursor rule: commit block must `cd` to repo root then `git status` before `git add .`

- **What:** `.cursor/rules/git-commit-suggestions.mdc` — copy-paste order: `cd <repo root>` → `git status` → `git add .` → `git commit`; avoids wrong subtree when shell cwd is not the repo root.
- **Why:** `git add .` only affects the current directory.

### 2026-04-03 — Cursor rule: suggested commit always uses `git add .`

- **What:** `.cursor/rules/git-commit-suggestions.mdc` — staging must be **`git add .`** only; do not list individual paths in the suggested command.
- **Why:** Single copy-paste habit from repo root; user runs `git status` if they need to exclude files.

### 2026-04-03 — Cursor rule: copy-paste commit command after completed work

- **What:** Added `.cursor/rules/git-commit-suggestions.mdc` (`alwaysApply: true`) — after each substantive completed task, provide a single fenced block with `git add .` + `git commit -m …` ready to paste; no `git push` unless user asked.
- **Why:** One-step copy from chat into terminal; aligns with English conventional subjects.

### 2026-04-03 — Cursor rule: English-only in source code

- **What:** Added `.cursor/rules/code-language-english.mdc` (`alwaysApply: true`) — mandatory English for code identifiers, comments, and dev-facing strings; locale copy remains in `dictionaries/`.
- **Why:** Consistent codebase and tooling; i18n stays in JSON, not ad hoc strings in components.

### 2026-04-03 — Cursor rule: issue drafts — title + body in separate code blocks

- **What:** `.cursor/rules/github-issue-drafts.mdc` — issue **title** in one fenced block (title field only), **body** in a second block (description); do not merge title into the body block.
- **Why:** One-click copy per field; title stays distinct from checklist markdown.
- **Do not undo:** Keep `alwaysApply` unless the team prefers opt-in globs.

### 2026-04-03 — Featured work cards: CTA spacing when tags wrap

- **What:** `components/LandingPage.tsx` — wrap role→tags in `flex min-h-0 flex-1 flex-col`; CTA blocks use `mt-6 shrink-0` (replaces `mt-auto` on links). Tag row: `mt-6` and `gap-x-2 gap-y-2.5` for wrapped rows.
- **Why:** `margin-top: auto` on the CTA collapsed to **0** when the flex column had no leftover space (long copy + two tag rows), so buttons sat flush against tags.
- **Do not undo:** Do not revert CTA to `mt-auto` without a guaranteed minimum gap (e.g. `mt-6` or padding on a dedicated footer slot).

### 2026-04-03 — SEO: home `<title>` duplicate brand suffix

- **What:** `lib/seo.ts` — `homeMetadata()` sets `title: { absolute: h.title }` because root layout uses `metadata.title.template` (`%s · ${BRAND_NAME}`) and `h.title` already ends with the brand.
- **Why:** Tab title was `… · Kresic Digital Systems · Kresic Digital Systems` on `/en` and `/de`.
- **Do not undo:** Removing `absolute` on home without changing root template or `h.title` will regress duplicate suffix.

### 2026-04-03 — PageSpeed / Lighthouse (perf + a11y)

- **What:** WCAG contrast on primary emerald CTAs (`emerald-700` / hover `emerald-600`) in `LandingHeaderShellClient`, `LegalPageHeader`, skip link in `app/layout.tsx`. `tsconfig` → `ES2022`, `browserslist` in `package.json`, `next.config.mjs` `optimizePackageImports` + `poweredByHeader: false`. Removed unused `framer-motion`. `HeroTextIsland` + `HeroCopyMarkup` are RSC (dropped `"use client"`). README motion row simplified.
- **Why:** PSI ~69 performance, ~96 a11y (contrast on "Request a project"); reduce legacy polyfill pressure and main-thread hydration cost on hero path.
- **Do not undo:** Reverting hero components to client-only without cause; lightening CTA greens without contrast check.

### 2026-04-03 — GitHub: MIT licence

- **What:** Added `LICENSE` (MIT), `package.json` `"license": "MIT"`, README licence section updated with trademark/copy note.

### 2026-04-03 — Docs: README + REPAIR_LOG

- **What:** README aligned with removal of demo route and current stack; REPAIR_LOG supplement **CR1**, historical notes on C4/C5, path fixes for `app/[locale]/…`, O5/O7 wording.

### 2026-04-03 (earlier) — Remove demo terminal; quant card

- **What:** Deleted `app/demo/…`; middleware/sitemap/LanguageSwitcher/GlobalLegalFooter cleaned of `/demo`; nav + `LandingPage` demo CTA removed; dictionaries + types updated; third card → Headless Quant Engine copy + `https://github.com/Kresic1998/kds-quant-engine-showcase`.

---

*Add new entries above this line (newest first).*
