import {
  behandlingerCategorySegment,
  normalizeCategoryFilterKey,
} from "@/lib/sanity/category-keys";

type CategoryRow = {
  categoryId?: string;
  slug?: string;
  title?: string;
  treatments?: Array<{ slug?: string; title?: string }>;
};

export type ClinicServiceLink = { label: string; path?: string };

/** Legacy clinic `services` IDs → categoryId or treatment slug in CMS. */
const SERVICE_ID_ALIASES: Record<string, string> = {
  gynekolog: "gynekologi",
  ortoped: "ortopedi",
  urolog: "urologi",
  gastrokirurg: "gastrokirurgi",
};

function categorySegment(cat: CategoryRow, lang: "no" | "en"): string {
  const slug = (cat.slug || "").trim();
  if (slug) return slug;
  const categoryId = (cat.categoryId || "").trim();
  return categoryId ? behandlingerCategorySegment(categoryId, lang) : "";
}

function treatmentPath(categorySegment: string, treatmentSlug: string): string {
  return `/behandlinger/${categorySegment}/${treatmentSlug}`;
}

/**
 * Map clinic service IDs to localized labels and `/behandlinger/…` paths from CMS categories.
 */
export function buildClinicServiceLinks(
  categories: CategoryRow[] | undefined,
  lang: "no" | "en",
): Record<string, ClinicServiceLink> {
  const map: Record<string, ClinicServiceLink> = {};
  if (!categories?.length) return map;

  for (const cat of categories) {
    const categoryId = (cat.categoryId || cat.slug || "").trim();
    if (!categoryId) continue;

    const segment = categorySegment(cat, lang);
    if (!segment) continue;

    const categoryLabel = (cat.title || "").trim() || categoryId;
    const categoryPath = `/behandlinger/${segment}`;

    map[categoryId] = { label: categoryLabel, path: categoryPath };
    map[normalizeCategoryFilterKey(categoryId)] = map[categoryId];

    const catSlug = (cat.slug || "").trim();
    if (catSlug && catSlug !== categoryId) {
      map[catSlug] = map[categoryId];
    }

    for (const treatment of cat.treatments || []) {
      const slug = (treatment.slug || "").trim();
      if (!slug) continue;
      const label = (treatment.title || "").trim() || slug;
      map[slug] = { label, path: treatmentPath(segment, slug) };
    }
  }

  for (const [alias, target] of Object.entries(SERVICE_ID_ALIASES)) {
    if (map[target]) {
      map[alias] = map[target];
      continue;
    }
    const normalized = normalizeCategoryFilterKey(target);
    if (map[normalized]) map[alias] = map[normalized];
  }

  return map;
}
