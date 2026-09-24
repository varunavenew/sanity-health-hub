import {
  createLocationResolveCaches,
  mapWithConcurrency,
  type LocationResolveCaches,
} from "@/lib/booking/resolveActivityLocations";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingFreetimesList,
  fetchBookingResourceCached,
  type FreetimesQueryOptions,
  unwrapList,
} from "@/lib/booking/upstream";
import { metodikaSearchTime } from "@/lib/booking/metodikaSearchTime";
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

async function ensureRoomsAndLocationsInCache(
  roomIds: number[],
  apiKey: string,
  caches: LocationResolveCaches,
): Promise<void> {
  const missingRooms = roomIds.filter((id) => !caches.roomById.has(id));
  await Promise.all(
    missingRooms.map(async (roomId) => {
      try {
        const url = bookingResourceUrl(BOOKING_URLS.rooms, roomId);
        const payload = await fetchBookingResourceCached(url, apiKey);
        const room = unwrapList(payload)
          .map(normalizeApiRoom)
          .find((item): item is BookingRoom => item !== null);
        if (room && !room.deactivated) caches.roomById.set(roomId, room);
      } catch {
        /* skip */
      }
    }),
  );

  const locationIds = new Set<number>();
  for (const roomId of roomIds) {
    const room = caches.roomById.get(roomId);
    if (room) locationIds.add(room.locationId);
  }

  const missingLocations = [...locationIds].filter(
    (id) => !caches.locationById.has(id),
  );
  await Promise.all(
    missingLocations.map(async (locationId) => {
      try {
        const url = bookingResourceUrl(BOOKING_URLS.locations, locationId);
        const payload = await fetchBookingResourceCached(url, apiKey);
        const location = unwrapList(payload)
          .map(normalizeApiLocation)
          .find((item): item is BookingLocation => item !== null);
        if (location && !location.deactivated) {
          caches.locationById.set(locationId, location);
        }
      } catch {
        /* skip */
      }
    }),
  );
}

function slotsFromRawFreetimes(
  rawSlots: ApiFreeTime[],
  caches: LocationResolveCaches,
): ResolvedMetodikaAvailabilitySlot[] {
  const slots: ResolvedMetodikaAvailabilitySlot[] = [];
  for (const entry of rawSlots) {
    const startDateTime = entry.startdatetime?.trim();
    if (!startDateTime) continue;

    const roomId = entry["room-id"] ?? entry.roomId;
    const room = roomId != null ? caches.roomById.get(roomId) : undefined;
    const location = room ? caches.locationById.get(room.locationId) : undefined;

    slots.push({
      startDateTime,
      caregiverUserId: entry["caregiver_user-id"] ?? entry.caregiverUserId,
      locationId: location?.id,
    });
  }
  return slots;
}

/** Specialist profile: today → last day of next calendar month (Metodika search window). */
export function profileWbfreetimesSearchRange(reference = new Date()): {
  searchFromTime: string;
  searchToTime: string;
} {
  const from = new Date(reference);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from.getFullYear(), from.getMonth() + 2, 0);
  return {
    searchFromTime: metodikaSearchTime(from, false),
    searchToTime: metodikaSearchTime(to, true),
  };
}

/** Profile-only wbfreetimes query (not used on /booking step 4). */
export function profileWbfreetimesQueryOptions(
  caregiverUserId: number,
  reference = new Date(),
): FreetimesQueryOptions {
  const { searchFromTime, searchToTime } = profileWbfreetimesSearchRange(reference);
  return {
    maxTimes: 1,
    caregiverUserId,
    searchFromTime,
    searchToTime,
  };
}

/**
 * Specialist profile slot probe: scoped wbfreetimes, then rooms → locations.
 */
export async function resolveMetodikaAvailabilitySlots(
  wbactivityId: string | number,
  apiKey: string,
  caregiverUserId: number,
): Promise<ResolvedMetodikaAvailabilitySlot[]> {
  const rawSlots = (await fetchBookingFreetimesList(
    wbactivityId,
    apiKey,
    profileWbfreetimesQueryOptions(caregiverUserId),
  )) as ApiFreeTime[];
  const roomIds = [
    ...new Set(
      rawSlots
        .map((s) => s["room-id"] ?? s.roomId)
        .filter((id): id is number => typeof id === "number"),
    ),
  ];
  const caches = createLocationResolveCaches();
  await ensureRoomsAndLocationsInCache(roomIds, apiKey, caches);
  return slotsFromRawFreetimes(rawSlots, caches);
}

const DEFAULT_ACTIVITY_FREETIMES_CONCURRENCY = Number(
  process.env.BOOKING_SPECIALIST_SLOTS_FREETIMES_CONCURRENCY ||
    process.env.BOOKING_FREETIMES_MAX_IN_FLIGHT ||
    8,
);

/**
 * Caregiver profile slot probe: parallel wbfreetimes per wbactivity, then one shared
 * rooms/locations pass (Henrik — parallel activity freetimes, not sequential chains).
 */
export async function resolveMetodikaAvailabilitySlotsByActivityId(
  wbactivityIds: number[],
  apiKey: string,
  caregiverUserId: number,
  concurrency = DEFAULT_ACTIVITY_FREETIMES_CONCURRENCY,
): Promise<Map<number, ResolvedMetodikaAvailabilitySlot[]>> {
  const unique = [...new Set(wbactivityIds)].filter((id) => id > 0);
  if (unique.length === 0) return new Map();

  const freetimesOptions = profileWbfreetimesQueryOptions(caregiverUserId);

  const freetimesByActivity = await mapWithConcurrency(
    unique,
    concurrency,
    async (id) => {
      const rawSlots = (await fetchBookingFreetimesList(
        id,
        apiKey,
        freetimesOptions,
      )) as ApiFreeTime[];
      return { id, rawSlots };
    },
  );

  const allRoomIds = new Set<number>();
  for (const { rawSlots } of freetimesByActivity) {
    for (const slot of rawSlots) {
      const roomId = slot["room-id"] ?? slot.roomId;
      if (typeof roomId === "number") allRoomIds.add(roomId);
    }
  }

  const caches = createLocationResolveCaches();
  await ensureRoomsAndLocationsInCache([...allRoomIds], apiKey, caches);

  const map = new Map<number, ResolvedMetodikaAvailabilitySlot[]>();
  for (const { id, rawSlots } of freetimesByActivity) {
    map.set(id, slotsFromRawFreetimes(rawSlots, caches));
  }
  return map;
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
