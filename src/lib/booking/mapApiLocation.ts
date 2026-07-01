import type { BookingAvailabilityLocation } from "@/app/api/booking/availability/route";

/** Location tag shown on booking step 1 category rows. */
export type CategoryClinicTag = {
  locationId: number;
  name: string;
};

/** Clinic option built only from booking API `locations` (no static/Sanity merge). */
export type BookingMetodikaClinic = {
  id: string;
  label: string;
  apiLocationId: number;
  bookingSystem: "metodika";
  /** Sanity clinic slug/id when matched from CMS (for display + deep links). */
  sanityClinicId?: string;
  sanityImage?: string;
};

/** Clinic option from Sanity CMS with Pasientsky booking enabled. */
export type BookingPasientskyClinic = {
  id: string;
  label: string;
  bookingSystem: "pasientsky";
  serviceProviderId: string;
  calendarId?: string;
};

/** Clinic option from Sanity CMS with an external booking partner URL (e.g. Moss). */
export type BookingExternalClinic = {
  id: string;
  label: string;
  bookingSystem: "external";
  externalBookingUrl: string;
};

export type BookingClinic =
  | BookingMetodikaClinic
  | BookingPasientskyClinic
  | BookingExternalClinic;

/** @deprecated Use BookingMetodikaClinic */
export type BookingApiClinic = BookingMetodikaClinic;

export function isPasientskyClinic(
  clinic: BookingClinic,
): clinic is BookingPasientskyClinic {
  return clinic.bookingSystem === "pasientsky";
}

export function isMetodikaClinic(clinic: BookingClinic): clinic is BookingMetodikaClinic {
  return clinic.bookingSystem === "metodika";
}

export function isExternalClinic(clinic: BookingClinic): clinic is BookingExternalClinic {
  return clinic.bookingSystem === "external";
}

export function isSanityManagedClinic(
  clinic: BookingClinic,
): clinic is BookingPasientskyClinic | BookingExternalClinic {
  return clinic.bookingSystem === "pasientsky" || clinic.bookingSystem === "external";
}

export function apiLocationToClinic(
  apiLocation: BookingAvailabilityLocation,
): BookingMetodikaClinic {
  return {
    id: `location-${apiLocation.locationId}`,
    label: apiLocation.name,
    apiLocationId: apiLocation.locationId,
    bookingSystem: "metodika",
  };
}
