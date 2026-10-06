/** Shared UI copy for specialist profile pages — sourced from `specialistsListingPage.profileUi`. */
export type SpecialistProfileUi = {
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

const DEFAULT_PROFILE_UI: Record<"no" | "en", SpecialistProfileUi> = {
  no: {
    notFoundTitle: "Spesialist ikke funnet",
    notFoundBackLabel: "Gå tilbake",
    breadcrumbHomeLabel: "Hjem",
    breadcrumbSpecialistsLabel: "Spesialister",
    bookingCtaLabel: "Bestill time hos {firstName}",
    bookingSectionTitle: "Bestill time hos {firstName}",
    bookingSectionDescription:
      "Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.",
    heroCallUsLabel: "Ring oss",
    bioSectionTitle: "Om {firstName}",
    reviewsSectionTitle: "Hva pasientene sier",
    featuredServiceCtaLabel: "Se hele tjenesten",
    bookingLoadingLabel: "Henter tjenester…",
    bookingEmptyMessage:
      "Ingen bookbare tjenester er tilgjengelig akkurat nå. Prøv booking-siden for full oversikt.",
    bookingViewAllLabel: "Se alle tjenester og priser",
    anonymousReviewLabel: "Anonym",
  },
  en: {
    notFoundTitle: "Specialist not found",
    notFoundBackLabel: "Go back",
    breadcrumbHomeLabel: "Home",
    breadcrumbSpecialistsLabel: "Specialists",
    bookingCtaLabel: "Book an appointment with {firstName}",
    bookingSectionTitle: "Book an appointment with {firstName}",
    bookingSectionDescription:
      "Choose a service and find a time that suits you. No referral needed.",
    heroCallUsLabel: "Call us",
    bioSectionTitle: "About {firstName}",
    reviewsSectionTitle: "What patients say",
    featuredServiceCtaLabel: "View full service",
    bookingLoadingLabel: "Loading services…",
    bookingEmptyMessage:
      "No bookable services are available right now. Try the booking page for the full overview.",
    bookingViewAllLabel: "See all services and prices",
    anonymousReviewLabel: "Anonymous",
  },
};

export function defaultSpecialistProfileUi(lang: "no" | "en" = "no"): SpecialistProfileUi {
  return DEFAULT_PROFILE_UI[lang];
}

const PROFILE_UI_KEYS: (keyof SpecialistProfileUi)[] = [
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
  lang: "no" | "en" = "no",
): SpecialistProfileUi {
  const defaults = defaultSpecialistProfileUi(lang);
  if (!raw) return defaults;
  const parsed = Object.fromEntries(
    PROFILE_UI_KEYS.map((key) => [
      key,
      typeof raw[key] === "string" && raw[key]!.trim() ? raw[key]!.trim() : defaults[key],
    ]),
  ) as SpecialistProfileUi;
  return parsed;
}
