import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { MapPin, Phone, Clock, Car, Train, Accessibility, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getClinicBySlug } from "@/data/clinicServices";

interface ClinicDetailPageProps {
  isChatOpen: boolean;
}

// Static FAQ per clinic
const clinicFaqs: Record<string, { q: string; a: string }[]> = {
  majorstuen: [
    { q: "Trenger jeg henvisning?", a: "For de fleste konsultasjoner trenger du ikke henvisning. Dersom du ønsker å bruke forsikring eller offentlig refusjon, kan det være krav om henvisning fra fastlege." },
    { q: "Kan jeg bruke helseforsikring?", a: "Ja, vi samarbeider med de fleste forsikringsselskap. Ta kontakt med ditt forsikringsselskap i forkant for å avklare dekning." },
    { q: "Hvor lang tid tar en konsultasjon?", a: "En standardkonsultasjon varer normalt 30–45 minutter, avhengig av type undersøkelse." },
    { q: "Er det ventetid for time?", a: "Vi tilstreber kort ventetid. De fleste får time innen 1–2 uker." },
  ],
  bekkestua: [
    { q: "Trenger jeg henvisning?", a: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med ditt forsikringsselskap dersom du ønsker forsikringsdekning." },
    { q: "Hvilke tjenester tilbys på Bekkestua?", a: "Vi tilbyr gynekologi og hudlege ved vår klinikk på Bekkestua." },
    { q: "Er det parkering?", a: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  ski: [
    { q: "Hvilke tjenester tilbys i Ski?", a: "Vi tilbyr gynekologiske tjenester ved vår klinikk i Ski." },
    { q: "Trenger jeg henvisning?", a: "For de fleste konsultasjoner trenger du ikke henvisning." },
  ],
  moss: [
    { q: "Hvordan bestiller jeg time i Moss?", a: "Timebestilling gjøres via Colosseum Faust sitt bookingsystem." },
    { q: "Trenger jeg henvisning?", a: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med forsikringsselskapet dersom relevant." },
    { q: "Er det parkering?", a: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  moelv: [
    { q: "Trenger jeg henvisning?", a: "For de fleste konsultasjoner trenger du ikke henvisning." },
    { q: "Hvilke tjenester tilbys i Moelv?", a: "Vi tilbyr gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin." },
    { q: "Er det parkering?", a: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
};

const ClinicDetailPage = ({ isChatOpen }: ClinicDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const clinic = slug ? getClinicBySlug(slug) : undefined;

  useEffect(() => {
    if (clinic) {
      document.title = `CMedical ${clinic.label} | Klinikk`;
    }
  }, [clinic]);

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

  const faqs = clinicFaqs[clinic.slug] || [];

  return (
    <PageLayout isChatOpen={isChatOpen}>
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
              {clinic.detail.description}
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
                    {clinic.mapsUrl && (
                      <a href={clinic.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-dark/70 hover:underline inline-flex items-center gap-1 mt-1">
                        Vis i kart <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-normal text-foreground">Telefon</p>
                    <a href={`tel:+47${clinic.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground font-light hover:underline">
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
                {clinic.detail.publicTransport && (
                  <div className="flex items-start gap-3">
                    <Train className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Kollektivtransport</p>
                      <p className="text-sm text-muted-foreground font-light">{clinic.detail.publicTransport}</p>
                    </div>
                  </div>
                )}
                {clinic.detail.parking && (
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Parkering</p>
                      <p className="text-sm text-muted-foreground font-light">{clinic.detail.parking}</p>
                    </div>
                  </div>
                )}
                {clinic.detail.accessibility && (
                  <div className="flex items-start gap-3">
                    <Accessibility className="w-4 h-4 text-brand-dark/50 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-normal text-foreground">Tilgjengelighet</p>
                      <p className="text-sm text-muted-foreground font-light">{clinic.detail.accessibility}</p>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] bg-brand-mid/20 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-muted-foreground font-light">Bilde kommer</span>
                </div>
              ))}
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
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border/40 rounded-sm px-5">
                    <AccordionTrigger className="text-sm font-normal text-foreground py-4 hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light pb-4 leading-relaxed">
                      {faq.a}
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
