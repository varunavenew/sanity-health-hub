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
  step2Heading: string;
  step2Loading: string;
  step2EmptyTitle: string;
  step2EmptyMessage: string;
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
  step2Heading: "Velg klinikk",
  step2Loading: "Henter klinikker fra booking-systemet…",
  step2EmptyTitle: "Ingen klinikker tilgjengelig akkurat nå",
  step2EmptyMessage:
    "Denne tjenesten er ikke bookbar online for øyeblikket. Vi hjelper deg gjerne med å finne riktig time.",
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
  formPhonePlaceholder: "+47 XXX XX XXX",
  formPhoneHelp: "Bekreftelse og påminnelse sendes på SMS til dette nummeret.",
  formEmailLabel: "E-postadresse",
  formEmailPlaceholder: "din@epost.no",
  formEmailHelp: "Valgfritt. Bekreftelse sendes også til e-post om oppgitt.",
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
};

export function splitTemplateLink(
  template: string,
  token: string,
): [string, string] {
  const parts = template.split(token);
  return [parts[0] ?? "", parts.slice(1).join(token)];
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
): BookingPageCopy {
  const merged = { ...DEFAULT_BOOKING_PAGE_COPY };
  if (!cms) return merged;

  for (const key of Object.keys(DEFAULT_BOOKING_PAGE_COPY) as (keyof BookingPageCopy)[]) {
    const value = cms[key];
    if (typeof value === "string" && value.trim()) {
      merged[key] = value.trim();
    }
  }

  return merged;
}
