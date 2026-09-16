import { useRef } from "react";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { Link } from "@/lib/router";
import { ArrowRight, MapPin } from "lucide-react";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface RelatedSpecialistsProps {
  specialists: Specialist[];
  specialistsPath: string;
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  ctaPath?: string;
}

function specialistRoleLine(s: Specialist): string {
  if (s.subtitle && s.subtitle !== s.title) {
    return `${s.title} · ${s.subtitle}`;
  }
  return s.subtitle || s.title;
}

export const RelatedSpecialists = ({
  specialists,
  specialistsPath,
  eyebrow,
  heading,
  ctaLabel,
  ctaPath,
}: RelatedSpecialistsProps) => {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (specialists.length === 0) return null;

  const listingPath =
    ctaPath?.trim() && (ctaPath.startsWith("/") ? ctaPath : `/${ctaPath}`);
  const showCta = Boolean(ctaLabel?.trim() && listingPath);
  const showHeader = Boolean(eyebrow?.trim() || heading?.trim());
  const profileLabel = t("specialists.viewProfile", { defaultValue: "Se profil" });
  const isEn = (i18n.language || "").toLowerCase().startsWith("en");
  const ctaLink = showCta ? (
    <Link
      to={listingPath!}
      className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:opacity-70 transition-opacity"
    >
      {ctaLabel}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
  ) : null;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-10"
          >
            {eyebrow?.trim() ? (
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {eyebrow}
              </p>
            ) : null}
            {heading?.trim() ? (
              <h2 className="text-2xl md:text-3xl font-light text-foreground">
                {heading}
              </h2>
            ) : null}
          </motion.div>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory pl-6 md:pl-16 pr-6 md:pr-16"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {specialists.map((s, idx) => (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(idx, 8) * 0.06 }}
            className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[300px] snap-start"
          >
            <RelatedSpecialistCard
              specialist={s}
              href={`${specialistsPath}/${s.slug}`}
              profileLabel={profileLabel}
            />
          </motion.div>
        ))}
      </div>

      <ScrollArrows
        scrollRef={scrollRef}
        visibility="all"
        slideCount={specialists.length}
        className="px-6 md:px-16 mt-4 md:mt-6"
        trailing={ctaLink}
        progressLabel={isEn ? "Carousel progress" : "Fremdrift i karusell"}
        prevLabel={isEn ? "Previous" : "Forrige"}
        nextLabel={isEn ? "Next" : "Neste"}
      />
    </section>
  );
};

function RelatedSpecialistCard({
  specialist,
  href,
  profileLabel,
}: {
  specialist: Specialist;
  href: string;
  profileLabel: string;
}) {
  const clinicLabel = specialist.clinics?.filter(Boolean).join(" · ");

  return (
    <Link
      to={href}
      className="group block"
      aria-label={`${profileLabel}: ${specialist.name}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <ResponsiveImage
          src={specialist.image}
          alt={specialist.name}
          variant="card"
          hotspot={specialist.imageHotspot}
          crop={specialist.imageCrop}
          className="w-full h-full scale-[1.12] transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-100 group-focus-visible:scale-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

        {clinicLabel ? (
          <div className="absolute top-4 left-4 z-[1] flex items-center gap-1 text-white text-sm font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {clinicLabel}
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 z-[1] p-4 md:p-5">
          <h3 className="font-medium text-white text-base md:text-lg leading-snug mb-0.5">
            {specialist.name}
          </h3>
          <p className="text-sm text-white/80 font-light leading-snug">
            {specialistRoleLine(specialist)}
          </p>
          <div className="grid grid-rows-[0fr] opacity-0 translate-y-1 transition-[grid-template-rows,opacity,transform] duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            <div className="overflow-hidden min-h-0">
              <div className="flex items-center gap-1.5 pt-3 text-sm font-light text-brand-yellow">
                <span>{profileLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
