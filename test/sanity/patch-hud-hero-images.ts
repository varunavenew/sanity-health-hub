#!/usr/bin/env npx tsx
/**
 * Upload the 9 unique hudlege demo heroes and set heroImage + heroMedia.image.
 *
 * Fixes #386: all hud pages pointed at the same asset after
 * patch-flere-generic-heroes-developer.ts copied hudhelse onto children.
 *
 *   cd test && npx tsx sanity/patch-hud-hero-images.ts
 *   DRY_RUN=1 npx tsx sanity/patch-hud-hero-images.ts
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/patch-hud-hero-images.ts
 *
 * Elastisitet has an unpublished draft with placeholder heroPrice.
 * Images are patched on that draft; the draft is never published.
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_DIR = path.join(__dirname, "..", "..", "tmp", "hud-demo-heroes");

const ELASTISITET_ID =
  "treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum";

type HeroImage = {
  _type?: string;
  asset?: { _type?: string; _ref?: string };
  [key: string]: unknown;
};

type HeroMedia = {
  _type?: string;
  mediaType?: string;
  image?: HeroImage;
  [key: string]: unknown;
};

const TREATMENTS = [
  {
    id: "treatment-flere-fagomrader-hudhelse",
    slug: "hudhelse",
    file: "01_hudlege_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger",
    slug: "hudbehandlinger",
    file: "02_hudbehandlinger_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader",
    slug: "pigmentforandringer-og-solskader",
    file: "03_pigmentforandringer-og-solskader_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar",
    slug: "rodhet-og-synlige-blodkar",
    file: "04_rodhet-og-synlige-blodkar_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur",
    slug: "forbedring-av-hudstruktur",
    file: "05_forbedring-av-hudstruktur_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi",
    slug: "kosmetisk-dermatologi",
    file: "06_kosmetisk-dermatologi_hero.jpg",
  },
  {
    id: ELASTISITET_ID,
    slug: "elastisitet-og-volum",
    file: "07_elastisitet-og-volum_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-foflekksjekk",
    slug: "foflekksjekk",
    file: "08_foflekksjekk_hero.jpg",
  },
  {
    id: "treatment-flere-fagomrader-hudpleieprodukter",
    slug: "hudpleieprodukter",
    file: "09_hudpleieprodukter_hero.jpg",
  },
] as const;

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

function imageWithAsset(existing: HeroImage | undefined, assetId: string): HeroImage {
  return {
    ...(existing || {}),
    _type: existing?._type || "image",
    asset: { _type: "reference", _ref: assetId },
  };
}

function mediaWithAsset(existing: HeroMedia | undefined, assetId: string): HeroMedia {
  return {
    ...(existing || {}),
    _type: existing?._type || "media",
    mediaType: "image",
    image: imageWithAsset(existing?.image, assetId),
  };
}

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath);
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) {
    return { assetId: existing._id, reused: true as const };
  }
  if (DRY_RUN) {
    return { assetId: `dry-run-${sha1hash.slice(0, 12)}`, reused: false as const };
  }
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: contentTypeFor(filename),
  });
  return { assetId: asset._id, reused: false as const };
}

async function patchHero(id: string, assetId: string) {
  const current = await sanityClient.fetch<{
    heroImage?: HeroImage;
    heroMedia?: HeroMedia;
  } | null>(`*[_id==$id][0]{heroImage, heroMedia}`, { id });
  if (!current) return false;

  if (DRY_RUN) {
    console.log(`  dry-run patch ${id}`);
    return true;
  }

  await sanityClient
    .patch(id)
    .set({
      heroImage: imageWithAsset(current.heroImage, assetId),
      heroMedia: mediaWithAsset(current.heroMedia, assetId),
    })
    .commit();
  return true;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing unexpected project ${PROJECT_ID}`);
  }
  if (!fs.existsSync(HERO_DIR)) {
    throw new Error(`Missing hero dir: ${HERO_DIR}`);
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);
  console.log(`heroes from ${HERO_DIR}`);

  const assetByFile = new Map<string, string>();
  const results: Array<{
    id: string;
    slug: string;
    file: string;
    assetId: string;
    reused: boolean;
    previousRef?: string | null;
    patchedDraft: boolean;
  }> = [];

  for (const t of TREATMENTS) {
    const filePath = path.join(HERO_DIR, t.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing image: ${filePath}`);
    }

    const before = await sanityClient.fetch<{
      _id: string;
      heroRef?: string | null;
    } | null>(`*[_id==$id][0]{_id, "heroRef": heroImage.asset._ref}`, {
      id: t.id,
    });
    if (!before?._id) {
      throw new Error(`Missing published treatment: ${t.id}`);
    }

    let assetId = assetByFile.get(t.file);
    let reused = false;
    if (!assetId) {
      const upload = await uploadImage(filePath, t.file);
      assetId = upload.assetId;
      reused = upload.reused;
      assetByFile.set(t.file, assetId);
    }

    await patchHero(t.id, assetId);

    let patchedDraft = false;
    const draftId = `drafts.${t.id}`;
    const draftExists = await sanityClient.fetch<string | null>(
      `*[_id==$id][0]._id`,
      { id: draftId },
    );
    if (draftExists) {
      if (t.id === ELASTISITET_ID) {
        await patchHero(draftId, assetId);
        patchedDraft = true;
        console.log(`  patched draft images only (not published): ${draftId}`);
      } else {
        throw new Error(
          `Unexpected draft ${draftId} — inspect before overwriting unpublished work`,
        );
      }
    }

    results.push({
      id: t.id,
      slug: t.slug,
      file: t.file,
      assetId,
      reused,
      previousRef: before.heroRef,
      patchedDraft,
    });
    console.log(
      `${t.slug} → ${assetId}${reused ? " (sha reuse)" : " (uploaded)"} (was ${before.heroRef || "none"})`,
    );
  }

  const ids = TREATMENTS.map((t) => t.id);
  const verifyRows = await sanityClient.fetch(
    `*[_id in $ids]{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "heroRef": heroImage.asset._ref,
      "mediaRef": heroMedia.image.asset._ref,
      "heroFile": heroImage.asset->originalFilename,
      "heroPriceNo": heroPrice[language=="no"][0].value
    } | order(_id asc)`,
    { ids },
  );

  const refs = new Set(
    (verifyRows as Array<{ heroRef?: string }>).map((r) => r.heroRef).filter(Boolean),
  );
  console.log("\nverify published");
  console.log(JSON.stringify(verifyRows, null, 2));
  console.log(`distinct hero refs: ${refs.size} / ${TREATMENTS.length}`);

  if (!DRY_RUN && refs.size !== TREATMENTS.length) {
    throw new Error(
      `Expected ${TREATMENTS.length} distinct hero assets, got ${refs.size}`,
    );
  }

  const draft = await sanityClient.fetch<{
    _id?: string;
    heroPriceNo?: string;
    heroRef?: string;
  } | null>(
    `*[_id==$id][0]{_id, "heroPriceNo": heroPrice[language=="no"][0].value, "heroRef": heroImage.asset._ref}`,
    { id: `drafts.${ELASTISITET_ID}` },
  );
  if (draft?._id) {
    console.log("\nelastisitet draft left unpublished", {
      heroPriceNo: draft.heroPriceNo,
      heroRef: draft.heroRef,
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
