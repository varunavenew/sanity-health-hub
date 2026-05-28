import type { TFunction } from "i18next";

export type NavLinkLike = {
  label?: string;
  path?: string;
  navId?: string;
};

/** Map internal paths to `nav.*` i18n keys. */
const PATH_TO_NAV_ID: Record<string, string> = {
  "/tjenester": "services",
  "/priser": "pricing",
  "/forsikring": "insurance",
  "/aktuelt": "news",
  "/om-oss": "about",
  "/klinikker": "clinics",
  "/kontakt": "contact",
  "/spesialister": "specialists",
  "/booking": "bookAppointment",
};

function navIdForItem(item: NavLinkLike): string | undefined {
  if (item.navId?.trim()) return item.navId.trim();
  const path = item.path?.split("?")[0]?.split("#")[0];
  return path ? PATH_TO_NAV_ID[path] : undefined;
}

/**
 * Standard menu items use locale JSON (`nav.*`) so EN/NO switch instantly.
 * Custom CMS-only links (unknown path) use the Sanity label for the active locale.
 */
export function resolveNavLabel(item: NavLinkLike, t: TFunction): string {
  const id = navIdForItem(item);
  if (id) {
    const key = `nav.${id}`;
    const translated = t(key);
    if (translated !== key) return translated;
  }

  const cms = typeof item.label === "string" ? item.label.trim() : "";
  if (cms) return cms;

  return item.path || "";
}
