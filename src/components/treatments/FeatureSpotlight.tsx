import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureSpotlightProps {
  title: React.ReactNode;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  /** Image src — used when no video is provided. */
  image?: string;
  imageAlt?: string;
  /** Optional video src (mp4). Renders as autoplay, muted, looped, plays inline. */
  video?: string;
  /** Place media on the left instead of the right. */
  mediaLeft?: boolean;
}

/**
 * Edge-to-edge split-screen spotlight matching the site's flow-with-image
 * pattern from SubTreatmentLayout. One column hosts copy with generous
 * whitespace, the other a full-bleed image or video.
 */
export const FeatureSpotlight = ({
  title,
  text,
  ctaLabel,
  ctaHref,
  image,
  imageAlt = "",
  video,
  mediaLeft = false,
}: FeatureSpotlightProps) => {
  const media = (
    <div className="relative bg-secondary/40 h-full overflow-hidden">
      {video ? (
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : image ? (
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
    </div>
  );

  const copy = (
    <div className="px-6 md:px-12 lg:px-20 py-16 lg:py-24 flex flex-col justify-center">
      <div className="max-w-lg">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] text-foreground mb-8">
          {title}
        </h2>
        <p className="text-base font-light text-muted-foreground leading-relaxed mb-10">
          {text}
        </p>
        <Link
          to={ctaHref}
          className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 transition-all"
        >
          {ctaLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="bg-brand-light text-foreground">
      <div className="grid lg:grid-cols-2 items-stretch min-h-screen">
        {mediaLeft ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </section>
  );
};
