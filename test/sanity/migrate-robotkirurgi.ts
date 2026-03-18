// Migration: Populate Robotkirurgi theme page in Sanity (with hero image)
// Run: npx ts-node --esm sanity/migrate-robotkirurgi.ts

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

const client = createClient({
  projectId: "sh2sj585",
  dataset: "development",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function uploadImage(filename: string) {
  const absolutePath = path.resolve(__dirname, "../../src/assets/hero", filename);
  const imageBuffer = fs.readFileSync(absolutePath);
  const asset = await client.assets.upload("image", imageBuffer, {
    filename,
    contentType: "image/jpeg",
  });
  console.log(`✅ Uploaded image: ${filename} -> ${asset._id}`);
  return asset._id;
}

async function migrate() {
  console.log("Uploading hero image...");
  const heroAssetId = await uploadImage("robotkirurgi-hero.jpg");

  const robotkirurgiPage = {
    _type: "themePage",
    _id: "themePage-robotkirurgi",
    title: "Robotassistert kirurgi",
    slug: { _type: "slug", current: "robotkirurgi" },
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: heroAssetId },
    },
    introTexts: [
      "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.",
      "Robotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning.",
      "Robotassistert kirurgi har mange fordeler, og er ofte foretrukket ved kompliserte operasjoner, spesielt når man kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner, både under og etter operasjonen. De fleste pasientene kan reise hjem innen ett døgn etter behandlingen.",
    ],
    sections: [
      {
        _key: "section-bullets",
        heading: "Vi tilbyr robotassistert kirurgi innen blant annet",
        paragraphs: [],
        bulletPoints: [
          "Muskelknuter (fertilitetsbevarende kirurgi)",
          "Dyp endometriose",
          "Hysterektomi, også ved forstørret livmor",
          "Brokk",
          "Godartet forstørret prostata (RASP)",
          "Prostatakreft (RALP)",
        ],
      },
      {
        _key: "section-rehab",
        heading: "Rask rehabilitering",
        paragraphs: [
          "Robotkirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling.",
          "Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.",
          "Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–3 uker.",
        ],
      },
      {
        _key: "section-precision",
        heading: "Presisjon som merkes",
        paragraphs: [
          "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep.",
          "Under robotkirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse, noe som igjen reduserer risikoen for feil.",
          "Robotkirurgi hos oss utføres av spesialister innen urologi og gynekologi. Målet er alltid det samme: å gi deg den tryggeste behandlingen og den best mulige opplevelsen.",
        ],
      },
    ],
    ctaText: "Bestill time",
    ctaLink: "/booking",
  };

  console.log("Creating Robotkirurgi theme page...");
  await client.createOrReplace(robotkirurgiPage);
  console.log("✅ Robotkirurgi theme page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
