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
 dark?: boolean;
}

/**
 * Reusable split-screen hero. Defaults to warm background; pass `dark` for brand-dark.
 * Always edge-to-edge split, capped at max-h-screen.
 */
export const SplitHero = ({
 title,
 description,
 image,
 imageAlt,
 primaryCta,
 secondaryCta,
 dark = false,
}: SplitHeroProps) => {
 const navigate = useNavigate();

 const bg = dark ? "bg-brand-dark" : "bg-brand-warm";
 const titleColor = dark ? "text-white" : "text-foreground";
 const descColor = dark ? "text-white/70" : "text-foreground/70";

 return (
 <header className={bg}>
 <div className="grid md:grid-cols-2 md:min-h-[520px] md:max-h-screen">
 {/* Left: text */}
 <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 md:order-1">
 <h1 className={`text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] mb-6 ${titleColor}`}>
 {title}
 </h1>
 {description && (
 <p className={`text-base font-light leading-relaxed max-w-md mb-8 ${descColor}`}>
 {description}
 </p>
 )}
 <div className="flex flex-wrap gap-3">
 {primaryCta && (
 <Button
 variant={dark ? "cta-dark" : "cta"}
 size="lg"
 onClick={() => navigate(primaryCta.to)}
 >
 {primaryCta.label}
 <ArrowRight className="ml-2 w-4 h-4" />
 </Button>
 )}
 {secondaryCta && (
 <Button
 variant={dark ? "cta-outline-dark" : "ghost"}
 size="lg"
 className={
 dark
 ? undefined
 : "border border-foreground/30 text-foreground hover:bg-brand-dark hover:text-white hover:border-brand-dark rounded-2xl"
 }
 onClick={() => navigate(secondaryCta.to)}
 >
 <Phone className="mr-2 w-4 h-4" />
 {secondaryCta.label}
 </Button>
 )}
 </div>
 </div>
 {/* Right: image (edge-to-edge) */}
 <div className="relative order-1 md:order-2 min-h-[260px] md:min-h-0 md:h-full">
 <img
 src={image}
 alt={imageAlt || title}
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 <div className={`h-px w-full ${dark ? "bg-white/10" : "bg-foreground/5"}`} aria-hidden="true" />
 </header>
 );
};
