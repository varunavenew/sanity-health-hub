// Migration: Populate Pricing Page (Priser) in Sanity
// Run: npx ts-node --esm sanity/migrate-priser.ts

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
  const heroAssetId = await uploadImage("pricing-hero.jpg");

  const pricingPage = {
    _type: "pricingPage",
    _id: "pricingPage",
    title: "Prisliste",
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: heroAssetId },
    },
    introText: "Oversiktlige priser sortert etter fagområde",
    priceCategories: [
      {
        _key: "gynekologi",
        categoryName: "Gynekologi",
        items: [
          { _key: "g1", name: "Gynekologisk undersøkelse", price: 2100, priceLabel: "2100,-", note: "30 min" },
          { _key: "g2", name: "Kontroll / oppfølging", price: 2100, priceLabel: "2100,-", note: "30 min" },
          { _key: "g3", name: "Digitaltime Gynekolog", price: 2100, priceLabel: "2100,-", note: "20 min" },
          { _key: "g4", name: "Overgangsalder", price: 3200, priceLabel: "3200,-", note: "45 min" },
          { _key: "g5", name: "PCOS / Hormonforstyrrelser", price: 3200, priceLabel: "3200,-", note: "45 min" },
          { _key: "g6", name: "Endometriose / adenomyose", price: 3200, priceLabel: "3200,-", note: "45 min" },
          { _key: "g7", name: "Svangerskapskontroll", price: 2100, priceLabel: "2100,-", note: "30 min" },
          { _key: "g8", name: "Tidlig ultralyd enkel", price: 2100, priceLabel: "2100,-", note: "30 min" },
          { _key: "g9", name: "Hudlidelser vulva", price: 2100, priceLabel: "2100,-", note: "30 min" },
        ],
      },
      {
        _key: "urologi",
        categoryName: "Urologi",
        items: [
          { _key: "u1", name: "Prostataundersøkelse", price: 1900, priceLabel: "1900,-", note: "30 min" },
          { _key: "u2", name: "Konsultasjon urolog", price: 1900, priceLabel: "1900,-", note: "30 min" },
          { _key: "u3", name: "Blod i urin, cystoskopi", price: 2650, priceLabel: "2650,-", note: "30 min" },
          { _key: "u4", name: "Sterilisering Mann", price: 6500, priceLabel: "6500,-", note: "30 min" },
        ],
      },
      {
        _key: "fertilitet",
        categoryName: "Fertilitet",
        items: [
          { _key: "f1", name: "Fertilitetsutredning enkeltperson/single", price: 2850, priceLabel: "2850,-", note: "1 time" },
          { _key: "f2", name: "Fertilitetsutredning par", price: 2850, priceLabel: "2850,-", note: "1 time" },
          { _key: "f3", name: "Enkel sædanalyse", price: 1950, priceLabel: "1950,-", note: "30 min" },
          { _key: "f4", name: "Tidlig ultralyd + NIPT-test", price: 8990, priceLabel: "8990,-", note: "30 min" },
        ],
      },
      {
        _key: "ortopedi",
        categoryName: "Ortopedi",
        items: [
          { _key: "o1", name: "Konsultasjon ortoped", price: 1800, priceLabel: "1800,-", note: "30 min" },
          { _key: "o2", name: "Konsultasjon håndterapeut", price: 1400, priceLabel: "1400,-", note: "45 min" },
          { _key: "o3", name: "Fysioterapeut / Osteopat 60 min", price: 1800, priceLabel: "1800,-", note: "1 time" },
        ],
      },
      {
        _key: "psykologi",
        categoryName: "Psykologi",
        items: [
          { _key: "ps1", name: "Psykolog 50 min", price: 1900, priceLabel: "1900,-", note: "1 time" },
          { _key: "ps2", name: "Psykolog 80 min", price: 2500, priceLabel: "2500,-", note: "1 time 30 min" },
          { _key: "ps3", name: "Psykolog partime 50 min", price: 2300, priceLabel: "2300,-", note: "1 time" },
        ],
      },
    ],
    insuranceNote: "De fleste av våre behandlinger dekkes av helseforsikring. Ta kontakt med ditt forsikringsselskap for å bekrefte dekning.",
    seo: {
      metaTitle: "Priser | CMedical - Oversiktlige priser for alle behandlinger",
      metaDescription: "Se priser for gynekologi, urologi, fertilitet, ortopedi og mer hos CMedical. Ingen henvisning nødvendig.",
    },
  };

  console.log("Creating Pricing page...");
  await client.createOrReplace(pricingPage);
  console.log("✅ Pricing page created successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
