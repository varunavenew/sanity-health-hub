import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA?: string;
  primaryLink?: string;
  secondaryCTA?: string;
  secondaryLink?: string;
  dark?: boolean;
}

export const CTASection = ({
  title,
  subtitle,
  primaryCTA = "Bestill time",
  primaryLink = "/booking",
  secondaryCTA,
  secondaryLink,
  dark = true
}: CTASectionProps) => {
  const isExternalLink = (link: string) => link.startsWith('http');

  return (
    <section className={`py-20 md:py-28 ${dark ? 'bg-brand-dark' : 'bg-secondary/30'}`}>
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-light mb-4 ${dark ? 'text-white' : 'text-foreground'}`}>
            {title}
          </h2>
          <p className={`text-base md:text-lg font-light mb-10 max-w-xl ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-white text-brand-dark hover:bg-white/90 rounded-sm px-8 font-light"
              onClick={() => {
                if (isExternalLink(primaryLink)) {
                  window.location.href = primaryLink;
                }
              }}
              asChild={!isExternalLink(primaryLink)}
            >
              {isExternalLink(primaryLink) ? (
                <>
                  {primaryCTA}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              ) : (
                <Link to={primaryLink}>
                  {primaryCTA}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              )}
            </Button>

            {secondaryCTA && secondaryLink && (
              <Button 
                size="lg"
                variant="ghost"
                className={`rounded-sm px-8 font-light ${
                  dark 
                    ? 'text-white border border-white hover:bg-white hover:text-brand-dark' 
                    : 'border border-border hover:bg-secondary'
                }`}
                asChild={!isExternalLink(secondaryLink)}
              >
                {isExternalLink(secondaryLink) ? (
                  <span onClick={() => window.location.href = secondaryLink}>
                    {secondaryCTA}
                  </span>
                ) : (
                  <Link to={secondaryLink}>{secondaryCTA}</Link>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
