#!/usr/bin/env npx tsx
/**
 * Migration: clinic interior gallery → clinicPage.gallery
 *
 * Uploads local asset pointers / reference URLs and sets `gallery[]` on each clinic.
 * Source mirrors `src/data/clinicImagery.ts` (Majorstuen) + avenewdemo clinic photos
 * for Bekkestua, Moss and Moelv.
 *
 * Safe to re-run: skips clinics that already have gallery unless FORCE=1.
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-clinic-gallery.ts --dry-run
 *   cd test && npx tsx sanity/migrate-clinic-gallery.ts
 *   cd test && FORCE=1 npx tsx sanity/migrate-clinic-gallery.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/clinics");
const HOST =
  process.env.LOVABLE_ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

type GallerySource =
  | { kind: "file"; file: string; alt: string }
  | { kind: "url"; url: string; filename: string; alt: string };

/** Matches `clinicGalleries` in src/data/clinicImagery.ts + clinic-specific hero refs. */
const GALLERY_BY_SLUG: Record<string, GallerySource[]> = {
  majorstuen: [
    {
      kind: "file",
      file: "majorstuen/venterom-tv.asset.json",
      alt: "Venterom med lounge-stoler, planter og skjerm på CMedical Majorstuen",
    },
    {
      kind: "file",
      file: "majorstuen/korridor.asset.json",
      alt: "Lys korridor med trepanel og planter på CMedical Majorstuen",
    },
    {
      kind: "file",
      file: "majorstuen/hvilerom.asset.json",
      alt: "Hvilerom med gardiner og dempet lys på CMedical Majorstuen",
    },
    {
      kind: "file",
      file: "majorstuen/venterom-detalj.asset.json",
      alt: "Detalj fra venterommet på CMedical Majorstuen",
    },
  ],
  bekkestua: [
    {
      kind: "url",
      url: "https://avenewdemo.online/assets/bekkestua-Cmpd10np.jpg",
      filename: "bekkestua-gallery.jpg",
      alt: "Interiør på CMedical Bekkestua",
    },
  ],
  moss: [
    {
      kind: "url",
      url: "https://avenewdemo.online/assets/moss-BetJ801u.jpg",
      filename: "moss-gallery.jpg",
      alt: "Interiør på CMedical Moss",
    },
  ],
  moelv: [
    {
      kind: "url",
      url: "https://avenewdemo.online/assets/moelv-DTTTH4qN.jpg",
      filename: "moelv-gallery.jpg",
      alt: "Interiør på CMedical Moelv",
    },
  ],
};

function isI18nSlugArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === "object" &&
    val[0] !== null &&
    String((val[0] as { _type?: string })._type).startsWith("internationalizedArraySlug")
  );
}

function slugFromDoc(doc: { slug?: unknown; _id?: string }): string | undefined {
  const slug = doc.slug;
  if (slug && typeof slug === "object" && !Array.isArray(slug)) {
    const current = (slug as { current?: string }).current;
    if (typeof current === "string" && current.trim()) return current.trim();
  }
  if (isI18nSlugArray(slug)) {
    const items = slug as { language?: string; value?: { current?: string } }[];
    const no = items.find((item) => item.language === "no");
    if (no?.value?.current?.trim()) return no.value.current.trim();
    return items[0]?.value?.current?.trim();
  }
  const id = doc._id?.replace(/^drafts\./, "") || "";
  if (id.startsWith("clinicPage-")) return id.slice("clinicPage-".length);
  return undefined;
}

async function fetchWithRetry(url: string, attempts = 4): Promise<Response | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return res;
      console.warn(`  … attempt ${i} HTTP ${res.status} for ${url}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`  … attempt ${i} failed: ${message}`);
    }
    await new Promise((r) => setTimeout(r, 1000 * i));
  }
  return null;
}

async function loadBuffer(
  source: GallerySource,
): Promise<{ buf: Buffer; filename: string; contentType: string } | null> {
  if (source.kind === "url") {
    const res = await fetchWithRetry(source.url);
    if (!res) return null;
    return {
      buf: Buffer.from(await res.arrayBuffer()),
      filename: source.filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    };
  }

  const rel = source.file;
  const abs = path.join(ASSETS_DIR, rel);
  if (rel.endsWith(".asset.json")) {
    const pointer = JSON.parse(fs.readFileSync(abs, "utf-8")) as {
      url?: string;
      original_filename?: string;
      content_type?: string;
    };
    const url = pointer.url?.startsWith("http") ? pointer.url : `${HOST}${pointer.url}`;
    const res = await fetchWithRetry(url);
    if (!res) return null;
    return {
      buf: Buffer.from(await res.arrayBuffer()),
      filename: pointer.original_filename || path.basename(rel).replace(".asset.json", ""),
      contentType: pointer.content_type || "image/jpeg",
    };
  }

  if (!fs.existsSync(abs)) return null;
  return {
    buf: fs.readFileSync(abs),
    filename: path.basename(rel),
    contentType: rel.endsWith(".png") ? "image/png" : "image/jpeg",
  };
}

async function uploadSource(source: GallerySource): Promise<string | null> {
  const loaded = await loadBuffer(source);
  if (!loaded) {
    const label = source.kind === "file" ? source.file : source.url;
    console.warn(`  ✗ could not load ${label}`);
    return null;
  }
  const asset = await sanityClient.assets.upload("image", loaded.buf, {
    filename: loaded.filename,
    contentType: loaded.contentType,
  });
  return asset._id;
}

async function run() {
  console.log(`\n🖼  Migrating clinic gallery ${DRY ? "[DRY-RUN]" : FORCE ? "[FORCE]" : ""}\n`);

  const clinics = await sanityClient.fetch<
    Array<{ _id: string; slug?: unknown; gallery?: unknown[] }>
  >(`*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
    _id,
    slug,
    gallery
  }`);

  const bySlug = new Map<string, (typeof clinics)[number]>();
  for (const doc of clinics) {
    const key = slugFromDoc(doc);
    if (key) bySlug.set(key, doc);
  }

  for (const [slug, sources] of Object.entries(GALLERY_BY_SLUG)) {
    const doc = bySlug.get(slug);
    if (!doc) {
      console.warn(`  ✗ ${slug}: no clinicPage in Sanity — skip`);
      continue;
    }

    if (Array.isArray(doc.gallery) && doc.gallery.length > 0 && !FORCE) {
      console.log(`  · ${slug}: gallery already set (${doc.gallery.length}) — skip`);
      continue;
    }

    console.log(`  → ${slug}: ${sources.length} image(s)`);
    if (DRY) continue;

    const items: Array<{
      _type: "image";
      _key: string;
      asset: { _type: "reference"; _ref: string };
      alt: string;
    }> = [];

    for (const [index, source] of sources.entries()) {
      const assetId = await uploadSource(source);
      if (!assetId) continue;
      items.push({
        _type: "image",
        _key: `${slug}-gallery-${index}`,
        asset: { _type: "reference", _ref: assetId },
        alt: source.alt,
      });
    }

    if (items.length === 0) {
      console.warn(`  ✗ ${slug}: no images uploaded — skip patch`);
      continue;
    }

    await sanityClient.patch(doc._id).set({ gallery: items }).commit();
    console.log(`  ✅ ${slug} (${items.length} images)`);
  }

  console.log(`\n${DRY ? "Dry run complete." : "Done."}\n`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
