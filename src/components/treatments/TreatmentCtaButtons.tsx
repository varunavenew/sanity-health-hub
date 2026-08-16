import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const buttonClass =
  "h-12 min-h-12 px-8 rounded-2xl w-full sm:w-auto shrink-0";

interface TreatmentCtaButtonsProps {
  primaryLabel?: string;
  onPrimary: () => void;
  callLabel?: string;
  className?: string;
}

/** Matching book + call pair used on treatment and category pages. */
export function TreatmentCtaButtons({
  primaryLabel,
  onPrimary,
  callLabel,
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
        <Button
          variant="cta"
          size="lg"
          className={buttonClass}
          onClick={onPrimary}
        >
          {primaryLabel}
        </Button>
      ) : null}
      {callLabel ? (
        <CallUsClinicPicker
          variant="lightSolid"
          size="lg"
          label={callLabel}
          className={buttonClass}
        />
      ) : null}
    </div>
  );
}
