/**
 * Compute "Relaterte tjenester" — siblings of the current page within the
 * same navigation group. Used to help readers jump between adjacent
 * services without going back to the menu.
 *
 * Rules (based on canonical path):
 * - Sub-page under a main fagområde (gynekologi/fertilitet/urologi/ortopedi/graviditet):
 *   siblings = other sub-pages under the same fagområde.
 * - Standalone fagområde under "Flere tjenester" (e.g. revmatologi, gastrokirurgi
 *   landing, hudbehandlinger landing): siblings = other standalone Flere tjenester
 *   landings.
 * - Method page under gastrokirurgi: siblings = other gastro methods.
 * - Method page under hudbehandlinger: siblings = other hudbehandlinger methods.
 *
 * Never returns the current page (no self-links). Only links to pages with
 * concrete data in treatmentContent (no dead links).
 */

import { treatmentContent, type TreatmentData } from "@/data/treatmentContent";
import { getServiceImageFromHref } from "@/data/serviceImages";

export interface SiblingItem {
  title: string;
  desc: string;
  href: string;
  image?: string;
}

const summarize = (text: string, maxChars = 160): string => {
  const cleaned = (text.split("\n").find((l) => l.trim().length > 0) ?? text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .trim();
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars);
  const lastDot = cut.lastIndexOf(". ");
  return lastDot > 60 ? cut.slice(0, lastDot + 1) : cut.trim() + "…";
};

const MAIN_CATEGORIES = new Set(["gynekologi", "fertilitet", "urologi", "ortopedi", "graviditet"]);

// Standalone fagområde-landings under "Flere tjenester".
// href = canonical URL the user visits, key = treatmentContent key.
const FLERE_TJENESTER_LANDINGS: { href: string; key: string }[] = [
  { href: "/behandlinger/flere-fagomrader/revmatologi", key: "flere-fagomrader/revmatologi" },
  { href: "/behandlinger/flere-fagomrader/endokrinologi", key: "flere-fagomrader/endokrinologi" },
  { href: "/behandlinger/flere-fagomrader/plastikkirurgi", key: "flere-fagomrader/plastikkirurgi" },
  { href: "/behandlinger/flere-fagomrader/osteopati", key: "flere-fagomrader/osteopati" },
  { href: "/behandlinger/flere-fagomrader/sexologi", key: "flere-fagomrader/sexologi" },
  { href: "/behandlinger/flere-fagomrader/psykologi", key: "flere-fagomrader/psykologi" },
  { href: "/behandlinger/flere-fagomrader/ernaringsfysiolog", key: "flere-fagomrader/ernaringsfysiolog" },
  { href: "/behandlinger/flere-fagomrader/areknuter", key: "flere-fagomrader/areknuter" },
  { href: "/behandlinger/flere-fagomrader/gastrokirurgi", key: "flere-fagomrader/gastrokirurgi" },
  { href: "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger", key: "flere-fagomrader/hudbehandlinger" },
];

const GASTRO_METHODS: { href: string; key: string }[] = [
  { href: "/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi", key: "flere-fagomrader/overvektskirurgi" },
  { href: "/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon", key: "flere-fagomrader/gastrokirurgi/brokkoperasjon" },
  { href: "/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager", key: "flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager" },
];

const HUDBEHANDLINGER_METHODS: { href: string; key: string }[] = [
  "pigmentforandringer-og-solskader",
  "rodhet-og-synlige-blodkar",
  "forbedring-av-hudstruktur",
  "kosmetisk-dermatologi",
  "elastisitet-og-volum",
  "foflekksjekk",
].map((slug) => ({
  href: `/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/${slug}`,
  key: `flere-fagomrader/hudbehandlinger/${slug}`,
}));

const toItem = (href: string, data: TreatmentData): SiblingItem => ({
  title: data.title,
  desc: summarize(data.description, 160),
  href,
  image: getServiceImageFromHref(href),
});

const buildFromList = (
  list: { href: string; key: string }[],
  currentCanonical: string,
): SiblingItem[] =>
  list
    .filter((l) => l.href !== currentCanonical)
    .map((l) => {
      const data = treatmentContent[l.key];
      if (!data) return null;
      return toItem(l.href, data);
    })
    .filter((x): x is SiblingItem => x !== null);

/**
 * Compute siblings for the given canonical path. Returns [] when the page
 * has no defined sibling group (in which case the section is hidden).
 */
export function computeSiblingServices(canonical: string): SiblingItem[] {
  // Strip trailing slash.
  const path = canonical.replace(/\/+$/, "");

  // Hudbehandlinger methods.
  if (path.startsWith("/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/")) {
    return buildFromList(HUDBEHANDLINGER_METHODS, path);
  }

  // Hudbehandlinger landing itself → treat as Flere tjenester landing.
  if (path === "/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger") {
    return buildFromList(FLERE_TJENESTER_LANDINGS, path);
  }

  // Gastrokirurgi method pages.
  if (path.startsWith("/behandlinger/flere-fagomrader/gastrokirurgi/")) {
    return buildFromList(GASTRO_METHODS, path);
  }

  // Standalone Flere tjenester landing.
  const flereMatch = path.match(/^\/behandlinger\/flere-fagomrader\/([^/]+)$/);
  if (flereMatch) {
    // Only treat as a landing if the slug is in our curated list — otherwise
    // we don't know what group it belongs to and we hide the section.
    const isLanding = FLERE_TJENESTER_LANDINGS.some((l) => l.href === path);
    if (isLanding) return buildFromList(FLERE_TJENESTER_LANDINGS, path);
    return [];
  }

  // Main category sub-page.
  const subMatch = path.match(/^\/behandlinger\/([^/]+)\/([^/]+)$/);
  if (subMatch) {
    const [, cat] = subMatch;
    if (!MAIN_CATEGORIES.has(cat)) return [];
    const prefix = `${cat}/`;
    const items: SiblingItem[] = [];
    for (const [key, data] of Object.entries(treatmentContent)) {
      if (!key.startsWith(prefix)) continue;
      const sub = key.slice(prefix.length);
      // Skip nested keys (no second slash).
      if (sub.includes("/")) continue;
      const href = `/behandlinger/${cat}/${sub}`;
      if (href === path) continue;
      items.push(toItem(href, data));
    }
    return items;
  }

  return [];
}
