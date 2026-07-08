/**
 * Migrate Hero Slider images + content to Sanity homepage.heroBanner.slides
 *
 * Reads image URLs from Lovable asset pointer JSONs in src/assets/, downloads
 * them, uploads to Sanity, and patches the `homepage` document.
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/migrate-hero-slider.ts
 *
 * Env required (see test/sanity/config.ts):
 *   SANITY_TOKEN (write access)
 * Optional:
 *   SANITY_PROJECT_ID (default 9jhqpk3a), SANITY_DATASET (default production)
 */
import { sanityClient as client } from "./config";
import * as fs from "fs";
import * as path from "path";

const HOMEPAGE_ID = "homepage";
const ASSETS_ROOT = path.resolve(__dirname, "../../src/assets");

type SlideDef = {
  _key: string;
  desktopPointer: string; // path relative to src/assets
  mobilePointer?: string;
  heading: { no: string; en: string };
  subheading: { no: string; en: string };
  ctaText: { no: string; en: string };
  ctaLink: { no: string; en: string };
};

const SLIDES: SlideDef[] = [
  {
    _key: "slide-kvinnehelse",
    desktopPointer: "hero/kvinnehelse-hero-v2.jpg.asset.json",
    mobilePointer: "services/gynekologi-hero.jpg.asset.json",
    heading: { no: "Kvinnehelse\nfor livet", en: "Women's health\nfor life" },
    subheading: { no: "Kvinnehelse", en: "Women's health" },
    ctaText: { no: "Les mer", en: "Read more" },
    ctaLink: { no: "/gynekologi", en: "/gynecology" },
  },
  {
    _key: "slide-fertilitet",
    desktopPointer: "hero-fertilitet.jpg.asset.json",
    mobilePointer: "services/mobil-fertilitet-hero.jpg.asset.json",
    heading: { no: "Ledende miljø\ninnen fertilitet", en: "Leading experts\nin fertility" },
    subheading: { no: "Fertilitetsteamet", en: "Fertility team" },
    ctaText: { no: "Les mer", en: "Read more" },
    ctaLink: { no: "/fertilitet", en: "/fertility" },
  },
  {
    _key: "slide-tverrfaglig",
    desktopPointer: "hero/tverrfaglig-team-hero-v2.jpg.asset.json",
    mobilePointer: "services/mobil-flere-hero.jpg.asset.json",
    heading: { no: "Tverrfaglig team\nunder ett tak", en: "Multidisciplinary team\nunder one roof" },
    subheading: { no: "Samarbeid på tvers", en: "Cross-disciplinary care" },
    ctaText: { no: "Les mer", en: "Read more" },
    ctaLink: {
      no: "/behandlinger/gynekologi/tverrfaglig",
      en: "/treatments/gynecology/multidisciplinary",
    },
  },
];

function readPointerUrl(pointerRelPath: string): string | null {
  const abs = path.resolve(ASSETS_ROOT, pointerRelPath);
  if (!fs.existsSync(abs)) {
    console.warn(`⚠️  Pointer not found: ${abs}`);
    return null;
  }
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  return json.url as string;
}

async function fetchWithRetry(url: string, attempts = 4): Promise<Buffer | null> {
  const full = url.startsWith("http") ? url : `https://cdn.lovable.dev${url}`;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(full, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      console.warn(`   attempt ${i}/${attempts} failed for ${full}: ${(err as Error).message}`);
      if (i < attempts) await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
  return null;
}

async function uploadFromPointer(pointerRelPath: string): Promise<string | null> {
  const url = readPointerUrl(pointerRelPath);
  if (!url) return null;
  const filename = path.basename(pointerRelPath).replace(".asset.json", "");
  console.log(`   ↓ downloading ${filename}`);
  const buf = await fetchWithRetry(url);
  if (!buf) {
    console.warn(`   ✗ could not download ${filename}`);
    return null;
  }
  const asset = await client.assets.upload("image", buf, {
    filename,
    contentType: "image/jpeg",
  });
  console.log(`   ✅ uploaded ${filename} -> ${asset._id}`);
  return asset._id;
}

const i18n = (no: string, en: string) => [
  { _key: "no", _type: "internationalizedArrayStringValue", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
];

async function migrate() {
  console.log("🚀 Migrating Hero Slider images to homepage.heroBanner\n");

  await client.createIfNotExists({
    _id: HOMEPAGE_ID,
    _type: "homepage",
    title: i18n("CMedical – Forside", "CMedical – Home"),
  });

  const slides: any[] = [];
  for (const s of SLIDES) {
    console.log(`→ ${s._key}`);
    const desktopId = await uploadFromPointer(s.desktopPointer);
    const mobileId = s.mobilePointer ? await uploadFromPointer(s.mobilePointer) : null;

    slides.push({
      _key: s._key,
      _type: "object",
      ...(desktopId && {
        image: { _type: "image", asset: { _type: "reference", _ref: desktopId } },
      }),
      ...(mobileId && {
        imageRight: { _type: "image", asset: { _type: "reference", _ref: mobileId } },
      }),
      heading: i18n(s.heading.no, s.heading.en),
      subheading: i18n(s.subheading.no, s.subheading.en),
      ctaText: i18n(s.ctaText.no, s.ctaText.en),
      ctaLink: i18n(s.ctaLink.no, s.ctaLink.en),
    });
  }

  await client
    .patch(HOMEPAGE_ID)
    .set({ heroBanner: { slides } })
    .commit();

  console.log(`\n✅ Migrated ${slides.length} hero slides to homepage.heroBanner`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
