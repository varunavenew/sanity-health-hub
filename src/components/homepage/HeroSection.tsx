import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero/family-hero.webp";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  const scrollToLifePhases = () => {
    document.getElementById('life-phases')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 bg-brand-dark">
      {/* Background Image with warm color grading */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Familie - CMedical spesialisert helsetjeneste"
          className="w-full h-full object-cover scale-105"
          style={{
            objectPosition: '70% 15%',
            filter: 'sepia(15%) saturate(90%) brightness(0.85) contrast(1.05)',
          }}
        />
        {/* Warm overlay to match brand colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 md:px-16 py-20">
        <div className="max-w-2xl space-y-8">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Over 150 000 fornøyde pasienter siden 2002
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.1] tracking-tight">
            Nordens ledende klinikk for{" "}
            <span className="text-accent">livet og underlivet</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-[17px] text-white/75 font-light leading-relaxed max-w-xl">
            CMedical samler Nordens fremste spesialister innen gynekologi, urologi, fertilitet og seksuell helse – for både kvinner og menn.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8 h-14 text-base rounded-md shadow-lg glow-yellow"
              onClick={() => navigate('/booking')}
            >
              Bestill time
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-normal px-8 h-14 text-base rounded-md backdrop-blur-sm"
              onClick={scrollToLifePhases}
            >
              Utforsk våre tjenester
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-normal text-white">4.9</p>
              <p className="text-sm text-white/60 font-light">Pasientvurdering</p>
            </div>
            <div>
              <p className="text-3xl font-normal text-white">1-3</p>
              <p className="text-sm text-white/60 font-light">Dager ventetid</p>
            </div>
            <div>
              <p className="text-3xl font-normal text-white">77+</p>
              <p className="text-sm text-white/60 font-light">Spesialister</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
