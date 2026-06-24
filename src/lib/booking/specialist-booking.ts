import type { Specialist } from "@/lib/sanity/specialist-types";
import {
  buildBookingUrl,
  categoryNumericIdToPageId,
  slugifyNo,
} from "@/lib/bookingLinks";

export function resolveSpecialistBookingCategoryIds(specialist: {
  bookingCategoryIds?: number[];
}): number[] {
  const fromSanity = specialist.bookingCategoryIds?.filter(
    (id) => typeof id === "number" && Number.isFinite(id) && id > 0,
  );
  if (!fromSanity || fromSanity.length === 0) return [];
  return [...new Set(fromSanity)].sort((a, b) => a - b);
}

export function bookingUrlForSpecialistContext(params: {
  specialistSlug?: string;
  apiGroupId?: number;
  kategoriId?: number;
  /** Metodika category slug from activity-groups (e.g. handterapeut). */
  kategori?: string;
  tjeneste?: string;
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
  });
}

export function formatBookingServicePrice(price: string): string {
  const n = parseInt(price.replace(/\s/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return "Gratis";
  return `${n.toLocaleString("nb-NO")},-`;
}
