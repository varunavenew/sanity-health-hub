"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { ListPageHero } from "@/components/layout/ListPageHero";
import { SpecialistCard } from "@/components/SpecialistCarousel";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useSpecialistsListingPage } from "@/hooks/useSanity";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import {
  sortSpecialistsForListingPage,
  specialistListingClinicFilterLabels,
} from "@/lib/sanity/specialist-listing-sort";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

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
  const { sorted: specialists } = useSpecialistsData();
  const sortLocale = locale === "en" ? "en" : "no";
  const clinicNames = useMemo(
    () => specialistListingClinicFilterLabels(specialists, sortLocale),
    [specialists, sortLocale],
  );
  const [navTop, setNavTop] = useState(0);

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

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setNavTop(Math.max(0, header.getBoundingClientRect().bottom));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    const wantCategory = norm(activeFilter);
    const wantClinic = norm(activeClinic);

    const matches = specialists.filter((s) => {
      const categoryMatch =
        wantCategory === "alle" || norm(s.category) === wantCategory;
      if (!categoryMatch) return false;

      if (wantClinic === "alle") return true;
      const clinics = Array.isArray(s.clinics) ? s.clinics : [];
      return clinics.some((c) => norm(c) === wantClinic);
    });

    return sortSpecialistsForListingPage(matches, sortLocale);
  }, [specialists, activeFilter, activeClinic, sortLocale]);

  const heroTitle = page?.heroTitle?.trim() || t("specialists.title");
  const heroDescription =
    page?.heroDescription?.trim() || t("specialists.description");
  const countLabel = t("specialists.count", { count: filtered.length });
  const seoTitle = page?.seo?.metaTitle || t("specialists.seoTitle");
  const seoDescription = page?.seo?.metaDescription || t("specialists.seoDescription");
  const geoJsonLd = buildMedicalWebPageGeoJsonLd({
    name: heroTitle,
    geoSummary: page?.geoSummary,
    fallbackDescription: heroDescription || seoDescription,
    url: specialistsPath,
    locale,
  });

  const clinicFilterItems = useMemo(
    () => [
      { id: "alle", label: t("specialists.filters.allClinics") },
      ...clinicNames.map((c) => ({ id: c, label: c })),
    ],
    [clinicNames, t],
  );

  const mobileFilterRows = useMemo(
    () => [
      {
        key: "kategori",
        items: Object.entries(categoryLabels).map(([id, label]) => ({ id, label })),
        active: activeFilter,
        onSelect: setActiveFilter,
        withIcon: false,
      },
      {
        key: "klinikk",
        items: clinicFilterItems,
        active: activeClinic,
        onSelect: setActiveClinic,
        withIcon: true,
      },
    ],
    [categoryLabels, clinicFilterItems, activeFilter, activeClinic],
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical={specialistsPath}
        breadcrumbs={[
          { name: t("pricing.breadcrumbHome"), path: "/" },
          { name: t("nav.specialists"), path: specialistsPath },
        ]}
        jsonLd={geoJsonLd}
      />

      <ListPageHero title={heroTitle} description={heroDescription} />

      <div
        className="md:hidden sticky z-30 bg-background border-b border-brand-mid/30 shadow-sm"
        style={{ top: `${navTop}px` }}
      >
        {mobileFilterRows.map((row) => (
          <div key={row.key} className="relative">
            <div
              className="flex gap-2 overflow-x-auto overflow-y-visible px-4 pr-10 py-2 scrollbar-hide [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain]"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                touchAction: "pan-x pan-y",
              }}
            >
              {row.items.map((item) => {
                const isActive = row.active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => row.onSelect(item.id)}
                    className="chip-filter chip-filter-light min-h-[36px] whitespace-nowrap"
                    data-active={isActive}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {row.withIcon ? (
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                    ) : null}
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent" />
          </div>
        ))}
      </div>

      <section className="bg-background py-6 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2 mb-6">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  className="chip-filter chip-filter-light"
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  {label}
                </button>
              );
            })}
            <span className="mx-1 h-5 w-px bg-brand-mid/50" aria-hidden="true" />
            {clinicFilterItems.map((clinic) => {
              const isActive = activeClinic === clinic.id;
              return (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => setActiveClinic(clinic.id)}
                  className="chip-filter chip-filter-light"
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                >
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {clinic.label}
                </button>
              );
            })}
            <p className="text-sm text-muted-foreground md:ml-auto">{countLabel}</p>
          </div>

          <p className="md:hidden text-sm text-muted-foreground mb-4">{countLabel}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((specialist) => (
              <SpecialistCard key={specialist.slug} sp={specialist} />
            ))}
          </div>
        </div>
      </section>

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Specialists;
