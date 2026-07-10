/**
 * Upload clinic images from `src/assets/clinics/` into Sanity, setting
 * `primaryImage` and `gallery` on each matching `clinicPage` document.
 *
 * Idempotent: skips fields that already have an asset unless --overwrite.
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-images.ts           # dry-run
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-images.ts --write   # apply
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-clinic-images.ts --write --overwrite
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/clinics");
const HOST =
  process.env.LOVABLE_ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

// clinicSlug -> primary image file (relative to ASSETS_DIR).
// Either a raw .jpg on disk, or a `.asset.json` CDN pointer.
const PRIMARY: Record<string, string> = {
  majorstuen: "majorstuen.jpg",
  bekkestua: "bekkestua.jpg",
  moss: "moss.jpg",
  moelv: "moelv.jpg",
};

// clinicSlug -> gallery items (file + alt).
const GALLERY: Record<string, { file: string; alt: string }[]> = {
  majorstuen: [
    { file: "majorstuen/venterom-tv.asset.json", alt: "Venterom med skjerm, planter og lounge-stoler på CMedical Majorstuen" },
    { file: "majorstuen/korridor-sittegruppe.asset.json", alt: "Korridor med sittegruppe og treverk på CMedical Majorstuen" },
    { file: "majorstuen/korridor.asset.json", alt: "Lys korridor med trepanel på CMedical Majorstuen" },
    { file: "majorstuen/hvilerom.asset.json", alt: "Rolig hvilerom med dempet lys på CMedical Majorstuen" },
    { file: "majorstuen/venterom-detalj.asset.json", alt: "Detalj fra venterom på CMedical Majorstuen" },
  ],
};

async function fetchWithRetry(url: string, attempts = 4): Promise<Response | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return res;
      console.warn(`  … attempt ${i} HTTP ${res.status} for ${url}`);
    } catch (err: any) {
      console.warn(`  … attempt ${i} failed: ${err?.code || err?.message || err}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

async function loadBuffer(rel: string): Promise<{ buf: Buffer; filename: string; contentType: string } | null> {
  const abs = path.join(ASSETS_DIR, rel);
  if (rel.endsWith(".asset.json")) {
    const pointer = JSON.parse(fs.readFileSync(abs, "utf-8"));
    const url = pointer.url?.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;
    const res = await fetchWithRetry(url);
    if (!res) return null;
    return {
      buf: Buffer.from(await res.arrayBuffer()),
      filename: pointer.original_filename || path.basename(rel).replace(".asset.json", ""),
      contentType: pointer.content_type || "image/jpeg",
    };
  }
  return {
    buf: fs.readFileSync(abs),
    filename: path.basename(rel),
    contentType: rel.endsWith(".png") ? "image/png" : "image/jpeg",
  };
}

async function uploadAsset(rel: string): Promise<string | null> {
  const loaded = await loadBuffer(rel);
  if (!loaded) {
    console.warn(`  ✗ could not load ${rel}`);
    return null;
  }
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
  if (overwrite) console.log("⚠️  --overwrite: existing images will be replaced");

  const clinics = await sanityClient.fetch<
    Array<{ _id: string; slug?: string; primaryImage?: any; gallery?: any[] }>
  >(`*[_type == "clinicPage"]{
    _id,
    "slug": slug.current,
    primaryImage,
    gallery
  }`);

  // Match by slug when present, otherwise fall back to `_id` suffix
  // (docs are stored as `clinicPage-<slug>` in this dataset).
  const bySlug = new Map<string, typeof clinics[number]>();
  for (const c of clinics) {
    const key = c.slug || c._id.replace(/^clinicPage-/, "");
    bySlug.set(key, c);
  }
  console.log(`Found ${clinics.length} clinicPage docs in Sanity.\n`);

  for (const [slug, file] of Object.entries(PRIMARY)) {
    const doc = bySlug.get(slug);
    if (!doc) {
      console.warn(`• ${slug}: no matching clinicPage in Sanity — skipping primary`);
      continue;
    }
    if (doc.primaryImage?.asset && !overwrite) {
      console.log(`• ${slug}: primary already set — skip`);
    } else {
      console.log(`• ${slug}: primary ← ${file}`);
      if (!dryRun) {
        const assetId = await uploadAsset(file);
        if (assetId) {
          await sanityClient
            .patch(doc._id)
            .set({ primaryImage: { _type: "image", asset: { _type: "reference", _ref: assetId } } })
            .commit();
        }
      }
    }

    const galleryItems = GALLERY[slug];
    if (!galleryItems) continue;
    if (doc.gallery?.length && !overwrite) {
      console.log(`  gallery already set (${doc.gallery.length}) — skip`);
      continue;
    }
    console.log(`  gallery ← ${galleryItems.length} images`);
    if (dryRun) continue;
    const items: any[] = [];
    for (const g of galleryItems) {
      const assetId = await uploadAsset(g.file);
      if (!assetId) continue;
      items.push({
        _type: "image",
        _key: Math.random().toString(36).slice(2, 10),
        asset: { _type: "reference", _ref: assetId },
        alt: g.alt,
      });
    }
    await sanityClient.patch(doc._id).set({ gallery: items }).commit();
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
