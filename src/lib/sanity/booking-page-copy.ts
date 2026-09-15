import type { BookingStep1CategoryClinicBadges } from "@/lib/sanity/booking-page-step1-clinics";

export type BookingPageCopy = {
  pageTitle: string;
  geoSummary?: string;
  closeAriaLabel: string;
  backLabel: string;
  stepProgressTemplate: string;
  stepLabelService: string;
  stepLabelClinic: string;
  stepLabelSpecialist: string;
  stepLabelTime: string;
  stepLabelConfirm: string;
  summaryServiceLabel: string;
  summaryClinicLabel: string;
  summarySpecialistLabel: string;
  supportPhone: string;
  supportPhoneLabel: string;
  /** Footer under every booking step. Use `{{phone}}` for the clickable number. */
  supportFooterText: string;
  step1Heading: string;
  step1HeadingFiltered: string;
  step1ShowAllServices: string;
  step1Loading: string;
  step1LoadingClinics: string;
  step1AllClinicsBadge: string;
  step1EmptyTitle: string;
  step1EmptyMessage: string;
  step1PriceFree: string;
  step1PriceFrom: string;
  step1LoadingDuration: string;
  step1CategoryClinicBadges: BookingStep1CategoryClinicBadges[];
  step2Heading: string;
  step2Loading: string;
  step2EmptyTitle: string;
  step2EmptyMessage: string;
  step2EmptyButtonLabel: string;
  step2EmptyPhone: string;
  /** CTA to continue booking with another service when clinics are empty. */
  step2EmptyBookLabel: string;
  step3Heading: string;
  step3Subtitle: string;
  step3Loading: string;
  step3FirstAvailableTitle: string;
  step3FirstAvailableSubtitle: string;
  step3EmptyNoCaregiversTitle: string;
  step3EmptyNoCaregiversMessage: string;
  step3EmptyFetchTitle: string;
  step3EmptyFetchMessage: string;
  step4Heading: string;
  step4SelectedDayLabel: string;
  step4NoDaysLabel: string;
  step4NoDaysTitle: string;
  step4NoDaysMessage: string;
  step4TodayLabel: string;
  step4PickTimeLabel: string;
  step4DurationPrefix: string;
  step4LoadingTimes: string;
  step4NotOnlineTitle: string;
  step4NotOnlineMessage: string;
  step4NoSlotsTitle: string;
  step4NoSlotsMessage: string;
  step5Heading: string;
  step5OrderTitle: string;
  step5LabelService: string;
  step5LabelPrice: string;
  step5LabelClinic: string;
  step5LabelDuration: string;
  step5LabelDate: string;
  step5LabelTime: string;
  step5PriceFree: string;
  step5PriceFrom: string;
  step5PriceNote: string;
  step5PersonalInfoTitle: string;
  step5SubmitLabel: string;
  step5SubmittingLabel: string;
  formFirstNameLabel: string;
  formFirstNamePlaceholder: string;
  formLastNameLabel: string;
  formLastNamePlaceholder: string;
  formBirthNumberLabel: string;
  formBirthNumberPlaceholder: string;
  formBirthNumberHelp: string;
  formPhoneLabel: string;
  formPhonePlaceholder: string;
  formPhoneHelp: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formEmailHelp: string;
  formNoteLabel: string;
  formNotePlaceholder: string;
  formCancellationRulesHeading: string;
  formCancellationRules: string;
  formTermsPageTeaser: string;
  formTermsLinkText: string;
  formTermsInlineLinkText: string;
  formTermsCheckbox: string;
  formPrivacyLinkText: string;
  formPrivacyCheckbox: string;
  formMarketingCheckbox: string;
  successTitle: string;
  successMessageSms: string;
  successMessageSmsEmail: string;
  successLabelTreatment: string;
  successLabelClinic: string;
  successClinicPrefix: string;
  successLabelDateTime: string;
  successLabelSpecialist: string;
  successBackHome: string;
  errorMissingData: string;
  errorActivityType: string;
  errorSubmit: string;
  errorSubmitNetwork: string;
  errorInvalidBirthNumber: string;
};

export const DEFAULT_BOOKING_PAGE_COPY: BookingPageCopy = {
  pageTitle: "Bestill time",
  closeAriaLabel: "Lukk bestilling og gå til forsiden",
  backLabel: "Tilbake",
  stepProgressTemplate: "Steg {{step}} av {{total}}",
  stepLabelService: "Tjeneste",
  stepLabelClinic: "Klinikk",
  stepLabelSpecialist: "Behandler",
  stepLabelTime: "Tid",
  stepLabelConfirm: "Bekreft",
  summaryServiceLabel: "Tjeneste:",
  summaryClinicLabel: "Klinikk:",
  summarySpecialistLabel: "Behandler:",
  supportPhone: "22 60 00 50",
  supportPhoneLabel: "Ring oss så hjelper vi deg",
  supportFooterText:
    "Hvis du opplever utfordringer med nettbestilling, er du velkommen til å ringe oss på {{phone}}.\nVi er tilgjengelige fra 08:00 – 20:00 alle hverdager.",
  step1Heading: "Velg tjeneste",
  step1HeadingFiltered: "Velg tjeneste innen {{category}}",
  step1ShowAllServices: "Vis alle tjenester",
  step1Loading: "Henter tjenester…",
  step1LoadingClinics: "Henter klinikker…",
  step1AllClinicsBadge: "Alle klinikker",
  step1EmptyTitle: "Kunne ikke laste tjenester",
  step1EmptyMessage:
    "Vi får ikke hentet tjenestelisten fra booking-systemet akkurat nå. Ring oss, så hjelper vi deg med å finne riktig time.",
  step1PriceFree: "Gratis",
  step1PriceFrom: "Fra kr {{price}},-",
  step1LoadingDuration: "Henter varighet…",
  step1CategoryClinicBadges: [],
  step2Heading: "Velg klinikk",
  step2Loading: "Henter klinikker fra booking-systemet…",
  step2EmptyTitle: "Denne tjenesten kan ikke bestilles online akkurat nå",
  step2EmptyMessage:
    "Denne spesifikke tjenesten er dessverre ikke tilgjengelig for nettbestilling for øyeblikket. Ring oss, eller bestill en annen time online.",
  step2EmptyButtonLabel: "Ring oss så hjelper vi deg",
  step2EmptyPhone: "22 60 00 50",
  step2EmptyBookLabel: "Bestill time",
  step3Heading: "Velg behandler",
  step3Subtitle: "Velg en behandler, eller gå videre for å se alle ledige tider.",
  step3Loading: "Henter behandlere fra booking-systemet…",
  step3FirstAvailableTitle: "Første ledige",
  step3FirstAvailableSubtitle: "Vis alle ledige tider uavhengig av behandler",
  step3EmptyNoCaregiversTitle: "Ingen behandlere med ledige tider",
  step3EmptyNoCaregiversMessage:
    "Vi finner ingen behandlere knyttet til ledige timer for denne tjenesten. Velg «Første ledige» eller ring oss for hjelp.",
  step3EmptyFetchTitle: "Kunne ikke hente behandlere",
  step3EmptyFetchMessage:
    "Booking-systemet svarte ikke med behandlerinformasjon. Velg «Første ledige» eller prøv igjen senere.",
  step4Heading: "Velg tid",
  step4SelectedDayLabel: "Valgt dag",
  step4NoDaysLabel: "Ingen ledige dager",
  step4NoDaysTitle: "Ingen ledige dager",
  step4NoDaysMessage:
    "Vi finner ingen ledige timer i kalenderen akkurat nå. Ring oss direkte – vi finner ofte en åpning som ikke ligger ute online.",
  step4TodayLabel: "I dag",
  step4PickTimeLabel: "Velg en tid",
  step4DurationPrefix: "Varighet",
  step4LoadingTimes: "Henter ledige tider…",
  step4NotOnlineTitle: "Online tider ikke tilgjengelig",
  step4NotOnlineMessage:
    "Denne tjenesten har ikke kobling til booking-systemet. Ring oss, så hjelper vi deg med å finne en time.",
  step4NoSlotsTitle: "Ingen ledige timer denne dagen",
  step4NoSlotsMessage:
    "Prøv en annen dag i kalenderen, eller gi oss en ringedirekte – vi finner ofte en åpning som ikke ligger ute online.",
  step5Heading: "Bekreft",
  step5OrderTitle: "Din bestilling",
  step5LabelService: "Tjeneste",
  step5LabelPrice: "Pris",
  step5LabelClinic: "Klinikk",
  step5LabelDuration: "Varighet",
  step5LabelDate: "Dato",
  step5LabelTime: "Tid",
  step5PriceFree: "Gratis",
  step5PriceFrom: "Fra {{price}} kr",
  step5PriceNote: "Prisen kan påvirkes av tid på døgnet, helg og eventuelle tillegg.",
  step5PersonalInfoTitle: "Dine opplysninger",
  step5SubmitLabel: "Bekreft bestilling",
  step5SubmittingLabel: "Sender bestilling…",
  formFirstNameLabel: "Fornavn *",
  formFirstNamePlaceholder: "Fornavn",
  formLastNameLabel: "Etternavn *",
  formLastNamePlaceholder: "Etternavn",
  formBirthNumberLabel: "Fødselsnummer (11 siffer) *",
  formBirthNumberPlaceholder: "DDMMÅÅXXXXX",
  formBirthNumberHelp:
    "* Fødselsnummeret er påkrevd for sikker identifisering og journalføring i henhold til helsepersonelloven. Opplysningene behandles konfidensielt og deles ikke med tredjepart.",
  formPhoneLabel: "Mobilnummer *",
  formPhonePlaceholder: "XXX XX XXX",
  formPhoneHelp: "Bekreftelse og påminnelse sendes på SMS til dette nummeret.",
  formEmailLabel: "E-postadresse",
  formEmailPlaceholder: "din@epost.no",
  formEmailHelp: "Valgfritt. Bekreftelse sendes også til e-post om oppgitt.",
  formNoteLabel: "Melding til klinikken",
  formNotePlaceholder: "Valgfritt — f.eks. spørsmål eller info vi bør vite",
  formCancellationRulesHeading: "Avbestillingsregler",
  formCancellationRules:
    "Om- eller avbestilling må skje senest 24 timer før avtalt tidspunkt. Ved manglende oppmøte eller sen avbestilling vil det påløpe et gebyr.",
  formTermsPageTeaser:
    "«{{termsLink}}» – les vilkårene for bestilling og behandling hos CMedical.",
  formTermsLinkText: "Vilkår",
  formTermsInlineLinkText: "vilkårene",
  formTermsCheckbox: "Jeg godtar {{termsLink}} for bestilling *",
  formPrivacyLinkText: "personvernerklæringen",
  formPrivacyCheckbox:
    "Jeg samtykker til at CMedical kan behandle innsendt informasjon i henhold til {{privacyLink}} *",
  formMarketingCheckbox: "Jeg ønsker å motta informasjon og nyheter fra CMedical",
  successTitle: "Bestilling bekreftet",
  successMessageSms: "Du vil motta en bekreftelse på SMS.",
  successMessageSmsEmail: "Du vil motta en bekreftelse på SMS og e-post.",
  successLabelTreatment: "Behandling",
  successLabelClinic: "Klinikk",
  successClinicPrefix: "CMedical – ",
  successLabelDateTime: "Dato og tid",
  successLabelSpecialist: "Behandler",
  successBackHome: "Tilbake til forsiden",
  errorMissingData:
    "Manglende booking-data. Velg tjeneste, klinikk og tid på nytt, eller ring oss for hjelp.",
  errorActivityType:
    "Kunne ikke hente aktivitetstype fra booking-systemet. Prøv igjen eller ring oss.",
  errorSubmit: "Bestillingen kunne ikke fullføres. Prøv igjen eller ring oss på 22 60 00 50.",
  errorSubmitNetwork:
    "Bestillingen kunne ikke fullføres. Sjekk nettverket og prøv igjen, eller ring oss på 22 60 00 50.",
  errorInvalidBirthNumber:
    "Ugyldig fødselsnummer — sjekk at du har tastet riktig.",
};

/** English fallbacks when CMS has no `en` value yet (avoids Norwegian on /en). */
const DEFAULT_BOOKING_PAGE_COPY_EN: BookingPageCopy = {
  pageTitle: "Book appointment",
  closeAriaLabel: "Close booking and go to homepage",
  backLabel: "Back",
  stepProgressTemplate: "Step {{step}} of {{total}}",
  stepLabelService: "Service",
  stepLabelClinic: "Clinic",
  stepLabelSpecialist: "Practitioner",
  stepLabelTime: "Time",
  stepLabelConfirm: "Confirm",
  summaryServiceLabel: "Service:",
  summaryClinicLabel: "Clinic:",
  summarySpecialistLabel: "Practitioner:",
  supportPhone: "22 60 00 50",
  supportPhoneLabel: "Call us and we will help",
  supportFooterText:
    "If you experience any challenges with online booking, you are welcome to call us at {{phone}}.\nWe are available from 08:00 – 20:00 every weekday.",
  step1Heading: "Choose a service",
  step1HeadingFiltered: "Choose a service within {{category}}",
  step1ShowAllServices: "Show all services",
  step1Loading: "Loading services…",
  step1LoadingClinics: "Loading clinics…",
  step1AllClinicsBadge: "All clinics",
  step1EmptyTitle: "Could not load services",
  step1EmptyMessage:
    "We cannot load the service list from the booking system right now. Call us and we will help you find the right appointment.",
  step1PriceFree: "Free",
  step1PriceFrom: "From NOK {{price}}",
  step1LoadingDuration: "Loading duration…",
  step1CategoryClinicBadges: [],
  step2Heading: "Choose a clinic",
  step2Loading: "Loading clinics from the booking system…",
  step2EmptyTitle: "This service can't be booked online right now",
  step2EmptyMessage:
    "This particular service is currently not available for online booking. Please give us a call, or book a different appointment online.",
  step2EmptyButtonLabel: "Call us and we will help",
  step2EmptyPhone: "22 60 00 50",
  step2EmptyBookLabel: "Book appointment",
  step3Heading: "Choose a practitioner",
  step3Subtitle: "Choose a practitioner, or continue to see all available times.",
  step3Loading: "Loading practitioners from the booking system…",
  step3FirstAvailableTitle: "First available",
  step3FirstAvailableSubtitle: "Show all available times regardless of practitioner",
  step3EmptyNoCaregiversTitle: "No practitioners with available times",
  step3EmptyNoCaregiversMessage:
    "We cannot find practitioners linked to available slots for this service. Choose \"First available\" or call us for help.",
  step3EmptyFetchTitle: "Could not load practitioners",
  step3EmptyFetchMessage:
    "The booking system did not return practitioner information. Choose \"First available\" or try again later.",
  step4Heading: "Choose a time",
  step4SelectedDayLabel: "Selected day",
  step4NoDaysLabel: "No available days",
  step4NoDaysTitle: "No available days",
  step4NoDaysMessage:
    "We couldn't find any available appointments in the calendar right now. Call us directly – we often find openings that aren't listed online.",
  step4TodayLabel: "Today",
  step4PickTimeLabel: "Choose a time",
  step4DurationPrefix: "Duration",
  step4LoadingTimes: "Loading available times…",
  step4NotOnlineTitle: "Online times not available",
  step4NotOnlineMessage:
    "This service is not connected to the booking system. Call us and we will help you find an appointment.",
  step4NoSlotsTitle: "No available times this day",
  step4NoSlotsMessage:
    "Try another day in the calendar, or call us directly – we often find openings that are not listed online.",
  step5Heading: "Confirm",
  step5OrderTitle: "Your booking",
  step5LabelService: "Service",
  step5LabelPrice: "Price",
  step5LabelClinic: "Clinic",
  step5LabelDuration: "Duration",
  step5LabelDate: "Date",
  step5LabelTime: "Time",
  step5PriceFree: "Free",
  step5PriceFrom: "From {{price}} NOK",
  step5PriceNote: "The price may vary by time of day, weekends and any add-ons.",
  step5PersonalInfoTitle: "Your details",
  step5SubmitLabel: "Confirm booking",
  step5SubmittingLabel: "Submitting booking…",
  formFirstNameLabel: "First name *",
  formFirstNamePlaceholder: "First name",
  formLastNameLabel: "Last name *",
  formLastNamePlaceholder: "Last name",
  formBirthNumberLabel: "National ID (11 digits) *",
  formBirthNumberPlaceholder: "DDMMYYXXXXX",
  formBirthNumberHelp:
    "* National ID is required for secure identification and medical records under healthcare regulations. Information is handled confidentially and not shared with third parties.",
  formPhoneLabel: "Mobile number *",
  formPhonePlaceholder: "XXX XX XXX",
  formPhoneHelp: "Confirmation and reminders are sent by SMS to this number.",
  formEmailLabel: "Email address",
  formEmailPlaceholder: "you@email.com",
  formEmailHelp: "Optional. Confirmation is also sent by email if provided.",
  formNoteLabel: "Message to the clinic",
  formNotePlaceholder: "Optional — e.g. questions or information we should know",
  formCancellationRulesHeading: "Cancellation rules",
  formCancellationRules:
    "Rescheduling or cancellation must happen at least 24 hours before the appointment. No-shows or late cancellations incur a fee.",
  formTermsPageTeaser:
    '"{{termsLink}}" – read the terms for booking and treatment at CMedical.',
  formTermsLinkText: "Terms",
  formTermsInlineLinkText: "the terms",
  formTermsCheckbox: "I accept the {{termsLink}} for booking *",
  formPrivacyLinkText: "privacy policy",
  formPrivacyCheckbox:
    "I consent to CMedical processing submitted information according to the {{privacyLink}} *",
  formMarketingCheckbox: "I would like to receive information and news from CMedical",
  successTitle: "Booking confirmed",
  successMessageSms: "You will receive a confirmation by SMS.",
  successMessageSmsEmail: "You will receive a confirmation by SMS and email.",
  successLabelTreatment: "Treatment",
  successLabelClinic: "Clinic",
  successClinicPrefix: "CMedical – ",
  successLabelDateTime: "Date and time",
  successLabelSpecialist: "Practitioner",
  successBackHome: "Back to homepage",
  errorMissingData:
    "Missing booking data. Choose service, clinic and time again, or call us for help.",
  errorActivityType:
    "Could not load activity type from the booking system. Try again or call us.",
  errorSubmit: "The booking could not be completed. Try again or call us at 22 60 00 50.",
  errorSubmitNetwork:
    "The booking could not be completed. Check your network and try again, or call us at 22 60 00 50.",
  errorInvalidBirthNumber:
    "Invalid national ID — please check that you entered it correctly.",
};

export function defaultBookingPageCopyForLang(lang: "no" | "en"): BookingPageCopy {
  return lang === "en" ? DEFAULT_BOOKING_PAGE_COPY_EN : DEFAULT_BOOKING_PAGE_COPY;
}

export function splitTemplateLink(
  template: string,
  token: string,
): [string, string] {
  const parts = template.split(token);
  return [parts[0] ?? "", parts.slice(1).join(token)];
}

/** `tel:` href for the booking support number (e.g. tel:+4722600050). */
export function bookingSupportTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "tel:+4722600050";
  const withCountry =
    digits.startsWith("47") && digits.length >= 10 ? digits : `47${digits}`;
  return `tel:+${withCountry}`;
}

/** Display form matching the demo: +47 22 60 00 50. */
export function bookingSupportPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national =
    digits.startsWith("47") && digits.length >= 10 ? digits.slice(2) : digits;
  if (national.length === 8) {
    return `+47 ${national.slice(0, 2)} ${national.slice(2, 4)} ${national.slice(4, 6)} ${national.slice(6, 8)}`;
  }
  const rest = phone.replace(/^\s*\+?47\s*/, "").trim() || phone.trim();
  return `+47 ${rest}`;
}

export function fillBookingTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : "",
  );
}

export function resolveBookingPageCopy(
  cms: Partial<BookingPageCopy> | null | undefined,
  lang: "no" | "en" = "no",
): BookingPageCopy {
  const merged = { ...defaultBookingPageCopyForLang(lang) };
  if (!cms) return merged;

  for (const key of Object.keys(DEFAULT_BOOKING_PAGE_COPY) as (keyof BookingPageCopy)[]) {
    if (key === "step1CategoryClinicBadges") continue;
    const value = cms[key];
    if (typeof value === "string" && value.trim()) {
      merged[key] = value.trim();
    }
  }

  return merged;
}
