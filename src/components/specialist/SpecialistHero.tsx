import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  return (
    <div className="relative">
      <div className="bg-brand-dark pt-32 pb-64 md:pt-36 md:pb-72" />

      <div className="absolute inset-x-0 top-0 pt-32 md:pt-36">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-10 items-start">

            {/* Text */}
            <div className="order-2 md:order-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-sm md:text-base text-white/50 tracking-wide mb-2 flex flex-wrap items-center gap-x-3"
              >
                <span>{specialist.title}</span>
                {specialist.subtitle && specialist.subtitle !== specialist.title && (
                  <>
                    <span className="text-white/30">·</span>
                    <span>{specialist.subtitle}</span>
                  </>
                )}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.05] tracking-tight mb-6"
              >
                {specialist.name}
              </motion.h1>

              {/* Tags: clinics filled, expertise outline */}
              {((specialist.clinics && specialist.clinics.length > 0) || (specialist.expertise && specialist.expertise.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-2 mb-6"
                >
                  {specialist.clinics?.map((clinic) => (
                    <span
                      key={clinic}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-white/15 rounded-full"
                    >
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {clinic}
                    </span>
                  ))}
                  {specialist.expertise?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-white/70 border border-white/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Button
                  onClick={onScrollToBooking}
                  className="rounded-full bg-brand-mid text-brand-dark hover:bg-brand-mid/90 px-7 text-sm h-11"
                >
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  Bestill time hos {specialist.name.split(" ")[0]}
                </Button>
              </motion.div>
            </div>

            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center md:justify-start order-1 md:order-1 relative z-10"
            >
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-[200px] md:w-[260px] lg:w-[300px] aspect-[3/4] object-cover object-top rounded-2xl saturate-[0.75] brightness-[0.95] shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="h-[180px] md:h-[80px] lg:h-[100px]" />
    </div>
  );
};
