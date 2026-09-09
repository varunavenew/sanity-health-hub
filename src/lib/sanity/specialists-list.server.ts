import "server-only";

import { LISTING_SORT_SETTINGS_QUERY, SPECIALISTS_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import {
  mapSanitySpecialistRow,
  type RawSanitySpecialist,
} from "@/lib/sanity/specialist-data";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { applyListingSort } from "@/lib/sanity/sort-utils";

/** Server-side specialists list for RSC hydration (mirrors `useSpecialists`). */
export async function fetchSpecialistsListData(
  lang: "no" | "en",
): Promise<Specialist[]> {
  const [rows, sortSettings] = await Promise.all([
    fetchSanityGroqServer<RawSanitySpecialist[]>(SPECIALISTS_QUERY, { lang }),
    fetchSanityGroqServer<{ specialistsSort?: string } | null>(
      LISTING_SORT_SETTINGS_QUERY,
      { lang },
    ),
  ]);

  const mapped = (rows || [])
    .map((row) =>
      mapSanitySpecialistRow(
        normalizeI18n(row, lang) as RawSanitySpecialist,
        lang,
      ),
    )
    .filter((row): row is Specialist => row !== null);

  return applyListingSort(
    mapped,
    sortSettings?.specialistsSort,
    lang,
    (s) => s.name,
    (s) => s.sortOrder,
    (s) => s._createdAt,
  );
}
