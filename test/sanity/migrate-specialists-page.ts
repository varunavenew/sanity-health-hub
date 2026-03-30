// Migration: Populate About Specialists Page in Sanity
// Run: npx ts-node --esm sanity/migrate-specialists-page.ts

import { sanityClient as client } from "./config";

async function migrate() {
  const specialistsPage = {
    _type: "specialistsPage",
    _id: "specialistsPage",
    title: "Om våre spesialister",
    subtitle:
      "Hos CMedical møter du Nordens fremste spesialister innen gynekologi, fertilitet, urologi og ortopedi. Våre leger kombinerer lang erfaring med moderne teknologi for å gi deg trygg og presis behandling.",
    body: [
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Vårt team består av ledende spesialister som deler en felles ambisjon: å gi deg den beste behandlingen tilgjengelig. Hver spesialist hos CMedical er nøye utvalgt basert på sin kompetanse, erfaring og engasjement for pasientbehandling.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s2",
            text: "Vi tror på verdien av tverrfaglig samarbeid. Når våre spesialister samarbeider på tvers av fagfelt, sikrer vi helhetlig og koordinert behandling tilpasset nettopp dine behov.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s3",
            text: "Alle våre spesialister har lang erfaring fra ledende sykehus og universitetsmiljøer, og flere har internasjonal bakgrunn som beriker vår faglige bredde. De holder seg oppdatert på den nyeste forskningen og deltar aktivt i faglige nettverk for å sikre at du alltid får behandling basert på beste tilgjengelige kunnskap.",
          },
        ],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p4",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s4",
            text: "Hos CMedical er det pasienten som står i sentrum. Våre spesialister tar seg tid til å lytte, forklare og tilpasse behandlingen til din unike situasjon – slik at du føler deg trygg og ivaretatt gjennom hele forløpet.",
          },
        ],
        markDefs: [],
      },
    ],
    seo: {
      metaTitle: "Om våre spesialister – Erfaring og spisskompetanse",
      metaDescription:
        "Les om CMedicals spesialistteam. Ledende eksperter innen gynekologi, fertilitet, urologi og ortopedi – samlet på ett sted.",
    },
  };

  console.log("Creating About Specialists page...");
  await client.createOrReplace(specialistsPage);
  console.log("✅ About Specialists page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
