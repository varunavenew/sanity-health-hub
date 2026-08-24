/** page_type values for virtual_page_view — fixed list from SEO brief. */
export type PageType =
  | "home"
  | "service"
  | "prices"
  | "clinic"
  | "specialist"
  | "article"
  | "insurance"
  | "contact"
  | "booking";

const STATIC_SEGMENTS = new Set([
  "om-oss",
  "about",
  "about-us",
  "karriere",
  "careers",
  "personvern",
  "privacy",
  "vilkar",
  "terms",
  "tilgjengelighet",
  "accessibility",
  "book-appointment",
]);

const PRICES = new Set(["priser", "prices"]);
const INSURANCE = new Set(["forsikring", "insurance"]);
const CONTACT = new Set(["kontakt", "contact"]);
const CLINICS = new Set(["klinikker", "clinics"]);
const SPECIALISTS = new Set(["spesialister", "specialists"]);
const ARTICLES = new Set(["artikler", "articles", "nyheter", "news"]);
const SERVICES = new Set(["behandlinger", "treatments", "tjenester", "services"]);

/** Resolve page_type from locale-stripped pathname (no query string). */
export function resolvePageType(pathnameWithoutLocale: string): PageType {
  const path = pathnameWithoutLocale.split("?")[0].replace(/\/+$/, "") || "/";
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/booking")) return "booking";

  const segments = path.split("/").filter(Boolean);
  const first = segments[0]?.toLowerCase() ?? "";

  if (PRICES.has(first)) return "prices";
  if (INSURANCE.has(first)) return "insurance";
  if (CONTACT.has(first)) return "contact";
  if (CLINICS.has(first)) return "clinic";
  if (SPECIALISTS.has(first)) return "specialist";
  if (ARTICLES.has(first)) return "article";
  if (SERVICES.has(first)) return "service";

  if (STATIC_SEGMENTS.has(first)) return "home";

  // Category / treatment landing pages (e.g. /gynekologi, /gynekologi/endometriose).
  if (segments.length >= 1) return "service";

  return "home";
}

/** Strip /no or /en prefix for page_type resolution. */
export function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "no" || parts[0] === "en") {
    const rest = parts.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}
