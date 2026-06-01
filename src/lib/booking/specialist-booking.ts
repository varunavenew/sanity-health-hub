import type { Specialist } from "@/data/specialists";
import {
  buildBookingUrl,
  categoryNumericIdToPageId,
  slugifyNo,
} from "@/lib/bookingLinks";

/** Fallback when Sanity/static specialist has no bookingCategoryIds (site category slug). */
export const siteCategoryToBookingCategoryIds: Record<string, number[]> = {
  gynekologi: [8, 10],
  fertilitet: [1],
  urologi: [6],
  ortopedi: [17, 36],
  graviditet: [10],
  "flere-fagomrader": [23],
  annet: [],
};

export function resolveSpecialistBookingCategoryIds(specialist: {
  bookingCategoryIds?: number[];
  category?: string;
}): number[] {
  const fromSanity = specialist.bookingCategoryIds?.filter(
    (id) => typeof id === "number" && Number.isFinite(id) && id > 0,
  );
  if (fromSanity && fromSanity.length > 0) {
    return [...new Set(fromSanity)].sort((a, b) => a - b);
  }
  const category = specialist.category ?? "";
  return siteCategoryToBookingCategoryIds[category] ?? [];
}

export function bookingUrlForSpecialistContext(params: {
  specialistSlug?: string;
  apiGroupId?: number;
  kategoriId?: number;
  tjeneste?: string;
}): string {
  const kategoriId = params.kategoriId ?? params.apiGroupId;
  const kategori =
    kategoriId != null ? categoryNumericIdToPageId[kategoriId] : undefined;
  return buildBookingUrl({
    kategori,
    kategoriId,
    spesialist: params.specialistSlug,
    tjeneste: params.tjeneste ? slugifyNo(params.tjeneste) : undefined,
  });
}

export function formatBookingServicePrice(price: string): string {
  const n = parseInt(price.replace(/\s/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return "Gratis";
  return `${n.toLocaleString("nb-NO")},-`;
}
