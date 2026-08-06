"use client";

import {
  focalPointStyle,
  normalizeFocalPoint,
  resolveObjectPosition,
  type MediaFocalPoint,
  type SanityHotspot,
} from "@/lib/media/focal-point";
import {
  mergeMediaClassName,
  mediaVariantFallbackPosition,
  type MediaVariant,
} from "@/lib/media/variants";
import { Play } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type VideoHTMLAttributes,
} from "react";
import { AssetImg } from "@/components/AssetImg";
import { optimizeSanityImageUrl } from "@/lib/sanity/image-url";

export type ResponsiveVideoProps = {
  src: string;
  poster?: string;
  alt?: string;
  variant?: MediaVariant;
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  objectPosition?: string;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  interactive?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: VideoHTMLAttributes<HTMLVideoElement>["preload"];
};

/**
 * File-based video with the same framing rules as ResponsiveImage.
 * object-position is applied to the <video> element (not only the wrapper).
 */
export function ResponsiveVideo({
  src,
  poster,
  alt = "",
  variant = "hero",
  hotspot,
  objectPosition,
  className = "",
  style,
  autoPlay = true,
  interactive = true,
  muted,
  loop,
  playsInline = true,
  controls,
  preload = "metadata",
}: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);

  const fallback = mediaVariantFallbackPosition(variant);
  const position = resolveObjectPosition({
    objectPosition,
    hotspot: normalizeFocalPoint(hotspot) ?? hotspot,
    fallback,
  });
  const focal = focalPointStyle(normalizeFocalPoint(hotspot), position);

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

  const isAuto = autoPlay && !expanded;
  const mediaClass = mergeMediaClassName(
    variant,
    "absolute inset-0 h-full w-full",
  );
  const posterUrl = poster
    ? optimizeSanityImageUrl(poster, { width: 1920, quality: 78 })
    : undefined;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        ["--media-focal" as string]: focal["--media-focal"] ?? position,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        autoPlay={isAuto}
        muted={muted ?? isAuto}
        loop={loop ?? isAuto}
        playsInline={playsInline}
        preload={preload}
        controls={controls ?? (expanded || !autoPlay)}
        aria-label={alt || "Video"}
        className={mediaClass}
        style={{ objectPosition: position }}
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

/** Poster still using the same focal rules (e.g. embed placeholder). */
export function ResponsiveVideoPoster({
  src,
  alt = "",
  variant = "hero",
  hotspot,
  objectPosition,
  className,
}: {
  src: string;
  alt?: string;
  variant?: MediaVariant;
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  objectPosition?: string;
  className?: string;
}) {
  const fallback = mediaVariantFallbackPosition(variant);
  const position = resolveObjectPosition({
    objectPosition,
    hotspot: normalizeFocalPoint(hotspot) ?? hotspot,
    fallback,
  });

  return (
    <AssetImg
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={mergeMediaClassName(
        variant,
        className || "absolute inset-0 h-full w-full pointer-events-none",
      )}
      style={{ objectPosition: position }}
    />
  );
}
