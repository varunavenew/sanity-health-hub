import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { MapPin, Phone, Clock, Car, Train, Accessibility, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getClinicBySlug } from "@/data/clinicServices";
import { useClinic } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";

interface ClinicDetailPageProps {
  isChatOpen: boolean;
}

// Static FAQ fallback per clinic
const clinicFaqs: Record<string, { question: string; answer: string }[]> = {
  majorstuen: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Dersom du ønsker å bruke forsikring eller offentlig refusjon, kan det være krav om henvisning fra fastlege." },
    { question: "Kan jeg bruke helseforsikring?", answer: "Ja, vi samarbeider med de fleste forsikringsselskap. Ta kontakt med ditt forsikringsselskap i forkant for å avklare dekning." },
    { question: "Hvor lang tid tar en konsultasjon?", answer: "En standardkonsultasjon varer normalt 30–45 minutter, avhengig av type undersøkelse." },
    { question: "Er det ventetid for time?", answer: "Vi tilstreber kort ventetid. De fleste får time innen 1–2 uker." },
  ],
  bekkestua: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med ditt forsikringsselskap dersom du ønsker forsikringsdekning." },
    { question: "Hvilke tjenester tilbys på Bekkestua?", answer: "Vi tilbyr gynekologi og hudlege ved vår klinikk på Bekkestua." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  ski: [
    { question: "Hvilke tjenester tilbys i Ski?", answer: "Vi tilbyr gynekologiske tjenester ved vår klinikk i Ski." },
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
  ],
  moss: [
    { question: "Hvordan bestiller jeg time i Moss?", answer: "Timebestilling gjøres via Colosseum Faust sitt bookingsystem." },
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med forsikringsselskapet dersom relevant." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  moelv: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
    { question: "Hvilke tjenester tilbys i Moelv?", answer: "Vi tilbyr gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
};

const ClinicDetailPage = ({ isChatOpen }: ClinicDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sanityClinic, isLoading } = useClinic(slug || "");
  const staticClinic = slug ? getClinicBySlug(slug) : undefined;

  // Merge: Sanity first, static fallback
  const clinic = sanityClinic || (staticClinic ? {
    id: staticClinic.id,
    slug: staticClinic.slug,
    label: staticClinic.label,
    address: staticClinic.address,
    phone: staticClinic.phone,
    hours: staticClinic.hours,
    description: staticClinic.detail.description,
    detail: {
      parking: staticClinic.detail.parking,
      publicTransport: staticClinic.detail.publicTransport,
      accessibility: staticClinic.detail.accessibility,
    },
    mapsUrl: staticClinic.mapsUrl,
    faqs: clinicFaqs[staticClinic.slug] || [],
    booking: undefined,
    seo: undefined,
  } : undefined);

  useEffect(() => {
    if (clinic) {
      document.title = `CMedical ${clinic.label} | Klinikk`;
    }
  }, [clinic]);

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="bg-brand-warm pt-24 pb-16">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
              <div className="h-8 bg-brand-mid/20 rounded w-1/3" />
              <div className="h-4 bg-brand-mid/20 rounded w-2/3" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!clinic) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="bg-brand-warm pt-24 pb-16">
          <div className="container mx-auto px-6 md:px-16 text-center">
            <h1 className="text-2xl font-light text-brand-dark mb-4">Klinikken ble ikke funnet</h1>
            <Button asChild variant="outline" className="rounded-sm">
              <Link to="/om-oss">Tilbake til Om oss</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const faqs = clinic.faqs || [];
  const detail = clinic.detail || {};
  const mapsUrl = clinic.mapsUrl || (clinic.address ? `https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}` : undefined);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={clinic.seo?.metaTitle || `CMedical ${clinic.label} – Klinikk`}
        description={clinic.seo?.metaDescription || `Besøk CMedical ${clinic.label}. ${clinic.address}. Åpningstider, tjenester og kontaktinformasjon for vår klinikk.`}
        canonical={`/klinikker/${clinic.slug}`}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Om oss", path: "/om-oss" },
          { name: `CMedical ${clinic.label}`, path: `/klinikker/${clinic.slug}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: `CMedical ${clinic.label}`,
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.address,
            addressCountry: "NO",
          },
          telephone: clinic.phone ? `+47 ${clinic.phone}` : undefined,
          url: `https://cmedical.no/klinikker/${clinic.slug}`,
        }}
      />
      {/* Header */}
      <div className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <Link to="/om-oss" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Alle klinikker
            </Link>

            <header className="mb-8 pb-6 border-b border-brand-dark/10">
              <p className="text-muted-foreground text-xs mb-2">Klinikk</p>
              <h1 className="text-3xl md:text-4xl font-light text-brand-dark">
                CMedical {clinic.label}
              </h1>
            </header>

            <p className="text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
              {clinic.description}
            </p>
          </div>
        </div>
      </div>

      {/* Practical info */}
      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-6">Praktisk informasjon</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground font-light">{clinic.address}</p>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-dark/70 hover:underline inline-flex items-center gap-1 mt-1">
                        Vis i kart <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Telefon</p>
                    <a href={`tel:+47${clinic.phone?.replace(/\s/g, '')}`} className="text-sm text-muted-foreground font-light hover:underline">
                      {clinic.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Åpningstider</p>
                    <p className="text-sm text-muted-foreground font-light">{clinic.hours}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {detail.publicTransport && (
                  <div className="flex items-start gap-3">
                    <Train className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Kollektivtransport</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.publicTransport}</p>
                    </div>
                  </div>
                )}
                {detail.parking && (
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Parkering</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.parking}</p>
                    </div>
                  </div>
                )}
                {detail.accessibility && (
                  <div className="flex items-start gap-3">
                    <Accessibility className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Tilgjengelighet</p>
                      <p className="text-sm text-muted-foreground font-light">{detail.accessibility}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic images placeholder */}
      <section className="bg-muted/50 py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-6">Fra klinikken</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {clinic.primaryImage ? (
                <div className="aspect-[4/3] col-span-2 md:col-span-3 rounded-sm overflow-hidden">
                  <img src={clinic.primaryImage} alt={`CMedical ${clinic.label}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ) : (
                [1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-brand-mid/20 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-light">Bilde kommer</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps embed */}
      <section className="bg-background py-10 md:py-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-6">Finn oss</h2>
            <div className="rounded-sm overflow-hidden border border-border/40">
              <iframe
                title={`Kart over CMedical ${clinic.label}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-muted/50 py-10 md:py-14">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground mb-6">Ofte stilte spørsmål</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq: { question: string; answer: string }, i: number) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border/40 rounded-sm px-5">
                    <AccordionTrigger className="text-sm font-normal text-foreground py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Bestill time"
        subtitle={`Book konsultasjon ved CMedical ${clinic.label}`}
        primaryCTA="Book time nå"
        secondaryCTA="Kontakt oss"
        secondaryLink="/kontakt"
      />
    </PageLayout>
  );
};

export default ClinicDetailPage;
