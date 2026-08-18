import type { Specialist } from "@/lib/sanity/specialist-types";
import type { BookingCaregiver } from "@/lib/booking/bookingCaregiver";
import { isBookingCaregiver } from "@/lib/booking/bookingCaregiver";

/** Known Pasientsky calendar ids when Sanity has not hydrated yet (slug → calendar). */
const KNOWN_PASIENTSKY_CALENDAR_BY_SLUG: Record<string, string> = {
  "alenka-bindas": "a7adda2c-7666-11ed-8b96-4677a7ea5c36",
};

export function pasientskyCalendarIdForSpecialist(
  specialist: Specialist | BookingCaregiver | undefined | null,
): string | undefined {
  if (!specialist || isBookingCaregiver(specialist)) return undefined;
  const fromSanity = specialist.pasientskyCalendarId?.trim();
  if (fromSanity) return fromSanity;
  const slug = specialist.slug?.trim();
  if (slug && KNOWN_PASIENTSKY_CALENDAR_BY_SLUG[slug]) {
    return KNOWN_PASIENTSKY_CALENDAR_BY_SLUG[slug];
  }
  return undefined;
}
