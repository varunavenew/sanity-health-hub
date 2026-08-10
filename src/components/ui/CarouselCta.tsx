import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CarouselCtaProps {
  to: string;
  children: React.ReactNode;
}

/**
 * CarouselCta — felles tekstlenke som står til høyre i karusell-navigasjonen.
 * Brukes kun der karusellen har et naturlig mål (oversiktsside e.l.).
 */
export const CarouselCta = ({ to, children }: CarouselCtaProps) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-sm font-light text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors whitespace-nowrap"
  >
    {children}
    <ArrowRight className="w-3.5 h-3.5" />
  </Link>
);
