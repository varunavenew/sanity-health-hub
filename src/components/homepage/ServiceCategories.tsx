import { ArrowRight, Activity, Stethoscope, Baby, Thermometer, HeartPulse, UserRound, Scissors, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Stethoscope, title: "Gynekologi", services: ["Celleprøve", "Hormonutredning", "Spiral", "Overgangsalder"] },
  { icon: UserRound, title: "Urologi & Mannehelse", services: ["Prostatautredning", "Urinveier", "Erektil dysfunksjon", "Mannlig fertilitet"] },
  { icon: Baby, title: "Fertilitet & IVF", services: ["Fertilitetsutredning", "IVF-forberedelse", "Eggdonasjon", "Sædanalyse"] },
  { icon: Scan, title: "Graviditet & Ultralyd", services: ["Tidlig ultralyd", "NIPT-test", "Svangerskapskontroll", "3D/4D ultralyd"] },
  { icon: Activity, title: "Bekkenhelse", services: ["Bekkenbunnsutredning", "Kroniske smerter", "Endometriose", "Prolaps"] },
  { icon: HeartPulse, title: "Seksuell Helse", services: ["Seksologisk rådgivning", "STI-testing", "Intimhelse", "Par-terapi"] },
  { icon: Thermometer, title: "Hormoner & Endokrinologi", services: ["Hormonterapi", "PCOS", "Stoffskifte", "Testosteron"] },
  { icon: Scissors, title: "Kirurgi", services: ["Gynekologisk kirurgi", "Urologisk kirurgi", "Laparoskopi", "Intimkirurgi"] },
];

export const ServiceCategories = () => {
  const navigate = useNavigate();
  
  return (
    <section id="services" className="py-24 md:py-32 bg-[hsl(30,10%,96%)]">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-2xl mb-16">
          <p className="text-sm text-brand-dark/70 font-normal mb-3">Våre tjenester</p>
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">Finn hjelp for dine symptomer</h2>
          <p className="text-muted-foreground font-light text-base">Uansett hva du opplever – vi har spesialister som kan hjelpe.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <div key={category.title} className="group p-5 rounded-lg bg-card border border-border/50 card-hover cursor-pointer opacity-0 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="w-10 h-10 rounded-lg bg-brand-dark/10 flex items-center justify-center mb-4 group-hover:bg-brand-dark/20 transition-colors">
                <category.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-normal text-foreground mb-3">{category.title}</h3>
              <ul className="space-y-1.5 mb-4">
                {category.services.map((service) => (
                  <li key={service} className="text-sm text-muted-foreground font-light">{service}</li>
                ))}
              </ul>
              <div className="flex items-center gap-1 text-sm text-foreground font-normal group-hover:text-brand-dark group-hover:gap-2 transition-all">
                Se alle <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-md px-8" onClick={() => navigate('/booking')}>
            Se alle behandlinger <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
