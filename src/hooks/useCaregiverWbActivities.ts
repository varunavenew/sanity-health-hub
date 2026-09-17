import { useEffect, useMemo, useState } from "react";
import type { WbActivityMatrixEntry } from "@/lib/booking/wbactivitiesMatrix";
import { parseDurationMinutes } from "@/lib/booking/duration";

type WbActivitiesResponse = {
  ok?: boolean;
  wbactivityIds?: number[];
  activities?: WbActivityMatrixEntry[];
};

/** Metodika wbactivity ids + durations a caregiver may perform (from /wbactivities matrix). */
export function useCaregiverWbActivities(
  caregiverUserId: number | undefined,
  bookingApiBase: string = "/api/booking",
) {
  const [wbactivityIds, setWbactivityIds] = useState<number[]>([]);
  const [activities, setActivities] = useState<WbActivityMatrixEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caregiverUserId == null) {
      setWbactivityIds([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const res = await fetch(
          `${bookingApiBase}/wbactivities?caregiverUserId=${caregiverUserId}`,
        );
        const json = (await res.json()) as WbActivitiesResponse;
        if (cancelled) return;
        if (res.ok && json.ok) {
          setWbactivityIds(Array.isArray(json.wbactivityIds) ? json.wbactivityIds : []);
          setActivities(Array.isArray(json.activities) ? json.activities : []);
        } else {
          setWbactivityIds([]);
          setActivities([]);
        }
      } catch {
        if (!cancelled) {
          setWbactivityIds([]);
          setActivities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caregiverUserId, bookingApiBase]);

  const allowedIds = useMemo(() => new Set(wbactivityIds), [wbactivityIds]);

  /** Duration from Metodika `timelength` on wbactivities — not freetime/availability. */
  const durationMinutesByActivityId = useMemo(() => {
    const map = new Map<number, number>();
    for (const entry of activities) {
      const minutes = parseDurationMinutes(entry.timeLength);
      if (minutes != null) map.set(entry.wbactivityId, minutes);
    }
    return map;
  }, [activities]);

  return { wbactivityIds, allowedIds, loading, durationMinutesByActivityId };
}
