import "server-only";

import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
import {
  categorySlugForFetch,
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";
import {
  mapTreatmentDocument,
  type TreatmentData,
} from "@/lib/sanity/treatment-data";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { resolveGynekologiTreatmentSlug } from "@/lib/sanity/gynekologi-slug-aliases";
import { resolveGraviditetTreatmentSlug } from "@/lib/sanity/graviditet-slug-aliases";
import { resolveFlereFagomraderTreatmentSlug } from "@/lib/sanity/flere-fagomrader-slug-aliases";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";

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
      : categoryKey === "gynekologi"
        ? resolveGynekologiTreatmentSlug(treatmentSlug)
        : categoryKey === "graviditet"
          ? resolveGraviditetTreatmentSlug(treatmentSlug)
          : categoryKey === FLERE_FAGOMRADER_CATEGORY_ID
            ? resolveFlereFagomraderTreatmentSlug(treatmentSlug)
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
  const mapped = mapTreatmentDocument(normalized, lang);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = resolvedSlug;
  }
  return mapped;
}
