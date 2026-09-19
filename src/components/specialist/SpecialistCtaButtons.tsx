import type { ReactNode } from "react";

import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocaleParam } from "@/lib/router";
import { resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useSpecialistPageBookingOptional } from "@/components/specialist/SpecialistPageBooking";
import {
  specialistProfileBookingPending,
  specialistShowsCallButton,
  specialistShowsProfileBookingButton,
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

/** Visible Book now control. Scrolls to the inline booking section on the profile. */
export function SpecialistBookNowButton({
  specialist,
  className,
  variant = "cta",
  size = "lg",
  children,
}: SpecialistBookNowButtonProps) {
  const bookingHref = useBookAppointmentPath();
  const pageBooking = useSpecialistPageBookingOptional();

  if (pageBooking) {
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => pageBooking.scrollToBookingSection()}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link to={bookingHref}>{children}</Link>
    </Button>
  );
}

function SpecialistBookingButtonSkeleton({
  surface,
}: {
  surface: SpecialistCtaButtonsProps["surface"];
}) {
  if (surface === "mobile") {
    return <Skeleton className="h-12 w-full rounded-full bg-white/20" aria-hidden="true" />;
  }

  return (
    <Skeleton
      className="h-12 w-full rounded-full sm:w-52 bg-foreground/10"
      aria-hidden="true"
    />
  );
}

/**
 * Booking + Call pair for specialist profiles. Visibility comes from Sanity
 * `showBookingButton` / `showCallButton`. On the profile, Book now opens
 * in-page booking (this doctor's clinics) and does not navigate to /booking.
 */
export function SpecialistCtaButtons({
  specialist,
  bookingLabel,
  callLabel,
  surface,
}: SpecialistCtaButtonsProps) {
  const pageBooking = useSpecialistPageBookingOptional();
  const bookingPending = specialistProfileBookingPending(specialist, pageBooking);
  const showBooking = specialistShowsProfileBookingButton(specialist, pageBooking);
  const showCall = specialistShowsCallButton(specialist);
  const showCallHere =
    surface === "desktop"
      ? showCall
      : showCall && !showBooking && !bookingPending;

  if (bookingPending) {
    return (
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-busy="true"
        aria-live="polite"
      >
        <SpecialistBookingButtonSkeleton surface={surface} />
        {surface === "desktop" && showCall ? (
          <CallUsClinicPicker
            variant="lightSolid"
            label={callLabel}
            specialist={specialist}
            className="w-full sm:w-auto border-transparent bg-white text-foreground hover:bg-foreground hover:text-background hover:border-transparent"
          />
        ) : null}
      </div>
    );
  }

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
            menuPlacement="top"
            label={callLabel}
            specialist={specialist}
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
          specialist={specialist}
          className="w-full sm:w-auto border-transparent bg-white text-foreground hover:bg-foreground hover:text-background hover:border-transparent"
        />
      ) : null}
    </div>
  );
}
