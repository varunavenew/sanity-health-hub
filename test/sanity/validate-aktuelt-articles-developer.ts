#!/usr/bin/env npx tsx
/**
 * Validate Aktuelt article detail chain on Developer Sanity + local routes.
 *
 *   cd test && npx tsx sanity/validate-aktuelt-articles-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import {
  REFERENCE_FEATURED_SLUGS,
  REFERENCE_LISTING_SLUGS,
} from "./reference-listing-slugs";

export { REFERENCE_FEATURED_SLUGS, REFERENCE_LISTING_SLUGS };

const LOCAL_BASE = process.env.LOCAL_BASE || "http://localhost:3000";

const SLUG_ALIASES: Record<string, string> = {
  "18-maneder-etter-hofteoperasjon-hos-cmedical":
    "18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen",
};

const publishedOnly = '!(_id in path("drafts.**"))';
const slugMatches = `(
  slug.current == $slug
  || slug[language == "no"][0].value.current == $slug
  || slug[0].value.current == $slug
)`;

const DETAIL_QUERY = `*[_type == "article" && ${publishedOnly} && ${slugMatches}][0]{
  _id,
  category,
  publishedAt,
  "title": coalesce(title[language == "no"][0].value, title[0].value, title),
  "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
  "bodyLen": count(coalesce(body[language == "no"][0].value, body[0].value, body)),
  "hasImage": defined(primaryImage.asset)
}`;

type ArticleRow = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  bodyLen: number;
  hasImage: boolean;
};

async function findArticle(slug: string): Promise<ArticleRow | null> {
  const candidates = [slug, SLUG_ALIASES[slug]].filter(Boolean);
  for (const candidate of candidates) {
    const row = await sanityClient.fetch<ArticleRow | null>(DETAIL_QUERY, {
      slug: candidate,
    });
    if (row) return row;
  }
  return null;
}

async function localDetailOk(slug: string): Promise<{ status: number; notFound: boolean }> {
  const url = `${LOCAL_BASE}/no/aktuelt/${slug}`;
  const res = await fetch(url);
  const html = await res.text();
  return {
    status: res.status,
    notFound:
      html.includes("Artikkelen ble ikke funnet") ||
      html.includes("Article not found"),
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Unexpected project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Developer dataset only (got ${DATASET})`);

  const newsPage = await sanityClient.fetch<{
    featured: Array<{ slug: string; title: string }>;
    listing: Array<{ slug: string; title: string }>;
  }>(`*[_id=="newsPage"][0]{
    "featured": featuredArticles[]->{
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "title": coalesce(title[language=="no"][0].value, title[0].value)
    },
    "listing": listingArticles[]->{
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "title": coalesce(title[language=="no"][0].value, title[0].value)
    }
  }`);

  let failures = 0;
  const report: string[] = [];

  console.log("=== Aktuelt Article Validation ===\n");

  for (const slug of REFERENCE_LISTING_SLUGS) {
    const doc = await findArticle(slug);
    const local = await localDetailOk(slug);

    let status = "OK";
    if (!doc) {
      status = "MISSING_DOC";
      failures++;
    } else if (local.status !== 200) {
      status = "LOCAL_HTTP_FAIL";
      failures++;
    } else if (!doc.bodyLen) {
      status = "NO_BODY";
      failures++;
    } else if (!doc.hasImage) {
      status = "NO_IMAGE";
    }

    const icon = status === "OK" ? "✓" : "✗";
    report.push(`${icon} ${doc?.title || slug}`);
    report.push(`  document: ${doc?._id || "—"}`);
    report.push(`  slug: ${doc?.slug || slug}`);
    report.push(`  category: ${doc?.category || "—"}`);
    report.push(`  body blocks: ${doc?.bodyLen ?? 0}`);
    report.push(`  detail: ${status} (HTTP ${local.status})`);
    report.push("");
  }

  console.log(report.join("\n"));

  const featuredSlugs = newsPage.featured.map((f) => f.slug);
  const listingSlugs = newsPage.listing.map((l) => l.slug);

  console.log("CMS featured:", featuredSlugs.length, featuredSlugs.join(" → "));
  console.log("CMS listing:", listingSlugs.length, listingSlugs.join(" → "));
  console.log(
    "Featured order match:",
    JSON.stringify(featuredSlugs) === JSON.stringify(REFERENCE_FEATURED_SLUGS),
  );
  console.log(
    "Listing order match:",
    JSON.stringify(listingSlugs) === JSON.stringify(REFERENCE_LISTING_SLUGS),
  );

  console.log(`\nReference articles: ${REFERENCE_LISTING_SLUGS.length}`);
  console.log(`Detail pages OK: ${REFERENCE_LISTING_SLUGS.length - failures}/${REFERENCE_LISTING_SLUGS.length}`);

  if (failures > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
