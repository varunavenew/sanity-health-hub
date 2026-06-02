/**
 * Stable treatment-category keys for filters (gynekologi, fertilitet, …).
 * Page routes may use EN slugs (fertility, gynecology); Sanity `categoryId` does not.
 */

/** EN marketing slugs and aliases → internal categoryId */
const SLUG_TO_CATEGORY_ID: Record<string, string> = {
  fertility: "fertilitet",
  gynecology: "gynekologi",
  urology: "urologi",
  orthopedics: "ortopedi",
  pregnancy: "graviditet",
  "flere-fagomrader": "annet",
};

/** Normalize slug or categoryId to the key used by filters and booking. */
export function normalizeCategoryFilterKey(slugOrId: string): string {
  const key = slugOrId.trim().toLowerCase();
  if (!key) return "";
  return SLUG_TO_CATEGORY_ID[key] ?? key;
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
  const enSegment: Record<string, string> = {
    gynekologi: "gynecology",
    fertilitet: "fertility",
    urologi: "urology",
  };
  if (locale === "en" && enSegment[categoryId]) {
    return `/${enSegment[categoryId]}`;
  }
  return `/${categoryId}`;
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
