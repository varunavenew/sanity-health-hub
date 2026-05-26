import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/data/specialists";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categoryToServicePath: Record<string, string> = {
  gynekologi: "/behandlinger/gynekologi",
  fertilitet: "/behandlinger/fertilitet",
  urologi: "/behandlinger/urologi",
  ortopedi: "/behandlinger/ortopedi",
  annet: "/tjenester",
};

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  const firstName = specialist.name.split(" ")[0];
  const servicePath = categoryToServicePath[specialist.category] || "/tjenester";

  return (
    <header className="bg-brand-light pt-24 lg:pt-0">
      <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
        {/* Left — text */}
        <div className="flex items-center page-edge-text-left py-14 lg:py-20 order-2 lg:order-1">
          <div className="max-w-xl w-full">
            {/* Role / subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-foreground/60 mb-3 flex flex-wrap items-center gap-x-2"
            >
              <span>{specialist.title}</span>
              {specialist.subtitle && specialist.subtitle !== specialist.title && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span>{specialist.subtitle}</span>
                </>
              )}
            </motion.p>

            {/* Name as H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-6"
            >
              {specialist.name}
            </motion.h1>

            {/* Tag groups: locations + expertise (clickable) */}
            {((specialist.clinics && specialist.clinics.length > 0) ||
              (specialist.expertise && specialist.expertise.length > 0)) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="space-y-3 mb-8"
              >
                {specialist.clinics && specialist.clinics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {specialist.clinics.map((clinic) => (
                      <Link
                        key={clinic}
                        to={`/klinikker/${slugify(clinic)}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-foreground bg-foreground/10 hover:bg-foreground/15 rounded-full transition-colors"
                      >
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {clinic}
                      </Link>
                    ))}
                  </div>
                )}
                {specialist.expertise && specialist.expertise.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {specialist.expertise.map((tag) => (
                      <Link
                        key={tag}
                        to={`${servicePath}?omrade=${encodeURIComponent(tag.toLowerCase())}`}
                        className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-foreground/70 border border-foreground/20 hover:border-foreground/40 hover:text-foreground rounded-full transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8"
            >
              <Button
                variant="cta"
                size="lg"
                className="px-7 w-full sm:w-auto"
                onClick={onScrollToBooking}
              >
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                Bestill time hos {firstName}
              </Button>
              <CallUsClinicPicker variant="light" label="Ring oss" />
            </motion.div>

            {/* Trust strip */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-foreground"
            >
              {["Ingen henvisning", "Korte ventetider", "Erfaren spesialist"].map((u) => (
                <li key={u} className="inline-flex items-center gap-2">
                  <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
                  <span>{u}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Right — portrait full-bleed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative min-h-[380px] lg:min-h-full order-1 lg:order-2"
        >
          <img
            src={specialist.image}
            alt={specialist.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </motion.div>
      </div>
      <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
    </header>
  );
};
