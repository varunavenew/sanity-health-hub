import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseDurationMinutes } from "@/lib/booking/duration";
import {
  caregiverWbActivitiesQueryKey,
  fetchCaregiverWbActivitiesClient,
} from "@/lib/booking/fetchCaregiverWbActivities.client";

const STALE_MS = 5 * 60 * 1000;
const EMPTY_WBACTIVITY_IDS: number[] = [];

/** Metodika wbactivity ids + durations a caregiver may perform (from /wbactivities matrix). */
export function useCaregiverWbActivities(
  caregiverUserId: number | undefined,
  bookingApiBase: string = "/api/booking",
) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey:
      caregiverUserId != null
        ? caregiverWbActivitiesQueryKey(caregiverUserId, bookingApiBase)
        : ["booking", "caregiver-wbactivities", "disabled"],
    queryFn: () => fetchCaregiverWbActivitiesClient(caregiverUserId!, bookingApiBase),
    enabled: caregiverUserId != null,
    staleTime: STALE_MS,
  });

  const wbactivityIds =
    caregiverUserId == null ? EMPTY_WBACTIVITY_IDS : (data?.wbactivityIds ?? EMPTY_WBACTIVITY_IDS);
  const activities = caregiverUserId == null ? [] : (data?.activities ?? []);

  const allowedIdsKey = wbactivityIds.join(",");
  const allowedIds = useMemo(() => new Set(wbactivityIds), [allowedIdsKey]);

  const durationMinutesByActivityId = useMemo(() => {
    const map = new Map<number, number>();
    for (const entry of activities) {
      const minutes = parseDurationMinutes(entry.timeLength);
      if (minutes != null) map.set(entry.wbactivityId, minutes);
    }
    return map;
  }, [activities]);

  const loading =
    caregiverUserId != null && (isLoading || (isFetching && wbactivityIds.length === 0));

  return { wbactivityIds, allowedIds, loading, durationMinutesByActivityId };
}
