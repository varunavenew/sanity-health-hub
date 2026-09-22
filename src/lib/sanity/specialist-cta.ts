import type { SpecialistPageClinic } from "@/lib/booking/specialist-page-clinics";
import { moelvPasientskyClinicFromPageClinics } from "@/lib/booking/specialist-page-clinics";
import { specialistClinicConstraintKeys } from "@/lib/booking/filterClinicsForSpecialist";
import type { Specialist } from "@/lib/sanity/specialist-types";

type SpecialistBookingFields = {
  showBookingButton?: boolean | null;
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
};

function hasPositiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Online booking works only when both Metodika user ID and activity groups are set. */
export function specialistHasOnlineBookingConfig(specialist: {
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
}): boolean {
  const hasMetodikaId = hasPositiveId(specialist.metodikaUserId);
  const hasActivityGroups = (specialist.bookingCategoryIds ?? []).some(hasPositiveId);
  return hasMetodikaId && hasActivityGroups;
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

/** Unset CMS toggles keep current website behaviour (both buttons visible). */
export function specialistShowsBookingButton(
  specialist: SpecialistBookingFields,
): boolean {
  return specialist.showBookingButton !== false;
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
