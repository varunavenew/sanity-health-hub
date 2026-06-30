/** Shared UI copy for specialist profile pages — sourced from `specialistsListingPage.profileUi`. */
export type SpecialistProfileUi = {
  loadingLabel: string;
  notFoundTitle: string;
  notFoundBackLabel: string;
  breadcrumbHomeLabel: string;
  breadcrumbSpecialistsLabel: string;
  bookingCtaLabel: string;
  bookingSectionTitle: string;
  bookingSectionDescription: string;
  heroCallUsLabel: string;
  bioSectionTitle: string;
  reviewsSectionTitle: string;
  featuredServiceCtaLabel: string;
  bookingLoadingLabel: string;
  bookingEmptyMessage: string;
  bookingViewAllLabel: string;
  anonymousReviewLabel: string;
};

export type SpecialistProfileUiVars = {
  firstName: string;
};

export function interpolateProfileUi(
  template: string,
  vars: SpecialistProfileUiVars,
): string {
  return template.replace(/\{firstName\}/g, vars.firstName);
}

export function withProfileUiNames(
  ui: SpecialistProfileUi,
  firstName: string,
): SpecialistProfileUi & SpecialistProfileUiVars {
  const vars = { firstName };
  return {
    ...ui,
    ...vars,
    bookingCtaLabel: interpolateProfileUi(ui.bookingCtaLabel, vars),
    bookingSectionTitle: interpolateProfileUi(ui.bookingSectionTitle, vars),
    bioSectionTitle: interpolateProfileUi(ui.bioSectionTitle, vars),
  };
}

const PROFILE_UI_KEYS: (keyof SpecialistProfileUi)[] = [
  "loadingLabel",
  "notFoundTitle",
  "notFoundBackLabel",
  "breadcrumbHomeLabel",
  "breadcrumbSpecialistsLabel",
  "bookingCtaLabel",
  "bookingSectionTitle",
  "bookingSectionDescription",
  "heroCallUsLabel",
  "bioSectionTitle",
  "reviewsSectionTitle",
  "featuredServiceCtaLabel",
  "bookingLoadingLabel",
  "bookingEmptyMessage",
  "bookingViewAllLabel",
  "anonymousReviewLabel",
];

export function parseSpecialistProfileUi(
  raw: Partial<SpecialistProfileUi> | null | undefined,
): SpecialistProfileUi | null {
  if (!raw) return null;
  const parsed = Object.fromEntries(
    PROFILE_UI_KEYS.map((key) => [key, typeof raw[key] === "string" ? raw[key]!.trim() : ""]),
  ) as SpecialistProfileUi;
  const complete = PROFILE_UI_KEYS.every((key) => Boolean(parsed[key]));
  return complete ? parsed : null;
}
