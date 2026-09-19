import { useEffect, useMemo, useState } from "react";
import { useCaregiverWbActivities } from "@/hooks/useCaregiverWbActivities";
import { useSpecialistMetodikaBooking } from "@/hooks/useBookingCategoryServices";
import { resolveBookingCaregiverUserId } from "@/lib/booking/filterClinicsForSpecialist";
import { resolveSpecialistBookingCategoryIds } from "@/lib/booking/specialist-booking";
import { pasientskyCalendarIdForSpecialist } from "@/lib/booking/pasientskySpecialist";
import type { SpecialistPageClinic } from "@/lib/booking/specialist-page-clinics";
import { specialistShowsBookingButton } from "@/lib/sanity/specialist-cta";
import type { Specialist } from "@/lib/sanity/specialist-types";

const BOOKING_API_BASE = "/api/booking";

/**
 * True when the specialist has at least one online bookable slot
 * (Metodika freetime or Pasientsky calendar) for any linked treatment.
 */
export function useSpecialistHasAvailableSlots(
  specialist: Specialist,
  pageClinics: SpecialistPageClinic[],
  bookingApiBase: string = BOOKING_API_BASE,
): { hasAvailableSlots: boolean; loading: boolean } {
  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [specialist.bookingCategoryIds],
  );
  const { categories: metodikaCategories, loading: categoriesLoading } =
    useSpecialistMetodikaBooking(bookingCategoryIds, bookingApiBase);
  const caregiverUserId = resolveBookingCaregiverUserId(specialist);
  const { allowedIds, loading: wbActivitiesLoading } = useCaregiverWbActivities(
    caregiverUserId,
    bookingApiBase,
  );

  const metodikaClinics = useMemo(
    () => pageClinics.filter((clinic) => clinic.kind === "metodika"),
    [pageClinics],
  );
  const pasientskyClinics = useMemo(
    () => pageClinics.filter((clinic) => clinic.kind === "pasientsky"),
    [pageClinics],
  );
  const hasOnlineClinic = metodikaClinics.length > 0 || pasientskyClinics.length > 0;
  const wbactivityIds = useMemo(() => {
    const fromCategories = new Set<number>();
    for (const category of metodikaCategories) {
      for (const service of category.services) {
        if (service.apiActivityId != null) {
          fromCategories.add(service.apiActivityId);
        }
      }
    }
    return [...allowedIds]
      .filter((id) => fromCategories.has(id))
      .sort((a, b) => a - b);
  }, [metodikaCategories, allowedIds]);
  const pasientskyCalendarId = useMemo(
    () => pasientskyCalendarIdForSpecialist(specialist),
    [specialist],
  );

  const [hasAvailableSlots, setHasAvailableSlots] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!specialistShowsBookingButton(specialist)) {
      setHasAvailableSlots(false);
      setLoading(false);
      return;
    }

    if (pageClinics.length === 0 || !hasOnlineClinic) {
      setHasAvailableSlots(false);
      setLoading(false);
      return;
    }

    if (metodikaClinics.length > 0) {
      if (categoriesLoading || wbActivitiesLoading) return;
      if (caregiverUserId == null || wbactivityIds.length === 0) {
        setHasAvailableSlots(false);
        setLoading(false);
        return;
      }
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const params = new URLSearchParams();

        if (metodikaClinics.length > 0) {
          params.set(
            "locationIds",
            metodikaClinics.map((clinic) => clinic.apiLocationId).join(","),
          );
          params.set("wbactivityIds", wbactivityIds.join(","));
          if (caregiverUserId != null) {
            params.set("caregiverUserId", String(caregiverUserId));
          }
        }

        const pasientskyClinic = pasientskyClinics[0];
        if (pasientskyClinic) {
          params.set(
            "pasientskyServiceProviderId",
            pasientskyClinic.serviceProviderId,
          );
          if (pasientskyCalendarId) {
            params.set("pasientskyCalendarId", pasientskyCalendarId);
          }
        }

        const res = await fetch(
          `${bookingApiBase}/specialist-slots?${params.toString()}`,
        );
        const json = (await res.json()) as { ok?: boolean; hasSlots?: boolean };
        if (cancelled) return;
        setHasAvailableSlots(Boolean(res.ok && json.ok && json.hasSlots));
      } catch {
        if (!cancelled) setHasAvailableSlots(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    specialist,
    pageClinics.length,
    hasOnlineClinic,
    metodikaClinics,
    pasientskyClinics,
    wbactivityIds,
    caregiverUserId,
    categoriesLoading,
    wbActivitiesLoading,
    pasientskyCalendarId,
    bookingApiBase,
  ]);

  return { hasAvailableSlots, loading };
}
