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
 * Norway → no, Sweden → se. Other countries (and missing geo) return null
 * so Accept-Language / the Norwegian default can win.
 */
export function localeFromGeoCountry(
  country: string | undefined | null,
): SiteLocale | null {
  const code = country?.trim().toUpperCase();
  if (code === "NO") return "no";
  if (code === "SE") return "se";
  return null;
}

/**
 * Best matching public locale from Accept-Language (q-values honored).
 * Norwegian tags win over English when both are present at equal quality.
 */
export function localeFromAcceptLanguage(
  header: string | undefined | null,
): SiteLocale | null {
  if (!header?.trim()) return null;

  const parts = header.split(",").map((part) => {
    const [tagRaw, ...params] = part.trim().split(";");
    const tag = tagRaw.trim().toLowerCase();
    const qParam = params.find((p) => p.trim().toLowerCase().startsWith("q="));
    const quality = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "1") : 1;
    return { tag, quality: Number.isFinite(quality) ? quality : 1 };
  });

  parts.sort((a, b) => b.quality - a.quality);

  for (const { tag } of parts) {
    const primary = tag.split("-")[0];
    if (primary === "nb" || primary === "nn" || primary === "no") return "no";
    if (primary === "sv") return "se";
    if (primary === "en") return "en";
  }
  return null;
}

export function readLocaleCookie(request: NextRequest): SiteLocale | null {
  const raw = request.cookies.get(LOCALE_COOKIE)?.value;
  if (raw && isSiteLocale(raw)) return raw;
  return null;
}

/**
 * Resolve locale for visitors without `/no`, `/en`, or `/se` in the URL.
 * Priority: manual cookie → Accept-Language → country (NO/SE) → Norwegian.
 */
export function detectLocale(request: NextRequest): SiteLocale {
  const fromCookie = readLocaleCookie(request);
  if (fromCookie) return fromCookie;
  const fromLang = localeFromAcceptLanguage(
    request.headers.get("accept-language"),
  );
  if (fromLang) return fromLang;
  return localeFromGeoCountry(geoCountry(request)) ?? "no";
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
