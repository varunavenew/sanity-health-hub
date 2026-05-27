import { NextResponse } from "next/server";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";

export interface BookingRoom {
  id: number;
  name: string;
  locationId: number;
  deactivated?: boolean;
}

interface ApiRoom {
  id?: number;
  name?: string;
  "location-id"?: number;
  locationId?: number;
  deactivated?: boolean;
}

function normalizeRoom(entry: ApiRoom): BookingRoom | null {
  const id = entry.id;
  const locationId = entry["location-id"] ?? entry.locationId;
  if (id == null || locationId == null) return null;
  return {
    id,
    name: entry.name?.trim() || `Room ${id}`,
    locationId,
    deactivated: entry.deactivated,
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
  const roomId = searchParams.get("id") ?? searchParams.get("roomId");
  if (!roomId) {
    return NextResponse.json(
      { ok: false, message: "Missing id query parameter." },
      { status: 400 },
    );
  }

  try {
    const url = bookingResourceUrl(BOOKING_URLS.rooms, roomId);
    const payload = await fetchBookingResource(url, apiKey);
    const rooms = unwrapList(payload)
      .map((entry) => normalizeRoom(entry as ApiRoom))
      .filter((item): item is BookingRoom => item !== null);

    const room = rooms[0] ?? null;
    if (!room) {
      return NextResponse.json({ ok: false, message: "Room not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, room });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
