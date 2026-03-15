import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowDown } from "lucide-react";
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
    <section className="relative min-h-[85vh] md:min-h-[90vh] bg-brand-dark overflow-hidden">
      {/* Full-bleed image with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={specialist.image}
          alt={specialist.name}
          className="w-full h-full object-cover object-top"
        />
        {/* Cinematic gradient: transparent top → dark bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        {/* Side gradient for text readability on desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-dark/30 hidden md:block" />
      </div>

      {/* Content pinned to bottom */}
      <div className="relative h-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end">
        <div className="container mx-auto px-6 md:px-16 pb-12 md:pb-16">
          <div className="max-w-2xl">
            {/* Category + subtitle pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full">
                {categoryLabel}
              </span>
              {specialist.subtitle && specialist.subtitle !== categoryLabel && (
                <span className="px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/15 rounded-full">
                  {specialist.subtitle}
                </span>
              )}
            </motion.div>

            {/* Name - large editorial type */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05] tracking-tight mb-3"
            >
              {specialist.name}
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base md:text-lg text-white/60 font-light mb-6"
            >
              {specialist.title}
            </motion.p>

            {/* Clinic + CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {specialist.clinics && specialist.clinics.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-white/50 font-light">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{specialist.clinics.join(" · ")}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  onClick={onScrollToBooking}
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-6 text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Bestill time
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="hidden md:flex items-center gap-2 mt-12 text-white/30"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span className="text-[11px] tracking-widest uppercase font-light">Scroll</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
