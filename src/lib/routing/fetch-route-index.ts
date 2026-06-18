import { CMS_ROUTE_INDEX_QUERY, NAV_PATHS_FOR_ROUTE_INDEX_QUERY } from "@/lib/queries";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import {
  enrichRouteIndexWithNavPaths,
  type NavPathSource,
} from "@/lib/routing/enrich-route-index";
import { sanityClient } from "@/lib/sanityClient";

const ROUTE_INDEX_REVALIDATE = SANITY_DATA_REVALIDATE_SEC.singletonPage;

async function fetchRouteIndexFresh(): Promise<CmsRouteIndex> {
  const [index, navItems] = await Promise.all([
    sanityClient.fetch<CmsRouteIndex>(CMS_ROUTE_INDEX_QUERY),
    sanityClient.fetch<NavPathSource[]>(NAV_PATHS_FOR_ROUTE_INDEX_QUERY),
  ]);
  return enrichRouteIndexWithNavPaths(index, navItems ?? []);
}

export async function fetchCmsRouteIndex(): Promise<CmsRouteIndex> {
  if (process.env.NODE_ENV === "development") {
    return fetchRouteIndexFresh();
  }

  const [index, navItems] = await Promise.all([
    sanityFetchCached<CmsRouteIndex>({
      query: CMS_ROUTE_INDEX_QUERY,
      key: ["sanity", "cmsRouteIndex", CMS_ROUTE_INDEX_QUERY],
      tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.cmsRouteIndex],
      revalidate: ROUTE_INDEX_REVALIDATE,
    }),
    sanityFetchCached<NavPathSource[]>({
      query: NAV_PATHS_FOR_ROUTE_INDEX_QUERY,
      key: ["sanity", "navPathsForRouteIndex", NAV_PATHS_FOR_ROUTE_INDEX_QUERY],
      tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.cmsRouteIndex],
      revalidate: ROUTE_INDEX_REVALIDATE,
    }),
  ]);

  return enrichRouteIndexWithNavPaths(index, navItems ?? []);
}

/** @deprecated */
export const fetchCmsPageSlugIndex = fetchCmsRouteIndex;
