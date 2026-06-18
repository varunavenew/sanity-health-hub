import type { NextRequest } from "next/server";
import { defaultLocale, isAppLocale, type AppLocale } from "@/lib/i18n/routing";

/** Persisted when the user picks a language in the header. */
export const LOCALE_COOKIE = "cmedical-locale";

/** ISO 3166-1 alpha-2 codes that should default to English routes. */
const ENGLISH_GEO_COUNTRIES = new Set(["IN"]);

export function localeFromGeoCountry(country: string | undefined | null): AppLocale {
  if (country && ENGLISH_GEO_COUNTRIES.has(country.toUpperCase())) {
    return "en";
  }
  return defaultLocale;
}

export function readLocaleCookie(request: NextRequest): AppLocale | null {
  const raw = request.cookies.get(LOCALE_COOKIE)?.value;
  if (raw && isAppLocale(raw)) return raw;
  return null;
}

function geoCountry(request: NextRequest): string | undefined {
  return (
    request.geo?.country ||
    request.headers.get("x-vercel-ip-country") ||
    undefined
  );
}

/**
 * Resolve locale for visitors without `/no` or `/en` in the URL.
 * Priority: manual cookie → geo (India → en) → Norwegian default.
 */
export function detectLocale(request: NextRequest): AppLocale {
  const fromCookie = readLocaleCookie(request);
  if (fromCookie) return fromCookie;
  return localeFromGeoCountry(geoCountry(request));
}

/** Client-side: remember manual language choice for future visits. */
export function writeLocaleCookie(locale: AppLocale): void {
  try {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};samesite=lax`;
  } catch {
    /* ignore */
  }
}
