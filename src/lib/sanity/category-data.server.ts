import "server-only";

import { TREATMENT_CATEGORY_BY_SLUG_QUERY } from "@/lib/queries";
import { mapTreatmentCategoryDocument } from "@/lib/sanity/category-data";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import type { TreatmentCategoryData } from "@/lib/sanity/category-data";

/** Server-side category payload for RSC + hydration. */
export async function fetchTreatmentCategoryData(
  categorySlug: string,
  lang: "no" | "en",
): Promise<TreatmentCategoryData | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    TREATMENT_CATEGORY_BY_SLUG_QUERY,
    { slug: categorySlug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapTreatmentCategoryDocument(normalized, lang);
}
