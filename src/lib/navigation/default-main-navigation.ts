/** Default header nav when Sanity `siteSettings.mainNavigation` is empty. */
export const DEFAULT_MAIN_NAVIGATION = [
  { _key: "tjenester", navId: "services", isServicesDropdown: true },
  { _key: "priser", navId: "pricing" },
  { _key: "forsikring", navId: "insurance" },
  { _key: "aktuelt", navId: "news" },
  { _key: "om-oss", navId: "about" },
  { _key: "spesialister", navId: "specialists" },
  { _key: "klinikker", navId: "clinics" },
  { _key: "kontakt", navId: "contact" },
] as const;

export type MainNavItemSeed = {
  _key?: string;
  label?: string;
  path?: string;
  navId?: string;
  isServicesDropdown?: boolean;
};

function hasNavId(items: readonly MainNavItemSeed[], navId: string, paths: string[]) {
  return items.some(
    (item) => item.navId === navId || (item.path != null && paths.includes(item.path)),
  );
}

export function withRequiredMainNavigation(items: readonly MainNavItemSeed[]): MainNavItemSeed[] {
  const next = [...items];
  const hasClinics = hasNavId(next, "clinics", ["/klinikker", "/clinics"]);
  if (!hasClinics) {
    const contactIndex = next.findIndex(
      (item) => item.navId === "contact" || item.path === "/kontakt" || item.path === "/contact",
    );
    const clinicsItem = { _key: "klinikker", navId: "clinics" };
    if (contactIndex >= 0) next.splice(contactIndex, 0, clinicsItem);
    else next.push(clinicsItem);
  }

  const hasSpecialists = hasNavId(next, "specialists", ["/spesialister", "/specialists"]);
  if (!hasSpecialists) {
    const clinicsIndex = next.findIndex(
      (item) => item.navId === "clinics" || item.path === "/klinikker" || item.path === "/clinics",
    );
    const specialistsItem = { _key: "spesialister", navId: "specialists" };
    if (clinicsIndex >= 0) next.splice(clinicsIndex, 0, specialistsItem);
    else {
      const contactIndex = next.findIndex(
        (item) => item.navId === "contact" || item.path === "/kontakt" || item.path === "/contact",
      );
      if (contactIndex >= 0) next.splice(contactIndex, 0, specialistsItem);
      else next.push(specialistsItem);
    }
  }
  return next;
}
