#!/usr/bin/env npx tsx
/**
 * Developer-only: Hero slide 3 (slide-tverrfaglig) — video + poster + CTA.
 *
 * Expects optional local files from Aina's email in src/assets/hero/:
 *   • Tverrfaglig team-4 (1).mp4 / Interdisciplinary team-4 (1).mp4  (preferred video)
 *   • tverrfaglig-hero-cover.jpg   (preferred poster / mobile still)
 *
 * Falls back to existing repo assets / Lovable pointer downloads when missing.
 *
 *   cd test && npx tsx sanity/patch-hero-slide3-tverrfaglig-media-developer.ts
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = path.resolve(__dirname, "../../src/assets");
const HOMEPAGE_ID = "homepage";
const SLIDE_KEY = "slide-tverrfaglig";
const ASSET_HOST =
  process.env.LOVABLE_ASSET_HOST ||
  process.env.ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

const VIDEO_CANDIDATES = [
  "hero/Tverrfaglig team-4 (1).mp4",
  "hero/Interdisciplinary team-4 (1).mp4",
  "hero/tverrfaglig-team-4.mp4",
  "hero/tverrfaglig-team-4 (1).mp4",
];

const COVER_CANDIDATES = [
  "hero/tverrfaglig-hero-cover.jpg",
  "hero/tverrfaglig-hero-3-cover.jpg",
  "hero/nytt-coverbilde-hero-3.jpg",
];

const VIDEO_POINTER_FALLBACK = "hero/tverrfaglig-hero.mp4.asset.json";
const COVER_POINTER_FALLBACK = "hero/tverrfaglig-team-hero-v2.jpg.asset.json";
const MOBILE_POINTER = "services/mobil-flere-hero.jpg.asset.json";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

let i18nKeyCounter = 0;
const i18nKey = () =>
  `i18n-${Date.now().toString(36)}-${(i18nKeyCounter++).toString(36)}`;

const i18n = (no: string, en: string): I18nItem[] => [
  {
    _type: "internationalizedArrayStringValue",
    _key: i18nKey(),
    language: "no",
    value: no,
  },
  {
    _type: "internationalizedArrayStringValue",
    _key: i18nKey(),
    language: "en",
    value: en,
  },
];

function readPointerUrl(pointerRelPath: string): string | null {
  const abs = path.resolve(ASSETS_ROOT, pointerRelPath);
  if (!fs.existsSync(abs)) return null;
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  return typeof json.url === "string" ? json.url : null;
}

async function fetchBuffer(url: string): Promise<Buffer | null> {
  const full = url.startsWith("http") ? url : `${ASSET_HOST}${url}`;
  try {
    const res = await fetch(full, { signal: AbortSignal.timeout(120_000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function uploadImage(buffer: Buffer, filename: string) {
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) return existing._id;
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: filename.endsWith(".png") ? "image/png" : "image/jpeg",
  });
  return asset._id;
}

async function uploadVideo(buffer: Buffer, filename: string) {
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.fileAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) return existing._id;
  const asset = await sanityClient.assets.upload("file", buffer, {
    filename,
    contentType: "video/mp4",
  });
  return asset._id;
}

async function resolveLocalOrPointer(
  localCandidates: string[],
  pointerFallback: string,
  kind: "image" | "video",
): Promise<{ assetId: string; source: string }> {
  for (const rel of localCandidates) {
    const abs = path.resolve(ASSETS_ROOT, rel);
    if (fs.existsSync(abs)) {
      const buf = fs.readFileSync(abs);
      const filename = path.basename(abs);
      const assetId =
        kind === "video"
          ? await uploadVideo(buf, filename)
          : await uploadImage(buf, filename);
      return { assetId, source: `local:${rel}` };
    }
  }

  const url = readPointerUrl(pointerFallback);
  if (!url) {
    throw new Error(
      `Missing ${kind} — add a local file or pointer: ${localCandidates.join(", ")} / ${pointerFallback}`,
    );
  }
  const buf = await fetchBuffer(url);
  if (!buf) {
    throw new Error(`Could not download ${kind} from ${url}`);
  }
  const filename = path.basename(pointerFallback).replace(".asset.json", "");
  const assetId =
    kind === "video"
      ? await uploadVideo(buf, filename)
      : await uploadImage(buf, filename);
  return { assetId, source: `pointer:${pointerFallback}` };
}

async function patchHomepageDoc(id: string, slidePatch: Record<string, unknown>) {
  const doc = await sanityClient.fetch<{ heroBanner?: { slides?: Array<Record<string, unknown>> } } | null>(
    `*[_id==$id][0]{ heroBanner }`,
    { id },
  );
  if (!doc?.heroBanner?.slides?.length) {
    throw new Error(`Homepage ${id} has no heroBanner.slides`);
  }

  const slides = doc.heroBanner.slides.map((slide) => {
    if (slide._key !== SLIDE_KEY) return slide;
    return { ...slide, ...slidePatch };
  });

  if (!slides.some((s) => s._key === SLIDE_KEY)) {
    throw new Error(`Slide ${SLIDE_KEY} not found on ${id}`);
  }

  await sanityClient.patch(id).set({ heroBanner: { slides } }).commit();
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer" && DATASET !== "production") {
    throw new Error(
      `Refusing to run on dataset "${DATASET}". Expected developer or production.`,
    );
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET}`);
  console.log("→ Uploading hero slide 3 video…");
  const video = await resolveLocalOrPointer(
    VIDEO_CANDIDATES,
    VIDEO_POINTER_FALLBACK,
    "video",
  );
  console.log(`   video: ${video.source} → ${video.assetId}`);

  console.log("→ Uploading hero slide 3 cover/poster…");
  const cover = await resolveLocalOrPointer(
    COVER_CANDIDATES,
    COVER_POINTER_FALLBACK,
    "image",
  );
  console.log(`   cover: ${cover.source} → ${cover.assetId}`);

  let mobileAssetId: string | undefined;
  const mobileUrl = readPointerUrl(MOBILE_POINTER);
  if (mobileUrl) {
    const buf = await fetchBuffer(mobileUrl);
    if (buf) {
      mobileAssetId = await uploadImage(
        buf,
        path.basename(MOBILE_POINTER).replace(".asset.json", ""),
      );
      console.log(`   mobile: ${MOBILE_POINTER} → ${mobileAssetId}`);
    }
  }

  const posterImage = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: cover.assetId },
  };

  const slidePatch = {
    media: {
      _type: "media",
      mediaType: "video",
      videoSource: "upload",
      videoFile: {
        _type: "file",
        asset: { _type: "reference", _ref: video.assetId },
      },
      image: posterImage,
    },
    image: posterImage,
    mobileImage: mobileAssetId
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: mobileAssetId },
        }
      : posterImage,
    heading: i18n("Tverrfaglige\nkirurgiske team", "Multidisciplinary\nsurgical team"),
    subheading: i18n("Tverrfaglig kirurgisk team", "Multidisciplinary surgical team"),
    ctaText: i18n("Les mer", "Read more"),
    ctaLink: i18n("/tverrfaglige-team", "/tverrfaglige-team"),
  };

  const targetIds = [HOMEPAGE_ID];
  const draftId = `drafts.${HOMEPAGE_ID}`;
  const draft = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draft) targetIds.push(draftId);

  for (const id of targetIds) {
    await patchHomepageDoc(id, slidePatch);
    console.log(`✅ Patched ${id} → slide ${SLIDE_KEY}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id==$id][0].heroBanner.slides[_key==$key][0]{
      _key,
      "headingNo": heading[language=="no"][0].value,
      "ctaNo": ctaLink[language=="no"][0].value,
      "mediaType": media.mediaType,
      "videoRef": media.videoFile.asset._ref,
      "posterRef": coalesce(media.image.asset._ref, image.asset._ref)
    }`,
    { id: HOMEPAGE_ID, key: SLIDE_KEY },
  );
  console.log("\nVerify:", JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
