import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { RelatedServices, allServices } from "@/components/layout/RelatedServices";
import { EmotionalPromoSection } from "@/components/layout/EmotionalPromoSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";

interface PageProps { isChatOpen: boolean }

const Gynecology = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Gynekologi | CMedical - Spesialistbehandling for kvinner";
  }, []);

  const services = [
    "Menstruasjonsplager og uregelmessige blødninger",
    "Underlivsinfeksjoner og soppinfeksjoner",
    "Endometriose og PCOS",
    "Menopause og hormonelle endringer",
    "Prevensjon og P-stav",
    "Celleprøve og HPV-vaksinering",
    "Gynekologisk ultralyd"
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageHero
        badge="Gynekologi"
        title="Spesialistbehandling for kvinner"
        subtitle="Trygg oppfølging av erfarne gynekologer – fra rutineundersøkelser til avansert behandling. Kort ventetid, ingen henvisning nødvendig."
        ctaText="Book gynekologtime"
      />

      {/* What we treat */}
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
                  Vi tilbyr et bredt spekter av gynekologiske tjenester, fra forebyggende undersøkelser til behandling av komplekse tilstander.
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
                <h3 className="text-2xl font-medium mb-4">Bestill time raskt</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Få time innen 1-3 dager. Ingen henvisning fra fastlege er nødvendig.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Erfarne gynekologer
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Moderne utstyr
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Diskret og trygt
                  </div>
                </div>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                  onClick={() => window.location.href = '/booking'}
                >
                  Bestill time
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

      {/* Process Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Slik foregår det</h2>
            <p className="text-muted-foreground">En enkel og trygg prosess fra start til mål</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Konsultasjon", desc: "Grundig samtale om dine plager og bekymringer" },
              { step: "2", title: "Undersøkelse", desc: "Nødvendige undersøkelser og prøver" },
              { step: "3", title: "Behandling", desc: "Individuell behandlingsplan og oppfølging" }
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

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Hvorfor velge oss</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Erfarne spesialister", desc: "Gynekologer med lang erfaring og oppdatert kunnskap" },
              { title: "Moderne utstyr", desc: "Nyeste innen ultralyd og diagnostisk teknologi" },
              { title: "Diskret og trygt", desc: "Din privatliv og komfort er vår prioritet" },
              { title: "Ingen henvisning", desc: "Bestill time direkte uten fastlege" }
            ].map((item, idx) => (
              <div key={idx} className="bg-card p-6 rounded-xl border border-border/50">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Vanlige spørsmål</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">Trenger jeg henvisning fra fastlege?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Nei, du kan bestille time direkte hos oss uten henvisning. Dette gjør det raskere og enklere å få hjelp.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">Hvor lang tid tar en undersøkelse?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  En standard konsultasjon tar vanligvis 30-45 minutter, inkludert samtale og undersøkelse.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">Dekkes behandlingen av forsikring?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Mange helseforsikringer dekker gynekologiske konsultasjoner. Sjekk med ditt forsikringsselskap.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">Kan jeg få time samme dag?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Vi har kort ventetid og kan ofte tilby time innen få dager. I akutte tilfeller gjør vi vårt beste.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Emotional promo blocks */}
      <EmotionalPromoSection
        blocks={[
          {
            title: "Din reise mot foreldreskap",
            description: "Vi følger deg gjennom hele prosessen – med omsorg og faglig trygghet",
            image: heroPregnancy,
            cta: "Les mer om fertilitet",
            path: "/fertilitet",
          },
          {
            title: "Trygg oppfølging i alle livsfaser",
            description: "Fra ungdomstid til overgangsalder – vi er her for deg",
            image: heroFamily,
            cta: "Les mer om våre tjenester",
            path: "/tjenester",
          },
        ]}
      />

      <RelatedServices 
        services={allServices} 
        currentPath="/gynecology"
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

export default Gynecology;