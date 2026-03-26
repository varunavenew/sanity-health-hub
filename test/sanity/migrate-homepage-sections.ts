/**
 * Migrate StatsBar, ValueBadges, and PromoBlocks to the Homepage document in Sanity
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-homepage-sections.ts
 */
import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

const HOMEPAGE_ID = "homepage";

async function uploadImage(filename: string) {
  const absolutePath = path.resolve(__dirname, "../../src/assets/hero", filename);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`⚠️  Image not found: ${absolutePath}, skipping upload`);
    return null;
  }
  const imageBuffer = fs.readFileSync(absolutePath);
  const asset = await client.assets.upload("image", imageBuffer, {
    filename,
    contentType: "image/jpeg",
  });
  console.log(`✅ Uploaded image: ${filename} -> ${asset._id}`);
  return asset._id;
}

async function migrate() {
  console.log("🚀 Migrating homepage sections (StatsBar, ValueBadges, PromoBlocks)...\n");

  // Ensure homepage document exists
  await client.createIfNotExists({
    _id: HOMEPAGE_ID,
    _type: "homepage",
    title: "CMedical – Forside",
  });

  // Upload promo block images
  console.log("Uploading promo block images...");
  const robotkirurgiImageId = await uploadImage("robotkirurgi-hero.jpg");
  const tverrfagligImageId = await uploadImage("tverrfaglig-team.jpg");

  const promoBlocks: any[] = [
    {
      _key: "promo-1",
      title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
      ctaText: "Les mer",
      ctaLink: "/robotassistert-kirurgi",
      ...(robotkirurgiImageId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: robotkirurgiImageId },
        },
      }),
    },
    {
      _key: "promo-2",
      title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
      ctaText: "Les mer",
      ctaLink: "/tverrfaglige-team",
      ...(tverrfagligImageId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: tverrfagligImageId },
        },
      }),
    },
  ];

  await client
    .patch(HOMEPAGE_ID)
    .set({
      statsBar: [
        { _key: "stat-1", value: "15 000+", label: "pasienter behandlet" },
        { _key: "stat-2", value: "8+", label: "års erfaring med robotkirurgi" },
        { _key: "stat-3", value: "5", label: "klinikker i Norge" },
        { _key: "stat-4", value: "50+", label: "spesialister" },
      ],
      valueBadges: [
        { _key: "badge-1", icon: "ShieldCheck", label: "Trygg og moderne behandlingsteknologi" },
        { _key: "badge-2", icon: "Building2", label: "Behagelige lokaler" },
        { _key: "badge-3", icon: "Coins", label: "Tilgjengelig pris" },
      ],
      promoBlocks,
    })
    .commit();

  console.log("\n✅ StatsBar migrated (4 items)");
  console.log("✅ ValueBadges migrated (3 items)");
  console.log("✅ PromoBlocks migrated (2 items, with images)");
  console.log("\n✅ All homepage sections migrated successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
