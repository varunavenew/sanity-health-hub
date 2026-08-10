import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "card" | "standalone" | "onImage";

interface ReadMoreLinkProps {
  /** Internt mål. Utelates når lenken ligger inne i et allerede klikkbart kort. */
  to?: string;
  children?: ReactNode;
  /**
   * card       = ligger inne i et klikkbart kort (ingen understrek, pil nudger)
   * standalone = egen lenke i tekst/seksjon (tynn understrek — samme som karusell-CTA)
   * onImage    = lys variant over bilde/mørk bakgrunn
   */
  tone?: Tone;
  className?: string;
  "aria-label"?: string;
}

const base = "inline-flex items-center gap-1.5 text-sm font-light transition-all";

const tones: Record<Tone, string> = {
  card: "text-foreground group-hover:gap-2.5",
  standalone:
    "text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground",
  onImage: "text-brand-warm group-hover:gap-2.5",
};

/**
 * ReadMoreLink — én felles «Les mer»/pil-lenke for hele nettstedet.
 * Erstatter de 6 ulike copy-paste-variantene som fantes på behandlings-,
 * artikkel- og klinikk-sidene.
 */
export const ReadMoreLink = ({
  to,
  children = "Les mer",
  tone = "card",
  className,
  ...rest
}: ReadMoreLinkProps) => {
  const content = (
    <>
      {children}
      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    </>
  );

  if (!to) {
    return (
      <span className={cn(base, tones[tone], className)} {...rest}>
        {content}
      </span>
    );
  }

  return (
    <Link to={to} className={cn(base, tones[tone], className)} {...rest}>
      {content}
    </Link>
  );
};
