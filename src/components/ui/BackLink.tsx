import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  children: ReactNode;
  /** default = mørk tekst på lys bakgrunn, onImage = lys tekst over bilde/mørk bg */
  tone?: "default" | "onImage";
  className?: string;
}

/**
 * BackLink — én felles «Tilbake»-lenke. Erstatter 7+ ulike varianter
 * (knapp med ramme, understreket lenke, ikon+tekst, chip over bilde).
 */
export const BackLink = ({ to, children, tone = "default", className }: BackLinkProps) => (
  <Link
    to={to}
    className={cn(
      "inline-flex items-center gap-2 text-sm font-light transition-colors",
      tone === "onImage"
        ? "text-brand-warm/80 hover:text-brand-warm"
        : "text-foreground/70 hover:text-foreground",
      className,
    )}
  >
    <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
    {children}
  </Link>
);
