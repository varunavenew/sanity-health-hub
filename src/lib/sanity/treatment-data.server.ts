import "server-only";

import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
import { categorySlugForFetch } from "@/lib/sanity/category-keys";
import {
  mapTreatmentDocument,
  type TreatmentData,
} from "@/lib/sanity/treatment-data";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";
import { normalizeCategoryRouteKey } from "@/lib/sanity/category-keys";

/** Server-side treatment payload for RSC + hydration. */
export async function fetchTreatmentData(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<TreatmentData | null> {
  const categoryKey = normalizeCategoryRouteKey(categorySlug) || categorySlug;
  const resolvedSlug =
    categoryKey === "fertilitet"
      ? resolveFertilitetTreatmentSlug(treatmentSlug)
      : treatmentSlug;
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    TREATMENT_BY_SLUG_QUERY,
    {
      categorySlug: categorySlugForFetch(categorySlug),
      treatmentSlug: resolvedSlug,
      lang,
    },
  );
  if (!raw) return null;
  const normalized = normalizeI18nStrict(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = resolvedSlug;
  }
  return mapped;
}
