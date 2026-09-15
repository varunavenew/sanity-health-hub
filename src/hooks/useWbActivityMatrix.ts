import { useEffect, useState } from "react";
import type { WbActivityMatrixEntry } from "@/lib/booking/wbactivitiesMatrix";
import {
  fetchWbActivityMatrixClient,
  peekWbActivityMatrixClient,
} from "@/lib/booking/fetchWbActivityMatrix.client";

/** Metodika wbactivity entry with location → caregiver matrix for one treatment. */
export function useWbActivityMatrix(wbactivityId: number | undefined) {
  const [activity, setActivity] = useState<WbActivityMatrixEntry | null>(() => {
    if (wbactivityId == null) return null;
    const peeked = peekWbActivityMatrixClient(wbactivityId);
    return peeked === undefined ? null : peeked;
  });
  const [loading, setLoading] = useState(() => {
    if (wbactivityId == null) return false;
    return peekWbActivityMatrixClient(wbactivityId) === undefined;
  });

  useEffect(() => {
    if (wbactivityId == null) {
      setActivity(null);
      setLoading(false);
      return;
    }

    const peeked = peekWbActivityMatrixClient(wbactivityId);
    if (peeked !== undefined) {
      setActivity(peeked);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchWbActivityMatrixClient(wbactivityId)
      .then((entry) => {
        if (!cancelled) setActivity(entry);
      })
      .catch(() => {
        if (!cancelled) setActivity(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [wbactivityId]);

  return { activity, loading };
}
