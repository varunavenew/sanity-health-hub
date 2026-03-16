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
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh] md:min-h-[70vh]">
          
          {/* Left: Image – aligned to bottom, full height */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex items-end justify-center order-1 pt-16 md:pt-0 self-end"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
            <img
              src={specialist.image}
              alt={specialist.name}
              className="relative w-auto max-h-[50vh] md:max-h-[65vh] object-contain object-bottom saturate-[0.8] brightness-[0.95] drop-shadow-2xl"
            />
          </motion.div>

          {/* Right: Content – vertically centered */}
          <div className="flex flex-col justify-center py-8 md:py-16 order-2">
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-4"
            >
              <span className="px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-accent bg-accent/15 rounded-full">
                {categoryLabel}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-primary-foreground leading-[1.08] tracking-tight mb-2"
            >
              {specialist.name}
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-sm md:text-base text-primary-foreground/50 font-light mb-6"
            >
              {specialist.title}
            </motion.p>

            {/* Info chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="flex flex-wrap items-center gap-2.5 mb-5"
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

            {/* Expertise tags */}
            {specialist.expertise && specialist.expertise.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex flex-wrap gap-1.5 mb-8"
              >
                {specialist.expertise.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-light text-primary-foreground/40 border border-primary-foreground/8 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {specialist.expertise.length > 5 && (
                  <span className="px-2.5 py-1 text-[11px] font-light text-primary-foreground/30">
                    +{specialist.expertise.length - 5} til
                  </span>
                )}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.52 }}
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
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};
