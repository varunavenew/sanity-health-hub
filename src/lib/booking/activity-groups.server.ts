import "server-only";

import { buildBookingActivityGroupsCatalog } from "@/lib/booking/activity-groups-catalog";

/** Server-side activity groups for booking step 1 RSC hydration. */
export async function fetchBookingActivityGroupsServer(lang: "no" | "en" = "no") {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) return [];

  try {
    return await buildBookingActivityGroupsCatalog(apiKey);
  } catch (error) {
    console.error("[booking/activity-groups/server] error:", error);
    return [];
  }
}
