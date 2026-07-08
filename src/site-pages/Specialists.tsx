"use client";

import { AssetImg } from "@/components/AssetImg";
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { useSpecialistsListingPage } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";

function formatCountLabel(template: string, count: number): string {
  return template.replace(/\{count\}/g, String(count));
}

interface SpecialistsProps {
  isChatOpen: boolean;
}

const Specialists = ({ isChatOpen }: SpecialistsProps) => {
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const specialistsPath = useNavCmsPath("specialists") || "/spesialister";
  const { data: page } = useSpecialistsListingPage();
  const [activeFilter, setActiveFilter] = useState("alle");
  const [activeClinic, setActiveClinic] = useState("alle");
  const { sorted: specialists, allClinics } = useSpecialistsData();
  const clinicNames = allClinics();
  const categoryLabels = useMemo(
    () => ({
      alle: t("specialists.filters.all"),
      gynekologi: t("specialists.filters.gynecology"),
      fertilitet: t("specialists.filters.fertility"),
      urologi: t("specialists.filters.urology"),
      ortopedi: t("specialists.filters.orthopedics"),
      annet: t("specialists.filters.other"),
    }),
    [t],
  );

  const filtered = specialists.filter((s) => {
    const categoryMatch = activeFilter === "alle" || s.category === activeFilter;
    const clinicMatch = activeClinic === "alle" || (s.clinics?.includes(activeClinic) ?? false);
    return categoryMatch && clinicMatch;
  });

  const heroEyebrow = page?.heroEyebrow?.trim() || "";
  const heroTitle = page?.heroTitle?.trim() || "";
  const heroDescription = page?.heroDescription?.trim() || "";
  const countText = page?.countLabel?.trim()
    ? formatCountLabel(page.countLabel, filtered.length)
    : "";
  const hasSeo = Boolean(page?.seo?.metaTitle || page?.seo?.metaDescription);
  const geoName = heroTitle || page?.seo?.metaTitle || t("nav.specialists", "Spesialister");
  const geoFallback = heroDescription || page?.seo?.metaDescription;
  const geoJsonLd = buildMedicalWebPageGeoJsonLd({
    name: geoName,
    geoSummary: page?.geoSummary,
    fallbackDescription: geoFallback,
    url: specialistsPath,
    locale,
  });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasSeo ? (
        <PageSEO
          title={page?.seo?.metaTitle || ""}
          description={page?.seo?.metaDescription || ""}
          canonical={specialistsPath}
          breadcrumbs={[
            { name: t("common.breadcrumbHome", "Hjem"), path: "/" },
            { name: t("nav.specialists", "Spesialister"), path: specialistsPath },
          ]}
          jsonLd={geoJsonLd}
        />
      ) : (
        <JsonLd data={geoJsonLd} />
      )}
      {(heroEyebrow || heroTitle || heroDescription) ? (
      <section className="bg-brand-dark pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl">
            {heroTitle ? (
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-light text-white tracking-tight leading-none mb-4 md:mb-5">
                {heroTitle}
              </h1>
            ) : null}
            {heroDescription ? (
              <p className="text-white/80 font-light text-lg md:text-[20px] lg:text-[22px] leading-relaxed">
                {heroDescription}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-12 md:mt-16">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`transition-all duration-200 ${
                  activeFilter === key
                    ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                    : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 md:mt-5">
            <button
              onClick={() => setActiveClinic("alle")}
              className={`transition-all duration-200 flex items-center gap-2 ${
                activeClinic === "alle"
                  ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                  : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
              }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${activeClinic === "alle" ? "text-white" : "text-brand-dark"}`} />
              {t("specialists.filters.allClinics")}
            </button>
            {clinicNames.map((clinic) => (
              <button
                key={clinic}
                onClick={() => setActiveClinic(clinic)}
                className={`transition-all duration-200 flex items-center gap-2 ${
                  activeClinic === clinic
                    ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                    : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
                }`}
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 ${activeClinic === clinic ? "text-white" : "text-brand-dark"}`} />
                {clinic}
              </button>
            ))}
          </div>
        </div>
      </section>
      ) : (
      <section className="bg-brand-dark pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`transition-all duration-200 ${
                  activeFilter === key
                    ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                    : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 md:mt-5">
            <button
              onClick={() => setActiveClinic("alle")}
              className={`transition-all duration-200 flex items-center gap-2 ${
                activeClinic === "alle"
                  ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                  : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
              }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${activeClinic === "alle" ? "text-white" : "text-brand-dark"}`} />
              {t("specialists.filters.allClinics")}
            </button>
            {clinicNames.map((clinic) => (
              <button
                key={clinic}
                onClick={() => setActiveClinic(clinic)}
                className={`transition-all duration-200 flex items-center gap-2 ${
                  activeClinic === clinic
                    ? "bg-transparent text-white font-medium px-4 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:opacity-80"
                    : "bg-white text-brand-dark font-medium px-6 py-2.5 md:py-3 text-sm md:text-[15px] rounded-full hover:bg-white/90 border border-transparent shadow-sm"
                }`}
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 ${activeClinic === clinic ? "text-white" : "text-brand-dark"}`} />
                {clinic}
              </button>
            ))}
          </div>
        </div>
      </section>
      )}

      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          {countText ? (
            <p className="text-sm text-muted-foreground mb-6">{countText}</p>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-8 md:gap-y-12">
            {filtered.map((specialist) => (
              <Link
                key={specialist.slug}
                to={`/spesialister/${specialist.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-none overflow-hidden mb-3 bg-secondary">
                  <AssetImg
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pr-4 md:pr-6">
                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-0.5">{specialist.name}</h3>
                  <p className="text-xs md:text-[13px] text-muted-foreground font-light mb-1">
                    {specialist.title}
                    {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                  </p>
                  {specialist.clinics && specialist.clinics.length > 0 && (
                    <p className="flex items-center gap-1 text-xs md:text-[13px] text-muted-foreground/60 font-light">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/50" aria-hidden="true" />
                      {specialist.clinics.join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Specialists;
