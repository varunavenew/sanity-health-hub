"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGoldStarsLocationReviews } from "@/components/ReviewPixel/gold-stars-reviews-api";

/** One clinic's Gold Stars reviews (by `location_id`). Disabled when no location is set. */
export function useGoldStarsLocationReviews(locationId: number | undefined) {
  return useQuery({
    queryKey: ["goldstars", "location-reviews", locationId],
    queryFn: () => fetchGoldStarsLocationReviews(locationId as number),
    enabled: typeof locationId === "number",
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
