import type { SpecialistPageClinic } from "@/lib/booking/specialist-page-clinics";
import { moelvPasientskyClinicFromPageClinics } from "@/lib/booking/specialist-page-clinics";
import { specialistClinicConstraintKeys } from "@/lib/booking/filterClinicsForSpecialist";
import type { Specialist } from "@/lib/sanity/specialist-types";

type SpecialistBookingFields = {
  bookingEnabled?: boolean | null;
  showBookingButton?: boolean | null;
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
};

function hasPositiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Metodika online booking when caregiver id is set (groups come from Metodika on profile). */
export function specialistHasOnlineBookingConfig(specialist: {
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
}): boolean {
  void specialist.bookingCategoryIds;
  return hasPositiveId(specialist.metodikaUserId);
}

/**
 * Book now on the specialist profile opens in-page booking (clinic picker).
 * Metodika IDs are not required — Moelv (Pasientsky) and Moss (phone) still work.
 */
export function specialistCanOpenPageBooking(
  specialist: SpecialistBookingFields,
): boolean {
  return specialistShowsBookingButton(specialist);
}

/**
 * Advanced → Booking enabled. Unset means bookable (same as the old profile).
 * Off removes this specialist from website booking, not only the Studio 🚫 list.
 */
export function specialistAllowsWebsiteBooking(
  specialist: Pick<SpecialistBookingFields, "bookingEnabled">,
): boolean {
  return specialist.bookingEnabled !== false;
}

/** Unset CMS toggles keep current website behaviour (both buttons visible). */
export function specialistShowsBookingButton(
  specialist: SpecialistBookingFields,
): boolean {
  return (
    specialistAllowsWebsiteBooking(specialist) &&
    specialist.showBookingButton !== false
  );
}

function specialistWorksAtMetodikaLocation(specialist: Specialist): boolean {
  const keys = specialistClinicConstraintKeys(specialist);
  return keys.some(
    (key) =>
      key.includes("bekkestua") ||
      key.includes("majorstuen") ||
      key.includes("majorstua"),
  );
}

/** Metodika clinic, Moelv Pasientsky, or CMS Metodika booking ids on the profile. */
export function specialistHasOnlineProfileBooking(
  specialist: Specialist,
  pageClinics: SpecialistPageClinic[],
): boolean {
  if (moelvPasientskyClinicFromPageClinics(pageClinics)) return true;
  if (
    pageClinics.some(
      (clinic) => clinic.kind === "metodika" || clinic.kind === "pasientsky",
    )
  ) {
    return true;
  }
  if (
    hasPositiveId(specialist.metodikaUserId) &&
    specialistWorksAtMetodikaLocation(specialist)
  ) {
    return true;
  }
  return specialistHasOnlineBookingConfig(specialist);
}

/** Booking CTA on profile pages when online booking is configured for this doctor. */
export function specialistShowsProfileBookingButton(
  specialist: SpecialistBookingFields,
  pageBooking?: {
    availabilityLoading?: boolean;
    hasAvailableSlots?: boolean;
  } | null,
): boolean {
  if (!specialistShowsBookingButton(specialist)) return false;
  if (!pageBooking) return true;
  if (pageBooking.availabilityLoading) return false;
  return pageBooking.hasAvailableSlots === true;
}

/** True while clinic/slot data needed for the booking CTA is still loading. */
export function specialistProfileBookingPending(
  specialist: SpecialistBookingFields,
  pageBooking?: {
    availabilityLoading?: boolean;
  } | null,
): boolean {
  if (!specialistShowsBookingButton(specialist)) return false;
  return Boolean(pageBooking?.availabilityLoading);
}

/**
 * Hero fallback when online booking is enabled but no slots were found —
 * show “Call us to book…” instead of hiding the booking CTA.
 */
export function specialistShowsProfileCallToBookButton(
  specialist: SpecialistBookingFields,
  pageBooking?: {
    availabilityLoading?: boolean;
    hasAvailableSlots?: boolean;
  } | null,
): boolean {
  if (!specialistShowsBookingButton(specialist)) return false;
  if (!pageBooking) return false;
  if (pageBooking.availabilityLoading) return false;
  return pageBooking.hasAvailableSlots !== true;
}

export function specialistShowsCallButton(specialist: {
  showCallButton?: boolean | null;
}): boolean {
  return specialist.showCallButton !== false;
}

export function specialistHasHeroCtas(specialist: SpecialistBookingFields & {
  showCallButton?: boolean | null;
}): boolean {
  return specialistShowsBookingButton(specialist) || specialistShowsCallButton(specialist);
}
