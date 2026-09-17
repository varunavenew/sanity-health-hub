#!/usr/bin/env npx tsx
/**
 * Ticket #312 — keep people in frame on article crops.
 *
 * Sets `primaryImage.hotspot` on the tent / Nørs Care / Madeleine Engen
 * articles so grid thumbnails, home Aktuelt cards, article heroes and
 * «Relaterte artikler» all share the same focal point.
 *
 *   cd test && npx tsx sanity/patch-article-image-hotspots.ts
 *   DRY_RUN=1 npx tsx sanity/patch-article-image-hotspots.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/patch-article-image-hotspots.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

type Hotspot = {
  _type: "sanity.imageHotspot";
  x: number;
  y: number;
  height: number;
  width: number;
};

function hotspot(
  x: number,
  y: number,
  width: number,
  height: number,
): Hotspot {
  return { _type: "sanity.imageHotspot", x, y, height, width };
}

/**
 * Focal points are 0–1, measured on the uploaded asset.
 * Tent: both faces in the doorway. Nørs Care: the four people on the steps.
 * Madeleine: the circular portrait, not the “Vinner” type.
 */
const TARGETS: { slugs: string[]; hotspot: Hotspot }[] = [
  {
    slugs: ["minis-historie-gjennom-mutterns-oyne"],
    hotspot: hotspot(0.48, 0.48, 0.55, 0.42),
  },
  {
    slugs: [
      "cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse",
    ],
    hotspot: hotspot(0.47, 0.4, 0.62, 0.42),
  },
  {
    slugs: ["madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026"],
    hotspot: hotspot(0.5, 0.28, 0.42, 0.32),
  },
];

const ALL_SLUGS = TARGETS.flatMap((t) => t.slugs);

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }

  console.log(`Dataset=${DATASET} DRY_RUN=${DRY_RUN}`);

  const docs = await sanityClient.fetch<
    { _id: string; slug: string; hasImage: boolean }[]
  >(
    `*[_type=="article" && !(_id in path("drafts.**")) && (
      slug[language=="no"][0].value.current in $slugs ||
      slug[_key=="no"][0].value.current in $slugs
    )]{
      _id,
      "slug": coalesce(
        slug[language=="no"][0].value.current,
        slug[_key=="no"][0].value.current
      ),
      "hasImage": defined(primaryImage.asset)
    }`,
    { slugs: ALL_SLUGS },
  );

  const patched: { id: string; slug: string; draft: boolean }[] = [];

  for (const target of TARGETS) {
    const matches = docs.filter((d) => target.slugs.includes(d.slug));
    if (matches.length === 0) {
      throw new Error(`No article found for slugs: ${target.slugs.join(", ")}`);
    }
    for (const doc of matches) {
      if (!doc.hasImage) {
        throw new Error(`${doc._id} (${doc.slug}) has no primaryImage`);
      }
      const ids = [doc._id, `drafts.${doc._id}`];
      for (const id of ids) {
        const exists = await sanityClient.fetch<string | null>(
          `*[_id==$id][0]._id`,
          { id },
        );
        if (!exists) continue;
        console.log(`  ${id} ← ${doc.slug}`);
        if (!DRY_RUN) {
          await sanityClient
            .patch(id)
            .set({ "primaryImage.hotspot": target.hotspot })
            .commit();
        }
        patched.push({
          id,
          slug: doc.slug,
          draft: id.startsWith("drafts."),
        });
      }
    }
  }

  const verify = DRY_RUN
    ? null
    : await sanityClient.fetch(
        `*[_type=="article" && (
          slug[language=="no"][0].value.current in $slugs ||
          slug[_key=="no"][0].value.current in $slugs
        ) && !(_id in path("drafts.**"))]{
          _id,
          "slug": coalesce(
            slug[language=="no"][0].value.current,
            slug[_key=="no"][0].value.current
          ),
          "hotspot": primaryImage.hotspot
        } | order(slug asc)`,
        { slugs: ALL_SLUGS },
      );

  console.log("✓ Article image hotspots");
  console.log(JSON.stringify({ dataset: DATASET, dryRun: DRY_RUN, patched, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
