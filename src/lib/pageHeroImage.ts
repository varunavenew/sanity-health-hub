import { getServiceImageFromHref, resolveTreatmentImage } from "@/data/serviceImages";
import { treatmentContent } from "@/data/treatmentContent";

/**
 * COVER = HERO — single lookup shared by every card and every page hero.
 *
 * Route paths and `treatmentContent` keys do not always match 1:1: a page can
 * live under an extra grouping segment (e.g. the route
 * `/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/foflekksjekk` is
 * stored as `flere-fagomrader/hudbehandlinger/foflekksjekk`). Card components
 * that only tried the literal path therefore missed the page's own heroImage
 * and fell back to the category hero.
 *
 * `contentKeyForPath` walks every suffix of the route until it finds the
 * matching content entry, so cards and pages always resolve the same asset.
 */
export function contentKeyForPath(path: string): string | undefined {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "").replace(/^\/+/, "");
  const key = clean.replace(/^behandlinger\//, "");
  if (!key) return undefined;
  const parts = key.split("/");
  if (treatmentContent[key]) return key;
  // Drop intermediate grouping segments, keeping category + tail.
  for (let start = 1; start < parts.length; start++) {
    const candidate = [parts[0], ...parts.slice(start)].join("/");
    if (treatmentContent[candidate]) return candidate;
  }
  return undefined;
}

/** The exact image used as hero on the page a card links to. */
export function resolveHrefHeroImage(path: string): string | undefined {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "").replace(/^\/+/, "");
  const key = clean.replace(/^behandlinger\//, "");
  const parts = key.split("/").filter(Boolean);
  if (parts.length === 0) return undefined;
  const categoryId = parts[0];
  const subId = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const contentKey = contentKeyForPath(path);
  const heroImage = contentKey ? treatmentContent[contentKey]?.heroImage : undefined;
  return (
    resolveTreatmentImage(categoryId, subId, heroImage) ??
    getServiceImageFromHref(`/${clean}`)
  );
}
