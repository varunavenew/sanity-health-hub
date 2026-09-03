import type { ReactNode } from "react";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { Link, useLocaleParam } from "@/lib/router";
import { resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { cn } from "@/lib/utils";
import {
  specialistHasOnlineBookingConfig,
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

interface SpecialistBookNowButtonProps {
  specialist: Specialist;
  className?: string;
  variant?: "cta" | "default";
  size?: "lg" | "default";
  children: ReactNode;
}

/** Visible Book now control. Navigates only when both Metodika ID and activity groups are set. */
export function SpecialistBookNowButton({
  specialist,
  className,
  variant = "cta",
  size = "lg",
  children,
}: SpecialistBookNowButtonProps) {
  const bookingHref = useBookAppointmentPath();
  const canBook = specialistHasOnlineBookingConfig(specialist);

  if (canBook) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link to={bookingHref}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className, "cursor-not-allowed")}
      aria-disabled="true"
      onClick={(event) => event.preventDefault()}
    >
      {children}
    </Button>
  );
}

/**
 * Booking + Call pair for specialist profiles. Visibility comes from Sanity
 * `showBookingButton` / `showCallButton`. Book now stays visible when Metodika
 * user ID or booking activity groups are empty, but does not open booking.
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
  const showBooking = specialistShowsBookingButton(specialist);
  const showCall = specialistShowsCallButton(specialist);
  const showCallHere = surface === "desktop" ? showCall : showCall && !showBooking;
  if (!showBooking && !showCallHere) return null;

  if (surface === "mobile") {
    return (
      <div className="flex flex-col gap-3">
        {showBooking ? (
          <SpecialistBookNowButton
            specialist={specialist}
            variant="cta"
            size="lg"
            className="w-full h-12 rounded-full font-normal"
          >
            {bookingLabel}
          </SpecialistBookNowButton>
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
        <SpecialistBookNowButton
          specialist={specialist}
          variant="cta"
          size="lg"
          className="px-7 w-full sm:w-auto"
        >
          {bookingLabel}
        </SpecialistBookNowButton>
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
