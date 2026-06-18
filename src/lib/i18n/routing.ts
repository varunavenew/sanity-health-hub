import { localizeInternalPath } from "@/lib/i18n/nav-paths";
import { coercePath } from "@/lib/navigation/coerce-path";
import type { SlugLocaleMap } from "@/lib/routing/slug-locale-map";

export const locales = ["no", "en"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "no";

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** `/no/foo` -> `/foo`; `/no` -> `/` */
export function stripLocaleFromPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (isAppLocale(parts[0])) {
    const rest = parts.slice(1);
    if (rest.length === 0) return "/";
    return `/${rest.join("/")}`;
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function withLocalePath(
  locale: AppLocale,
  to: string,
  cmsMap?: SlugLocaleMap,
): string {
  const pathInput = coercePath(to, locale);
  if (!pathInput) return `/${locale}`;

  if (
    pathInput.startsWith("http://") ||
    pathInput.startsWith("https://") ||
    pathInput.startsWith("mailto:") ||
    pathInput.startsWith("tel:") ||
    pathInput.startsWith("#")
  ) {
    return pathInput;
  }
  const [rawPath, query] = pathInput.split("?");
  let path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  const firstSeg = path.split("/").filter(Boolean)[0];
  if (firstSeg && isAppLocale(firstSeg)) {
    path = stripLocaleFromPathname(path);
  }

  path = localizeInternalPath(path, locale, cmsMap);

  let base: string;
  if (path === "/") base = `/${locale}`;
  else base = `/${locale}${path}`;
  return query !== undefined && query !== "" ? `${base}?${query}` : base;
}
