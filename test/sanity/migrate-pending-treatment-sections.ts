#!/usr/bin/env npx tsx
/**
 * Fill missing treatment-page sections for pending / newly migrated treatments:
 *
 * 1. `promises` — the 3 canonical cards ("Du bestemmer…", "Spesialister med dybde",
 *    "Alt under samme tak") with uploaded images.
 * 2. `pageSections[]` → `pageSectionSpecialists` — "Spesialister som utfører dette"
 *    carousel (manual refs from treatmentContent when available, otherwise category filter).
 *
 * By default only processes the same TARGET_KEYS as migrate-selected-missing-treatments.ts.
 * Set ALL=1 to patch every treatment missing these fields.
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 SANITY_TOKEN=xxx npx tsx sanity/migrate-pending-treatment-sections.ts
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-pending-treatment-sections.ts
 */
import fs, { readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ALL = process.env.ALL === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMISES_DIR = path.resolve(__dirname, "../../src/assets/promises");

const TARGET_KEYS = [
  "gynekologi/fodselsskader",
  "gynekologi/fostermedisin",
  "gynekologi/pmos",
  "fertilitet/assistert-befruktning-for-par-og-single",
  "flere-fagomrader/hudbehandlinger",
  "flere-fagomrader/hudbehandlinger/pigmentforandringer-og-solskader",
  "flere-fagomrader/hudbehandlinger/rodhet-og-synlige-blodkar",
  "flere-fagomrader/hudbehandlinger/forbedring-av-hudstruktur",
  "flere-fagomrader/hudbehandlinger/kosmetisk-dermatologi",
  "flere-fagomrader/hudbehandlinger/elastisitet-og-volum",
  "flere-fagomrader/hudbehandlinger/foflekksjekk",
  "flere-fagomrader/behandlingsutstyr",
  "flere-fagomrader/hudpleieprodukter",
  "flere-fagomrader/gastrokirurgi/brokkoperasjon",
  "flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager",
];

const PROMISE_CARDS = [
  {
    file: "promises-1.webp",
    eyebrow: { no: "Trygghet", en: "Safety" },
    title: {
      no: "Du bestemmer hva du er komfortabel med",
      en: "You decide what you are comfortable with",
    },
    desc: {
      no: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      en: "All examinations and procedures are done at your pace. You can stop at any time, ask questions along the way, and bring someone with you if you wish.",
    },
  },
  {
    file: "promises-2.jpg",
    eyebrow: { no: "Kompetanse", en: "Expertise" },
    title: { no: "Spesialister med dybde", en: "Specialists with depth" },
    desc: {
      no: "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
      en: "With us you meet doctors who have specialized deeply within their field – not a general practitioner on placement. You get the right expertise from the very first consultation.",
    },
  },
  {
    file: "promises-3.jpg",
    eyebrow: { no: "Helhet", en: "Holistic care" },
    title: { no: "Alt under samme tak", en: "Everything under one roof" },
    desc: {
      no: "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
      en: "If you need further examination, treatment or follow-up – we coordinate the entire process for you.",
    },
  },
] as const;

const HEADING_NO = "Spesialister som utfører dette";
const HEADING_EN = "Specialists who perform this";
const INTRO_NO = "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.";
const INTRO_EN = "Experience, specialist expertise and modern technology gathered in one place.";

type Ref = { _type: "reference"; _ref: string; _key?: string };
type I18nItem = { _key: string; _type: string; language: string; value: string };

const i18nString = (no: string, en: string): I18nItem[] => [
  { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];

const i18nText = (no: string, en: string): I18nItem[] => [
  { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
];

function treatmentDocId(categoryId: string, subPath: string): string {
  return `treatment-${categoryId}-${subPath.replace(/\//g, "-")}`;
}

function targetDocIds(): string[] {
  return TARGET_KEYS.map((key) => {
    const slash = key.indexOf("/");
    const categoryId = key.slice(0, slash);
    const subId = key.slice(slash + 1);
    return treatmentDocId(categoryId, subId);
  });
}

function pickNo(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (
    value.find((x) => (x as I18nItem).language === "no")?.value ||
    value.find((x) => (x as I18nItem)._key === "no")?.value ||
    (value[0] as I18nItem)?.value ||
    ""
  );
}

function hasPromiseImages(promises: unknown): boolean {
  if (!Array.isArray(promises) || promises.length < 3) return false;
  return promises.every((p) => Boolean((p as { image?: { asset?: { _ref?: string } } }).image?.asset?._ref));
}

async function uploadPromiseImages(): Promise<Array<string | null>> {
  console.log("\n🖼️  Uploading promise card images…");
  const ids: Array<string | null> = [];
  for (const card of PROMISE_CARDS) {
    const abs = path.join(PROMISES_DIR, card.file);
    if (!fs.existsSync(abs)) {
      console.warn(`   ✗ missing ${card.file}`);
      ids.push(null);
      continue;
    }
    const buf = fs.readFileSync(abs);
    const contentType = card.file.endsWith(".webp")
      ? "image/webp"
      : card.file.endsWith(".png")
        ? "image/png"
        : "image/jpeg";
    const asset = await sanityClient.assets.upload("image", buf, {
      filename: card.file,
      contentType,
    });
    console.log(`   ✓ ${card.title.no} → ${asset._id}`);
    ids.push(asset._id);
  }
  return ids;
}

function buildPromises(imageRefs: Array<string | null>) {
  return PROMISE_CARDS.map((card, i) => ({
    _type: "object",
    _key: `promise${i}`,
    eyebrow: i18nString(card.eyebrow.no, card.eyebrow.en),
    title: i18nString(card.title.no, card.title.en),
    desc: i18nText(card.desc.no, card.desc.en),
    ...(imageRefs[i]
      ? {
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: imageRefs[i]! },
          },
        }
      : {}),
  }));
}

function loadLiveRelatedMap(): Record<string, string[]> {
  const srcPath = resolve(__dirname, "../../src/data/treatmentContent.ts");
  const src = readFileSync(srcPath, "utf8");
  const keyRe = /"([a-z0-9-]+)\/([a-z0-9-]+)"\s*:\s*\{/g;
  const keys: { key: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = keyRe.exec(src)) !== null) {
    keys.push({ key: `${m[1]}/${m[2]}`, index: m.index });
  }

  const map: Record<string, string[]> = {};
  for (let i = 0; i < keys.length; i++) {
    const start = keys[i].index;
    const end = keys[i + 1]?.index ?? src.length;
    const chunk = src.slice(start, end);
    const relMatch = chunk.match(/relatedSpecialists\s*:\s*\[([^\]]*)\]/);
    if (!relMatch) continue;
    const slugs = Array.from(relMatch[1].matchAll(/["']([a-z0-9-]+)["']/g)).map((mm) => mm[1]);
    if (slugs.length > 0) map[keys[i].key] = slugs;
  }
  return map;
}

function buildManualRefsFromSlugs(
  slugs: string[],
  slugToId: Record<string, string>,
): { refs: Ref[]; missing: string[] } {
  const refs: Ref[] = [];
  const missing: string[] = [];
  for (const slug of slugs) {
    const id = slugToId[slug];
    if (id) refs.push({ _type: "reference", _ref: id, _key: `spec-${id.slice(-8)}` });
    else missing.push(slug);
  }
  return { refs, missing };
}

function buildManualRefsFromRefs(refs: Ref[] | undefined): Ref[] {
  if (!Array.isArray(refs)) return [];
  return refs
    .filter((r) => r?._ref)
    .map((r) => ({ _type: "reference", _ref: r._ref, _key: r._key || `spec-${r._ref.slice(-8)}` }));
}

function hasSpecialistsSection(sections: unknown[] | undefined): boolean {
  return Array.isArray(sections) && sections.some((s) => (s as { _type?: string })?._type === "pageSectionSpecialists");
}

async function run() {
  console.log(
    `\n[migrate-pending-treatment-sections] mode=${DRY_RUN ? "DRY_RUN" : "WRITE"} scope=${ALL ? "all missing" : `${TARGET_KEYS.length} TARGET_KEYS`}\n`,
  );

  const imageRefs = await uploadPromiseImages();
  const liveMap = loadLiveRelatedMap();

  const specialists: { _id: string; slug: string }[] = await sanityClient.fetch(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current)
    }`,
  );
  const slugToId: Record<string, string> = {};
  for (const s of specialists) if (s.slug) slugToId[s.slug] = s._id;

  const scopeIds = ALL ? null : targetDocIds();
  const treatments: Array<{
    _id: string;
    title?: unknown;
    slug?: string;
    categorySlug?: string;
    promises?: unknown[];
    relatedSpecialists?: Ref[];
    pageSections?: unknown[];
  }> = await sanityClient.fetch(
    ALL
      ? `*[_type == "treatment" && !(_id in path("drafts.**"))]{
          _id, title,
          "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
          "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug[0].value.current),
          promises, relatedSpecialists, pageSections
        }`
      : `*[_type == "treatment" && _id in $ids]{
          _id, title,
          "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
          "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug[0].value.current),
          promises, relatedSpecialists, pageSections
        }`,
    ALL ? {} : { ids: scopeIds },
  );

  let promisesPatched = 0;
  let specialistsPatched = 0;
  let skipped = 0;

  for (const t of treatments) {
    const label = pickNo(t.title) || t._id;
    const patch: Record<string, unknown> = {};
    let changed = false;

    if (!hasPromiseImages(t.promises)) {
      patch.promises = buildPromises(imageRefs);
      changed = true;
      console.log(`  + promises: ${label}`);
    }

    if (!hasSpecialistsSection(t.pageSections)) {
      let liveKey = t.categorySlug && t.slug ? `${t.categorySlug}/${t.slug}` : "";
      if (t.categorySlug === "ovrige" && t.slug) liveKey = `flere-fagomrader/${t.slug}`;

      const liveSlugs = liveKey ? liveMap[liveKey] : undefined;
      let manualRefs: Ref[] = [];
      let source = "category";

      if (liveSlugs?.length) {
        const built = buildManualRefsFromSlugs(liveSlugs, slugToId);
        manualRefs = built.refs;
        if (built.missing.length) {
          console.warn(`    ⚠ ${label}: missing specialist slugs → ${built.missing.join(", ")}`);
        }
        source = "manual-live";
      } else {
        manualRefs = buildManualRefsFromRefs(t.relatedSpecialists);
        if (manualRefs.length) source = "manual-sanity";
      }

      const hasManual = manualRefs.length > 0;
      const categorySlug = !hasManual && t.categorySlug ? t.categorySlug : undefined;
      if (!hasManual && categorySlug) source = "category";

      const sections = Array.isArray(t.pageSections) ? [...t.pageSections] : [];
      sections.push({
        _type: "pageSectionSpecialists",
        _key: randomUUID(),
        title: i18nString(HEADING_NO, HEADING_EN),
        description: i18nText(INTRO_NO, INTRO_EN),
        displayMode: hasManual ? "manual" : "category",
        limit: 8,
        variant: "carousel",
        ...(hasManual ? { specialists: manualRefs } : { categorySlug }),
      });

      patch.pageSections = sections;
      changed = true;
      console.log(
        `  + pageSectionSpecialists: ${label} [${source}]${hasManual ? ` (${manualRefs.length} refs)` : categorySlug ? ` (category=${categorySlug})` : ""}`,
      );
    }

    if (!changed) {
      skipped++;
      continue;
    }

    if (!DRY_RUN) {
      await sanityClient.patch(t._id).set(patch).commit();
    }

    if (patch.promises) promisesPatched++;
    if (patch.pageSections) specialistsPatched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Treatments checked:     ${treatments.length}`);
  console.log(`Promises added/updated: ${promisesPatched}`);
  console.log(`Specialists sections:   ${specialistsPatched}`);
  console.log(`Skipped (complete):     ${skipped}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
