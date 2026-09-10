import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import BookingDemo from "@/site-pages/BookingDemo";
import { fetchBookingPageData } from "@/lib/sanity/booking-page.server";

/** Prefetch booking copy so the widget chrome (title, headings) is in the initial HTML. */
export async function renderHydratedBookingPage(locale: string): Promise<ReactNode> {
  const sanityLang = locale === "en" ? "en" : "no";
  const queryClient = new QueryClient();
  queryClient.setQueryData(
    ["sanity", "bookingPage", sanityLang],
    await fetchBookingPageData(sanityLang),
  );
  return (
    <TreatmentHydration state={dehydrate(queryClient)}>
      <BookingDemo />
    </TreatmentHydration>
  );
}
