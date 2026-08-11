#!/usr/bin/env npx tsx
/**
 * Developer-only: sync mismatched article content from reference scrape.
 *
 *   cd test && npx tsx sanity/sync-mismatched-articles-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

/** Articles that failed parity compare against reference scrape. */
const TARGET_SLUGS = [
  "historiene-ingen-snakker-om-etter-fodsel",
  "jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor",
  "maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge",
  "cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse",
  "cmedical-kjoper-livio-oslo",
  "tanken-slo-meg-ikke-at-det-kunne-vaere-meg",
  "ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar",
];

type ScrapedBlock = {
  type: string;
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
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

function blockKey(): string {
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
      case "image":
        // Inline images handled separately if asset uploaded; skip empty
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

async function findArticleId(slug: string): Promise<string | null> {
  return sanityClient.fetch<string | null>(
    `*[_type == "article" && !(_id in path("drafts.**")) && (
      coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current) == $slug ||
      _id == $derivedId
    )][0]._id`,
    { slug, derivedId: `article-${slug}` },
  );
}

async function upsertArticle(article: ScrapedArticle) {
  const existingId = await findArticleId(article.slug);
  const docId = existingId || `article-${article.slug}`;
  if (!article.title || !article.blocks?.length) {
    throw new Error(`Incomplete scrape for ${article.slug}`);
  }

  const imageAssetId = await downloadAndUploadImage(
    article.heroImage,
    article.slug,
  );

  const bodyNo = blocksToPortableText(article.blocks);
  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "article",
    title: i18nString(article.title, article.title),
    slug: slugArray(article.slug),
    excerpt: i18nText(article.excerpt || "", article.excerpt || ""),
    category: article.category,
    publishedAt: article.publishedAt || new Date().toISOString(),
    body: [
      {
        _key: blockKey(),
        _type: "internationalizedArrayBlockContentValue",
        language: "no",
        value: bodyNo,
      },
      {
        _key: blockKey(),
        _type: "internationalizedArrayBlockContentValue",
        language: "en",
        value: bodyNo,
      },
    ],
  };

  if (imageAssetId) {
    doc.primaryImage = {
      _type: "image",
      alt: i18nString(
        article.heroAlt || article.title,
        article.heroAlt || article.title,
      ),
      asset: { _type: "reference", _ref: imageAssetId },
    };
  }

  console.log(
    `  ${existingId ? "update" : "create"} ${article.slug} (${docId}) body=${bodyNo.length}`,
  );
  if (DRY_RUN) return docId;

  await sanityClient.createIfNotExists({ _id: docId, _type: "article" });
  await sanityClient.patch(docId).set(doc).commit();
  return docId;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(
      `ABORT: This script can only modify the developer dataset (got "${DATASET}").`,
    );
  }

  const filePath = path.join(__dirname, "data/reference-aktuelt-articles.json");
  const bundle = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    articles: Record<string, ScrapedArticle>;
  };

  console.log(`Syncing ${TARGET_SLUGS.length} mismatched articles…`);
  if (DRY_RUN) console.log("DRY RUN");

  for (const slug of TARGET_SLUGS) {
    const article = bundle.articles[slug];
    if (!article) throw new Error(`Missing scrape for ${slug}`);
    await upsertArticle(article);
  }

  console.log("\n✓ Sync complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
