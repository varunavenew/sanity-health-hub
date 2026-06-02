import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export type ExpertArea = {
  eyebrow?: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  imageAlt?: string;
};

interface ExpertAreasSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ExpertArea[];
}

/**
 * ExpertAreasSection – kortgrid med bilde + eyebrow + tittel + tekst + "Les mer".
 * Samme mønster som "Eksperter som jobber med det de kan aller best" på gynekologisiden.
 */
export const ExpertAreasSection = ({
  title,
  description,
  items,
}: ExpertAreasSectionProps) => {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
            <div className="lg:col-span-6">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                {title}
              </h2>
            </div>
            {description && (
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {items.map((a) => (
              <Link
                key={a.title}
                to={a.href}
                className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                  <img
                    src={a.image}
                    alt={a.imageAlt ?? a.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-light text-foreground mb-3">
                    {a.title}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {a.desc}
                  </p>
                  <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                    Les mer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
