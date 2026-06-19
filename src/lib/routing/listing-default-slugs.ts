import type { ListingSlugs, SlugPair } from "@/lib/routing/cms-route-types";
import { slugPairFromDoc } from "@/lib/routing/cms-route-types";

/** Listing singleton types whose slugs prefix nested routes (articles, clinics, etc.). */
export const LISTING_PAGE_KEYS = [
  "newsPage",
  "clinicsPage",
  "specialistsListingPage",
  "careersPage",
] as const;

export type ListingPageKey = (typeof LISTING_PAGE_KEYS)[number];

/** Resolve listing URL prefix from CMS only (no hardcoded fallbacks). */
export function listingSlugPair(
  listings: ListingSlugs,
  key: ListingPageKey,
): SlugPair | null {
  return slugPairFromDoc(listings[key]);
}
