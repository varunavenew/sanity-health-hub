/**
 * Hero photo step-down (specialist / split / article heroes).
 *
 * `index.css` shrinks the photo frame at viewport widths 2000 / 2300 / 2650 /
 * 3000px — what a 1920px screen reaches at roughly 90 / 80 / 70 / 60% browser
 * zoom. Smaller screens never reach those widths when zoomed out, so the zoom
 * level is mapped onto the same 1920px reference and the larger step wins.
 * Keep HERO_STEP_MIN_WIDTHS in sync with the media queries in index.css.
 */
export const HERO_STEP_MIN_WIDTHS = [2000, 2300, 2650, 3000] as const;

export const HERO_ZOOM_REFERENCE_WIDTH = 1920;

/** Below this zoom estimate the page is treated as zoomed out. */
const ZOOMED_OUT_BELOW = 0.95;

export type HeroZoomStep = 0 | 1 | 2 | 3 | 4;

export function heroStepForWidth(width: number): HeroZoomStep {
  let step = 0;
  for (const min of HERO_STEP_MIN_WIDTHS) {
    if (width >= min) step += 1;
  }
  return step as HeroZoomStep;
}

/**
 * Page zoom from window metrics. `outerWidth` ignores page zoom in Chromium and
 * Safari while `innerWidth` (CSS px) grows when zooming out. Docked devtools
 * only shrink `innerWidth`, which reads as zoom-in and is ignored here.
 * Returns null when it cannot be estimated (e.g. Firefox reports ~1).
 */
export function estimatePageZoom(outerWidth: number, innerWidth: number): number | null {
  if (!(outerWidth > 0) || !(innerWidth > 0)) return null;
  const zoom = outerWidth / innerWidth;
  return Number.isFinite(zoom) ? zoom : null;
}

export function resolveHeroZoomStep(metrics: {
  innerWidth: number;
  outerWidth: number;
}): HeroZoomStep {
  const byWidth = heroStepForWidth(metrics.innerWidth);
  const zoom = estimatePageZoom(metrics.outerWidth, metrics.innerWidth);
  if (zoom == null || zoom >= ZOOMED_OUT_BELOW) return byWidth;
  const byZoom = heroStepForWidth(HERO_ZOOM_REFERENCE_WIDTH / zoom);
  return Math.max(byWidth, byZoom) as HeroZoomStep;
}
