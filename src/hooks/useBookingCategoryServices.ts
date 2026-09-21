import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  clinicServiceIdForCategoryPage,
} from "@/lib/bookingLinks";
import {
  bookingActivityGroupsQueryKey,
  fetchBookingActivityGroupsClient,
} from "@/lib/booking/fetchActivityGroups.client";
import { useLocaleParam } from "@/lib/router";
import type { SpecialistSanityCategory } from "@/lib/sanity/specialist-types";

export type BookingCategoryService = {
  name: string;
  price: string;
  apiActivityId?: number;
  /** From Metodika wbactivities `timelength` via activity-groups. */
  durationMinutes?: number;
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

export type SpecialistBookingCategory = {
  sanityCategory: SpecialistSanityCategory;
  /** Category page slug for booking URL (gynekologi, graviditet, …). */
  categoryPageId: string;
  apiCategory: BookingCategoryFromApi | null;
};

function resolveCategoryPageId(category: SpecialistSanityCategory): string {
  return category.slug || category.categoryId;
}

function matchApiCategory(
  categoryPageId: string,
  apiCategories: BookingCategoryFromApi[],
): BookingCategoryFromApi | null {
  const clinicServiceId = clinicServiceIdForCategoryPage(categoryPageId);
  return (
    apiCategories.find(
      (c) => c.clinicServiceId === clinicServiceId || c.id === clinicServiceId,
    ) ?? null
  );
}

/** Metodika categories + services filtered by specialist bookingCategoryIds from Sanity. */
export function useSpecialistMetodikaBooking(
  bookingCategoryIds: number[],
  _bookingApiBase: string = "/api/booking",
) {
  const locale = useLocaleParam();
  const { data: apiCategories = [], isLoading, isFetching } = useQuery({
    queryKey: bookingActivityGroupsQueryKey(locale),
    queryFn: () => fetchBookingActivityGroupsClient(locale),
    enabled: bookingCategoryIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(() => {
    const allowed = new Set(bookingCategoryIds);
    return apiCategories
      .filter((c) => allowed.has(c.apiGroupId))
      .sort((a, b) => a.label.localeCompare(b.label, "nb"));
  }, [apiCategories, bookingCategoryIds]);

  const loading =
    bookingCategoryIds.length > 0 &&
    (isLoading || (isFetching && categories.length === 0));

  return { categories, loading, fromApi: categories.length > 0 };
}

/** Loads Metodika services for each Sanity-linked category on a specialist. */
export function useSpecialistBookingCategories(
  sanityCategories: SpecialistSanityCategory[],
) {
  const [apiCategories, setApiCategories] = useState<BookingCategoryFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/booking/activity-groups");
        const json = (await res.json()) as ActivityGroupsResponse;
        if (cancelled) return;

        if (res.ok && json.ok && Array.isArray(json.categories)) {
          setApiCategories(json.categories);
          setFromApi(true);
        } else {
          setApiCategories([]);
          setFromApi(false);
        }
      } catch {
        if (!cancelled) {
          setApiCategories([]);
          setFromApi(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (sanityCategories.length === 0) {
      setApiCategories([]);
      setFromApi(false);
      setLoading(false);
      return;
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sanityCategories]);

  const categories = useMemo((): SpecialistBookingCategory[] => {
    return sanityCategories.map((sanityCategory) => {
      const categoryPageId = resolveCategoryPageId(sanityCategory);
      return {
        sanityCategory,
        categoryPageId,
        apiCategory: matchApiCategory(categoryPageId, apiCategories),
      };
    });
  }, [sanityCategories, apiCategories]);

  return { categories, loading, fromApi };
}

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
