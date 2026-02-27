import { Star, Clock, FileCheck, Shield } from "lucide-react";

const trustPoints = [
  {
    icon: Star,
    value: "4.9",
    label: "Pasientvurdering",
    sublabel: "Basert på 2000+ anmeldelser",
  },
  {
    icon: Clock,
    value: "1-3",
    label: "Dager ventetid",
    sublabel: "Timer ofte samme dag",
  },
  {
    icon: FileCheck,
    value: "Nei",
    label: "Ingen henvisning",
    sublabel: "Book direkte",
  },
  {
    icon: Shield,
    value: "✓",
    label: "Godkjent",
    sublabel: "Av Helsetilsynet",
  },
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-[hsl(30,10%,96%)] border-y border-border">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <div 
              key={point.label} 
              className="text-center opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                <point.icon className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-2xl md:text-3xl font-normal text-foreground">{point.value}</p>
              <p className="text-sm font-normal text-foreground mt-1">{point.label}</p>
              <p className="text-xs text-muted-foreground font-light">{point.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
