import { NextResponse } from "next/server";
import { parseDurationMinutes } from "@/lib/booking/duration";
import { mapWithConcurrency } from "@/lib/booking/resolveActivityLocations";
import { fetchBookingFreetimesList } from "@/lib/booking/upstream";

export interface BookingFreeTimeSlot {
  startDateTime: string;
  time: string;
  durationMinutes?: number;
  caregiverUserId?: number;
  roomId?: number;
}

interface ApiFreeTime {
  startdatetime?: string;
  timelength?: string;
  "caregiver_user-id"?: number;
  caregiverUserId?: number;
  "room-id"?: number;
  roomId?: number;
}

const BATCH_CONCURRENCY = Number(process.env.BOOKING_FREETIMES_BATCH_CONCURRENCY || 2);

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeSlots(rawSlots: unknown[]): BookingFreeTimeSlot[] {
  return rawSlots
    .map((entry) => normalizeSlot(entry as ApiFreeTime))
    .filter((item): item is BookingFreeTimeSlot => item !== null)
    .sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    );
}

function normalizeSlot(entry: ApiFreeTime): BookingFreeTimeSlot | null {
  const startDateTime = entry.startdatetime?.trim();
  if (!startDateTime) return null;

  const time = formatTime(startDateTime);
  if (!time) return null;

  const durationMinutes = parseDurationMinutes(entry.timelength);

  return {
    startDateTime,
    time,
    ...(durationMinutes != null ? { durationMinutes } : {}),
    caregiverUserId: entry["caregiver_user-id"] ?? entry.caregiverUserId,
    roomId: entry["room-id"] ?? entry.roomId,
  };
}

function parseActivityIds(searchParams: URLSearchParams): string[] {
  const batch = searchParams.get("wbactivityIds") ?? searchParams.get("wbactivity-ids");
  if (batch) {
    return [...new Set(batch.split(",").map((id) => id.trim()).filter(Boolean))];
  }

  const single = searchParams.get("wbactivityId") ?? searchParams.get("wbactivity-id");
  return single ? [single] : [];
}

async function slotsForActivity(
  wbactivityId: string,
  apiKey: string,
): Promise<BookingFreeTimeSlot[]> {
  try {
    const rawSlots = await fetchBookingFreetimesList(wbactivityId, apiKey);
    return normalizeSlots(rawSlots);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    console.warn(`[booking/freetimes] wbactivityId=${wbactivityId}:`, message);
    return [];
  }
}

export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const activityIds = parseActivityIds(searchParams);

  if (activityIds.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Missing wbactivityId or wbactivityIds query parameter." },
      { status: 400 },
    );
  }

  if (activityIds.length === 1) {
    const slots = await slotsForActivity(activityIds[0]!, apiKey);
    return NextResponse.json(
      { ok: true, slots },
      {
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
        },
      },
    );
  }

  const entries = await mapWithConcurrency(activityIds, BATCH_CONCURRENCY, async (id) => {
    const slots = await slotsForActivity(id, apiKey);
    return [id, slots] as const;
  });

  const byActivityId = Object.fromEntries(entries);

  return NextResponse.json(
    { ok: true, byActivityId },
    {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
      },
    },
  );
}
