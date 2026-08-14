#!/usr/bin/env npx tsx
/**
 * Validate every featured/listing article has complete Developer content.
 *
 *   cd test && npx tsx sanity/validate-article-parity-developer.ts
 */
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const LOCAL_BASE = process.env.LOCAL_BASE || "http://localhost:3000";

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Unexpected project ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(
      `ABORT: This script can only validate the developer dataset (got "${DATASET}").`,
    );
  }

  const newsPage = await sanityClient.fetch<{
    featured: Array<{
      _id: string;
      slug: string;
      title: string;
      category: string;
      publishedAt: string;
      excerpt: string;
      bodyLen: number;
      hasImage: boolean;
    }>;
    listing: Array<{
      _id: string;
      slug: string;
      title: string;
      category: string;
      publishedAt: string;
      excerpt: string;
      bodyLen: number;
      hasImage: boolean;
    }>;
  }>(`*[_id=="newsPage"][0]{
    "featured": featuredArticles[]->{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "title": coalesce(title[language=="no"][0].value, title[0].value),
      category,
      publishedAt,
      "excerpt": coalesce(excerpt[language=="no"][0].value, excerpt[0].value),
      "bodyLen": count(coalesce(body[language=="no"][0].value, body[0].value, body)),
      "hasImage": defined(primaryImage.asset)
    },
    "listing": listingArticles[]->{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "title": coalesce(title[language=="no"][0].value, title[0].value),
      category,
      publishedAt,
      "excerpt": coalesce(excerpt[language=="no"][0].value, excerpt[0].value),
      "bodyLen": count(coalesce(body[language=="no"][0].value, body[0].value, body)),
      "hasImage": defined(primaryImage.asset)
    }
  }`);

  const scrapePath = path.join(__dirname, "data/reference-aktuelt-articles.json");
  const scrape = fs.existsSync(scrapePath)
    ? (JSON.parse(fs.readFileSync(scrapePath, "utf8")) as {
        articles: Record<string, { blocks?: unknown[]; title?: string }>;
      })
    : { articles: {} };

  let failures = 0;
  const seen = new Set<string>();

  async function check(
    label: string,
    articles: typeof newsPage.featured,
  ) {
    console.log(`\n=== ${label} (${articles.length}) ===`);
    for (const a of articles) {
      if (!a?._id || !a.slug) {
        console.log(`✗ missing reference`);
        failures++;
        continue;
      }
      if (seen.has(a.slug)) {
        // still validate once
      }
      seen.add(a.slug);

      const issues: string[] = [];
      if (!a.title) issues.push("no title");
      if (!a.slug) issues.push("no slug");
      if (!a.category) issues.push("no category");
      if (!a.publishedAt) issues.push("no publishedAt");
      if (!a.hasImage) issues.push("no hero image");
      if (!a.excerpt) issues.push("no excerpt");
      if (!a.bodyLen) issues.push("no body");

      const ref = scrape.articles[a.slug];
      if (ref?.blocks && a.bodyLen < Math.floor((ref.blocks.length || 0) * 0.7)) {
        issues.push(
          `body short vs scrape (${a.bodyLen} < ~${ref.blocks.length})`,
        );
      }

      const res = await fetch(`${LOCAL_BASE}/no/aktuelt/${a.slug}`);
      if (!res.ok) issues.push(`local HTTP ${res.status}`);

      if (issues.length) {
        failures++;
        console.log(`✗ ${a.title || a.slug}`);
        console.log(`  document: ${a._id}`);
        console.log(`  slug: ${a.slug}`);
        console.log(`  issues: ${issues.join(", ")}`);
      } else {
        console.log(`✓ ${a.title}`);
        console.log(`  document: ${a._id}`);
        console.log(`  slug: ${a.slug}`);
        console.log(
          `  category: ${a.category} | body: ${a.bodyLen} | detail: OK`,
        );
      }
    }
  }

  await check("Featured articles", newsPage.featured || []);
  await check("Listing articles", newsPage.listing || []);

  console.log(`\nFeatured: ${(newsPage.featured || []).length}`);
  console.log(`Listing: ${(newsPage.listing || []).length}`);
  console.log(`Unique validated: ${seen.size}`);
  console.log(`Failures: ${failures}`);

  if (failures) process.exit(1);
  console.log("\n✓ Article parity validation passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
