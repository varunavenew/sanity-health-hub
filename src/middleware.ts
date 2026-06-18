import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/routing";

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

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
