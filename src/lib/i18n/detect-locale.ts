import type { NextRequest } from "next/server";
import { isAppLocale, type AppLocale } from "@/lib/i18n/routing";

/** Persisted when the user picks a language in the header. */
export const LOCALE_COOKIE = "cmedical-locale";

/** Public site locales, including Swedish (served by the legacy /se proxy). */
export type SiteLocale = AppLocale | "se";

export function isSiteLocale(value: string): value is SiteLocale {
  return isAppLocale(value) || value === "se";
}

function geoCountry(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    undefined
  );
}

/**
 * Norway → no, Sweden → se, every other country (and missing geo) → en.
 */
export function localeFromGeoCountry(
  country: string | undefined | null,
): SiteLocale {
  const code = country?.trim().toUpperCase();
  if (code === "NO") return "no";
  if (code === "SE") return "se";
  return "en";
}

export function readLocaleCookie(request: NextRequest): SiteLocale | null {
  const raw = request.cookies.get(LOCALE_COOKIE)?.value;
  if (raw && isSiteLocale(raw)) return raw;
  return null;
}

/**
 * Resolve locale for visitors without `/no`, `/en`, or `/se` in the URL.
 * Priority: manual cookie → country (NO/SE) → English.
 */
export function detectLocale(request: NextRequest): SiteLocale {
  const fromCookie = readLocaleCookie(request);
  if (fromCookie) return fromCookie;
  return localeFromGeoCountry(geoCountry(request));
}

/** Client-side: remember manual language choice for future visits. */
export function writeLocaleCookie(locale: SiteLocale): void {
  try {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};samesite=lax`;
  } catch {
    /* ignore */
  }
}
