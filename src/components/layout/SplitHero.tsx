import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SplitHeroProps {
 eyebrow?: string;
 title: string;
 description?: string;
 image: string;
 imageAlt?: string;
 primaryCta?: { label: string; to: string };
 secondaryCta?: { label: string; to: string };
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
}: SplitHeroProps) => {
 const navigate = useNavigate();

 return (
 <header className="bg-brand-warm">
 <div className="grid md:grid-cols-2 min-h-[420px] md:min-h-[520px]">
 {/* Left: text */}
 <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1">
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
 {title}
 </h1>
 {description && (
 <p className="text-base text-foreground/70 font-light leading-relaxed max-w-md mb-8">
 {description}
 </p>
 )}
 <div className="flex flex-wrap gap-3">
 {primaryCta && (
 <Button variant="cta" size="lg" onClick={() => navigate(primaryCta.to)}>
 {primaryCta.label}
 <ArrowRight className="ml-2 w-4 h-4" />
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
 </div>
 {/* Right: image */}
 <div className="relative order-1 md:order-2 min-h-[260px] md:min-h-0">
 <img
 src={image}
 alt={imageAlt || title}
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>
 );
};
