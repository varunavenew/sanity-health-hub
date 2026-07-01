"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { useHomepage } from "@/hooks/useSanity";
import { assetSrc } from "@/lib/media";
import blurSkinMid from "@/assets/blur-skin-mid.jpg";

function formatStatDisplay(value: string): { main: string; suffix: string } {
  const trimmed = value.trim();
  const plusMatch = trimmed.match(/^(.+?)(\s*\+)\s*$/);
  if (plusMatch) {
    return {
      main: plusMatch[1].replace(/\s/g, "\u2009"),
      suffix: plusMatch[2].trim(),
    };
  }
  return { main: trimmed.replace(/\s/g, "\u2009"), suffix: "" };
}

/**
 * Pasienttillit-banner under hero: blur-skin tekstur, beige tekst,
 * stort tall venstre og underlinert lenke høyre.
 */
export const PatientTrustSection = () => {
  const { data: homepage } = useHomepage();
  const banner = homepage?.patientTrustBanner;

  if (!banner?.value && !banner?.label) return null;

  const stat = banner.value ? formatStatDisplay(banner.value) : null;
  const backgroundImage = banner.backgroundImage || assetSrc(blurSkinMid);

  return (
    <section className="py-10 md:py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-brand-terracotta bg-cover bg-center"
        aria-hidden="true"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            {stat ? (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-light leading-none tracking-tight text-brand-beige">
                  {stat.main}
                  {stat.suffix ? (
                    <span className="text-brand-beige/70 font-extralight ml-1">{stat.suffix}</span>
                  ) : null}
                </span>
              </div>
            ) : null}
            {banner.label ? (
              <p className="text-base md:text-lg font-light text-brand-beige leading-tight">
                {banner.label}
              </p>
            ) : null}
          </div>

          {banner.ctaText && banner.ctaLink ? (
            <div className="pb-1">
              <Link
                to={banner.ctaLink}
                className="group inline-flex items-center gap-3 text-sm font-light text-brand-beige border-b border-brand-beige/60 pb-2 hover:border-brand-beige transition-colors"
              >
                {banner.ctaText}
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
