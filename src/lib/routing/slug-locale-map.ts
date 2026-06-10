import type { NavRouteId } from "@/lib/i18n/nav-paths";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import {
  normalizeSlugSegment,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";
import { NAV_CMS_SOURCES, pathsForNavId } from "@/lib/routing/nav-cms-paths";

export type SlugLocaleMap = {
  nbToEn: Record<string, string>;
  enToNb: Record<string, string>;
  pathToNavId: Record<string, NavRouteId>;
  navPaths: Partial<Record<NavRouteId, { nb: string; en: string }>>;
};

const EMPTY_MAP: SlugLocaleMap = {
  nbToEn: {},
  enToNb: {},
  pathToNavId: {},
  navPaths: {},
};

function addPathPair(
  map: SlugLocaleMap,
  nbSegments: string,
  enSegments: string,
  navId?: NavRouteId,
) {
  const nb = normalizeSlugSegment(nbSegments);
  const en = normalizeSlugSegment(enSegments);
  if (!nb || !en) return;

  const nbPath = `/${nb}`;
  const enPath = `/${en}`;
  map.nbToEn[nbPath] = enPath;
  map.enToNb[enPath] = nbPath;

  if (navId) {
    map.pathToNavId[nbPath] = navId;
    map.pathToNavId[enPath] = navId;
  }
}

const LISTING_COLLECTIONS: Partial<
  Record<
    keyof CmsRouteIndex["listings"],
    keyof Pick<CmsRouteIndex, "articles" | "clinics" | "specialists" | "jobs">
  >
> = {
  newsPage: "articles",
  clinicsPage: "clinics",
  specialistsListingPage: "specialists",
  careersPage: "jobs",
};

/** Build NB↔EN path maps from the CMS route index for locale switching and nav resolution. */
export function buildSlugLocaleMap(index: CmsRouteIndex | null | undefined): SlugLocaleMap {
  if (!index) return EMPTY_MAP;

  const map: SlugLocaleMap = {
    nbToEn: {},
    enToNb: {},
    pathToNavId: {},
    navPaths: {},
  };

  for (const navId of Object.keys(NAV_CMS_SOURCES) as NavRouteId[]) {
    const paths = pathsForNavId(index, navId);
    if (paths) map.navPaths[navId] = paths;
  }

  for (const doc of index.singletons) {
    const pair = slugPairFromDoc(doc);
    if (!pair) continue;
    const navId = Object.entries(NAV_CMS_SOURCES).find(
      ([, source]) => source?.kind === "singleton" && source.pageType === doc._type,
    )?.[0] as NavRouteId | undefined;
    addPathPair(map, pair.slugNb, pair.slugEn, navId);
  }

  for (const [listingKey, listingPair] of Object.entries(index.listings) as [
    keyof CmsRouteIndex["listings"],
    { slugNb?: string; slugEn?: string } | undefined,
  ][]) {
    const pair = slugPairFromDoc(listingPair);
    if (!pair) continue;

    const navId = Object.entries(NAV_CMS_SOURCES).find(
      ([, source]) => source?.kind === "listing" && source.listingKey === listingKey,
    )?.[0] as NavRouteId | undefined;
    addPathPair(map, pair.slugNb, pair.slugEn, navId);

    const collection = LISTING_COLLECTIONS[listingKey];
    if (!collection) continue;

    for (const doc of index[collection]) {
      const detailPair = slugPairFromDoc(doc);
      if (!detailPair) continue;
      addPathPair(
        map,
        `${pair.slugNb}/${detailPair.slugNb}`,
        `${pair.slugEn}/${detailPair.slugEn}`,
      );
    }
  }

  for (const doc of index.categories) {
    const pair = slugPairFromDoc(doc);
    if (!pair) continue;
    addPathPair(map, pair.slugNb, pair.slugEn);
  }

  for (const doc of index.themes) {
    const pair = slugPairFromDoc(doc);
    if (!pair) continue;
    addPathPair(map, pair.slugNb, pair.slugEn);
  }

  for (const doc of index.treatments) {
    const treatmentPair = slugPairFromDoc(doc);
    if (!treatmentPair) continue;

    const catNb = normalizeSlugSegment(doc.categorySlugNb || doc.categoryId || "");
    const catEn = normalizeSlugSegment(doc.categorySlugEn || catNb);
    if (!catNb || !catEn) continue;

    addPathPair(
      map,
      `${catNb}/${treatmentPair.slugNb}`,
      `${catEn}/${treatmentPair.slugEn}`,
    );
  }

  return map;
}
