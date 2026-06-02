import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureSpotlightProps {
  eyebrow?: string;
  title: string;
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
 * Flexible spotlight section for fagområde pages — heading, media (image or
 * video), short text and a link. Intended to host editable content like a
 * patient story, news teaser or any single highlighted message between the
 * reviews and specialists scroller.
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
    <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-sm bg-secondary/40">
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
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] text-foreground mb-6">
        {title}
      </h2>
      <p className="text-base font-light text-muted-foreground leading-relaxed mb-8 max-w-md">
        {text}
      </p>
      <Link
        to={ctaHref}
        className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
      >
        {ctaLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );

  return (
    <section className="bg-brand-light py-20 md:py-28">
      <div className="page-shell">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-stretch">
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
      </div>
    </section>
  );
};
