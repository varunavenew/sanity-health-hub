"use client";

import { AssetImg } from "@/components/AssetImg";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";
import {
  INTERACTIVE_EMBED,
  toExternalVideoEmbedUrl,
} from "@/lib/video/to-embed-url";
import { Play } from "lucide-react";
import { useCallback, useRef, useState, type CSSProperties } from "react";

type CmsMediaProps = {
  media: ResolvedCmsMedia;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
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
 * Renders resolved CMS media.
 * Image → AssetImg; uploaded/direct video → <video>; YouTube/Vimeo → iframe.
 *
 * Hero default: muted autoplay + loop. Images are unchanged.
 * All hero surfaces should use this component so behaviour stays shared.
 */
export function CmsMedia({
  media,
  alt,
  className = "",
  style,
  loading = "lazy",
  autoPlay = true,
  interactive = false,
}: CmsMediaProps) {
  if (media.kind === "image" && media.src) {
    return (
      <AssetImg
        src={media.src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
      />
    );
  }

  if (media.kind === "video" && media.src) {
    return (
      <CmsFileVideo
        src={media.src}
        poster={media.poster}
        alt={alt}
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
        autoPlay={autoPlay}
        interactive={interactive}
      />
    );
  }

  return null;
}

function CmsFileVideo({
  src,
  poster,
  alt,
  className,
  style,
  autoPlay,
  interactive,
}: {
  src: string;
  poster?: string;
  alt: string;
  className: string;
  style?: CSSProperties;
  autoPlay: boolean;
  interactive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);

  const openWithSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.controls = true;
    el.loop = false;
    void el.play().catch(() => {
      /* gesture unlocks controls even if unmuted play is blocked briefly */
    });
    setExpanded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay && !expanded}
        muted={autoPlay && !expanded}
        loop={autoPlay && !expanded}
        playsInline
        preload="metadata"
        controls={expanded || !autoPlay}
        aria-label={alt || "Video"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {interactive && autoPlay && !expanded ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openWithSound();
          }}
          className="absolute inset-0 z-[1] flex items-center justify-center bg-transparent border-0 cursor-pointer group"
          aria-label={alt ? `Play video: ${alt}` : "Play video with sound"}
        >
          <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <Play className="w-6 h-6 text-brand-dark ml-0.5" fill="currentColor" />
          </span>
        </button>
      ) : null}
    </div>
  );
}

function CmsEmbedVideo({
  externalUrl,
  poster,
  alt,
  className,
  style,
  autoPlay,
  interactive,
}: {
  externalUrl: string;
  poster?: string;
  alt: string;
  className: string;
  style?: CSSProperties;
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
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {poster && !interactiveMode ? (
        <AssetImg
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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

