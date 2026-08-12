import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";

interface SplitHeroProps {
 title: string;
 description?: React.ReactNode;
 image: string;
 imageAlt?: string;
 primaryCta?: { label: string; to: string };
 secondaryCta?: { label: string; to: string };
 bottomNote?: string;
}

/**
 * Reusable split-screen hero matching the category page design
 * (warm background, image right, text left on desktop; image first on mobile).
 */
export const SplitHero = ({
 title,
 description,
 image,
 imageAlt,
 primaryCta,
 secondaryCta,
 bottomNote,
}: SplitHeroProps) => {
 const navigate = useNavigate();

 return (
 <header className="bg-brand-warm">
 <div className="grid lg:grid-cols-2 split-hero">
 {/* Left: text */}
 <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 lg:order-1">
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
 {title}
 </h1>
 {description && (
 <div className="text-base text-foreground/70 font-light leading-relaxed max-w-md mb-8 space-y-4">
 {typeof description === "string" ? <p>{description}</p> : description}
 </div>
 )}
 <div className="flex flex-col md:flex-row gap-3">
 {primaryCta && (
 <Button variant="cta" size="lg" onClick={() => navigate(primaryCta.to)}>
 {primaryCta.label}
 </Button>
 )}
 {secondaryCta && (
 <Button
 variant="ghost"
 size="lg"
 className="border border-foreground/30 text-foreground hover:bg-brand-dark hover:text-white hover:border-brand-dark rounded-2xl"
 onClick={() => navigate(secondaryCta.to)}
 >
 <Phone className="mr-2 w-4 h-4" />
 {secondaryCta.label}
 </Button>
 )}
 </div>
 {bottomNote && (
 <p className="mt-4 md:mt-6 text-xs text-brand-dark/60 font-light max-w-md leading-relaxed">
 {bottomNote}
 </p>
 )}
  </div>
  {/* Right: image */}
 <SplitHeroMedia
	src={image}
	alt={imageAlt || title}
	className="relative order-1 lg:order-2 min-h-[260px] lg:min-h-0 h-full w-full overflow-hidden"
	/>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>
 );
};
