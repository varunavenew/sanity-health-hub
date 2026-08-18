import {
  buildBookingUrl,
  categoryNumericIdToPageId,
  categoryPageIdToNumericId,
  slugifyNo,
} from "@/lib/bookingLinks";

/** Metodika wbactivitygroup for «Fostermedisiner - graviditet». */
const FOSTERMEDISIN_BOOKING_GROUP_ID =
  categoryPageIdToNumericId.graviditet ?? 10;

export function resolveSpecialistBookingCategoryIds(specialist: {
  bookingCategoryIds?: number[];
}): number[] {
  const fromSanity = specialist.bookingCategoryIds?.filter(
    (id) => typeof id === "number" && Number.isFinite(id) && id > 0,
  );
  if (!fromSanity || fromSanity.length === 0) return [];
  return [...new Set(fromSanity)]
    .filter((id) => id !== FOSTERMEDISIN_BOOKING_GROUP_ID)
    .sort((a, b) => a - b);
}

export function isFetalMedicineBookingCategory(category: {
  id?: string;
  clinicServiceId?: string;
}): boolean {
  const id = (category.id || "").trim().toLowerCase();
  const clinicId = (category.clinicServiceId || "").trim().toLowerCase();
  return (
    clinicId === "fostermedisiner" ||
    id === "fostermedisiner" ||
    id === "fostermedisiner-graviditet"
  );
}

/** Never show «Fostermedisiner - graviditet» on specialist profile booking. */
export function filterSpecialistBookingCategories<
  T extends { apiGroupId: number; id?: string; clinicServiceId?: string },
>(
  specialist: {
    bookingCategoryIds?: number[];
  },
  categories: T[],
): T[] {
  const allowedIds = new Set(resolveSpecialistBookingCategoryIds(specialist));
  return categories.filter((category) => {
    if (!allowedIds.has(category.apiGroupId)) return false;
    if (isFetalMedicineBookingCategory(category)) return false;
    return true;
  });
}

export function bookingUrlForSpecialistContext(params: {
  specialistSlug?: string;
  apiGroupId?: number;
  kategoriId?: number;
  /** Metodika category slug from activity-groups (e.g. handterapeut). */
  kategori?: string;
  tjeneste?: string;
  /** Clinic slug when the specialist works at a known location. */
  klinikk?: string;
}): string {
  const kategoriId = params.kategoriId ?? params.apiGroupId;
  const kategori =
    params.kategori ??
    (kategoriId != null ? categoryNumericIdToPageId[kategoriId] : undefined);
  return buildBookingUrl({
    kategori,
    kategoriId,
    spesialist: params.specialistSlug,
    tjeneste: params.tjeneste ? slugifyNo(params.tjeneste) : undefined,
    klinikk: params.klinikk,
  });
}

/** Prefer a single clinic slug from Sanity when the specialist only works at one place. */
export function clinicSlugForSpecialistBooking(specialist: {
  clinicRefs?: Array<{ slug?: string; label?: string }>;
  clinics?: string[];
}): string | undefined {
  const refs = specialist.clinicRefs?.filter((r) => r.slug?.trim() || r.label?.trim()) ?? [];
  if (refs.length === 1) {
    return refs[0].slug?.trim() || slugifyNo(refs[0].label ?? "");
  }
  if (refs.length === 0 && specialist.clinics?.length === 1) {
    return slugifyNo(specialist.clinics[0]);
  }
  return undefined;
}

export function formatBookingServicePrice(price: string): string {
  const n = parseInt(price.replace(/\s/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return "Gratis";
  return `${n.toLocaleString("nb-NO")},-`;
}
