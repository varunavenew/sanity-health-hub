#!/usr/bin/env npx tsx
/**
 * Developer-only: Save gynekologi (+ graviditet) treatment content NO+EN.
 *
 * Source: user reference dump + data/gynekologi-page-content.ts
 * - Proper Norwegian + English i18n fields
 * - Always sets heroDescription (avoids chip text override)
 * - Promise images = canonical demo assets
 * - Paths never use /behandlinger
 * - Keeps insurance pageSection; clears FAQ
 *
 *   cd test && npx tsx sanity/patch-gynekologi-all-content-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-gynekologi-all-content-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  GYN_PAGE_CONTENT,
  PROMISE_COPY,
  SHARED_UI,
  type PageContent,
  type ReasonI18n,
} from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
/** Optional: ONLY_GROUP=graviditet | gynekologi */
const ONLY_GROUP = process.env.ONLY_GROUP as
  | "graviditet"
  | "gynekologi"
  | undefined;

const CAT_GYN = "category-gynekologi";
const CAT_GRAV = "category-graviditet";

const PROMISE_IMAGES = {
  comfort: "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
  specialists: "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
  sameRoof: "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
} as const;

const SPEC = {
  alenka: "specialist-alenka-bindas",
  ane: "specialist-ane-gerda-z-eriksson",
  ashi: "specialist-ashi-ahmad",
  birgitteA: "specialist-birgitte-aspenes",
  henrik: "specialist-henrik-michelsen-wahl",
  jorgen: "specialist-jorgen-perminow",
  madeleine: "specialist-madeleine-engen",
  siri: "specialist-siri-klokstad",
  thomas: "specialist-thomas-fredrik-thaulow",
  ida: "specialist-ida-waagsbo-bjorntvedt",
  birgitteM: "specialist-birgitte-mitlid-mork",
} as const;

const DEMO_SPEC_SLUG_TO_ID: Record<string, string> = {
  "alenka-bindas": SPEC.alenka,
  "ane-gerda-z-eriksson": SPEC.ane,
  "ashi-ahmad": SPEC.ashi,
  "birgitte-aspenes": SPEC.birgitteA,
  "henrik-michelsen-wahl": SPEC.henrik,
  "jorgen-perminow": SPEC.jorgen,
  "madeleine-engen": SPEC.madeleine,
  "siri-klokstad": SPEC.siri,
  "thomas-fredrik-thaulow": SPEC.thomas,
  "ida-waagsbo-bjorntvedt": SPEC.ida,
  "birgitte-mitlid-mork": SPEC.birgitteM,
};

const GYN_TEAM = [
  SPEC.alenka,
  SPEC.ane,
  SPEC.ashi,
  SPEC.birgitteA,
  SPEC.henrik,
  SPEC.jorgen,
  SPEC.madeleine,
  SPEC.siri,
  SPEC.thomas,
] as const;

const PREG_TEAM = [SPEC.ashi, SPEC.madeleine] as const;

type DemoPage = {
  slug: string;
  specialistSlugs?: string[];
  relatedSlugs?: string[];
};

type PageCfg = {
  id: string;
  slug: string;
  group: "gynekologi" | "graviditet";
  createIfMissing?: boolean;
};

const PAGES: PageCfg[] = [
  { id: "treatment-gynekologi-undersokelse", slug: "undersokelse", group: "gynekologi" },
  { id: "treatment-gynekologi-hysteroskopi", slug: "hysteroskopi", group: "gynekologi" },
  { id: "treatment-gynekologi-endometriose", slug: "endometriose", group: "gynekologi" },
  { id: "treatment-gynekologi-adenomyose", slug: "adenomyose", group: "gynekologi", createIfMissing: true },
  // Single PMOS doc: NO slug `pmos`, EN slug `pcos` (see slugField). Do not recreate treatment-gynekologi-pcos.
  { id: "treatment-gynekologi-pmos", slug: "pmos", group: "gynekologi" },
  { id: "treatment-gynekologi-poi", slug: "poi", group: "gynekologi", createIfMissing: true },
  { id: "treatment-gynekologi-pms-og-pmdd", slug: "pms-pmdd", group: "gynekologi" },
  { id: "treatment-gynekologi-blodningsforstyrrelser", slug: "blodningsforstyrrelser", group: "gynekologi" },
  { id: "treatment-gynekologi-cyster", slug: "cyster", group: "gynekologi" },
  { id: "treatment-gynekologi-celleforandringer", slug: "celleforandringer", group: "gynekologi" },
  { id: "treatment-gynekologi-vulvalidelser", slug: "vulvalidelser", group: "gynekologi" },
  { id: "treatment-gynekologi-vaginisme", slug: "vaginisme", group: "gynekologi", createIfMissing: true },
  { id: "treatment-gynekologi-urinlekkasje", slug: "urinlekkasje", group: "gynekologi" },
  { id: "treatment-gynekologi-urogynekologi", slug: "urogynekologi", group: "gynekologi", createIfMissing: true },
  { id: "treatment-gynekologi-vaginale-fremfall", slug: "vaginale-fremfall", group: "gynekologi" },
  { id: "treatment-gynekologi-overgangsalder", slug: "overgangsalder", group: "gynekologi" },
  { id: "treatment-gynekologi-kirurgi", slug: "kirurgi", group: "gynekologi" },
  { id: "treatment-gynekologi-robotkirurgi", slug: "robotkirurgi", group: "gynekologi" },
  { id: "treatment-gynekologi-fjerne-livmor", slug: "fjerne-livmor", group: "gynekologi" },
  { id: "treatment-gynekologi-labiaplastikk", slug: "labiaplastikk", group: "gynekologi" },
  { id: "treatment-gynekologi-tverrfaglig", slug: "tverrfaglig", group: "gynekologi" },
  { id: "treatment-graviditet-ultralyd", slug: "ultralyd", group: "graviditet" },
  { id: "treatment-graviditet-6-ukerskontroll", slug: "6-ukerskontroll", group: "graviditet", createIfMissing: true },
  { id: "treatment-gynekologi-fodselsskader", slug: "fodselsskader", group: "graviditet" },
  { id: "treatment-graviditet-nipt", slug: "nipt", group: "graviditet" },
  { id: "treatment-graviditet-fosterdiagnostikk", slug: "fosterdiagnostikk", group: "graviditet" },
  { id: "treatment-gynekologi-fostermedisin", slug: "fostermedisin", group: "graviditet" },
  { id: "treatment-gynekologi-graviditet", slug: "graviditet", group: "graviditet" },
  { id: "treatment-gynekologi-spontanabort", slug: "spontanabort", group: "graviditet" },
  { id: "treatment-graviditet-svangerskapsteam", slug: "svangerskapsteam", group: "graviditet" },
];

const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

/** Cross-category related targets (flere fagområder) used by overgangsalder / tverrfaglig. */
const EXTRA_RELATED_IDS: Record<string, string> = {
  ernaeringsfysiolog: "treatment-flere-fagomrader-ernaringsfysiolog",
  ernaringsfysiolog: "treatment-flere-fagomrader-ernaringsfysiolog",
  osteopati: "treatment-flere-fagomrader-osteopati",
  sexologi: "treatment-flere-fagomrader-sexologi",
  psykologi: "treatment-flere-fagomrader-psykologi",
};

function resolveRelatedId(slug: string): string | undefined {
  return BY_SLUG.get(slug)?.id || EXTRA_RELATED_IDS[slug];
}

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

function i18nString(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayStringValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: en,
    },
  ];
}

function i18nText(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: en,
    },
  ];
}

function slugField(noSlug: string, enSlug = noSlug) {
  return [
    {
      _key: "no",
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: noSlug },
    },
    {
      _key: "en",
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: enSlug },
    },
  ];
}

function promiseImage(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

function reasonRow(index: number, r: ReasonI18n) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: refKey(),
    n: i18nString(n, n),
    title: i18nString(r.titleNo, r.titleEn),
    desc: i18nText(r.descNo || r.titleNo, r.descEn || r.titleEn),
  };
}

function promiseRows(variant: PageContent["promiseVariant"]) {
  const images = [
    PROMISE_IMAGES.comfort,
    PROMISE_IMAGES.specialists,
    PROMISE_IMAGES.sameRoof,
  ] as const;
  return PROMISE_COPY[variant].map((card, i) => ({
    _key: refKey(),
    title: i18nString(card.titleNo, card.titleEn),
    desc: i18nText(card.descNo, card.descEn),
    image: promiseImage(images[i]),
  }));
}

function heroPointChips() {
  return [
    {
      _key: refKey(),
      title: i18nString(SHARED_UI.shortWait.no, SHARED_UI.shortWait.en),
    },
    {
      _key: refKey(),
      title: i18nString(SHARED_UI.noReferral.no, SHARED_UI.noReferral.en),
    },
  ];
}

function specialistsSection(
  group: PageCfg["group"],
  specialistIds: readonly string[],
) {
  const isGrav = group === "graviditet";
  return {
    _type: "pageSectionSpecialists",
    _key: "specialists-section",
    displayMode: "manual",
    variant: "carousel",
    title: i18nString(
      SHARED_UI.specialistsTitle.no,
      SHARED_UI.specialistsTitle.en,
    ),
    description: i18nText(
      SHARED_UI.specialistsIntro.no,
      SHARED_UI.specialistsIntro.en,
    ),
    specialists: refs(specialistIds),
    seeAllHref: isGrav
      ? "/spesialister?kategori=graviditet"
      : "/spesialister?kategori=gynekologi",
    seeAllLabel: i18nString(
      isGrav ? SHARED_UI.seeAllSpecs.no : SHARED_UI.seeAllGynDocs.no,
      isGrav ? SHARED_UI.seeAllSpecs.en : SHARED_UI.seeAllGynDocs.en,
    ),
  };
}

function bookingSection(group: PageCfg["group"] = "gynekologi") {
  const collectionId =
    group === "graviditet"
      ? "migrated-cta-collection.760b317b8be4e216"
      : "migrated-cta-collection.a03ee8e4994a4abb";
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: { _type: "reference" as const, _ref: collectionId },
    title: i18nString(SHARED_UI.bookingTitle.no, SHARED_UI.bookingTitle.en),
    subtitle: i18nText(SHARED_UI.bookingDesc.no, SHARED_UI.bookingDesc.en),
    primaryLabel: i18nString(SHARED_UI.bookNow.no, SHARED_UI.bookNow.en),
  };
}

function categoryRefs(group: PageCfg["group"]) {
  const cat = group === "graviditet" ? CAT_GRAV : CAT_GYN;
  return {
    categories: [{ _key: refKey(), _type: "reference" as const, _ref: cat }],
    category: { _type: "reference" as const, _ref: cat },
  };
}

function seeAll(group: PageCfg["group"]) {
  if (group === "graviditet") {
    return {
      href: "/graviditet",
      labelNo: SHARED_UI.seeAllGrav.no,
      labelEn: SHARED_UI.seeAllGrav.en,
    };
  }
  return {
    href: "/gynekologi",
    labelNo: SHARED_UI.seeAllGyn.no,
    labelEn: SHARED_UI.seeAllGyn.en,
  };
}

function loadDemoPages(): Map<string, DemoPage> {
  const file = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "_tmp-demo-gynekologi-content.json",
  );
  if (!fs.existsSync(file)) return new Map();
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    pages: DemoPage[];
  };
  const map = new Map<string, DemoPage>();
  for (const p of raw.pages || []) {
    if (p.slug) map.set(p.slug, p);
  }
  return map;
}

function resolveSpecialists(page: PageCfg, demo?: DemoPage): string[] {
  // Page-specific specialist overrides from demo when sensible
  const fromDemo = (demo?.specialistSlugs || [])
    .map((sl) => DEMO_SPEC_SLUG_TO_ID[sl])
    .filter(Boolean) as string[];

  if (fromDemo.length > 0 && fromDemo.length <= 8) {
    return [...new Set(fromDemo)];
  }

  // Vulvalidelser / fremfall featured specialists from dump
  if (page.slug === "vulvalidelser") return [SPEC.ida];
  if (page.slug === "vaginale-fremfall") return [SPEC.madeleine];
  if (page.slug === "blodningsforstyrrelser") {
    return [SPEC.birgitteA, SPEC.birgitteM];
  }
  if (page.slug === "cyster") {
    return [SPEC.ane, SPEC.birgitteA, SPEC.henrik];
  }
  if (page.slug === "celleforandringer") {
    return [SPEC.ane, SPEC.birgitteA, SPEC.siri];
  }
  if (page.slug === "urinlekkasje") return [SPEC.birgitteA, SPEC.madeleine];
  if (page.slug === "fjerne-livmor") {
    return [SPEC.ane, SPEC.henrik, SPEC.thomas];
  }
  if (page.slug === "robotkirurgi") return [SPEC.thomas];
  if (page.slug === "graviditet") return [SPEC.ashi, SPEC.madeleine];
  if (page.slug === "spontanabort") return [SPEC.ashi, SPEC.birgitteM];

  return page.group === "graviditet" ? [...PREG_TEAM] : [...GYN_TEAM];
}

function resolveRelatedIds(page: PageCfg, content: PageContent, demo?: DemoPage): string[] {
  const preferred = [
    ...(content.relatedSlugs || []),
    ...(demo?.relatedSlugs || []),
  ]
    .map((sl) => resolveRelatedId(sl))
    .filter((id): id is string => Boolean(id) && id !== page.id);

  if (preferred.length) return [...new Set(preferred)].slice(0, 12);

  return PAGES.filter((p) => p.group === page.group && p.id !== page.id)
    .map((p) => p.id)
    .slice(0, 8);
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    if (!DRY_RUN) await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

function buildDocFields(
  page: PageCfg,
  content: PageContent,
  specialistIds: readonly string[],
  relatedIds: readonly string[],
  insurance?: Record<string, unknown>,
) {
  const nav = seeAll(page.group);
  const cats = categoryRefs(page.group);
  const reasons = content.reasons.map((r, i) => reasonRow(i, r));
  const hasPrice = Boolean(content.heroPriceNo && content.heroPriceEn);
  const priceNo = hasPrice
    ? content.heroPriceNo!.replace(/^fra\b/i, "Pris fra")
    : null;
  const priceEn = hasPrice ? content.heroPriceEn! : null;

  const patch: Record<string, unknown> = {
    title: i18nString(content.titleNo, content.titleEn),
    slug: slugField(page.slug, page.slug === "pmos" ? "pcos" : page.slug),
    ...cats,
    description: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroTitle: i18nString(content.heroTitleNo, content.heroTitleEn),
    heroPoints: heroPointChips(),
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    hideSeePriser: true,
    reasonsTitle: i18nString(content.reasonsTitleNo, content.reasonsTitleEn),
    reasonsLayout: content.reasonsLayout || "accordion",
    reasons,
    promises: promiseRows(content.promiseVariant),
    conversationCtaTitle: i18nString(content.midCtaNo, content.midCtaEn),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString(SHARED_UI.related.no, SHARED_UI.related.en),
      seeAllHref: nav.href,
      seeAllLabel: i18nString(nav.labelNo, nav.labelEn),
      asIntro: false,
      asServices: true,
      items: refs(relatedIds),
    },
    pageSections: [
      specialistsSection(page.group, specialistIds),
      ...(insurance ? [insurance] : []),
      bookingSection(page.group),
    ],
    srOnlyTitle: i18nString(
      `${content.titleNo} hos CMedical`,
      `${content.titleEn} at CMedical`,
    ),
    bookingService: page.slug,
    seo: {
      _type: "seo",
      metaTitle: i18nString(
        `${content.titleNo} | CMedical`,
        `${content.titleEn} | CMedical`,
      ),
      metaDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
      noIndex: false,
    },
    geoSummary: i18nText(content.heroLeadNo, content.heroLeadEn),
  };

  if (hasPrice && priceNo && priceEn) {
    patch.heroPrice = i18nString(priceNo, priceEn);
    patch.heroPriceLabel = i18nString(
      content.heroPriceLabelNo || content.titleNo,
      content.heroPriceLabelEn || content.titleEn,
    );
  }

  if (content.reasonsLeadNo && content.reasonsLeadEn) {
    patch.reasonsLead = i18nText(content.reasonsLeadNo, content.reasonsLeadEn);
  }

  return patch;
}

async function ensureCreated(
  page: PageCfg,
  content: PageContent,
  demo: DemoPage | undefined,
  templateHeroImage: unknown,
) {
  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id: page.id },
  );
  if (exists) return "exists";

  if (!page.createIfMissing) {
    throw new Error(`Missing published treatment: ${page.id}`);
  }

  const specialistIds = resolveSpecialists(page, demo);
  const relatedIds = resolveRelatedIds(page, content, demo);
  const fields = buildDocFields(page, content, specialistIds, relatedIds);

  const doc = {
    _id: page.id,
    _type: "treatment",
    pageRole: "service",
    heroImage: templateHeroImage,
    heroImageAlt: i18nString(
      `${content.titleNo} hos CMedical`,
      `${content.titleEn} at CMedical`,
    ),
    ...fields,
  };

  console.log(`  CREATE ${page.id}`);
  if (!DRY_RUN) {
    await sanityClient.createOrReplace(doc);
  }
  return "created";
}

async function patchPage(
  page: PageCfg,
  content: PageContent,
  demo: DemoPage | undefined,
) {
  console.log(`\n→ ${page.slug} (${page.id})`);

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id: page.id });

  const insurance = Array.isArray(pageSections)
    ? pageSections.find((s) => s._type === "pageSectionInsurance")
    : undefined;

  const specialistIds = resolveSpecialists(page, demo);
  const relatedIds = resolveRelatedIds(page, content, demo);
  const patch = buildDocFields(
    page,
    content,
    specialistIds,
    relatedIds,
    insurance,
  );

  const unset = ["faqs", "faqCollection", "faqSectionTitle"];
  if (!content.reasonsLeadNo) unset.push("reasonsLead");
  if (!content.heroPriceNo) {
    unset.push("heroPrice");
    unset.push("heroPriceLabel");
  }

  console.log(
    `  reasons=${content.reasons.length} related=${relatedIds.length} specialists=${specialistIds.length} price="${content.heroPriceNo || "fra 2 100 kr"}" insurance=${Boolean(insurance)} variant=${content.promiseVariant}`,
  );

  if (!DRY_RUN) {
    await sanityClient
      .patch(page.id)
      .unset(unset)
      .set(patch)
      .commit({ autoGenerateArrayKeys: true });
  }

  await discardDraft(page.id);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const demoMap = loadDemoPages();
  console.log(
    `Content pages=${Object.keys(GYN_PAGE_CONTENT).length} demo=${demoMap.size} DRY_RUN=${DRY_RUN} ONLY_GROUP=${ONLY_GROUP || "all"}`,
  );

  for (const id of Object.values(SPEC)) {
    const ok = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!ok) throw new Error(`Missing specialist: ${id}`);
  }

  for (const id of Object.values(PROMISE_IMAGES)) {
    const ok = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!ok) throw new Error(`Missing promise asset: ${id}`);
  }

  const template = await sanityClient.fetch<{ heroImage?: unknown } | null>(
    `*[_id==$id][0]{heroImage}`,
    { id: "treatment-gynekologi-undersokelse" },
  );
  if (!template?.heroImage) {
    throw new Error("Template heroImage missing on undersokelse");
  }

  const stats = { patched: 0, created: 0, skipped: 0, failed: [] as string[] };

  for (const page of PAGES) {
    if (ONLY_GROUP && page.group !== ONLY_GROUP) continue;
    const content = GYN_PAGE_CONTENT[page.slug];
    if (!content) {
      console.log(`SKIP no content: ${page.slug}`);
      stats.skipped++;
      stats.failed.push(page.slug);
      continue;
    }
    const demo = demoMap.get(page.slug);
    try {
      const status = await ensureCreated(
        page,
        content,
        demo,
        template.heroImage,
      );
      if (status === "created") stats.created++;
    } catch (e) {
      console.error(`CREATE FAIL ${page.slug}:`, e);
      stats.failed.push(page.slug);
    }
  }

  for (const page of PAGES) {
    if (ONLY_GROUP && page.group !== ONLY_GROUP) continue;
    const content = GYN_PAGE_CONTENT[page.slug];
    if (!content) continue;
    try {
      await patchPage(page, content, demoMap.get(page.slug));
      stats.patched++;
    } catch (e) {
      console.error(`PATCH FAIL ${page.slug}:`, e);
      stats.failed.push(page.slug);
    }
  }

  console.log("\n✓ Gynekologi + graviditet NO+EN content patched on developer");
  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        dryRun: DRY_RUN,
        stats,
        note: "NO+EN translated; heroDescription set; promise media restored; no /behandlinger",
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
