export const locales = ["nb", "en"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "nb";

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** `/nb/foo` -> `/foo`; `/nb` -> `/` */
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

export function withLocalePath(locale: AppLocale, to: string): string {
  if (
    to.startsWith("http://") ||
    to.startsWith("https://") ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:") ||
    to.startsWith("#")
  ) {
    return to;
  }
  const [rawPath, query] = to.split("?");
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  let base: string;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) base = path;
  else if (path === "/") base = `/${locale}`;
  else base = `/${locale}${path}`;
  return query !== undefined && query !== "" ? `${base}?${query}` : base;
}
