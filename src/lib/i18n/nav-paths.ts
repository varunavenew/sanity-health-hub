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

/** Norwegian + English internal paths (without locale prefix). */
export type NavLocale = "no" | "en";

export const NAV_ROUTE_PATHS: Record<NavRouteId, { nb: string; en: string }> = {
  services: { nb: "/tjenester", en: "/services" },
  pricing: { nb: "/priser", en: "/pricing" },
  insurance: { nb: "/forsikring", en: "/insurance" },
  news: { nb: "/aktuelt", en: "/news" },
  about: { nb: "/om-oss", en: "/about" },
  clinics: { nb: "/klinikker", en: "/clinics" },
  contact: { nb: "/kontakt", en: "/contact" },
  specialists: { nb: "/spesialister", en: "/specialists" },
  bookAppointment: { nb: "/booking", en: "/book-appointment" },
};

const NB_TO_EN_PATH: Record<string, string> = {};
const EN_TO_NB_PATH: Record<string, string> = {};
export const PATH_TO_NAV_ID: Record<string, NavRouteId> = {};

for (const id of Object.keys(NAV_ROUTE_PATHS) as NavRouteId[]) {
  const { nb, en } = NAV_ROUTE_PATHS[id];
  NB_TO_EN_PATH[nb] = en;
  EN_TO_NB_PATH[en] = nb;
  PATH_TO_NAV_ID[nb] = id;
  PATH_TO_NAV_ID[en] = id;
}

/** Marketing / category paths (not in main nav) — used as fallback when CMS EN link is empty */
const MARKETING_NB_TO_EN: Record<string, string> = {
  "/gynekologi": "/gynecology",
  "/urologi": "/urology",
  "/fertilitet": "/fertility",
  "/ortopedi": "/ortopedi",
  "/graviditet": "/graviditet",
  "/flere-fagomrader": "/flere-fagomrader",
  "/kvinnehelse": "/kvinnehelse",
  "/robotassistert-kirurgi": "/robotassistert-kirurgi",
  "/tverrfaglige-team": "/tverrfaglige-team",
  "/tjenester": "/services",
  "/behandlinger/gynekologi": "/behandlinger/gynekologi",
  "/behandlinger/fertilitet": "/behandlinger/fertilitet",
  "/behandlinger/urologi": "/behandlinger/urologi",
};

for (const [nb, en] of Object.entries(MARKETING_NB_TO_EN)) {
  if (!NB_TO_EN_PATH[nb]) NB_TO_EN_PATH[nb] = en;
  if (!EN_TO_NB_PATH[en]) EN_TO_NB_PATH[en] = nb;
}

export function navPathForLocale(navId: NavRouteId, locale: NavLocale): string {
  return NAV_ROUTE_PATHS[navId][locale === "en" ? "en" : "nb"];
}

/** Map an internal path to the locale-appropriate slug (preserves suffix after path). */
export function localizeInternalPath(path: string, locale: NavLocale): string {
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const query = qIdx >= 0 ? withoutHash.slice(qIdx) : "";
  const base = (qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash).trim() || "/";

  if (base === "/") return path;

  const map = locale === "en" ? NB_TO_EN_PATH : EN_TO_NB_PATH;
  const localized = map[base] ?? base;
  return `${localized}${query}${hash}`;
}
