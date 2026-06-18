import { NextResponse } from "next/server";
import { parseDurationMinutes } from "@/lib/booking/duration";
import { parseActivityTypeId } from "@/lib/booking/parseActivityTypeId";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";
import type { BookingLocation } from "@/app/api/booking/locations/route";
import type { BookingRoom } from "@/app/api/booking/rooms/route";

export interface BookingAvailabilitySlot {
  startDateTime: string;
  time: string;
  durationMinutes?: number;
  lengthTime?: string;
  caregiverUserId?: number;
  roomId?: number;
  locationId?: number;
  locationName?: string;
}

export interface BookingAvailabilityLocation {
  locationId: number;
  name: string;
  roomIds: number[];
}

interface ApiFreeTime {
  startdatetime?: string;
  timelength?: string;
  "caregiver_user-id"?: number;
  caregiverUserId?: number;
  "room-id"?: number;
  roomId?: number;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function normalizeApiRoom(entry: unknown): BookingRoom | null {
  const r = entry as Record<string, unknown>;
  const id = r.id as number | undefined;
  const locationId = (r["location-id"] ?? r.locationId) as number | undefined;
  if (id == null || locationId == null) return null;
  return {
    id,
    name: String(r.name ?? `Room ${id}`).trim(),
    locationId,
    deactivated: r.deactivated as boolean | undefined,
  };
}

function normalizeApiLocation(entry: unknown): BookingLocation | null {
  const l = entry as Record<string, unknown>;
  const id = l.id as number | undefined;
  if (id == null) return null;
  return {
    id,
    name: String(l.name ?? `Location ${id}`).trim(),
    parentLocationId: (l["parent_location-id"] ?? l.parentLocationId) as number | undefined,
    deactivated: l.deactivated as boolean | undefined,
  };
}

/**
 * GET ?wbactivityId=31
 * Chains: wbfreetimes → rooms → locations
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
  const wbactivityId = searchParams.get("wbactivityId") ?? searchParams.get("wbactivity-id");
  if (!wbactivityId) {
    return NextResponse.json(
      { ok: false, message: "Missing wbactivityId query parameter." },
      { status: 400 },
    );
  }

  try {
    let activityTypeId: number | null = null;
    try {
      const activityUrl = bookingResourceUrl(BOOKING_URLS.wbactivities, wbactivityId);
      const activityPayload = await fetchBookingResource(activityUrl, apiKey);
      activityTypeId = parseActivityTypeId(activityPayload);
      console.log('activity-type-id', activityTypeId);
    } catch {
      /* activity type optional until appointment step */
    }

    const freetimesUrl = `${BOOKING_URLS.freetimes}?wbactivity-id=${encodeURIComponent(wbactivityId)}`;
    const freetimesPayload = await fetchBookingResource(freetimesUrl, apiKey);
    const rawSlots = unwrapList(freetimesPayload) as ApiFreeTime[];

    const roomIds = [
      ...new Set(
        rawSlots
          .map((s) => s["room-id"] ?? s.roomId)
          .filter((id): id is number => typeof id === "number"),
      ),
    ];

    const roomById = new Map<number, BookingRoom>();
    await Promise.all(
      roomIds.map(async (roomId) => {
        try {
          const url = bookingResourceUrl(BOOKING_URLS.rooms, roomId);
          const payload = await fetchBookingResource(url, apiKey);
          const room = unwrapList(payload)
            .map(normalizeApiRoom)
            .find((item): item is BookingRoom => item !== null);
          if (room && !room.deactivated) roomById.set(roomId, room);
        } catch {
          /* skip unavailable room */
        }
      }),
    );

    const locationIds = [
      ...new Set([...roomById.values()].map((r) => r.locationId)),
    ];

    const locationById = new Map<number, BookingLocation>();
    await Promise.all(
      locationIds.map(async (locationId) => {
        try {
          const url = bookingResourceUrl(BOOKING_URLS.locations, locationId);
          const payload = await fetchBookingResource(url, apiKey);
          const location = unwrapList(payload)
            .map(normalizeApiLocation)
            .find((item): item is BookingLocation => item !== null);
          if (location && !location.deactivated) locationById.set(locationId, location);
        } catch {
          /* skip unavailable location */
        }
      }),
    );

    const locationsMap = new Map<number, BookingAvailabilityLocation>();

    const slots: BookingAvailabilitySlot[] = rawSlots
      .map((entry): BookingAvailabilitySlot | null => {
        const startDateTime = entry.startdatetime?.trim();
        if (!startDateTime) return null;

        const time = formatTime(startDateTime);
        if (!time) return null;

        const roomId = entry["room-id"] ?? entry.roomId;
        const room = roomId != null ? roomById.get(roomId) : undefined;
        const location = room ? locationById.get(room.locationId) : undefined;

        if (room && location) {
          const existing = locationsMap.get(location.id);
          if (existing) {
            if (room.id != null && !existing.roomIds.includes(room.id)) {
              existing.roomIds.push(room.id);
            }
          } else {
            locationsMap.set(location.id, {
              locationId: location.id,
              name: location.name,
              roomIds: room.id != null ? [room.id] : [],
            });
          }
        }

        const timelength = entry.timelength?.trim();
        const durationMinutes = parseDurationMinutes(timelength);

        return {
          startDateTime,
          time,
          ...(durationMinutes != null ? { durationMinutes } : {}),
          ...(timelength ? { lengthTime: timelength } : {}),
          caregiverUserId: entry["caregiver_user-id"] ?? entry.caregiverUserId,
          roomId,
          locationId: location?.id,
          locationName: location?.name,
        };
      })
      .filter((item): item is BookingAvailabilitySlot => item !== null)
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
      );

    const locations = [...locationsMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "nb"),
    );

    return NextResponse.json({
      ok: true,
      slots,
      locations,
      ...(activityTypeId != null ? { activityTypeId } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
