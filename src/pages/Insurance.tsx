import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArrowRight, Phone, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useInsurancePage } from "@/hooks/useSanity";
import insuranceHero from "@/assets/hero/insurance-woman-phone.webp";

interface PageProps { isChatOpen: boolean }

const fallbackCompanies = [
  { name: "EuroAccident" }, { name: "Falck" }, { name: "Fremtind" }, { name: "Gjensidige" },
  { name: "If" }, { name: "Storebrand" }, { name: "Tryg" },
];

const fallbackSteps = [
  { num: "1", title: "Få henvisning", desc: "Fra fastlege eller spesialist" },
  { num: "2", title: "Send til forsikring", desc: "For godkjenning av dekning" },
  { num: "3", title: "Velg CMedical", desc: "Be om behandling hos oss" },
  { num: "4", title: "Bestill time", desc: "Vi fakturerer forsikringen direkte" },
];

const fallbackBenefits = [
  { title: "Ingen utlegg", desc: "Du slipper å betale selv – vi sender faktura direkte til forsikringsselskapet." },
  { title: "Raskere behandling", desc: "Få time innen kort tid med kort ventetid hos våre spesialister." },
  { title: "Alle forsikringer", desc: "Vi har avtale med alle store forsikringsselskaper i Norge." },
];

const Insurance = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: page } = useInsurancePage();
  
  useEffect(() => {
    document.title = "Forsikring | CMedical - Behandling med forsikring";
  }, []);

  const heroImage = page?.heroImage || insuranceHero;
  const title = page?.title || "Helseforsikring";
  const subtitle = page?.subtitle || "Bruk forsikringen din til raskere behandling hos oss";
  const companies = page?.companies?.length ? page.companies : fallbackCompanies;
  const steps = page?.steps?.length ? page.steps : fallbackSteps;
  const benefits = page?.benefits?.length ? page.benefits : fallbackBenefits;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <header className="relative">
        <div className="h-[25vh] md:h-[30vh] relative">
          <img src={heroImage} alt="Forsikring hos CMedical" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:px-16">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white">{title}</h1>
              <p className="text-white/70 mt-2 max-w-lg font-light text-sm md:text-base">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Partners */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full mb-6">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-light">Våre samarbeidspartnere</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-foreground">Vi har avtale med alle store forsikringsselskaper</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {companies.map((company: any) => (
                <div key={company.name} className="px-5 py-3 bg-muted/30 rounded-full border border-border text-foreground font-light hover:border-foreground/30 transition-colors">
                  {company.name}
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground font-light">
              Finner du ikke ditt selskap? <Link to="/kontakt" className="underline hover:no-underline">Kontakt oss</Link> – vi hjelper deg.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 text-center">Slik bruker du forsikringen</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {steps.map((step: any, index: number) => (
                <div key={step.num} className="relative text-center">
                  {index < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />}
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-lg font-medium">{step.num}</span>
                  </div>
                  <h3 className="font-normal text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit: any) => (
                <div key={benefit.title} className="p-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-5">
                    <Check className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-normal text-white mb-3 text-lg">{benefit.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-foreground font-normal">Trenger du hjelp?</p>
                <p className="text-muted-foreground text-sm font-light">Vi veileder deg gjennom hele prosessen</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-foreground/20 hover:bg-muted" asChild>
                <Link to="/kontakt">Kontakt oss</Link>
              </Button>
              <Button className="bg-brand-dark text-white hover:bg-brand-dark/90" onClick={() => navigate('/booking')}>
                Bestill time<ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Insurance;
