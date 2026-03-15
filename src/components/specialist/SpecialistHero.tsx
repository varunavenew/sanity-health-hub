import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
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
    <section className="relative bg-background">
      {/* Full-width image container */}
      <div className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={specialist.image}
          alt={specialist.name}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient overlay - bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent md:hidden" />
      </div>

      {/* Floating info card - overlaps the image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="relative -mt-32 md:-mt-44 z-10 container mx-auto px-6 md:px-16"
      >
        <div className="max-w-xl">
          {/* Category pill */}
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase text-brand-dark border border-brand-dark/30 rounded-full mb-4 bg-background/80 backdrop-blur-sm">
            {specialist.subtitle || categoryLabel}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.1] mb-3">
            {specialist.name}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-light mb-2">
            {specialist.title}
          </p>

          {/* Clinic locations */}
          {specialist.clinics && specialist.clinics.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-light mb-6">
              <MapPin className="w-3.5 h-3.5 text-brand-dark shrink-0" />
              <span>{specialist.clinics.join(" · ")}</span>
            </div>
          )}

          {/* Primary CTA */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onScrollToBooking}
              className="rounded-full bg-brand-dark hover:bg-brand-dark/90 text-primary-foreground px-6"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bestill time
            </Button>
            <button
              onClick={onScrollToBooking}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Se tjenester
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
