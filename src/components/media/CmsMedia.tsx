"use client";

import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import {
  ResponsiveVideo,
  ResponsiveVideoPoster,
} from "@/components/media/ResponsiveVideo";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";
import type { MediaFocalPoint, SanityHotspot } from "@/lib/media/focal-point";
import type { MediaVariant } from "@/lib/media/variants";
import {
  INTERACTIVE_EMBED,
  toExternalVideoEmbedUrl,
} from "@/lib/video/to-embed-url";
import { Play } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type CmsMediaProps = {
  media: ResolvedCmsMedia;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
  /**
   * Framing strategy. Default `hero`.
   * Use `profile` for specialist / portrait heroes (protects faces on ultrawide).
   */
  variant?: MediaVariant;
  /** Extra hotspot when media.hotspot is missing (legacy fields). */
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  /** Explicit CSS object-position overrides hotspot. */
  objectPosition?: string;
  /**
   * When true (default), muted autoplay + loop for heroes.
   * Set false for non-hero contexts that need a normal controlled player.
   */
  autoPlay?: boolean;
  /**
   * When true, show a play overlay. Click opens interactive playback
   * with sound (uploaded) or the normal YouTube/Vimeo player (embeds).
   * Default false — landing/hero videos autoplay muted with no controls.
   */
  interactive?: boolean;
};

/**
 * Renders resolved CMS media with shared responsive framing.
 * Image → ResponsiveImage; uploaded/direct video → ResponsiveVideo; embeds → iframe.
 *
 * All hero surfaces should use this (or ResponsiveHeroMedia) so behaviour stays shared.
 */
export function CmsMedia({
  media,
  alt,
  className = "",
  style,
  loading = "lazy",
  variant = "hero",
  hotspot,
  objectPosition,
  autoPlay = true,
  interactive = false,
}: CmsMediaProps) {
  const focal = hotspot ?? media.hotspot ?? null;

  if (media.kind === "image" && media.src) {
    return (
      <ResponsiveImage
        src={media.src}
        alt={alt}
        variant={variant}
        hotspot={focal}
        crop={media.crop}
        objectPosition={objectPosition}
        className={className}
        style={style}
        loading={loading}
      />
    );
  }

  if (media.kind === "video" && media.src) {
    return (
      <ResponsiveVideo
        src={media.src}
        poster={media.poster}
        alt={alt}
        variant={variant}
        hotspot={focal}
        objectPosition={objectPosition}
        className={className}
        style={style}
        autoPlay={autoPlay}
        interactive={interactive}
      />
    );
  }

  if (media.kind === "video" && media.externalUrl) {
    return (
      <CmsEmbedVideo
        externalUrl={media.externalUrl}
        poster={media.poster}
        alt={alt}
        className={className}
        style={style}
        variant={variant}
        hotspot={focal}
        objectPosition={objectPosition}
        autoPlay={autoPlay}
        interactive={interactive}
      />
    );
  }

  return null;
}

function CmsEmbedVideo({
  externalUrl,
  poster,
  alt,
  className,
  style,
  variant,
  hotspot,
  objectPosition,
  autoPlay,
  interactive,
}: {
  externalUrl: string;
  poster?: string;
  alt: string;
  className: string;
  style?: CSSProperties;
  variant: MediaVariant;
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  objectPosition?: string;
  autoPlay: boolean;
  interactive: boolean;
}) {
  const [interactiveMode, setInteractiveMode] = useState(false);

  const backgroundEmbed = toExternalVideoEmbedUrl(
    externalUrl,
    autoPlay
      ? {
          autoplay: true,
          mute: true,
          loop: true,
          controls: false,
          playsInline: true,
          rel: false,
        }
      : {
          autoplay: false,
          mute: false,
          loop: false,
          controls: true,
          playsInline: true,
          rel: false,
        },
  );

  const interactiveEmbed = toExternalVideoEmbedUrl(externalUrl, INTERACTIVE_EMBED);
  const embed = interactiveMode ? interactiveEmbed : backgroundEmbed;

  if (!embed) return null;

  return (
    <div className={cn("relative overflow-hidden h-full w-full", className)} style={style}>
      {poster && !interactiveMode ? (
        <ResponsiveVideoPoster
          src={poster}
          alt=""
          variant={variant}
          hotspot={hotspot}
          objectPosition={objectPosition}
        />
      ) : null}
      <iframe
        key={interactiveMode ? "interactive" : "background"}
        src={embed}
        title={alt || "Video"}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {interactive && autoPlay && !interactiveMode ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setInteractiveMode(true);
          }}
          className="absolute inset-0 z-[1] flex items-center justify-center bg-transparent border-0 cursor-pointer group"
          aria-label={alt ? `Open video: ${alt}` : "Open video player with sound"}
        >
          <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play className="w-6 h-6 text-brand-dark ml-0.5" fill="currentColor" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
