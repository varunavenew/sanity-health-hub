import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { RelatedServices, allServices } from "@/components/layout/RelatedServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PageProps { isChatOpen: boolean }

const Urology = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Urologi | CMedical - Mannehelse og urologisk behandling";
  }, []);

  const services = [
    "Blære og urinveier",
    "Forhud",
    "Mannlig infertilitet",
    "Nyrer",
    "Prostata",
    "Refertilisering",
    "Robotkirurgi",
    "Sterilisering",
    "Testikler og pung"
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageHero
        badge="Urologi"
        title="Diskret og profesjonell mannehelse"
        subtitle="Undersøkelser og behandling for prostata, urinveisplager og mannlig helse – med kort ventetid og full konfidensialitet."
        ctaText="Book urologtime"
      />

      {/* Services */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-sm text-accent font-medium mb-4">Våre tjenester</p>
                <h2 className="text-3xl md:text-4xl font-medium mb-6 text-foreground">
                  Hva vi behandler
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Vi forstår at mange urologiske plager er sensitive. Hos oss får du diskret og profesjonell behandling i trygge omgivelser.
                </p>
                <ul className="space-y-4">
                  {services.map((service, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-brand-dark rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-medium">100% konfidensielt</h3>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Alt vi diskuterer og behandler er strengt konfidensielt. Vi prioriterer din privatliv.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Erfarne urologer
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Moderne diagnostikk
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Ingen henvisning nødvendig
                  </div>
                </div>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                  onClick={() => window.location.href = '/booking'}
                >
                  Bestill diskret time
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Link to="/pricing" className="block text-center mt-4 text-sm text-white/60 hover:text-white/80 transition-colors">
                  Se prisliste →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Slik foregår det</h2>
            <p className="text-muted-foreground">En trygg og diskret prosess</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Diskret konsultasjon", desc: "Trygg samtale i privat rom" },
              { step: "2", title: "Undersøkelse", desc: "Nødvendige tester og prøver" },
              { step: "3", title: "Behandlingsplan", desc: "Individuell løsning og oppfølging" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-medium">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Vanlige årsaker til besøk</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Prostata", desc: "PSA-testing og vurdering av forstørret prostata" },
              { title: "Vannlating", desc: "Hyppig vannlating, urinlekkasje eller smerter" },
              { title: "Erektil funksjon", desc: "Moderne behandlingsalternativer" },
              { title: "Hormoner", desc: "Testing og behandling av testosteronnivå" }
            ].map((item, idx) => (
              <div key={idx} className="bg-card p-6 rounded-xl border border-border/50">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Vanlige spørsmål</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">Når bør jeg få sjekket prostata?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Menn over 50 år anbefales regelmessig prostataundersøkelse. Ved familiær risiko eller symptomer, sjekk tidligere.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">Er behandling av erektil dysfunksjon effektivt?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ja, moderne behandling har høy suksessrate. Vi tilbyr både medikamentell og andre løsninger.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">Trenger jeg henvisning?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Nei, du kan bestille time direkte uten henvisning fra fastlege.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">Er behandlingen konfidensiell?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ja, alt er strengt konfidensielt. Vi behandler alle henvendelser diskret.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <RelatedServices 
        services={allServices} 
        currentPath="/urology"
      />

      <CTASection
        title="Ta vare på livet og underlivet"
        subtitle="Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging"
        primaryCTA="Book time nå"
        secondaryCTA="Se prisliste"
        secondaryLink="/pricing"
      />
    </PageLayout>
  );
};

export default Urology;