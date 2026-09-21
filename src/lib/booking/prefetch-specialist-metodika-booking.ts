import type { QueryClient } from "@tanstack/react-query";
import {
  bookingActivityGroupsQueryKey,
  fetchBookingActivityGroupsClient,
} from "@/lib/booking/fetchActivityGroups.client";
import {
  caregiverWbActivitiesQueryKey,
  fetchCaregiverWbActivitiesClient,
} from "@/lib/booking/fetchCaregiverWbActivities.client";
import { resolveBookingCaregiverUserId } from "@/lib/booking/filterClinicsForSpecialist";
import type { SpecialistPageClinic } from "@/lib/booking/specialist-page-clinics";
import { resolveSpecialistBookingCategoryIds } from "@/lib/booking/specialist-booking";
import type { Specialist } from "@/lib/sanity/specialist-types";

const STALE_MS = 5 * 60 * 1000;

/** Warm activity-groups + caregiver matrix before the user picks a Metodika clinic. */
export function prefetchSpecialistMetodikaBookingData(
  queryClient: QueryClient,
  input: {
    specialist: Specialist;
    pageClinics: SpecialistPageClinic[];
    locale: string;
    bookingApiBase?: string;
  },
): void {
  const bookingApiBase = input.bookingApiBase ?? "/api/booking";
  const hasMetodikaClinic = input.pageClinics.some((clinic) => clinic.kind === "metodika");
  const bookingCategoryIds = resolveSpecialistBookingCategoryIds(input.specialist);
  if (!hasMetodikaClinic || bookingCategoryIds.length === 0) return;

  void queryClient.prefetchQuery({
    queryKey: bookingActivityGroupsQueryKey(input.locale),
    queryFn: () => fetchBookingActivityGroupsClient(input.locale),
    staleTime: STALE_MS,
  });

  const caregiverUserId = resolveBookingCaregiverUserId(input.specialist);
  if (caregiverUserId == null) return;

  void queryClient.prefetchQuery({
    queryKey: caregiverWbActivitiesQueryKey(caregiverUserId, bookingApiBase),
    queryFn: () => fetchCaregiverWbActivitiesClient(caregiverUserId, bookingApiBase),
    staleTime: STALE_MS,
  });
}
