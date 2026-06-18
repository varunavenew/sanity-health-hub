import type { NavRouteId } from "@/lib/i18n/nav-paths";
import type {
  CmsRouteIndex,
  SingletonPageType,
  SlugPair,
} from "@/lib/routing/cms-route-types";
import {
  slugForLocale,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";

type NavCmsSource =
  | { kind: "singleton"; pageType: string }
  | { kind: "listing"; listingKey: keyof CmsRouteIndex["listings"] };

/** Maps stable nav keys to CMS documents that own the public URL slug. */
export const NAV_CMS_SOURCES: Partial<Record<NavRouteId, NavCmsSource>> = {
  services: { kind: "singleton", pageType: "servicesPage" },
  pricing: { kind: "singleton", pageType: "pricingPage" },
  insurance: { kind: "singleton", pageType: "insurancePage" },
  news: { kind: "listing", listingKey: "newsPage" },
  about: { kind: "singleton", pageType: "aboutPage" },
  clinics: { kind: "listing", listingKey: "clinicsPage" },
  contact: { kind: "singleton", pageType: "contactPage" },
  specialists: { kind: "listing", listingKey: "specialistsListingPage" },
};

export function navIdForPageType(pageType: string): NavRouteId | undefined {
  return Object.entries(NAV_CMS_SOURCES).find(([, source]) => {
    if (source?.kind === "singleton" && source.pageType === pageType) return true;
    if (source?.kind === "listing" && source.listingKey === pageType) return true;
    return false;
  })?.[0] as NavRouteId | undefined;
}

/** Resolve slug pair for a singleton/listing page type from the route index. */
export function slugPairForPageType(
  index: CmsRouteIndex,
  pageType: SingletonPageType,
): SlugPair | null {
  const singleton = index.singletons.find((row) => row._type === pageType);
  const fromSingleton = slugPairFromDoc(singleton);
  if (fromSingleton) return fromSingleton;

  const listing = index.listings[pageType as keyof CmsRouteIndex["listings"]];
  const fromListing = slugPairFromDoc(listing);
  if (fromListing) return fromListing;

  const navId = navIdForPageType(pageType);
  return navId ? slugPairForNavId(index, navId) : null;
}

export function slugPairForNavId(
  index: CmsRouteIndex,
  navId: NavRouteId,
): SlugPair | null {
  const source = NAV_CMS_SOURCES[navId];
  if (!source) return null;

  if (source.kind === "listing") {
    const pair = index.listings[source.listingKey];
    if (!pair?.slugNb && !pair?.slugEn) return null;
    return {
      slugNb: pair.slugNb || pair.slugEn,
      slugEn: pair.slugEn || pair.slugNb,
    };
  }

  const doc = index.singletons.find((row) => row._type === source.pageType);
  return slugPairFromDoc(doc);
}

export function pathsForNavId(
  index: CmsRouteIndex,
  navId: NavRouteId,
): { nb: string; en: string } | null {
  const pair = slugPairForNavId(index, navId);
  if (!pair) return null;
  return {
    nb: `/${pair.slugNb}`,
    en: `/${pair.slugEn}`,
  };
}

export function pathForNavId(
  index: CmsRouteIndex,
  navId: NavRouteId,
  locale: string,
): string {
  const pair = slugPairForNavId(index, navId);
  if (!pair) return "";
  const slug = slugForLocale(pair, locale === "en" ? "en" : "no");
  return slug ? `/${slug}` : "";
}
