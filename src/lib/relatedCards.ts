import { getServiceImageFromHref, resolveTreatmentImage } from "@/data/serviceImages";
import { treatmentContent } from "@/data/treatmentContent";

/**
 * COVER = HERO: a card must show the exact same image as the hero of the page
 * it links to. The target page's own `heroImage` therefore wins over the
 * generic service-image lookup.
 */
const getTargetHeroImage = (path: string): string | undefined => {
  const key = path.replace(/^\/behandlinger\//, "");
  const [categoryId, subId] = key.split("/");
  if (!categoryId) return undefined;
  return resolveTreatmentImage(categoryId, subId, treatmentContent[key]?.heroImage);
};

export interface RelatedCardItem {
  title: string;
  desc: string;
  href: string;
  image?: string;
  /** Keep the supplied image instead of the target page hero (anchor/tab cards). */
  lockImage?: boolean;
}

/**
 * URLs that redirect elsewhere. Cards pointing at the source are treated as
 * pointing at the target — so they are deduped and self-filtered correctly.
 */
const REDIRECTS: Record<string, string> = {
  "/behandlinger/fertilitet/ivf": "/behandlinger/fertilitet/assistert-befruktning",
};

/** Titles that describe the same treatment under different names. */
const TITLE_CANONICAL: Record<string, string> = {
  ivf: "IVF — prøverørsbehandling",
  "ivf (prøverørsbehandling)": "IVF — prøverørsbehandling",
  "ivf - prøverørsbehandling": "IVF — prøverørsbehandling",
  "ivf – prøverørsbehandling": "IVF — prøverørsbehandling",
  "ivf — prøverørsbehandling": "IVF — prøverørsbehandling",
  "prøverørsbehandling": "IVF — prøverørsbehandling",
};

/** Path without hash/query/trailing slash, resolved through redirects. */
export const normalizeCardPath = (href: string): string => {
  const path = href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return REDIRECTS[path] ?? path;
};

/**
 * Global rules for every related/service card on the site:
 * 1. Never link a page to itself.
 * 2. Never show the same target twice (duplicates are merged).
 * 3. The card image is always the target page's own hero asset.
 * 4. Known duplicate treatment names are normalized to one canonical title.
 */
export function prepareRelatedCards<T extends RelatedCardItem>(
  items: T[] | undefined,
  currentPath?: string,
): T[] {
  if (!items || items.length === 0) return [];
  const current = currentPath ? normalizeCardPath(currentPath) : undefined;
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of items) {
    const hash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : "";
    const target = normalizeCardPath(item.href);
    const key = `${target}${hash}`;
    // Anchor links into the current page are legitimate; plain self-links are not.
    if (current && target === current && !hash) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      ...item,
      title: TITLE_CANONICAL[item.title.trim().toLowerCase()] ?? item.title,
      href: `${target}${hash}`,
      image: item.lockImage
        ? item.image
        : getTargetHeroImage(target) ?? getServiceImageFromHref(target) ?? item.image,
    });
  }

  return out;
}
