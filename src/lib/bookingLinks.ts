// Centralized booking URL builder + URL param parser.
// Lets any CTA across the site link directly into the booking flow
// at the most relevant step, so the user never has to start over.
//
// Supported params:
//   ?kategori=gynekologi        — pre-selects service category
//   &tjeneste=endometriose      — pre-selects a specific service (slug or fragment of name)
//   &spesialist=dr-hansen       — pre-selects a specialist (slug)
//   &klinikk=majorstuen         — pre-selects a clinic
//
// All params are optional. BookingDemo will jump to the first unfilled step.

export interface BookingLinkParams {
  kategori?: string;     // category page id (gynekologi, urologi, fertilitet, ortopedi, graviditet, flere-fagomrader)
  tjeneste?: string;     // service slug or partial name match
  spesialist?: string;   // specialist slug
  klinikk?: string;      // clinic id (majorstuen, bekkestua, moss, moelv)
}

/**
 * Map from category-page ID (used in URLs) to booking service category ID.
 */
export const categoryPageToBookingId: Record<string, string> = {
  gynekologi: "gynekolog",
  urologi: "urolog",
  fertilitet: "fertilitet",
  ortopedi: "ortoped",
  graviditet: "fostermedisiner",
};

/** Category pages with a dedicated booking API group (used in patient journey step 01). */
export const categoryPageBookingConfig: Record<
  string,
  { clinicServiceId: string; showAllApiCategories?: boolean }
> = {
  gynekologi: { clinicServiceId: "gynekolog" },
  urologi: { clinicServiceId: "urolog" },
  fertilitet: { clinicServiceId: "fertilitet" },
  ortopedi: { clinicServiceId: "ortoped" },
  graviditet: { clinicServiceId: "fostermedisiner" },
  "flere-fagomrader": { clinicServiceId: "", showAllApiCategories: true },
};

export type BookingCategoryMatch = {
  id: string;
  clinicServiceId?: string;
  label: string;
  services: {
    name: string;
    price: string;
    duration?: string;
    apiActivityId?: number;
  }[];
};

/**
 * Resolve a category-page id (gynekologi) to a booking API category.
 */
export function findBookingCategoryForPage(
  categoryPageId: string,
  categories: BookingCategoryMatch[],
): BookingCategoryMatch | undefined {
  const clinicId = categoryPageToBookingId[categoryPageId] ?? categoryPageId;
  return categories.find(
    (c) => c.clinicServiceId === clinicId || c.id === clinicId,
  );
}

/** Map clinic service id from API to human-readable category page id in booking URLs. */
export function bookingCategoryPageIdForClinicService(clinicServiceId: string): string {
  return bookingIdToCategoryPage[clinicServiceId] ?? clinicServiceId;
}

/**
 * Reverse map: booking service category ID → category-page ID.
 */
export const bookingIdToCategoryPage: Record<string, string> = Object.entries(
  categoryPageToBookingId
).reduce<Record<string, string>>((acc, [page, booking]) => {
  acc[booking] = page;
  return acc;
}, {});

/**
 * Map specialist.category → booking service category ID.
 * Used when a specialist CTA only has a category (no specific service).
 */
export const specialistCategoryToBookingId: Record<string, string> = {
  gynekologi: "gynekolog",
  fertilitet: "fertilitet",
  urologi: "urolog",
  ortopedi: "ortoped",
  annet: "", // no auto-mapping
};

/**
 * Build a booking URL from structured params.
 * Empty/undefined values are dropped.
 */
export function buildBookingUrl(params: BookingLinkParams = {}): string {
  const sp = new URLSearchParams();
  if (params.kategori) sp.set("kategori", params.kategori);
  if (params.tjeneste) sp.set("tjeneste", params.tjeneste);
  if (params.spesialist) sp.set("spesialist", params.spesialist);
  if (params.klinikk) sp.set("klinikk", params.klinikk);
  const qs = sp.toString();
  return qs ? `/booking?${qs}` : "/booking";
}

/**
 * Convenience: build URL from a specialist object.
 * Pre-selects category (so service step skips) and specialist.
 */
export function bookingUrlForSpecialist(specialist: {
  slug?: string;
  category?: string;
}): string {
  if (!specialist?.slug) return "/booking";
  const bookingCategoryId = specialist.category
    ? specialistCategoryToBookingId[specialist.category]
    : undefined;
  // We pass kategori as the *category-page* id (gynekologi, not gynekolog),
  // because the prefill logic translates it back. Keeps URLs human-readable.
  const kategori = bookingCategoryId
    ? bookingIdToCategoryPage[bookingCategoryId]
    : undefined;
  return buildBookingUrl({ kategori, spesialist: specialist.slug });
}

/**
 * Convenience: build URL from a treatment context.
 * categoryId is the category-page id (e.g. "gynekologi").
 * tjeneste is an optional slug or name fragment.
 */
export function bookingUrlForTreatment(
  categoryId: string,
  tjeneste?: string
): string {
  return buildBookingUrl({ kategori: categoryId, tjeneste });
}

/**
 * Convenience: build URL from a clinic id.
 */
export function bookingUrlForClinic(clinicId: string): string {
  return buildBookingUrl({ klinikk: clinicId });
}

/**
 * Slugify Norwegian text for fuzzy matching of service names.
 */
export function slugifyNo(input: string): string {
  return input
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
