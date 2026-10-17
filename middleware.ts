import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type LocaleCode,
} from "@/lib/locale";
import {
  isMaintenanceMode,
  MAINTENANCE_HTML,
  MAINTENANCE_RETRY_AFTER,
} from "@/lib/maintenance";

const LOCALE_HEADER = "x-locale";

function pickLocaleFromAcceptLanguage(header: string | null): LocaleCode {
  if (!header) return DEFAULT_LOCALE;
  const parts = header.split(",").map((p) => p.trim().toLowerCase());
  for (const p of parts) {
    const code = p.split(";")[0]?.trim();
    if (!code) continue;
    const primary = code.split("-")[0];
    if (primary === "de") return "de";
    if (primary === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

/**
 * 503 for everything the matcher lets through. No cookie is set, and every
 * cookie the browser sent is expired — `Clear-Site-Data` covers the ones a
 * browser holds but did not send on this request.
 */
function maintenanceResponse(request: NextRequest): NextResponse {
  const res = new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": String(MAINTENANCE_RETRY_AFTER),
      "X-Robots-Tag": "noindex",
      "Clear-Site-Data": '"cookies"',
    },
  });
  for (const { name } of request.cookies.getAll()) {
    res.cookies.delete(name);
  }
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMaintenanceMode()) {
    return maintenanceResponse(request);
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  /** Public files under `/` (e.g. `/legal/*.pdf`) — do not inject locale prefix. */
  if (pathname.match(/\.[a-z0-9]+$/i)) {
    const r = NextResponse.next();
    r.headers.set(LOCALE_HEADER, DEFAULT_LOCALE);
    return r;
  }

  const res = NextResponse.next();

  const first = pathname.split("/").filter(Boolean)[0];

  if (first && isLocale(first)) {
    res.headers.set(LOCALE_HEADER, first);
    return res;
  }

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const target: LocaleCode =
      cookieLocale && isLocale(cookieLocale)
        ? cookieLocale
        : pickLocaleFromAcceptLanguage(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${target}`;
    return NextResponse.redirect(url);
  }

  const suffix = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${suffix}`;
  return NextResponse.redirect(url, 308);
}

/**
 * Everything not excluded here gets a 308 to `/<locale>/…`, which is right for
 * pages and wrong for anything a crawler or a browser fetches by a fixed path.
 *
 * `icon` is on the list because `app/icon.tsx` serves the favicon from `/icon`,
 * at the root and with no locale of its own. Without the exclusion the browser's
 * icon request is redirected into `/de/icon`, which does not exist — a 404 that
 * shows up as a blank tab rather than as an error anybody notices.
 *
 * `opengraph-image` needs no entry: it lives under `/<locale>/`, so it already
 * starts with a locale and passes through untouched.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|robots.txt|sitemap.xml).*)",
  ],
};
