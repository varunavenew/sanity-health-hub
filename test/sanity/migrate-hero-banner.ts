/**
 * Migrate Hero Banner slides (images + content) to the Homepage document in Sanity
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-hero-banner.ts
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
  console.log("🚀 Migrating Hero Banner slides...\n");

  // Ensure homepage document exists
  await client.createIfNotExists({
    _id: HOMEPAGE_ID,
    _type: "homepage",
    title: "CMedical – Forside",
  });

  // Upload hero images
  console.log("Uploading hero images...");
  const kvinnehelseId = await uploadImage("kvinnehelse-hero.jpg");
  const fertilitetId = await uploadImage("fertility-hero.jpg");
  const robotkirurgiId = await uploadImage("robotkirurgi-hero.jpg");

  const slides: any[] = [
    {
      _key: "slide-kvinnehelse",
      heading: "Kvinnehelse\nfor livet",
      subheading: "Kvinnehelse",
      ctaText: "Les mer",
      ctaLink: "/kvinnehelse",
      ...(kvinnehelseId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: kvinnehelseId },
        },
      }),
    },
    {
      _key: "slide-fertilitet",
      heading: "Ledende miljø\ninnen fertilitet",
      subheading: "Fertilitetsteamet",
      ctaText: "Les mer",
      ctaLink: "/fertilitet",
      ...(fertilitetId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: fertilitetId },
        },
      }),
    },
    {
      _key: "slide-robotkirurgi",
      heading: "Robotassistert\nkirurgi",
      subheading: "Teknologi",
      ctaText: "Les mer",
      ctaLink: "/robotassistert-kirurgi",
      ...(robotkirurgiId && {
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: robotkirurgiId },
        },
      }),
    },
  ];

  await client
    .patch(HOMEPAGE_ID)
    .set({
      heroBanner: {
        slides,
      },
    })
    .commit();

  console.log(`\n✅ Hero Banner migrated (${slides.length} slides with images)`);
  console.log("✅ Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
