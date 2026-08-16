import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  isSiteLocale,
  localeFromGeoCountry,
  type SiteLocale,
} from "@/lib/i18n/detect-locale";

async function resolveRootLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isSiteLocale(fromCookie)) return fromCookie;

  const h = await headers();
  const country =
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || undefined;
  return localeFromGeoCountry(country);
}

export default async function RootPage() {
  redirect(`/${await resolveRootLocale()}`);
}
