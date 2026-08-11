#!/usr/bin/env npx tsx
/**
 * Developer-only: restore full reference listing order (17 articles) on newsPage.
 *
 *   cd test && npx tsx sanity/patch-aktuelt-listing-order-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { patchSingletonFields } from "./lib/patch-singleton";
import {
  REFERENCE_FEATURED_SLUGS,
  REFERENCE_LISTING_SLUGS,
} from "./reference-listing-slugs";

const SLUG_ALIASES: Record<string, string> = {
  "18-maneder-etter-hofteoperasjon-hos-cmedical":
    "18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen",
};

function refKey(): string {
  return randomBytes(6).toString("hex");
}

async function articleIdForSlug(slug: string): Promise<string | null> {
  const candidates = [slug, SLUG_ALIASES[slug]].filter(Boolean);
  for (const candidate of candidates) {
    const id = await sanityClient.fetch<string | null>(
      `*[_type == "article" && !(_id in path("drafts.**")) && coalesce(
        slug[language == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      ) == $slug][0]._id`,
      { slug: candidate },
    );
    if (id) return id;
  }
  return null;
}

async function refsForSlugs(slugs: string[]) {
  const refs = [];
  for (const slug of slugs) {
    const id = await articleIdForSlug(slug);
    if (!id) throw new Error(`Missing article for slug: ${slug}`);
    refs.push({ _type: "reference" as const, _ref: id, _key: refKey() });
  }
  return refs;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const featuredRefs = await refsForSlugs(REFERENCE_FEATURED_SLUGS);
  const listingRefs = await refsForSlugs(REFERENCE_LISTING_SLUGS);

  await patchSingletonFields("newsPage", {
    featuredArticles: featuredRefs,
    listingArticles: listingRefs,
    listSize: 9,
  });

  // Reference shows «Jeg måtte gråte…» under Oss i media (published doc had Pasienthistorier).
  await sanityClient
    .patch("article-jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor")
    .set({ category: "Oss i media" })
    .commit();

  console.log("✓ Patched newsPage listing order");
  console.log(`  featuredArticles: ${featuredRefs.length}`);
  console.log(`  listingArticles: ${listingRefs.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
