import { Sparkles, Award, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Nordens ledende",
    subtitle: "ekspertise",
  },
  {
    icon: Award,
    title: "100+ spesialister",
    subtitle: "med erfaring",
  },
  {
    icon: Shield,
    title: "Trygg behandling",
    subtitle: "høyeste standard",
  },
  {
    icon: Clock,
    title: "Kort ventetid",
    subtitle: "fleksible løsninger",
  },
];

export const PremiumBanner = () => {
  return (
    <section className="py-16 bg-[hsl(25,15%,15%)] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(25,15%,18%)] via-transparent to-[hsl(25,15%,18%)] opacity-50" />
      
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 mt-1">
                <feature.icon 
                  className="w-6 h-6 text-[hsl(48,95%,60%)] group-hover:scale-110 transition-transform duration-300" 
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-[hsl(30,20%,96%)] text-base font-light tracking-tight leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[hsl(30,15%,65%)] text-sm font-light">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
