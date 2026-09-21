import type { Specialist } from "@/lib/sanity/specialist-types";
import type { BookingCaregiver } from "@/lib/booking/bookingCaregiver";
import { isBookingCaregiver } from "@/lib/booking/bookingCaregiver";

/** Known Pasientsky calendar ids when Sanity has not hydrated yet (slug → calendar). */
const KNOWN_PASIENTSKY_CALENDAR_BY_SLUG: Record<string, string> = {
  "alenka-bindas": "a7adda2c-7666-11ed-8b96-4677a7ea5c36",
  "kristin-floberghagen": "f665569c-1706-11f1-9868-26bf0fc69743",
  "einar-andre-brevik": "a783a72a-7666-11ed-befd-4677a7ea5c36",
  "thor-brevik": "93f0a3a2-a051-11f1-9a16-2efa270d0feb",
  "bjorn-robstad": "a773d304-7666-11ed-9fa8-4677a7ea5c36",
  "morten-andersen": "a7a35070-7666-11ed-9a08-4677a7ea5c36",
  "nabeel-yousaf-khan": "2218bd7a-83db-11f0-a32b-924abeff70b8",
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
