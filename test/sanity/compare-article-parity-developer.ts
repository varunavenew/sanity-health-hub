#!/usr/bin/env npx tsx
/**
 * Compare reference scraped article bodies vs Developer Sanity.
 *
 *   cd test && npx tsx sanity/compare-article-parity-developer.ts
 */
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { REFERENCE_LISTING_SLUGS } from "./reference-listing-slugs";

type RefBlock = { type: string; text?: string; items?: string[]; src?: string };
type RefArticle = {
  slug: string;
  title: string;
  category: string;
  dateText: string;
  publishedAt: string | null;
  excerpt: string;
  heroImage: string;
  blocks: RefBlock[];
};

function normalize(s: string): string {
  return s
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[«»""]/g, '"')
    .replace(/[–—]/g, "-")
    .trim();
}

function blockText(b: RefBlock): string {
  if (b.items?.length) return b.items.map(normalize).join(" | ");
  return normalize(b.text || "");
}

function ptToPlain(blocks: Array<Record<string, unknown>>): string[] {
  const out: string[] = [];
  for (const b of blocks || []) {
    if (b._type === "image") {
      out.push("[image]");
      continue;
    }
    if (b._type !== "block") continue;
    const children = (b.children as Array<{ text?: string }>) || [];
    const text = normalize(children.map((c) => c.text || "").join(""));
    if (!text) continue;
    const style = String(b.style || "normal");
    const listItem = b.listItem ? String(b.listItem) : "";
    out.push(`${listItem || style}:${text}`);
  }
  return out;
}

function refToPlain(blocks: RefBlock[]): string[] {
  const out: string[] = [];
  for (const b of blocks || []) {
    if (b.type === "image") {
      out.push("[image]");
      continue;
    }
    if (b.type === "list") {
      for (const item of b.items || []) out.push(`bullet:${normalize(item)}`);
      continue;
    }
    const map: Record<string, string> = {
      heading: "h2",
      subheading: "h3",
      paragraph: "normal",
      "bold-intro": "normal",
      author: "normal",
      quote: "blockquote",
    };
    const style = map[b.type] || b.type;
    const text = blockText(b);
    if (text) out.push(`${style}:${text}`);
  }
  return out;
}

async function fetchDev(slug: string) {
  return sanityClient.fetch<{
    _id: string;
    title: string;
    category: string;
    publishedAt: string;
    excerpt: string;
    heroImage: string;
    body: Array<Record<string, unknown>>;
  } | null>(
    `*[_type == "article" && !(_id in path("drafts.**")) && coalesce(
      slug[language == "no"][0].value.current,
      slug[0].value.current,
      slug.current
    ) == $slug][0]{
      _id,
      "title": coalesce(title[language == "no"][0].value, title[0].value, title),
      category,
      publishedAt,
      "excerpt": coalesce(excerpt[language == "no"][0].value, excerpt[0].value, excerpt),
      "heroImage": primaryImage.asset->url,
      "body": coalesce(body[language == "no"][0].value, body[0].value, body)
    }`,
    { slug },
  );
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error("wrong project");
  if (DATASET !== "developer") throw new Error("developer only");

  const bundle = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data/reference-aktuelt-articles.json"),
      "utf8",
    ),
  ) as { articles: Record<string, RefArticle> };

  let mismatches = 0;
  const report: Array<Record<string, unknown>> = [];

  for (const slug of REFERENCE_LISTING_SLUGS) {
    const ref = bundle.articles[slug];
    const dev = await fetchDev(slug);
    if (!ref) {
      console.log(`✗ ${slug} — missing from reference scrape`);
      mismatches++;
      continue;
    }
    if (!dev) {
      console.log(`✗ ${slug} — missing from Developer Sanity`);
      mismatches++;
      continue;
    }

    const refPlain = refToPlain(ref.blocks || []);
    const devPlain = ptToPlain(dev.body || []);
    const titleOk = normalize(ref.title) === normalize(dev.title);
    const catOk = normalize(ref.category) === normalize(dev.category || "");
    const dateOk =
      !ref.publishedAt ||
      (dev.publishedAt || "").slice(0, 10) === ref.publishedAt.slice(0, 10);

    // Compare block texts ignoring style labels loosely
    const refTexts = refPlain.map((x) => x.replace(/^[^:]+:/, ""));
    const devTexts = devPlain.map((x) => x.replace(/^[^:]+:/, ""));

    let contentDiffs = 0;
    const max = Math.max(refTexts.length, devTexts.length);
    const sampleDiffs: string[] = [];
    for (let i = 0; i < max; i++) {
      if (refTexts[i] !== devTexts[i]) {
        contentDiffs++;
        if (sampleDiffs.length < 3) {
          sampleDiffs.push(
            `#${i}: REF="${(refTexts[i] || "").slice(0, 80)}" DEV="${(devTexts[i] || "").slice(0, 80)}"`,
          );
        }
      }
    }

    const ok =
      titleOk &&
      catOk &&
      dateOk &&
      contentDiffs === 0 &&
      refTexts.length === devTexts.length;

    if (!ok) mismatches++;

    console.log(
      `${ok ? "✓" : "✗"} ${slug}\n` +
        `  title:${titleOk ? "ok" : "DIFF"} cat:${catOk ? "ok" : `DIFF(${dev.category})`} date:${dateOk ? "ok" : "DIFF"}\n` +
        `  blocks ref=${refPlain.length} dev=${devPlain.length} textDiffs=${contentDiffs}`,
    );
    for (const d of sampleDiffs) console.log(`    ${d}`);

    report.push({
      slug,
      ok,
      titleOk,
      catOk,
      dateOk,
      refBlocks: refPlain.length,
      devBlocks: devPlain.length,
      contentDiffs,
      sampleDiffs,
      refTitle: ref.title,
      devTitle: dev.title,
      refCategory: ref.category,
      devCategory: dev.category,
    });
  }

  const out = path.join(__dirname, "data/article-parity-compare.json");
  fs.writeFileSync(out, JSON.stringify({ mismatches, report }, null, 2));
  console.log(`\nMismatches: ${mismatches}/${REFERENCE_LISTING_SLUGS.length}`);
  console.log(`Wrote ${out}`);
  if (mismatches) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
