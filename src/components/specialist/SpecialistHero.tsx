import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  const firstName = specialist.name.split(" ")[0];

  return (
    <div className="relative">
      {/* Dark background */}
      <div className="bg-[#42332A] pt-32 pb-20 md:pt-36 md:pb-24" />

      {/* Content */}
      <div className="absolute inset-x-0 top-0 pt-32 md:pt-36">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:gap-12">

            {/* Left: Portrait */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 order-2 md:order-1 flex justify-center md:block"
            >
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-[240px] md:w-full aspect-[3/4] object-cover object-top rounded-2xl saturate-[0.75] brightness-[0.95] shadow-2xl"
              />
            </motion.div>

            {/* Right: Info — vertically stacked with clear hierarchy */}
            <div className="order-1 md:order-2 flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium text-white leading-[1.05] tracking-tight"
              >
                {specialist.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-lg md:text-xl text-white/50 font-light mt-2"
              >
                {specialist.title}
              </motion.p>

              {/* Divider */}
              <div className="w-12 h-px bg-white/20 my-6" />

              {/* Meta grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"
              >
                {specialist.clinics && specialist.clinics.length > 0 && (
                  <div>
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/30 block mb-2">Klinikk</span>
                    <div className="flex flex-wrap gap-1.5">
                      {specialist.clinics.map((clinic) => (
                        <span
                          key={clinic}
                          className="inline-flex items-center gap-1.5 text-sm text-white/80 font-light"
                        >
                          <MapPin className="w-3 h-3 text-white/40" />
                          {clinic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {specialist.expertise && specialist.expertise.length > 0 && (
                  <div>
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/30 block mb-2">Fagområder</span>
                    <div className="flex flex-wrap gap-1.5">
                      {specialist.expertise.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs text-white/70 border border-white/15 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Button
                  onClick={onScrollToBooking}
                  className="rounded-full bg-white text-[#42332A] hover:bg-white/90 px-7 text-sm h-11"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Bestill time hos {firstName}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[260px] md:h-[160px] lg:h-[180px]" />
    </div>
  );
};
