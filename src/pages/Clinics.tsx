import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, ArrowRight, Car, Train, Accessibility, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { useClinics } from "@/hooks/useSanity";
import { clinics as staticClinics, type Clinic } from "@/data/clinicServices";
import { CTASection } from "@/components/layout/CTASection";

interface ClinicsProps {
  isChatOpen: boolean;
}

const Clinics = ({ isChatOpen }: ClinicsProps) => {
  const { data: sanityClinics } = useClinics();
  // Prefer static (richer detail) – merge in only Sanity fields that have a value,
  // so a null/undefined value from Sanity never blanks out a working static field.
  const list: any[] = staticClinics.map((s) => {
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
      <header className="bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm text-white/60 font-light mb-4">Våre klinikker</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
              Finn din nærmeste klinikk
            </h1>
            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-xl">
              CMedical har klinikker over hele Østlandet og Innlandet. Velg din lokasjon for å se
              tjenester, åpningstider, parkering og kontaktinformasjon.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60 font-light">
              <span>{list.length} klinikker</span>
              <span aria-hidden="true">·</span>
              <span>Ingen henvisning nødvendig</span>
              <span aria-hidden="true">·</span>
              <span>Kort ventetid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Clinic cards */}
      <section className="bg-background py-16 md:py-24" aria-labelledby="clinics-heading">
        <div className="container mx-auto px-6 md:px-16">
          <h2 id="clinics-heading" className="sr-only">
            Liste over klinikker
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {list.map((clinic: Clinic) => {
              const detailHref = `/klinikker/${clinic.slug}`;
              const serviceCount = clinic.services?.length || 0;
              return (
                <article
                  key={clinic.id}
                  className="group flex flex-col bg-brand-warm/40 border border-border/50 rounded-sm overflow-hidden transition-all hover:border-brand-dark/30 hover:shadow-[0_8px_30px_-12px_hsl(var(--brand-dark)/0.15)]"
                >
                  {/* Header strip */}
                  <Link
                    to={detailHref}
                    className="block px-6 md:px-8 pt-6 md:pt-8 pb-4"
                    aria-label={`Les mer om CMedical ${clinic.label}`}
                  >
                    <p className="text-xs text-muted-foreground font-light mb-1">Klinikk</p>
                    <h3 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight group-hover:text-foreground transition-colors">
                      CMedical {clinic.label}
                    </h3>
                  </Link>

                  {/* Body */}
                  <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col gap-4 flex-1">
                    {clinic.detail?.description && (
                      <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                        {clinic.detail.description}
                      </p>
                    )}

                    {/* Key info rows */}
                    <ul className="space-y-2.5 mt-1">
                      <li className="flex items-start gap-3 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.address}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Clock className="w-3.5 h-3.5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-foreground font-light">{clinic.hours}</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <Phone className="w-3.5 h-3.5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <a
                          href={`tel:+47${clinic.phone.replace(/\s/g, "")}`}
                          className="text-foreground font-light hover:underline underline-offset-4"
                        >
                          {clinic.phone}
                        </a>
                      </li>
                    </ul>

                    {/* Practical chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {clinic.detail?.parking && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/70 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Car className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Parkering
                        </span>
                      )}
                      {clinic.detail?.publicTransport && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/70 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Train className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Kollektiv
                        </span>
                      )}
                      {clinic.detail?.accessibility && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/70 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Accessibility className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          Universelt utformet
                        </span>
                      )}
                      {serviceCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background/70 border border-border/60 rounded-sm text-[11px] text-muted-foreground font-light">
                          <Stethoscope className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
                          {serviceCount} tjenester
                        </span>
                      )}
                    </div>

                    {/* CTA row */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                      <Link
                        to={detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-normal text-brand-dark hover:gap-2.5 transition-all"
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
                </article>
              );
            })}
          </div>
        </div>
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
