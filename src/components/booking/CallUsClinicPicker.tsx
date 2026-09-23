import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { useCallableClinics } from "@/hooks/useCallableClinics";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Specialist } from "@/lib/sanity/specialist-types";

interface Props {
  /**
   * Visual variant:
   * - "light" — outlined on light backgrounds
   * - "lightSolid" — white filled on light backgrounds (category hero reference)
   * - "fill" — same hover invert as specialist expertise chips
   * - "dark" — outline on dark backgrounds
   */
  variant?: "light" | "lightSolid" | "dark" | "fill" | "cta";
  size?: "default" | "lg";
  label?: string;
  /**
   * Category page id (e.g. "gynekologi", "flere-fagomrader"). Limits the
   * dropdown to clinics that offer it; omit outside a category context.
   */
  categoryId?: string;
  /** Open menu above the trigger (e.g. specialist mobile hero at page bottom). */
  menuPlacement?: "top" | "bottom";
  /** Anchor dropdown to the trigger's right edge so it opens leftward (narrow panels). */
  menuAlign?: "stretch" | "end";
  /** Limit to clinics this specialist works at (profile page). */
  specialist?: Specialist;
  className?: string;
}

/**
 * "Ring oss" CTA with a clinic picker dropdown — same UX as the bottom
 * BookingCTA, reusable on light-background heroes and pages.
 */
export const CallUsClinicPicker = ({
  variant = "light",
  size = "lg",
  label,
  categoryId,
  menuPlacement = "bottom",
  menuAlign = "stretch",
  specialist,
  className
}: Props & { className?: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clinics: callable, pending } = useCallableClinics(categoryId, specialist);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Nothing to call for this category — drop the CTA rather than open an empty
  // menu. Rendered while loading so the button does not flash out and back in.
  if (!pending && callable.length === 0) return null;

  const buttonVariant =
    variant === "cta"
      ? "cta"
      : variant === "dark"
        ? "cta-outline-dark"
        : variant === "fill"
          ? "cta-outline-fill"
          : "cta-outline";
  const solidLightClass =
    variant === "lightSolid"
      ? "bg-white border border-foreground/25 text-foreground hover:bg-foreground/[0.04] shadow-none"
      : variant === "fill"
        ? "border border-foreground/30 bg-transparent text-foreground shadow-none hover:bg-foreground hover:text-background hover:border-foreground"
        : undefined;

  const widthOnWrapper = [
    className?.includes("w-full") ? "w-full" : null,
    className?.includes("sm:w-auto") ? "sm:w-auto" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={["relative", widthOnWrapper].filter(Boolean).join(" ")} ref={ref}>
      <Button
        variant={buttonVariant}
        size={size}
        className={cn(solidLightClass, className)}
        onClick={() => setOpen((o) => !o)}
      >
        {label ?? t("booking.callUs")}
        <ChevronDown
          className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Button>

      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-[240px] max-w-[min(260px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-white shadow-xl",
            menuAlign === "end" ? "right-0 w-[260px]" : "left-0 right-0",
            menuPlacement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground font-light">
            {t("booking.selectClinic")}
          </p>
          {callable.map((c) => (
            <a
              key={c.label}
              href={`tel:${c.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors text-left"
            >
              <span className="text-sm font-normal text-foreground">{c.label}</span>
              <span className="text-sm text-muted-foreground font-light">{c.phone}</span>
            </a>
          ))}
          <div className="border-t border-border">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/kontakt");
              }}
              className="w-full px-4 py-3 text-sm text-brand-dark hover:bg-secondary transition-colors text-left font-light"
            >
              {t("booking.goToContact")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
