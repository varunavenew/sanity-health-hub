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
    <section className="bg-brand-dark pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-14">
          {/* Profile photo - contained, not hero-bleed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="shrink-0"
          >
            <div className="w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden ring-4 ring-white/10">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center md:text-left pb-0 md:pb-2"
          >
            {/* Category pill */}
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase text-white/80 border border-white/20 rounded-full mb-4">
              {specialist.subtitle || categoryLabel}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.1] mb-2">
              {specialist.name}
            </h1>

            <p className="text-base md:text-lg text-white/60 font-light mb-1.5">
              {specialist.title}
            </p>

            {/* Clinic locations */}
            {specialist.clinics && specialist.clinics.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-white/50 font-light mb-6">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{specialist.clinics.join(" · ")}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-white text-brand-dark hover:bg-white/90 px-6"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
              <button
                onClick={onScrollToBooking}
                className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Se tjenester
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
