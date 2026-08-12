import "server-only";

import { CLINIC_BY_SLUG_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizeClinicRow } from "@/lib/sanity/clinic-list-row";
import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import { normalizePageSections } from "@/lib/sanity/page-sections";

/** Server-side clinic detail payload for RSC + hydration (mirrors `useClinic`). */
export async function fetchClinicDetailData(
  slug: string,
  lang: "no" | "en",
): Promise<Record<string, unknown> | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    CLINIC_BY_SLUG_QUERY,
    { slug, lang },
  );
  if (!raw) return null;
  const data = normalizeI18n(raw, lang) as Record<string, unknown>;
  return {
    ...data,
    ...normalizeClinicRow(data),
    faqs: resolveFaqsFromCollection(data.faqCollection, data.faqs),
    pageSections: normalizePageSections(data.pageSections),
  };
}
