import type { ImageRef } from "@/lib/media";
import profileDummy from "@/assets/specialists/profile-dummy.png";

/** Default portrait when a booking-step specialist has no CMS/API photo. */
export const BOOKING_SPECIALIST_PROFILE_DUMMY: ImageRef = profileDummy;

export function placeholderImageForCaregiverId(_userId: number): ImageRef {
  return BOOKING_SPECIALIST_PROFILE_DUMMY;
}

export function resolveBookingSpecialistImage(image?: ImageRef | null): ImageRef {
  if (image == null) return BOOKING_SPECIALIST_PROFILE_DUMMY;
  if (typeof image === "string") {
    return image.trim() ? image : BOOKING_SPECIALIST_PROFILE_DUMMY;
  }
  return image.src?.trim() ? image : BOOKING_SPECIALIST_PROFILE_DUMMY;
}
