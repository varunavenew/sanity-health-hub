import type { BookingCategoryFromApi } from "@/lib/booking/activity-groups-catalog";

export const BOOKING_ACTIVITY_GROUPS_QUERY_KEY = ["booking", "activity-groups"] as const;

export function bookingActivityGroupsQueryKey(locale: string) {
  return [...BOOKING_ACTIVITY_GROUPS_QUERY_KEY, locale] as const;
}

export async function fetchBookingActivityGroupsClient(
  locale: string,
): Promise<BookingCategoryFromApi[]> {
  const lang = locale === "en" ? "en" : "no";
  const res = await fetch(`/api/booking/activity-groups?locale=${lang}`);
  const json = (await res.json()) as {
    ok?: boolean;
    categories?: BookingCategoryFromApi[];
  };

  if (
    res.ok &&
    json.ok &&
    Array.isArray(json.categories) &&
    json.categories.length > 0
  ) {
    return json.categories;
  }

  return [];
}
