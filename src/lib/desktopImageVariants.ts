import hudstruktur from "@/assets/hudhelse/hudstruktur.png.asset.json";
import hudstrukturDesktop from "@/assets/hudhelse/hudstruktur-desktop.png.asset.json";
import foflekksjekk from "@/assets/hudhelse/foflekksjekk.png.asset.json";
import foflekksjekkDesktop from "@/assets/hudhelse/foflekksjekk-desktop.png.asset.json";

/**
 * Customer delivers two crops per photo:
 *  - 1250x1080 → mobile + cards (the default `src` used everywhere)
 *  - 1920x1080 → desktop heroes / wide views
 *
 * Register the pair here; <SmartImage> then swaps to the wide crop from the
 * `lg` breakpoint (1024px) via <picture><source media>. Add new pairs as they
 * arrive — no call sites need to change.
 */
const DESKTOP_VARIANTS: Record<string, string> = {
  [hudstruktur.url]: hudstrukturDesktop.url,
  [foflekksjekk.url]: foflekksjekkDesktop.url,
};

/** Wide (1920) version of an image, when one has been delivered. */
export function getDesktopVariant(url?: string): string | undefined {
  if (!url) return undefined;
  return DESKTOP_VARIANTS[url];
}
