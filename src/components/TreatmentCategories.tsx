import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const treatments = [
  {
    id: "gynekologi",
    title: "Gynekologi",
    description: "Komplett kvinnehelsetilbud",
    details: "Gynekologisk kirurgi, IVF-behandling, traumer etter fødsel, depresjon/angst i svangerskap og barsel",
  },
  {
    id: "fertilitet",
    title: "Fertilitet",
    description: "Nordens mest omfattende",
    details: "IVF-behandling og kirurgi på samme klinikk. Forskningsbasert behandling og personlig oppfølging",
  },
  {
    id: "urologi",
    title: "Urologi",
    description: "Ledende spesialister",
    details: "Problemer i mannens underliv eller urinveiene for begge kjønn. Omfattende behandling av erfarne urologer",
  },
];

interface TreatmentCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

export const TreatmentCategories = ({ onCategorySelect }: TreatmentCategoriesProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        {/* Large heading with zoom in/out concept */}
        <div className="mb-16 max-w-4xl">
          <h2 className="text-6xl md:text-7xl font-light mb-6 leading-tight tracking-tight">
            Våre tjenester
          </h2>
          <p className="text-sm text-muted-foreground tracking-wide max-w-2xl font-light">
            CMedical tilbyr spesialisert behandling innen gynekologi, fertilitet og urologi. 
            Våre ledende spesialister gir deg den beste behandlingen i elegante og rolige omgivelser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {treatments.map((treatment, index) => (
            <Card
              key={treatment.id}
              className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-500 border-border bg-card"
              onClick={() => onCategorySelect(treatment.id)}
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="p-8 space-y-4">
                {/* Large number */}
                <div className="text-8xl font-light text-muted opacity-20 leading-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Title */}
                <h3 className="text-3xl font-light tracking-tight">
                  {treatment.title}
                </h3>
                
                {/* Description */}
                <p className="text-base text-muted-foreground font-light">
                  {treatment.description}
                </p>
                
                {/* Details - small text */}
                <p className="text-xs text-muted-foreground font-light leading-relaxed pt-2">
                  {treatment.details}
                </p>
                
                {/* Arrow */}
                <div className="pt-4 flex items-center gap-2 text-sm text-primary group-hover:gap-4 transition-all">
                  <span className="font-normal">Les mer</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
