import { NextResponse } from "next/server";
import { aptAvailableTimesUrl } from "@/lib/booking/aptAvailableTimesUrl";
import {
  BOOKING_URLS,
  fetchBookingResource,
  getBookingApiKey,
  unwrapList,
} from "@/lib/booking/upstream";

/**
 * GET — proxies Metodika aptAvailableTimes (available slots for caregivers).
 *
 * Forwards all query parameters to Laravel, e.g.:
 * - start-datetime, end-datetime (required)
 * - caregiver_user-id, activitytype-id, location-id, room-id, length, limit, …
 *
 * Example:
 * GET /api/booking/apt-available-times?start-datetime=2026-09-20T08:00:00&end-datetime=2026-09-27T18:00:00&caregiver_user-id=33
 */
export async function GET(request: Request) {
  const apiKey = getBookingApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  if (!searchParams.get("start-datetime") && !searchParams.get("start_datetime")) {
    return NextResponse.json(
      { ok: false, message: "Missing start-datetime query parameter." },
      { status: 400 },
    );
  }
  if (!searchParams.get("end-datetime") && !searchParams.get("end_datetime")) {
    return NextResponse.json(
      { ok: false, message: "Missing end-datetime query parameter." },
      { status: 400 },
    );
  }

  try {
    const url = aptAvailableTimesUrl(BOOKING_URLS.aptAvailableTimes, searchParams);
    const payload = await fetchBookingResource(url, apiKey);
    const times = unwrapList(payload);

    return NextResponse.json({
      ok: true,
      times,
      data: payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
