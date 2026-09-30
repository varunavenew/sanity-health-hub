import { useQuery } from "@tanstack/react-query";
import {
  bookingActivityGroupsQueryKey,
  fetchBookingActivityGroupsWithApiPricesClient,
} from "@/lib/booking/fetchActivityGroups.client";

/** Metodika bookable services + prices for `/priser` (same catalog + cache as `/no/booking`). */
export function usePricingMetodikaCatalog(locale: "no" | "en" | "nb") {
  const lang = locale === "en" ? "en" : "no";
  return useQuery({
    queryKey: bookingActivityGroupsQueryKey(lang),
    queryFn: () => fetchBookingActivityGroupsWithApiPricesClient(lang),
    staleTime: 5 * 60 * 1000,
  });
}
