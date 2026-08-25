import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import {
  specialistShowsBookingButton,
  specialistShowsCallButton,
} from "@/lib/sanity/specialist-cta";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface SpecialistCtaButtonsProps {
  specialist: Specialist;
  onBookingClick: () => void;
  bookingLabel: string;
  callLabel: string;
  /** Mobile overlay sits on a dark photo; desktop split hero is a light panel. */
  surface: "mobile" | "desktop";
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
  onBookingClick,
  bookingLabel,
  callLabel,
  surface,
}: SpecialistCtaButtonsProps) {
  const showBooking = specialistShowsBookingButton(specialist);
  const showCall = specialistShowsCallButton(specialist);
  const showCallHere = surface === "desktop" ? showCall : showCall && !showBooking;
  if (!showBooking && !showCallHere) return null;

  if (surface === "mobile") {
    return (
      <div className="flex flex-col gap-3">
        {showBooking ? (
          <Button
            variant="cta"
            size="lg"
            className="w-full h-12 rounded-full font-normal"
            onClick={onBookingClick}
          >
            {bookingLabel}
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
        <Button
          variant="cta"
          size="lg"
          className="px-7 w-full sm:w-auto"
          onClick={onBookingClick}
        >
          {bookingLabel}
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
