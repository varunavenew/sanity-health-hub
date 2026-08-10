import "server-only";

import { SPECIALISTS_LISTING_PAGE_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { withPageSections } from "@/lib/sanity/page-sections";
import {
  parseSpecialistProfileUi,
  type SpecialistProfileUi,
} from "@/lib/sanity/specialist-profile-ui";

/** Server-side specialists-listing-page payload for RSC + hydration (mirrors `useSpecialistsListingPage`). */
export async function fetchSpecialistsListingPageData(lang: "no" | "en") {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    SPECIALISTS_LISTING_PAGE_QUERY,
    { lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown> & {
    profileUi?: Partial<SpecialistProfileUi>;
  };
  return withPageSections({
    ...normalized,
    profileUi: parseSpecialistProfileUi(normalized.profileUi, lang),
  });
}
