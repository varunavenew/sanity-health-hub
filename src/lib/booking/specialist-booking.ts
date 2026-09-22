import {
  buildBookingUrl,
  categoryNumericIdToPageId,
  categoryPageIdToNumericId,
  slugifyNo,
} from "@/lib/bookingLinks";

/** Metodika wbactivitygroup for «Fostermedisiner - graviditet». */
const FOSTERMEDISIN_BOOKING_GROUP_ID =
  categoryPageIdToNumericId.graviditet ?? 10;

const SITE_CATEGORY_TO_BOOKING_GROUP_IDS: Record<string, number[]> = {
  fertilitet: [categoryPageIdToNumericId.fertilitet ?? 1].filter(Boolean),
  gynekologi: [categoryPageIdToNumericId.gynekologi ?? 8].filter(Boolean),
  urologi: [categoryPageIdToNumericId.urologi ?? 6].filter(Boolean),
  ortopedi: [
    categoryPageIdToNumericId.ortopedi ?? 17,
    categoryPageIdToNumericId.handterapeut ?? 36,
  ].filter(Boolean),
};

function normalizeRoleText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Infer Metodika activity groups from role text when CMS ids are missing. */
function bookingGroupIdsFromRoleText(title?: string, subtitle?: string): number[] {
  const text = normalizeRoleText(`${title ?? ""} ${subtitle ?? ""}`);
  const ids = new Set<number>();

  if (text.includes("gynekolog")) ids.add(categoryPageIdToNumericId.gynekologi ?? 8);
  if (
    text.includes("fertilitet") ||
    text.includes("embryolog") ||
    text.includes("sykepleier")
  ) {
    ids.add(categoryPageIdToNumericId.fertilitet ?? 1);
  }
  if (text.includes("urolog")) ids.add(categoryPageIdToNumericId.urologi ?? 6);
  if (text.includes("ortoped") || text.includes("handkirurg")) {
    ids.add(categoryPageIdToNumericId.ortopedi ?? 17);
  }
  if (text.includes("handterapeut")) ids.add(categoryPageIdToNumericId.handterapeut ?? 36);

  return [...ids].filter((id) => Number.isFinite(id) && id > 0);
}

function finalizeBookingCategoryIds(ids: number[]): number[] {
  return [...new Set(ids)]
    .filter((id) => id !== FOSTERMEDISIN_BOOKING_GROUP_ID)
    .sort((a, b) => a - b);
}

export function resolveSpecialistBookingCategoryIds(specialist: {
  bookingCategoryIds?: number[];
  category?: string;
  sanityCategories?: Array<{ slug?: string; categoryId?: string }>;
  title?: string;
  subtitle?: string;
}): number[] {
  const fromSanity = specialist.bookingCategoryIds?.filter(
    (id) => typeof id === "number" && Number.isFinite(id) && id > 0,
  );
  if (fromSanity && fromSanity.length > 0) {
    return finalizeBookingCategoryIds(fromSanity);
  }

  const inferred = new Set<number>();
  const categorySlugs = new Set<string>();
  if (specialist.category?.trim()) {
    categorySlugs.add(specialist.category.trim().toLowerCase());
  }
  for (const row of specialist.sanityCategories ?? []) {
    if (row.slug?.trim()) categorySlugs.add(row.slug.trim().toLowerCase());
    if (row.categoryId?.trim()) categorySlugs.add(row.categoryId.trim().toLowerCase());
  }
  for (const slug of categorySlugs) {
    for (const id of SITE_CATEGORY_TO_BOOKING_GROUP_IDS[slug] ?? []) {
      inferred.add(id);
    }
  }
  for (const id of bookingGroupIdsFromRoleText(specialist.title, specialist.subtitle)) {
    inferred.add(id);
  }

  return finalizeBookingCategoryIds([...inferred]);
}

/** wbactivity ids on the profile (Sanity groups × caregiver matrix) for slot probes. */
export function profileWbActivityIdsForSpecialist<
  T extends { apiGroupId: number; services: Array<{ apiActivityId?: number }> },
>(
  specialist: Parameters<typeof filterSpecialistBookingCategories>[0],
  metodikaCategories: T[],
  allowedIds: Set<number>,
): number[] {
  if (allowedIds.size === 0) return [];
  const ids = new Set<number>();
  for (const category of filterSpecialistBookingCategories(
    specialist,
    metodikaCategories,
  )) {
    for (const service of filterServicesForCaregiverWbActivities(
      category.services,
      allowedIds,
    )) {
      if (service.apiActivityId != null) ids.add(service.apiActivityId);
    }
  }
  return [...ids].sort((a, b) => a - b);
}

export function isFetalMedicineBookingCategory(category: {
  id?: string;
  clinicServiceId?: string;
}): boolean {
  const id = (category.id || "").trim().toLowerCase();
  const clinicId = (category.clinicServiceId || "").trim().toLowerCase();
  return (
    clinicId === "fostermedisiner" ||
    clinicId === "graviditet" ||
    id === "fostermedisiner" ||
    id === "graviditet" ||
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
  /** Metodika wbactivity id — resolves service and skips to time step when combined with specialist + clinic. */
  aktivitetId?: number;
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
    aktivitetId: params.aktivitetId,
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

/** Keep only services the caregiver is configured to perform in Metodika. */
export function filterServicesForCaregiverWbActivities<
  T extends { apiActivityId?: number },
>(services: T[], allowedWbActivityIds: Set<number>): T[] {
  if (allowedWbActivityIds.size === 0) return [];
  return services.filter(
    (service) =>
      service.apiActivityId != null &&
      allowedWbActivityIds.has(service.apiActivityId),
  );
}
