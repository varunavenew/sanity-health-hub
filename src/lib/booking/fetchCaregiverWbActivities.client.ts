import type { WbActivityMatrixEntry } from "@/lib/booking/wbactivitiesMatrix";

export type CaregiverWbActivitiesPayload = {
  wbactivityIds: number[];
  activities: WbActivityMatrixEntry[];
};

export const CAREGIVER_WB_ACTIVITIES_QUERY_KEY = [
  "booking",
  "caregiver-wbactivities",
] as const;

export function caregiverWbActivitiesQueryKey(
  caregiverUserId: number,
  bookingApiBase: string = "/api/booking",
) {
  return [...CAREGIVER_WB_ACTIVITIES_QUERY_KEY, bookingApiBase, caregiverUserId] as const;
}

const inFlight = new Map<string, Promise<CaregiverWbActivitiesPayload>>();

/** Deduped fetch for specialist profile + inline Metodika booking. */
export async function fetchCaregiverWbActivitiesClient(
  caregiverUserId: number,
  bookingApiBase: string = "/api/booking",
): Promise<CaregiverWbActivitiesPayload> {
  const cacheKey = `${bookingApiBase}:${caregiverUserId}`;
  const pending = inFlight.get(cacheKey);
  if (pending) return pending;

  const promise = (async (): Promise<CaregiverWbActivitiesPayload> => {
    const res = await fetch(
      `${bookingApiBase}/wbactivities?caregiverUserId=${caregiverUserId}`,
    );
    const json = (await res.json()) as {
      ok?: boolean;
      wbactivityIds?: number[];
      activities?: WbActivityMatrixEntry[];
    };
    if (res.ok && json.ok) {
      return {
        wbactivityIds: Array.isArray(json.wbactivityIds) ? json.wbactivityIds : [],
        activities: Array.isArray(json.activities) ? json.activities : [],
      };
    }
    return { wbactivityIds: [], activities: [] };
  })().finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, promise);
  return promise;
}

export function prefetchCaregiverWbActivitiesClient(
  caregiverUserId: number | undefined,
  bookingApiBase: string = "/api/booking",
): void {
  if (caregiverUserId == null) return;
  void fetchCaregiverWbActivitiesClient(caregiverUserId, bookingApiBase);
}
