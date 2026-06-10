import type { AppLocale } from "@/lib/i18n/routing";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import type { CmsRouteIndex, ResolvedCmsRoute, SlugPair } from "@/lib/routing/cms-route-types";
import {
  localizedPathsFromSlugPair,
  slugForLocale,
} from "@/lib/routing/cms-route-types";
import type { SingletonPageType } from "@/lib/routing/cms-route-types";
import { slugPairForPageType } from "@/lib/routing/nav-cms-paths";

export function buildLocalePath(locale: AppLocale | string, segments: string[]): string {
  const loc = locale === "en" ? "en" : "no";
  const path = segments.filter(Boolean).join("/");
  return path ? `/${loc}/${path}` : `/${loc}`;
}

export function pathsForSlugPair(pair: SlugPair): { nbPath: string; enPath: string } {
  return localizedPathsFromSlugPair(pair);
}

export function pathsForRoute(route: ResolvedCmsRoute): { nbPath: string; enPath: string } {
  return localizedPathsFromSlugPair(route.slugPair);
}

export async function fetchListingSlugPair(
  listingType: keyof CmsRouteIndex["listings"],
): Promise<SlugPair | null> {
  const index = await fetchCmsRouteIndex();
  return index.listings[listingType] ?? null;
}

export async function fetchSingletonLocalizedPaths(
  pageType: SingletonPageType,
): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const pair = slugPairForPageType(index, pageType);
  if (!pair) {
    throw new Error(`Missing CMS slug for singleton page type: ${pageType}`);
  }
  return localizedPathsFromSlugPair(pair);
}

export async function fetchDetailLocalizedPaths(
  listingType: keyof CmsRouteIndex["listings"],
  detailSlugNb: string,
  detailSlugEn: string,
): Promise<{ nbPath: string; enPath: string }> {
  const listing = await fetchListingSlugPair(listingType);
  if (!listing) {
    throw new Error(`Missing CMS listing slug for: ${listingType}`);
  }
  return {
    nbPath: `/no/${listing.slugNb}/${detailSlugNb}`,
    enPath: `/en/${listing.slugEn}/${detailSlugEn}`,
  };
}

export async function buildArticlePaths(articleSlugNb: string, articleSlugEn: string) {
  return fetchDetailLocalizedPaths("newsPage", articleSlugNb, articleSlugEn);
}

export async function buildClinicPaths(clinicSlugNb: string, clinicSlugEn: string) {
  return fetchDetailLocalizedPaths("clinicsPage", clinicSlugNb, clinicSlugEn);
}

export async function buildSpecialistPaths(specSlugNb: string, specSlugEn: string) {
  return fetchDetailLocalizedPaths("specialistsListingPage", specSlugNb, specSlugEn);
}

export function segmentPath(route: ResolvedCmsRoute, locale: string): string {
  return `/${slugForLocale(route.slugPair, locale === "en" ? "en" : "no") === route.slug ? route.segments.join("/") : route.segments.join("/")}`;
}
