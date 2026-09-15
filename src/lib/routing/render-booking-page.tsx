import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import BookingDemo from "@/site-pages/BookingDemo";
import { fetchBookingActivityGroupsServer } from "@/lib/booking/activity-groups.server";
import { BOOKING_ACTIVITY_GROUPS_QUERY_KEY } from "@/lib/booking/fetchActivityGroups.client";
import { fetchBookingPageData } from "@/lib/sanity/booking-page.server";
import { fetchClinicsListServer } from "@/lib/sanity/clinics-list.server";

/** Prefetch booking copy + step 1 data so the widget renders without client waterfalls. */
export async function renderHydratedBookingPage(locale: string): Promise<ReactNode> {
  const sanityLang = locale === "en" ? "en" : "no";
  const queryClient = new QueryClient();

  const [bookingPage, activityGroups, clinics] = await Promise.all([
    fetchBookingPageData(sanityLang),
    fetchBookingActivityGroupsServer(sanityLang),
    fetchClinicsListServer(sanityLang),
  ]);

  queryClient.setQueryData(["sanity", "bookingPage", sanityLang], bookingPage);
  queryClient.setQueryData(
    [...BOOKING_ACTIVITY_GROUPS_QUERY_KEY, sanityLang],
    activityGroups,
  );
  queryClient.setQueryData(["sanity", "clinics", sanityLang], clinics);

  return (
    <TreatmentHydration state={dehydrate(queryClient)}>
      <BookingDemo />
    </TreatmentHydration>
  );
}
