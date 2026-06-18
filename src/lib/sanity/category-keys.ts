/**
 * Stable treatment-category keys for filters (gynekologi, fertilitet, …).
 * Page routes may use EN slugs (fertility, gynecology); Sanity `categoryId` does not.
 */

/** Sanity `categoryId` for «flere fagområder» (NO slug in CMS: `ovrige`). */
export const FLERE_FAGOMRADER_CATEGORY_ID = "flere-fagomrader";

/** EN marketing slugs and aliases → internal categoryId */
const SLUG_TO_CATEGORY_ID: Record<string, string> = {
  fertility: "fertilitet",
  gynecology: "gynekologi",
  urology: "urologi",
  orthopedics: "ortopedi",
  pregnancy: "graviditet",
  "flere-fagomrader": "annet",
  ovrige: "annet",
};

/** URL segment aliases → canonical categoryId for routing (not specialist filters). */
const CATEGORY_ROUTE_ALIASES: Record<string, string> = {
  fertility: "fertilitet",
  gynecology: "gynekologi",
  urology: "urologi",
  orthopedics: "ortopedi",
  pregnancy: "graviditet",
  "flere-fagomrader": FLERE_FAGOMRADER_CATEGORY_ID,
  ovrige: FLERE_FAGOMRADER_CATEGORY_ID,
  annet: FLERE_FAGOMRADER_CATEGORY_ID,
  other: FLERE_FAGOMRADER_CATEGORY_ID,
  "more-specialties": FLERE_FAGOMRADER_CATEGORY_ID,
};

/** Normalize slug or categoryId to the key used by filters and booking. */
export function normalizeCategoryFilterKey(slugOrId: string): string {
  const key = slugOrId.trim().toLowerCase();
  if (!key) return "";
  return SLUG_TO_CATEGORY_ID[key] ?? key;
}

/** Canonical categoryId for CMS route matching (treatments, category landings). */
export function normalizeCategoryRouteKey(segment: string): string {
  const key = segment.trim().toLowerCase();
  if (!key) return "";
  return CATEGORY_ROUTE_ALIASES[key] ?? key;
}

type CategoryRouteRef = {
  categoryId?: string | null;
  slugNb?: string | null;
  slugEn?: string | null;
};

/** True when a URL category segment matches a treatmentCategory (incl. `ovrige` / `flere-fagomrader`). */
export function categoryRouteSegmentMatches(
  urlSegment: string,
  category: CategoryRouteRef,
): boolean {
  const seg = urlSegment.trim().toLowerCase();
  if (!seg) return false;

  const urlKey = normalizeCategoryRouteKey(seg);
  const catIdKey = normalizeCategoryRouteKey(category.categoryId || "");
  if (urlKey && catIdKey && urlKey === catIdKey) return true;

  for (const slug of [category.slugNb, category.slugEn]) {
    const s = (slug || "").trim().toLowerCase();
    if (!s) continue;
    if (s === seg) return true;
    if (normalizeCategoryRouteKey(s) === urlKey) return true;
  }
  return false;
}

/** Slug param for GROQ when fetching by category (prefers `categoryId`). */
export function categorySlugForFetch(segmentOrId: string): string {
  const key = normalizeCategoryRouteKey(segmentOrId);
  if (key === FLERE_FAGOMRADER_CATEGORY_ID) return FLERE_FAGOMRADER_CATEGORY_ID;
  return segmentOrId.trim().toLowerCase();
}

type CategoryRef = { categoryId?: string; slug?: string };

/** Primary filter key from a specialist's first linked treatmentCategory. */
export function resolveSpecialistPrimaryCategory(
  categories?: CategoryRef[] | null,
): string {
  const first = categories?.[0];
  if (!first) return "";
  if (first.categoryId) return normalizeCategoryFilterKey(first.categoryId);
  return normalizeCategoryFilterKey(first.slug || "");
}

/** Public category landing URL segment (locale-aware marketing paths). */
export function categoryLandingPath(
  categoryId: string,
  locale: "no" | "en" = "no",
): string {
  const noSegment: Record<string, string> = {
    [FLERE_FAGOMRADER_CATEGORY_ID]: "ovrige",
    annet: "ovrige",
  };
  const enSegment: Record<string, string> = {
    gynekologi: "gynecology",
    fertilitet: "fertility",
    urologi: "urology",
    ortopedi: "orthopedics",
    graviditet: "pregnancy",
    [FLERE_FAGOMRADER_CATEGORY_ID]: "other",
    annet: "other",
  };
  if (locale === "en" && enSegment[categoryId]) {
    return `/${enSegment[categoryId]}`;
  }
  if (noSegment[categoryId]) {
    return `/${noSegment[categoryId]}`;
  }
  return `/${categoryId}`;
}

/**
 * Treatment-category URL segment used under `/behandlinger/<segment>/...`.
 * (Same mapping as `categoryLandingPath`, but returns the raw segment without the leading slash.)
 */
export function behandlingerCategorySegment(
  categoryId: string,
  locale: "no" | "en" = "no",
): string {
  const noSegment: Record<string, string> = {
    [FLERE_FAGOMRADER_CATEGORY_ID]: "ovrige",
    annet: "ovrige",
  };
  const enSegment: Record<string, string> = {
    gynekologi: "gynecology",
    fertilitet: "fertility",
    urologi: "urology",
    ortopedi: "orthopedics",
    graviditet: "pregnancy",
    [FLERE_FAGOMRADER_CATEGORY_ID]: "other",
    annet: "other",
  };

  if (locale === "en" && enSegment[categoryId]) return enSegment[categoryId];
  if (noSegment[categoryId]) return noSegment[categoryId];
  return categoryId;
}

export function specialistMatchesCategory(
  specialist: {
    category: string;
    sanityCategories?: Array<{ categoryId: string }>;
  },
  categoryId: string,
): boolean {
  const key = normalizeCategoryFilterKey(categoryId);
  if (!key || key === "alle") return true;
  if (normalizeCategoryFilterKey(specialist.category) === key) return true;
  return (
    specialist.sanityCategories?.some(
      (c) => normalizeCategoryFilterKey(c.categoryId) === key,
    ) ?? false
  );
}
