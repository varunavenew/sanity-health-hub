import type { BookingCategoryFromApi } from "@/lib/booking/activity-groups-catalog";

export type MetodikaActivityIndexEntry = {
  apiActivityId: number;
  name: string;
  price: string;
  durationMinutes?: number;
  clinicServiceId: string;
  bookingCategorySlug?: string;
};

/** Flat wbactivity id → catalog row (same price resolution as booking with `?prices=api`). */
export function buildMetodikaActivityIndex(
  categories: BookingCategoryFromApi[],
): Map<number, MetodikaActivityIndexEntry> {
  const map = new Map<number, MetodikaActivityIndexEntry>();
  for (const category of categories) {
    for (const service of category.services) {
      if (
        typeof service.apiActivityId !== "number" ||
        service.apiActivityId <= 0
      ) {
        continue;
      }
      map.set(service.apiActivityId, {
        apiActivityId: service.apiActivityId,
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
        clinicServiceId: category.clinicServiceId,
      });
    }
  }
  return map;
}

export function metodikaActivityInCatalog(
  index: Map<number, MetodikaActivityIndexEntry>,
  apiActivityId: number,
): MetodikaActivityIndexEntry | undefined {
  return index.get(apiActivityId);
}
