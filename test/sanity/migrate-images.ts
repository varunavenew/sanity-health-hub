#!/usr/bin/env npx tsx
/**
 * Sanity Image Migration Script
 *
 * Uploads hero images from local assets to Sanity and patches
 * treatment + treatmentCategory documents with image references.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-images.ts
 */

import { sanityClient } from "./config";
import * as fs from "fs";
import * as path from "path";

// ─── Image mappings ──────────────────────────────────────────────────

// Category images: categoryDocId → local file path (relative to project root)
const categoryImages: Record<string, string> = {
  "category-gynekologi": "../../src/assets/categories/gynekologi.jpg",
  "category-fertilitet": "../../src/assets/categories/fertilitet.jpg",
  "category-urologi": "../../src/assets/categories/urologi.jpg",
  "category-ortopedi": "../../src/assets/categories/ortopedi.jpg",
  "category-flere-fagomrader": "../../src/assets/categories/flere-fagomrader.jpg",
};

// Treatment images: treatmentSlug → local file path
// Maps each treatment to its appropriate hero image
const treatmentImageMap: Record<string, string> = {
  // Gynekologi treatments → gynekologi image
  "tverrfaglig": "../../src/assets/categories/gynekologi.jpg",
  "undersokelse": "../../src/assets/categories/gynekologi.jpg",
  "celleprove": "../../src/assets/categories/gynekologi.jpg",
  "hpv": "../../src/assets/categories/gynekologi.jpg",
  "endometriose": "../../src/assets/categories/gynekologi.jpg",
  "livmortransplantasjon": "../../src/assets/categories/gynekologi.jpg",
  "muskelknuter": "../../src/assets/categories/gynekologi.jpg",
  "eggstokkcyster": "../../src/assets/categories/gynekologi.jpg",
  "bekkenorganprolaps": "../../src/assets/categories/gynekologi.jpg",
  "overgangsalder": "../../src/assets/categories/gynekologi.jpg",
  "p-stav": "../../src/assets/categories/gynekologi.jpg",
  "hormonspiral": "../../src/assets/categories/gynekologi.jpg",
  "vulvasmerter": "../../src/assets/categories/gynekologi.jpg",
  "blodningsforstyrrelser": "../../src/assets/categories/gynekologi.jpg",
  "robotkirurgi": "../../src/assets/categories/gynekologi.jpg",

  // Graviditet treatments → pregnancy/family images
  "ultralyd": "../../src/assets/hero/hero-pregnancy.jpg",
  "nipt": "../../src/assets/hero/hero-pregnancy.jpg",
  "svangerskapsteam": "../../src/assets/hero/hero-family.jpg",
  "fosterdiagnostikk": "../../src/assets/hero/hero-pregnancy.jpg",

  // Fertilitet treatments
  "ivf": "../../src/assets/categories/fertilitet.jpg",
  "inseminasjon": "../../src/assets/categories/fertilitet.jpg",
  "eggdonasjon": "../../src/assets/categories/fertilitet.jpg",
  "fertilitetsutredning": "../../src/assets/categories/fertilitet.jpg",
  "nedfrysing-av-egg": "../../src/assets/categories/fertilitet.jpg",

  // Urologi treatments
  "prostataplager": "../../src/assets/categories/urologi.jpg",
  "urinveisinfeksjon": "../../src/assets/categories/urologi.jpg",
  "urinlekkasje": "../../src/assets/categories/urologi.jpg",
  "erektil-dysfunksjon": "../../src/assets/categories/urologi.jpg",
  "vasektomi": "../../src/assets/categories/urologi.jpg",
  "overaktiv-blare": "../../src/assets/categories/urologi.jpg",
  "urologisk-undersokelse": "../../src/assets/categories/urologi.jpg",

  // Ortopedi treatments
  "ortopedisk-undersokelse": "../../src/assets/categories/ortopedi.jpg",
  "idrettsskader": "../../src/assets/categories/ortopedi.jpg",
  "kne": "../../src/assets/categories/ortopedi.jpg",
  "skulder": "../../src/assets/categories/ortopedi.jpg",
  "hofte": "../../src/assets/categories/ortopedi.jpg",
  "rygg": "../../src/assets/categories/ortopedi.jpg",

  // Flere fagområder
  "osteopati": "../../src/assets/categories/flere-fagomrader.jpg",
  "sexologi": "../../src/assets/categories/flere-fagomrader.jpg",
  "psykologi": "../../src/assets/categories/flere-fagomrader.jpg",
  "ernaringsfysiolog": "../../src/assets/categories/flere-fagomrader.jpg",
  "uroterapeut": "../../src/assets/categories/flere-fagomrader.jpg",
};

// Also add a graviditet category image
categoryImages["category-graviditet"] = "../../src/assets/hero/hero-pregnancy.jpg";

// ─── Upload helper ───────────────────────────────────────────────────

// Cache to avoid re-uploading the same file
const uploadCache = new Map<string, string>();

async function uploadImage(filePath: string): Promise<string> {
  const absolutePath = path.resolve(__dirname, filePath);

  // Check cache
  if (uploadCache.has(absolutePath)) {
    return uploadCache.get(absolutePath)!;
  }

  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ File not found: ${absolutePath}`);
    return "";
  }

  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).replace(".", "");
  const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg"
    : ext === "png" ? "image/png"
    : ext === "webp" ? "image/webp"
    : "image/jpeg";

  console.log(`  📤 Uploading ${path.basename(absolutePath)}...`);

  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: path.basename(absolutePath),
    contentType,
  });

  const assetId = asset._id;
  uploadCache.set(absolutePath, assetId);
  console.log(`  ✓ Uploaded → ${assetId}`);
  return assetId;
}

// ─── Main migration ─────────────────────────────────────────────────

async function migrate() {
  console.log("🖼  Sanity Image Migration");
  console.log("=".repeat(50));

  // 1. Upload & patch category images
  console.log("\n📁 Uploading category images...");
  for (const [docId, filePath] of Object.entries(categoryImages)) {
    const assetId = await uploadImage(filePath);
    if (!assetId) continue;

    await sanityClient
      .patch(docId)
      .set({
        heroImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        },
      })
      .commit();
    console.log(`  ✓ Patched ${docId}`);
  }

  // 2. Fetch all treatment documents to get their _id and slug
  console.log("\n📁 Fetching treatment documents...");
  const treatments = await sanityClient.fetch<
    { _id: string; slug: string }[]
  >(`*[_type == "treatment"]{ _id, "slug": slug.current }`);

  console.log(`  Found ${treatments.length} treatments`);

  // 3. Upload & patch treatment images
  console.log("\n📁 Uploading treatment images...");
  for (const treatment of treatments) {
    const filePath = treatmentImageMap[treatment.slug];
    if (!filePath) {
      console.log(`  ⏭ No image mapped for: ${treatment.slug}`);
      continue;
    }

    const assetId = await uploadImage(filePath);
    if (!assetId) continue;

    await sanityClient
      .patch(treatment._id)
      .set({
        heroImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        },
      })
      .commit();
    console.log(`  ✓ Patched treatment: ${treatment.slug}`);
  }

  console.log("\n✅ Image migration complete!");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
