import { dehydrate, QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { TreatmentHydration } from "@/components/providers/TreatmentHydration";
import Priser from "@/site-pages/Priser";
import { fetchBookingActivityGroupsServer } from "@/lib/booking/activity-groups.server";
import { bookingActivityGroupsQueryKey } from "@/lib/booking/fetchActivityGroups.client";
import { prefetchSingletonPage } from "@/lib/sanity/singleton-page-data.server";

/** Prefetch CMS structure + Metodika prices in parallel so `/priser` avoids client waterfalls. */
export async function renderHydratedPricingPage(locale: string): Promise<ReactNode> {
  const sanityLang = locale === "en" ? "en" : "no";
  const queryClient = new QueryClient();

  const [, activityGroups] = await Promise.all([
    prefetchSingletonPage(queryClient, "pricingPage", sanityLang),
    fetchBookingActivityGroupsServer(sanityLang),
  ]);

  queryClient.setQueryData(
    bookingActivityGroupsQueryKey(sanityLang),
    activityGroups,
  );

  return (
    <TreatmentHydration state={dehydrate(queryClient)}>
      <Priser isChatOpen={false} />
    </TreatmentHydration>
  );
}
