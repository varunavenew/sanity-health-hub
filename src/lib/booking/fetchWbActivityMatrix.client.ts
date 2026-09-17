import type { WbActivityMatrixEntry } from "@/lib/booking/wbactivitiesMatrix";

type WbActivityResponse = {
  ok?: boolean;
  activity?: WbActivityMatrixEntry;
};

const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<number, { expiresAt: number; activity: WbActivityMatrixEntry | null }>();
const inFlight = new Map<number, Promise<WbActivityMatrixEntry | null>>();

export function peekWbActivityMatrixClient(
  wbactivityId: number,
): WbActivityMatrixEntry | null | undefined {
  const hit = cache.get(wbactivityId);
  if (hit && hit.expiresAt > Date.now()) return hit.activity;
  return undefined;
}

/** Deduped client fetch for wbactivities matrix (step 2 clinics + step 3 caregivers). */
export async function fetchWbActivityMatrixClient(
  wbactivityId: number,
): Promise<WbActivityMatrixEntry | null> {
  const peeked = peekWbActivityMatrixClient(wbactivityId);
  if (peeked !== undefined) return peeked;

  const pending = inFlight.get(wbactivityId);
  if (pending) return pending;

  const promise = fetch(`/api/booking/wbactivities?wbactivityId=${wbactivityId}`)
    .then(async (res) => {
      const json = (await res.json()) as WbActivityResponse;
      const activity =
        res.ok && json.ok && json.activity ? json.activity : null;
      cache.set(wbactivityId, {
        activity,
        expiresAt: Date.now() + CLIENT_CACHE_TTL_MS,
      });
      return activity;
    })
    .catch(() => {
      cache.set(wbactivityId, {
        activity: null,
        expiresAt: Date.now() + 15_000,
      });
      return null;
    })
    .finally(() => {
      inFlight.delete(wbactivityId);
    });

  inFlight.set(wbactivityId, promise);
  return promise;
}

/** Fire-and-forget warm of client + server wbactivities cache (step 2 prefetch). */
export function prefetchWbActivityMatrix(wbactivityId: number | undefined): void {
  if (wbactivityId == null) return;
  void fetchWbActivityMatrixClient(wbactivityId);
}
