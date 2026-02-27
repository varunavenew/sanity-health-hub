import { Star, Clock, FileCheck, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    icon: Star,
    value: "4.9",
    label: "Pasientvurdering",
    sublabel: "Basert på 1000+ anmeldelser",
  },
  {
    icon: Clock,
    value: "1-3",
    label: "Dagers ventetid",
    sublabel: "Rask tilgang til spesialister",
  },
  {
    icon: FileCheck,
    value: "Ingen",
    label: "Henvisning",
    sublabel: "Bestill direkte hos oss",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Godkjent",
    sublabel: "Helsetilsynet godkjent",
  },
];

export const TrustStatsSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-28 bg-brand-dark">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm text-accent font-medium tracking-wide mb-4">
            Hvorfor velge CMedical
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-tight">
            Nordens ledende klinikk for{" "}
            <span className="text-accent">livet</span>
            <br />
            og <span className="text-accent">underlivet</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-lg p-6 md:p-8 opacity-0 animate-scale-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className="w-6 h-6 text-accent mb-6" strokeWidth={1.5} />
              <p className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-2">
                {stat.value}
              </p>
              <p className="text-white font-medium mb-1">{stat.label}</p>
              <p className="text-sm text-white/50 font-light">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button 
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => navigate('/booking')}
          >
            Bestill time nå
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
