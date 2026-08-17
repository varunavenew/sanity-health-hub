#!/usr/bin/env npx tsx
/**
 * Developer-only: sync fertility treatment heroMedia.image → heroImage.asset
 * when they diverge (frontend prefers heroMedia via resolveCmsMedia).
 *
 *   cd test && npx tsx sanity/sync-fertility-hero-media-to-hero-image-developer.ts
 *   cd test && DRY_RUN=1 npx tsx sanity/sync-fertility-hero-media-to-hero-image-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const IDS = [
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

type SanityImage = {
  _type?: string;
  asset?: { _type?: string; _ref?: string };
  hotspot?: unknown;
  crop?: unknown;
  [key: string]: unknown;
};

type HeroMedia = {
  _type?: string;
  mediaType?: string;
  videoSource?: string;
  image?: SanityImage;
  videoFile?: unknown;
  videoUrl?: string;
  poster?: unknown;
  [key: string]: unknown;
};

type DocRow = {
  _id: string;
  slug?: string | null;
  heroImageRef?: string | null;
  heroImage?: SanityImage | null;
  heroMedia?: HeroMedia | null;
  heroMediaImageRef?: string | null;
  draftId?: string | null;
};

function assetRef(image: SanityImage | null | undefined): string | null {
  const ref = image?.asset?._ref;
  return typeof ref === "string" && ref.length > 0 ? ref : null;
}

async function discardDraft(publishedId: string): Promise<boolean> {
  const draftId = `drafts.${publishedId}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (!exists) return false;
  if (DRY_RUN) {
    console.log(`  [dry-run] would delete ${draftId}`);
    return true;
  }
  await sanityClient.delete(draftId);
  console.log(`  deleted ${draftId}`);
  return true;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log(
    `project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`,
  );

  const rows = await sanityClient.fetch<DocRow[]>(
    `*[_id in $ids]{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "heroImageRef": heroImage.asset._ref,
      heroImage,
      heroMedia,
      "heroMediaImageRef": heroMedia.image.asset._ref,
      "draftId": *[_id == ("drafts." + ^._id)][0]._id
    }`,
    { ids: [...IDS] },
  );

  const byId = new Map(rows.map((r) => [r._id, r]));
  const report: Array<{
    id: string;
    slug: string | null;
    action: "ok" | "synced" | "created_heroMedia" | "missing_heroImage" | "missing_doc";
    heroImageRef: string | null;
    heroMediaImageRefBefore: string | null;
    heroMediaImageRefAfter: string | null;
    draftDiscarded: boolean;
  }> = [];

  for (const id of IDS) {
    const doc = byId.get(id);
    if (!doc) {
      report.push({
        id,
        slug: null,
        action: "missing_doc",
        heroImageRef: null,
        heroMediaImageRefBefore: null,
        heroMediaImageRefAfter: null,
        draftDiscarded: false,
      });
      console.log(`MISSING ${id}`);
      continue;
    }

    const heroImageRef = doc.heroImageRef ?? assetRef(doc.heroImage);
    const mediaRefBefore = doc.heroMediaImageRef ?? assetRef(doc.heroMedia?.image);

    if (!heroImageRef || !doc.heroImage) {
      report.push({
        id,
        slug: doc.slug ?? null,
        action: "missing_heroImage",
        heroImageRef: null,
        heroMediaImageRefBefore: mediaRefBefore,
        heroMediaImageRefAfter: mediaRefBefore,
        draftDiscarded: false,
      });
      console.log(`NO heroImage ${id} (${doc.slug})`);
      continue;
    }

    const mediaExists = Boolean(doc.heroMedia && typeof doc.heroMedia === "object");
    const mismatch = mediaExists && mediaRefBefore !== heroImageRef;
    const needsCreate = !mediaExists;

    let action: (typeof report)[number]["action"] = "ok";
    let mediaRefAfter = mediaRefBefore;

    if (mismatch || needsCreate) {
      const nextHeroMedia: HeroMedia = {
        ...(doc.heroMedia || {}),
        _type: doc.heroMedia?._type || "media",
        mediaType:
          doc.heroMedia?.mediaType === "video" ? "video" : "image",
        image: {
          ...((doc.heroMedia?.image as SanityImage) || {}),
          ...doc.heroImage,
          _type: doc.heroImage._type || "image",
          asset: {
            _type: "reference",
            _ref: heroImageRef,
          },
        },
      };

      // Prefer keeping non-image media fields; ensure image asset matches heroImage.
      if (doc.heroMedia?.videoFile !== undefined) {
        nextHeroMedia.videoFile = doc.heroMedia.videoFile;
      }
      if (typeof doc.heroMedia?.videoUrl === "string") {
        nextHeroMedia.videoUrl = doc.heroMedia.videoUrl;
      }
      if (doc.heroMedia?.videoSource !== undefined) {
        nextHeroMedia.videoSource = doc.heroMedia.videoSource;
      }
      if (doc.heroMedia?.poster !== undefined) {
        nextHeroMedia.poster = doc.heroMedia.poster;
      }

      action = needsCreate ? "created_heroMedia" : "synced";
      mediaRefAfter = heroImageRef;

      console.log(
        `${action.toUpperCase()} ${doc.slug || id}\n` +
          `  heroImage: ${heroImageRef}\n` +
          `  heroMedia.image before: ${mediaRefBefore ?? "(none)"}\n` +
          `  heroMedia.image after:  ${mediaRefAfter}`,
      );

      if (!DRY_RUN) {
        await sanityClient.patch(id).set({ heroMedia: nextHeroMedia }).commit();
      } else {
        console.log("  [dry-run] skip patch");
      }
    } else {
      console.log(
        `OK ${doc.slug || id} heroImage=${heroImageRef} heroMedia.image=${mediaRefBefore ?? "(none)"}`,
      );
    }

    const draftDiscarded = await discardDraft(id);

    report.push({
      id,
      slug: doc.slug ?? null,
      action,
      heroImageRef,
      heroMediaImageRefBefore: mediaRefBefore,
      heroMediaImageRefAfter: mediaRefAfter,
      draftDiscarded,
    });
  }

  // Re-fetch published state for verification
  const verify = await sanityClient.fetch<
    Array<{
      _id: string;
      slug?: string | null;
      heroImageRef?: string | null;
      heroMediaImageRef?: string | null;
      heroMediaUrl?: string | null;
      heroImageUrl?: string | null;
      draftId?: string | null;
      heroMedia?: HeroMedia | null;
    }>
  >(
    `*[_id in $ids]{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "heroImageRef": heroImage.asset._ref,
      "heroMediaImageRef": heroMedia.image.asset._ref,
      "heroImageUrl": heroImage.asset->url,
      "heroMediaUrl": heroMedia.image.asset->url,
      heroMedia,
      "draftId": *[_id == ("drafts." + ^._id)][0]._id
    }`,
    { ids: [...IDS] },
  );

  const verifyById = new Map(verify.map((r) => [r._id, r]));
  let mismatchesLeft = 0;

  console.log("\n=== VERIFY ===");
  for (const id of IDS) {
    const v = verifyById.get(id);
    const matched =
      !v?.heroMediaImageRef || v.heroMediaImageRef === v.heroImageRef;
    if (!matched) mismatchesLeft += 1;
    console.log(
      JSON.stringify({
        id,
        slug: v?.slug ?? null,
        heroImageRef: v?.heroImageRef ?? null,
        heroMediaImageRef: v?.heroMediaImageRef ?? null,
        match: matched,
        draftId: v?.draftId ?? null,
        heroMediaUrl: v?.heroMediaUrl ?? null,
      }),
    );
  }

  const synced = report.filter((r) => r.action === "synced").length;
  const created = report.filter((r) => r.action === "created_heroMedia").length;
  const ok = report.filter((r) => r.action === "ok").length;

  console.log(
    `\nsummary: ok=${ok} synced=${synced} created=${created} mismatchesLeft=${mismatchesLeft} dryRun=${DRY_RUN}`,
  );

  if (!DRY_RUN && mismatchesLeft > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
