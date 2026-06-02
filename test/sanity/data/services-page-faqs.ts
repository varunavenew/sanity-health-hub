import { i18nString, i18nText } from "../lib/category-landing-i18n";

/** Default FAQ rows for servicesPage.faqs (NO + EN). */
export const servicesPageFaqs = [
  {
    _type: "servicesFaq",
    _key: "faq1",
    question: i18nString("Henvisning", "Reference"),
    answer: i18nText(
      "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
      "You do not need a referral to book with us. Book online or call us. Bring a GP referral to your appointment if you have one.",
    ),
  },
  {
    _type: "servicesFaq",
    _key: "faq2",
    question: i18nString("Ventetid", "Waiting time"),
    answer: i18nText(
      "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
      "We offer short waiting times. Most patients get an appointment within 1–3 days, depending on the type of care and availability.",
    ),
  },
  {
    _type: "servicesFaq",
    _key: "faq3",
    question: i18nString("Sykemelding", "Sick leave"),
    answer: i18nText(
      "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
      "Our specialists can issue a sick note when there is a medical basis. This is assessed individually during your consultation.",
    ),
  },
  {
    _type: "servicesFaq",
    _key: "faq4",
    question: i18nString("Utredning", "Investigation"),
    answer: i18nText(
      "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
      "We offer thorough assessment across our services. It is tailored to your situation and may include consultation, examination, blood tests and imaging.",
    ),
  },
  {
    _type: "servicesFaq",
    _key: "faq5",
    question: i18nString("Selskapet", "The company"),
    answer: i18nText(
      "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
      "CMedical is a leading Nordic clinic for life and intimate health, with a strong focus on women's health. We also care for men's health and fertility. More than 150,000 patients have been treated with us since 2002.",
    ),
  },
  {
    _type: "servicesFaq",
    _key: "faq6",
    question: i18nString("Forsikring", "Insurance"),
    answer: i18nText(
      "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical.",
      "We work with most major insurers, including EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand and Tryg. Contact your insurer to confirm coverage and request an appointment at CMedical.",
    ),
  },
];
