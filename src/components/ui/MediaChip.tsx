import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MediaChipProps {
  children: ReactNode;
  /** dark = mørk glass-chip over bilde (standard), light = lys glass-chip */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * MediaChip — én felles kategori-/metadata-chip som ligger over bilder
 * (artikkelkort, artikkel-hero, relaterte artikler). Erstatter tre
 * copy-pastede varianter.
 */
export const MediaChip = ({ children, tone = "dark", className }: MediaChipProps) => (
  <span
    className={cn(
      "inline-flex items-center text-xs px-2.5 py-0.5 rounded-2xl md:rounded-full backdrop-blur-sm",
      tone === "dark" ? "bg-brand-dark/80 text-brand-warm" : "bg-white/15 text-brand-warm",
      className,
    )}
  >
    {children}
  </span>
);
