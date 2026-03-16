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
    <header className="bg-secondary/40 pt-32 pb-0 md:pt-36 md:pb-0">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-2 md:gap-4 items-end">
          
          {/* Left: Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center md:justify-start items-end order-2 md:order-1"
          >
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-[240px] md:w-[300px] lg:w-[340px] aspect-[3/4] object-cover object-top rounded-t-2xl saturate-[0.8] brightness-[0.97]"
            />
          </motion.div>

          {/* Right: Text */}
          <div className="pb-10 md:pb-14 order-1 md:order-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/70 bg-[#F2ECE6] rounded-full mb-5"
            >
              {categoryLabel}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-tight mb-3"
            >
              {specialist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground font-light mb-5 max-w-md"
            >
              {specialist.title}
            </motion.p>

            {specialist.clinics && specialist.clinics.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground/70 font-light mb-7"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{specialist.clinics.join(" · ")}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                onClick={onScrollToBooking}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-7 text-sm h-11"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bestill time
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
