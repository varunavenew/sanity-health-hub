import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SpecialistsSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Large text */}
          <div className="space-y-8">
            <h2 className="text-6xl md:text-7xl font-light leading-[0.95] tracking-tight">
              Ledende <br />
              spesialister
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-lg">
              Hos CMedical møter du Nordens fremste spesialister innen gynekologi, 
              fertilitet og urologi. Våre leger er dedikerte til å gi deg den beste 
              behandlingen og oppfølgingen.
            </p>
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-8"
              onClick={() => navigate('/booking')}
            >
              Book konsultasjon
            </Button>
          </div>

          {/* Right - Stats */}
          <div className="space-y-8">
            <Card className="p-8 bg-card border-border">
              <div className="space-y-2">
                <div className="text-5xl font-light text-primary">14</div>
                <div className="text-sm text-muted-foreground font-light">
                  Klinikker i Norge og Sverige
                </div>
              </div>
            </Card>
            
            <Card className="p-8 bg-card border-border">
              <div className="space-y-2">
                <div className="text-5xl font-light text-primary">100+</div>
                <div className="text-sm text-muted-foreground font-light">
                  Spesialister og helsepersonell
                </div>
              </div>
            </Card>
            
            <Card className="p-8 bg-card border-border">
              <div className="space-y-2">
                <div className="text-5xl font-light text-primary">Kort</div>
                <div className="text-sm text-muted-foreground font-light">
                  Ventetid · Ingen henvisning nødvendig
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
