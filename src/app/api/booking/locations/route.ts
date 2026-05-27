import { NextResponse } from "next/server";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";

export interface BookingLocation {
  id: number;
  name: string;
  parentLocationId?: number;
  deactivated?: boolean;
}

interface ApiLocation {
  id?: number;
  name?: string;
  "parent_location-id"?: number;
  parentLocationId?: number;
  deactivated?: boolean;
}

function normalizeLocation(entry: ApiLocation): BookingLocation | null {
  const id = entry.id;
  if (id == null) return null;
  return {
    id,
    name: entry.name?.trim() || `Location ${id}`,
    parentLocationId: entry["parent_location-id"] ?? entry.parentLocationId,
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
  const locationId = searchParams.get("id") ?? searchParams.get("locationId");
  if (!locationId) {
    return NextResponse.json(
      { ok: false, message: "Missing id query parameter." },
      { status: 400 },
    );
  }

  try {
    const url = bookingResourceUrl(BOOKING_URLS.locations, locationId);
    const payload = await fetchBookingResource(url, apiKey);
    const locations = unwrapList(payload)
      .map((entry) => normalizeLocation(entry as ApiLocation))
      .filter((item): item is BookingLocation => item !== null);

    const location = locations[0] ?? null;
    if (!location) {
      return NextResponse.json(
        { ok: false, message: "Location not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, location });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
