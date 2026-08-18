import type { BookingCaregiver } from "@/lib/booking/bookingCaregiver";
import { isBookingCaregiver } from "@/lib/booking/bookingCaregiver";
import {
  isMetodikaClinic,
  type BookingClinic,
} from "@/lib/booking/mapApiLocation";
import { normalizeClinicLabelForCompare } from "@/lib/booking/sanityBookingClinic";
import { slugifyNo } from "@/lib/bookingLinks";
import type { Specialist } from "@/lib/sanity/specialist-types";

export type SpecialistClinicConstraint = {
  /** Sanity clinic slugs / ids / labels the specialist works at. */
  keys: string[];
  /** Metodika caregiver id when known. */
  caregiverUserId?: number;
};

/** Resolve Metodika user id from either a Sanity specialist or a booking caregiver. */
export function resolveBookingCaregiverUserId(
  specialist: Specialist | BookingCaregiver | undefined | null,
): number | undefined {
  if (!specialist) return undefined;
  if (isBookingCaregiver(specialist)) return specialist.apiUserId;
  const id = specialist.metodikaUserId;
  return typeof id === "number" && id > 0 ? id : undefined;
}

function normalizeClinicKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const slug = slugifyNo(trimmed);
  if (slug) return slug;
  return normalizeClinicLabelForCompare(trimmed);
}

/** Collect clinic match keys from a Sanity specialist profile. */
export function specialistClinicConstraintKeys(
  specialist: Specialist | BookingCaregiver,
): string[] {
  if (isBookingCaregiver(specialist)) return [];

  const keys = new Set<string>();
  for (const ref of specialist.clinicRefs ?? []) {
    const slug = ref.slug?.trim();
    const label = ref.label?.trim();
    if (slug) keys.add(normalizeClinicKey(slug));
    if (label) keys.add(normalizeClinicKey(label));
  }
  for (const label of specialist.clinics ?? []) {
    if (typeof label === "string" && label.trim()) {
      keys.add(normalizeClinicKey(label));
    }
  }
  return [...keys].filter(Boolean);
}

export function getSpecialistClinicConstraint(
  specialist: Specialist | BookingCaregiver | undefined | null,
): SpecialistClinicConstraint | null {
  if (!specialist) return null;
  const keys = specialistClinicConstraintKeys(specialist);
  const caregiverUserId = resolveBookingCaregiverUserId(specialist);
  if (keys.length === 0 && caregiverUserId == null) return null;
  return { keys, caregiverUserId };
}

function clinicMatchesConstraintKeys(
  clinic: BookingClinic,
  keys: string[],
): boolean {
  if (keys.length === 0) return false;

  const candidates = new Set<string>();
  candidates.add(normalizeClinicKey(clinic.id));
  candidates.add(normalizeClinicKey(clinic.label));
  if (isMetodikaClinic(clinic) && clinic.sanityClinicId) {
    candidates.add(normalizeClinicKey(clinic.sanityClinicId));
  }

  for (const key of keys) {
    for (const candidate of candidates) {
      if (!candidate) continue;
      if (
        candidate === key ||
        candidate.includes(key) ||
        key.includes(candidate)
      ) {
        return true;
      }
    }
  }
  return false;
}

export type FreeTimeSlotLocationHint = {
  locationId?: number;
  caregiverUserId?: number;
};

/**
 * When a specialist is preselected (e.g. from ?spesialist=), only keep clinics
 * where that person works / has availability — never fall back to the full list.
 */
export function filterClinicsForPreselectedSpecialist<T extends BookingClinic>(
  clinics: T[],
  specialist: Specialist | BookingCaregiver | undefined | null,
  freeTimeSlots: FreeTimeSlotLocationHint[] = [],
): T[] {
  const constraint = getSpecialistClinicConstraint(specialist);
  if (!constraint) return clinics;

  const locationIdsFromSlots = new Set<number>();
  if (constraint.caregiverUserId != null) {
    for (const slot of freeTimeSlots) {
      if (
        slot.caregiverUserId === constraint.caregiverUserId &&
        typeof slot.locationId === "number"
      ) {
        locationIdsFromSlots.add(slot.locationId);
      }
    }
  }

  const bySanity = constraint.keys.length
    ? clinics.filter((clinic) => clinicMatchesConstraintKeys(clinic, constraint.keys))
    : null;

  const bySlots =
    locationIdsFromSlots.size > 0
      ? clinics.filter(
          (clinic) =>
            isMetodikaClinic(clinic) &&
            locationIdsFromSlots.has(clinic.apiLocationId),
        )
      : null;

  if (bySanity && bySlots) {
    const slotIds = new Set<number>();
    for (const clinic of bySlots) {
      if (isMetodikaClinic(clinic)) slotIds.add(clinic.apiLocationId);
    }
    const intersection = bySanity.filter((clinic) => {
      if (!isMetodikaClinic(clinic)) return true;
      return slotIds.has(clinic.apiLocationId);
    });
    // Prefer intersection; if empty (e.g. Pasientsky-only Sanity clinic), keep Sanity list.
    return intersection.length > 0 ? intersection : bySanity;
  }

  if (bySanity) return bySanity;
  if (bySlots) return bySlots;

  // Caregiver known but no Sanity clinic list and no matching slot locations —
  // hide clinics rather than showing every location (avoids the Alenka bug).
  if (constraint.caregiverUserId != null) {
    return [];
  }

  return clinics;
}

/** Whether the given clinic is allowed for the preselected specialist. */
export function clinicAllowedForSpecialist(
  clinic: BookingClinic,
  specialist: Specialist | BookingCaregiver | undefined | null,
  freeTimeSlots: FreeTimeSlotLocationHint[] = [],
): boolean {
  if (!getSpecialistClinicConstraint(specialist)) return true;
  return filterClinicsForPreselectedSpecialist(
    [clinic],
    specialist,
    freeTimeSlots,
  ).length > 0;
}
