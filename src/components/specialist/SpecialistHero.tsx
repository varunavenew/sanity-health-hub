import { motion } from "framer-motion";
import { Link } from "@/lib/router";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetImg } from "@/components/AssetImg";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import type { Specialist, SpecialistClinicRef } from "@/lib/sanity/specialist-types";

interface SpecialistHeroProps {
  specialist: Specialist;
  onScrollToBooking: () => void;
}

function categoryServicePath(
  specialist: Specialist,
  servicesPath: string,
): string {
  const primary = specialist.sanityCategories?.[0];
  if (!primary?.slug) return servicesPath;
  if (primary.categoryId === "flere-fagomrader") return servicesPath;
  return `/behandlinger/${primary.slug}`;
}

function clinicLinks(specialist: Specialist): SpecialistClinicRef[] {
  if (specialist.clinicRefs?.length) return specialist.clinicRefs;
  return (specialist.clinics ?? []).map((label) => ({ label, slug: label }));
}

export const SpecialistHero = ({ specialist, onScrollToBooking }: SpecialistHeroProps) => {
  const ui = useSpecialistProfileUi();
  const clinicsPath = useNavCmsPath("clinics");
  const servicesPath = useNavCmsPath("services");
  const servicePath = categoryServicePath(specialist, servicesPath);
  const clinics = clinicLinks(specialist);

  return (
    <header className="bg-brand-light pt-24 lg:pt-0">
      <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[640px]">
        <div className="flex items-center px-6 md:px-16 py-14 lg:py-20 order-2 lg:order-1">
          <div className="max-w-xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-4"
            >
              {specialist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg md:text-xl font-light text-foreground/80 mb-6 flex flex-wrap items-center gap-x-2"
            >
              <span>{specialist.title}</span>
              {specialist.subtitle && specialist.subtitle !== specialist.title && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span>{specialist.subtitle}</span>
                </>
              )}
            </motion.p>

            {((clinics.length > 0) || (specialist.expertise && specialist.expertise.length > 0)) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="space-y-2 mb-8"
              >
                {clinics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {clinics.map((clinic) => (
                      <Link
                        key={`${clinic.slug}-${clinic.label}`}
                        to={`${clinicsPath}/${clinic.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-normal text-foreground border border-foreground/30 px-2.5 py-1 rounded-full bg-foreground/[0.02] hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                      >
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {clinic.label}
                      </Link>
                    ))}
                  </div>
                )}
                {specialist.expertise && specialist.expertise.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {specialist.expertise.map((tag) => (
                      <Link
                        key={tag}
                        to={`${servicePath}?omrade=${encodeURIComponent(tag.toLowerCase())}`}
                        className="inline-flex items-center text-xs font-normal text-foreground border border-foreground/30 px-2.5 py-1 rounded-full bg-foreground/[0.02] hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

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
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                {ui.bookingCtaLabel}
              </Button>
              <CallUsClinicPicker variant="light" label={ui.heroCallUsLabel} />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative min-h-[380px] lg:min-h-full order-1 lg:order-2"
        >
          <AssetImg
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
