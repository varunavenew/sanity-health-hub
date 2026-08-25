import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { MapPin } from "lucide-react";
import { ResponsiveHeroMedia } from "@/components/media/ResponsiveHeroMedia";
import { SpecialistCtaButtons } from "@/components/specialist/SpecialistCtaButtons";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import { specialistHasHeroCtas } from "@/lib/sanity/specialist-cta";
import type { Specialist, SpecialistClinicRef } from "@/lib/sanity/specialist-types";

interface SpecialistHeroProps {
  specialist: Specialist;
  onBookingClick: () => void;
}

const expertiseChipClass =
  "inline-flex items-center text-xs font-normal text-foreground border border-foreground/30 px-2.5 py-1 rounded-full bg-transparent";

const SPECIALIST_MOBILE_HERO_GRADIENT =
  "linear-gradient(to top, rgba(24, 4, 4, 0.94) 0%, rgba(66, 51, 42, 0.88) 22%, rgba(66, 51, 42, 0.72) 40%, rgba(66, 51, 42, 0.48) 58%, rgba(66, 51, 42, 0.24) 78%, rgba(66, 51, 42, 0.1) 100%)";

function clinicLinks(specialist: Specialist): SpecialistClinicRef[] {
  if (specialist.clinicRefs?.length) return specialist.clinicRefs;
  return (specialist.clinics ?? []).map((label) => ({ label, slug: label }));
}

function SpecialistHeroMedia({
  specialist,
  className,
  variant = "profile",
}: {
  specialist: Specialist;
  className?: string;
  variant?: "hero" | "profile";
}) {
  return (
    <ResponsiveHeroMedia
      variant={variant}
      media={specialist.heroMedia}
      src={specialist.image}
      hotspot={specialist.imageHotspot}
      objectPosition="50% 20%"
      alt={specialist.name}
      className={className}
      loading="eager"
    />
  );
}

export const SpecialistHero = ({ specialist, onBookingClick }: SpecialistHeroProps) => {
  const ui = useSpecialistProfileUi();
  const clinicsPath = useNavCmsPath("clinics");
  const clinics = clinicLinks(specialist);
  const hasSubtitle = Boolean(
    specialist.subtitle && specialist.subtitle !== specialist.title,
  );

  return (
    <header className="bg-background lg:pt-0">
      {/* Mobile — full-bleed image with bottom overlay content */}
      <div className="relative lg:hidden min-h-[100svh] overflow-hidden bg-brand-dark">
        <SpecialistHeroMedia specialist={specialist} className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: SPECIALIST_MOBILE_HERO_GRADIENT }}
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-4">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2rem] font-light text-white leading-[1.05] mb-3"
          >
            {specialist.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base font-light text-white mb-3 flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <span>{specialist.title}</span>
            {hasSubtitle ? (
              <>
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
                <span>{specialist.subtitle}</span>
              </>
            ) : null}
            {clinics.map((clinic) => (
              <span key={`${clinic.slug}-${clinic.label}`} className="inline-flex items-center gap-x-2">
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
                <Link
                  to={`${clinicsPath}/${clinic.slug}`}
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {clinic.label}
                </Link>
              </span>
            ))}
          </motion.p>

          {specialist.expertise && specialist.expertise.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4"
            >
              {specialist.expertise.map((tag) => (
                <span key={tag} className="text-sm font-light text-white">
                  {tag}
                </span>
              ))}
            </motion.div>
          ) : null}

          {specialistHasHeroCtas(specialist) ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SpecialistCtaButtons
                specialist={specialist}
                onBookingClick={onBookingClick}
                bookingLabel={ui.bookingCtaLabel}
                callLabel={ui.heroCallUsLabel}
                surface="mobile"
              />
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Desktop — split hero */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-[640px]">
        <div className="flex items-center page-edge-text-left py-12 lg:py-16">
          <div className="max-w-xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] mb-4"
            >
              {specialist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg md:text-xl font-light text-foreground/80 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <span>{specialist.title}</span>
              {hasSubtitle ? (
                <>
                  <span className="text-foreground/30" aria-hidden="true">
                    ·
                  </span>
                  <span>{specialist.subtitle}</span>
                </>
              ) : null}
              {clinics.map((clinic) => (
                <span key={`${clinic.slug}-${clinic.label}`} className="inline-flex items-center gap-x-2">
                  <span className="text-foreground/30" aria-hidden="true">
                    ·
                  </span>
                  <Link
                    to={`${clinicsPath}/${clinic.slug}`}
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                  >
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {clinic.label}
                  </Link>
                </span>
              ))}
            </motion.p>

            {specialist.expertise && specialist.expertise.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-wrap items-center gap-1.5 mb-8"
              >
                {specialist.expertise.map((tag) => (
                  <span key={tag} className={expertiseChipClass}>
                    {tag}
                  </span>
                ))}
              </motion.div>
            ) : null}

            {specialistHasHeroCtas(specialist) ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <SpecialistCtaButtons
                  specialist={specialist}
                  onBookingClick={onBookingClick}
                  bookingLabel={ui.bookingCtaLabel}
                  callLabel={ui.heroCallUsLabel}
                  surface="desktop"
                />
              </motion.div>
            ) : null}
          </div>
        </div>

        <div className="split-media relative w-full min-h-0 bg-secondary/40">
          <SpecialistHeroMedia specialist={specialist} className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
    </header>
  );
};
