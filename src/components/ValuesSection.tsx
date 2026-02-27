import { Card } from "@/components/ui/card";
import { Shield, Award, Heart, Clock } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trygghet",
    description: "Høyeste faglige og etiske standarder i alt vi gjør",
  },
  {
    icon: Award,
    title: "Ekspertise",
    description: "Nordens ledende spesialister med internasjonal erfaring",
  },
  {
    icon: Heart,
    title: "Omsorg",
    description: "Individuell behandling tilpasset dine behov",
  },
  {
    icon: Clock,
    title: "Tilgjengelighet",
    description: "Kort ventetid og fleksible løsninger for deg",
  },
];

export const ValuesSection = () => {
  return (
    <section className="py-24 bg-[hsl(30,25%,90%)]">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight tracking-tight">
            Hvorfor velge CMedical?
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Vi kombinerer medisinsk ekspertise med varme og omsorg for å gi deg den beste opplevelsen
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-8 text-center hover:bg-card transition-all duration-300 rounded-lg border border-transparent hover:border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-6 flex justify-center">
                <value.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-light mb-3 tracking-tight">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
