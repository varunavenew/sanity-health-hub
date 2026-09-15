import { NextResponse } from "next/server";
import { metodikaSearchTime } from "@/lib/booking/metodikaSearchTime";
import { normalizeFreetimeSlots } from "@/lib/booking/normalizeFreetimeSlots";
import { fetchBookingFreetimesPayload, unwrapList } from "@/lib/booking/upstream";

function parseOptionalInt(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseBookingDate(value: string | null): Date | null {
  if (!value?.trim()) return null;
  const day = value.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * GET /api/booking/day-slots
 * Fast single-day alltimes — one cached wbfreetimes call, no room/location chain.
 *
 * Query: wbactivityId, date=YYYY-MM-DD, locationId, caregiverUserId?
 */
export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const wbactivityId =
    searchParams.get("wbactivityId") ?? searchParams.get("wbactivity-id");
  const date = parseBookingDate(searchParams.get("date"));
  const locationId = parseOptionalInt(
    searchParams.get("locationId") ?? searchParams.get("location-id"),
  );
  const caregiverUserId = parseOptionalInt(
    searchParams.get("caregiverUserId") ?? searchParams.get("caregiver_user-id"),
  );

  if (!wbactivityId) {
    return NextResponse.json(
      { ok: false, message: "Missing wbactivityId query parameter." },
      { status: 400 },
    );
  }
  if (!date) {
    return NextResponse.json(
      { ok: false, message: "Missing or invalid date query parameter (YYYY-MM-DD)." },
      { status: 400 },
    );
  }
  if (locationId == null) {
    return NextResponse.json(
      { ok: false, message: "Missing locationId query parameter." },
      { status: 400 },
    );
  }

  try {
    const searchFromTime = metodikaSearchTime(date, false);
    const searchToTime = metodikaSearchTime(date, true);
    const payload = await fetchBookingFreetimesPayload(wbactivityId, apiKey, {
      version: 3,
      queryMode: "alltimes",
      useInterval: true,
      searchFromTime,
      searchToTime,
      locationId,
      ...(caregiverUserId != null ? { caregiverUserId } : {}),
    });
    const slots = normalizeFreetimeSlots(unwrapList(payload), locationId);

    return NextResponse.json(
      { ok: true, slots },
      {
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
