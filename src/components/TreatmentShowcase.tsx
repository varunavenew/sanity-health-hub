import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useGenerateImage } from "@/hooks/useGenerateImage";

const treatments = [
  {
    id: "gynekologi",
    title: "Gynekologi",
    subtitle: "Kvinnehelse og kirurgi",
    description: "Vi tilbyr et komplett spekter av gynekologiske tjenester, fra forebyggende undersøkelser til avansert kirurgi. Våre spesialister har omfattende erfaring med gynekologiske lidelser og fertilitetsutfordringer.",
    features: [
      "Gynekologisk kirurgi",
      "IVF-behandling", 
      "Oppfølging etter fødsel",
      "Psykisk helse i graviditet"
    ],
    prompt: "Professional medical consultation photo: Female gynecologist in modern Scandinavian clinic consulting with patient, soft natural lighting, clean white and beige interior, medical equipment visible in background, warm and professional atmosphere, realistic medical photography, high quality",
  },
  {
    id: "fertilitet",
    title: "Fertilitet",
    subtitle: "Nordens mest omfattende tilbud",
    description: "Med både IVF-behandling og kirurgi på samme klinikk, tilbyr vi en helhetlig tilnærming til fertilitetsbehandling. Vårt team kombinerer forskning og personlig omsorg.",
    features: [
      "IVF og eggdonasjon",
      "Fertilitetskirurgi",
      "Hormonbehandling",
      "Sædanalyse og behandling"
    ],
    prompt: "Professional fertility clinic photo: Modern IVF laboratory with medical specialist examining samples under microscope, clean sterile environment, advanced medical equipment, soft professional lighting, Scandinavian design aesthetic, realistic medical photography, high quality",
  },
  {
    id: "urologi",
    title: "Urologi",
    subtitle: "Spesialister i mannshelse",
    description: "Våre urologer behandler et bredt spekter av tilstander i mannens underliv og urinveiene for begge kjønn. Vi tilbyr moderne diagnostikk og behandlingsmetoder.",
    features: [
      "Prostataundersøkelser",
      "Behandling av inkontinens",
      "Sterilisering",
      "Nyrestein og infeksjoner"
    ],
    prompt: "Professional urology clinic photo: Male urologist consulting with male patient in modern medical office, professional medical setting, diagnostic equipment visible, warm neutral colors, comfortable consultation room, Scandinavian medical interior, realistic medical photography, high quality",
  },
];

const TreatmentImage = ({ prompt, title }: { prompt: string; title: string }) => {
  const { imageUrl, isLoading } = useGenerateImage({ 
    prompt, 
    category: title.toLowerCase() 
  });

  return (
    <div className="w-full h-full bg-muted flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Genererer bilde...</p>
        </div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-muted-foreground text-sm">Kunne ikke laste bilde</div>
      )}
    </div>
  );
};

export const TreatmentShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-light mb-6 leading-tight tracking-tight">
            Våre spesialområder
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            CMedical er Skandinavias ledende helhetskonsept innen gynekologi, fertilitet og urologi. 
            Vi kombinerer medisinsk ekspertise med omsorgsfull behandling.
          </p>
        </div>

        <div className="space-y-24">
          {treatments.map((treatment, index) => (
            <div 
              key={treatment.id}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div 
                className={`relative h-[500px] rounded-lg overflow-hidden group ${
                  index % 2 === 1 ? 'md:col-start-2' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10 group-hover:opacity-0 transition-opacity duration-500" />
                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 overflow-hidden">
                  <TreatmentImage prompt={treatment.prompt} title={treatment.title} />
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <div className="space-y-2">
                  <div className="text-sm text-primary font-normal tracking-wide uppercase">
                    {treatment.subtitle}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-light tracking-tight">
                    {treatment.title}
                  </h3>
                </div>

                <p className="text-base text-muted-foreground font-light leading-relaxed">
                  {treatment.description}
                </p>

                <div className="space-y-3 pt-4">
                  {treatment.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="default"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full"
                    onClick={() => window.location.href = '/booking'}
                  >
                    Book time
                  </Button>
                  <Button
                    variant="outline"
                    className="group border-primary/20 hover:border-primary hover:bg-primary/5 rounded-full"
                    onClick={() => window.location.href = `/${treatment.id}`}
                  >
                    <span className="text-sm font-light">Les mer</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
