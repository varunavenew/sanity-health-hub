import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  dark?: boolean;
}

export const PageHero = ({ 
  title, 
  subtitle, 
  badge,
  showCTA = true, 
  ctaText = "Bestill time",
  ctaLink = "/booking",
  dark = true 
}: PageHeroProps) => {
  return (
    <header className={`pt-32 pb-20 md:pt-40 md:pb-28 ${dark ? 'bg-brand-dark' : 'bg-gradient-to-b from-secondary/50 to-background'}`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl">
          {badge && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-normal mb-6 ${
              dark ? 'bg-white/10 text-white/80' : 'bg-secondary text-muted-foreground'
            }`}>
              <span className="w-2 h-2 rounded-full bg-accent" />
              {badge}
            </div>
          )}
          
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-medium mb-6 ${dark ? 'text-white' : 'text-foreground'}`}>
            {title}
          </h1>
          
          <p className={`text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-8 ${
            dark ? 'text-white/70' : 'text-muted-foreground'
          }`}>
            {subtitle}
          </p>

          {showCTA && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-normal w-full sm:w-auto"
                onClick={() => window.location.href = ctaLink}
              >
                {ctaText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="ghost"
                className={`rounded-full px-8 font-normal w-full sm:w-auto border ${
                  dark ? 'border-white text-white bg-transparent hover:bg-white hover:text-brand-dark' : 'border-border text-foreground hover:bg-secondary'
                }`}
                onClick={() => window.location.href = '/kontakt'}
              >
                Kontakt oss
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
