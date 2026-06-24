/**
 * Returns the warm, personal CTA heading used in the mid-page conversion
 * band on SubTreatmentLayout pages. Pattern: "Snakk med en av våre …"
 * (or "Snakk med svangerskapsteamet vårt" for graviditet).
 *
 * Never mention the specific condition — keeps sensitive topics
 * (e.g. spontanabort) from feeling brutal.
 *
 * Derived from the canonical URL so every sub-page / standalone
 * fagområde-side gets the right specialist plural automatically.
 */
export const getConversationCtaTitle = (canonical: string): string => {
  const path = canonical.toLowerCase();

  // Flere-fagomrader: discriminate by leaf slug first (most specific).
  if (path.startsWith("/behandlinger/flere-fagomrader/")) {
    if (path.includes("/gastrokirurgi")) return "Snakk med en av våre gastrokirurger";
    if (path.includes("/hudhelse") || path.includes("/hudbehandlinger")) return "Snakk med en av våre hudleger";
    if (path.includes("/robotassistert-kirurgi")) return "Snakk med en av våre kirurger";
    if (path.includes("/revmatologi")) return "Snakk med en av våre revmatologer";
    if (path.includes("/endokrinologi")) return "Snakk med en av våre endokrinologer";
    if (path.includes("/psykologi")) return "Snakk med en av våre psykologer";
    if (path.includes("/sexologi")) return "Snakk med en av våre sexologer";
    if (path.includes("/osteopati")) return "Snakk med en av våre osteopater";
    if (path.includes("/plastikkirurgi")) return "Snakk med en av våre plastikkirurger";
    if (path.includes("/ernaringsfysiolog") || path.includes("/ernaeringsfysiolog")) {
      return "Snakk med en av våre ernæringsfysiologer";
    }
    if (path.includes("/areknut")) return "Snakk med en av våre karkirurger";
    return "Snakk med en av våre spesialister";
  }

  if (path.startsWith("/behandlinger/graviditet") || path.startsWith("/graviditet")) {
    return "Snakk med svangerskapsteamet vårt";
  }
  if (path.startsWith("/behandlinger/gynekologi") || path.startsWith("/gynekologi")) {
    return "Snakk med en av våre gynekologer";
  }
  if (path.startsWith("/behandlinger/fertilitet") || path.startsWith("/fertilitet")) {
    return "Snakk med en av våre fertilitetsspesialister";
  }
  if (path.startsWith("/behandlinger/urologi") || path.startsWith("/urologi")) {
    return "Snakk med en av våre urologer";
  }
  if (path.startsWith("/behandlinger/ortopedi") || path.startsWith("/ortopedi")) {
    return "Snakk med en av våre ortopeder";
  }

  if (path.includes("/robotassistert-kirurgi")) return "Snakk med en av våre kirurger";

  return "Snakk med en av våre spesialister";
};
