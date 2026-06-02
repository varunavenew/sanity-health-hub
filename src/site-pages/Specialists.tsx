import { AssetImg } from "@/components/AssetImg";
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTranslation } from "react-i18next";

interface SpecialistsProps {
  isChatOpen: boolean;
}

const Specialists = ({ isChatOpen }: SpecialistsProps) => {
  const { t } = useTranslation();
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

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={t("specialists.seoTitle", "Våre spesialister – Ledende eksperter samlet på ett sted")}
        description={t(
          "specialists.seoDescription",
          "Møt CMedicals spesialister innen gynekologi, fertilitet, urologi og ortopedi. Erfaring, spisskompetanse og moderne teknologi – ingen henvisning nødvendig.",
        )}
        canonical="/spesialister"
        breadcrumbs={[
          { name: t("common.breadcrumbHome"), path: "/" },
          { name: t("nav.specialists"), path: "/spesialister" },
        ]}
      />
      <section className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl">
            <p className="text-white/60 text-xs mb-2">{t("specialists.ourTeam")}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-3">
              {t("specialists.title")}
            </h1>
            <p className="text-white/70 font-light text-base md:text-lg">
              {t("specialists.description")}
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-1.5 rounded-sm text-sm font-light transition-colors ${
                  activeFilter === key
                    ? "bg-white text-brand-dark"
                    : "border border-white/30 text-white/70 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Clinic filter */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setActiveClinic("alle")}
              className={`px-4 py-1.5 rounded-sm text-xs font-light transition-colors flex items-center gap-1.5 ${
                activeClinic === "alle"
                  ? "bg-white/20 text-white"
                  : "border border-white/20 text-white/60 hover:bg-white/10"
              }`}
            >
              <MapPin className="w-3 h-3" />
              {t("specialists.filters.allClinics")}
            </button>
            {clinicNames.map((clinic) => (
              <button
                key={clinic}
                onClick={() => setActiveClinic(clinic)}
                className={`px-4 py-1.5 rounded-sm text-xs font-light transition-colors flex items-center gap-1.5 ${
                  activeClinic === clinic
                    ? "bg-white/20 text-white"
                    : "border border-white/20 text-white/60 hover:bg-white/10"
                }`}
              >
                <MapPin className="w-3 h-3" />
                {clinic}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <p className="text-sm text-muted-foreground mb-6">
            {t("specialists.count", { count: filtered.length })}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filtered.map((specialist) => (
              <Link
                key={specialist.slug}
                to={`/spesialister/${specialist.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-2 bg-secondary">
                  <AssetImg
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 saturate-[0.7] brightness-[0.95] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
                </div>
                <h3 className="text-sm font-medium text-foreground">{specialist.name}</h3>
                <p className="text-xs text-muted-foreground font-light">
                  {specialist.title}
                  {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                </p>
                {specialist.clinics && specialist.clinics.length > 0 && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground/60 font-light mt-0.5">
                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" aria-hidden="true" />
                    {specialist.clinics.join(' · ')}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Specialists;
