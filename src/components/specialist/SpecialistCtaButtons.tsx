import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { Link, useLocaleParam } from "@/lib/router";
import { resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import {
  specialistShowsBookingButton,
  specialistShowsCallButton,
} from "@/lib/sanity/specialist-cta";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface SpecialistCtaButtonsProps {
  specialist: Specialist;
  bookingLabel: string;
  callLabel: string;
  /** Mobile overlay sits on a dark photo; desktop split hero is a light panel. */
  surface: "mobile" | "desktop";
}

export function useBookAppointmentPath(): string {
  const locale = useLocaleParam();
  const { index } = useCmsRouteContext();
  return resolveNavPath({ navId: "bookAppointment" }, locale, index) || "/booking";
}

/**
 * Booking + Call pair for specialist profiles. Visibility comes from Sanity
 * `showBookingButton` / `showCallButton` — never from specialist names.
 *
 * Mobile keeps the existing overlay (booking-only) when booking is on, and
 * shows Call only when booking is hidden so “call only” still works on phones.
 * Desktop shows each button independently.
 */
export function SpecialistCtaButtons({
  specialist,
  bookingLabel,
  callLabel,
  surface,
}: SpecialistCtaButtonsProps) {
  const bookingHref = useBookAppointmentPath();
  const showBooking = specialistShowsBookingButton(specialist);
  const showCall = specialistShowsCallButton(specialist);
  const showCallHere = surface === "desktop" ? showCall : showCall && !showBooking;
  if (!showBooking && !showCallHere) return null;

  if (surface === "mobile") {
    return (
      <div className="flex flex-col gap-3">
        {showBooking ? (
          <Button
            asChild
            variant="cta"
            size="lg"
            className="w-full h-12 rounded-full font-normal"
          >
            <Link to={bookingHref}>{bookingLabel}</Link>
          </Button>
        ) : null}
        {showCallHere ? (
          <CallUsClinicPicker
            variant="dark"
            size="lg"
            label={callLabel}
            className="w-full h-12 rounded-full font-normal"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {showBooking ? (
        <Button asChild variant="cta" size="lg" className="px-7 w-full sm:w-auto">
          <Link to={bookingHref}>{bookingLabel}</Link>
        </Button>
      ) : null}
      {showCallHere ? (
        <CallUsClinicPicker
          variant="lightSolid"
          label={callLabel}
          className="w-full sm:w-auto border-transparent bg-white text-foreground hover:bg-foreground hover:text-background hover:border-transparent"
        />
      ) : null}
    </div>
  );
}
