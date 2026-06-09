import { CMS_ROUTE_INDEX_QUERY } from "@/lib/queries";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";

export async function fetchCmsRouteIndex(): Promise<CmsRouteIndex> {
  return sanityFetchCached<CmsRouteIndex>({
    query: CMS_ROUTE_INDEX_QUERY,
    key: ["sanity", "cmsRouteIndex", CMS_ROUTE_INDEX_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.cmsRouteIndex],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

/** @deprecated */
export const fetchCmsPageSlugIndex = fetchCmsRouteIndex;
