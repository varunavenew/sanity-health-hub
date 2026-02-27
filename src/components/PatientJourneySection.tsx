import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Calendar,
    number: "01",
    title: "Book konsultasjon",
    description: "Bestill time med våre spesialister når det passer deg",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Første møte",
    description: "Grundig kartlegging og vurdering av dine behov",
  },
  {
    icon: FileText,
    number: "03",
    title: "Behandlingsplan",
    description: "Skreddersydd plan basert på din situasjon",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Oppfølging",
    description: "Kontinuerlig støtte gjennom hele behandlingen",
  },
];

export const PatientJourneySection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight tracking-tight">
            Din reise hos oss
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Fra første kontakt til ferdig behandling - vi er med deg hele veien
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="relative p-6 hover:bg-card transition-all duration-300 rounded-lg border border-transparent hover:border-border group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-sm font-light text-primary">{step.number}</span>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div className="flex justify-start">
                    <step.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-xl font-light tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-normal px-12 h-14 rounded-full hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/booking')}
          >
            Kom i gang i dag
          </Button>
        </div>
      </div>
    </section>
  );
};
