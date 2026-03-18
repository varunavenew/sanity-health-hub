// Migration: Populate Fastlegeveiledning overgangsalder theme page in Sanity
// Run: npx ts-node --esm sanity/migrate-fastlegeveiledning.ts

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "sh2sj585",
  dataset: "development",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function migrate() {
  const page = {
    _type: "themePage",
    _id: "themePage-fastlegeveiledning-overgangsalder",
    title: "Fastlegeveiledning overgangsalder",
    slug: { _type: "slug", current: "fastlegeveiledning-overgangsalder" },
    introTexts: [
      "Denne veilederen er et praktisk verktøy for fastleger ved utredning og behandling av peri- og menopausale kvinner. Den baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer, European Society of Endocrinology (ESE) kliniske retningslinjer 2025, samt relevant forskning på spesielle pasientgrupper.",
      "Viktig presisering: Dette er et forslag til klinisk tilnærming. Klinikere må alltid anvende faglig skjønn og huske at retningslinjer endres kontinuerlig. Individuell vurdering og oppfølging er essensielt.",
    ],
    sections: [
      {
        _key: "utredning",
        heading: "Utredning",
        paragraphs: [
          "Ved vurdering av peri- og menopausale symptomer anbefales en helhetlig tilnærming basert på fire søyler: 1) Hormoner, 2) Psykologisk tilstand, 3) Ernæring, 4) Fysisk aktivitet.",
          "Differensialdiagnoser inkluderer hyperthyreose/hypothyreose, søvnforstyrrelser, medikamentbivirkninger, og angstlidelser/depresjon.",
        ],
      },
      {
        _key: "aldersbasert",
        heading: "Aldersbasert håndtering",
        paragraphs: [
          "Under 40 år (POI): Alle kvinner skal henvises til gynekolog. Økt risiko for kardiovaskulær sykdom, osteoporose og kognitiv svikt.",
          "40–45 år (tidlig menopause): Bør henvises til gynekolog. Spesialistvurdering for optimal hormonsubstitusjon.",
          "45 år og eldre (naturlig menopause): Kan håndteres av fastleger. Unntak: blødningsforstyrrelser bør henvises.",
        ],
      },
      {
        _key: "behandling",
        heading: "Behandling",
        paragraphs: [
          "Livsstilsoptimalisering: Røykeslutt, regelmessig fysisk aktivitet, sunt kosthold, søvnhygiene og stressmestring.",
          "MHT: Den mest effektive behandlingen for vasomotoriske symptomer. Transdermal østrogen anbefales fremfor peroral.",
          "Gestagenbeskyttelse: Mikronisert progesteron (Utrogestan) er førstevalg. Mirena-spiral er et alternativ.",
          "Vaginal østrogen: Ved vaginal atrofi, urinveisinfeksjoner, urinlekkasje. Minimal systemisk absorpsjon.",
          "Testosteron for kvinner: Ved redusert seksuell lyst. Off-label bruk i Norge.",
        ],
      },
      {
        _key: "spesielle",
        heading: "Spesielle pasientgrupper",
        paragraphs: [
          "Migrene med aura: Transdermale østrogener kan brukes, orale er kontraindisert.",
          "Endometriose: Kontinuerlig kombinert MHT er førstevalget, også etter hysterektomi.",
          "ADHD: Østrogen øker dopaminproduksjon. Mirena-spiral best for minst systemisk påvirkning.",
          "Hypothyroidisme: Oral østrogen kan kreve økning av levothyroxin. TSH bør kontrolleres.",
          "Type 2-diabetes: MHT reduserer HbA1c og insulinresistens.",
        ],
      },
      {
        _key: "oppsummering",
        heading: "Oppsummering og praktiske råd",
        paragraphs: [
          "Start med livsstilsoptimalisering. Individuell vurdering av symptomer og risikofaktorer.",
          "Velg transdermal østrogen fremfor peroral. Mikronisert progesteron fremfor syntetiske gestagener.",
          "Henvis til gynekolog ved: POI (<40 år), tidlig menopause (40–45), blødningsforstyrrelser, eller manglende respons.",
        ],
      },
    ],
    ctaText: "Bestill time",
    ctaLink: "/booking?kategori=gynekologi",
  };

  console.log("Creating Fastlegeveiledning theme page...");
  await client.createOrReplace(page);
  console.log("✅ Fastlegeveiledning theme page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
