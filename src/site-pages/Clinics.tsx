"use client";

import { AssetImg } from "@/components/AssetImg";
import { Link } from "@/lib/router";
import { MapPin, Phone, Clock, ArrowRight, Car, Train, Accessibility, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useClinics, useClinicsPage } from "@/hooks/useSanity";
import { sortBySlug, type SortLocale } from "@/lib/sortAlphabetical";
import { useTranslation } from "react-i18next";
import { sanityContentLangFromLocale } from "@/lib/sanity/normalize-i18n";
import { CTASection } from "@/components/layout/CTASection";
import { SplitHero } from "@/components/layout/SplitHero";
import type { ImageRef } from "@/lib/media";

import imgMajorstuen from "@/assets/clinics/majorstuen.jpg";
import imgBekkestua from "@/assets/clinics/bekkestua.jpg";
import imgMoss from "@/assets/clinics/moss.jpg";
import imgMoelv from "@/assets/clinics/moelv.jpg";

const clinicImages: Record<string, ImageRef> = {
  majorstuen: imgMajorstuen,
  bekkestua: imgBekkestua,
  moss: imgMoss,
  moelv: imgMoelv,
};

const HERO_FALLBACK = {
  nb: {
    eyebrow: "{count} klinikker · Ingen henvisning · Kort ventetid",
    title: "Finn din nærmeste klinikk",
    description:
      "Våre klinikker i Norge tilbyr spesialisthjelp uten henvisning og med kort ventetid.",
    primaryCta: "Bestill time",
    secondaryCta: "Kontakt oss",
    seoTitle: "Våre klinikker | CMedical",
    seoDescription:
      "Oversikt over CMedicals fire klinikker i Norge: Oslo Majorstuen, Bekkestua, Moss og Moelv. Adresse, åpningstider, parkering, kollektivtransport og tjenester.",
  },
  en: {
    eyebrow: "{count} clinics · No referral · Short waiting times",
    title: "Find your nearest clinic",
    description:
      "Our clinics in Norway offer specialist care without referral and with short waiting times.",
    primaryCta: "Book appointment",
    secondaryCta: "Contact us",
    seoTitle: "Our clinics | CMedical",
    seoDescription:
      "Overview of CMedical's clinics in Norway: Oslo Majorstuen, Bekkestua, Moss and Moelv. Address, opening hours, parking, public transport and services.",
  },
} as const;

function formatEyebrow(template: string, count: number): string {
  return template.replace(/\{count\}/g, String(count));
}

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { t, i18n } = useTranslation();
  const contentLang: SortLocale = sanityContentLangFromLocale(i18n.language);
  const fb = HERO_FALLBACK[contentLang === "en" ? "en" : "nb"];
  const { data: page } = useClinicsPage();
  const { data: sanityClinics = [] } = useClinics();
  const list: any[] = sortBySlug(
    sanityClinics.map((c: any) => ({
      ...c,
      primaryImage: c.primaryImage || clinicImages[c.slug || c.id],
      detail: c.detail || {},
    })),
    (c) => c.slug || c.label,
    contentLang,
  );

  const clinicCount = list.length;
  const heroEyebrow = formatEyebrow(page?.heroEyebrow || fb.eyebrow, clinicCount);
  const heroTitle = page?.heroTitle || fb.title;
  const heroDescription = page?.heroDescription || fb.description;
  const heroImage = page?.heroImage || imgMajorstuen;
  const primaryCta = {
    label: page?.primaryCtaLabel || fb.primaryCta,
    to: page?.primaryCtaPath || "/booking",
  };
  const secondaryCta = {
    label: page?.secondaryCtaLabel || fb.secondaryCta,
    to: page?.secondaryCtaPath || "/kontakt",
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={page?.seo?.metaTitle || fb.seoTitle}
        description={page?.seo?.metaDescription || fb.seoDescription}
        canonical="/klinikker"
        breadcrumbs={[
          { name: t("pricing.breadcrumbHome", "Hjem"), path: "/" },
          { name: t("nav.clinics", "Klinikker"), path: "/klinikker" },
        ]}
        jsonLd={{
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
        }}
      />

      <SplitHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
        imageAlt="CMedical klinikk"
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />

      <section className="bg-background" aria-labelledby="clinics-heading">
        <h2 id="clinics-heading" className="sr-only">
          Liste over klinikker
        </h2>

        {list.map((clinic: (typeof list)[number], idx: number) => {
          const detailHref = `/klinikker/${clinic.slug}`;
          const serviceCount = clinic.services?.length || 0;
          const image = (clinic as any).primaryImage || clinicImages[clinic.slug];
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

      <CTASection
        title="Usikker på hvilken klinikk som passer best?"
        subtitle="Kontakt oss, så hjelper vi deg å finne riktig sted og spesialist."
        primaryCTA="Bestill time"
        secondaryCTA="Kontakt oss"
        secondaryLink="/kontakt"
      />
    </PageLayout>
  );
};

export default Clinics;
