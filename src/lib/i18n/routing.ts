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

export function isAbsoluteHttpUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

function hostnameWithoutWww(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

/** Same-site hosts that should keep in-app routing (not a new tab). */
function isOwnHttpHost(hostname: string): boolean {
  const host = hostnameWithoutWww(hostname);
  if (host === "cmedical.no") return true;
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  return false;
}

/**
 * Off-site http(s) URL (e.g. colosseumfaust.no). Same-origin CMedical URLs are
 * not off-site — they should stay on Next.js routing.
 */
export function isOffsiteHttpUrl(value: string): boolean {
  if (!isAbsoluteHttpUrl(value)) return false;
  try {
    return !isOwnHttpHost(new URL(value).hostname);
  } catch {
    return true;
  }
}

/** Convert a same-origin absolute CMedical URL to a path Next.js can route. */
export function toInternalPathFromOwnUrl(value: string): string | null {
  if (!isAbsoluteHttpUrl(value)) return null;
  try {
    const url = new URL(value);
    if (!isOwnHttpHost(url.hostname)) return null;
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return null;
  }
}

export function withLocalePath(
  locale: AppLocale,
  to: string,
  cmsMap?: SlugLocaleMap,
): string {
  const pathInput = coercePath(to, locale);
  if (!pathInput) return `/${locale}`;

  const ownPath = toInternalPathFromOwnUrl(pathInput);
  if (ownPath) {
    return withLocalePath(locale, ownPath, cmsMap);
  }

  if (
    isAbsoluteHttpUrl(pathInput) ||
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
