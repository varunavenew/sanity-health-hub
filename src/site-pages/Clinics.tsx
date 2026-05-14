import { AssetImg } from "@/components/AssetImg";
import { Link } from "@/lib/router";
import { MapPin, Phone, Clock, ArrowRight, Car, Train, Accessibility, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics, type Clinic } from "@/data/clinicServices";
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

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { data: sanityClinics } = useClinics();
  // Prefer static (richer detail) – merge in only Sanity fields that have a value,
  // so a null/undefined value from Sanity never blanks out a working static field.
  const merged: any[] = staticClinics.map((s) => {
    const fromSanity = sanityClinics?.find((c: any) => c.slug === s.slug);
    if (!fromSanity) return s;
    const overrides: Record<string, any> = {};
    for (const [key, value] of Object.entries(fromSanity)) {
      if (value !== null && value !== undefined && value !== "") overrides[key] = value;
    }
    return {
      ...s,
      ...overrides,
      detail: { ...s.detail, ...(fromSanity.detail || {}) },
    };
  });
  // Respect Sanity sortOrder when available; fallback to original static order.
  const list: any[] = [...merged].sort((a, b) => {
    const ao = typeof a.sortOrder === "number" ? a.sortOrder : 999;
    const bo = typeof b.sortOrder === "number" ? b.sortOrder : 999;
    return ao - bo;
  });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Våre klinikker | CMedical"
        description="Oversikt over CMedicals fire klinikker i Norge: Oslo Majorstuen, Bekkestua, Moss og Moelv. Adresse, åpningstider, parkering, kollektivtransport og tjenester."
        canonical="/klinikker"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Klinikker", path: "/klinikker" },
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

      {/* Hero */}
      <SplitHero
        eyebrow={`${list.length} klinikker · Ingen henvisning · Kort ventetid`}
        title="Finn din nærmeste klinikk"
        description="Våre klinikker i Norge tilbyr spesialisthjelp uten henvisning og med kort ventetid."
        image={imgMajorstuen}
        imageAlt="CMedical klinikk"
        primaryCta={{ label: "Bestill time", to: "/booking" }}
        secondaryCta={{ label: "Kontakt oss", to: "/kontakt" }}
      />

      {/* Clinic split-screen rows */}
      <section className="bg-background" aria-labelledby="clinics-heading">
        <h2 id="clinics-heading" className="sr-only">
          Liste over klinikker
        </h2>

        {list.map((clinic: Clinic, idx: number) => {
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
                  {/* Image */}
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

                  {/* Content */}
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

                    {/* Key info */}
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

                    {/* Practical chips */}
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

                    {/* CTA row */}
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
