# AI / agent work log

Chronological log of **substantive** changes driven by AI-assisted sessions on this repo.  
**Purpose:** before starting a new task, read the latest entries so new work stays consistent with prior decisions and does not regress fixed behaviour.

**Version control:** This file is **tracked in Git** and pushed with the repo so every clone has the same continuity context. **`REPAIR_LOG.md`** is reserved for **major** repairs, audits, and milestone fixes that should stand out for readers; routine agent work is logged **here only** (see Current conventions).

## How agents should use this file

1. **Start of task** — Read this file per **§0** in `.cursor/rules/ai-work-log-protocol.mdc`: full **Current conventions**, **last five** log entries (more if the task overlaps logged areas), then assess overlap, compatibility, and regression risk before coding.
2. **End of task** — Append a new entry under **Log** with: date (ISO), short title, what changed (files/areas), intent, and anything the next session must not undo.
3. **Keep entries factual** — No secrets, no API keys, no paste of `.env`.

## Current conventions (do not contradict without explicit user approval)

- **Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind, RSC-first; `"use client"` only when needed.
- **i18n / SEO:** Locale routes under `app/[locale]/…`, `middleware.ts` sets `x-locale`, `withLocale()` for links, `generateMetadata` + `lib/seo.ts` for canonicals/hreflang; root layout sets `<html lang>` from header. **`siteBaseUrl()`** lives in **`lib/site.ts`** (fallback **`https://kresicds.com`** when `NEXT_PUBLIC_SITE_URL` is unset); `lib/seo.ts` re-exports it for existing imports.
- **Content:** Marketing copy in `dictionaries/de.json` + `en.json`, typed via `dictionaries/types.ts`.
- **Performance:** Hero LCP path stays server-rendered where possible; heavy WebGL behind `dynamic` + `MountWhenVisible` / defer patterns in `components/landing/HeavyVisuals.tsx`, `HeroBackdrop`, etc. **i18n dictionaries** are passed as RSC props (not bundled client-side); `I18nProvider` receives `initialDictionary` from server — do not re-import both dicts in the client module. **Logo font** (`--font-kds-logo-mono`) is a **local 3-glyph subset** (`public/fonts/jetbrains-mono-700-kds.woff2`, ~0.9 KB) loaded via `next/font/local` — do not switch back to `next/font/google` JetBrains_Mono (was ~21 KB). **Portrait image** in About section has **no `priority`** (below-fold, would compete with hero LCP).
- **Third-party scripts:** **None.** No analytics, tracking, or RUM provider is embedded, and the CSP is **first-party only** (`connect-src 'self'`, no external `script-src` origins). `NEXT_PUBLIC_DEFERRED_SCRIPT_SRC` remains the single opt-in hook and ships nothing while unset — adding any provider requires a CSP change **and** a privacy-copy update in `dictionaries/*.json`.
- **Tooling:** `tsconfig` target **ES2022**; `package.json` **browserslist** for modern evergreen; `next.config.mjs` includes `optimizePackageImports` for `lucide-react`, `poweredByHeader: false`. **Tests:** `npm test` / `test:unit` — **Vitest** (`vitest.config.ts`, `tests/unit/**/*.test.ts`); `test:e2e` / `test:all` — **Playwright** (`playwright.config.ts`, `tests/e2e/`). E2E starts `npm run dev` unless `PLAYWRIGHT_SKIP_WEB_SERVER=1` or `PLAYWRIGHT_BASE_URL` points at an existing server. CI: install browsers with `npx playwright install --with-deps` before `test:e2e`.
- **Accessibility:** Primary green CTAs use **`emerald-700`** (hover **`emerald-600`**) with white text for contrast — do not revert to `emerald-500`/`emerald-600` as default fill for small text buttons without checking WCAG.
- **Demo route:** `/demo/market-analytics` **removed**; third featured project card points to **`kds-quant-engine-showcase`**; no `liveDemo` / `demoCta` keys in dictionaries.
- **Licence:** Root **`LICENSE`** is MIT; README licence section matches (do not revert to "all rights reserved" on the codebase without user decision).
- **Git:** User runs commit/push locally unless they explicitly ask the agent to commit; after each completed task the agent outputs a **copy-paste** block: **`cd` to repo root** → **`git status`** → **`git add .`** → **`git commit -m …`** (see `.cursor/rules/git-commit-suggestions.mdc`).
- **Issue drafts:** Paste-ready GitHub/GitLab text: **title** and **body** in **separate** fenced code blocks (see `.cursor/rules/github-issue-drafts.mdc`).
- **Code language:** Identifiers, comments, and technical strings in source files must be **English**; user-facing copy stays in `dictionaries/` (see `.cursor/rules/code-language-english.mdc`).
- **Agent rules:** `.cursor/rules/` includes nine `.mdc` files (`alwaysApply: true` where set), including `ai-work-log.mdc`, `ai-work-log-protocol.mdc` (mandatory pre-task review **§0**), `engineering-standards`, `security-performance`, `project-conventions`, `code-language-english`, `git-commits`, `git-commit-suggestions`, `github-issue-drafts`.
- **Logs:** **`AI_WORK_LOG.md`** — routine substantive AI/agent changes; commit and push with the repo. **`REPAIR_LOG.md`** — use **only for larger / highlighted** work (major fixes, audits, milestones worth calling out); do not duplicate every small task there.

## Log (newest first)

### 2026-09-16 — Terms of business: /[locale]/agb, contract templates moved to a private repository

- **What:**
  - `private-legal/agb.{de,en}.html.example` (new) — terms in three parts. **A** binds everyone; **B** applies only to consumers and is where the venue clause, the shortened limitation period and the liability cap are explicitly withheld; **C** applies only to businesses and is where they are granted. Every clause in B and C names who it binds. 32 sections, cross-references verified. The EN file opens with the courtesy-translation notice `widerruf.en` already uses, which is what keeps the German text authoritative.
  - Route `app/[locale]/agb/page.tsx` + `components/AgbPageClient.tsx`, mirroring the widerruf pair. `dictionaries/types.ts` gains `agb` and `legalFooter.agb`; both dictionaries gain the block; `sync-private-legal-to-dictionaries.mjs` and the `DOCS` array in `generate-legal-pdfs.mjs` gain the slug (`file: "allgemeine_geschaeftsbedingungen"`); `app/sitemap.ts` gains it in `LEGAL_SLUGS`; both footers gain the link.
  - `tests/e2e/legal-pages.spec.ts` — asserts all three parts of the terms render, and gains the **withdrawal-notice test that never existed**. 9 → 12 specs.
  - **Contact form: the consent checkbox is gone.** Handling an enquiry rests on Art. 6(1)(b)/(f) GDPR — which this site's own privacy policy states — so requiring consent to submit made it non-free under Art. 7(4) and very likely void, while contradicting the policy. It was also never recorded anywhere, so Art. 7(1) could not have been met. Replaced by the Art. 13 notice above the submit button. `consent*` dictionary keys → `privacyNote*`; `consent` removed from the Zod schema and the Server Action; `ContactFormWithConsent` → `ContactForm`.
  - **Contract templates are not in this repository.** AVV (Art. 28 GDPR), the offer template, the request for acceptance, the acceptance record and the Serbian reading copies live in a separate private repository. They were briefly committed here and have been **removed from the history**, not just from the tree — this repository is public, MIT-licensed, and linked from the site as a portfolio piece.
- **Why:** The withdrawal notice went live promising consumers their fourteen days while nothing set out scope, payment, ownership of the code or where liability stops. Absent terms do not mean no rules; they mean the statutory defaults, and on nearly every point the default is worse for a sole trader than a negotiated clause. Terms only become part of a contract once the client has had a reasonable chance to read them (§ 305 Abs. 2 BGB) and can retrieve and store them (§ 312i Abs. 1 S. 1 Nr. 4) — which is what the route and the PDF are for.
- **Do not undo:**
  - Do not reintroduce a consent checkbox as a precondition for sending. If consent is ever genuinely needed, it must be optional, purpose-specific, and recorded with a timestamp.
  - Do not add contract templates to this repository. `.gitignore` covers `private-contracts/` entirely.
  - The dictionary block must exist in **both** locales before `sync:legal` runs — the script spreads `...de[slug]`, so a missing key silently yields an object carrying `htmlBody` alone. `npx tsc --noEmit` is the parity gate; the `readonly` arrays in `LandingDictionary` block the assertion that would otherwise hide it.
  - The PDF filename in `AgbPageClient` and the `file` stem in `DOCS` are linked by nothing but convention. A mismatch is a silent 404 on the download button.
- **Still open:** **Lawyer review before any of this stands behind an offer.** The statutory forms already on the site carry Gesetzlichkeitsfiktion; terms of business do not — they are written for a specific practice, and a clause that fails § 307 restores the statutory position, usually worse than having no clause. Also: the AI clause in § 15 asserts training opt-out and privacy mode are active, which stays true only as long as those per-account settings are.

### 2026-09-16 — Drop the unverified "Resend Labs Inc." entity name

- **What:** `private-legal/datenschutz.{de,en}.html.example` — the processor is now named as `Resend (2261 Market Street #5039, San Francisco, CA 94114, USA)`, without a corporate suffix; dictionaries and `public/legal/*.pdf` re-synced. The same name also sat in `datenschutz.s4p1` in both dictionaries — a fallback key that only renders when `htmlBody` is empty, so it was shipping unused but shipping — and was cleaned there too.
- **Why:** The EU-U.S. Data Privacy Framework listing records the participant as **Resend**, its corporate complaint contact as **PLUS FIVE FIVE** at the same address, and explicitly "no other covered entities". No source supports "Resend Labs Inc.", and the adequacy decision under Art. 45 attaches to the certified entity — so naming an entity that may not be the certified one weakens the very passage that cites the framework. Art. 13(1)(e) requires the recipient to be identifiable, which the service name plus address achieves without asserting a corporate identity that could not be verified.
- **Do not undo:** Do not reinstate a corporate suffix for Resend from memory or inference. If one is ever needed, take it verbatim from the counterparty named on the signed DPA.

### 2026-09-16 — Privacy policy: US transfer basis (Art. 45) and the rate limiter's IP use

- **What:** `private-legal/datenschutz.{de,en}.html.example` gained three passages, synced to the dictionaries and re-rendered into `public/legal/*.pdf`:
  - `<h4>Datenübermittlung in die USA</h4>` at the end of part 2 (hosting): Vercel Inc. transfers rest on the European Commission's adequacy decision of 10 July 2023 on the EU-U.S. Data Privacy Framework (Art. 45(1) GDPR), certification category "Non-HR Data", with a link to the official list.
  - The same basis stated for Resend in the contact-form section.
  - A sentence in the contact-form section covering the in-memory rate limiter in `app/actions/sendEmail.ts`: the caller's IP is processed briefly to block bulk submissions, not stored, discarded within a minute, Art. 6(1)(f).
- **Why:** Art. 13(1)(f) requires the transfer mechanism to be named, not merely the recipient and the fact of a DPA. Both providers were listed with US addresses and a DPA but no Art. 45/46 basis. The rate limiter's IP processing is a purpose distinct from server log files, which was the only IP-related disclosure the policy carried.
- **Verified against the DPF list (not assumed):** Vercel Inc. — EU-U.S. DPF *Active*, HR and Non-HR Data, certified since 2019-06-20, next certification due 2027-04-29. Resend — EU-U.S. DPF *Active, re-certification under review*, Non-HR Data, certified since 2025-02-20, next due 2027-03-03. Both statuses count as active participation. **Re-check before the next legal review**: an expired or withdrawn certification removes the Art. 45 basis and the text would then have to name SCCs (Art. 46) instead.
- **Resolved in the entry above:** the unverifiable entity name was dropped rather than guessed. The DPF listing's participant name is **Resend**, its corporate complaint contact is PLUS FIVE FIVE at 2261 Market Street #5039, San Francisco, and it records no other covered entities. Nothing published anywhere supports "Resend Labs Inc."

### 2026-09-16 — Contact form: consent checkbox removed, Art. 13 notice kept

- **What:** `components/ContactFormWithConsent.tsx` → **`components/ContactForm.tsx`** (`ContactFormWithConsent` → `ContactForm`; lazy import in `LandingPage.tsx` updated). The required consent checkbox and its client-side guard are gone, replaced by a plain Art. 13 notice above the submit button that names the legal basis and links the privacy policy. `consent` removed from `lib/schemas/contactForm.ts` (field, `ContactFormZodMessages`, `ISSUE_PATH_PRIORITY`) and from `app/actions/sendEmail.ts` (extraction, payload, error message). Dictionary keys `consentLead` / `consentPrivacyLinkText` / `consentTrail` / `consentError` → `privacyNoteLead` / `privacyPolicyLinkText` / `privacyNoteTrail`, typed in `dictionaries/types.ts`. `tests/e2e/contact-form.spec.ts` rewritten: asserts no checkbox, the legal basis in the copy, and the privacy link's href/target.
- **Why:** Handling a contact enquiry already rests on Art. 6(1)(b) (pre-contractual) or (f) (legitimate interest) — which is what this site's own privacy policy states. Making consent a precondition for using the form made that consent non-free under Art. 7(4) and therefore most likely void, while contradicting the policy about which basis applies. Three further defects went with it: consent was never recorded anywhere (Art. 7(1) Nachweispflicht could not have been met — the outgoing email carries name, address, service and message only), the label referred wholesale to the privacy policy rather than a specific purpose (Art. 4 no. 11), and every required field costs submissions.
- **Do not undo:** Do not reintroduce a consent checkbox as a precondition for sending. If consent is ever genuinely needed (e.g. newsletter, or storing the contact beyond the enquiry), it must be a separate, optional checkbox for that specific purpose, and its value plus a timestamp must be recorded to satisfy Art. 7(1). The Art. 13 notice itself is required and must stay.
- **Both follow-ups from this entry are now closed** by the entry above: the Art. 45 transfer basis and the rate limiter's IP processing are both documented.

### 2026-09-16 — Remove the fabricated NDA client engagement

- **What:**
  - `projects.featured[2]` — the outcome line read "Proprietäre Logik unter NDA" / "Proprietary logic under NDA", presenting the owner's own private market-data tooling as a confidential client engagement. There is no client and no NDA. The card now leads with the offer: the system runs in the owner's own operation, was not produced under a client engagement, and the same architecture is what gets built around a client's data sources and reporting. The service is offered — only the claim of having already delivered it was false. The "NDA" tag is replaced accordingly.
  - `projects.restrictedAccess` — the amber badge on that card said "EINGESCHRÄNKTER ZUGANG" / "RESTRICTED ACCESS", which reads as client material withheld under contract. Now "NICHT VERÖFFENTLICHT" / "NOT PUBLISHED".
  - `projects.title` — "Referenzen & Werkzeuge" → "Projekte & Werkzeuge" ("Referenzen" means client references; all three cards are the owner's own work). `projects.intro` reframed accordingly.
  - `opSec.intro` and `opSec.items[1]` — "Sensible Mandate führe ich …" and "getrennt von allen anderen Mandaten" implied an existing client roster. Both are now stated as rules that apply to an engagement, not as a description of past ones.
  - `opSec.items[2]` — "Wo erforderlich, arbeite ich unter NDA" → "Auf Wunsch unterzeichne ich ein NDA, bevor Unterlagen ausgetauscht werden": an offer, which is true, rather than a claim of prior engagements.
- **Why:** A concrete assertion of completed client work is not puffery — it is a factual claim under § 5 (1) and (2) no. 3 UWG, disprovable, and actionable by any competitor. It also fails the first time a prospect asks for the reference. Offering a capability is lawful; claiming to have already delivered it to a client is not.
- **Do not undo:** Do not describe any project on this site as client work, under NDA, or as a reference until a real engagement exists and the client has agreed to be cited (even anonymously). The remaining two NDA mentions are forward-looking offers and must stay that way. Do not restore "Referenzen" as the section heading while every card is the owner's own project.

### 2026-09-16 — Legal risk pass (UWG, cookie disclosure, phone removal) + first-person voice

- **What:**
  - `dictionaries/*.json` `about.body` — removed the comparative advertising claim ("schneller und präziser … als klassische Agenturen") and the "in Rekordzeit" superlative. Replaced with a description of the actual process (AI-assisted implementation + AI-assisted review pass, type check / static analysis / automated tests before release), which the repo's own CI demonstrably runs.
  - `about.figcaptionSub` — "messbare Ergebnisse" / "measurable outcomes" replaced with a verifiable claim ("jede Änderung automatisiert geprüft"), pending real anonymised client figures.
  - `private-legal/datenschutz.{de,en}.html.example` — new `<h3>Cookies</h3>` section in part 4 documenting the single functional `NEXT_LOCALE` cookie (value, 12-month lifetime, `SameSite=Lax`/`Secure`, set only on an active language switch), with § 25 (2) no. 2 TDDDG as the consent exemption and Art. 6 (1) (f) GDPR as the processing basis. Art. 13 GDPR transparency; no consent banner required.
  - **Phone number removed site-wide** (user decision): `impressum`, `datenschutz` (controller block) and `widerruf` templates, the `impressum.phoneLine` dictionary key, its entry in `dictionaries/types.ts` and its render in `components/ImpressumPageClient.tsx`. The eRecht24 heading "Anfrage per E-Mail, Telefon oder Telefax" was narrowed to "Anfrage per E-Mail" so the policy does not name channels that are not offered.
  - **Voice:** first person singular ("ich") across all marketing copy in both locales; legal documents keep the plural. `nav.about` → "Warum ich" / "Why me".
  - **Register:** Mittelstand — anglicisms translated into business outcomes across `hero`, `services`, `about`, `projects`, `opSec` (Core Web Vitals → kurze Ladezeiten, Bugfixing → Fehlerbehebung, Stack → Systeme/Fachanwendungen, Least-Privilege → Zugriff nur für die konkrete Aufgabe, Backtesting-Engines → Auswertungen auf historischen Kursdaten).
  - `opSec` — fourth item "KI-Werkzeuge ohne Datenabfluss": AI tools run with training opt-out and privacy mode enabled, the absence of a contractual zero-retention guarantee is stated openly (the tooling is Claude Pro / Cursor Pro, i.e. individual plans, not business tiers), and engagements that rule out any third-party transfer are worked without these tools. New `IconOpSecAiBoundary` in `components/LandingPage.tsx`; the icon array order was also corrected so lock/shield match their captions.
  - `contact.writtenContactLead` — softened from "Schriftlicher Kontakt bevorzugt" to email-first with an explicit offer to arrange a call.
  - `public/legal/*.pdf` regenerated from the updated `htmlBody` via `npm run sync:legal` + `npm run legal:pdf`.
- **Why:** The comparative claim was the one live §§ 5/6 UWG exposure on the site and the cheapest to fix. The cookie disclosure closes an Art. 13 GDPR gap. The AI/confidentiality item resolves the contradiction between advertising an AI workflow and promising confidentiality in the same page.
- **Do not undo:** Do not reintroduce comparisons against unnamed competitors ("schneller als Agenturen") or unquantified superlatives — that is what an Abmahnung attaches to. Do not re-add the phone number to any template without also restoring it in the Widerrufsbelehrung address block. The `NEXT_LOCALE` cookie section must be updated if a second cookie is ever added.
- **Verify before deploy:** the AI item asserts training opt-out and privacy mode are active. That is a per-account setting — Cursor's Privacy Mode and the training toggle in Claude's settings must actually be on, or the sentence is itself a § 5 UWG claim that does not hold. Upgrading to business tiers (Claude Team/Enterprise, Cursor Business) is what would allow the stronger zero-retention wording.
- **Open / blocked (superseded):** AGB (phase 3) is **done** — written in-house rather than bought in, see the entry above. The planned "anonymised figures from the NDA project" case study is void — there is no such project (see the entry above). No Berufshaftpflichtversicherung exists, so DL-InfoV § 2 (1) no. 11 does not apply — add the block if that changes. Lawyer review of Impressum / Datenschutz / Widerruf before production remains outstanding.

### 2026-09-16 — chore: remove third-party RUM telemetry entirely

- **What:** Deleted the third-party RUM component under `components/` and its render in `app/layout.tsx`. `next.config.mjs` — dropped the vendor CDN origin from `script-src` and the beacon origin from `connect-src` (now `connect-src 'self'`). `.env.example` — removed both RUM opt-in flags. `lib/webgl.ts` — reworded a comment that referenced the vendor. `README.md` / `AI_WORK_LOG.md` — all references removed.
- **Why:** User decision: no third-party monitoring on the site or in the project. Removing it also removes the outstanding GDPR/ePrivacy obligation to disclose the provider in the privacy policy (which the Datenschutz copy never did) and restores a fully first-party CSP.
- **Do not undo:** This **supersedes** the earlier "do not remove the beacon origin from `connect-src`" guardrail — that entry is gone and the constraint no longer applies. Do not re-add any external `script-src`/`connect-src` origin, or any monitoring snippet, without an explicit user decision plus a privacy-copy update.
- **Potential debt:** No Web Vitals telemetry in production. Use lab tooling (Lighthouse, WebPageTest) or Vercel's built-in Speed Insights — the latter is a separate opt-in decision — if field data is needed again.

### 2026-04-03 — feat: LinkedIn link in landing footer

- **What:** `lib/site.ts` — `LINKEDIN_URL` (`https://www.linkedin.com/in/kresicdigitalsystems`). `components/LandingPage.tsx` — `SiteFooter` nav: LinkedIn link after GitHub with same styling, separators, `target="_blank"`, `rel="noopener noreferrer"`. `dictionaries/en.json` + `de.json` + `types.ts` — `a11y.linkedinProfile` for `aria-label`.
- **Why:** Match GitHub as a public profile CTA; URL normalized to `https://` for consistency.
- **Do not undo:** Keep social URLs centralized in `lib/site.ts` next to `GITHUB_URL`.

### 2026-04-03 — fix(perf): suppress Three.js console.error + CSP worker-src

- **What:** `lib/webgl.ts` — `createWebGLRendererSafely` now mutes `console.error` for the duration of `new WebGLRenderer()` and restores in `finally`. Three.js r183 calls `console.error("THREE.WebGLRenderer: …")` inside its constructor catch block **before** re-throwing; our wrapper already returns `null` on failure, so the console message is purely cosmetic noise that costs 4 Best-Practices points. `next.config.mjs` — added `worker-src 'self' blob:` to CSP (defensive: without it, any blob-URL worker — even from a dependency — would be silently blocked as a CSP violation console error).
- **Why:** Lighthouse consistently reported 1 `console.error` on every page load → Best Practices 96 instead of 100. Root cause: Three.js WebGLRenderer constructor logs errors to console before throwing; our safe wrapper caught the throw but couldn't prevent the pre-throw `console.error`. Investigation ruled out: our own source code (zero `console.error` calls), the third-party RUM script in use at the time (since removed), Next.js `onCaughtError` (only fires for error-boundary-caught render-phase errors — our WebGL code runs in `useEffect`), React hydration mismatch (`pageerrors: 0` rules out `reportGlobalError`).
- **Do not undo:** The `console.error` mute is scoped to the **constructor call only** via `finally` restoration — do not widen the scope or leave `console.error` muted. Do not remove `worker-src` from CSP — without it, `worker-src` falls back to `script-src` which lacks `blob:`.

### 2026-04-03 — perf: local font subset + CSP cleanup + portrait priority removal

- **What:** `app/layout.tsx` — replaced `next/font/google` JetBrains_Mono (full Latin ~21 KB preloaded) with `next/font/local` pointing to `public/fonts/jetbrains-mono-700-kds.woff2` (3-glyph "KDS" subset, 892 bytes). Logo only renders "KDS" — full Latin charset was wasted bandwidth. `next.config.mjs` — removed dead `fonts.googleapis.com` from `style-src` and `fonts.gstatic.com` from `font-src` (both unreachable at runtime; `next/font/google` self-hosts at build time, and logo now uses local font). `components/LandingPage.tsx` — removed `priority` from portrait `<Image>` in About section (below fold, was competing with hero LCP for network priority).
- **Why:** ~20 KB preload saving on every page load; tighter CSP (smaller attack surface); correct resource prioritization for LCP.
- **Do not undo:** Do not switch logo font back to `next/font/google` without measuring — the local subset is 23× smaller. Do not re-add Google Fonts origins to CSP unless a runtime dependency is introduced. Do not add `priority` to below-fold images.

### 2026-04-03 — autoreview: FadeIn remount guard + stable transition string

- **What:** `components/FadeIn.tsx` — added `triggeredRef` (`useRef<boolean>`) to guard re-animation on conditional unmount+remount (prevents CLS from re-running opacity/transform animation on already-seen content). Removed `useCallback` (not needed — ref callback only fires on mount; stable identity is irrelevant). Changed `translateY(0)` → `"none"` (avoids creating a stacking context unnecessarily). Made transition string not allocate a new template literal on every render when `delay === 0`.
- **Why:** `useCallback([])` captured `setInView` in a closure that was theoretically safe (useState setters are stable) but fragile as a pattern; the `triggeredRef` guard is the real fix for the unmount+remount CLS edge case.

### 2026-04-03 — fix: revert FadeIn to per-instance observer (singleton caused 6,630ms TBT)

- **What:** `components/FadeIn.tsx` — removed singleton `IntersectionObserver` + `WeakMap`. Reverted to per-instance observer, now using React 19 **ref-callback cleanup** (return `() => io.disconnect()` from `refCb`) instead of `useEffect`.
- **Why (root cause):** Singleton fired all `setInView(true)` calls **synchronously inside a single IntersectionObserver callback** when all visible elements were batched in the same IO tick (desktop large viewport). This flooded React 19's concurrent scheduler with simultaneous state updates from within the IO callback, producing 23,094ms of "Other" main-thread work and TBT of 6,630ms. Per-instance observers fire in separate microtask ticks → React handles each update independently, no queue flood.
- **Do not undo:** Do **not** attempt a shared singleton FadeIn observer again. Per-instance observers + React 19 ref cleanup is the safe pattern here. If `useEffect` count becomes a real bottleneck, profile first.
- **Approach preserved:** React 19 ref-callback cleanup replaces the old `useEffect` pattern cleanly, without `useEffect` scheduling overhead.

### 2026-04-03 — perf: move i18n dictionaries from client JS to RSC props (−21 kB first-load)

- **What:** `lib/i18n.tsx` — `I18nProvider` no longer imports `de`/`en`; accepts `initialDictionary` prop. `components/Providers.tsx` — threads `initialDictionary` through. `app/layout.tsx` (RSC) — imports both dicts server-side, passes only the active locale's dictionary to the client `<Providers>`.
- **Why:** Both ~30 KiB dictionaries were bundled into a single client JS chunk (`115-…`, 63 KiB raw). Since the language switcher navigates via `router.push` (full RSC re-render with `key={locale}`), the client never needs both dicts simultaneously. Moving them to RSC props eliminates the chunk entirely — data now flows as part of the streamed RSC payload, not as JS that must parse/evaluate (reduces TBT).
- **Impact:** `/[locale]` First Load JS: **140 kB → 119 kB** (−21 kB). Chunk `115-…` removed from client output. Legal pages: **131 kB → 110 kB**.
- **Do not undo:** Keep dictionaries as RSC props, not client-side imports. If client-side locale switching without navigation is ever added, use `dynamic(() => import(...))` for the lazy dictionary — do not re-bundle both statically.

### 2026-04-03 — Cursor rules: mandatory pre-task `AI_WORK_LOG.md` review (§0)

- **What:** `.cursor/rules/ai-work-log-protocol.mdc` — new **§0 Mandatory pre-task review**: read log before each new substantive task, minimum **five** recent entries (more when overlapping), explicit overlap / compatibility / regression checks, no silent undo of **“Do not undo”** items, no repeating failed approaches without addressing logged rationale. `.cursor/rules/ai-work-log.mdc` — pre-code step points to **§0**. `AI_WORK_LOG.md` — “How agents should use” and **Agent rules** list aligned with the stricter bar.
- **Why:** Reduce circular rework and contradictory fixes across sessions.
- **Do not undo:** Keep **§0** as the authoritative pre-task gate; bump read depth when the task touches areas already in the log.

### 2026-04-03 — Autoreview: validate `siteBaseUrl`, pointer snapshot coords

- **What:** `lib/site.ts` — `siteBaseUrl()` parses env via `URL`, allows only `http:`/`https:` (otherwise default), prepends `https://` when the scheme is omitted. `HeroVisual.tsx`, `InfrastructureGrid.tsx` — rAF batching stores `{ clientX, clientY }` instead of retaining `MouseEvent`. `tests/unit/seo.test.ts` — scheme-less host, invalid URL, and rejected `javascript:` cases.
- **Why:** Avoid invalid canonical origins from mis-set env; avoid stale event references in rAF callbacks.

### 2026-04-03 — Lighthouse: SEO default origin + batched pointer layout reads

- **What:** `lib/site.ts` — `DEFAULT_PUBLIC_SITE_URL`, `siteBaseUrl()`; `lib/seo.ts` re-exports `siteBaseUrl` from site. `app/layout.tsx` (`metadataBase`), `app/robots.ts`, `app/sitemap.ts` use `siteBaseUrl()`. Fallback origin when `NEXT_PUBLIC_SITE_URL` is unset is **https://kresicds.com** (replaces **https://kresic.digital**). `components/HeroVisual.tsx`, `components/InfrastructureGrid.tsx` — coalesce `mousemove` + `getBoundingClientRect` to at most once per animation frame via `requestAnimationFrame`.
- **Why:** Audits on **kresicds.com** with a **kresic.digital** metadata fallback produce canonical / hreflang / `metadataBase` mismatches (typical Lighthouse SEO score drop). Desktop “forced reflow” noise from a synchronous layout read on every pointer move.
- **Do not undo:** Keep the default public origin aligned with the primary production hostname; use `NEXT_PUBLIC_SITE_URL` for previews/staging so canonicals match the deployed host.

### 2026-04-03 — Playwright webServer: force `NODE_ENV=development`

- **What:** `playwright.config.ts` — `webServer.command` is `cross-env NODE_ENV=development npm run dev` (added `cross-env` devDependency). Prevents Edge middleware `EvalError` and timeouts when the parent shell has `NODE_ENV=production` (which also makes plain `npm install` skip devDependencies — use `npm install --include=dev` to recover).
- **Why:** Pre-delivery `test:all` failed: inherited `NODE_ENV=production` broke `next dev` for E2E; reinstall without devDeps had removed Tailwind and broke `next build`.

### 2026-04-03 — Unit tests: `lib/contact-service`, `lib/seo`

- **What:** `tests/unit/contact-service.test.ts` — `CONTACT_SERVICE_VALUES`, `contactServiceSubjectTag` (all mappings + invalid key). `tests/unit/seo.test.ts` — `siteBaseUrl` (env stub), `alternatesForLocale`, `homeMetadata` (en/de).
- **Why:** Pure helpers safe to test without browser; guards regressions in canonicals and inbox tags.

### 2026-04-03 — E2E flows + dev CSP `unsafe-eval` for HMR

- **What:** `tests/e2e/` — `navigation.spec.ts` (primary nav, CTA, language EN→DE), `legal-pages.spec.ts` (Impressum, Datenschutz headings), `contact-form.spec.ts` (consent validation without checkbox). `next.config.mjs` — append `'unsafe-eval'` to `script-src` **only when** `NODE_ENV !== 'production'` so `next dev` HMR works (lazy client islands + Playwright against dev); production CSP unchanged.
- **Why:** Removing `unsafe-eval` globally broke client hydration in dev — dynamic imports never ran, so LanguageSwitcher / ContactForm never mounted; E2E timed out. Observatory/production remain strict.

### 2026-04-03 — Test infrastructure: `tests/unit`, Playwright `tests/e2e`, `test:all`

- **What:** `tests/unit/locale.test.ts` — moved from `lib/locale.test.ts`; `vitest.config.ts` only includes `tests/unit/**/*.{test,spec}.ts`. Added `@playwright/test`, `playwright.config.ts` (Chromium, `headless: true`, `webServer: npm run dev`, `PLAYWRIGHT_BASE_URL` / `PLAYWRIGHT_SKIP_WEB_SERVER` env overrides). `tests/e2e/smoke.spec.ts` — root locale redirect + `#main` on `/en` and `/de`. `package.json` — `test` → `test:unit`, `test:e2e`, `test:e2e:headed`, `test:e2e:ui`, `test:all` (`vitest run && playwright test`).
- **Why:** Standard layout for unit vs E2E; one headless command for CI/local full suite.
- **Do not undo:** Run `npx playwright install chromium` (or `install --with-deps` in CI) on fresh clones before `test:e2e`.

### 2026-04-03 — Vitest + unit tests for `lib/locale.ts`

- **What:** Added `vitest` devDependency, `vitest.config.ts` (`@` alias), `npm test` / `test:watch`. Initial `lib/locale.test.ts` — later **moved** to `tests/unit/locale.test.ts` (see “Test infrastructure” entry).
- **Why:** `lib/locale.ts` is pure logic with no external I/O — ideal first test target; no mocks required.

### 2026-04-03 — CSP hardening: remove unsafe-eval, add missing directives (issue #19)

- **What:** `next.config.mjs` — removed `'unsafe-eval'` from `script-src` (not needed in Next.js 15 production). Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`. Kept `'unsafe-inline'` because nonce-based CSP has a known hydration bug in Next.js 15 + React 19 (`vercel/next.js#77952`).
- **Why:** Mozilla Observatory flagged CSP as unsafe (-20 score). These changes improve the posture without performance cost or hydration breakage.
- **Do not undo:** Do not re-add `'unsafe-eval'` — Next.js 15 production does not need it. Do not remove `'unsafe-inline'` until the nonce hydration issue in Next.js is resolved.

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
