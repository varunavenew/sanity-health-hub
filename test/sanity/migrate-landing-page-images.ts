/**
 * Migrate images into `treatmentCategory.landingPage.*` per the schema in
 * test/schemaTypes/categoryLandingPage.ts (or wherever categoryLandingPageField
 * is registered on treatmentCategory).
 *
 * Sections that hold images (per schema):
 *   - whySection.image                  (single sidebar image)
 *   - expertAreasSection.areas[].image  (per-card; matched by href)
 *   - symptomsSection.items[].image     (per-row;  matched by href)
 *   - supportSection.areas[].image      (per-card; matched by href)
 *   - spotlightSection.image            (single)
 *
 * The hero image is NOT part of landingPage in the schema — it's the root
 * `treatmentCategory.heroImage` (handled by upload-service-images.ts).
 *
 * Image resolution:
 *   - For each item with an internal href like `/behandlinger/<cat>/<sub>`
 *     or `/<cat>/<sub>`, we resolve the CDN pointer via the same alias
 *     tables used at runtime (src/data/serviceImages.ts).
 *   - whySection.image + spotlightSection.image fall back to the category
 *     hero image if nothing better is available (only if currently empty).
 *
 * Idempotent: skips items that already have `image.asset` set.
 * Cache: identical pointer URLs are uploaded to Sanity once.
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-landing-page-images.ts           # dry-run
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-landing-page-images.ts --write   # apply
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-landing-page-images.ts --write --overwrite
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

// ─── Alias tables (kept in sync with src/data/serviceImages.ts) ──────────
const CATEGORY_ALIAS: Record<string, string> = {
  "flere-fagomrader": "flere",
};

const SUB_ALIAS: Record<string, string> = {
  "gynekologi/tverrfaglig": "tverrfaglig-team",
  "gynekologi/undersokelse": "gynekologisk-undersokelse",
  "gynekologi/kirurgi": "gynekologisk-kirurgi",
  "gynekologi/vaginale-fremfall": "vaginalt-fremfall",
  "gynekologi/urogynekologi": "vaginalt-fremfall",
  "gynekologi/cyster": "cyster-pa-eggstokkene",
  "gynekologi/hysteroskopi": "gynekologisk-kirurgi",
  "gynekologi/pcos": "hormonforstyrrelser",
  "gynekologi/pms-pmdd": "hormonforstyrrelser",
  "urologi/blaere": "blaere-og-urinveier",
  "urologi/infertilitet": "mannlig-infertilitet",
  "urologi/testikler": "testikler-og-pung",
  "fertilitet/teamet": "fertilitetsteamet",
  "ortopedi/fot-ankel": "fot-og-ankel",
  "ortopedi/hand-albue": "hand-og-albue",
  "flere-fagomrader/areknuter": "areknutebehandling",
  "flere-fagomrader/ernaringsfysiolog": "ernaeringsfysologi",
  "flere-fagomrader/ernaeringsfysiolog": "ernaeringsfysologi",
  "flere-fagomrader/hudbehandlinger": "hudhelse",
  "flere-fagomrader/behandlingsutstyr": "hudhelse",
  "flere-fagomrader/hudpleieprodukter": "hudhelse",
  "flere-fagomrader/sleeve-gastrektomi": "overvektskirurgi",
  "fertilitet/assistert-befruktning-for-par-og-single": "assistert-befruktning",
  "fertilitet/assistert-befruktning-par-single": "assistert-befruktning",
};

const CROSS_CATEGORY_ALIAS: Record<string, string> = {
  "gynekologi/fostermedisin": "graviditet-fosterdiagnostikk",
  "gynekologi/fodselsskader": "graviditet-svangerskapsteam",
};

// ─── Pointer JSON discovery ──────────────────────────────────────────────
type Pointer = { url: string; original_filename?: string; content_type?: string };
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/services");
const pointersBySlug: Record<string, Pointer> = {};

function loadPointers() {
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => f.endsWith(".jpg.asset.json"));
  for (const f of files) {
    const slug = f.replace(/\.jpg\.asset\.json$/, "");
    if (slug.startsWith("mobil-")) continue;
    pointersBySlug[slug] = JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, f), "utf-8"));
  }
}

function normalizeSlug(categoryId: string, subId?: string): string {
  const cat = CATEGORY_ALIAS[categoryId] ?? categoryId;
  const sub = subId ? SUB_ALIAS[`${categoryId}/${subId}`] ?? subId : undefined;
  return sub ? `${cat}-${sub}` : `${cat}-hero`;
}

function pointerFor(categoryId: string, subId?: string): Pointer | undefined {
  if (subId) {
    const cross = CROSS_CATEGORY_ALIAS[`${categoryId}/${subId}`];
    if (cross && pointersBySlug[cross]) return pointersBySlug[cross];
  }
  const exact = pointersBySlug[normalizeSlug(categoryId, subId)];
  if (exact) return exact;
  if (subId) {
    const alt = subId.replace(/oe/g, "o").replace(/ae/g, "a").replace(/aa/g, "a");
    const altKey = `${CATEGORY_ALIAS[categoryId] ?? categoryId}-${alt}`;
    if (pointersBySlug[altKey]) return pointersBySlug[altKey];
  }
  // fallback to category hero
  return pointersBySlug[`${CATEGORY_ALIAS[categoryId] ?? categoryId}-hero`];
}

function parseHref(href?: string): { categoryId?: string; subId?: string } {
  if (!href || typeof href !== "string") return {};
  // strip query/hash
  const clean = href.split("?")[0].split("#")[0];
  const m =
    clean.match(/^\/behandlinger\/([^/]+)(?:\/([^/]+))?/) ||
    clean.match(/^\/([^/]+)(?:\/([^/]+))?/);
  if (!m) return {};
  return { categoryId: m[1], subId: m[2] };
}

// ─── Sanity asset upload cache ───────────────────────────────────────────
const uploadCache = new Map<string, string>(); // pointer.url -> asset._id

async function fetchWithRetry(url: string, attempts = 4): Promise<Response | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return res;
      console.warn(`  … attempt ${i} HTTP ${res.status}`);
    } catch (err: any) {
      console.warn(`  … attempt ${i} failed: ${err?.code || err?.message || err}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

async function uploadPointer(pointer: Pointer, dryRun: boolean): Promise<string | null> {
  if (uploadCache.has(pointer.url)) return uploadCache.get(pointer.url)!;
  if (dryRun) {
    uploadCache.set(pointer.url, "dry-run-asset-id");
    return "dry-run-asset-id";
  }
  const HOST =
    process.env.LOVABLE_ASSET_HOST ||
    "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";
  const url = pointer.url.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;
  const res = await fetchWithRetry(url);
  if (!res || !res.ok) {
    console.warn(`  ✗ download failed for ${url}`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await sanityClient.assets.upload("image", buf, {
    filename: pointer.original_filename || "service.jpg",
    contentType: pointer.content_type || "image/jpeg",
  });
  uploadCache.set(pointer.url, asset._id);
  return asset._id;
}

function imgRef(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// ─── Main migration ──────────────────────────────────────────────────────
type Cat = {
  _id: string;
  categoryId?: string;
  slug?: string;
  heroImage?: any;
  landingPage?: any;
};

async function main() {
  const dryRun = !process.argv.includes("--write");
  const overwrite = process.argv.includes("--overwrite");
  console.log(dryRun ? "🔍 DRY-RUN (pass --write to apply)" : "✍️  WRITE mode");
  console.log(overwrite ? "⚠️  --overwrite: existing images will be replaced" : "↷ skipping items that already have an image");

  loadPointers();
  console.log(`Loaded ${Object.keys(pointersBySlug).length} image pointers.`);

  const cats = await sanityClient.fetch<Cat[]>(
    `*[_type == "treatmentCategory" && defined(landingPage)]{
      _id,
      categoryId,
      "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
      heroImage,
      landingPage
    }`
  );

  console.log(`Found ${cats.length} treatmentCategory documents with landingPage.\n`);

  let patched = 0;
  let itemsSet = 0;
  const unmatched: string[] = [];

  for (const cat of cats) {
    const catId = cat.categoryId || cat.slug;
    if (!catId) continue;
    const lp = cat.landingPage || {};
    console.log(`\n▸ ${catId} (${cat._id})`);

    const setOps: Record<string, any> = {};

    // --- helper: array-of-items with per-item href → image
    async function processArray(
      sectionPath: string,
      arrayKey: string,
      items: any[] | undefined
    ) {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        if (!item || !item._key) continue;
        if (item.image?.asset && !overwrite) continue;
        const parsed = parseHref(item.href);
        // prefer href-resolved image; else fall back to category hero
        const pointer = parsed.categoryId
          ? pointerFor(parsed.categoryId, parsed.subId)
          : pointerFor(catId);
        if (!pointer) {
          unmatched.push(`${catId} · ${sectionPath}.${arrayKey}[${item._key}] href=${item.href}`);
          continue;
        }
        const assetId = await uploadPointer(pointer, dryRun);
        if (!assetId) continue;
        const p = `landingPage.${sectionPath}.${arrayKey}[_key=="${item._key}"].image`;
        setOps[p] = imgRef(assetId);
        itemsSet++;
        console.log(`   • ${sectionPath}.${arrayKey}[${item._key}] ← ${pointer.original_filename}`);
      }
    }

    await processArray("expertAreasSection", "areas", lp.expertAreasSection?.areas);
    await processArray("symptomsSection", "items", lp.symptomsSection?.items);
    await processArray("supportSection", "areas", lp.supportSection?.areas);
    await processArray("audiencesSection", "audiences", lp.audiencesSection?.audiences);

    // --- single-image sections: whySection.image, spotlightSection.image
    async function processSingle(sectionPath: string, section: any) {
      if (!section) return;
      if (section.image?.asset && !overwrite) return;
      const pointer = pointerFor(catId);
      if (!pointer) return;
      const assetId = await uploadPointer(pointer, dryRun);
      if (!assetId) return;
      setOps[`landingPage.${sectionPath}.image`] = imgRef(assetId);
      itemsSet++;
      console.log(`   • ${sectionPath}.image ← ${pointer.original_filename} (category hero fallback)`);
    }

    await processSingle("whySection", lp.whySection);
    await processSingle("spotlightSection", lp.spotlightSection);

    if (Object.keys(setOps).length === 0) {
      console.log("   (nothing to change)");
      continue;
    }

    if (dryRun) {
      patched++;
      continue;
    }

    await sanityClient.patch(cat._id).set(setOps).commit({ autoGenerateArrayKeys: false });
    patched++;
  }

  console.log("\n── Summary ──────────────────────────────");
  console.log(`Categories patched   : ${patched}`);
  console.log(`Image slots set      : ${itemsSet}`);
  console.log(`Unique assets uploaded: ${uploadCache.size}`);
  console.log(`Unmatched hrefs      : ${unmatched.length}`);
  if (unmatched.length) {
    console.log("\nUnmatched (add alias to SUB_ALIAS / CROSS_CATEGORY_ALIAS):");
    for (const u of unmatched) console.log("  •", u);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
