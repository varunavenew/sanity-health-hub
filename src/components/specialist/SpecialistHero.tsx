import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";

const categoryLabels: Record<string, string> = {
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Spesialist",
};

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  const categoryLabel = categoryLabels[specialist.category] || specialist.category;

  return (
    <section className="bg-secondary/30 pt-8 md:pt-12 pb-0 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">
          {/* Text content - left side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center py-8 md:py-16"
          >
            {/* Category pill */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-accent-foreground bg-accent/10 border border-accent/20 rounded-full">
                {categoryLabel}
              </span>
              {specialist.subtitle && specialist.subtitle !== categoryLabel && (
                <span className="px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-muted-foreground border border-border rounded-full">
                  {specialist.subtitle}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-3">
              {specialist.name}
            </h1>

            {/* Title */}
            <p className="text-base md:text-lg text-muted-foreground font-light mb-6">
              {specialist.title}
            </p>

            {/* Clinic info */}
            {specialist.clinics && specialist.clinics.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-light mb-8">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-accent" />
                <span>{specialist.clinics.join(" · ")}</span>
              </div>
            )}

            {/* CTA */}
            <div>
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
            </div>
          </motion.div>

          {/* Image - right side, full height, no crop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-md md:max-w-lg">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-auto object-contain rounded-t-2xl saturate-[0.75] brightness-[0.95]"
              />
              {/* Subtle warm overlay */}
              <div className="absolute inset-0 bg-brand-dark/5 mix-blend-multiply rounded-t-2xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
