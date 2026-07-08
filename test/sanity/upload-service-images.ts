/**
 * Upload every service hero image from `src/assets/services/*.jpg.asset.json`
 * pointers into Sanity, and set `heroImage` on the matching `treatment` /
 * `treatmentCategory` document.
 *
 * Idempotent: skips documents that already have a `heroImage`.
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-service-images.ts          # dry-run (default)
 *   SANITY_TOKEN=xxx npx tsx test/sanity/upload-service-images.ts --write  # actually patch
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

// Mirror ALIAS/SUB_ALIAS/CROSS_CATEGORY_ALIAS from src/data/serviceImages.ts.
// The upload script maps IMAGE SLUG → (categoryId, subId) on the ROUTE side
// so we can find the matching Sanity document. Since Sanity mirrors the
// route shape (categoryId "flere-fagomrader", treatment slug "brokk"),
// image slug "flere-<sub>" must map back to categoryId "flere-fagomrader".

const IMAGE_TO_CATEGORY: Record<string, string> = {
  flere: "flere-fagomrader",
};

// Skip these image slugs — not treatment/category hero images.
const SKIP_PREFIXES = ["mobil-"];

// Route subId → Sanity treatment slug (Norwegian). Only entries where the
// image slug differs from the actual Sanity slug.
const ROUTE_TO_SANITY_SLUG: Record<string, string> = {
  "fertilitet/fertilitetsteamet": "teamet",
  "gynekologi/tverrfaglig-team": "tverrfaglig",
  "gynekologi/vaginalt-fremfall": "vaginale-fremfall",
  "gynekologi/cyster-pa-eggstokkene": "cyster",
  "gynekologi/gynekologisk-undersokelse": "undersokelse",
  "gynekologi/gynekologisk-kirurgi": "kirurgi",
};

// Given an image slug like "gynekologi-tverrfaglig-team" or
// "flere-overvektskirurgi", derive { categoryId, subId }.
function parseImageSlug(fileBase: string): { categoryId: string; subId?: string } {
  const dash = fileBase.indexOf("-");
  if (dash === -1) return { categoryId: fileBase };
  const catRaw = fileBase.slice(0, dash);
  const rest = fileBase.slice(dash + 1);
  const categoryId = IMAGE_TO_CATEGORY[catRaw] ?? catRaw;
  if (rest === "hero") return { categoryId };
  return { categoryId, subId: rest };
}


async function main() {
  const dryRun = !process.argv.includes("--write");
  console.log(dryRun ? "🔍 DRY-RUN (pass --write to apply)" : "✍️  WRITE mode");

  const dir = path.resolve(__dirname, "../../src/assets/services");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".jpg.asset.json"));

  console.log(`Found ${files.length} asset pointers.`);

  // Fetch every treatmentCategory + treatment with current heroImage state.
  const [categories, treatments] = await Promise.all([
    sanityClient.fetch<Array<{ _id: string; categoryId?: string; slug?: string; heroImage?: any }>>(
      `*[_type == "treatmentCategory"]{
        _id,
        categoryId,
        "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
        heroImage
      }`
    ),
    sanityClient.fetch<Array<{ _id: string; slug?: string; category?: { categoryId?: string; slug?: string }; heroImage?: any }>>(
      `*[_type == "treatment"]{
        _id,
        "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
        "category": category->{
          categoryId,
          "slug": coalesce(slug[language == "no"][0].value.current, slug.current)
        },
        heroImage
      }`
    ),
  ]);

  const catByKey = new Map<string, typeof categories[number]>();
  for (const c of categories) {
    const key = c.categoryId || c.slug;
    if (key) catByKey.set(key, c);
  }
  const treatmentByKey = new Map<string, typeof treatments[number]>();
  for (const t of treatments) {
    const catId = t.category?.categoryId || t.category?.slug;
    const slug = t.slug;
    if (catId && slug) treatmentByKey.set(`${catId}/${slug}`, t);
  }


  let uploaded = 0;
  let skippedHasImage = 0;
  const unmatched: string[] = [];

  for (const file of files) {
    const pointerPath = path.join(dir, file);
    const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8"));
    const fileBase = file.replace(/\.jpg\.asset\.json$/, "");

    if (SKIP_PREFIXES.some((p) => fileBase.startsWith(p))) continue;

    const { categoryId, subId } = parseImageSlug(fileBase);
    const sanitySub = subId
      ? ROUTE_TO_SANITY_SLUG[`${categoryId}/${subId}`] ?? subId
      : undefined;

    const target = sanitySub
      ? treatmentByKey.get(`${categoryId}/${sanitySub}`)
      : catByKey.get(categoryId);

    if (!target) {
      unmatched.push(`${fileBase} → ${categoryId}${sanitySub ? "/" + sanitySub : " (category)"}`);
      continue;
    }


    const overwrite = process.argv.includes("--overwrite");
    if (target.heroImage?.asset && !overwrite) {
      skippedHasImage++;
      continue;
    }

    console.log(`→ ${fileBase} → ${target._id}`);
    if (dryRun) {
      uploaded++;
      continue;
    }

    // Download from CDN, upload to Sanity, patch document.
    // Pointer URL is relative to the Lovable preview host.
    const HOST =
      process.env.LOVABLE_ASSET_HOST ||
      "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";
    const url = pointer.url?.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ✗ download failed (${res.status}) for ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const asset = await sanityClient.assets.upload("image", buf, {
      filename: pointer.original_filename || `${fileBase}.jpg`,
      contentType: pointer.content_type || "image/jpeg",
    });
    await sanityClient
      .patch(target._id)
      .set({ heroImage: { _type: "image", asset: { _type: "reference", _ref: asset._id } } })
      .commit();
    uploaded++;
  }

  console.log("");
  console.log("── Summary ──────────────────────────────");
  console.log(`Uploaded / would-upload : ${uploaded}`);
  console.log(`Skipped (already set)   : ${skippedHasImage}`);
  console.log(`Unmatched               : ${unmatched.length}`);
  if (unmatched.length) {
    console.log("");
    console.log("Unmatched pointers (need alias or missing Sanity doc):");
    for (const u of unmatched) console.log("  •", u);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
