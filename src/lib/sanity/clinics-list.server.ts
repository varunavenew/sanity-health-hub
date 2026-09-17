import "server-only";

import { CLINICS_QUERY, LISTING_SORT_SETTINGS_QUERY } from "@/lib/queries";
import {
  normalizeClinicRow,
  type SanityClinicListRow,
} from "@/lib/sanity/clinic-list-row";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { applyListingSort } from "@/lib/sanity/sort-utils";
import { dedupeBySlug, filterPublishedDocuments } from "@/lib/sanity/published-docs";

/** Server-side clinics list for booking step 1 RSC hydration (mirrors `useClinics`). */
export async function fetchClinicsListServer(
  lang: "no" | "en",
): Promise<SanityClinicListRow[]> {
  const [clinics, sortSettings] = await Promise.all([
    fetchSanityGroqServer<unknown[]>(CLINICS_QUERY, { lang }),
    fetchSanityGroqServer<{ clinicsSort?: string } | null>(
      LISTING_SORT_SETTINGS_QUERY,
      { lang },
    ),
  ]);

  const published = filterPublishedDocuments(clinics || [])
    .map((c) => normalizeClinicRow(c as Record<string, unknown>))
    .filter((c) => c.label && c.address);
  const deduped = dedupeBySlug(published);

  return applyListingSort(
    deduped,
    sortSettings?.clinicsSort,
    lang,
    (c) => c.label,
    (c) => c.sortOrder,
    (c) => c._createdAt,
  );
}
