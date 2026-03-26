/**
 * Migrate all hardcoded FAQs from the codebase to Sanity.
 *
 * Categories:
 *   - "generelt"    → Homepage (LifePhasesSection)
 *   - "priser"      → Pricing page
 *   - "urologi"     → Urology static page
 *   - "finansiering" → SpecialistFAQ financing group
 *   - "praktisk"    → SpecialistFAQ general group
 *
 * Run: SANITY_TOKEN=<token> npx tsx test/sanity/migrate-faqs.ts
 */
import { sanityClient } from "./config";

interface FaqDoc {
  _id: string;
  _type: "faq";
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

const faqs: FaqDoc[] = [
  // ── Homepage (generelt) ──────────────────────────────────────────
  {
    _id: "faq-generelt-henvisning",
    _type: "faq",
    question: "Henvisning",
    answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
    category: "generelt",
    sortOrder: 1,
  },
  {
    _id: "faq-generelt-ventetid",
    _type: "faq",
    question: "Ventetid",
    answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet.",
    category: "generelt",
    sortOrder: 2,
  },
  {
    _id: "faq-generelt-sykemelding",
    _type: "faq",
    question: "Sykemelding",
    answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen.",
    category: "generelt",
    sortOrder: 3,
  },
  {
    _id: "faq-generelt-utredning",
    _type: "faq",
    question: "Utredning",
    answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk.",
    category: "generelt",
    sortOrder: 4,
  },
  {
    _id: "faq-generelt-selskapet",
    _type: "faq",
    question: "Selskapet",
    answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Siden 2002 har over 150 000 pasienter fått behandling hos oss.",
    category: "generelt",
    sortOrder: 5,
  },
  {
    _id: "faq-generelt-forsikring",
    _type: "faq",
    question: "Forsikring",
    answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, If, Vertikal Helse, Storebrand og Tryg. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical.",
    category: "generelt",
    sortOrder: 6,
  },

  // ── Priser ───────────────────────────────────────────────────────
  {
    _id: "faq-priser-henvisning",
    _type: "faq",
    question: "Trenger jeg henvisning?",
    answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen.",
    category: "priser",
    sortOrder: 1,
  },
  {
    _id: "faq-priser-betaling",
    _type: "faq",
    question: "Hvilke betalingsmåter aksepterer dere?",
    answer: "Vi aksepterer kort, Vipps og faktura. Ved forsikringsdekning sender vi faktura direkte til forsikringsselskapet.",
    category: "priser",
    sortOrder: 2,
  },
  {
    _id: "faq-priser-forsikring",
    _type: "faq",
    question: "Dekker forsikringen min behandlingen?",
    answer: "De fleste helseforsikringer dekker konsultasjoner og behandlinger hos oss. Ta kontakt med ditt forsikringsselskap for å bekrefte dekning før timen.",
    category: "priser",
    sortOrder: 3,
  },
  {
    _id: "faq-priser-avbestilling",
    _type: "faq",
    question: "Hva er avbestillingsfristen?",
    answer: "Avbestilling må skje senest 24 timer før avtalt time. Ved sen avbestilling eller ikke oppmøte faktureres full konsultasjonspris.",
    category: "priser",
    sortOrder: 4,
  },

  // ── Urologi ──────────────────────────────────────────────────────
  {
    _id: "faq-urologi-prostata",
    _type: "faq",
    question: "Når bør jeg få sjekket prostata?",
    answer: "Menn over 50 år anbefales regelmessig prostataundersøkelse. Ved familiær risiko eller symptomer, sjekk tidligere.",
    category: "urologi",
    sortOrder: 1,
  },
  {
    _id: "faq-urologi-erektil",
    _type: "faq",
    question: "Er behandling av erektil dysfunksjon effektivt?",
    answer: "Ja, moderne behandling har høy suksessrate. Vi tilbyr både medikamentell og andre løsninger.",
    category: "urologi",
    sortOrder: 2,
  },
  {
    _id: "faq-urologi-henvisning",
    _type: "faq",
    question: "Trenger jeg henvisning?",
    answer: "Nei, du kan bestille time direkte uten henvisning fra fastlege.",
    category: "urologi",
    sortOrder: 3,
  },
  {
    _id: "faq-urologi-konfidensiell",
    _type: "faq",
    question: "Er behandlingen konfidensiell?",
    answer: "Ja, alt er strengt konfidensielt. Vi behandler alle henvendelser diskret.",
    category: "urologi",
    sortOrder: 4,
  },

  // ── Finansiering (SpecialistFAQ) ─────────────────────────────────
  {
    _id: "faq-finansiering-pris",
    _type: "faq",
    question: "Pris",
    answer: "Prislister finnes på vår prisside.",
    category: "finansiering",
    sortOrder: 1,
  },
  {
    _id: "faq-finansiering-forsikring",
    _type: "faq",
    question: "Forsikring",
    answer: "Vi har forsikringsavtale med: EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Ta kontakt med legen din for henvisning. Send den til forsikringsselskapet og be om time på CMedical.",
    category: "finansiering",
    sortOrder: 2,
  },
  {
    _id: "faq-finansiering-nedbetaling",
    _type: "faq",
    question: "Nedbetaling",
    answer: "Nedbetaling er tilgjengelig på utvalgte klinikker. Spør oss for mer informasjon.",
    category: "finansiering",
    sortOrder: 3,
  },

  // ── Praktisk (SpecialistFAQ general) ─────────────────────────────
  {
    _id: "faq-praktisk-henvisning",
    _type: "faq",
    question: "Trenger jeg henvisning?",
    answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk uten refusjonsavtale med det offentlige.",
    category: "praktisk",
    sortOrder: 1,
  },
  {
    _id: "faq-praktisk-ventetid",
    _type: "faq",
    question: "Hvor lang er ventetiden?",
    answer: "Vi har svært korte ventetider. Generelt får du hjelp innen en uke.",
    category: "praktisk",
    sortOrder: 2,
  },
  {
    _id: "faq-praktisk-sykemelding",
    _type: "faq",
    question: "Kan jeg få sykemelding?",
    answer: "Ja, ved behov kan vi skrive ut sykmelding i henhold til nasjonale retningslinjer.",
    category: "praktisk",
    sortOrder: 3,
  },
  {
    _id: "faq-praktisk-utredning",
    _type: "faq",
    question: "Hva skjer i en utredning?",
    answer: "Vi anbefaler å starte med en konsultasjon. En vanlig utredning varer ca 30 minutter.",
    category: "praktisk",
    sortOrder: 4,
  },
  {
    _id: "faq-praktisk-personvern",
    _type: "faq",
    question: "Personvernerklæring",
    answer: "Vår personvernerklæring finnes på /personvern.",
    category: "praktisk",
    sortOrder: 5,
  },
];

async function migrate() {
  console.log(`🚀 Migrating ${faqs.length} FAQs to Sanity…`);

  const transaction = sanityClient.transaction();
  for (const faq of faqs) {
    transaction.createOrReplace(faq);
  }

  const result = await transaction.commit();
  console.log(`✅ Done — ${result.results.length} FAQ documents created/updated.`);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
