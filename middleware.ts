import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type LocaleCode,
} from "@/lib/locale";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  if (pathname.startsWith("/demo")) {
    res.headers.set(LOCALE_HEADER, "en");
    return res;
  }

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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
