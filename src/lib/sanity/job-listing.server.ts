import "server-only";

import { JOB_LISTING_BY_SLUG_QUERY, JOB_LISTINGS_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";

type JobListingRow = Record<string, unknown> & { _id: string };

/** Server-side job list for RSC hydration (mirrors `useJobListings`). */
export async function fetchJobListingsData(lang: "no" | "en"): Promise<JobListingRow[]> {
  const rows = await fetchSanityGroqServer<JobListingRow[] | null>(JOB_LISTINGS_QUERY, {
    lang,
  });
  return (rows || []).map((job) => {
    const data = normalizeI18n(job, lang) as JobListingRow;
    return { ...data, id: data._id };
  });
}

/** Server-side job detail for RSC hydration (mirrors `useJobListing`). */
export async function fetchJobListingBySlugData(
  slug: string,
  lang: "no" | "en",
): Promise<(JobListingRow & { id: string }) | null> {
  const raw = await fetchSanityGroqServer<JobListingRow | null>(JOB_LISTING_BY_SLUG_QUERY, {
    slug,
    lang,
  });
  if (!raw) return null;
  const data = normalizeI18n(raw, lang) as JobListingRow;
  return {
    ...data,
    id: data._id,
    pageSections: normalizePageSections(data.pageSections),
  };
}
