import "server-only";

import { HOMEPAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { mapHomepageDocument, type HomepageData } from "@/lib/sanity/homepage-data";
import { sanityClient } from "@/lib/sanityClient";

/**
 * Server-side homepage payload for RSC + React Query hydration.
 * Always hits Sanity directly (no unstable_cache) so Vercel matches local `next dev`.
 */
export async function fetchHomepageData(
  lang: "no" | "en",
): Promise<HomepageData | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    HOMEPAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  return mapHomepageDocument(normalizeI18n(raw, lang) as Record<string, unknown>, lang);
}
