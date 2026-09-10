import "server-only";

import { BOOKING_PAGE_QUERY } from "@/lib/queries";
import {
  resolveBookingPageCopy,
  type BookingPageCopy,
} from "@/lib/sanity/booking-page-copy";
import { mapStep1CategoryClinicBadges } from "@/lib/sanity/booking-page-step1-clinics";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";

type BookingPageRaw = Partial<BookingPageCopy> & {
  geoSummary?: string;
  step1CategoryClinicBadges?: unknown;
};

/** Server-side booking copy for RSC hydration (mirrors `useBookingPage`). */
export async function fetchBookingPageData(
  lang: "no" | "en",
): Promise<BookingPageCopy & { geoSummary?: string }> {
  const raw = await fetchSanityGroqServer<BookingPageRaw | null>(BOOKING_PAGE_QUERY, {
    lang,
  });
  const data = raw ? (normalizeI18n(raw, lang) as BookingPageRaw) : null;
  return {
    ...resolveBookingPageCopy(data, lang),
    step1CategoryClinicBadges: mapStep1CategoryClinicBadges(
      data?.step1CategoryClinicBadges as Parameters<typeof mapStep1CategoryClinicBadges>[0],
    ),
    geoSummary: typeof data?.geoSummary === "string" ? data.geoSummary.trim() : undefined,
  };
}
