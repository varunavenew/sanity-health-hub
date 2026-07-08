import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

export interface LifePhase {
  title: string;
  desc: string;
  tags?: { label: string; href: string }[];
  /** Optional "Les mer"-lenke nederst på kortet. Utelates for å skjule linken. */
  href?: string;
  cta?: string;
  n?: string;
}

interface Props {
  phases: LifePhase[];
}

/**
 * KUN mobil: horisontal kort-karusell med dots.
 * Desktop (md+): beholder original Accordion-visning.
 */
export const LifePhasesCarousel = ({ phases }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* MOBILE: horizontal carousel */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {phases.map((p, i) => (
            <article
              key={p.title + i}
              className="shrink-0 w-[92%] snap-start bg-background rounded-sm border border-border/40 flex flex-col p-6"
            >
              <h3 className="text-base font-normal text-foreground mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-4">
                {p.desc}
              </p>
              {(p.tags ?? []).length > 0 && (
                <div className="mb-4">
                  {(p.tags ?? []).slice(0, 4).map((tag) => (
                    <Link
                      key={tag.label}
                      to={tag.href}
                      className="flex items-center justify-between py-2 text-sm font-light text-foreground border-b border-border/30 last:border-b-0"
                    >
                      <span>{tag.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
              {p.href && (
                <Link
                  to={p.href}
                  className="inline-flex items-center text-sm font-light text-foreground gap-2 mt-auto pt-2"
                >
                  {p.cta ?? "Les mer"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </article>
          ))}
        </div>
        <ScrollArrows scrollRef={scrollRef} />
      </div>

      {/* DESKTOP: original accordion */}
      <div className="hidden md:block">
        <Accordion type="single" collapsible className="w-full">
          {phases.map((p, i) => (
            <AccordionItem
              key={p.title + i}
              value={p.n ?? p.title}
              className="border-b border-border/30"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-normal py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <span className="pr-4">{p.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-5">
                    {p.desc}
                  </p>
                  <div className="mb-5">
                    {(p.tags ?? []).map((tag) => (
                      <Link
                        key={tag.label}
                        to={tag.href}
                        className="group flex items-center justify-between py-2.5 text-sm font-light text-foreground hover:text-foreground/60 transition-colors border-b border-border/30 last:border-b-0"
                      >
                        <span>{tag.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                  {p.href && (
                    <Link
                      to={p.href}
                      className="inline-flex items-center text-sm font-light text-foreground hover:gap-2.5 gap-2 transition-all pb-2"
                    >
                      {p.cta ?? "Les mer"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};
