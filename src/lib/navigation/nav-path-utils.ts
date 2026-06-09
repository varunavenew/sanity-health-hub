import type { AppLocale } from "@/lib/i18n/routing";
import { localizeInternalPath } from "@/lib/i18n/nav-paths";

export type NavLinkLike = {
  label?: string;
  path?: string;
  pathNb?: string;
  pathEn?: string;
  navId?: string;
};

function normalizePathBase(path: string): string {
  const hashIdx = path.indexOf("#");
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const base = (qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash).trim() || "/";
  if (base === "/") return "/";
  return base.startsWith("/") ? base : `/${base}`;
}

function pathSuffix(path: string): string {
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const query = qIdx >= 0 ? withoutHash.slice(qIdx) : "";
  return `${query}${hash}`;
}

/** CMS path for the active locale — no hardcoded route fallbacks. */
export function resolveNavPath(item: NavLinkLike, locale: string): string {
  const appLocale: AppLocale = locale === "en" ? "en" : "no";

  const cmsPath =
    appLocale === "en"
      ? (item.pathEn || item.path || "").trim()
      : (item.pathNb || item.path || "").trim();

  if (cmsPath) {
    const base = normalizePathBase(cmsPath);
    return `${base}${pathSuffix(cmsPath)}`;
  }

  return "";
}

function pathsForItem(item: NavLinkLike): { nb: string; en: string } | null {
  const nb = (item.pathNb || item.path || "").trim();
  const en = (item.pathEn || "").trim();
  if (!nb && !en) return null;
  return { nb: nb || en, en: en || nb };
}

function matchesPath(candidate: string, currentBase: string): boolean {
  return normalizePathBase(candidate) === currentBase;
}

/**
 * When switching locale, map the current path using CMS nav path pairs,
 * then fall back to the static NB↔EN marketing map for non-nav paths.
 */
export function resolveLocaleSwitchPath(
  currentPath: string,
  targetLocale: AppLocale,
  navItems: NavLinkLike[] = [],
): string {
  const suffix = pathSuffix(currentPath);
  const currentBase = normalizePathBase(currentPath);

  for (const item of navItems) {
    const pair = pathsForItem(item);
    if (!pair) continue;

    if (matchesPath(pair.nb, currentBase) || matchesPath(pair.en, currentBase)) {
      const nextBase = targetLocale === "en" ? pair.en : pair.nb;
      return `${normalizePathBase(nextBase)}${suffix}`;
    }
  }

  const localized = localizeInternalPath(currentBase, targetLocale);
  return `${localized}${suffix}`;
}
