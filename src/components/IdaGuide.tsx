import { Card } from "@/components/ui/card";
import { Camera, MessageCircle, Sparkles } from "lucide-react";
import idaProfile from "@/assets/ida-profile.jpg";

export const IdaGuide = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "1. Åpne chat",
      description: "Klikk på chat-ikonet nederst til høyre for å snakke med Ida",
    },
    {
      icon: Camera,
      title: "2. Ta bilde",
      description: "Bruk kameraknappen for å ta eller laste opp bilde av huden din",
    },
    {
      icon: Sparkles,
      title: "3. Få råd",
      description: "Ida analyserer huden din med AI og gir personlige anbefalinger",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={idaProfile}
                alt="Ida - Din hudpleieekspert"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Møt Ida - Din AI Hudpleieekspert
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ida er en 35 år gammel norsk hudpleieekspert som bruker AI for å analysere 
            huden din og gi deg personlige produktanbefalinger
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card key={step.title} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Prøv Ida nå - helt gratis!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
