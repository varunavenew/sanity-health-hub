import { useEffect, useState } from "react";
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
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="bg-brand-light">
      {/* Mobil: fullskjerms portrett-hero med garantert gradient (header ligger som overlay) */}
      <div className="lg:hidden relative w-full h-[100svh] overflow-hidden bg-brand-dark">
        <img
          src={specialist.image}
          alt={specialist.name}
          className="absolute inset-0 w-full h-[118%] object-cover object-[50%_18%] will-change-transform"
          style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(24,4,4,0.94) 0%, rgba(66,51,42,0.88) 22%, rgba(66,51,42,0.72) 40%, rgba(66,51,42,0.48) 58%, rgba(66,51,42,0.24) 78%, rgba(66,51,42,0.10) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-dark/70 via-brand-dark/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-28">
          <div className="text-3xl font-light text-brand-warm leading-tight mb-3">{specialist.name}</div>
          <p className="text-brand-warm/90 text-sm font-light flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
            <span>{specialist.title}</span>
            {specialist.subtitle && specialist.subtitle !== specialist.title && (
              <>
                <span className="text-brand-warm/40">·</span>
                <span>{specialist.subtitle}</span>
              </>
            )}
            {specialist.clinics && specialist.clinics.length > 0 && (
              <>
                <span className="text-brand-warm/40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-warm/70" aria-hidden="true" />
                  {specialist.clinics.join(", ")}
                </span>
              </>
            )}
          </p>

          {specialist.expertise && specialist.expertise.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {specialist.expertise.map((tag) => (
                <Link
                  key={tag}
                  to={`${servicePath}?omrade=${encodeURIComponent(tag.toLowerCase())}`}
                  className="chip-filter-dark text-xs px-2.5 py-1 rounded-[10px]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <Button variant="cta" size="lg" className="w-full" onClick={onScrollToBooking}>
            Bestill time hos {firstName}
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
      <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
        {/* Left — text */}
        <div className="flex items-center page-edge-text-left py-14 lg:py-20 order-2 lg:order-1">
          <div className="max-w-xl w-full">
            {/* Name as H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-4"
            >
              {specialist.name}
            </motion.h1>

            {/* Role / title + sted (ren tekst, ikke chip) på samme linje */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg md:text-xl font-light text-foreground/80 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <span>{specialist.title}</span>
              {specialist.subtitle && specialist.subtitle !== specialist.title && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span>{specialist.subtitle}</span>
                </>
              )}
              {specialist.clinics && specialist.clinics.length > 0 && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1.5 text-base md:text-lg text-foreground/70">
                    <MapPin className="w-4 h-4 text-foreground/50" aria-hidden="true" />
                    {specialist.clinics.join(", ")}
                  </span>
                </>
              )}
            </motion.p>

            {/* Fagområde-tagger — klikkbare, derfor chip-utseende */}
            {specialist.expertise && specialist.expertise.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mb-8"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {specialist.expertise.map((tag) => (
                    <Link
                      key={tag}
                      to={`${servicePath}?omrade=${encodeURIComponent(tag.toLowerCase())}`}
                      className="inline-flex items-center text-xs font-normal text-foreground border border-foreground/30 px-2.5 py-1 rounded-2xl md:rounded-full bg-foreground/[0.02] hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}


            {/* CTAs — optional: either, both, or none */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <Button
                variant="cta"
                size="lg"
                className="px-7 w-full sm:w-auto"
                onClick={onScrollToBooking}
              >
                Bestill time hos {firstName}
              </Button>
              <CallUsClinicPicker
                variant="light"
                label="Ring oss"
                className="hover:bg-foreground hover:text-background hover:border-foreground"
              />
            </motion.div>
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
      </div>
      <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
    </header>
  );
};
