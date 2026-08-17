import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { useClinics } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface Props {
  /**
   * Visual variant:
   * - "light" — outlined on light backgrounds
   * - "lightSolid" — white filled on light backgrounds (category hero reference)
   * - "dark" — outline on dark backgrounds
   */
  variant?: "light" | "lightSolid" | "dark";
  size?: "default" | "lg";
  label?: string;
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
  className
}: Props & { className?: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: clinics = [] } = useClinics();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const callable = (clinics as { label: string; phone?: string }[])
    .filter((c) => c.phone)
    .map((c) => ({ label: c.label, phone: c.phone! }));

  const buttonVariant =
    variant === "dark" ? "cta-outline-dark" : "cta-outline";
  const solidLightClass =
    variant === "lightSolid"
      ? "bg-white border border-foreground/25 text-foreground hover:bg-foreground/[0.04] shadow-none"
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
        className={[solidLightClass, className].filter(Boolean).join(" ") || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {label ?? t("booking.callUs")}
        <ChevronDown
          className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Button>

      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[260px]">
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
