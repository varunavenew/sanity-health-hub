import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

const buttonClass =
  "h-12 min-h-12 px-8 rounded-2xl w-full sm:w-auto shrink-0";

interface TreatmentCtaButtonsProps {
  primaryLabel?: string;
  /** Locale-agnostic or localized booking path; preferred over onPrimary. */
  primaryHref?: string;
  /** Fired on primary click (e.g. analytics). Navigation uses primaryHref when set. */
  onPrimary?: () => void;
  callLabel?: string;
  /** Category page id — limits the call dropdown to clinics that offer it. */
  categoryId?: string;
  className?: string;
}

/** Matching book + call pair used on treatment and category pages. */
export function TreatmentCtaButtons({
  primaryLabel,
  primaryHref,
  onPrimary,
  callLabel,
  categoryId,
  className,
}: TreatmentCtaButtonsProps) {
  if (!primaryLabel && !callLabel) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center",
        className,
      )}
    >
      {primaryLabel ? (
        primaryHref ? (
          <Button variant="cta" size="lg" className={buttonClass} asChild>
            <Link to={primaryHref} onClick={onPrimary}>
              {primaryLabel}
            </Link>
          </Button>
        ) : (
          <Button
            variant="cta"
            size="lg"
            className={buttonClass}
            onClick={onPrimary}
          >
            {primaryLabel}
          </Button>
        )
      ) : null}
      {callLabel ? (
        <CallUsClinicPicker
          variant="lightSolid"
          size="lg"
          label={callLabel}
          categoryId={categoryId}
          className={buttonClass}
        />
      ) : null}
    </div>
  );
}
