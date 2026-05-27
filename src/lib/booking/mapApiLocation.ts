import type { BookingAvailabilityLocation } from "@/app/api/booking/availability/route";

/** Location tag shown on booking step 1 category rows. */
export type CategoryClinicTag = {
  locationId: number;
  name: string;
};

/** Clinic option built only from booking API `locations` (no static/Sanity merge). */
export type BookingApiClinic = {
  id: string;
  label: string;
  apiLocationId: number;
  bookingSystem: "metodika";
};

export function apiLocationToClinic(
  apiLocation: BookingAvailabilityLocation,
): BookingApiClinic {
  return {
    id: `location-${apiLocation.locationId}`,
    label: apiLocation.name,
    apiLocationId: apiLocation.locationId,
    bookingSystem: "metodika",
  };
}
