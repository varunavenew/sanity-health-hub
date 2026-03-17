// Migration: Populate Kvinnehelse theme page in Sanity
// Run: npx ts-node --esm sanity/migrate-kvinnehelse.ts

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "sh2sj585",
  dataset: "development",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const kvinnehelsePage = {
  _type: "themePage",
  _id: "themePage-kvinnehelse",
  title: "Kvinnehelse for livet",
  slug: { _type: "slug", current: "kvinnehelse" },
  introTexts: [
    "Kropp, hormoner, livssituasjon og helsebehov endrer seg gjennom livet. Likevel opplever mange kvinner at symptomer bagatelliseres, at helsetilbudet er fragmentert, eller at de selv må koordinere egen oppfølging.",
    "Hos CMedical møter vi kvinnehelse helhetlig. Med medisinsk kompetanse, tverrfaglig samarbeid og moderne diagnostikk tilbyr vi et sammenhengende helsetilbud – fra ungdomstid til seniortilværelse.",
  ],
  sections: [
    {
      _key: "section-1",
      heading: "En helhetlig tilnærming",
      paragraphs: [
        "Vi vet at helseutfordringer ofte henger sammen. Hormonelle endringer kan påvirke psykisk helse. Svangerskap kan gi senvirkninger. Overgangsalder kan påvirke både hjertehelse, søvn og livskvalitet.",
        "Derfor tilbyr vi:",
      ],
      bulletPoints: [
        "Gynekologisk oppfølging",
        "Fertilitetsutredning og -behandling",
        "Svangerskapsoppfølging",
        "Hormonvurdering og behandling",
        "Forebyggende helsekontroller",
        "Tverrfaglig støtte innen ernæring, psykisk helse og livsstil",
      ],
    },
    {
      _key: "section-2",
      heading: "Kunnskapsbasert og individuelt tilpasset",
      paragraphs: [
        "Kvinnehelse har historisk vært underprioritert i forskning og praksis. Det fører til forsinket diagnostikk og unødvendig belastning. Vi arbeider kunnskapsbasert og legger vekt på å lytte til pasientens erfaringer.",
        "Hos oss blir symptomer tatt på alvor. Vi kombinerer klinisk erfaring med moderne teknologi og individuelt tilpassede behandlingsplaner.",
      ],
    },
    {
      _key: "section-3",
      heading: "Trygghet, tilgjengelighet og kvalitet",
      paragraphs: [
        "Kvinnehelse krever kontinuitet, koordinering og spesialisert kompetanse. CMedical tilbyr korte ventetider, erfarne spesialister og en strukturert oppfølging som gir oversikt og forutsigbarhet.",
      ],
    },
  ],
  lifePhases: [
    {
      _key: "phase-1",
      title: "Ung kvinne",
      text: "Menstruasjonsutfordringer, prevensjon, PCOS, endometriose, smerter og hormonelle plager.",
    },
    {
      _key: "phase-2",
      title: "Fertil alder",
      text: "Prevensjonsveiledning, fertilitetsvurdering, graviditet, barseloppfølging og bekkenhelse.",
    },
    {
      _key: "phase-3",
      title: "Midtliv og overgangsalder",
      text: "Perimenopause og menopause, hormonbehandling, søvnproblemer, energitap, beinskjørhet og hjertehelse.",
    },
    {
      _key: "phase-4",
      title: "Senior kvinnehelse",
      text: "Forebygging, underlivsplager, inkontinens, seksualhelse og helhetlig oppfølging av kroniske tilstander.",
    },
  ],
  ctaText: "Bestill time",
  ctaLink: "/booking",
};

async function migrate() {
  console.log("Creating Kvinnehelse theme page...");
  await client.createOrReplace(kvinnehelsePage);
  console.log("✅ Kvinnehelse theme page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
