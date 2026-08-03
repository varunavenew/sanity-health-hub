/**
 * Sanity image hotspot / crop → CSS object-position.
 *
 * Sanity stores hotspot as normalized center + width/height (0–1).
 * CSS object-position uses percentages of the element's box.
 */

export type SanityHotspot = {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityCrop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type MediaFocalPoint = {
  /** 0–1, horizontal center of interest */
  x: number;
  /** 0–1, vertical center of interest */
  y: number;
};

/** Clamp 0–1; treat invalid as null. */
export function normalizeFocalPoint(
  hotspot: SanityHotspot | MediaFocalPoint | null | undefined,
): MediaFocalPoint | null {
  if (!hotspot || typeof hotspot !== "object") return null;
  const x = typeof hotspot.x === "number" ? hotspot.x : NaN;
  const y = typeof hotspot.y === "number" ? hotspot.y : NaN;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return {
    x: Math.min(1, Math.max(0, x)),
    y: Math.min(1, Math.max(0, y)),
  };
}

/** CSS `object-position` / `background-position` from a focal point. */
export function focalPointToObjectPosition(
  focal: MediaFocalPoint | null | undefined,
  fallback = "50% 50%",
): string {
  if (!focal) return fallback;
  const x = Math.round(focal.x * 1000) / 10;
  const y = Math.round(focal.y * 1000) / 10;
  return `${x}% ${y}%`;
}

/** Inline style fragment for media elements. */
export function focalPointStyle(
  focal: MediaFocalPoint | null | undefined,
  fallback?: string,
): { objectPosition: string; ["--media-focal"]?: string } {
  const position = focalPointToObjectPosition(focal, fallback ?? "50% 50%");
  return {
    objectPosition: position,
    "--media-focal": position,
  };
}

/**
 * Prefer explicit CSS objectPosition, then Sanity hotspot, then variant fallback.
 */
export function resolveObjectPosition(options: {
  objectPosition?: string | null;
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  fallback?: string;
}): string {
  const explicit = options.objectPosition?.trim();
  if (explicit) return explicit;
  return focalPointToObjectPosition(
    normalizeFocalPoint(options.hotspot),
    options.fallback ?? "50% 50%",
  );
}
