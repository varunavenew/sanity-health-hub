"use client";

import type { ReactNode } from "react";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";
import { assetSrc, type ImageRef } from "@/lib/media";
import type { MediaFocalPoint, SanityHotspot } from "@/lib/media/focal-point";

type HeroCta = {
  label: string;
  to: string;
  variant?: "cta" | "contact";
};

type SecondaryHeroCta = {
  label: string;
  to: string;
  /** Defaults to phone; Contact page uses mapPin for “Se klinikker”. */
  icon?: "phone" | "mapPin";
};

interface SplitHeroProps {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  image?: ImageRef;
  imageAlt?: string;
  /** Sanity hotspot when available — improves framing on wide desktops. */
  imageHotspot?: SanityHotspot | MediaFocalPoint | null;
  /** When omitted/null, no primary button is rendered. */
  primaryCta?: HeroCta | null;
  secondaryCta?: SecondaryHeroCta | null;
  /** Optional fine print under CTAs (Pricing disclaimer, etc.). */
  footnote?: string;
  /** Alias for footnote — matches reference API. */
  bottomNote?: string;
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
  imageHotspot,
  primaryCta = null,
  secondaryCta = null,
  footnote,
  bottomNote,
}: SplitHeroProps) => {
  const navigate = useNavigate();

  const note = bottomNote?.trim() || footnote?.trim() || "";
  const imageSrc = image ? assetSrc(image) : "";
  const hasImage = Boolean(imageSrc);
  const hasText = Boolean(eyebrow?.trim() || title?.trim() || description);
  const hasCtas = Boolean(primaryCta || secondaryCta);

  return (
    <header className="bg-brand-warm">
      <div className={hasImage ? "flex flex-col-reverse lg:grid lg:grid-cols-2 split-hero" : "flex flex-col"}>
        {/* Left: text */}
        <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 md:py-20 order-2 lg:order-1">
          <div className="w-full max-w-xl">
          {eyebrow?.trim() ? (
            <p className="text-xs text-foreground/60 font-light tracking-wide mb-4">{eyebrow}</p>
          ) : null}
          {title?.trim() ? (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
              {title}
            </h1>
          ) : null}
          {description ? (
            <div className="text-base text-foreground/70 font-light leading-relaxed max-w-md mb-8 space-y-4">
              {typeof description === "string"
                ? description
                    .split(/\n\s*\n/)
                    .map((part) => part.trim())
                    .filter(Boolean)
                    .map((part, i) => <p key={i}>{part}</p>)
                : description}
            </div>
          ) : null}
          {hasCtas ? (
            <div className="flex flex-col md:flex-row gap-3">
              {primaryCta ? (
                primaryCta.variant === "contact" ? (
                  <Button
                    variant="contact-outline"
                    size="lg"
                    onClick={() => navigate(primaryCta.to)}
                  >
                    <Phone strokeWidth={1.5} aria-hidden="true" />
                    {primaryCta.label}
                  </Button>
                ) : (
                  <Button variant="cta" size="lg" onClick={() => navigate(primaryCta.to)}>
                    {primaryCta.label}
                  </Button>
                )
              ) : null}
              {secondaryCta ? (
                <Button
                  variant="contact-outline"
                  size="lg"
                  onClick={() => navigate(secondaryCta.to)}
                >
                  {secondaryCta.icon === "mapPin" ? (
                    <MapPin strokeWidth={1.5} aria-hidden="true" />
                  ) : secondaryCta.icon === "phone" ? (
                    <Phone strokeWidth={1.5} aria-hidden="true" />
                  ) : null}
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          ) : null}
          {note ? (
            <p className="mt-4 md:mt-6 text-xs text-brand-dark/60 font-light max-w-md leading-relaxed">
              {note}
            </p>
          ) : null}
          </div>
        </div>

        {/* Right: image */}
        {hasImage ? (
          <SplitHeroMedia
            src={imageSrc}
            alt={imageAlt || title || ""}
            hotspot={imageHotspot}
            className="split-media order-1 lg:order-2"
          />
        ) : null}
      </div>
      {hasText || hasImage ? (
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      ) : null}
    </header>
  );
};
