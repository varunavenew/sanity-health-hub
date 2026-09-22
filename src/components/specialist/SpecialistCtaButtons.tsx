import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { Link, useLocaleParam } from "@/lib/router";
import { resolveNavPath } from "@/lib/navigation/resolve-nav-label";
import { useCmsRouteContext } from "@/lib/routing/cms-route-context";
import { useSpecialistPageBookingOptional } from "@/components/specialist/SpecialistPageBooking";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import {
  specialistProfileBookingPending,
  specialistShowsCallButton,
  specialistShowsProfileBookingButton,
  specialistShowsProfileCallToBookButton,
} from "@/lib/sanity/specialist-cta";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { cn } from "@/lib/utils";

interface SpecialistCtaButtonsProps {
  specialist: Specialist;
  bookingLabel: string;
  callLabel: string;
  /** Hero label when no online slots exist (supports `{firstName}` from profile UI). */
  callToBookLabel: string;
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

function SpecialistBookingAvailabilityPending({
  surface,
  label,
}: {
  surface: SpecialistCtaButtonsProps["surface"];
  label: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-normal",
        surface === "mobile"
          ? "w-full bg-white/20 text-white/80"
          : "w-full sm:w-auto bg-foreground/10 text-foreground/55",
      )}
    >
      <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
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
  callToBookLabel,
  surface,
}: SpecialistCtaButtonsProps) {
  const pageBooking = useSpecialistPageBookingOptional();
  const ui = useSpecialistProfileUi();
  const bookingPending = specialistProfileBookingPending(specialist, pageBooking);
  const showBooking = specialistShowsProfileBookingButton(specialist, pageBooking);
  const showCallToBook = specialistShowsProfileCallToBookButton(specialist, pageBooking);
  const showGenericCall =
    specialistShowsCallButton(specialist) &&
    !showCallToBook &&
    (surface === "desktop" ? true : !showBooking && !bookingPending);

  if (bookingPending) {
    return (
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-busy="true"
        aria-live="polite"
      >
        <SpecialistBookingAvailabilityPending
          surface={surface}
          label={ui.bookingAvailabilityCheckingLabel}
        />
        {surface === "desktop" && showGenericCall ? (
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

  if (!showBooking && !showCallToBook && !showGenericCall) return null;

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

        {showCallToBook ? (
          <CallUsClinicPicker
            variant="dark"
            size="lg"
            menuPlacement="top"
            label={callToBookLabel}
            specialist={specialist}
            className="w-full h-12 rounded-full font-normal"
          />
        ) : showGenericCall ? (
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

      {showCallToBook ? (
        <CallUsClinicPicker
          variant="cta"
          size="lg"
          label={callToBookLabel}
          specialist={specialist}
          className="px-7 w-full sm:w-auto h-12 rounded-full font-normal shadow-none"
        />
      ) : showGenericCall ? (
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
