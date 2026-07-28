#!/usr/bin/env npx tsx
/**
 * Migrate Guide Sections from legacy TreatmentCategory content.
 *
 * Each Guide Section contains only:
 * - title
 * - description (Portable Text: paragraphs + bullet lists)
 * - image
 *
 * Every array item MUST include `_type: "guideSection"` and a stable `_key`
 * so Studio resolves nested fields. (Publish enablement also requires valid SEO —
 * see requiredNoEnSeo on guidePage.)
 *
 * Dataset: developer by default. Production is blocked by migration guard.
 *
 * Run:
 *   cd test && npm run migrate:guide-owned-sections:dry
 *   cd test && npm run migrate:guide-owned-sections
 */
import { randomUUID } from "node:crypto";
import { sanityClient } from "./config";
import { patchSingletonFields, singletonDocumentIds } from "./lib/patch-singleton";

const DRY_RUN = process.env.DRY_RUN === "1";
const GUIDE_ID = "guidePage";
const SECTION_TYPE = "guideSection";

type I18nStringRow = { language?: string; _key?: string; value?: string };

type CategoryDoc = {
  _id: string;
  categoryId?: string;
  title?: unknown;
  heroImage?: { asset?: { _ref?: string } };
  landingPage?: {
    hero?: {
      body?: unknown;
      bullets?: Array<{ title?: unknown }>;
    };
    whySection?: {
      description?: unknown;
    };
  };
  treatments?: Array<{ title?: unknown }>;
};

type GuideSectionDoc = {
  _type: typeof SECTION_TYPE;
  _key: string;
  title?: unknown;
  description?: unknown;
  image?: { _type?: "image"; asset?: { _ref?: string } };
};

function shortKey() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function i18nString(no: string, en: string) {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function readLangString(value: unknown, lang: "no" | "en"): string {
  if (!Array.isArray(value)) return "";
  const rows = value as I18nStringRow[];
  const match = rows.find((row) => (row.language || row._key) === lang);
  return typeof match?.value === "string" ? match.value.trim() : "";
}

function readLangRaw(value: unknown, lang: "no" | "en"): unknown {
  if (!Array.isArray(value)) return undefined;
  const rows = value as I18nStringRow[];
  const match = rows.find((row) => (row.language || row._key) === lang);
  return (match as { value?: unknown } | undefined)?.value;
}

function normalizeTitle(value: unknown): string {
  return (readLangString(value, "no") || readLangString(value, "en") || "").trim().toLowerCase();
}

function sectionKeyFromCategoryId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
}

function mkParagraphBlocks(text: string) {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.trim()) return [];
  const paragraphs = normalized
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const parts = paragraphs.length ? paragraphs : [normalized.trim()];
  return parts.map((p) => ({
    _type: "block",
    _key: shortKey(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: shortKey(),
        text: p,
        marks: [],
      },
    ],
  }));
}

function isBlockArray(raw: unknown): raw is Array<{ _type?: string }> {
  return (
    Array.isArray(raw) &&
    raw.length > 0 &&
    typeof raw[0] === "object" &&
    (raw[0] as { _type?: string })?._type === "block"
  );
}

function toPortableBlocksFromRaw(raw: unknown): unknown[] {
  if (isBlockArray(raw)) return raw;
  if (typeof raw === "string") return mkParagraphBlocks(raw);
  return [];
}

function mkBulletListBlocks(items: string[]): unknown[] {
  return items
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: "block",
      _key: shortKey(),
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: shortKey(),
          text,
          marks: [],
        },
      ],
    }));
}

function mkI18nBlockContent(noBlocks: unknown[], enBlocks: unknown[]) {
  return [
    {
      _type: "internationalizedArrayBlockContentValue",
      _key: "no",
      language: "no",
      value: noBlocks,
    },
    {
      _type: "internationalizedArrayBlockContentValue",
      _key: "en",
      language: "en",
      value: enBlocks,
    },
  ];
}

type LangPair = { no: string; en: string };

function collectBulletTexts(cat: CategoryDoc): LangPair[] {
  const treatmentPairs = (cat.treatments || []).map((t) => ({
    no: readLangString(t.title, "no"),
    en: readLangString(t.title, "en"),
  }));

  const merged = treatmentPairs.filter((p) => p.no || p.en);
  const seen = new Set<string>();
  return merged.filter((p) => {
    const key = `${p.no}|||${p.en}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractDescription(cat: CategoryDoc): unknown {
  const heroBody = cat.landingPage?.hero?.body;
  const whyDesc = cat.landingPage?.whySection?.description;

  const heroNo = readLangRaw(heroBody, "no");
  const heroEn = readLangRaw(heroBody, "en");
  const whyNo = readLangRaw(whyDesc, "no");
  const whyEn = readLangRaw(whyDesc, "en");

  const noParagraphs = toPortableBlocksFromRaw(heroNo ?? whyNo);
  const enParagraphs = toPortableBlocksFromRaw(heroEn ?? whyEn);

  const bullets = collectBulletTexts(cat);
  const noBullets = mkBulletListBlocks(bullets.map((b) => b.no).filter(Boolean));
  const enBullets = mkBulletListBlocks(bullets.map((b) => b.en).filter(Boolean));

  return mkI18nBlockContent(
    [...noParagraphs, ...noBullets],
    [...enParagraphs, ...enBullets],
  );
}

function countBlocks(description: unknown, lang: "no" | "en") {
  if (!Array.isArray(description)) return { paragraphs: 0, bullets: 0, total: 0 };
  const entry = description.find(
    (row: { language?: string; _key?: string }) => (row.language || row._key) === lang,
  ) as { value?: unknown[] } | undefined;
  const blocks = Array.isArray(entry?.value) ? entry!.value! : [];
  const paragraphs = blocks.filter((b: { listItem?: string }) => !b?.listItem).length;
  const bullets = blocks.filter((b: { listItem?: string }) => b?.listItem === "bullet").length;
  return { paragraphs, bullets, total: blocks.length };
}

async function run() {
  console.log("▶ Migrate Guide sections (title + Portable Text description + image)");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}`);
  console.log(
    `  Dataset: ${
      (sanityClient as { config?: () => { dataset?: string } }).config?.()?.dataset || "unknown"
    }\n`,
  );

  const source = await sanityClient.fetch<{
    featuredCategories?: CategoryDoc[];
    allCategories?: CategoryDoc[];
    guideSections?: Array<GuideSectionDoc & { buttonLabel?: unknown; buttonLink?: string; _type?: string }>;
  } | null>(
    `*[_type == "guidePage" && !(_id in path("drafts.**"))][0]{
      "featuredCategories": featuredCategories[]->{
        _id,
        categoryId,
        title,
        heroImage,
        landingPage{
          hero{ body, bullets[]{title} },
          whySection{description}
        },
        "treatments": select(
          count(treatments) > 0 => treatments[]->{ title },
          *[_type == "treatment" && references(^._id) && !(_id in path("drafts.**"))]{ title }
        )
      },
      "allCategories": *[_type == "treatmentCategory" && !(_id in path("drafts.**"))] | order(sortOrder asc){
        _id,
        categoryId,
        title,
        heroImage,
        landingPage{
          hero{ body, bullets[]{title} },
          whySection{description}
        },
        "treatments": select(
          count(treatments) > 0 => treatments[]->{ title },
          *[_type == "treatment" && references(^._id) && !(_id in path("drafts.**"))]{ title }
        )
      },
      guideSections
    }`,
  );

  if (!source) {
    console.error("guidePage not found.");
    process.exit(1);
  }

  const featured = source.featuredCategories || [];
  const fallbackCategories = source.allCategories || [];
  const categories = featured.length ? featured : fallbackCategories;
  if (!categories.length) {
    console.log("No category source found. Nothing to migrate.");
    return;
  }

  const desiredSections: GuideSectionDoc[] = categories.map((cat) => {
    const titleNo = readLangString(cat.title, "no");
    const titleEn = readLangString(cat.title, "en") || titleNo;
    return {
      _type: SECTION_TYPE,
      _key: sectionKeyFromCategoryId(cat._id) || shortKey(),
      title: i18nString(titleNo, titleEn),
      description: extractDescription(cat),
      image: cat.heroImage?.asset?._ref
        ? { _type: "image" as const, asset: { _ref: cat.heroImage.asset._ref } }
        : undefined,
    };
  });

  const existingSections = Array.isArray(source.guideSections) ? source.guideSections : [];
  const desiredByTitle = new Map<string, GuideSectionDoc>();
  for (const sec of desiredSections) {
    const key = normalizeTitle(sec.title);
    if (key) desiredByTitle.set(key, sec);
  }

  const merged: GuideSectionDoc[] = existingSections.length
    ? existingSections.map((existing) => {
        const key = normalizeTitle(existing.title);
        const desired = key ? desiredByTitle.get(key) : undefined;
        if (!desired) {
          return {
            _type: SECTION_TYPE,
            _key: existing._key || shortKey(),
            title: existing.title,
            description: existing.description,
            image: existing.image,
          };
        }
        return {
          _type: SECTION_TYPE,
          _key: existing._key || desired._key,
          title: desired.title,
          description: desired.description,
          image: desired.image,
        };
      })
    : [];

  const mergedTitleKeys = new Set(merged.map((s) => normalizeTitle(s.title)));
  const missing = desiredSections.filter((s) => !mergedTitleKeys.has(normalizeTitle(s.title)));
  const finalSections = [...merged, ...missing];

  console.log(
    `Guide sections: existing=${existingSections.length}, desired=${desiredSections.length}, final=${finalSections.length}`,
  );
  finalSections.forEach((section, index) => {
    const titleEn = readLangString(section.title, "en");
    const titleNo = readLangString(section.title, "no");
    const noStats = countBlocks(section.description, "no");
    const enStats = countBlocks(section.description, "en");
    console.log(
      `  [${index + 1}] ${titleEn || titleNo || "(untitled)"} _type=${section._type} _key=${section._key} — NO: ${noStats.paragraphs}p/${noStats.bullets}•  EN: ${enStats.paragraphs}p/${enStats.bullets}•`,
    );
  });

  if (DRY_RUN) {
    console.log(
      "\n  DRY RUN — would overwrite guideSections with _type:guideSection and strip button fields.",
    );
    return;
  }

  await patchSingletonFields(GUIDE_ID, { guideSections: finalSections }, "guidePage");

  for (const id of singletonDocumentIds(GUIDE_ID)) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id });
    if (!exists) continue;
    // Remove legacy playlist + any leftover button fields from older migrations.
    await sanityClient
      .patch(id)
      .unset(["featuredCategories", "guideSections[].buttonLabel", "guideSections[].buttonLink"])
      .commit();
    console.log(`  Cleaned legacy fields on ${id}`);
  }

  const verify = await sanityClient.fetch<{
    guideSections?: Array<{ _key?: string; _type?: string; title?: unknown; description?: unknown }>;
    hasFeaturedCategories?: boolean;
    hasAnyButtonLabel?: boolean;
    hasAnyButtonLink?: boolean;
  }>(
    `*[_type == "guidePage" && !(_id in path("drafts.**"))][0]{
      guideSections[]{_key, _type, title, description},
      "hasFeaturedCategories": defined(featuredCategories),
      "hasAnyButtonLabel": count(guideSections[defined(buttonLabel)]) > 0,
      "hasAnyButtonLink": count(guideSections[defined(buttonLink)]) > 0
    }`,
  );

  const sections = Array.isArray(verify?.guideSections) ? verify.guideSections : [];
  const typedCount = sections.filter((s) => s._type === SECTION_TYPE).length;

  console.log("\nVerify:");
  console.log(`  guideSectionCount: ${sections.length}`);
  console.log(`  sectionsWithTypeGuideSection: ${typedCount}`);
  console.log(`  hasFeaturedCategories: ${Boolean(verify?.hasFeaturedCategories)}`);
  console.log(`  hasAnyButtonLabel: ${Boolean(verify?.hasAnyButtonLabel)}`);
  console.log(`  hasAnyButtonLink: ${Boolean(verify?.hasAnyButtonLink)}`);
  sections.forEach((s, idx) => {
    const titleEn = readLangString(s.title, "en");
    const noStats = countBlocks(s.description, "no");
    const enStats = countBlocks(s.description, "en");
    console.log(
      `  [${idx + 1}] ${titleEn || "(untitled)"} _type=${s._type || "null"} — NO ${noStats.paragraphs}p/${noStats.bullets}• | EN ${enStats.paragraphs}p/${enStats.bullets}•`,
    );
  });
  console.log("\n✓ Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
