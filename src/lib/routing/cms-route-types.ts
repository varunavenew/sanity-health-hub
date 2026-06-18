/** Routable Sanity document kinds resolved from the CMS route index. */
export type CmsRouteKind =
  | "singleton"
  | "theme"
  | "listing"
  | "category"
  | "treatment"
  | "clinic"
  | "specialist"
  | "article"
  | "job"
  | "product";

export type SlugPair = { slugNb: string; slugEn: string };

export type ListingSlugs = Partial<
  Record<"newsPage" | "clinicsPage" | "specialistsListingPage" | "careersPage", SlugPair>
>;

export type RouteIndexDoc = {
  _id?: string;
  _type: string;
  slugNb?: string;
  slugEn?: string;
  categoryId?: string;
  categorySlugNb?: string;
  categorySlugEn?: string;
};

export type CmsRouteIndex = {
  listings: ListingSlugs;
  singletons: RouteIndexDoc[];
  themes: RouteIndexDoc[];
  categories: RouteIndexDoc[];
  treatments: RouteIndexDoc[];
  clinics: RouteIndexDoc[];
  specialists: RouteIndexDoc[];
  articles: RouteIndexDoc[];
  jobs: RouteIndexDoc[];
  products: RouteIndexDoc[];
};

export type ResolvedCmsRoute = {
  kind: CmsRouteKind;
  documentType: string;
  /** Slug param for GROQ detail queries */
  slug: string;
  categorySlug?: string;
  categoryId?: string;
  listingType?: string;
  /** Public URL segments (without locale) */
  segments: string[];
  slugPair: SlugPair;
};

export const SINGLETON_PAGE_TYPES = [
  "aboutPage",
  "contactPage",
  "newsPage",
  "pricingPage",
  "insurancePage",
  "servicesPage",
  "specialistsPage",
  "specialistsListingPage",
  "clinicsPage",
  "privacyPolicyPage",
  "careersPage",
] as const;

export type SingletonPageType = (typeof SINGLETON_PAGE_TYPES)[number];

export function normalizeSlugSegment(slug: string | null | undefined): string {
  if (!slug) return "";
  return slug.replace(/^\/+|\/+$/g, "");
}

export function slugForLocale(pair: SlugPair | undefined, locale: string): string {
  if (!pair) return "";
  return normalizeSlugSegment(locale === "en" ? pair.slugEn : pair.slugNb);
}

export function slugPairFromDoc(
  doc: { slugNb?: string; slugEn?: string } | null | undefined,
): SlugPair | null {
  if (!doc) return null;
  const slugNb = normalizeSlugSegment(doc.slugNb || "");
  const slugEn = normalizeSlugSegment(doc.slugEn || "");
  if (!slugNb && !slugEn) return null;
  return { slugNb: slugNb || slugEn, slugEn: slugEn || slugNb };
}

export function localizedPathsFromSlugPair(pair: SlugPair): {
  nbPath: string;
  enPath: string;
} {
  return {
    nbPath: `/no/${pair.slugNb}`,
    enPath: `/en/${pair.slugEn}`,
  };
}
