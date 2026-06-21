import type {
  BookingExternalClinic,
  BookingPasientskyClinic,
} from "@/lib/booking/mapApiLocation";
import type { SanityClinicListRow } from "@/hooks/useSanity";

export type SanityManagedBookingClinic = BookingPasientskyClinic | BookingExternalClinic;

export function sanityManagedClinicFromSanity(
  clinic: SanityClinicListRow,
): SanityManagedBookingClinic | null {
  const booking = clinic.booking;
  if (!booking) return null;

  const serviceProviderId = booking.serviceProviderId?.trim();
  if (booking.method === "pasientsky" && serviceProviderId) {
    return {
      id: clinic.id,
      label: clinic.label,
      bookingSystem: "pasientsky",
      serviceProviderId,
    };
  }

  const externalBookingUrl = booking.externalBookingUrl?.trim();
  if (booking.method === "info" && externalBookingUrl) {
    return {
      id: clinic.id,
      label: clinic.label,
      bookingSystem: "external",
      externalBookingUrl,
    };
  }

  return null;
}

export function sanityManagedClinicsForCategory(
  clinics: SanityClinicListRow[],
  categoryId?: string,
): SanityManagedBookingClinic[] {
  return clinics
    .map((clinic) => {
      const managed = sanityManagedClinicFromSanity(clinic);
      if (!managed) return null;
      if (!categoryId) return managed;
      const services = clinic.services;
      if (!services?.length) return managed;
      return services.includes(categoryId) ? managed : null;
    })
    .filter((clinic): clinic is SanityManagedBookingClinic => clinic != null);
}

export function findSanityManagedClinicBySlug(
  clinics: SanityClinicListRow[],
  slugOrId: string,
): SanityManagedBookingClinic | null {
  const normalized = slugOrId.trim().toLowerCase();
  const row = clinics.find(
    (clinic) =>
      clinic.id.toLowerCase() === normalized || clinic.slug.toLowerCase() === normalized,
  );
  return row ? sanityManagedClinicFromSanity(row) : null;
}
