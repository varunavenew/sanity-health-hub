import type { ListingSlugs, SlugPair } from "@/lib/routing/cms-route-types";
import { slugPairFromDoc } from "@/lib/routing/cms-route-types";

/** Used when listing documents exist in Sanity but slug fields are not seeded yet. */
export const DEFAULT_LISTING_SLUGS: Required<ListingSlugs> = {
  newsPage: { slugNb: "aktuelt", slugEn: "news" },
  clinicsPage: { slugNb: "klinikker", slugEn: "clinics" },
  specialistsListingPage: { slugNb: "spesialister", slugEn: "specialists" },
  careersPage: { slugNb: "karriere", slugEn: "careers" },
};

export function listingSlugPair(
  listings: ListingSlugs,
  key: keyof ListingSlugs,
): SlugPair {
  return slugPairFromDoc(listings[key]) ?? DEFAULT_LISTING_SLUGS[key];
}
