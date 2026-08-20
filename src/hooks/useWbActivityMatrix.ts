import { useEffect, useState } from "react";
import type { WbActivityMatrixEntry } from "@/lib/booking/wbactivitiesMatrix";

type WbActivityResponse = {
  ok?: boolean;
  activity?: WbActivityMatrixEntry;
};

/** Metodika wbactivity entry with location → caregiver matrix for one treatment. */
export function useWbActivityMatrix(wbactivityId: number | undefined) {
  const [activity, setActivity] = useState<WbActivityMatrixEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wbactivityId == null) {
      setActivity(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const res = await fetch(`/api/booking/wbactivities?wbactivityId=${wbactivityId}`);
        const json = (await res.json()) as WbActivityResponse;
        if (cancelled) return;
        if (res.ok && json.ok && json.activity) {
          setActivity(json.activity);
        } else {
          setActivity(null);
        }
      } catch {
        if (!cancelled) setActivity(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [wbactivityId]);

  return { activity, loading };
}
