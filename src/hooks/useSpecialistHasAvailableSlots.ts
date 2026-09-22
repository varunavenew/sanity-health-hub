import { useEffect, useMemo, useRef, useState } from "react";
import { useCaregiverWbActivities } from "@/hooks/useCaregiverWbActivities";
import { useSpecialistMetodikaBooking } from "@/hooks/useBookingCategoryServices";
import { resolveBookingCaregiverUserId } from "@/lib/booking/filterClinicsForSpecialist";
import { pasientskyCalendarIdForSpecialist } from "@/lib/booking/pasientskySpecialist";
import type { MetodikaBookableActivityPair } from "@/lib/booking/specialist-slot-availability";
import type { SpecialistPageClinic } from "@/lib/booking/specialist-page-clinics";
import {
  filterServicesForCaregiverWbActivities,
  filterSpecialistBookingCategories,
  resolveSpecialistBookingCategoryIds,
} from "@/lib/booking/specialist-booking";
import { specialistShowsBookingButton } from "@/lib/sanity/specialist-cta";
import type { Specialist } from "@/lib/sanity/specialist-types";

const BOOKING_API_BASE = "/api/booking";
const EMPTY_BOOKABLE_MAP = new Map<number, Set<number>>();

function bookableIdsByLocation(
  pairs: MetodikaBookableActivityPair[],
): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();
  for (const { locationId, wbactivityId } of pairs) {
    let ids = map.get(locationId);
    if (!ids) {
      ids = new Set();
      map.set(locationId, ids);
    }
    ids.add(wbactivityId);
  }
  return map;
}

function bookableMapSignature(map: Map<number, Set<number>>): string {
  const parts: string[] = [];
  for (const [locationId, ids] of [...map.entries()].sort((a, b) => a[0] - b[0])) {
    parts.push(`${locationId}:${[...ids].sort((a, b) => a - b).join(".")}`);
  }
  return parts.join("|");
}

/**
 * Metodika freetime + Pasientsky calendar probe for specialist profile booking CTAs.
 */
export function useSpecialistHasAvailableSlots(
  specialist: Specialist,
  pageClinics: SpecialistPageClinic[],
  bookingApiBase: string = BOOKING_API_BASE,
): {
  hasAvailableSlots: boolean;
  hasPasientskySlots: boolean;
  loading: boolean;
  metodikaBookableByLocation: Map<number, Set<number>>;
} {
  const specialistSlug = specialist.slug;
  const showBookingButton = specialist.showBookingButton;
  const caregiverUserId = resolveBookingCaregiverUserId(specialist);
  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [specialist.bookingCategoryIds],
  );

  const pageClinicKey = useMemo(
    () =>
      pageClinics
        .map((clinic) => `${clinic.id}:${clinic.kind}`)
        .sort()
        .join(","),
    [pageClinics],
  );

  const metodikaLocationIdsKey = useMemo(() => {
    return pageClinics
      .filter((clinic) => clinic.kind === "metodika")
      .map((clinic) => clinic.apiLocationId)
      .sort((a, b) => a - b)
      .join(",");
  }, [pageClinicKey, pageClinics]);

  const pasientskyServiceProviderId = useMemo(() => {
    const clinic = pageClinics.find((row) => row.kind === "pasientsky");
    return clinic?.kind === "pasientsky" ? clinic.serviceProviderId : "";
  }, [pageClinicKey, pageClinics]);

  const hasMetodikaClinic = metodikaLocationIdsKey.length > 0;
  const hasPasientskyClinic = pasientskyServiceProviderId.length > 0;
  const hasOnlineClinic = hasMetodikaClinic || hasPasientskyClinic;

  const { categories: metodikaCategories, loading: categoriesLoading } =
    useSpecialistMetodikaBooking(
      hasMetodikaClinic ? bookingCategoryIds : [],
      bookingApiBase,
    );
  const { allowedIds, loading: wbActivitiesLoading } = useCaregiverWbActivities(
    hasMetodikaClinic ? caregiverUserId : undefined,
    bookingApiBase,
  );
  const allowedIdsKey = useMemo(
    () => [...allowedIds].sort((a, b) => a - b).join(","),
    [allowedIds],
  );

  const profileWbActivityIdsKey = useMemo(() => {
    if (!hasMetodikaClinic || caregiverUserId == null || allowedIds.size === 0) {
      return "";
    }
    const ids = new Set<number>();
    for (const category of filterSpecialistBookingCategories(
      specialist,
      metodikaCategories,
    )) {
      for (const service of filterServicesForCaregiverWbActivities(
        category.services,
        allowedIds,
      )) {
        if (service.apiActivityId != null) ids.add(service.apiActivityId);
      }
    }
    return [...ids].sort((a, b) => a - b).join(",");
  }, [
    specialist.bookingCategoryIds,
    metodikaCategories,
    allowedIdsKey,
    hasMetodikaClinic,
    caregiverUserId,
  ]);

  const pasientskyCalendarId = useMemo(
    () => pasientskyCalendarIdForSpecialist(specialist),
    [specialist],
  );

  const [hasAvailableSlots, setHasAvailableSlots] = useState(false);
  const [hasPasientskySlots, setHasPasientskySlots] = useState(false);
  const [metodikaBookableByLocation, setMetodikaBookableByLocation] = useState<
    Map<number, Set<number>>
  >(() => EMPTY_BOOKABLE_MAP);
  const [loading, setLoading] = useState(true);
  const lastBookableSignature = useRef("");

  const metodikaPrerequisitesLoading =
    hasMetodikaClinic && (categoriesLoading || wbActivitiesLoading);

  useEffect(() => {
    const showsBooking = specialistShowsBookingButton({ showBookingButton });

    if (!showsBooking) {
      setHasAvailableSlots(false);
      setHasPasientskySlots(false);
      lastBookableSignature.current = "";
      setMetodikaBookableByLocation(EMPTY_BOOKABLE_MAP);
      setLoading(false);
      return;
    }

    if (pageClinics.length === 0 || !hasOnlineClinic) {
      setHasAvailableSlots(false);
      setHasPasientskySlots(false);
      lastBookableSignature.current = "";
      setMetodikaBookableByLocation(EMPTY_BOOKABLE_MAP);
      setLoading(false);
      return;
    }

    if (metodikaPrerequisitesLoading) return;

    if (hasMetodikaClinic && profileWbActivityIdsKey.length === 0) {
      if (!hasPasientskyClinic) {
        setHasAvailableSlots(false);
        setHasPasientskySlots(false);
        lastBookableSignature.current = "";
        setMetodikaBookableByLocation(EMPTY_BOOKABLE_MAP);
        setLoading(false);
        return;
      }
    }

    if (hasMetodikaClinic && caregiverUserId == null && !hasPasientskyClinic) {
      setHasAvailableSlots(false);
      setHasPasientskySlots(false);
      lastBookableSignature.current = "";
      setMetodikaBookableByLocation(EMPTY_BOOKABLE_MAP);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const params = new URLSearchParams();

        if (
          hasMetodikaClinic &&
          caregiverUserId != null &&
          profileWbActivityIdsKey.length > 0
        ) {
          params.set("locationIds", metodikaLocationIdsKey);
          params.set("wbactivityIds", profileWbActivityIdsKey);
          params.set("caregiverUserId", String(caregiverUserId));
        }

        if (hasPasientskyClinic) {
          params.set("pasientskyServiceProviderId", pasientskyServiceProviderId);
          if (pasientskyCalendarId) {
            params.set("pasientskyCalendarId", pasientskyCalendarId);
          }
        }

        const res = await fetch(
          `${bookingApiBase}/specialist-slots?${params.toString()}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          hasSlots?: boolean;
          pasientsky?: boolean;
          metodikaBookable?: MetodikaBookableActivityPair[];
        };
        if (cancelled) return;

        const pairs = Array.isArray(json.metodikaBookable)
          ? json.metodikaBookable
          : [];
        const nextMap = bookableIdsByLocation(pairs);
        const signature = bookableMapSignature(nextMap);
        if (signature !== lastBookableSignature.current) {
          lastBookableSignature.current = signature;
          setMetodikaBookableByLocation(nextMap);
        }

        const pasientskySlots = Boolean(json.pasientsky);
        setHasPasientskySlots(pasientskySlots);
        setHasAvailableSlots(Boolean(res.ok && json.ok && json.hasSlots));
      } catch {
        if (!cancelled) {
          setHasAvailableSlots(false);
          setHasPasientskySlots(false);
          lastBookableSignature.current = "";
          setMetodikaBookableByLocation(EMPTY_BOOKABLE_MAP);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    showBookingButton,
    pageClinics.length,
    pageClinicKey,
    hasOnlineClinic,
    hasMetodikaClinic,
    hasPasientskyClinic,
    metodikaLocationIdsKey,
    profileWbActivityIdsKey,
    caregiverUserId,
    metodikaPrerequisitesLoading,
    pasientskyCalendarId,
    pasientskyServiceProviderId,
    bookingApiBase,
  ]);

  const effectiveLoading =
    loading ||
    (hasMetodikaClinic &&
      specialistShowsBookingButton({ showBookingButton }) &&
      pageClinics.length > 0 &&
      metodikaPrerequisitesLoading);

  return {
    hasAvailableSlots,
    hasPasientskySlots,
    loading: effectiveLoading,
    metodikaBookableByLocation,
  };
}
