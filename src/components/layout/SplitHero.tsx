import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router";
import { AssetImg } from "@/components/AssetImg";
import { assetSrc, type ImageRef } from "@/lib/media";

interface SplitHeroProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: ImageRef;
  imageAlt?: string;
  primaryCta?: { label: string; to: string; variant?: "cta" | "contact" };
  secondaryCta?: { label: string; to: string };
}

/**
 * Reusable split-screen hero matching the category page design
 * (warm background, image right, text left on desktop; image first on mobile).
 */
export const SplitHero = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  primaryCta = { label: "Bestill time", to: "/booking", variant: "cta" },
  secondaryCta,
}: SplitHeroProps) => {
  const navigate = useNavigate();

  const hasText = Boolean(eyebrow?.trim() || title?.trim() || description?.trim());
  const imageSrc = image ? assetSrc(image) : "";
  const hasImage = Boolean(imageSrc);

  return (
    <header className="bg-brand-warm">
      <div
        className={
          hasImage
            ? "grid md:grid-cols-2 min-h-[360px] md:min-h-[460px]"
            : "flex flex-col"
        }
      >
        {/* Left: text */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-20 pt-8 pb-12 md:pt-12 md:pb-16 order-2 md:order-1">
          {eyebrow?.trim() ? (
            <p className="text-xs text-foreground/60 font-light tracking-wide mb-4">
              {eyebrow}
            </p>
          ) : null}
          {title?.trim() ? (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
              {title}
            </h1>
          ) : null}
          {description?.trim() ? (
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-md mb-8">
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {primaryCta.variant === "contact" ? (
              <Button
                variant="outline"
                size="lg"
                className="border border-foreground/30 text-foreground bg-transparent hover:bg-brand-dark hover:text-white hover:border-brand-dark rounded-xl px-6 py-5 text-sm font-light flex items-center"
                onClick={() => navigate(primaryCta.to)}
              >
                <Phone className="mr-2 w-4 h-4 text-foreground group-hover:text-white" strokeWidth={1.5} />
                {primaryCta.label}
              </Button>
            ) : (
              <Button variant="cta" size="lg" onClick={() => navigate(primaryCta.to)}>
                {primaryCta.label}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            {secondaryCta ? (
              <Button
                variant="ghost"
                size="lg"
                className="border border-foreground/30 text-foreground hover:bg-brand-dark hover:text-white hover:border-brand-dark rounded-xl"
                onClick={() => navigate(secondaryCta.to)}
              >
                <Phone className="mr-2 w-4 h-4" />
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
        {/* Right: image */}
        {hasImage ? (
          <div className="relative order-1 md:order-2 min-h-[260px] md:min-h-0">
            <AssetImg
              src={imageSrc}
              alt={imageAlt || title || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>
      {!hasText && !hasImage ? null : (
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      )}
    </header>
  );
};
