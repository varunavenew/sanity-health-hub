import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface ClinicPillar {
  n: string;
  title: string;
  desc: string;
}

interface ClinicPillarsSectionProps {
  title: string;
  intro: string;
  pillars: ClinicPillar[];
  image: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Numbered trust pillars (01/02/03) with headline, ingress and side image.
 * Same component/design as the "Det beste fra to klinikker" section
 * on /gynekologi and /fertilitet.
 */
export const ClinicPillarsSection = ({
  title,
  intro,
  pillars,
  image,
  imageAlt = "",
  ctaLabel = "Les mer om klinikken",
  ctaHref = "/om-oss",
}: ClinicPillarsSectionProps) => {
  return (
    <section className="bg-background">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12">
        <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
              {title}
            </h2>
            <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
              {intro}
            </p>

            <div className="divide-y divide-border/60 border-t border-border/60">
              {pillars.map((step) => (
                <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                  <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                    {step.n}
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="text-base font-normal text-foreground mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
            >
              {ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
