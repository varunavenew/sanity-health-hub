import { permanentRedirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  isSiteLocale,
  localeFromAcceptLanguage,
  localeFromGeoCountry,
  type SiteLocale,
} from "@/lib/i18n/detect-locale";

async function resolveRootLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isSiteLocale(fromCookie)) return fromCookie;

  const h = await headers();
  const fromLang = localeFromAcceptLanguage(h.get("accept-language"));
  if (fromLang) return fromLang;

  const country =
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || undefined;
  return localeFromGeoCountry(country) ?? "no";
}

export default async function RootPage() {
  permanentRedirect(`/${await resolveRootLocale()}`);
}
