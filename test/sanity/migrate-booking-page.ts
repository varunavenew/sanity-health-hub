#!/usr/bin/env npx tsx
import { sanityClient } from './config'

const i18nString = (no: string, en: string) => [
  { _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no },
  { _type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en },
]

const i18nText = (no: string, en: string) => [
  { _type: 'internationalizedArrayTextValue', _key: 'no', language: 'no', value: no },
  { _type: 'internationalizedArrayTextValue', _key: 'en', language: 'en', value: en },
]

const S = i18nString
const T = i18nText

async function run() {
  const doc = {
    _id: 'bookingPage',
    _type: 'bookingPage',
    pageTitle: S('Bestill time', 'Book appointment'),
    closeAriaLabel: S(
      'Lukk bestilling og gå til forsiden',
      'Close booking and go to homepage',
    ),
    backLabel: S('Tilbake', 'Back'),
    stepProgressTemplate: S('Steg {{step}} av {{total}}', 'Step {{step}} of {{total}}'),
    stepLabelService: S('Tjeneste', 'Service'),
    stepLabelClinic: S('Klinikk', 'Clinic'),
    stepLabelSpecialist: S('Behandler', 'Practitioner'),
    stepLabelTime: S('Tid', 'Time'),
    stepLabelConfirm: S('Bekreft', 'Confirm'),
    summaryServiceLabel: S('Tjeneste:', 'Service:'),
    summaryClinicLabel: S('Klinikk:', 'Clinic:'),
    summarySpecialistLabel: S('Behandler:', 'Practitioner:'),
    supportPhone: '22 60 00 50',
    supportPhoneLabel: S('Ring oss så hjelper vi deg', 'Call us and we will help'),
    step1Heading: S('Velg tjeneste', 'Choose a service'),
    step1HeadingFiltered: S(
      'Velg tjeneste innen {{category}}',
      'Choose a service within {{category}}',
    ),
    step1ShowAllServices: S('Vis alle tjenester', 'Show all services'),
    step1Loading: S('Henter tjenester…', 'Loading services…'),
    step1AllClinicsBadge: S('Alle klinikker', 'All clinics'),
    step1EmptyTitle: S('Kunne ikke laste tjenester', 'Could not load services'),
    step1EmptyMessage: T(
      'Vi får ikke hentet tjenestelisten fra booking-systemet akkurat nå. Ring oss, så hjelper vi deg med å finne riktig time.',
      'We cannot load the service list from the booking system right now. Call us and we will help you find the right appointment.',
    ),
    step1PriceFree: S('Gratis', 'Free'),
    step1PriceFrom: S('Fra kr {{price}},-', 'From NOK {{price}}'),
    step1LoadingDuration: S('Henter varighet…', 'Loading duration…'),
    step2Heading: S('Velg klinikk', 'Choose a clinic'),
    step2Loading: S(
      'Henter klinikker fra booking-systemet…',
      'Loading clinics from the booking system…',
    ),
    step2EmptyTitle: S(
      'Ingen klinikker tilgjengelig akkurat nå',
      'No clinics available right now',
    ),
    step2EmptyMessage: T(
      'Denne tjenesten er ikke bookbar online for øyeblikket. Vi hjelper deg gjerne med å finne riktig time.',
      'This service is not bookable online at the moment. We are happy to help you find the right appointment.',
    ),
    step3Heading: S('Velg behandler', 'Choose a practitioner'),
    step3Subtitle: T(
      'Velg en behandler, eller gå videre for å se alle ledige tider.',
      'Choose a practitioner, or continue to see all available times.',
    ),
    step3Loading: S(
      'Henter behandlere fra booking-systemet…',
      'Loading practitioners from the booking system…',
    ),
    step3FirstAvailableTitle: S('Første ledige', 'First available'),
    step3FirstAvailableSubtitle: T(
      'Vis alle ledige tider uavhengig av behandler',
      'Show all available times regardless of practitioner',
    ),
    step3EmptyNoCaregiversTitle: S(
      'Ingen behandlere med ledige tider',
      'No practitioners with available times',
    ),
    step3EmptyNoCaregiversMessage: T(
      'Vi finner ingen behandlere knyttet til ledige timer for denne tjenesten. Velg «Første ledige» eller ring oss for hjelp.',
      'We cannot find practitioners linked to available slots for this service. Choose "First available" or call us for help.',
    ),
    step3EmptyFetchTitle: S('Kunne ikke hente behandlere', 'Could not load practitioners'),
    step3EmptyFetchMessage: T(
      'Booking-systemet svarte ikke med behandlerinformasjon. Velg «Første ledige» eller prøv igjen senere.',
      'The booking system did not return practitioner information. Choose "First available" or try again later.',
    ),
    step4Heading: S('Velg tid', 'Choose a time'),
    step4SelectedDayLabel: S('Valgt dag', 'Selected day'),
    step4NoDaysLabel: S('Ingen ledige dager', 'No available days'),
    step4TodayLabel: S('I dag', 'Today'),
    step4PickTimeLabel: S('Velg en tid', 'Choose a time'),
    step4DurationPrefix: S('Varighet', 'Duration'),
    step4LoadingTimes: S('Henter ledige tider…', 'Loading available times…'),
    step4NotOnlineTitle: S('Online tider ikke tilgjengelig', 'Online times not available'),
    step4NotOnlineMessage: T(
      'Denne tjenesten har ikke kobling til booking-systemet. Ring oss, så hjelper vi deg med å finne en time.',
      'This service is not connected to the booking system. Call us and we will help you find an appointment.',
    ),
    step4NoSlotsTitle: S('Ingen ledige timer denne dagen', 'No available times this day'),
    step4NoSlotsMessage: T(
      'Prøv en annen dag i kalenderen, eller gi oss en ringedirekte – vi finner ofte en åpning som ikke ligger ute online.',
      'Try another day in the calendar, or call us directly – we often find openings that are not listed online.',
    ),
    step5Heading: S('Bekreft', 'Confirm'),
    step5OrderTitle: S('Din bestilling', 'Your booking'),
    step5LabelService: S('Tjeneste', 'Service'),
    step5LabelPrice: S('Pris', 'Price'),
    step5LabelClinic: S('Klinikk', 'Clinic'),
    step5LabelDuration: S('Varighet', 'Duration'),
    step5LabelDate: S('Dato', 'Date'),
    step5LabelTime: S('Tid', 'Time'),
    step5PriceFree: S('Gratis', 'Free'),
    step5PriceFrom: S('Fra {{price}} kr', 'From {{price}} NOK'),
    step5PriceNote: T(
      'Prisen kan påvirkes av tid på døgnet, helg og eventuelle tillegg.',
      'The price may vary by time of day, weekends and any add-ons.',
    ),
    step5PersonalInfoTitle: S('Dine opplysninger', 'Your details'),
    step5SubmitLabel: S('Bekreft bestilling', 'Confirm booking'),
    step5SubmittingLabel: S('Sender bestilling…', 'Submitting booking…'),
    formFirstNameLabel: S('Fornavn *', 'First name *'),
    formFirstNamePlaceholder: S('Fornavn', 'First name'),
    formLastNameLabel: S('Etternavn *', 'Last name *'),
    formLastNamePlaceholder: S('Etternavn', 'Last name'),
    formBirthNumberLabel: S('Fødselsnummer (11 siffer) *', 'National ID (11 digits) *'),
    formBirthNumberPlaceholder: S('DDMMÅÅXXXXX', 'DDMMYYXXXXX'),
    formBirthNumberHelp: T(
      '* Fødselsnummeret er påkrevd for sikker identifisering og journalføring i henhold til helsepersonelloven. Opplysningene behandles konfidensielt og deles ikke med tredjepart.',
      '* National ID is required for secure identification and medical records under healthcare regulations. Information is handled confidentially and not shared with third parties.',
    ),
    formPhoneLabel: S('Mobilnummer *', 'Mobile number *'),
    formPhonePlaceholder: S('+47 XXX XX XXX', '+47 XXX XX XXX'),
    formPhoneHelp: T(
      'Bekreftelse og påminnelse sendes på SMS til dette nummeret.',
      'Confirmation and reminders are sent by SMS to this number.',
    ),
    formEmailLabel: S('E-postadresse', 'Email address'),
    formEmailPlaceholder: S('din@epost.no', 'you@email.com'),
    formEmailHelp: T(
      'Valgfritt. Bekreftelse sendes også til e-post om oppgitt.',
      'Optional. Confirmation is also sent by email if provided.',
    ),
    formCancellationRules: T(
      'Om- eller avbestilling må skje senest 24 timer før avtalt tidspunkt. Ved manglende oppmøte eller sen avbestilling vil det påløpe et gebyr.',
      'Rescheduling or cancellation must happen at least 24 hours before the appointment. No-shows or late cancellations incur a fee.',
    ),
    formTermsPageTeaser: S(
      '«{{termsLink}}» – les vilkårene for bestilling og behandling hos CMedical.',
      '"{{termsLink}}" – read the terms for booking and treatment at CMedical.',
    ),
    formTermsLinkText: S('Vilkår', 'Terms'),
    formTermsInlineLinkText: S('vilkårene', 'the terms'),
    formTermsCheckbox: S('Jeg godtar {{termsLink}} for bestilling *', 'I accept the {{termsLink}} for booking *'),
    formPrivacyLinkText: S('personvernerklæringen', 'privacy policy'),
    formPrivacyCheckbox: T(
      'Jeg samtykker til at CMedical kan behandle innsendt informasjon i henhold til {{privacyLink}} *',
      'I consent to CMedical processing submitted information according to the {{privacyLink}} *',
    ),
    formMarketingCheckbox: S(
      'Jeg ønsker å motta informasjon og nyheter fra CMedical',
      'I would like to receive information and news from CMedical',
    ),
    successTitle: S('Bestilling bekreftet', 'Booking confirmed'),
    successMessageSms: S('Du vil motta en bekreftelse på SMS.', 'You will receive a confirmation by SMS.'),
    successMessageSmsEmail: S(
      'Du vil motta en bekreftelse på SMS og e-post.',
      'You will receive a confirmation by SMS and email.',
    ),
    successLabelTreatment: S('Behandling', 'Treatment'),
    successLabelClinic: S('Klinikk', 'Clinic'),
    successClinicPrefix: S('CMedical – ', 'CMedical – '),
    successLabelDateTime: S('Dato og tid', 'Date and time'),
    successLabelSpecialist: S('Behandler', 'Practitioner'),
    successBackHome: S('Tilbake til forsiden', 'Back to homepage'),
    errorMissingData: T(
      'Manglende booking-data. Velg tjeneste, klinikk og tid på nytt, eller ring oss for hjelp.',
      'Missing booking data. Choose service, clinic and time again, or call us for help.',
    ),
    errorActivityType: T(
      'Kunne ikke hente aktivitetstype fra booking-systemet. Prøv igjen eller ring oss.',
      'Could not load activity type from the booking system. Try again or call us.',
    ),
    errorSubmit: T(
      'Bestillingen kunne ikke fullføres. Prøv igjen eller ring oss på 22 60 00 50.',
      'The booking could not be completed. Try again or call us at 22 60 00 50.',
    ),
    errorSubmitNetwork: T(
      'Bestillingen kunne ikke fullføres. Sjekk nettverket og prøv igjen, eller ring oss på 22 60 00 50.',
      'The booking could not be completed. Check your network and try again, or call us at 22 60 00 50.',
    ),
    seo: {
      _type: 'seo',
      metaTitle: S('Bestill time', 'Book appointment'),
      metaDescription: T(
        'Bestill time hos CMedical. Velg tjeneste, klinikk, behandler og tidspunkt – enkelt og raskt online.',
        'Book an appointment at CMedical. Choose service, clinic, practitioner and time – quickly and easily online.',
      ),
    },
  }

  await sanityClient.createOrReplace(doc)
  await sanityClient.createOrReplace({ ...doc, _id: 'drafts.bookingPage' })
  console.log('✓ bookingPage (published + draft) seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
