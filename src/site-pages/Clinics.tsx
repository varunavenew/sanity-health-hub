"use client";

import { AssetImg } from "@/components/AssetImg";
import { Link, useNavigate } from "@/lib/router";
import { MapPin, Phone, Clock, ArrowRight, Car, Train, Accessibility, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { GeoAnswerSnippet } from "@/components/seo/GeoAnswerSnippet";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { useClinics, useClinicsPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { SplitHero } from "@/components/layout/SplitHero";
import { Button } from "@/components/ui/button";

function formatEyebrow(template: string, count: number): string {
  return template.replace(/\{count\}/g, String(count));
}

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const navigate = useNavigate();
  const { data: page } = useClinicsPage();
  const { data: sanityClinics = [] } = useClinics();
  const list: any[] = sanityClinics.map((c: any) => ({
    ...c,
    detail: c.detail || {},
  }));

  const clinicCount = list.length;
  const heroEyebrow = page?.heroEyebrow?.trim()
    ? formatEyebrow(page.heroEyebrow, clinicCount)
    : "";
  const heroTitle = page?.heroTitle?.trim() || "";
  const heroDescription = page?.heroDescription?.trim() || "";
  const heroImage = page?.heroImage;
  const hasHeroContent = Boolean(heroEyebrow || heroTitle || heroDescription || heroImage);
  const primaryCta = {
    label: page?.primaryCtaLabel?.trim() || t("nav.bookAppointment"),
    to: page?.primaryCtaPath?.trim() || "/booking",
  };
  const secondaryCta =
    page?.secondaryCtaLabel?.trim() && page?.secondaryCtaPath?.trim()
      ? {
          label: page.secondaryCtaLabel.trim(),
          to: page.secondaryCtaPath.trim(),
        }
      : undefined;

  const hasSeo = Boolean(page?.seo?.metaTitle || page?.seo?.metaDescription);
  const clinicsPath = "/klinikker";
  const geoName = heroTitle || page?.seo?.metaTitle || t("nav.clinics", "Klinikker");
  const geoFallback = heroDescription || page?.seo?.metaDescription;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalClinic",
        name: `CMedical ${c.label}`,
        address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "NO" },
        telephone: c.phone ? `+47 ${c.phone}` : undefined,
        url: `https://cmedical.no/klinikker/${c.slug}`,
      },
    })),
  };
  const geoJsonLd = buildMedicalWebPageGeoJsonLd({
    name: geoName,
    geoSummary: page?.geoSummary,
    fallbackDescription: geoFallback,
    url: clinicsPath,
    locale,
    extra: [itemListJsonLd],
  });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {hasSeo ? (
        <PageSEO
          title={page?.seo?.metaTitle || ""}
          description={page?.seo?.metaDescription || ""}
          canonical={clinicsPath}
          breadcrumbs={[
            { name: t("pricing.breadcrumbHome", "Hjem"), path: "/" },
            { name: t("nav.clinics", "Klinikker"), path: clinicsPath },
          ]}
          jsonLd={geoJsonLd}
        />
      ) : null}

      {hasHeroContent ? (
        <SplitHero
          eyebrow={heroEyebrow || undefined}
          title={heroTitle || undefined}
          description={heroDescription || undefined}
          image={heroImage}
          imageAlt="CMedical klinikk"
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      ) : (
        <div className="bg-brand-warm pt-20 pb-8">
          <div className="container mx-auto px-6 md:px-16">
            {!hasSeo ? (
              <GeoPageEnhancements
                name={geoName}
                geoSummary={page?.geoSummary}
                fallbackDescription={geoFallback}
                path={clinicsPath}
                locale={locale}
                className="mb-6 max-w-3xl"
              />
            ) : (
              <GeoAnswerSnippet text={page?.geoSummary} className="mb-6 max-w-3xl" />
            )}
            <Button variant="cta" size="lg" onClick={() => navigate("/booking")}>
              {t("nav.bookAppointment")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {hasHeroContent ? (
        <div className="container mx-auto px-6 md:px-16 py-6">
          {hasSeo ? (
            <GeoAnswerSnippet text={page?.geoSummary} className="max-w-3xl" />
          ) : (
            <GeoPageEnhancements
              name={geoName}
              geoSummary={page?.geoSummary}
              fallbackDescription={geoFallback}
              path={clinicsPath}
              locale={locale}
              className="max-w-3xl"
            />
          )}
        </div>
      ) : null}

      <section className="bg-background" aria-labelledby="clinics-heading">
        <h2 id="clinics-heading" className="sr-only">
          Liste over klinikker
        </h2>

        {list.map((clinic: (typeof list)[number], idx: number) => {
          const detailHref = `/klinikker/${clinic.slug}`;
          const serviceCount = clinic.services?.length || 0;
          const image = clinic.primaryImage;
          const reverse = idx % 2 === 1;
          const altBg = idx % 2 === 1 ? "bg-brand-warm/40" : "bg-background";

          return (
            <div
              key={clinic.id}
              className={`${altBg} border-t border-border/40`}
            >
              <div className="container mx-auto px-6 md:px-16 py-12 md:py-20">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Link
                    to={detailHref}
                    className="group block overflow-hidden rounded-sm aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5]"
                    aria-label={`Les mer om CMedical ${clinic.label}`}
                  >
                    {image ? (
                      <AssetImg
                        src={image}
                        alt={`CMedical ${clinic.label}`}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-mid/20" />
                    )}
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground font-light uppercase tracking-[0.15em] mb-3">
                      Klinikk
                    </p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark leading-tight mb-5">
                      <Link to={detailHref} className="hover:text-foreground transition-colors">
                        CMedical {clinic.label}
                      </Link>
                    </h3>

                    {clinic.detail?.description && (
                      <p className="text-base text-muted-foreground font-light leading-[1.8] mb-8 max-w-md">
                        {clinic.detail.description}
                      </p>
                    )}

                    <ul className="space-y-3 mb-7 border-t border-border/50 pt-6">
                      <li className="flex items-start gap-3 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.address}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Clock className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.hours}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Phone className="w-3.5 h-3.5 text-brand-dark/50 mt-1 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        {clinic.phone ? (
                          <a
                            href={`tel:+47${String(clinic.phone).replace(/\s/g, "")}`}
                            className="text-foreground font-light hover:underline underline-offset-4"
                          >
                            {clinic.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground font-light">—</span>
                        )}
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {clinic.detail?.parking && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Car className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Parkering
                        </span>
                      )}
                      {clinic.detail?.publicTransport && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Train className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Kollektiv
                        </span>
                      )}
                      {clinic.detail?.accessibility && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Accessibility className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Universelt utformet
                        </span>
                      )}
                      {serviceCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/80 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Stethoscope className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {serviceCount} tjenester
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <Link
                        to={detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-normal text-brand-dark hover:gap-2.5 transition-all border-b border-brand-dark/40 hover:border-brand-dark pb-1"
                      >
                        Les mer om klinikken
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                      {clinic.mapsUrl && (
                        <a
                          href={clinic.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
                        >
                          Vis i kart
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <PageSectionsRenderer sections={page?.pageSections} />
    </PageLayout>
  );
};

export default Clinics;
