import type { NavRouteId } from "@/lib/i18n/nav-paths";
import type { CmsRouteIndex, RouteIndexDoc, SlugPair } from "@/lib/routing/cms-route-types";
import {
  normalizeSlugSegment,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";
import { NAV_CMS_SOURCES } from "@/lib/routing/nav-cms-paths";

export type NavPathSource = {
  navId?: string;
  path?: unknown;
  pathNb?: unknown;
  pathEn?: unknown;
};

function pickI18nPath(value: unknown, lang: "no" | "en"): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  const entry =
    value.find(
      (row) =>
        row &&
        typeof row === "object" &&
        ((row as { language?: string }).language === lang ||
          (row as { _key?: string })._key === lang),
    ) ??
    value.find(
      (row) =>
        row &&
        typeof row === "object" &&
        ((row as { language?: string }).language === "no" ||
          (row as { _key?: string })._key === "no"),
    ) ??
    value[0];
  if (!entry || typeof entry !== "object") return "";
  const raw = (entry as { value?: unknown }).value;
  return typeof raw === "string" ? raw : "";
}

function slugFromPathValue(value: unknown, lang: "no" | "en"): string {
  return normalizeSlugSegment(pickI18nPath(value, lang));
}

export function slugPairFromNavItem(item: NavPathSource): SlugPair | null {
  const slugNb =
    slugFromPathValue(item.pathNb, "no") || slugFromPathValue(item.path, "no");
  const slugEn =
    slugFromPathValue(item.pathEn, "en") || slugFromPathValue(item.path, "en");
  if (!slugNb && !slugEn) return null;
  return { slugNb: slugNb || slugEn, slugEn: slugEn || slugNb };
}

/**
 * Fill missing document slugs from Site Settings nav paths.
 * Routing uses page slugs; nav often only has paths configured there.
 */
export function enrichRouteIndexWithNavPaths(
  index: CmsRouteIndex,
  navItems: NavPathSource[] = [],
): CmsRouteIndex {
  const navPairs = new Map<NavRouteId, SlugPair>();
  for (const item of navItems) {
    const navId = item.navId?.trim() as NavRouteId | undefined;
    if (!navId) continue;
    const pair = slugPairFromNavItem(item);
    if (pair) navPairs.set(navId, pair);
  }

  if (navPairs.size === 0) return index;

  const singletons = index.singletons.map((doc): RouteIndexDoc => {
    if (slugPairFromDoc(doc)) return doc;
    const navId = Object.entries(NAV_CMS_SOURCES).find(([, source]) => {
      if (source?.kind === "singleton" && source.pageType === doc._type) return true;
      // e.g. newsPage exists in singletons[] and as a listing key
      if (source?.kind === "listing" && source.listingKey === doc._type) return true;
      return false;
    })?.[0] as NavRouteId | undefined;
    const pair = navId ? navPairs.get(navId) : undefined;
    if (!pair) return doc;
    return { ...doc, slugNb: pair.slugNb, slugEn: pair.slugEn };
  });

  const listings = { ...index.listings };
  for (const [navId, source] of Object.entries(NAV_CMS_SOURCES)) {
    if (source?.kind !== "listing") continue;
    const existing = listings[source.listingKey];
    if (existing && slugPairFromDoc(existing)) continue;
    const pair = navPairs.get(navId as NavRouteId);
    if (pair) listings[source.listingKey] = pair;
  }

  return { ...index, singletons, listings };
}
