import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";

const categoryLabels: Record<string, string> = {
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Flere tjenester",
};

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  const categoryLabel = categoryLabels[specialist.category] || specialist.category;

  return (
    <section className="bg-background border-b border-border/40">
      <div className="container mx-auto px-6 md:px-16 py-10 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="shrink-0 mx-auto md:mx-0"
          >
            <div className="w-40 h-52 md:w-48 md:h-64 lg:w-56 lg:h-72 rounded-md overflow-hidden bg-secondary">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 text-center md:text-left pt-0 md:pt-2"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-tight mb-1.5">
              {specialist.name}
            </h1>

            <p className="text-sm md:text-base text-muted-foreground font-light mb-5">
              {specialist.title}
            </p>

            {/* Metadata grid */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6 justify-center md:justify-start">
              {/* Fagområde */}
              <div>
                <span className="block text-[11px] font-medium tracking-widest uppercase text-muted-foreground/70 mb-1">
                  Fagområde
                </span>
                <span className="text-sm text-foreground font-normal">
                  {specialist.subtitle || categoryLabel}
                </span>
              </div>

              {/* Klinikk */}
              {specialist.clinics && specialist.clinics.length > 0 && (
                <div>
                  <span className="block text-[11px] font-medium tracking-widest uppercase text-muted-foreground/70 mb-1">
                    Klinikk
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-foreground font-normal">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{specialist.clinics.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Expertise tags */}
            {specialist.expertise && specialist.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-7 justify-center md:justify-start">
                {specialist.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-light text-muted-foreground border border-border/60 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Button
                onClick={onScrollToBooking}
                className="rounded-full px-6"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
