import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
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

const Fertility = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitet | CMedical - IVF og fertilitetsbehandling";
  }, []);

  const services = [
    "Komplett fertilitetsutredning for par og single",
    "IVF (in vitro fertilisering) og ICSI",
    "Inseminasjon (IUI)",
    "Nedfrysing av egg, sæd og embryo",
    "Eggdonasjon og sæddonasjon",
    "Genetisk testing (PGT)",
    "Psykologisk støtte gjennom hele prosessen"
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageHero
        badge="Fertilitet"
        title="Veien til foreldreskap"
        subtitle="Utredning og behandling for å hjelpe dere å lykkes – med moderne metoder, tett oppfølging og høy suksessrate."
        ctaText="Book fertilitetstime"
      />

      {/* Services */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-sm text-accent font-medium mb-4">Våre tjenester</p>
                <h2 className="text-3xl md:text-4xl font-medium mb-6 text-foreground">
                  Komplett tilbud for fertilitetsbehandling
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Vi tilbyr et helhetlig tilbud for par og single som ønsker å bli foreldre, med de nyeste og mest effektive behandlingsmetodene.
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
                <h3 className="text-2xl font-medium mb-4">Start din reise</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Ta det første steget mot foreldreskap. Vi er her for å veilede deg hele veien.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    42% suksessrate under 35 år
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    1000+ vellykkede behandlinger
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Helhetlig omsorg
                  </div>
                </div>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
                  onClick={() => window.location.href = '/booking'}
                >
                  Book veiledning
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
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Behandlingsprosessen</h2>
            <p className="text-muted-foreground">Vi følger deg hele veien</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Første møte", desc: "Kartlegge historikk og behov" },
              { step: "2", title: "Utredning", desc: "Grundige tester og analyser" },
              { step: "3", title: "Behandling", desc: "Individuell behandlingsplan" },
              { step: "4", title: "Oppfølging", desc: "Tett oppfølging hele veien" }
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

      {/* Stats */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-white">Våre resultater</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-8">
              <div className="text-5xl font-medium text-accent mb-2">42%</div>
              <p className="text-white/70">Suksessrate under 35 år</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-medium text-accent mb-2">1000+</div>
              <p className="text-white/70">Vellykkede behandlinger</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-medium text-accent mb-2">95%</div>
              <p className="text-white/70">Fornøyde pasienter</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Vanlige spørsmål</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">Hva er sannsynligheten for å lykkes med IVF?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  For kvinner under 35 år ligger sannsynligheten på rundt 40-45% per syklus. Vi gir deg en individuell vurdering.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">Hvor lang tid tar en IVF-behandling?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  En komplett IVF-syklus tar vanligvis 4-6 uker fra oppstart til graviditetstest.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">Kan single få fertilitetsbehandling?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ja, vi tilbyr fertilitetsbehandling til single kvinner med inseminasjon eller IVF med donorsæd.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">Får vi psykologisk støtte underveis?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ja, vi tilbyr psykologisk støtte gjennom hele behandlingsforløpet.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <RelatedServices 
        services={allServices} 
        currentPath="/fertility"
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

export default Fertility;