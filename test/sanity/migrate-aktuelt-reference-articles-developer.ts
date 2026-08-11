#!/usr/bin/env npx tsx
/**
 * Developer-only: migrate reference Aktuelt editorial articles into Developer Sanity.
 *
 * Source data scraped from https://avenewdemo.online/aktuelt (see data/reference-aktuelt-articles.json).
 *
 *   cd test && npx tsx sanity/migrate-aktuelt-reference-articles-developer.ts
 *
 * Optional dry run:
 *   DRY_RUN=1 cd test && npx tsx sanity/migrate-aktuelt-reference-articles-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { patchSingletonFields } from "./lib/patch-singleton";
import { i18nString, i18nText } from "./lib/category-landing-i18n";
import {
  REFERENCE_FEATURED_SLUGS,
  REFERENCE_LISTING_SLUGS,
} from "./reference-listing-slugs";

type ScrapedBlock = {
  type: string;
  text?: string;
  items?: string[];
};

type ScrapedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string | null;
  heroImage: string;
  heroAlt: string;
  blocks: ScrapedBlock[];
};

type ReferenceBundle = {
  featuredSlugs: string[];
  listingSlugs: string[];
  articles: Record<string, ScrapedArticle>;
};

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

/** Existing developer documents that use a different slug than the reference URL. */
const DEVELOPER_SLUG_ALIASES: Record<string, string> = {
  "18-maneder-etter-hofteoperasjon-hos-cmedical":
    "18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen",
};

function blockKey(): string {
  return randomBytes(6).toString("hex");
}

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function span(text: string, marks: string[] = []) {
  return {
    _type: "span" as const,
    _key: blockKey(),
    text,
    marks,
  };
}

function ptBlock(
  style: string,
  children: ReturnType<typeof span>[],
  extras: Record<string, unknown> = {},
) {
  return {
    _type: "block" as const,
    _key: blockKey(),
    style,
    markDefs: [] as Array<Record<string, unknown>>,
    children,
    ...extras,
  };
}

function blocksToPortableText(blocks: ScrapedBlock[]) {
  const out: Array<Record<string, unknown>> = [];

  for (const b of blocks) {
    switch (b.type) {
      case "paragraph":
        out.push(ptBlock("normal", [span(b.text || "")]));
        break;
      case "heading":
        out.push(ptBlock("h2", [span(b.text || "")]));
        break;
      case "subheading":
        out.push(ptBlock("h3", [span(b.text || "")]));
        break;
      case "author":
        out.push(ptBlock("normal", [span(b.text || "", ["em"])]));
        break;
      case "bold-intro":
        out.push(ptBlock("normal", [span(b.text || "")]));
        break;
      case "quote":
        out.push(ptBlock("blockquote", [span(b.text || "")]));
        break;
      case "list":
        for (const item of b.items || []) {
          out.push(
            ptBlock("normal", [span(item)], {
              listItem: "bullet",
              level: 1,
            }),
          );
        }
        break;
      default:
        break;
    }
  }

  return out;
}

function slugArray(slug: string) {
  return [
    {
      _key: blockKey(),
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: slug },
    },
    {
      _key: blockKey(),
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: slug },
    },
  ];
}

function bodyField(blocks: ScrapedBlock[]) {
  return [
    {
      _key: blockKey(),
      _type: "internationalizedArrayBlockContentValue",
      language: "no",
      value: blocksToPortableText(blocks),
    },
  ];
}

async function downloadAndUploadImage(url: string, filename: string): Promise<string> {
  if (!url) return "";
  console.log(`    upload image: ${filename}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`    ⚠ image download failed: ${url}`);
    return "";
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (DRY_RUN) return "";
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: `${filename}.jpg`,
    contentType: "image/jpeg",
  });
  return asset._id;
}

async function findArticleIdBySlug(slug: string): Promise<string | null> {
  const aliases = [slug, DEVELOPER_SLUG_ALIASES[slug]].filter(Boolean);
  for (const candidate of aliases) {
    const id = await sanityClient.fetch<string | null>(
      `*[_type == "article" && !(_id in path("drafts.**")) && (
        coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current, slug.current) == $slug ||
        _id == $derivedId
      )][0]._id`,
      { slug: candidate, derivedId: `article-${candidate}` },
    );
    if (id) return id;
  }
  return null;
}

function loadReferenceBundle(): ReferenceBundle {
  const filePath = path.join(__dirname, "data/reference-aktuelt-articles.json");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing ${filePath}. Run tmp/pw/scrape-reference-aktuelt-full.js first.`,
    );
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ReferenceBundle;
}

async function upsertArticle(refSlug: string, article: ScrapedArticle) {
  const existingId = await findArticleIdBySlug(refSlug);
  const docId = existingId || `article-${refSlug}`;
  const bodyBlocks = article.blocks || [];

  if (!article.title || bodyBlocks.length === 0) {
    throw new Error(`Reference article "${refSlug}" is missing title or body blocks`);
  }

  const imageAssetId = await downloadAndUploadImage(article.heroImage, refSlug);

  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "article",
    title: i18nString(article.title, article.title),
    slug: slugArray(refSlug),
    excerpt: i18nText(article.excerpt || "", article.excerpt || ""),
    category: article.category,
    publishedAt: article.publishedAt || new Date().toISOString(),
    body: bodyField(bodyBlocks),
  };

  if (imageAssetId) {
    doc.primaryImage = {
      _type: "image",
      alt: i18nString(article.heroAlt || article.title, article.heroAlt || article.title),
      asset: { _type: "reference", _ref: imageAssetId },
    };
  }

  console.log(`  ${existingId ? "update" : "create"} ${refSlug} (${docId})`);
  if (DRY_RUN) return docId;

  await sanityClient.createIfNotExists({ _id: docId, _type: "article" });
  await sanityClient.patch(docId).set(doc).commit();
  return docId;
}

async function refsForSlugs(slugs: string[]) {
  const refs = [];
  for (const slug of slugs) {
    const id = await findArticleIdBySlug(slug);
    if (!id) {
      console.warn(`  ⚠ missing article for slug: ${slug}`);
      continue;
    }
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

  const bundle = loadReferenceBundle();
  const refSlugs = Object.keys(bundle.articles);

  console.log(`Reference editorial articles: ${refSlugs.length}`);
  console.log(`Featured order: ${bundle.featuredSlugs.join(" → ")}`);
  console.log(`Listing order (${bundle.listingSlugs.length}): ${bundle.listingSlugs.join(" → ")}`);
  if (DRY_RUN) console.log("DRY RUN — no writes");

  for (const slug of refSlugs) {
    await upsertArticle(slug, bundle.articles[slug]);
  }

  const featuredRefs = await refsForSlugs(REFERENCE_FEATURED_SLUGS);
  const listingRefs = await refsForSlugs(REFERENCE_LISTING_SLUGS);

  if (!DRY_RUN) {
    await patchSingletonFields("newsPage", {
      featuredArticles: featuredRefs,
      listingArticles: listingRefs,
    });
  }

  console.log("\n✓ Migration complete");
  console.log(`  articles processed: ${refSlugs.length}`);
  console.log(`  featuredArticles: ${featuredRefs.length}`);
  console.log(`  listingArticles: ${listingRefs.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
