import { useEffect, useMemo, useState } from "react";

type WbActivitiesResponse = {
  ok?: boolean;
  wbactivityIds?: number[];
};

/** Metodika wbactivity ids a caregiver may perform (from /wbactivities location matrix). */
export function useCaregiverWbActivities(caregiverUserId: number | undefined) {
  const [wbactivityIds, setWbactivityIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caregiverUserId == null) {
      setWbactivityIds([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const res = await fetch(
          `/api/booking/wbactivities?caregiverUserId=${caregiverUserId}`,
        );
        const json = (await res.json()) as WbActivitiesResponse;
        if (cancelled) return;
        if (res.ok && json.ok && Array.isArray(json.wbactivityIds)) {
          setWbactivityIds(json.wbactivityIds);
        } else {
          setWbactivityIds([]);
        }
      } catch {
        if (!cancelled) setWbactivityIds([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caregiverUserId]);

  const allowedIds = useMemo(() => new Set(wbactivityIds), [wbactivityIds]);

  return { wbactivityIds, allowedIds, loading };
}
