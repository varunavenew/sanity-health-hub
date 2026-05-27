import { useEffect, useState } from "react";

export type BookingCategoryService = {
  name: string;
  price: string;
  apiActivityId?: number;
};

export type BookingCategoryFromApi = {
  id: string;
  clinicServiceId: string;
  label: string;
  apiGroupId: number;
  services: BookingCategoryService[];
};

type ActivityGroupsResponse = {
  ok?: boolean;
  categories?: BookingCategoryFromApi[];
};

/** Loads booking API services for one category (e.g. gynekolog, fertilitet). */
export function useBookingCategoryServices(clinicServiceId: string) {
  const [category, setCategory] = useState<BookingCategoryFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/booking/activity-groups");
        const json = (await res.json()) as ActivityGroupsResponse;
        if (cancelled) return;

        if (res.ok && json.ok && Array.isArray(json.categories)) {
          const match =
            json.categories.find(
              (c) => c.clinicServiceId === clinicServiceId || c.id === clinicServiceId,
            ) ?? null;
          setCategory(match);
          setFromApi(!!match);
        }
      } catch {
        if (!cancelled) setCategory(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [clinicServiceId]);

  return {
    category,
    services: category?.services ?? [],
    label: category?.label,
    loading,
    fromApi,
  };
}
