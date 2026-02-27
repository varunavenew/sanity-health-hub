import { 
  CreditCard, 
  FileText, 
  Shield, 
  Clock, 
  Building, 
  Phone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const infoCards = [
  {
    icon: CreditCard,
    title: "Betaling & priser",
    description: "Vi tilbyr fleksible betalingsløsninger. Se våre priser og forsikringsavtaler.",
    link: "/pricing",
    linkText: "Se prisliste",
  },
  {
    icon: FileText,
    title: "Henvisning",
    description: "Du trenger ikke henvisning for å bestille time hos oss. Kom direkte.",
    link: "/guide",
    linkText: "Les mer",
  },
  {
    icon: Shield,
    title: "Forsikring",
    description: "Vi har avtaler med de fleste helseforsikringsselskaper i Norge.",
    link: "/guide",
    linkText: "Se avtaler",
  },
  {
    icon: Clock,
    title: "Åpningstider",
    description: "Mandag-fredag: 08-18. Utvidede timer tilgjengelig etter avtale.",
    link: "/contact",
    linkText: "Kontakt oss",
  },
  {
    icon: Building,
    title: "Våre klinikker",
    description: "Vi har klinikker i Oslo, Bergen, Stavanger og Trondheim.",
    link: "/contact",
    linkText: "Finn klinikk",
  },
  {
    icon: Phone,
    title: "Kontakt",
    description: "Ring oss på 22 00 00 00 eller send e-post til post@cmedical.no",
    link: "/contact",
    linkText: "Kontakt oss",
  },
];

export const InfoCards = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-16">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-light text-accent mb-3 tracking-wide">
            Praktisk informasjon
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-6">
            Alt du trenger å vite
          </h2>
          <p className="text-base md:text-[17px] text-muted-foreground font-light">
            Finn svar på vanlige spørsmål om priser, forsikring og praktisk informasjon
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-xl border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <card.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-normal text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-muted-foreground font-light mb-4 leading-relaxed text-base">
                {card.description}
              </p>
              <Button variant="ghost" size="sm" className="p-0 h-auto font-light text-foreground group-hover:text-accent transition-colors">
                {card.linkText}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
