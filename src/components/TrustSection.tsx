import { Shield, Award, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    number: "250K+",
    label: "Fornøyde Kunder",
    description: "Over hele verden"
  },
  {
    icon: Award,
    number: "15+",
    label: "Prisbelønte Produkter",
    description: "Internasjonal anerkjennelse"
  },
  {
    icon: Shield,
    number: "100%",
    label: "Klinisk Testet",
    description: "Dermatolog godkjent"
  },
  {
    icon: TrendingUp,
    number: "94%",
    label: "Kundetilfredshet",
    description: "Ser synlige resultater"
  }
];

export const TrustSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Hvorfor Velge <span className="text-primary">GlowUp</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi er dedikert til å levere premium hudpleie som virkelig fungerer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="group relative p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div>
                    <div className="text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="font-semibold text-lg mb-1">
                      {stat.label}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 shadow-xl">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">
                Klar for Din Hudtransformasjon?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Bli med over 250,000 fornøyde kunder som har oppnådd strålende hud med våre prisbelønte produkter
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <button className="px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
                  Snakk med Ida - AI Hudekspert
                </button>
                <button className="px-8 py-4 bg-white border-2 border-primary/20 font-medium rounded-full hover:border-primary/40 transition-all hover:scale-105">
                  Se Alle Produkter
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
