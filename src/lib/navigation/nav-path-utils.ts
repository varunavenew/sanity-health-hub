import type { AppLocale } from "@/lib/i18n/routing";
import {
  FIXED_NAV_PATHS,
  localizeInternalPath,
  type NavRouteId,
} from "@/lib/i18n/nav-paths";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { NAV_CMS_SOURCES, pathForNavId } from "@/lib/routing/nav-cms-paths";
import type { SlugLocaleMap } from "@/lib/routing/slug-locale-map";
import { slugPairFromNavItem } from "@/lib/routing/enrich-route-index";

export type NavLinkLike = {
  label?: string;
  path?: string;
  pathNb?: string;
  pathEn?: string;
  navId?: string;
};

function isCmsNavId(navId: string | undefined): navId is NavRouteId {
  return Boolean(navId && navId in NAV_CMS_SOURCES);
}

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

function navPathFromItem(item: NavLinkLike, locale: AppLocale): string {
  const pair = slugPairFromNavItem(item);
  if (!pair) return "";
  const slug = locale === "en" ? pair.slugEn : pair.slugNb;
  return slug ? `/${slug}` : "";
}

/**
 * CMS page slugs (via navId) are the source of truth for main navigation URLs.
 * Site Settings paths are only used when no CMS slug is available.
 */
export function resolveNavPath(
  item: NavLinkLike,
  locale: string,
  index?: CmsRouteIndex,
): string {
  const appLocale: AppLocale = locale === "en" ? "en" : "no";
  const navId = item.navId?.trim() as NavRouteId | undefined;
  const suffix = pathSuffix(item.path || "");

  if (index && isCmsNavId(navId)) {
    const slugPath = pathForNavId(index, navId, appLocale);
    if (slugPath) return `${normalizePathBase(slugPath)}${suffix}`;
  }

  const settingsPath = navPathFromItem(item, appLocale);
  if (settingsPath) {
    return `${normalizePathBase(settingsPath)}${suffix}`;
  }

  if (index && navId) {
    const slugPath = pathForNavId(index, navId, appLocale);
    if (slugPath) return `${normalizePathBase(slugPath)}${suffix}`;
  }

  if (navId && navId in FIXED_NAV_PATHS) {
    const fixed = FIXED_NAV_PATHS[navId as NavRouteId];
    if (fixed) return fixed[appLocale === "en" ? "en" : "nb"];
  }

  return "";
}

function pathsForItem(item: NavLinkLike): { nb: string; en: string } | null {
  const pair = slugPairFromNavItem(item);
  if (!pair) return null;
  return {
    nb: pair.slugNb ? `/${pair.slugNb}` : `/${pair.slugEn}`,
    en: pair.slugEn ? `/${pair.slugEn}` : `/${pair.slugNb}`,
  };
}

function matchesPath(candidate: string, currentBase: string): boolean {
  return normalizePathBase(candidate) === currentBase;
}

/**
 * When switching locale, map the current path using CMS nav path pairs,
 * then CMS slug pairs from the route index, then marketing fallbacks.
 */
export function resolveLocaleSwitchPath(
  currentPath: string,
  targetLocale: AppLocale,
  navItems: NavLinkLike[] = [],
  cmsMap?: SlugLocaleMap,
): string {
  const suffix = pathSuffix(currentPath);
  const currentBase = normalizePathBase(currentPath);

  for (const item of navItems) {
    const navId = item.navId?.trim() as NavRouteId | undefined;

    if (navId && cmsMap?.navPaths[navId]) {
      const { nb, en } = cmsMap.navPaths[navId]!;
      if (matchesPath(nb, currentBase) || matchesPath(en, currentBase)) {
        const nextBase = targetLocale === "en" ? en : nb;
        return `${normalizePathBase(nextBase)}${suffix}`;
      }
    }

    const pair = pathsForItem(item);
    if (pair) {
      if (matchesPath(pair.nb, currentBase) || matchesPath(pair.en, currentBase)) {
        const nextBase = targetLocale === "en" ? pair.en : pair.nb;
        return `${normalizePathBase(nextBase)}${suffix}`;
      }
    }
  }

  const localized = localizeInternalPath(currentBase, targetLocale, cmsMap);
  return `${localized}${suffix}`;
}
