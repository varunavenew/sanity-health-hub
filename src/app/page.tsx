import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, localeFromGeoCountry } from "@/lib/i18n/detect-locale";
import { isAppLocale, type AppLocale } from "@/lib/i18n/routing";

async function resolveRootLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isAppLocale(fromCookie)) return fromCookie;

  const h = await headers();
  const country = h.get("x-vercel-ip-country");
  return localeFromGeoCountry(country);
}

export default async function RootPage() {
  redirect(`/${await resolveRootLocale()}`);
}
