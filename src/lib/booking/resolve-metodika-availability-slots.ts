import { mapWithConcurrency } from "@/lib/booking/resolveActivityLocations";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingFreetimesList,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";
import type { BookingLocation } from "@/app/api/booking/locations/route";
import type { BookingRoom } from "@/app/api/booking/rooms/route";

export type ResolvedMetodikaAvailabilitySlot = {
  startDateTime: string;
  caregiverUserId?: number;
  locationId?: number;
};

interface ApiFreeTime {
  startdatetime?: string;
  timelength?: string;
  "caregiver_user-id"?: number;
  caregiverUserId?: number;
  "room-id"?: number;
  roomId?: number;
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
 * Same chain as GET /api/booking/availability (discovery — no location/caregiver query params).
 */
export async function resolveMetodikaAvailabilitySlots(
  wbactivityId: string | number,
  apiKey: string,
): Promise<ResolvedMetodikaAvailabilitySlot[]> {
  const rawSlots = (await fetchBookingFreetimesList(wbactivityId, apiKey)) as ApiFreeTime[];

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
        /* skip */
      }
    }),
  );

  const locationIds = [...new Set([...roomById.values()].map((r) => r.locationId))];
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
        /* skip */
      }
    }),
  );

  const slots: ResolvedMetodikaAvailabilitySlot[] = [];
  for (const entry of rawSlots) {
    const startDateTime = entry.startdatetime?.trim();
    if (!startDateTime) continue;

    const roomId = entry["room-id"] ?? entry.roomId;
    const room = roomId != null ? roomById.get(roomId) : undefined;
    const location = room ? locationById.get(room.locationId) : undefined;

    slots.push({
      startDateTime,
      caregiverUserId: entry["caregiver_user-id"] ?? entry.caregiverUserId,
      locationId: location?.id,
    });
  }

  return slots;
}

const DEFAULT_ACTIVITY_FREETIMES_CONCURRENCY = Number(
  process.env.BOOKING_SPECIALIST_SLOTS_FREETIMES_CONCURRENCY ||
    process.env.BOOKING_FREETIMES_MAX_IN_FLIGHT ||
    8,
);

/** Parallel wbfreetimes → rooms → locations per wbactivity (caregiver profile slot probe). */
export async function resolveMetodikaAvailabilitySlotsByActivityId(
  wbactivityIds: number[],
  apiKey: string,
  concurrency = DEFAULT_ACTIVITY_FREETIMES_CONCURRENCY,
): Promise<Map<number, ResolvedMetodikaAvailabilitySlot[]>> {
  const unique = [...new Set(wbactivityIds)].filter((id) => id > 0);
  if (unique.length === 0) return new Map();

  const entries = await mapWithConcurrency(unique, concurrency, async (id) => {
    const slots = await resolveMetodikaAvailabilitySlots(id, apiKey);
    return [id, slots] as const;
  });

  return new Map(entries);
}

/** Matches BookingDemo step 4 `datesWithApiSlots` filtering for a preselected specialist. */
export function metodikaSlotBookableForProfile(params: {
  slot: ResolvedMetodikaAvailabilitySlot;
  locationId: number;
  caregiverUserId: number;
  nowMs?: number;
}): boolean {
  const { slot, locationId, caregiverUserId, nowMs = Date.now() } = params;
  const ts = new Date(slot.startDateTime).getTime();
  if (!Number.isFinite(ts) || ts < nowMs) return false;
  if (slot.locationId == null || slot.locationId !== locationId) return false;
  if (
    slot.caregiverUserId != null &&
    slot.caregiverUserId !== caregiverUserId
  ) {
    return false;
  }
  return true;
}
