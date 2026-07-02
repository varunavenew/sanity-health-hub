import { ArrowRight, Wallet, Building2, Phone, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { getIcon } from "@/lib/icons";

interface Service {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
}

interface RelatedServicesProps {
  title?: string;
  subtitle?: string;
  services: Service[];
  currentPath?: string;
}

export const RelatedServices = ({
  title = "Utforsk flere tjenester",
  subtitle = "Se andre behandlingsområder som kan være relevante for deg",
  services,
  currentPath
}: RelatedServicesProps) => {
  const filteredServices = services.filter(s => s.link !== currentPath);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground font-normal">{subtitle}</p>
        </div>

        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-6 md:mx-auto px-6 md:px-0 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {filteredServices.slice(0, 3).map((service) => (
            <Link
              key={service.link}
              to={service.link}
              className="group p-8 rounded-2xl bg-brand-warm hover:bg-brand-warm/80 transition-all shrink-0 w-[85%] md:w-auto snap-start"
            >
              <div className="mb-6">
                <service.icon className="w-8 h-8 text-brand-dark/70" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-brand-dark mb-2 group-hover:text-brand-dark transition-colors">
                {service.title}
              </h3>
              <p className="text-brand-dark/60 font-normal text-sm mb-4">{service.description}</p>
              <span className="inline-flex items-center text-sm text-brand-dark font-medium">
                Les mer
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
        <ScrollArrows scrollRef={scrollRef} />
      </div>
    </section>
  );
};

export const allServices: Service[] = [
  {
    title: "Gynekologi",
    description: "Undersøkelser, celleprøve og behandlinger for kvinner",
    link: "/behandlinger/gynekologi",
    icon: getIcon("gynekologi-cl")
  },
  {
    title: "Fertilitet",
    description: "IVF, IUI og fertilitetsutredning for par og single",
    link: "/behandlinger/fertilitet",
    icon: getIcon("fertilitet-cl")
  },
  {
    title: "Urologi",
    description: "Prostata, urinveisplager og mannlig helse",
    link: "/behandlinger/urologi",
    icon: getIcon("urologi-cl")
  },
  {
    title: "Prisliste",
    description: "Transparent oversikt over alle våre behandlinger",
    link: "/priser",
    icon: Wallet
  },
  {
    title: "Om oss",
    description: "Møt våre spesialister og lær mer om CMedical",
    link: "/om-oss",
    icon: Building2
  },
  {
    title: "Kontakt",
    description: "Ta kontakt med oss for spørsmål eller booking",
    link: "/kontakt",
    icon: Phone
  }
];
