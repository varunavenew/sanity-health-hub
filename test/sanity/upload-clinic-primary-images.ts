/**
 * Upload primary clinic images from `src/assets/clinics/` to Sanity
 * and patch `primaryImage` on the matching `clinicPage` document.
 *
 * Matches the current clinicPage schema (single `primaryImage` field —
 * no gallery). Idempotent: skips clinics that already have a primaryImage
 * unless `--overwrite` is passed.
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-primary-images.ts            # dry-run
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-primary-images.ts --write    # apply
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-primary-images.ts --write --overwrite
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/clinics");

// clinicSlug -> primary image filename (relative to ASSETS_DIR).
// Raw .jpg files on disk — one hero shot per clinic.
const PRIMARY: Record<string, string> = {
  majorstuen: "majorstuen.jpg",
  bekkestua: "bekkestua.jpg",
  moss: "moss.jpg",
  moelv: "moelv.jpg",
};

function loadBuffer(rel: string): { buf: Buffer; filename: string; contentType: string } | null {
  const abs = path.join(ASSETS_DIR, rel);
  if (!fs.existsSync(abs)) {
    console.warn(`  ✗ file not found: ${abs}`);
    return null;
  }
  return {
    buf: fs.readFileSync(abs),
    filename: path.basename(rel),
    contentType: rel.endsWith(".png") ? "image/png" : "image/jpeg",
  };
}

async function uploadAsset(rel: string): Promise<string | null> {
  const loaded = loadBuffer(rel);
  if (!loaded) return null;
  const asset = await sanityClient.assets.upload("image", loaded.buf, {
    filename: loaded.filename,
    contentType: loaded.contentType,
  });
  return asset._id;
}

async function main() {
  const dryRun = !process.argv.includes("--write");
  const overwrite = process.argv.includes("--overwrite");
  console.log(dryRun ? "🔍 DRY-RUN (pass --write to apply)" : "✍️  WRITE mode");
  if (overwrite) console.log("⚠️  --overwrite: existing primaryImage will be replaced");

  const clinics = await sanityClient.fetch<
    Array<{ _id: string; slug?: string; primaryImage?: any }>
  >(`*[_type == "clinicPage"]{
    _id,
    "slug": slug.current,
    primaryImage
  }`);

  const bySlug = new Map(clinics.map((c) => [c.slug || "", c]));
  console.log(`Found ${clinics.length} clinicPage docs in Sanity.\n`);

  for (const [slug, file] of Object.entries(PRIMARY)) {
    const doc = bySlug.get(slug);
    if (!doc) {
      console.warn(`• ${slug}: no matching clinicPage in Sanity — skipping`);
      continue;
    }
    if (doc.primaryImage?.asset && !overwrite) {
      console.log(`• ${slug}: primaryImage already set — skip`);
      continue;
    }
    console.log(`• ${slug}: primaryImage ← ${file}`);
    if (dryRun) continue;

    const assetId = await uploadAsset(file);
    if (!assetId) {
      console.warn(`  ✗ upload failed for ${file}`);
      continue;
    }
    await sanityClient
      .patch(doc._id)
      .set({
        primaryImage: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        },
      })
      .commit();
    console.log(`  ✓ patched ${doc._id}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
