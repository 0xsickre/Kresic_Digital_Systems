# REPAIR LOG — Kresic Digital Systems

> **Scope going forward:** From **2026-04**, add entries here **only for major** repairs, audits, and milestone fixes that should be **highlighted** for maintainers and readers. Ongoing AI-assisted work is recorded in **`AI_WORK_LOG.md`** (committed with the repo). Historical entries below remain the canonical audit trail.

> **Original audit:** 2026-03-30  
> **Last supplement:** 2026-04-03  
> **Auditor / maintainer notes:** Security, performance, and compliance-oriented change log (not a penetration-test certificate).  
> **Initial scope:** `/app`, `/components`, `/lib`, `/dictionaries`, `tailwind.config.ts`, `next.config.mjs`, `.gitignore`, `.env.example`  
> **Supplement scope (through commit `57cf345`):** `app/page.tsx`, `app/actions/sendEmail.ts`, landing/LCP components, Three.js visuals, `DeferMount.tsx`, `GlobalLegalFooter.tsx`, `globals.css`, README alignment  
> **Supplement (2026-04-03):** Removal of `/demo/market-analytics`; featured-work card copy + GitHub URL for headless quant showcase; `middleware` / `sitemap` / nav / dictionary cleanup (`README.md`, this log).

---

## Severity legend

| Label | Meaning |
|---|---|
| `CRITICAL FIX` | Security vulnerability, data leak, or GDPR/legal non-compliance — must be fixed before production |
| `WARNING FIX` | Incorrect behaviour, stale data, or compliance gap — should be fixed |
| `OPTIMIZATION` | Dead code, bundle bloat, or performance regression — reduces quality but not a breakage |

---

## CRITICAL FIX — C1

**File:** `next.config.mjs`  
**Lines:** 1–4 (original: entire file was empty)  
**Problem:** The Next.js configuration had no HTTP security headers. Browsers received no `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`, or `Content-Security-Policy` headers. This leaves the site open to clickjacking, MIME-type sniffing attacks, and information leakage through the `Referer` header.  
**Fix:** Added an `async headers()` export with a comprehensive `securityHeaders` array applied to all routes (`source: "/(.*)"`) including:
- `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — disables MIME sniffing
- `Strict-Transport-Security` with a 2-year `max-age` and `preload` — enforces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` disabling camera, microphone, geolocation, and payment APIs
- A scope-correct `Content-Security-Policy`

Also added `images.formats: ["image/avif", "image/webp"]` and a trimmed `deviceSizes` array aligned with actual display widths used in the project.

---

## CRITICAL FIX — C2

**File:** `app/layout.tsx`  
**Lines:** metadata export  
**Problem:** `metadataBase` was not set. Without it, Next.js cannot resolve relative URLs in `openGraph.images`, `twitter.images`, canonical links, or any other metadata that requires an absolute URL. On Vercel this silently produces broken Open Graph previews and potentially incorrect `<link rel="canonical">` values.  
**Fix:** Added `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kresic.digital")`. The environment variable path gives flexibility across deployments (staging, custom domain). Added `robots: { index: true, follow: true }` as an explicit default.

---

## CRITICAL FIX — C3

**File:** `app/actions/sendEmail.ts`  
**Lines:** ~48–52 (original)  
**Problem 1 — Debug logs in production:** `console.log("[sendEmail] API Key exists:", apiKey.length > 0)` ran unconditionally on every form submission in all environments. In production this leaks operational state to server logs (Vercel function logs are sometimes accessible to broader team members). `console.warn` with internal Vercel deployment URLs also ran unconditionally.  
**Problem 2 — No server-side field length limits:** The client enforces `maxLength` via HTML attributes, but those are trivially bypassed with DevTools or `curl`. A malicious actor could send a 1 MB `message` value, causing unnecessary memory allocation and potentially a Resend API error with a confusing response to the user.  
**Problem 3 — `onboarding@resend.dev` fallback in production:** The fallback sender address `Kresic Digital Systems <onboarding@resend.dev>` would silently be used in production if `RESEND_FROM_EMAIL` was unset. Resend restricts `onboarding@resend.dev` to test accounts; real production sends using this address are rejected by Resend — causing silent send failures.  
**Fix:**
- All `console.log` / `console.warn` statements are now gated behind `const isDev = process.env.NODE_ENV === "development"`.
- Added server-side constants `MAX_NAME_LEN = 200`, `MAX_EMAIL_LEN = 320`, `MAX_MESSAGE_LEN = 8000` and a validation block that returns `t.tooLong` if any field exceeds its limit.
- The `onboarding@resend.dev` fallback is now restricted to `NODE_ENV === "development"`. In production, if `RESEND_FROM_EMAIL` is unset, the action returns `{ success: false, error: t.notConfigured }` instead of silently attempting an invalid send.

---

## CONTENT / ROUTE — CR1 *(2026-04-03 supplement)*

**Scope:** Marketing site content and routing  
**Problem:** The site still promoted an in-app **Market Analytics terminal** at `/demo/market-analytics` (header nav, work-section CTA, sitemap, middleware `x-locale` exception) and linked the third project card to a **legacy** GitHub path under `KDS-Engineering-Showcase/.../github-showcase`. That contradicted the current public narrative: the showcase is the **headless** Python engine repository ([`kds-quant-engine-showcase`](https://github.com/Kresic1998/kds-quant-engine-showcase)), not a hosted Next.js terminal demo on this domain.  
**Fix:**  
- Removed `app/demo/market-analytics/` (page + layout) and the entire `app/demo/` tree.  
- Dropped `/demo` handling from `middleware.ts`, `app/sitemap.ts`, `LanguageSwitcher.tsx`, and `GlobalLegalFooter.tsx`.  
- Removed `nav.liveDemo`, `projects.demoIntro`, and `projects.demoCta` from `dictionaries/de.json`, `dictionaries/en.json`, and `dictionaries/types.ts`.  
- Removed the demo nav item from `LandingHeaderShellClient.tsx` and the demo CTA block from `components/LandingPage.tsx` (`ProjectsSection`).  
- Updated the third **featured** card (DE/EN) to **Headless Quant Engine & Data Infrastructure** with the agreed copy and `githubUrl` pointing to `https://github.com/Kresic1998/kds-quant-engine-showcase` (tags aligned to Python / data quality / SQLite / PostgreSQL).  
**Verification:** `npm run build` — demo route absent from route manifest; no remaining `liveDemo` / `demoCta` / `/demo/market-analytics` references in app or dictionaries.

---

## CRITICAL FIX — C4 *(historical — route removed 2026-04-03)*

> **Note:** The `app/demo/market-analytics` route was **removed** on 2026-04-03 (see **CR1**). The entry below records the fix that applied **while the route existed**.

**File:** `app/demo/market-analytics/page.tsx` *(deleted)*  
**Lines:** 7–8 (original imports)  
**Problem:** The demo page (`"use client"`) imported `{ de }` and `{ en }` from the full dictionary modules to access two static strings (the legal disclaimer). Because this is a Client Component, Next.js bundles these imports directly into the JavaScript chunk for `/demo/market-analytics`. Both dictionary objects are large JSON files (~3–5 KB each after serialisation). Importing them for a single string each doubled the unnecessary bundle weight for this route and effectively bundled all UI copy into a page that only needs two sentences.  
**Fix:** Removed the dictionary imports entirely. The two legal disclaimer strings are now declared as module-level `const` values (`LEGAL_EN`, `LEGAL_DE`) directly in the file. This eliminates ~6–10 KB of unnecessary JS from this route's bundle.

---

## CRITICAL FIX — C5 *(historical — route removed 2026-04-03)*

> **Note:** Same as **C4** — route deleted; kept for audit trail.

**File:** `app/demo/market-analytics/layout.tsx` *(deleted)*  
**Lines:** metadata export (original: no `robots` field)  
**Problem:** The demo page displays a sophisticated-looking financial terminal with ticker symbols, heatmaps, and price data — all of which is entirely mock/deterministic. Without a `robots: { index: false }` directive, search engines could index this page and surface it in results for financial or trading-related queries. This creates a real risk of users mistaking it for a live trading tool and a regulatory risk under German/EU financial marketing laws (MiFID II, BaFin guidelines).  
**Fix:** Added `robots: { index: false, follow: false }` to the demo layout metadata. This injects `<meta name="robots" content="noindex, nofollow">` and also communicates the same directive via the `X-Robots-Tag` response header when combined with Next.js's metadata system. Added an explanatory comment in the code.

---

## CRITICAL FIX — C6 *(2026-04-01 supplement)*

**File:** `app/actions/sendEmail.ts`  
**Problem:** The original `CONTROL_CHARS` regular expression did **not** remove ASCII newline (U+000A), carriage return (U+000D), or tab (U+0009). Those code points could remain in `name` (and thus in the email **subject** prefix) or in other fields, enabling **header / SMTP line-breaking** behaviour in downstream mail pipelines. The `email` field was trimmed and lowercased but **not** passed through the same control-character stripper before use in `replyTo` and in the HTML `mailto:` attribute. Separately, `Promise.race` between `resend.emails.send()` and a timeout could leave the Resend promise **rejecting after** the race had already failed on timeout, risking **unhandled promise rejections** in a serverless runtime.  
**Fix:**  
- Replaced the regex with `[\u0000-\u001F\u007F]` so **all C0 control characters and DEL** are stripped from free-text fields.  
- Applied `stripControl()` to `email` after trim/lowercase, before validation and Resend payload construction.  
- Attached a no-op `.catch()` to the send promise so a late rejection after a timeout does not surface as an unhandled rejection.

---

## WARNING FIX — W1

**File:** Datenschutz route (`app/[locale]/datenschutz/`) and privacy copy in dictionaries / client renderers  
**Lines:** Section 4 ("Kontaktformular") paragraph  
**Problem:** The privacy policy stated: *"Sobald das Kontaktformular technisch an einen Server angebunden wird, ergänzen wir diese Erklärung…"* (Translation: "As soon as the contact form is technically connected to a server, we will supplement this declaration…"). The form has been wired to Resend since a previous development session. This stale text creates a material GDPR non-compliance: the privacy policy must accurately describe the current processing activities. Under Art. 13 DSGVO, the data subject must be informed about the actual data processor at the time of collection.  
**Fix:** Replaced the stale paragraph with an accurate description: the form data (name, email, message) is processed via Resend (`resend.com`) as a data processor, forwarded to the owner's mailbox, not stored persistently, and not passed to third parties. Direct email communication is noted as preferably using Proton Mail with E2E encryption.

---

## WARNING FIX — W2

**File:** `lib/site.ts`  
**Lines:** `CONTACT_PROTON_PLACEHOLDER` export  
**Problem:** An export named `CONTACT_PROTON_PLACEHOLDER` was defined as an alias for `SITE_EMAIL`. The name contains the word "PLACEHOLDER", strongly implying it holds a temporary or test value. Any future maintainer encountering this name in code might mistakenly replace it with a real address or treat it as a to-do item, when in fact it already points to the live production email. It was also unused across the entire codebase (confirmed via full-repo search), making it dead code.  
**Fix:** Removed the export entirely. `SITE_EMAIL` is the canonical, correctly-named export for the production inbox.

---

## OPTIMIZATION — O1

**File:** `components/LandingPage.tsx`  
**Lines:** `<Image>` in `AboutSection`  
**Problem:** The `<Image>` component declared `width={800} height={1000}` (a 4:5 large portrait) but `sizes="(min-width: 1024px) 192px, 160px"`. Next.js uses `width` to pick the source image to serve from its optimisation pipeline. A declared width of 800 px caused the optimiser to generate and serve an unnecessarily large source, wasting CDN bandwidth and increasing LCP for users on constrained connections — despite the image actually rendering at 160–192 px.  
**Fix:** Changed to `width={192} height={240}`, which matches the largest display size (192 px on `lg:`). At 2× DPR the optimiser will serve at ~384 px, which is still far better than 800 px. `sizes` remains `"(min-width: 1024px) 192px, 160px"` (unchanged).

---

## OPTIMIZATION — O2

**File:** `tailwind.config.ts`  
**Lines:** `animation` and `keyframes` extensions  
**Problem:** Two custom keyframes (`fade-up`, `fade-in`) and their corresponding `animation` utilities were defined in the Tailwind config. A full-repo search confirmed that neither `animate-fade-up` nor `animate-fade-in` is referenced anywhere in the codebase (the `FadeIn` component uses `IntersectionObserver` + inline CSS transitions, not these Tailwind utilities). Dead config entries add confusion, inflate the CSS output during purge analysis, and mislead future contributors.  
**Fix:** Removed the `animation` and `keyframes` blocks from `theme.extend`. The rest of the config (custom `terminal` color palette, `fontFamily`) is unchanged.

---

## OPTIMIZATION — O3

**File:** `.gitignore`  
**Lines:** IDE section  
**Problem:** The `.cursor/` directory was not listed in `.gitignore`. This directory (created by the Cursor IDE) stores AI conversation transcripts, agent outputs, and skill files — none of which belong in a version-controlled repository. Committing it would expose internal AI interaction history and bloat the repository history.  
**Fix:** Added `.cursor/` to the IDE section of `.gitignore`.

---

## OPTIMIZATION — O4

**File:** `.env.example`  
**Lines:** All  
**Problem:** The `NEXT_PUBLIC_SITE_URL` variable required by the new `metadataBase` implementation was not documented anywhere. Developers setting up the project locally or on a new Vercel project would not know to set it, resulting in broken Open Graph metadata falling back to the hardcoded `https://kresic.digital`.  
**Fix:** Added `NEXT_PUBLIC_SITE_URL` as the first entry in `.env.example` with a clear description of its purpose and an example value format.

---

## WARNING FIX — W3 *(2026-04-01 supplement)*

**Files:** `components/HeroVisual.tsx`, `components/DataFlowVisual.tsx`, `components/InfrastructureGrid.tsx`, `components/MarketPulseVisual.tsx`  
**Problem:** Resize handling used a debounced callback without clearing the pending `setTimeout` on unmount. After `WebGLRenderer.dispose()`, a fired debounce could still call `setSize` / `render` on a torn-down GL context. The animation loop scheduled `requestAnimationFrame` before running the frame body, so one additional frame could be scheduled unless the loop short-circuited when the component had unmounted.  
**Fix:** Introduced an `alive` (or equivalent) flag set false in the effect cleanup; guard the first line of the animation function; store the debounce timer id and `clearTimeout` it in cleanup alongside `ResizeObserver.disconnect()` and `cancelAnimationFrame`.

---

## OPTIMIZATION — O5 *(2026-04-01 supplement)*

**Files:** `app/[locale]/page.tsx` *(historically `app/page.tsx` before locale segments)*, `components/KDSLogoSsr.tsx`, `LandingHeaderShellClient.tsx`, `LandingLcpHero.tsx`, `HeroBackdrop.tsx`, `HeroCopyMarkup.tsx`, `HeroTextIsland.tsx`, `components/LandingPage.tsx`, `components/landing/HeavyVisuals.tsx`, `components/DeferMount.tsx`, `app/layout.tsx` (fonts), `app/globals.css`  
**Problem:** The marketing home route previously bundled the full interactive landing (including hero and header) in ways that delayed **LCP** (notably logo + hero text) and increased **TBT** during hydration. Hero Three.js and heavy chunks competed with the main thread immediately after load. Card WebGL read `clientWidth` / `clientHeight` synchronously at effect start, contributing to **forced reflow** in Lighthouse-style traces.  
**Fix (summary):**  
- **RSC-first LCP path:** `app/[locale]/page.tsx` composes a server-rendered **logo link** (`KDSLogoSsr`) and **locale-specific hero copy** (`HeroCopyMarkup` inside `HeroTextIsland`). Interactive chrome lives in **`LandingHeaderShellClient`** with the logo passed as a server-rendered slot.  
- **Hero WebGL:** `HeroBackdrop` wraps `DeferHeavyChild` + dynamic `HeroVisual`; `scheduleAfterHydrationIdle` waits for post-hydration frames, a configurable delay, then **`requestIdleCallback`** (with fallback), with a higher delay floor on narrow viewports. **`DeferHeavyChild`** clears its schedule on unmount and gates `setShow` with a `mounted` flag.  
- **Below-fold WebGL:** Card scenes remain behind **`next/dynamic` (`ssr: false`)** and **`MountWhenVisible`**.  
- **Sizing:** Hero and card Three.js components take dimensions from **`ResizeObserver`** entries (debounced where appropriate) instead of synchronous layout reads on the first effect tick.  
- **Typography:** `JetBrains_Mono` (weight 700, `display: "swap"`, preload) supplies the SVG wordmark; hero copy uses a CSS **`lcp-fade-in`** keyframe instead of an intersection-driven fade for the primary headline block.

---

## OPTIMIZATION — O6 *(2026-04-01 supplement)*

**Files:** `components/HeroVisual.tsx`, `components/DataFlowVisual.tsx`, `components/InfrastructureGrid.tsx`, `components/MarketPulseVisual.tsx`  
**Problem:** Mobile WebGL was either overly conservative (e.g. fixed DPR of 1) or expensive (antialias on all small screens). Shader precision and particle counts were not tuned as a single policy across scenes.  
**Fix:** Unified policy: **`setPixelRatio(Math.min(devicePixelRatio, 2))`**, **`antialias`** only when `navigator.hardwareConcurrency > 4`, **`precision: "mediump"`** on `WebGLRenderer`, tuned particle/segment counts, and **debounced resize** (where still applicable before W3’s teardown hardening).

---

## OPTIMIZATION — O7 *(2026-04-01 supplement)*

**Files:** `components/LandingPage.tsx` (`SiteFooter`), `components/GlobalLegalFooter.tsx`  
**Problem:** Footer layout used `justify-between` on desktop with legal links rendered in a **separate** global footer, producing a visually disjointed stack (logo / copyright / GitHub vs. legal row) and awkward wrapping on small viewports.  
**Fix:** **`SiteFooter`** is a single **centred column**: logo, copyright, then a **nav** with GitHub + Impressum + Datenschutz (labels from `t.legalFooter` for EN/DE). On small screens links stack vertically; on `sm+` a horizontal row uses subtle separators. **`GlobalLegalFooter`** is a client component that **returns `null` on localized home** (`/de`, `/en` with no extra segments) so the home page does not duplicate the legal strip; other routes keep the compact global legal bar.

---

## Related hardening (commit history — summary)

| Theme | Commits (examples) | Notes |
|------|---------------------|--------|
| Contact abuse & resilience | `36e4760`, `06525fa`, `291f407` | Honeypot field, submit timing gate, in-memory rate limit by IP, `RESEND_TO_EMAIL` override, trimmed quoted env values, distinct errors for missing API key vs missing production sender |
| Observability | `f52666b`, `57dda2b`, `689ad6b` | Structured logging for Resend failures; global error boundary; dev-only noise reduction elsewhere |
| Bundle / route performance | `25a7639`, `8e753fe`, `3548b59` | Code-splitting and lazy strategies for landing and WebGL chunks |
| Documentation | `f95defa`, `aea7194` | README aligned with deployment env and current RSC/LCP architecture |
| Content / routes | *(2026-04-03)* | Removed `/demo/market-analytics`; third featured card → `kds-quant-engine-showcase`; README + **CR1** in this log |

---

## No action required — Verified correct

| Area | Finding |
|---|---|
| `app/actions/sendEmail.ts` | Server-side consent check (`consent !== "on" && consent !== "true"`) correctly double-keys the client-side checkbox — GDPR compliant |
| `app/actions/sendEmail.ts` | `escapeHtml()` is applied to all user-supplied content rendered into the HTML email body — XSS-safe |
| `app/actions/sendEmail.ts` | `name`, `email`, and `message` pass through full C0 **stripControl** before validation and send (see **C6**) |
| `app/actions/sendEmail.ts` | `locale` is normalised to `"de" \| "en"` before use — injection-safe |
| `components/DeferMount.tsx` | `DeferHeavyChild` cancels scheduled idle/timer work on unmount and guards `setShow` after unmount |
| `components/ContactFormWithConsent.tsx` | `useTransition` + `isPending` prevents duplicate form submissions |
| `components/ContactFormWithConsent.tsx` | `role="status" aria-live="polite"` on feedback `<div>` — accessible |
| `app/[locale]/impressum/page.tsx` | Kleinunternehmer notice (§ 19 UStG) present — TMG/DACH compliant |
| `app/[locale]/datenschutz/page.tsx` | User rights section (Art. 15–21 DSGVO) present and correctly addressed |
| `lib/i18n.tsx` | No secrets, no external calls — pure client state management |
| `tailwind.config.ts` | `darkMode: "class"` with `dark` on `<html>` — matches the project’s explicit dark-first marketing UI |
| `next/image` | `priority` set on above-the-fold portrait — LCP optimised |
| `app/layout.tsx` | `Providers` wrapper correctly positions `I18nProvider` above all page components |
| `.gitignore` | `.env`, `.env.local`, and all `.env.*.local` variants are correctly excluded |
