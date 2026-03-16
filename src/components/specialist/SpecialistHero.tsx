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
    <header className="bg-primary pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Text content */}
          <div className="md:col-span-7 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2 mb-5"
            >
              <span className="px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-accent bg-accent/12 rounded-full">
                {categoryLabel}
              </span>
              {specialist.subtitle && specialist.subtitle !== categoryLabel && (
                <span className="px-3 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-primary-foreground/40 border border-primary-foreground/10 rounded-full">
                  {specialist.subtitle}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-primary-foreground leading-[1.05] tracking-tight mb-3"
            >
              {specialist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="text-base md:text-lg text-primary-foreground/50 font-light mb-7 max-w-lg"
            >
              {specialist.title}
            </motion.p>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.36 }}
              className="flex flex-wrap items-center gap-2.5 mb-8"
            >
              {specialist.clinics && specialist.clinics.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-foreground/55 border border-primary-foreground/10 rounded-full">
                  <MapPin className="w-3 h-3 text-accent" />
                  {specialist.clinics.join(" · ")}
                </span>
              )}
              {specialist.languages && specialist.languages.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary-foreground/55 border border-primary-foreground/10 rounded-full">
                  <Languages className="w-3 h-3 text-accent" />
                  {specialist.languages.join(", ")}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.44 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-sm h-11 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
              <Button
                variant="ghost"
                className="rounded-full px-8 text-sm h-11 border border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('specialist-bio')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Les mer
              </Button>
            </motion.div>
          </div>

          {/* Right: Portrait image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
              <img
                src={specialist.image}
                alt={specialist.name}
                className="relative w-[220px] md:w-[280px] lg:w-[320px] aspect-[3/4] object-cover object-top rounded-2xl saturate-[0.8] brightness-[0.95]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
