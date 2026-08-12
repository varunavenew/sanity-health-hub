import "server-only";

import { SPECIALIST_BY_SLUG_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import {
  mapSanitySpecialistRow,
  type RawSanitySpecialist,
} from "@/lib/sanity/specialist-data";
import type { Specialist } from "@/lib/sanity/specialist-types";

/** Server-side specialist payload for RSC + hydration. */
export async function fetchSpecialistDetailData(
  slug: string,
  lang: "no" | "en",
): Promise<Specialist | null> {
  const raw = await fetchSanityGroqServer<RawSanitySpecialist | null>(
    SPECIALIST_BY_SLUG_QUERY,
    { slug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as RawSanitySpecialist;
  return mapSanitySpecialistRow(normalized, lang);
}
