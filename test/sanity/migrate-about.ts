// Migration: Populate About Page (Om oss) in Sanity (with hero image)
// Run: npx ts-node --esm sanity/migrate-about.ts

import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

async function uploadImage(filename: string, subfolder = "hero") {
  const absolutePath = path.resolve(__dirname, `../../src/assets/${subfolder}`, filename);
  const imageBuffer = fs.readFileSync(absolutePath);
  const asset = await client.assets.upload("image", imageBuffer, {
    filename,
    contentType: filename.endsWith(".webp") ? "image/webp" : "image/jpeg",
  });
  console.log(`✅ Uploaded image: ${filename} -> ${asset._id}`);
  return asset._id;
}

async function migrate() {
  console.log("Uploading hero image...");
  const heroAssetId = await uploadImage("hero-family.jpg");

  const aboutPage = {
    _type: "aboutPage",
    _id: "aboutPage",
    title: "Faglig trygghet og personlig omsorg – for din helse",
    subtitle: "Om CMedical",
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: heroAssetId },
    },
    body: [
      {
        _type: "block",
        _key: "p1",
        style: "normal",
        children: [{ _type: "span", _key: "s1", text: "Helse handler om mer enn behandling. Det handler om å bli sett, forstått og fulgt opp – uten unødige forsinkelser eller usikkerhet underveis." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p2",
        style: "normal",
        children: [{ _type: "span", _key: "s2", text: "CMedical er etablert på en tydelig erkjennelse: Mange opplever et helsevesen preget av ventetid, fragmenterte forløp og manglende kontinuitet. Vår rolle er å skape et alternativ – der høyspesialisert og tverrfaglig kompetanse kombineres med tilgjengelighet og ekte omsorg." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p3",
        style: "normal",
        children: [{ _type: "span", _key: "s3", text: "Vi skal forene det fremste innen medisinsk presisjon med varme, respekt og tydelig kommunikasjon. Pasienten skal oppleve trygghet i hvert møte, forutsigbarhet i hvert steg og kvalitet i alle ledd." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p4",
        style: "normal",
        children: [{ _type: "span", _key: "s4", text: "Kvinnehelse er et strategisk satsningsområde i CMedical. Kvinners helse har i for stor grad vært underprioritert, både som del av folkeopplysning, medisinsk tilbud og i forskning. Derfor bygger vi et helhetlig og subspesialisert tilbud som følger kvinnen gjennom hele livsløpet – fra pubertet og fertilitet til barneønske og graviditet, barseltid og før, under og etter overgangsalder. Ekspertteam innen blant annet endometriose, infertilitet, vulvalidelser, fødselsskader og menopause sikrer direkte tilgang til riktig kompetanse – uten omveier." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p5",
        style: "normal",
        children: [{ _type: "span", _key: "s5", text: "Ambisjonen er tydelig: Kvinnehelse for livet.", marks: ["strong"] }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p6",
        style: "normal",
        children: [{ _type: "span", _key: "s6", text: "Samtidig favner tilbudet bredt innen gynekologi, fertilitet, ortopedi og urologi – fra grundig utredning til avansert kirurgi. Tverrfaglige fagområder som osteopati, psykologi, sexologi og ernæring er integrert for å sikre en helhetlig tilnærming til både kropp og livssituasjon." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p7",
        style: "normal",
        children: [{ _type: "span", _key: "s7", text: "Teknologi tas i bruk der den gir dokumentert verdi. Som landets eneste private klinikk med robotassistert kirurgi kombineres innovasjon med erfaring for å gi mer presise og skånsomme inngrep. Hos oss kommer du til den beste hjelpen – raskt." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p8",
        style: "normal",
        children: [{ _type: "span", _key: "s8", text: "CMedical skal sette en ny standard for privat spesialisthelsetjeneste – der moderne teknologi, korte beslutningslinjer og høyeste kompetanse møtes i omgivelser preget av ro og verdighet." }],
        markDefs: [],
      },
      {
        _type: "block",
        _key: "p9",
        style: "normal",
        children: [{ _type: "span", _key: "s9", text: "Dette er vårt løfte: Faglig trygghet og personlig omsorg – for din helse, i alle livets faser.", marks: ["strong"] }],
        markDefs: [],
      },
    ],
    values: [
      { icon: "Heart", title: "Omsorg", description: "Personlig oppfølging og ekte omsorg i hvert møte" },
      { icon: "Shield", title: "Trygghet", description: "Faglig trygghet med de beste spesialistene" },
      { icon: "Zap", title: "Tilgjengelighet", description: "Kort ventetid og enkel tilgang til riktig kompetanse" },
    ],
    seo: {
      metaTitle: "Om oss | CMedical - Nordens ledende klinikk for livet og underlivet",
      metaDescription: "CMedical tilbyr faglig trygghet og personlig omsorg med høyspesialisert kompetanse innen gynekologi, fertilitet, urologi og ortopedi.",
    },
  };

  console.log("Creating About page...");
  await client.createOrReplace(aboutPage);
  console.log("✅ About page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
