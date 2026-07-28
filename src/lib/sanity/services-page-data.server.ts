import "server-only";

import { SERVICES_PAGE_QUERY } from "@/lib/queries";
import {
  mapServicesPageDocument,
  type ServicesPageData,
} from "@/lib/sanity/services-page-data";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";

/** Server-side services page payload. */
export async function fetchServicesPageData(
  lang: "no" | "en",
): Promise<ServicesPageData | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    SERVICES_PAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapServicesPageDocument(normalized, lang);
}
