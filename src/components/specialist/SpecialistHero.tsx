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
    <header className="relative bg-[#42332A] pt-32 pb-16 md:pt-36 md:pb-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">

          {/* Left: Text */}
          <div className="order-1">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight mb-3"
            >
              {specialist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg text-white/60 font-light mb-5 max-w-md"
            >
              {specialist.title}
            </motion.p>

            {/* Clinic & expertise */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="space-y-3 mb-7"
            >
              {specialist.clinics && specialist.clinics.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-white/40">Klinikk:</span>
                  {specialist.clinics.map((clinic) => (
                    <span
                      key={clinic}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/70 bg-white/10 rounded-full"
                    >
                      <MapPin className="w-3 h-3" />
                      {clinic}
                    </span>
                  ))}
                </div>
              )}
              {specialist.expertise && specialist.expertise.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-white/40">Fagområder:</span>
                  {specialist.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/70 bg-white/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-white text-[#42332A] hover:bg-white/90 px-7 text-sm h-11"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
            </motion.div>
          </div>

          {/* Right: Portrait — bleeds below the dark hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center md:justify-end order-2 md:mb-[-80px] relative z-10"
          >
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-[220px] md:w-[280px] lg:w-[320px] aspect-[3/4] object-cover object-top rounded-2xl saturate-[0.75] brightness-[0.95] shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
