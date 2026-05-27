import type { BookingAvailabilityLocation } from "@/app/api/booking/availability/route";
import type { BookingLocation } from "@/app/api/booking/locations/route";
import type { BookingRoom } from "@/app/api/booking/rooms/route";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";

interface ApiFreeTime {
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

export type LocationResolveCaches = {
  roomById: Map<number, BookingRoom>;
  locationById: Map<number, BookingLocation>;
};

export function createLocationResolveCaches(): LocationResolveCaches {
  return { roomById: new Map(), locationById: new Map() };
}

/**
 * Resolve booking locations that have freetime slots for a wbactivity
 * (wbfreetimes → rooms → locations).
 */
export async function resolveLocationsForActivity(
  wbactivityId: string | number,
  apiKey: string,
  caches: LocationResolveCaches = createLocationResolveCaches(),
): Promise<BookingAvailabilityLocation[]> {
  const freetimesUrl = `${BOOKING_URLS.freetimes}?wbactivity-id=${encodeURIComponent(String(wbactivityId))}`;
  const freetimesPayload = await fetchBookingResource(freetimesUrl, apiKey);
  const rawSlots = unwrapList(freetimesPayload) as ApiFreeTime[];

  const roomIds = [
    ...new Set(
      rawSlots
        .map((s) => s["room-id"] ?? s.roomId)
        .filter((id): id is number => typeof id === "number"),
    ),
  ];

  await Promise.all(
    roomIds.map(async (roomId) => {
      if (caches.roomById.has(roomId)) return;
      try {
        const url = bookingResourceUrl(BOOKING_URLS.rooms, roomId);
        const payload = await fetchBookingResource(url, apiKey);
        const room = unwrapList(payload)
          .map(normalizeApiRoom)
          .find((item): item is BookingRoom => item !== null);
        if (room && !room.deactivated) caches.roomById.set(roomId, room);
      } catch {
        /* skip */
      }
    }),
  );

  const activityLocationIds = new Set<number>();
  for (const roomId of roomIds) {
    const room = caches.roomById.get(roomId);
    if (room) activityLocationIds.add(room.locationId);
  }

  await Promise.all(
    [...activityLocationIds].map(async (locationId) => {
      if (caches.locationById.has(locationId)) return;
      try {
        const url = bookingResourceUrl(BOOKING_URLS.locations, locationId);
        const payload = await fetchBookingResource(url, apiKey);
        const location = unwrapList(payload)
          .map(normalizeApiLocation)
          .find((item): item is BookingLocation => item !== null);
        if (location && !location.deactivated) caches.locationById.set(locationId, location);
      } catch {
        /* skip */
      }
    }),
  );

  const locationsMap = new Map<number, BookingAvailabilityLocation>();
  for (const roomId of roomIds) {
    const room = caches.roomById.get(roomId);
    if (!room) continue;
    const location = caches.locationById.get(room.locationId);
    if (!location) continue;

    const existing = locationsMap.get(location.id);
    if (existing) {
      if (!existing.roomIds.includes(room.id)) existing.roomIds.push(room.id);
    } else {
      locationsMap.set(location.id, {
        locationId: location.id,
        name: location.name,
        roomIds: [room.id],
      });
    }
  }

  return [...locationsMap.values()].sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
