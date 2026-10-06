import type { NormalizedFreeTimeSlot } from "@/lib/booking/normalizeFreetimeSlots";

type DaySlotsRequest = {
  wbactivityId: number;
  date: Date;
  locationId: number;
  caregiverUserId?: number;
};

const CLIENT_CACHE_TTL_MS = 90_000;

const cache = new Map<string, { expiresAt: number; slots: NormalizedFreeTimeSlot[] }>();
const inFlight = new Map<string, Promise<NormalizedFreeTimeSlot[]>>();

export function daySlotsCacheKey(
  wbactivityId: number,
  date: Date,
  locationId: number,
  caregiverUserId?: number,
): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${wbactivityId}:${locationId}:${caregiverUserId ?? ""}:${y}-${m}-${d}`;
}

export function peekBookingDaySlotsClient(
  request: DaySlotsRequest,
): NormalizedFreeTimeSlot[] | undefined {
  const key = daySlotsCacheKey(
    request.wbactivityId,
    request.date,
    request.locationId,
    request.caregiverUserId,
  );
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.slots;
  return undefined;
}

/** Deduped fetch for step 4 time slots — uses fast /api/booking/day-slots. */
export async function fetchBookingDaySlotsClient(
  request: DaySlotsRequest,
): Promise<NormalizedFreeTimeSlot[]> {
  const key = daySlotsCacheKey(
    request.wbactivityId,
    request.date,
    request.locationId,
    request.caregiverUserId,
  );

  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.slots;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const y = request.date.getFullYear();
  const m = String(request.date.getMonth() + 1).padStart(2, "0");
  const d = String(request.date.getDate()).padStart(2, "0");
  const params = new URLSearchParams({
    wbactivityId: String(request.wbactivityId),
    date: `${y}-${m}-${d}`,
    locationId: String(request.locationId),
  });
  if (request.caregiverUserId != null) {
    params.set("caregiverUserId", String(request.caregiverUserId));
  }

  const promise = fetch(`/api/booking/day-slots?${params.toString()}`)
    .then(async (res) => {
      const json = (await res.json()) as {
        ok?: boolean;
        slots?: NormalizedFreeTimeSlot[];
      };
      const slots =
        res.ok && json.ok && Array.isArray(json.slots) ? json.slots : [];
      cache.set(key, { slots, expiresAt: Date.now() + CLIENT_CACHE_TTL_MS });
      return slots;
    })
    .catch(() => {
      cache.set(key, { slots: [], expiresAt: Date.now() + 15_000 });
      return [];
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
}

export function mergeBookingDaySlots(
  batches: NormalizedFreeTimeSlot[][],
): NormalizedFreeTimeSlot[] {
  const seen = new Set<string>();
  const merged: NormalizedFreeTimeSlot[] = [];
  for (const slots of batches) {
    for (const slot of slots) {
      const dedupeKey = [
        slot.startDateTime,
        slot.roomId ?? "",
        slot.caregiverUserId ?? "",
        slot.locationId ?? "",
      ].join("|");
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      merged.push(slot);
    }
  }
  return merged.sort(
    (a, b) =>
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
  );
}

/** Fetch day slots for one or more Metodika location ids (e.g. Majorstuen 10A + 10B). */
export async function fetchBookingDaySlotsForLocations(
  request: Omit<DaySlotsRequest, "locationId"> & { locationIds: number[] },
): Promise<NormalizedFreeTimeSlot[]> {
  const unique = [...new Set(request.locationIds.filter((id) => id > 0))];
  if (unique.length === 0) return [];
  if (unique.length === 1) {
    return fetchBookingDaySlotsClient({
      ...request,
      locationId: unique[0]!,
    });
  }

  const batches = await Promise.all(
    unique.map((locationId) =>
      fetchBookingDaySlotsClient({ ...request, locationId }),
    ),
  );
  return mergeBookingDaySlots(batches);
}

export function peekBookingDaySlotsForLocations(
  request: Omit<DaySlotsRequest, "locationId"> & { locationIds: number[] },
): NormalizedFreeTimeSlot[] | undefined {
  const unique = [...new Set(request.locationIds.filter((id) => id > 0))];
  if (unique.length === 0) return undefined;
  const batches: NormalizedFreeTimeSlot[][] = [];
  for (const locationId of unique) {
    const slots = peekBookingDaySlotsClient({ ...request, locationId });
    if (!slots) return undefined;
    batches.push(slots);
  }
  return unique.length === 1 ? batches[0] : mergeBookingDaySlots(batches);
}
