import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectLocale } from "@/lib/i18n/detect-locale";
import { locales } from "@/lib/i18n/routing";

const LOCALE_PREFIX = new Set(locales);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    /\.(ico|png|jpg|jpeg|gif|webp|svg|txt|xml|woff2?|otf|ttf)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (first && LOCALE_PREFIX.has(first as (typeof locales)[number])) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      "x-cmedical-html-lang",
      first === "en" ? "en" : "no-NO",
    );
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
