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
