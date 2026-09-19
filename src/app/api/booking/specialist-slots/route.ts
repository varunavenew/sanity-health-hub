import { NextResponse } from "next/server";
import {
  parseSpecialistSlotsQuery,
  specialistHasMetodikaSlots,
  specialistHasPasientskySlots,
} from "@/lib/booking/specialist-slot-availability";
import { getBookingApiKey } from "@/lib/booking/upstream";

/**
 * GET /api/booking/specialist-slots
 * Returns whether a specialist has any bookable online slot (Metodika and/or Pasientsky).
 */
export async function GET(request: Request) {
  const query = parseSpecialistSlotsQuery(new URL(request.url).searchParams);
  const hasMetodikaQuery =
    query.wbactivityIds.length > 0 && query.locationIds.length > 0;
  const hasPasientskyQuery = Boolean(query.pasientskyServiceProviderId);

  if (!hasMetodikaQuery && !hasPasientskyQuery) {
    return NextResponse.json(
      { ok: false, message: "Missing Metodika or Pasientsky query parameters." },
      { status: 400 },
    );
  }

  try {
    let hasMetodikaSlots = false;
    let hasPasientskySlots = false;

    if (hasMetodikaQuery) {
      const apiKey = getBookingApiKey();
      if (!apiKey) {
        return NextResponse.json(
          { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
          { status: 500 },
        );
      }
      hasMetodikaSlots = await specialistHasMetodikaSlots({
        wbactivityIds: query.wbactivityIds,
        locationIds: query.locationIds,
        caregiverUserId: query.caregiverUserId,
        apiKey,
      });
    }

    if (hasPasientskyQuery && query.pasientskyServiceProviderId) {
      hasPasientskySlots = await specialistHasPasientskySlots({
        serviceProviderId: query.pasientskyServiceProviderId,
        calendarId: query.pasientskyCalendarId,
      });
    }

    const hasSlots = hasMetodikaSlots || hasPasientskySlots;

    return NextResponse.json(
      {
        ok: true,
        hasSlots,
        metodika: hasMetodikaQuery ? hasMetodikaSlots : undefined,
        pasientsky: hasPasientskyQuery ? hasPasientskySlots : undefined,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=120, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
