import type { BookingClinic, BookingMetodikaClinic } from "@/lib/booking/mapApiLocation";
import { isMetodikaClinic } from "@/lib/booking/mapApiLocation";
import type { SanityClinicListRow } from "@/lib/sanity/clinic-list-row";
import {
  clinicOffersBookingCategory,
  enrichMetodikaClinicWithSanity,
  findSanityClinicBySlugOrId,
  normalizeClinicLabelForCompare,
  resolveBookingCategoryKeys,
  sanityManagedClinicFromSanity,
} from "@/lib/booking/sanityBookingClinic";

export function categoryOfferedAtClinic(
  clinicServices: string[] | undefined,
  categoryId?: string,
  categoryApiSlug?: string,
): boolean {
  const keys = resolveBookingCategoryKeys(categoryId, categoryApiSlug);
  return clinicOffersBookingCategory(clinicServices, keys);
}

export function filterBookingCategoriesForClinic<
  T extends { id: string; clinicServiceId?: string },
>(categories: T[], clinic: SanityClinicListRow | undefined): T[] {
  if (!clinic?.services?.length) return categories;
  return categories.filter((category) =>
    categoryOfferedAtClinic(
      clinic.services,
      category.clinicServiceId ?? category.id,
      category.id,
    ),
  );
}

export function metodikaClinicFromSanityRow(
  clinic: SanityClinicListRow,
): BookingMetodikaClinic | null {
  if (clinic.booking?.method !== "metodika") return null;
  const locationId = clinic.booking.metodikaLocationId;
  if (typeof locationId !== "number" || !Number.isFinite(locationId) || locationId <= 0) {
    return null;
  }
  return {
    id: `location-${locationId}`,
    label: clinic.label,
    apiLocationId: locationId,
    bookingSystem: "metodika",
    sanityClinicId: clinic.id,
    sanityImage: clinic.primaryImage,
  };
}

function findEnrichedMetodikaClinic(
  sanityClinic: SanityClinicListRow,
  enrichedMetodikaClinics: BookingMetodikaClinic[],
): BookingMetodikaClinic | undefined {
  const locationId = sanityClinic.booking?.metodikaLocationId;
  if (typeof locationId === "number" && locationId > 0) {
    const byId = enrichedMetodikaClinics.find((clinic) => clinic.apiLocationId === locationId);
    if (byId) return byId;
  }

  const normalizedSanity = normalizeClinicLabelForCompare(sanityClinic.label);
  return enrichedMetodikaClinics.find((clinic) => {
    const normalizedApi = normalizeClinicLabelForCompare(clinic.label);
    return (
      clinic.sanityClinicId === sanityClinic.id ||
      normalizedSanity === normalizedApi ||
      normalizedSanity.includes(normalizedApi) ||
      normalizedApi.includes(normalizedSanity)
    );
  });
}

/** Resolve Sanity clinic row + bookable clinic object from ?klinikk= slug. */
export function resolveLockedClinicBooking(
  sanityClinics: SanityClinicListRow[],
  slug: string,
  enrichedMetodikaClinics: BookingMetodikaClinic[] = [],
): { sanityClinic: SanityClinicListRow; bookingClinic?: BookingClinic } | null {
  const sanityClinic = findSanityClinicBySlugOrId(sanityClinics, slug);
  if (!sanityClinic) return null;

  const managed = sanityManagedClinicFromSanity(sanityClinic);
  if (managed) {
    return { sanityClinic, bookingClinic: managed };
  }

  if (sanityClinic.booking?.method !== "metodika") {
    return { sanityClinic };
  }

  const fromSanity = metodikaClinicFromSanityRow(sanityClinic);
  const fromApi = findEnrichedMetodikaClinic(sanityClinic, enrichedMetodikaClinics);
  const metodika = fromApi
    ? enrichMetodikaClinicWithSanity(fromApi, sanityClinic)
    : fromSanity;

  return metodika ? { sanityClinic, bookingClinic: metodika } : { sanityClinic };
}

export function bookingClinicMatches(a: BookingClinic, b: BookingClinic): boolean {
  if (a.bookingSystem !== b.bookingSystem) return false;
  if (a.id === b.id) return true;
  if (isMetodikaClinic(a) && isMetodikaClinic(b)) {
    return a.apiLocationId === b.apiLocationId;
  }
  return false;
}

export function filterClinicsForLockedClinic(
  clinics: BookingClinic[],
  lockedClinic: BookingClinic,
): BookingClinic[] {
  const matches = clinics.filter((clinic) => bookingClinicMatches(clinic, lockedClinic));
  return matches.length > 0 ? matches : [lockedClinic];
}
