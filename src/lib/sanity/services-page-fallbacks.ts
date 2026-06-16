import {
  behandlingerCategorySegment,
  categoryLandingPath,
} from "@/lib/sanity/category-keys";
import { sortBySortOrder } from "@/lib/sortAlphabetical";
import { serviceCategories as staticServiceCategories } from "@/data/serviceCategories";
import type { ServicesPageListItem } from "@/lib/sanity/services-page-data";

const FEATURED_CATEGORY_IDS = new Set(["gynekologi", "urologi", "fertilitet"]);

type CategoryRow = {
  categoryId?: string;
  slug?: string;
  title?: string;
  sortOrder?: unknown;
  treatments?: Array<{ title?: string; slug?: string; sortOrder?: unknown }>;
};

function treatmentPath(categoryId: string, slug: string, lang: "no" | "en"): string {
  return `/behandlinger/${behandlingerCategorySegment(categoryId, lang)}/${slug}`;
}

/** Same rules as the pre-Sanity Services page: non-featured categories + flere-fagområder treatments. */
export function buildMoreServicesFromCategories(
  categories: CategoryRow[],
  lang: "no" | "en",
): ServicesPageListItem[] {
  const items: ServicesPageListItem[] = [];

  for (const cat of sortBySortOrder(
    categories,
    (c) => c.sortOrder,
    (c) => c.title || c.categoryId || c.slug,
    lang,
  )) {
    const id = (cat.categoryId || cat.slug || "").trim();
    if (!id || FEATURED_CATEGORY_IDS.has(id)) continue;

    const isFlere =
      id === "flere-fagomrader" || id === "flere" || id === "annet";

    if (isFlere) {
      for (const t of sortBySortOrder(
        cat.treatments || [],
        (row) => row.sortOrder,
        (row) => row.title || row.slug,
        lang,
      )) {
        const slug = (t.slug || "").trim();
        const title = (t.title || "").trim();
        if (!title || !slug) continue;
        items.push({ title, path: treatmentPath(id, slug, lang) });
      }
      continue;
    }

    items.push({
      title: (cat.title || id).trim(),
      path: categoryLandingPath(id, lang),
    });
  }

  return items.filter((item) => item.path);
}

/** Offline fallback when Sanity categories are unavailable. */
export function buildMoreServicesFromStaticCategories(
  lang: "no" | "en",
): ServicesPageListItem[] {
  const rows: CategoryRow[] = staticServiceCategories.map((cat) => ({
    categoryId: cat.id,
    title: cat.label,
    treatments: cat.subcategories.map((sub) => ({
      title: sub.label,
      slug: sub.path?.split("/").pop() || "",
    })),
  }));
  return buildMoreServicesFromCategories(rows, lang);
}
