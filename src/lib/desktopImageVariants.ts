import hudstruktur from "@/assets/hudhelse/hudstruktur.png.asset.json";
import hudstrukturDesktop from "@/assets/hudhelse/hudstruktur-desktop.png.asset.json";
import foflekksjekk from "@/assets/hudhelse/foflekksjekk.png.asset.json";
import foflekksjekkDesktop from "@/assets/hudhelse/foflekksjekk-desktop.png.asset.json";
import rodhetBlodkar from "@/assets/hudhelse/rodhet-blodkar.png.asset.json";
import rodhetBlodkarDesktop from "@/assets/hudhelse/rodhet-blodkar-desktop.png.asset.json";
import overvektskirurgi from "@/assets/gastro/overvektskirurgi.png.asset.json";
import overvektskirurgiDesktop from "@/assets/gastro/overvektskirurgi-desktop.png.asset.json";
import elastisitetVolum from "@/assets/hudhelse/elastisitet-volum.png.asset.json";
import elastisitetVolumDesktop from "@/assets/hudhelse/elastisitet-volum-desktop.png.asset.json";
import pigmentSolskader from "@/assets/hudhelse/pigment-solskader.png.asset.json";
import pigmentSolskaderDesktop from "@/assets/hudhelse/pigment-solskader-desktop.png.asset.json";
import kosmetiskDermatologi from "@/assets/hudhelse/kosmetisk-dermatologi.png.asset.json";
import kosmetiskDermatologiDesktop from "@/assets/hudhelse/kosmetisk-dermatologi-desktop.png.asset.json";
import hemorroider from "@/assets/gastro/hemoroider-rektocele.png.asset.json";
import hemorroiderDesktop from "@/assets/gastro/hemoroider-rektocele-desktop.png.asset.json";
import fodselsskader from "@/assets/gynekologi/fodselsskader.jpg.asset.json";
import fodselsskaderDesktop from "@/assets/gynekologi/fodselsskader-desktop.jpg.asset.json";
import brokkoperasjon from "@/assets/gastro/brokkoperasjon.png.asset.json";
import brokkoperasjonDesktop from "@/assets/gastro/brokkoperasjon-desktop.png.asset.json";

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
  [rodhetBlodkar.url]: rodhetBlodkarDesktop.url,
  [brokkoperasjon.url]: brokkoperasjonDesktop.url,
  [overvektskirurgi.url]: overvektskirurgiDesktop.url,
  [elastisitetVolum.url]: elastisitetVolumDesktop.url,
  [pigmentSolskader.url]: pigmentSolskaderDesktop.url,
  [kosmetiskDermatologi.url]: kosmetiskDermatologiDesktop.url,
  [hemorroider.url]: hemorroiderDesktop.url,
  [fodselsskader.url]: fodselsskaderDesktop.url,
};

/** Wide (1920) version of an image, when one has been delivered. */
export function getDesktopVariant(url?: string): string | undefined {
  if (!url) return undefined;
  return DESKTOP_VARIANTS[url];
}
