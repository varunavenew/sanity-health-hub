import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { detectLocale } from "@/lib/i18n/detect-locale";
import { locales } from "@/lib/i18n/routing";
import { isAccessGateEnabled } from "@/lib/env";
import {
  isLegacySeProxyPath,
  proxyLegacySeRequest,
  readLegacySeOrigin,
} from "@/lib/legacy-se-proxy";
import { rewriteRetiredIvfPath } from "@/lib/sanity/ivf-canonical";

const LOCALE_PREFIX = new Set(locales);

/** Retired slug `hudlege` → canonical `hudhelse` (301, no alias/duplicate page). */
const HUDLEGE_REDIRECTS: Array<[RegExp, string]> = [
  [/^\/(no|nb)\/ovrige\/hudlege(?=\/|$)/, "/$1/ovrige/hudhelse"],
  [/^\/(no|nb)\/flere-fagomrader\/hudlege(?=\/|$)/, "/$1/ovrige/hudhelse"],
  [/^\/(no|nb)\/behandlinger\/(?:ovrige|flere-fagomrader)\/hudlege(?=\/|$)/, "/$1/ovrige/hudhelse"],
  [/^\/en\/(?:other|more-specialties|ovrige|flere-fagomrader)\/hudlege(?=\/|$)/, "/en/other/hudhelse"],
  [/^\/en\/behandlinger\/(?:other|more-specialties|ovrige|flere-fagomrader)\/hudlege(?=\/|$)/, "/en/other/hudhelse"],
  [/^\/ovrige\/hudlege(?=\/|$)/, "/no/ovrige/hudhelse"],
  [/^\/flere-fagomrader\/hudlege(?=\/|$)/, "/no/ovrige/hudhelse"],
  [/^\/behandlinger\/(?:ovrige|flere-fagomrader)\/hudlege(?=\/|$)/, "/no/ovrige/hudhelse"],
];

function ivfMigrationRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const rewritten = rewriteRetiredIvfPath(pathname);
  if (rewritten === pathname) return null;
  const hashIdx = rewritten.indexOf("#");
  const destPath = hashIdx >= 0 ? rewritten.slice(0, hashIdx) : rewritten;
  const destHash = hashIdx >= 0 ? rewritten.slice(hashIdx + 1) : "";
  const url = request.nextUrl.clone();
  url.pathname = destPath;
  if (destHash) url.hash = destHash;
  return NextResponse.redirect(url, 301);
}

function hudlegeMigrationRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  for (const [pattern, replacement] of HUDLEGE_REDIRECTS) {
    if (!pattern.test(pathname)) continue;
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(pattern, replacement);
    return NextResponse.redirect(url, 301);
  }
  return null;
}

/** Only what's needed to render the 401 challenge itself — everything else is gated. */
const GATE_BYPASS_RE = /^\/(_next\/|favicon\.ico$)/;

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CMedical staging", charset="UTF-8"',
    },
  });
}

/**
 * Checks HTTP Basic Auth credentials against `ACCESS_GATE_USERNAME` /
 * `ACCESS_GATE_PASSWORD`. If no password is configured, fails OPEN (allows
 * the request through) rather than locking everyone out of a deploy where
 * the gate was enabled but nobody set a secret yet.
 */
function isGateAuthorized(request: NextRequest): boolean {
  const password = process.env.ACCESS_GATE_PASSWORD;
  if (!password) return true;
  const username = process.env.ACCESS_GATE_USERNAME || "cmedical";

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(header.slice("Basic ".length));
  } catch {
    return false;
  }
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return false;

  return (
    decoded.slice(0, separatorIndex) === username &&
    decoded.slice(separatorIndex + 1) === password
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isAccessGateEnabled() &&
    !GATE_BYPASS_RE.test(pathname) &&
    !isGateAuthorized(request)
  ) {
    return unauthorizedResponse();
  }

  if (readLegacySeOrigin() && isLegacySeProxyPath(pathname)) {
    return proxyLegacySeRequest(request);
  }

  const ivfRedirect = ivfMigrationRedirect(request);
  if (ivfRedirect) return ivfRedirect;

  const hudlegeRedirect = hudlegeMigrationRedirect(request);
  if (hudlegeRedirect) return hudlegeRedirect;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/__l5e") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/site.webmanifest" ||
    /\.(ico|png|jpg|jpeg|gif|webp|svg|txt|xml|webmanifest|woff2?|otf|ttf)$/i.test(
      pathname,
    )
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
  matcher: [
    "/se",
    "/se/:path*",
    "/__legacy/:path*",
    "/api/legacy-se/:path*",
    "/files",
    "/files/:path*",
    "/api/booking",
    "/api/booking/:path*",
    "/api/specialists/random/:path*",
    "/api/coordinates/:path*",
    "/((?!_next/static|_next/image).*)",
  ],
};
