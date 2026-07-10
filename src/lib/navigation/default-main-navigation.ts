/** Default header nav when Sanity `siteSettings.mainNavigation` is empty. */
export const DEFAULT_MAIN_NAVIGATION = [
  { _key: "tjenester", navId: "services", isServicesDropdown: true },
  { _key: "priser", navId: "pricing" },
  { _key: "forsikring", navId: "insurance" },
  { _key: "aktuelt", navId: "news" },
  { _key: "om-oss", navId: "about" },
  { _key: "klinikker", navId: "clinics" },
  { _key: "kontakt", navId: "contact" },
] as const;

/** Shown in burger menu only (not in desktop header bar). */
export const BURGER_EXTRA_NAV_ITEMS = [{ _key: "spesialister", navId: "specialists" }] as const;

export type MainNavItemSeed = {
  _key?: string;
  label?: string;
  path?: string;
  navId?: string;
  isServicesDropdown?: boolean;
};

export function withRequiredMainNavigation(items: readonly MainNavItemSeed[]): MainNavItemSeed[] {
  const next = [...items];
  const hasClinics = next.some((item) => item.navId === "clinics" || item.path === "/klinikker" || item.path === "/clinics");
  if (!hasClinics) {
    const contactIndex = next.findIndex((item) => item.navId === "contact" || item.path === "/kontakt" || item.path === "/contact");
    const clinicsItem = { _key: "klinikker", navId: "clinics" };
    if (contactIndex >= 0) next.splice(contactIndex, 0, clinicsItem);
    else next.push(clinicsItem);
  }
  return next;
}
