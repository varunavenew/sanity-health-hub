import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const treatmentSteps = [
  {
    number: "1",
    title: "Opplever symptomer?",
    description: "Føler du ubehag, har spørsmål om fertilitet eller behov for gynekologisk vurdering?",
    icon: Users,
  },
  {
    number: "2",
    title: "Book en konsultasjon",
    description: "Velg mellom våre spesialister og finn en tid som passer deg.",
    icon: Clock,
  },
  {
    number: "3",
    title: "Få profesjonell behandling",
    description: "Møt våre eksperter i moderne klinikker med topp utstyr.",
    icon: Shield,
  },
  {
    number: "4",
    title: "Oppfølging & støtte",
    description: "Vi følger deg tett gjennom hele behandlingsforløpet.",
    icon: CheckCircle2,
  },
];

const stats = [
  { value: "1000+", label: "Fornøyde pasienter" },
  { value: "15+", label: "Spesialister" },
  { value: "4.6★", label: "Gjennomsnittsvurdering" },
  { value: "3", label: "Klinikker" },
];

export const TreatmentInfoSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-[hsl(30,20%,96%)]">
      <div className="container mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-4">
            Din vei til bedre helse
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi gjør det enkelt å finne den hjelpen du trenger. Fra første kontakt til behandling og oppfølging.
          </p>
        </div>

        {/* Treatment Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {treatmentSteps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xl font-light text-accent-foreground">
                      {step.number}
                    </span>
                  </div>
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-light mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              {/* Connector Line */}
              {step.number !== "4" && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent/30" />
              )}
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-light text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-[hsl(25,15%,15%)] text-[hsl(30,20%,96%)] rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-light mb-4">
            Klar til å ta det første steget?
          </h3>
          <p className="text-[hsl(30,15%,65%)] mb-8 max-w-2xl mx-auto">
            Book en konsultasjon i dag og få profesjonell veiledning tilpasset dine behov.
            Vi tar oss tid til å lytte og finne den beste løsningen for deg.
          </p>
          <Button 
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-8 py-6 text-lg"
            onClick={() => navigate('/booking')}
          >
            Book time nå
          </Button>
        </div>
      </div>
    </section>
  );
};
