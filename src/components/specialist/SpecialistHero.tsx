import { motion } from "framer-motion";
import { MapPin, Calendar, GraduationCap, Languages } from "lucide-react";
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
    <section className="relative bg-primary overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[70vh] md:min-h-[75vh] items-end">
          
          {/* Left: Text content */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-end pb-10 md:pb-16 pt-20 md:pt-0 order-2 md:order-1 z-10">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2 mb-5"
            >
              <span className="px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-accent bg-accent/15 rounded-full">
                {categoryLabel}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-[3.2rem] font-light text-primary-foreground leading-[1.08] tracking-tight mb-2"
            >
              {specialist.name}
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-sm md:text-base text-primary-foreground/50 font-light mb-6"
            >
              {specialist.title}
            </motion.p>

            {/* Info chips row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              {specialist.clinics && specialist.clinics.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-foreground/60 border border-primary-foreground/10 rounded-full">
                  <MapPin className="w-3 h-3 text-accent" />
                  {specialist.clinics.join(" · ")}
                </span>
              )}
              {specialist.education && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-foreground/60 border border-primary-foreground/10 rounded-full">
                  <GraduationCap className="w-3 h-3 text-accent" />
                  Spesialist
                </span>
              )}
              {specialist.languages && specialist.languages.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-foreground/60 border border-primary-foreground/10 rounded-full">
                  <Languages className="w-3 h-3 text-accent" />
                  {specialist.languages.join(", ")}
                </span>
              )}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-sm h-11"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
            </motion.div>
          </div>

          {/* Right: Full image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-7 lg:col-span-7 relative order-1 md:order-2 flex justify-center md:justify-end items-end"
          >
            {/* Subtle gradient behind image for depth */}
            <div className="absolute bottom-0 right-0 w-[120%] h-[80%] bg-gradient-to-t from-accent/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <img
              src={specialist.image}
              alt={specialist.name}
              className="relative w-full max-w-[280px] md:max-w-[380px] lg:max-w-[420px] h-auto object-contain saturate-[0.8] brightness-[0.95] drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};
