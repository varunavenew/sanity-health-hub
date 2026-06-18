import type { SlugLocaleMap } from "@/lib/routing/slug-locale-map";
import { lookupLocalizedPath } from "@/lib/routing/slug-locale-map";

/** Stable nav keys — keep in sync with Sanity `navId` options and `nav.*` i18n keys. */
export type NavRouteId =
  | "services"
  | "pricing"
  | "insurance"
  | "news"
  | "about"
  | "clinics"
  | "contact"
  | "specialists"
  | "bookAppointment";

export type NavLocale = "no" | "en";

/**
 * Fixed app routes that are not CMS singletons.
 * Booking slugs are overridden by Site Settings → CTA path when set in Sanity.
 */
export const FIXED_NAV_PATHS: Partial<Record<NavRouteId, { nb: string; en: string }>> = {
  bookAppointment: { nb: "/booking", en: "/book-appointment" },
};

/** Non-CMS marketing / design paths — locale switch fallback only. */
const MARKETING_NB_TO_EN: Record<string, string> = {
  "/gynekologi": "/gynecology",
  "/urologi": "/urology",
  "/fertilitet": "/fertility",
  "/ortopedi": "/orthopedics",
  "/graviditet": "/pregnancy",
  "/ovrige": "/other",
  "/flere-fagomrader": "/other",
  "/kvinnehelse": "/kvinnehelse",
  "/robotassistert-kirurgi": "/robotassistert-kirurgi",
  "/tverrfaglige-team": "/tverrfaglige-team",
  "/behandlinger/gynekologi": "/behandlinger/gynecology",
  "/behandlinger/fertilitet": "/behandlinger/fertility",
  "/behandlinger/urologi": "/behandlinger/urology",
  "/behandlinger/ortopedi": "/behandlinger/orthopedics",
  "/behandlinger/graviditet": "/behandlinger/pregnancy",
  "/behandlinger/ovrige": "/behandlinger/other",
  "/behandlinger/flere-fagomrader": "/behandlinger/other",
};

const MARKETING_EN_TO_NB: Record<string, string> = {};
for (const [nb, en] of Object.entries(MARKETING_NB_TO_EN)) {
  MARKETING_EN_TO_NB[en] = nb;
}

export function navPathForLocale(
  navId: NavRouteId,
  locale: NavLocale,
  cmsMap?: SlugLocaleMap,
): string {
  const cmsPaths = cmsMap?.navPaths[navId];
  if (cmsPaths) return cmsPaths[locale === "en" ? "en" : "nb"];

  const fixed = FIXED_NAV_PATHS[navId];
  if (fixed) return fixed[locale === "en" ? "en" : "nb"];
  return "";
}

/** Map an internal path to the locale-appropriate slug (preserves suffix after path). */
export function localizeInternalPath(
  path: string,
  locale: NavLocale,
  cmsMap?: SlugLocaleMap,
): string {
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const query = qIdx >= 0 ? withoutHash.slice(qIdx) : "";
  const base = (qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash).trim() || "/";

  if (base === "/") return path;

  const localized =
    lookupLocalizedPath(base, locale, cmsMap)
    ?? (locale === "en" ? MARKETING_NB_TO_EN[base] : MARKETING_EN_TO_NB[base])
    ?? base;

  return `${localized}${query}${hash}`;
}
