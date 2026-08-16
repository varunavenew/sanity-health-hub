#!/usr/bin/env npx tsx
/**
 * Developer-only: attach the 3 standard promise/benefit images to all fertility treatments.
 *
 * Prefer exact avenewdemo scrapes, then existing Sanity asset refs; otherwise upload from:
 *   1) tmp/fertility-promise-images-exact/ (Playwright scrape of infertilitet benefits)
 *   2) tmp/fertility-promise-images/ (legacy scrape dir)
 *   3) src/assets/promises/ (local fallbacks — specialists must NOT use zipper/consultation crop)
 *
 * Canonical demo sources (2026-08-15):
 *   Tilpasset: .../e5a0963c-.../familie-komfort.webp
 *   Spesialister: .../3d289313-.../spesialister-med-dybde-madeleine.jpg
 *   Samme tak: .../f9b32dbb-.../alt-under-samme-tak.jpg
 *
 *   cd test && npx tsx sanity/patch-fertility-promise-images-developer.ts
 */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EXACT_DIR = path.join(ROOT, "tmp", "fertility-promise-images-exact");
const SCRAPE_DIR = path.join(ROOT, "tmp", "fertility-promise-images");
const LOCAL_DIR = path.join(ROOT, "src", "assets", "promises");

/** Known-good developer asset IDs (byte-identical to avenewdemo scrapes). */
export const PROMISE_IMAGE_ASSET_IDS = {
  comfort: "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
  specialists: "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
  sameRoof: "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
} as const;

/** Do not reuse this asset for specialists — wrong visual vs demo Madeleine portrait. */
const FORBIDDEN_SPECIALISTS_REFS = new Set([
  "image-013417a4c310e8e7b18062f8b56be0a561490273-1420x1080-jpg", // promises-2.jpg (scrub-cap duo)
]);

const FERTILITY_IDS = [
  "treatment-fertilitet-fertilitetsutredning",
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-eggfrys",
  "treatment-fertilitet-donorbehandling",
  "treatment-fertilitet-saedanalyse",
  "treatment-fertilitet-infertilitet",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  "treatment-fertilitet-to-kvinner-i-parforhold",
  "treatment-fertilitet-singel-kvinne",
  "treatment-fertilitet-singel-mann",
] as const;

type Slot = "comfort" | "specialists" | "sameRoof";

const SLOT_MATCHERS: Array<{ slot: Slot; test: (title: string) => boolean }> = [
  {
    slot: "comfort",
    test: (t) =>
      /tilpasset dine behov/i.test(t) ||
      /du bestemmer hva du er komfortabel/i.test(t) ||
      /you decide what you are comfortable/i.test(t),
  },
  {
    slot: "specialists",
    test: (t) =>
      /erfarne spesialister/i.test(t) ||
      /spesialister med dybde/i.test(t) ||
      /specialists with depth/i.test(t),
  },
  {
    slot: "sameRoof",
    test: (t) =>
      /alt under samme tak/i.test(t) || /everything under one roof/i.test(t),
  },
];

function scrapeCandidates(
  dir: string,
  basename: string,
  uploadName: string,
): Array<{ abs: string; filename: string; contentType: string }> {
  return [
    {
      abs: path.join(dir, `${basename}.webp`),
      filename: `${uploadName}.webp`,
      contentType: "image/webp",
    },
    {
      abs: path.join(dir, `${basename}.jpg`),
      filename: `${uploadName}.jpg`,
      contentType: "image/jpeg",
    },
    {
      abs: path.join(dir, `${basename}.png`),
      filename: `${uploadName}.png`,
      contentType: "image/png",
    },
  ];
}

const UPLOAD_CANDIDATES: Record<
  Slot,
  Array<{ abs: string; filename: string; contentType: string }>
> = {
  comfort: [
    ...scrapeCandidates(
      EXACT_DIR,
      "01-tilpasset-dine-behov",
      "fertility-promise-exact-tilpasset-dine-behov",
    ),
    ...scrapeCandidates(
      SCRAPE_DIR,
      "01-tilpasset-dine-behov",
      "fertility-promise-tilpasset-dine-behov",
    ),
    {
      abs: path.join(LOCAL_DIR, "promises-1.webp"),
      filename: "promises-1.webp",
      contentType: "image/webp",
    },
    {
      abs: path.join(LOCAL_DIR, "familie-komfort.webp"),
      filename: "familie-komfort.webp",
      contentType: "image/webp",
    },
  ],
  specialists: [
    ...scrapeCandidates(
      EXACT_DIR,
      "02-erfarne-spesialister",
      "fertility-promise-exact-erfarne-spesialister-madeleine",
    ),
    ...scrapeCandidates(
      SCRAPE_DIR,
      "02-erfarne-spesialister",
      "fertility-promise-erfarne-spesialister-madeleine",
    ),
    {
      abs: path.join(LOCAL_DIR, "spesialister-med-dybde.jpg"),
      filename: "spesialister-med-dybde.jpg",
      contentType: "image/jpeg",
    },
    // Intentionally omit LOCAL promises-2.jpg — wrong vs demo Madeleine portrait.
  ],
  sameRoof: [
    ...scrapeCandidates(
      EXACT_DIR,
      "03-alt-under-samme-tak",
      "fertility-promise-exact-alt-under-samme-tak",
    ),
    ...scrapeCandidates(
      SCRAPE_DIR,
      "03-alt-under-samme-tak",
      "fertility-promise-alt-under-samme-tak",
    ),
    {
      abs: path.join(LOCAL_DIR, "promises-3.jpg"),
      filename: "promises-3.jpg",
      contentType: "image/jpeg",
    },
    {
      abs: path.join(LOCAL_DIR, "alt-under-samme-tak.jpg"),
      filename: "alt-under-samme-tak.jpg",
      contentType: "image/jpeg",
    },
  ],
};

function titleNo(p: { title?: Array<{ language?: string; value?: string }> }): string {
  const arr = p.title || [];
  return (
    arr.find((t) => t.language === "no")?.value ||
    arr.find((t) => t.language === "en")?.value ||
    ""
  ).trim();
}

function slotForTitle(title: string): Slot | null {
  const clean = title.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  for (const m of SLOT_MATCHERS) {
    if (m.test(clean)) return m.slot;
  }
  return null;
}

async function findExistingAssetRefs(): Promise<Partial<Record<Slot, string>>> {
  // Locked to avenewdemo-identical developer assets (see PROMISE_IMAGE_ASSET_IDS).
  // Do not pick promises-2.jpg / other specialist headshots from filename search.
  return { ...PROMISE_IMAGE_ASSET_IDS };
}

async function uploadOrReuseFile(
  abs: string,
  filename: string,
  contentType: string,
): Promise<string> {
  const buffer = fs.readFileSync(abs);
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) {
    console.log(`  reuse by sha1 ${existing._id} (${filename})`);
    return existing._id;
  }
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType,
  });
  console.log(`  uploaded ${asset._id} (${filename})`);
  return asset._id;
}

async function resolveSlotAsset(
  slot: Slot,
  preferred?: string,
): Promise<string> {
  // Prefer exact/legacy scrape files (avenewdemo parity), then known refs,
  // then local src/assets/promises fallbacks.
  for (const cand of UPLOAD_CANDIDATES[slot]) {
    const fromExact = cand.abs.startsWith(EXACT_DIR);
    const fromScrape = cand.abs.startsWith(SCRAPE_DIR);
    if ((fromExact || fromScrape) && fs.existsSync(cand.abs)) {
      return uploadOrReuseFile(cand.abs, cand.filename, cand.contentType);
    }
  }
  if (
    preferred &&
    !(slot === "specialists" && FORBIDDEN_SPECIALISTS_REFS.has(preferred))
  ) {
    return preferred;
  }
  for (const cand of UPLOAD_CANDIDATES[slot]) {
    if (fs.existsSync(cand.abs)) {
      return uploadOrReuseFile(cand.abs, cand.filename, cand.contentType);
    }
  }
  throw new Error(
    `No image source for slot "${slot}". Scrape demo into tmp/fertility-promise-images-exact or ensure src/assets/promises exists.`,
  );
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("Resolving promise image assets…");
  const existing = await findExistingAssetRefs();
  console.log("Existing refs:", existing);

  const assets: Record<Slot, string> = {
    comfort: await resolveSlotAsset("comfort", existing.comfort),
    specialists: await resolveSlotAsset("specialists", existing.specialists),
    sameRoof: await resolveSlotAsset("sameRoof", existing.sameRoof),
  };
  console.log("Using assets:", assets);

  const docs = await sanityClient.fetch<
    Array<{
      _id: string;
      promises?: Array<{
        _key: string;
        title?: Array<{ language?: string; value?: string }>;
        image?: { asset?: { _ref?: string } };
        [k: string]: unknown;
      }>;
    }>
  >(
    `*[_id in $ids && !(_id in path("drafts.**"))]{_id, promises}`,
    { ids: [...FERTILITY_IDS] },
  );

  if (docs.length !== FERTILITY_IDS.length) {
    const found = new Set(docs.map((d) => d._id));
    const missing = FERTILITY_IDS.filter((id) => !found.has(id));
    console.warn(`Warning: missing docs: ${missing.join(", ")}`);
  }

  let patched = 0;
  for (const doc of docs) {
    const promises = doc.promises || [];
    if (!promises.length) {
      console.log(`skip ${doc._id}: no promises`);
      continue;
    }

    let changed = false;
    const next = promises.map((p) => {
      const slot = slotForTitle(titleNo(p));
      if (!slot) return p;
      const ref = assets[slot];
      if (p.image?.asset?._ref === ref) return p;
      changed = true;
      return {
        ...p,
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: ref },
        },
      };
    });

    await discardDraft(doc._id);

    if (!changed) {
      console.log(`ok ${doc._id}: images already set`);
      continue;
    }

    await sanityClient.patch(doc._id).set({ promises: next }).commit();
    patched++;
    console.log(`patched ${doc._id}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-fertilitet-infertilitet"][0]{
      _id,
      promises[]{
        "title": title[language=="no"][0].value,
        "assetRef": image.asset->_id,
        "url": image.asset->url,
        "originalFilename": image.asset->originalFilename
      }
    }`,
  );

  console.log("\n=== SUMMARY ===");
  console.log(`patched treatments: ${patched}/${docs.length}`);
  console.log("asset ids:", assets);
  console.log("infertilitet verify:", JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
