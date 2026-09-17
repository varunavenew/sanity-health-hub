#!/usr/bin/env npx tsx
/**
 * One-off: replace category-fertilitet's heroImage (specialist-profile
 * "featured service" card) with a new hero photo.
 *
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production SANITY_STUDIO_DATASET=production \
 *     npx tsx sanity/patch-fertilitet-hero-image-production.ts
 *
 * Reads the image from ../../tmp/fertilitet-hero-swap/hero.jpg (copy it there first).
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOC_ID = "category-fertilitet";
const IMAGE_PATH = path.join(
  __dirname,
  "..",
  "..",
  "tmp",
  "fertilitet-hero-swap",
  "hero.jpg",
);

async function main() {
  if (DATASET !== "production") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Production only.`);
  }
  if (!fs.existsSync(IMAGE_PATH)) {
    throw new Error(`Missing image: ${IMAGE_PATH}`);
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET}`);

  const before = await sanityClient.fetch<{
    _id: string;
    heroImageRef?: string | null;
    heroImageUrl?: string | null;
  } | null>(
    `*[_id==$id][0]{_id, "heroImageRef": heroImage.asset._ref, "heroImageUrl": heroImage.asset->url}`,
    { id: DOC_ID },
  );
  if (!before?._id) {
    throw new Error(`Missing published document: ${DOC_ID}`);
  }
  console.log("before:", before);

  const buffer = fs.readFileSync(IMAGE_PATH);
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  const assetId = existing?._id
    ? existing._id
    : (
        await sanityClient.assets.upload("image", buffer, {
          filename: "fertilitet-hero.jpg",
          contentType: "image/jpeg",
        })
      )._id;
  console.log(`asset: ${assetId}${existing ? " (sha reuse)" : " (uploaded)"}`);

  await sanityClient
    .patch(DOC_ID)
    .set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      },
    })
    .commit();

  const draftId = `drafts.${DOC_ID}`;
  const draftExists = await sanityClient.fetch<string | null>(
    `*[_id==$id][0]._id`,
    { id: draftId },
  );
  if (draftExists) {
    await sanityClient.delete(draftId);
    console.log(`deleted ${draftId}`);
  }

  const after = await sanityClient.fetch<{ heroImageUrl?: string }>(
    `*[_id==$id][0]{"heroImageUrl": heroImage.asset->url}`,
    { id: DOC_ID },
  );
  console.log("after:", after);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
