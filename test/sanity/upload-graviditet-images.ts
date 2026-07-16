/**
 * Image-upload pass for the graviditet landing page.
 *
 * Uploads local/CDN images to Sanity and patches them into the correct
 * fields on the graviditet treatmentCategory document:
 *
 *   • heroImage                                   ← graviditet-hero.jpg
 *   • landingPage.whySection.image                ← hero-clinic-lounge.jpg
 *   • landingPage.expertAreasSection.areas[N]     ← matched by NO title
 *       ultralyd / nipt / fosterdiagnostikk / svangerskapsteam
 *   • landingPage.spotlightSection.image          ← graviditet-ultralyd.jpg
 *
 * Idempotent: skips any slot that already has an image (use FORCE=1 to overwrite).
 * Reuses a single upload per source file across slots.
 *
 * Run with:
 *   cd test
 *   SANITY_TOKEN=<token> npx tsx sanity/upload-graviditet-images.ts --dry-run
 *   SANITY_TOKEN=<token> npx tsx sanity/upload-graviditet-images.ts
 *   SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/upload-graviditet-images.ts
 */

import * as fs from "fs";
import * as path from "path";
import { sanityClient as client } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";
const CATEGORY_ID = "graviditet";

const HOST =
  process.env.LOVABLE_ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

const ROOT = path.resolve(__dirname, "../..");

/* ─── Sources ─────────────────────────────────────────────────────────── */

type Src =
  | { kind: "pointer"; pointerPath: string }
  | { kind: "file"; filePath: string; filename: string; contentType: string };

const SOURCES = {
  heroImg:      { kind: "pointer", pointerPath: "src/assets/services/graviditet-hero.jpg.asset.json" } satisfies Src,
  ultralyd:     { kind: "pointer", pointerPath: "src/assets/services/graviditet-ultralyd.jpg.asset.json" } satisfies Src,
  nipt:         { kind: "pointer", pointerPath: "src/assets/services/graviditet-nipt.jpg.asset.json" } satisfies Src,
  fosterdiag:   { kind: "pointer", pointerPath: "src/assets/services/graviditet-fosterdiagnostikk.jpg.asset.json" } satisfies Src,
  team:         { kind: "pointer", pointerPath: "src/assets/services/graviditet-svangerskapsteam.jpg.asset.json" } satisfies Src,
  clinicLounge: { kind: "file", filePath: "src/assets/hero/hero-clinic-lounge.jpg", filename: "hero-clinic-lounge.jpg", contentType: "image/jpeg" } satisfies Src,
} as const;

type SourceKey = keyof typeof SOURCES;

/* Map expertAreasSection.areas[].title[NO] → source */
const AREA_TITLE_TO_SOURCE: Record<string, SourceKey> = {
  "Tidlig ultralyd": "ultralyd",
  "NIPT": "nipt",
  "Fosterdiagnostikk uke 12–14": "fosterdiag",
  "Graviditetsoppfølging": "team",
};

/* ─── Helpers ─────────────────────────────────────────────────────────── */

async function fetchWithRetry(url: string, attempts = 4): Promise<Buffer | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      console.warn(`  … attempt ${i} HTTP ${res.status} for ${url}`);
    } catch (err: any) {
      console.warn(`  … attempt ${i} failed: ${err?.code || err?.message || err}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

async function loadSourceBuffer(src: Src): Promise<{ buf: Buffer; filename: string; contentType: string } | null> {
  if (src.kind === "file") {
    const abs = path.join(ROOT, src.filePath);
    if (!fs.existsSync(abs)) {
      console.warn(`  ✗ missing local file: ${abs}`);
      return null;
    }
    return { buf: fs.readFileSync(abs), filename: src.filename, contentType: src.contentType };
  }
  const abs = path.join(ROOT, src.pointerPath);
  if (!fs.existsSync(abs)) {
    console.warn(`  ✗ missing pointer file: ${abs}`);
    return null;
  }
  const pointer = JSON.parse(fs.readFileSync(abs, "utf-8"));
  const url = pointer.url?.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;
  const buf = await fetchWithRetry(url);
  if (!buf) return null;
  return {
    buf,
    filename: pointer.original_filename || path.basename(src.pointerPath).replace(/\.asset\.json$/, ""),
    contentType: pointer.content_type || "image/jpeg",
  };
}

const uploadCache = new Map<SourceKey, string>(); // sourceKey → sanity asset _id

async function uploadOnce(key: SourceKey): Promise<string | null> {
  if (uploadCache.has(key)) return uploadCache.get(key)!;
  const loaded = await loadSourceBuffer(SOURCES[key]);
  if (!loaded) return null;
  if (DRY_RUN) {
    console.log(`  ⤴  [dry-run] would upload ${loaded.filename} (${loaded.buf.length} bytes)`);
    uploadCache.set(key, `image-dryrun-${key}`);
    return `image-dryrun-${key}`;
  }
  console.log(`  ⤴  uploading ${loaded.filename} …`);
  const asset = await client.assets.upload("image", loaded.buf, {
    filename: loaded.filename,
    contentType: loaded.contentType,
  });
  uploadCache.set(key, asset._id);
  return asset._id;
}

const imageRef = (assetId: string) => ({
  _type: "image",
  asset: { _type: "reference", _ref: assetId },
});

/* ─── Main ────────────────────────────────────────────────────────────── */

async function main() {
  console.log(`🖼  Graviditet image-upload pass${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " [FORCE]" : ""}\n`);

  const doc = await client.fetch<any>(
    `*[_type == "treatmentCategory" && categoryId == $cid][0]{
      _id, heroImage, landingPage
    }`,
    { cid: CATEGORY_ID }
  );
  if (!doc) {
    console.error(`❌ No treatmentCategory found with categoryId="${CATEGORY_ID}".`);
    process.exit(1);
  }
  console.log(`Found doc: ${doc._id}\n`);

  const patch: Record<string, unknown> = {};
  const unset: string[] = [];

  /* 1. heroImage (top-level) */
  if (doc.heroImage?.asset && !FORCE) {
    console.log("  ⏭  heroImage already set");
  } else {
    const id = await uploadOnce("heroImg");
    if (id) {
      patch["heroImage"] = imageRef(id);
      console.log("  ✅ heroImage");
    }
  }

  /* 2. landingPage.whySection.image */
  const whyImg = doc.landingPage?.whySection?.image;
  if (whyImg?.asset && !FORCE) {
    console.log("  ⏭  landingPage.whySection.image already set");
  } else {
    const id = await uploadOnce("clinicLounge");
    if (id) {
      patch["landingPage.whySection.image"] = imageRef(id);
      console.log("  ✅ landingPage.whySection.image");
    }
  }

  /* 3. landingPage.spotlightSection.image */
  const spotImg = doc.landingPage?.spotlightSection?.image;
  if (spotImg?.asset && !FORCE) {
    console.log("  ⏭  landingPage.spotlightSection.image already set");
  } else {
    const id = await uploadOnce("ultralyd");
    if (id) {
      patch["landingPage.spotlightSection.image"] = imageRef(id);
      console.log("  ✅ landingPage.spotlightSection.image");
    }
  }

  /* 4. landingPage.expertAreasSection.areas[].image — match by NO title, target by _key */
  const areas: any[] = doc.landingPage?.expertAreasSection?.areas || [];
  if (areas.length === 0) {
    console.warn("  ⚠  landingPage.expertAreasSection.areas is empty — run migrate-graviditet-landing.ts first.");
  }
  for (const area of areas) {
    const titleNo = Array.isArray(area?.title)
      ? area.title.find((v: any) => (v.language || v._key) === "no")?.value
      : undefined;
    const key = area?._key;
    if (!titleNo || !key) continue;
    const srcKey = AREA_TITLE_TO_SOURCE[titleNo];
    if (!srcKey) {
      console.warn(`  ⚠  no image source mapped for expert area "${titleNo}"`);
      continue;
    }
    if (area.image?.asset && !FORCE) {
      console.log(`  ⏭  expert area "${titleNo}" image already set`);
      continue;
    }
    const id = await uploadOnce(srcKey);
    if (!id) continue;
    patch[`landingPage.expertAreasSection.areas[_key=="${key}"].image`] = imageRef(id);
    console.log(`  ✅ expert area "${titleNo}" → ${srcKey}`);
  }

  if (Object.keys(patch).length === 0) {
    console.log("\nNothing to do.");
    return;
  }

  if (DRY_RUN) {
    console.log("\nDry run — no changes committed.");
    console.log("Would patch keys:", Object.keys(patch));
    return;
  }

  console.log("\n⏳ Committing patch…");
  let p = client.patch(doc._id);
  for (const [k, v] of Object.entries(patch)) p = p.set({ [k]: v });
  if (unset.length) p = p.unset(unset);
  await p.commit({ autoGenerateArrayKeys: false });
  console.log("✅ Done.");
}

main().catch((err) => {
  console.error("❌ Upload pass failed:", err);
  process.exit(1);
});
