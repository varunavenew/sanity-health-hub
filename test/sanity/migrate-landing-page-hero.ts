#!/usr/bin/env npx tsx
/**
 * Migrate `landingPage.heroSection` on every treatmentCategory:
 *   • hero image  (from src/assets/services/<cat>-hero.jpg.asset.json)
 *   • hero video  (optional — from src/assets/**.mp4.asset.json when a match exists)
 *   • hero points (fixed default trio per category, i18n v5)
 *
 * Field names assumed to match the categoryLandingPage schema pasted by the
 * user. If your schema names differ, adjust the constants at the top of the
 * `HERO_FIELD` block below (image / video / points) — the rest of the
 * script is field-name agnostic.
 *
 * Usage (from /test):
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-landing-page-hero.ts            # dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-landing-page-hero.ts --write    # apply
 *
 * Overwrite policy: --write always REPLACES existing values in
 * landingPage.heroSection.{image,video,points} on every run (per user choice).
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

// ─── Field names inside landingPage.heroSection ──────────────────────────
const HERO_FIELD = {
  section: "heroSection",   // landingPage.<section>
  image:   "image",         // <section>.image      – type: image
  video:   "video",         // <section>.video      – type: file (video/*)
  points:  "points",        // <section>.points[]   – array of {title, desc}
};

const WRITE = process.argv.includes("--write");
const ASSETS_ROOT = path.resolve(__dirname, "../../src/assets");
const HOST =
  process.env.LOVABLE_ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

const LANGS = ["no", "en"] as const;
const i18nString = (no: string, en = "") =>
  LANGS.map((lang) => ({
    _key: lang,
    _type: "internationalizedArrayStringValue",
    language: lang,
    value: lang === "no" ? no : en,
  }));
const i18nText = (no: string, en = "") =>
  LANGS.map((lang) => ({
    _key: lang,
    _type: "internationalizedArrayTextValue",
    language: lang,
    value: lang === "no" ? no : en,
  }));

// ─── Per-category media + hero points ────────────────────────────────────
type HeroDef = {
  imagePointer: string;                  // relative to src/assets
  videoPointer?: string;                 // relative to src/assets (optional)
  points: Array<{ title: string; desc: string; titleEn: string; descEn: string }>;
};

const BASE_POINTS = {
  ingenHenvisning: {
    title: "Ingen henvisning",
    desc: "Bestill direkte uten henvisning fra fastlege.",
    titleEn: "No referral",
    descEn: "Book directly — no GP referral needed.",
  },
  korteVentetider: {
    title: "Korte ventetider",
    desc: "Time hos spesialist innen få dager.",
    titleEn: "Short waiting times",
    descEn: "See a specialist within a few days.",
  },
  erfarneSpesialister: {
    title: "Erfarne spesialister",
    desc: "Leger som jobber utelukkende med sitt fagfelt.",
    titleEn: "Experienced specialists",
    descEn: "Doctors who work exclusively in their field.",
  },
  tverrfagligTeam: {
    title: "Tverrfaglig team",
    desc: "Samarbeid mellom spesialister under samme tak.",
    titleEn: "Multidisciplinary team",
    descEn: "Specialists collaborating under one roof.",
  },
  moderneTeknologi: {
    title: "Moderne teknologi",
    desc: "Time-lapse-inkubator og robotassistert kirurgi.",
    titleEn: "Modern technology",
    descEn: "Time-lapse incubator and robotic surgery.",
  },
};

const HEROES: Record<string, HeroDef> = {
  gynekologi: {
    imagePointer: "services/gynekologi-hero.jpg.asset.json",
    videoPointer: "kvinnehelse-6.mp4.asset.json",
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.korteVentetider,
      BASE_POINTS.erfarneSpesialister,
    ],
  },
  fertilitet: {
    imagePointer: "hero-fertilitet.jpg.asset.json",
    videoPointer: "hero/fertilitet-hero-v2.jpg.asset.json".replace(".jpg", ".mp4") // fallback resolve below
      ? "hero/fertilitet-hero.mp4.asset.json"
      : undefined,
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.moderneTeknologi,
      BASE_POINTS.tverrfagligTeam,
    ],
  },
  urologi: {
    imagePointer: "services/urologi-hero.jpg.asset.json",
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.korteVentetider,
      BASE_POINTS.erfarneSpesialister,
    ],
  },
  ortopedi: {
    imagePointer: "services/ortopedi-hero.jpg.asset.json",
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.korteVentetider,
      BASE_POINTS.erfarneSpesialister,
    ],
  },
  graviditet: {
    imagePointer: "services/graviditet-hero.jpg.asset.json",
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.korteVentetider,
      BASE_POINTS.tverrfagligTeam,
    ],
  },
  "flere-fagomrader": {
    imagePointer: "services/flere-hero.jpg.asset.json",
    videoPointer: "tverrfaglig-team-2.mp4.asset.json",
    points: [
      BASE_POINTS.ingenHenvisning,
      BASE_POINTS.tverrfagligTeam,
      BASE_POINTS.erfarneSpesialister,
    ],
  },
};

// ─── Pointer helpers ─────────────────────────────────────────────────────
type Pointer = { url: string; original_filename?: string; content_type?: string };

function readPointer(rel: string): Pointer | null {
  const abs = path.resolve(ASSETS_ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠ pointer not found: src/assets/${rel}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

async function fetchWithRetry(url: string, attempts = 4): Promise<Response | null> {
  const full = url.startsWith("http") ? url : `${HOST}${url}`;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(full, { signal: AbortSignal.timeout(120_000) });
      if (res.ok) return res;
      console.warn(`   attempt ${i} HTTP ${res.status} for ${full}`);
    } catch (err: any) {
      console.warn(`   attempt ${i} failed: ${err?.message || err}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

const uploadCache = new Map<string, string>();

async function uploadPointer(
  pointer: Pointer,
  kind: "image" | "file"
): Promise<string | null> {
  const cacheKey = `${kind}:${pointer.url}`;
  if (uploadCache.has(cacheKey)) return uploadCache.get(cacheKey)!;
  if (!WRITE) {
    uploadCache.set(cacheKey, `dry-${kind}-id`);
    return `dry-${kind}-id`;
  }
  const res = await fetchWithRetry(pointer.url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await sanityClient.assets.upload(kind, buf, {
    filename: pointer.original_filename || (kind === "image" ? "hero.jpg" : "hero.mp4"),
    contentType: pointer.content_type || (kind === "image" ? "image/jpeg" : "video/mp4"),
  });
  uploadCache.set(cacheKey, asset._id);
  return asset._id;
}

function imageRef(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}
function fileRef(assetId: string) {
  return { _type: "file", asset: { _type: "reference", _ref: assetId } };
}

function shortHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}

function buildPoints(def: HeroDef) {
  return def.points.map((p, i) => ({
    _key: `hp-${i}-${shortHash(p.title)}`,
    _type: "object",
    title: i18nString(p.title, p.titleEn),
    desc: i18nText(p.desc, p.descEn),
  }));
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log(WRITE ? "✍️  WRITE mode (overwrite enabled)" : "🔍 DRY-RUN (pass --write to apply)");

  const cats = await sanityClient.fetch<
    Array<{ _id: string; categoryId?: string; slug?: string; landingPage?: any }>
  >(
    `*[_type == "treatmentCategory" && defined(landingPage)]{
      _id,
      categoryId,
      "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
      landingPage
    }`
  );
  console.log(`Found ${cats.length} treatmentCategory documents with landingPage.\n`);

  let patched = 0, skipped = 0;
  for (const cat of cats) {
    const catId = cat.categoryId || cat.slug || "";
    const def = HEROES[catId];
    console.log(`▸ ${catId} (${cat._id})`);
    if (!def) {
      console.log("   (no HEROES entry — skipped)");
      skipped++;
      continue;
    }

    const setOps: Record<string, any> = {};
    const basePath = `landingPage.${HERO_FIELD.section}`;

    // image
    const imgPtr = readPointer(def.imagePointer);
    if (imgPtr) {
      const id = await uploadPointer(imgPtr, "image");
      if (id) {
        setOps[`${basePath}.${HERO_FIELD.image}`] = imageRef(id);
        console.log(`   • image ← ${imgPtr.original_filename}`);
      }
    }

    // video (optional)
    if (def.videoPointer) {
      const vidPtr = readPointer(def.videoPointer);
      if (vidPtr) {
        const id = await uploadPointer(vidPtr, "file");
        if (id) {
          setOps[`${basePath}.${HERO_FIELD.video}`] = fileRef(id);
          console.log(`   • video ← ${vidPtr.original_filename}`);
        }
      }
    }

    // points
    const points = buildPoints(def);
    setOps[`${basePath}.${HERO_FIELD.points}`] = points;
    console.log(`   • points ← ${points.length} chips`);

    if (!WRITE) { patched++; continue; }
    try {
      await sanityClient.patch(cat._id).set(setOps).commit({ autoGenerateArrayKeys: false });
      patched++;
    } catch (err) {
      console.error(`   ✗ patch failed: ${(err as Error).message}`);
    }
  }

  console.log("\n── Summary ──────────────────────────────");
  console.log(`Categories updated  : ${patched}`);
  console.log(`Categories skipped  : ${skipped}`);
  console.log(`Assets uploaded     : ${uploadCache.size}`);
  if (!WRITE) console.log("\n(dry-run — re-run with --write to apply)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
