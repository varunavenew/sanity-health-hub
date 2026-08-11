#!/usr/bin/env npx tsx
/**
 * Compare reference Aktuelt inventory vs Developer Sanity vs local frontend.
 *
 *   cd test && npx tsx sanity/verify-aktuelt-content-parity.ts
 */
import fs from "fs";
import path from "path";
import { DATASET, sanityClient } from "./config";

type RefArticle = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string | null;
  excerpt: string;
};

const LOCAL_BASE = process.env.LOCAL_BASE || "http://localhost:3000";

function loadReference() {
  const file = path.join(__dirname, "data/reference-aktuelt-articles.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as {
    featuredSlugs: string[];
    listingSlugs: string[];
    articles: Record<string, RefArticle & { url: string }>;
  };
}

async function fetchLocal(slug: string) {
  const url = `${LOCAL_BASE}/no/aktuelt/${slug}`;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([^<]+)</);
    const has404 = html.includes("404") && res.status === 404;
    return {
      url,
      status: res.status,
      ok: res.ok,
      title: titleMatch?.[1]?.trim() || null,
      has404,
    };
  } catch (e) {
    return { url, status: 0, ok: false, title: null, has404: false, error: String(e) };
  }
}

async function main() {
  if (DATASET !== "developer") throw new Error("developer only");

  const ref = loadReference();
  const slugs = ref.listingSlugs;

  const sanityArticles = await sanityClient.fetch<
    Array<{
      _id: string;
      category: string;
      publishedAt: string;
      slug: string;
      title: string;
    }>
  >(
    `*[_type == "article" && !(_id in path("drafts.**")) && coalesce(
      slug[language == "no"][0].value.current,
      slug[0].value.current
    ) in $slugs]{
      _id,
      category,
      publishedAt,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current),
      "title": coalesce(title[language == "no"][0].value, title[0].value)
    }`,
    { slugs },
  );

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

  console.log("=== CONTENT PARITY REPORT ===\n");
  console.log(`Reference articles: ${slugs.length}`);
  console.log(`Developer Sanity matches: ${sanityArticles.length}`);
  console.log(`Featured order match: ${JSON.stringify(newsPage.featured.map((f) => f.slug)) === JSON.stringify(ref.featuredSlugs) ? "YES" : "NO"}`);
  console.log(`Listing order match: ${JSON.stringify(newsPage.listing.map((l) => l.slug)) === JSON.stringify(ref.listingSlugs) ? "YES" : "NO"}\n`);

  const sanityBySlug = Object.fromEntries(sanityArticles.map((a) => [a.slug, a]));
  const rows: string[] = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const refArt = ref.articles[slug];
    const dev = sanityBySlug[slug];
    const local = await fetchLocal(slug);

    const featuredPos = ref.featuredSlugs.indexOf(slug);
    const listingPos = i + 1;

    const dateMatch = dev && refArt.publishedAt
      ? dev.publishedAt?.slice(0, 10) === refArt.publishedAt.slice(0, 10)
      : false;
    const catMatch = dev?.category === refArt.category;

    let status = "MATCHED";
    if (!dev) status = "MISSING_DEV";
    else if (!local.ok) status = "LOCAL_404";
    else if (!dateMatch) status = "DATE_DIFF";
    else if (!catMatch) status = "CATEGORY_DIFF";

    rows.push(
      [
        refArt.title.slice(0, 50),
        dev?._id || "—",
        local.url,
        refArt.category,
        refArt.publishedAt?.slice(0, 10) || "—",
        featuredPos >= 0 ? String(featuredPos + 1) : "—",
        String(listingPos),
        status,
      ].join(" | "),
    );
  }

  console.log("REF TITLE | DEV DOC | LOCAL URL | CAT | DATE | FEAT# | LIST# | STATUS");
  console.log("-".repeat(120));
  for (const row of rows) console.log(row);

  const listingRes = await fetch(`${LOCAL_BASE}/no/aktuelt`);
  console.log(`\nListing page: ${listingRes.status} ${listingRes.ok ? "OK" : "FAIL"}`);

  const failures = rows.filter((r) => !r.endsWith("MATCHED") && !r.endsWith("DATE_DIFF"));
  if (failures.length) {
    console.error(`\n${failures.length} parity issue(s)`);
    process.exit(1);
  }
  console.log("\n✓ All reference articles present in Developer Sanity and load locally");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
