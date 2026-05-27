import { NextResponse } from "next/server";
import { parseDurationMinutes } from "@/lib/booking/duration";
import { BOOKING_URLS, fetchBookingResource, unwrapList } from "@/lib/booking/upstream";

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

function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const level1 = root.data;

  if (Array.isArray(level1)) return level1;
  if (level1 && typeof level1 === "object") {
    const nested = (level1 as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested;
  }

  if (Array.isArray(root.result)) return root.result;
  return [];
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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

export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const wbactivityId = searchParams.get("wbactivityId") ?? searchParams.get("wbactivity-id");
  if (!wbactivityId) {
    return NextResponse.json(
      { ok: false, message: "Missing wbactivityId query parameter." },
      { status: 400 },
    );
  }

  const url = `${BOOKING_URLS.freetimes}?wbactivity-id=${encodeURIComponent(wbactivityId)}`;

  try {
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey, Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: `Upstream booking API failed (${response.status}).` },
        { status: 502 },
      );
    }

    const payload: unknown = await response.json();
    const slots = unwrapList(payload)
      .map((entry) => normalizeSlot(entry as ApiFreeTime))
      .filter((item): item is BookingFreeTimeSlot => item !== null)
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
      );

    return NextResponse.json({ ok: true, slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
