import "server-only";

import { CLINICIAN_GUIDE_PAGE_QUERY } from "@/lib/queries";
import {
  mapClinicianGuidePage,
  type ClinicianGuidePageData,
  type ClinicianGuideRaw,
} from "@/lib/sanity/clinician-guide-data";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";

/** Server-side clinician guide payload for RSC + hydration (mirrors `useClinicianGuidePage`). */
export async function fetchClinicianGuidePageData(
  slug: string,
  lang: "no" | "en",
): Promise<ClinicianGuidePageData | null> {
  const raw = await fetchSanityGroqServer<ClinicianGuideRaw | null>(
    CLINICIAN_GUIDE_PAGE_QUERY,
    { slug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as ClinicianGuideRaw;
  return mapClinicianGuidePage(normalized, slug);
}
