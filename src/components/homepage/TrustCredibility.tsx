import { Star, Clock, FileCheck, Shield, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const trustPoints = [
  {
    icon: Star,
    value: "4.9",
    label: "Pasientvurdering",
    description: "Basert på 1000+ anmeldelser",
  },
  {
    icon: Clock,
    value: "1-3",
    label: "Dagers ventetid",
    description: "Rask tilgang til spesialister",
  },
  {
    icon: FileCheck,
    value: "Ingen",
    label: "Henvisning",
    description: "Bestill direkte hos oss",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Godkjent",
    description: "Helsetilsynet godkjent",
  },
];

const specialists = [
  {
    name: "Dr. Maria Hansen",
    title: "Gynekolog",
    image: "/placeholder.svg",
    initials: "MH"
  },
  {
    name: "Dr. Erik Johansen",
    title: "Urolog",
    image: "/placeholder.svg",
    initials: "EJ"
  },
  {
    name: "Dr. Kristine Berg",
    title: "Fertilitetslege",
    image: "/placeholder.svg",
    initials: "KB"
  },
  {
    name: "Dr. Anders Nilsen",
    title: "Radiolog",
    image: "/placeholder.svg",
    initials: "AN"
  },
];

export const TrustCredibility = () => {
  return (
    <section className="py-20 md:py-28 bg-[hsl(25,15%,15%)] text-[hsl(30,20%,96%)]">
      <div className="container mx-auto px-6 md:px-16">
        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-light text-accent mb-3 tracking-wide">
            Hvorfor velge CMedical
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6 leading-tight">
            Trygg behandling fra{" "}
            <span className="text-accent">Skandinavias ledende</span> spesialister
          </h2>
        </div>

        {/* Trust points grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <point.icon className="w-8 h-8 text-accent mb-4" />
              <p className="text-3xl md:text-4xl font-light mb-1">{point.value}</p>
              <p className="text-base font-normal mb-1">{point.label}</p>
              <p className="text-sm text-white/60 font-light">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Specialists section */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-light mb-2">Møt våre spesialister</h3>
              <p className="text-white/70 font-light">
                Over 50 erfarne leger og helsepersonell står klare for deg
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-sm text-white/80">Alle godkjent av Helsetilsynet</span>
            </div>
          </div>

          {/* Specialist cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialists.map((specialist, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center"
              >
                <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-accent/20">
                  <AvatarImage src={specialist.image} alt={specialist.name} />
                  <AvatarFallback className="bg-accent/20 text-accent text-lg">
                    {specialist.initials}
                  </AvatarFallback>
                </Avatar>
                <p className="font-normal mb-1">{specialist.name}</p>
                <p className="text-sm text-white/60 font-light">{specialist.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
