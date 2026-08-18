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
import { fertilitetTreatmentSlugCandidates } from "@/lib/sanity/fertilitet-slug-aliases";
import { gynekologiTreatmentSlugCandidates } from "@/lib/sanity/gynekologi-slug-aliases";
import { graviditetTreatmentSlugCandidates } from "@/lib/sanity/graviditet-slug-aliases";
import { urologiTreatmentSlugCandidates } from "@/lib/sanity/urologi-slug-aliases";
import { ortopediTreatmentSlugCandidates } from "@/lib/sanity/ortopedi-slug-aliases";
import {
  flereFagomraderTreatmentSlugCandidates,
} from "@/lib/sanity/flere-fagomrader-slug-aliases";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";

/** Server-side treatment payload for RSC + hydration. */
export async function fetchTreatmentData(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<TreatmentData | null> {
  const categoryKey = normalizeCategoryRouteKey(categorySlug) || categorySlug;
  const slugCandidates =
    categoryKey === FLERE_FAGOMRADER_CATEGORY_ID
      ? flereFagomraderTreatmentSlugCandidates(treatmentSlug)
      : categoryKey === "urologi"
        ? urologiTreatmentSlugCandidates(treatmentSlug)
        : categoryKey === "ortopedi"
          ? ortopediTreatmentSlugCandidates(treatmentSlug)
          : categoryKey === "gynekologi"
            ? gynekologiTreatmentSlugCandidates(treatmentSlug)
            : categoryKey === "fertilitet"
              ? fertilitetTreatmentSlugCandidates(treatmentSlug)
              : categoryKey === "graviditet"
                ? graviditetTreatmentSlugCandidates(treatmentSlug)
                : [treatmentSlug];

  let raw: Record<string, unknown> | null = null;
  let resolvedSlug = slugCandidates[0] || treatmentSlug;
  for (const candidate of slugCandidates) {
    raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
      TREATMENT_BY_SLUG_QUERY,
      {
        categorySlug: categorySlugForFetch(categorySlug),
        treatmentSlug: candidate,
        lang,
      },
    );
    if (raw) {
      resolvedSlug = candidate;
      break;
    }
  }
  if (!raw) return null;
  const normalized = normalizeI18nStrict(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized, lang);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = resolvedSlug;
  }
  return mapped;
}
