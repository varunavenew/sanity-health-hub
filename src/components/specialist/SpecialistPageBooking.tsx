"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { trackBookingMenuStart } from "@/lib/tracking/seo-events";
import { useClinics } from "@/hooks/useSanity";
import { useSpecialistHasAvailableSlots } from "@/hooks/useSpecialistHasAvailableSlots";
import {
  moelvPasientskyClinicFromPageClinics,
  resolveSpecialistPageClinics,
} from "@/lib/booking/specialist-page-clinics";
import { bookingUrlForSpecialistContext } from "@/lib/booking/specialist-booking";
import { prefetchSpecialistMetodikaBookingData } from "@/lib/booking/prefetch-specialist-metodika-booking";
import { useLocaleParam, useNavigate } from "@/lib/router";
import { useQueryClient } from "@tanstack/react-query";

export const SPECIALIST_INLINE_BOOKING_SECTION_ID = "specialist-inline-booking";
export const SPECIALIST_INLINE_BOOKING_STEPS_ID = "specialist-inline-booking-steps";

export function scrollToSpecialistBookingSection(
  behavior: ScrollBehavior = "smooth",
): void {
  document.getElementById(SPECIALIST_INLINE_BOOKING_SECTION_ID)?.scrollIntoView({
    behavior,
    block: "start",
  });
}

export function scrollToSpecialistBookingSteps(
  behavior: ScrollBehavior = "smooth",
): void {
  document.getElementById(SPECIALIST_INLINE_BOOKING_STEPS_ID)?.scrollIntoView({
    behavior,
    block: "start",
  });
}

type SpecialistPageBookingContextValue = {
  scrollToBookingSection: () => void;
  scrollToBookingSteps: () => void;
  /** Increments when the user opens booking — inline UI resets clinic selection. */
  bookingFocusKey: number;
  /** False while checking Metodika/Pasientsky slot availability. */
  availabilityLoading: boolean;
  /** True when at least one online slot exists for this specialist. */
  hasAvailableSlots: boolean;
  /** Pasientsky calendar has bookable times (e.g. Moelv). */
  hasPasientskySlots: boolean;
  /** Metodika wbactivity ids with freetime at each clinic location id. */
  metodikaBookableByLocation: Map<number, Set<number>>;
};

const SpecialistPageBookingContext =
  createContext<SpecialistPageBookingContextValue | null>(null);

export function useSpecialistPageBookingOptional() {
  return useContext(SpecialistPageBookingContext);
}

/** Scroll-to-section booking on specialist profiles — no modal dialog. */
export function SpecialistPageBookingProvider({
  specialist,
  children,
}: {
  specialist: Specialist;
  children: ReactNode;
}) {
  const [bookingFocusKey, setBookingFocusKey] = useState(0);
  const { data: sanityClinics = [], isLoading: clinicsLoading } = useClinics();
  const pageClinics = useMemo(
    () => resolveSpecialistPageClinics(specialist, sanityClinics),
    [specialist, sanityClinics],
  );
  const { hasAvailableSlots, hasPasientskySlots, loading: slotsLoading, metodikaBookableByLocation } =
    useSpecialistHasAvailableSlots(specialist, pageClinics);
  const availabilityLoading = clinicsLoading || slotsLoading;
  const navigate = useNavigate();
  const locale = useLocaleParam();
  const queryClient = useQueryClient();
  const moelvPasientskyClinic = useMemo(
    () => moelvPasientskyClinicFromPageClinics(pageClinics),
    [pageClinics],
  );
  const moelvOnlyBooking =
    Boolean(moelvPasientskyClinic) && pageClinics.length === 1;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetScroll();
    requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 0);
    return () => window.clearTimeout(timer);
  }, [specialist.slug]);

  useEffect(() => {
    prefetchSpecialistMetodikaBookingData(queryClient, {
      specialist,
      pageClinics,
      locale,
    });
  }, [queryClient, specialist, pageClinics, locale]);

  const scrollToBookingSection = useCallback(() => {
    trackBookingMenuStart({
      entry_point: "specialist_page",
      practitioner: specialist.name,
      specialty: specialist.title || specialist.expertise?.[0]?.label || null,
      clinic:
        pageClinics.length === 1
          ? (pageClinics[0]?.label ?? null)
          : null,
    });

    if (moelvOnlyBooking && moelvPasientskyClinic) {
      navigate(
        bookingUrlForSpecialistContext({
          specialistSlug: specialist.slug,
          klinikk: moelvPasientskyClinic.slug,
        }),
      );
      return;
    }

    setBookingFocusKey((key) => key + 1);
    scrollToSpecialistBookingSection();
  }, [specialist, moelvOnlyBooking, moelvPasientskyClinic, navigate, pageClinics]);

  const scrollToBookingSteps = useCallback(() => {
    setBookingFocusKey((key) => key + 1);
    scrollToSpecialistBookingSteps();
  }, []);

  const value = useMemo(
    () => ({
      scrollToBookingSection,
      scrollToBookingSteps,
      bookingFocusKey,
      availabilityLoading,
      hasAvailableSlots,
      hasPasientskySlots,
      metodikaBookableByLocation,
    }),
    [
      scrollToBookingSection,
      scrollToBookingSteps,
      bookingFocusKey,
      availabilityLoading,
      hasAvailableSlots,
      hasPasientskySlots,
      metodikaBookableByLocation,
    ],
  );

  return (
    <SpecialistPageBookingContext.Provider value={value}>
      {children}
    </SpecialistPageBookingContext.Provider>
  );
}
