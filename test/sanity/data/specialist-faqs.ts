export type SpecialistFaqSeed = {
  key: string;
  category: "generelt" | "finansiering" | "praktisk";
  sortOrder: number;
  question: { no: string; en: string };
  answer: { no: string; en: string };
};

export const SPECIALIST_FAQ_SECTION_TITLE = {
  no: "Ofte stilte spørsmål",
  en: "Frequently asked questions",
} as const;

export const SPECIALIST_FAQ_COLLECTION_ID = "faqCollection-spesialist-generell";

export const SPECIALIST_FAQ_COLLECTION_TITLE = {
  no: "Spesialist – praktisk informasjon",
  en: "Specialist – practical information",
} as const;

/** Source copy for migrate-specialist-faqs.ts only — not used by the website. */
export const specialistFaqs: SpecialistFaqSeed[] = [
  {
    key: "henvisning",
    category: "generelt",
    sortOrder: 1,
    question: { no: "Henvisning", en: "Reference" },
    answer: {
      no: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
      en: "You do not need a referral to book an appointment with us. You can easily book directly via our website or call us. If you have a referral from your GP, please bring it with you to the consultation.",
    },
  },
  {
    key: "ventetid",
    category: "generelt",
    sortOrder: 2,
    question: { no: "Ventetid", en: "Waiting time" },
    answer: {
      no: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
      en: "We offer short waiting times. Most people get an appointment within 1-3 days, depending on the type of treatment and availability.",
    },
  },
  {
    key: "sykemelding",
    category: "generelt",
    sortOrder: 3,
    question: { no: "Sykemelding", en: "Sick leave" },
    answer: {
      no: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
      en: "Our specialists can write a sick note if there is a medical basis for it. This is assessed individually during the consultation.",
    },
  },
  {
    key: "utredning",
    category: "generelt",
    sortOrder: 4,
    question: { no: "Utredning", en: "Investigation" },
    answer: {
      no: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
      en: "We offer a thorough assessment within all of our services. The assessment is tailored to your situation and may include an interview, examination, blood tests and imaging.",
    },
  },
  {
    key: "selskapet",
    category: "generelt",
    sortOrder: 5,
    question: { no: "Selskapet", en: "The company" },
    answer: {
      no: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Hvert år har vi over 60 000 pasientbesøk ved klinikkene våre.",
      en: "CMedical is the leading clinic for the life and genitals in the Nordic region, with a special emphasis on women's health. We are also concerned with men's health and fertility, which concerns everyone involved in creating life. Every year we have over 60,000 patient visits at our clinics.",
    },
  },
  {
    key: "forsikring",
    category: "generelt",
    sortOrder: 6,
    question: { no: "Forsikring", en: "Insurance" },
    answer: {
      no: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse og Vialia. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical.",
      en: "We have agreements with most insurance companies, including EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse and Vialia. Contact your insurance company to check what your insurance covers, and ask to make an appointment with CMedical.",
    },
  },
];

export function specialistFaqDocId(key: string) {
  return `faq.specialist.${key}`;
}
