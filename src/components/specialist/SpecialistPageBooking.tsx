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
import { specialistHasOnlineProfileBooking } from "@/lib/sanity/specialist-cta";
import { useNavigate } from "@/lib/router";

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
  /** True when Metodika/Pasientsky booking is set up on this profile. */
  hasOnlineProfileBooking: boolean;
  /** False while checking Metodika/Pasientsky slot availability. */
  availabilityLoading: boolean;
  /** True when at least one online slot exists for this specialist. */
  hasAvailableSlots: boolean;
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
  const hasOnlineProfileBooking = useMemo(
    () => specialistHasOnlineProfileBooking(specialist, pageClinics),
    [specialist, pageClinics],
  );
  const { hasAvailableSlots, loading: slotsLoading } =
    useSpecialistHasAvailableSlots(specialist, pageClinics);
  const availabilityLoading =
    clinicsLoading || (!hasOnlineProfileBooking && slotsLoading);
  const navigate = useNavigate();
  const moelvPasientskyClinic = useMemo(
    () => moelvPasientskyClinicFromPageClinics(pageClinics),
    [pageClinics],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetScroll();
    requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 0);
    return () => window.clearTimeout(timer);
  }, [specialist.slug]);

  const scrollToBookingSection = useCallback(() => {
    trackBookingMenuStart({
      entry_point: "specialist_page",
      practitioner: specialist.name,
      specialty: specialist.title || specialist.expertise?.[0]?.label || null,
      clinic: moelvPasientskyClinic?.label ?? specialist.clinicRefs?.[0]?.label ?? specialist.clinics?.[0] ?? null,
    });

    if (moelvPasientskyClinic) {
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
  }, [specialist, moelvPasientskyClinic, navigate]);

  const scrollToBookingSteps = useCallback(() => {
    setBookingFocusKey((key) => key + 1);
    scrollToSpecialistBookingSteps();
  }, []);

  const value = useMemo(
    () => ({
      scrollToBookingSection,
      scrollToBookingSteps,
      bookingFocusKey,
      hasOnlineProfileBooking,
      availabilityLoading,
      hasAvailableSlots,
    }),
    [
      scrollToBookingSection,
      scrollToBookingSteps,
      bookingFocusKey,
      hasOnlineProfileBooking,
      availabilityLoading,
      hasAvailableSlots,
    ],
  );

  return (
    <SpecialistPageBookingContext.Provider value={value}>
      {children}
    </SpecialistPageBookingContext.Provider>
  );
}
