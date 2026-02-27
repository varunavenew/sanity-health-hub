import { FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InfoCard {
  id: string;
  title: string;
  description: string;
  steps?: string[];
  icon: string;
}

interface InfoCardsProps {
  cards: InfoCard[];
  title: string;
}

export const InfoCards = ({ cards, title }: InfoCardsProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 glow-text">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className="bg-card p-8 hover:shadow-sm transition-all duration-300 animate-slide-up border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl text-primary">
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
              </div>

              {card.steps && (
                <div className="space-y-2 mb-6">
                  {card.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="ghost" className="w-full justify-between group text-primary hover:text-primary">
                Les mer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
