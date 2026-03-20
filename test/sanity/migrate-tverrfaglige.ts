// Migration: Populate Tverrfaglige team theme page in Sanity (with hero image)
// Run: npx ts-node --esm sanity/migrate-tverrfaglige.ts

import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

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
  const heroAssetId = await uploadImage("tverrfaglig-team.jpg");

  const tverrfagligePage = {
    _type: "themePage",
    _id: "themePage-tverrfaglige-team",
    title: "Tverrfaglige team",
    slug: { _type: "slug", current: "tverrfaglige-team" },
    heroImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: heroAssetId,
      },
    },
    introTexts: [],
    sections: [
      {
        _key: "section-1",
        heading: "Tverrfaglige team – helhetlig behandling som standard",
        paragraphs: [
          "Hos CMedical er tverrfaglighet en etablert arbeidsform på tvers av fagområder og pasientgrupper. Vi vet at mange helseutfordringer sjelden er isolerte. Fysiske symptomer kan henge sammen med psykiske belastninger, hormonelle forhold, livsstil eller funksjonelle plager. Derfor samarbeider våre spesialister tett – fra første vurdering til oppfølging.",
          "Våre leger arbeider innenfor sine definerte spesialfelt, og ved behov settes det sammen dedikerte ekspertteam rundt pasienten. Teamene kan bestå av osteopat, psykolog, sexolog, ernæringsfysiolog, fysioterapeut og uroterapeut – avhengig av medisinsk problemstilling og individuelle behov.",
          "Denne strukturerte samhandlingen gir mer presise vurderinger, bedre behandlingsforløp og større forutsigbarhet.",
        ],
      },
      {
        _key: "section-2",
        heading: "Samlet kompetanse – under samme tak",
        paragraphs: [
          "Vi tilbyr avansert kirurgi, inkludert robotassistert kirurgi, og var den første private aktøren i Norden som samlet IVF-behandling og gynekologisk kirurgi ved én og samme klinikk. Det betyr at utredning, eventuell kirurgi og videre behandling kan gjennomføres uten brudd i forløpet.",
          "Den samme modellen gjelder også innen behandling av mannlige helseutfordringer, blant annet innen fertilitet, hormonforstyrrelser og seksuell helse. Når medisinske, funksjonelle og psykososiale faktorer vurderes samlet, styrkes kvaliteten på behandlingen.",
        ],
      },
      {
        _key: "section-3",
        heading: "Behandling gjennom livets faser",
        paragraphs: [
          "Vi følger pasienter gjennom ulike livsfaser – fra fertilitetsutredning og svangerskap til hormonelle endringer, bekkenhelse, prostataplager, seksualhelse og forebyggende helsekontroller. Dersom plager oppstår senere i livet, tilbyr vi utredning, behandling og strukturert oppfølging med tilgang til relevant fagkompetanse.",
        ],
      },
      {
        _key: "section-4",
        heading: "En modell som gir trygghet",
        paragraphs: [
          "Tverrfaglighet hos CMedical er ikke et tilleggstilbud. Det er en integrert del av hvordan vi organiserer arbeidet. Når kompetansen er samlet fysisk og organisatorisk, reduseres ventetid, informasjonsbrudd og unødig belastning for pasienten.",
        ],
      },
    ],
    ctaText: "Bestill time",
    ctaLink: "/booking",
  };

  console.log("Creating Tverrfaglige team theme page...");
  await client.createOrReplace(tverrfagligePage);
  console.log("✅ Tverrfaglige team theme page created successfully (with hero image)!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
