#!/usr/bin/env npx tsx
/**
 * Ticket #185 — PMOS and POI as two separate gynekologi pages.
 *
 * - Keep treatment-gynekologi-pmos (complete clinician content)
 * - Ensure treatment-gynekologi-poi is its own published page in Tjenester nav
 * - Hide the old mixed treatment-gynekologi-hormonforstyrrelser from the site
 *   (frontend 301s /hormonforstyrrelser → /poi)
 * - Strip mixed PMOS/PMS copy off the POI document if it is still there
 *
 *   cd test && DRY_RUN=1 npx tsx sanity/split-pmos-poi-developer.ts
 *   cd test && npx tsx sanity/split-pmos-poi-developer.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/split-pmos-poi-developer.ts
 */
import { randomBytes } from "crypto";
import { GYN_OM_SECTIONS } from "./data/gynekologi-om-dump";
import { GYN_PAGE_CONTENT, SHARED_UI } from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { removeTreatmentReferences } from "./lib/remove-treatment-references";

const DRY_RUN = process.env.DRY_RUN === "1";

const CAT_ID = "category-gynekologi";
const PMOS_ID = "treatment-gynekologi-pmos";
const POI_ID = "treatment-gynekologi-poi";
const LEGACY_HORMONE_ID = "treatment-gynekologi-hormonforstyrrelser";
const POI_HREF = "/gynekologi/poi";
const PMOS_HREF = "/gynekologi/pmos";

type I18nRow = { language?: string; value?: unknown };
type ReasonRow = { title?: I18nRow[] };
type SlugRow = { language?: string; value?: { current?: string } };
type RefRow = { _key?: string; _ref?: string };

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function i18nString(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
  ];
}

function slugField(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: no },
    },
    {
      _key: "en",
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: en },
    },
  ];
}

function i18nValue(rows: I18nRow[] | undefined, lang: string): string {
  const match = (rows || []).find((row) => row.language === lang);
  return typeof match?.value === "string" ? match.value : "";
}

function looksLikeMixedHormoneCopy(reasons: ReasonRow[] | undefined): boolean {
  const titles = (reasons || [])
    .map((row) => i18nValue(row.title, "no").toLowerCase())
    .join(" | ");
  const hasPmos = /\bpmos\b|\bpcos\b/.test(titles);
  const hasPms = /\bpms\b|\bpmdd\b/.test(titles);
  return hasPmos && hasPms;
}

function poiReasonsFromSeed() {
  const om = GYN_OM_SECTIONS.poi;
  return om.reasons.map((r, i) => ({
    _key: `om-poi-${i}`,
    _type: "object",
    n: i18nString(String(i + 1).padStart(2, "0"), String(i + 1).padStart(2, "0")),
    title: i18nString(r.titleNo, r.titleEn),
    desc: i18nText(r.descNo, r.descEn),
  }));
}

async function ensurePoiDocument() {
  const existing = await sanityClient.fetch<{
    _id?: string;
    hideFromWebsite?: boolean;
    slug?: SlugRow[];
    reasons?: ReasonRow[];
    reasonsTitle?: I18nRow[];
    relatedItems?: string[];
  } | null>(
    `*[_id==$id][0]{
      _id,
      hideFromWebsite,
      slug,
      reasons[]{ title },
      reasonsTitle,
      "relatedItems": relatedSection.items[]._ref
    }`,
    { id: POI_ID },
  );

  const content = GYN_PAGE_CONTENT.poi;
  const mixed = looksLikeMixedHormoneCopy(existing?.reasons);
  const emptyReasons = !existing?.reasons?.length;
  const slugNo = existing?.slug?.find((row) => row.language === "no")?.value?.current;
  const slugEn = existing?.slug?.find((row) => row.language === "en")?.value?.current;

  const patch: Record<string, unknown> = {
    hideFromWebsite: false,
    pageRole: "service",
    title: i18nString(content.titleNo, content.titleEn),
    slug: slugField("poi", "poi"),
    categories: [{ _key: "cat-gyn", _type: "reference", _ref: CAT_ID }],
    category: { _type: "reference", _ref: CAT_ID },
    searchKeywords: [
      "poi",
      "prematur ovariesvikt",
      "premature ovarian insufficiency",
      "ovariesvikt",
      "hormonforstyrrelser",
    ],
  };

  if (!existing || mixed || emptyReasons) {
    patch.reasonsTitle = i18nString(content.reasonsTitleNo, content.reasonsTitleEn);
    patch.reasonsLead = i18nText(content.reasonsLeadNo || "", content.reasonsLeadEn || "");
    patch.reasonsLayout = "accordion";
    patch.reasons = poiReasonsFromSeed();
  }

  if (!existing) {
    patch.description = i18nText(content.heroLeadNo, content.heroLeadEn);
    patch.heroDescription = i18nText(content.heroLeadNo, content.heroLeadEn);
    patch.heroTitle = i18nString(content.heroTitleNo, content.heroTitleEn);
    patch.relatedSection = {
      _type: "object",
      title: i18nString(SHARED_UI.related.no, SHARED_UI.related.en),
      seeAllHref: "/gynekologi",
      seeAllLabel: i18nString(SHARED_UI.seeAllGyn.no, SHARED_UI.seeAllGyn.en),
      asIntro: false,
      asServices: true,
      items: [
        { _key: refKey(), _type: "reference", _ref: PMOS_ID },
        { _key: refKey(), _type: "reference", _ref: "treatment-gynekologi-overgangsalder" },
      ],
    };
  } else if (!(existing.relatedItems || []).includes(PMOS_ID)) {
    const related = [...(existing.relatedItems || [])];
    if (!related.includes(PMOS_ID)) related.unshift(PMOS_ID);
    patch["relatedSection.items"] = related.map((id) => ({
      _key: refKey(),
      _type: "reference",
      _ref: id,
    }));
  }

  console.log(
    `  POI ${existing ? "patch" : "create"} mixedReasons=${mixed} slug=${slugNo}/${slugEn}`,
  );

  if (DRY_RUN) return { created: !existing, mixed };

  if (!existing) {
    const template = await sanityClient.fetch<{
      heroImage?: unknown;
      promises?: unknown[];
      pageSections?: unknown[];
    } | null>(
      `*[_id==$id][0]{ heroImage, promises, pageSections }`,
      { id: PMOS_ID },
    );
    await sanityClient.create({
      _id: POI_ID,
      _type: "treatment",
      ...patch,
      heroImage: template?.heroImage,
      promises: template?.promises,
      pageSections: template?.pageSections,
    });
  } else {
    const { ["relatedSection.items"]: relatedItems, ...rest } = patch as Record<
      string,
      unknown
    > & { "relatedSection.items"?: unknown };
    let next = sanityClient.patch(POI_ID).set(rest);
    if (relatedItems) next = next.set({ "relatedSection.items": relatedItems });
    await next.commit();
  }

  const draftId = `drafts.${POI_ID}`;
  const draft = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id: draftId });
  if (draft) {
    await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }

  return { created: !existing, mixed };
}

async function linkPoiOnCategory() {
  const treatments = await sanityClient.fetch<RefRow[]>(
    `*[_id==$id][0].treatments[]{ _key, _ref }`,
    { id: CAT_ID },
  );
  const list = treatments || [];
  if (list.some((row) => row._ref === POI_ID)) {
    console.log("  category.treatments already includes POI");
    return { inserted: false };
  }

  const afterPmos = list.find((row) => row._ref === PMOS_ID);
  const nextRef = { _type: "reference" as const, _ref: POI_ID, _key: refKey() };
  console.log(
    afterPmos?._key
      ? "  insert POI after PMOS in category.treatments"
      : "  append POI to category.treatments",
  );

  if (DRY_RUN) return { inserted: true };

  if (afterPmos?._key) {
    await sanityClient
      .patch(CAT_ID)
      .insert("after", `treatments[_key=="${afterPmos._key}"]`, [nextRef])
      .commit();
  } else {
    await sanityClient
      .patch(CAT_ID)
      .setIfMissing({ treatments: [] })
      .insert("after", "treatments[-1]", [nextRef])
      .commit();
  }
  return { inserted: true };
}

async function retireLegacyHormonePage() {
  const ids = await sanityClient.fetch<string[]>(
    `*[_type=="treatment" && (
      _id==$id
      || slug[language=="no"][0].value.current=="hormonforstyrrelser"
      || slug[_key=="no"][0].value.current=="hormonforstyrrelser"
    )]._id`,
    { id: LEGACY_HORMONE_ID },
  );
  const unique = [...new Set((ids || []).map((id) => id.replace(/^drafts\./, "")))].filter(
    (id) => id !== POI_ID && id !== PMOS_ID,
  );

  if (!unique.length) {
    console.log("  no hormonforstyrrelser treatment to hide");
    return { hidden: [] as string[] };
  }

  for (const id of unique) {
    console.log(`  hideFromWebsite ${id}`);
    if (DRY_RUN) continue;
    await removeTreatmentReferences(sanityClient, id);
    await sanityClient.patch(id).set({ hideFromWebsite: true }).commit();
    const draftId = `drafts.${id}`;
    const draft = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id: draftId,
    });
    if (draft) {
      await sanityClient.patch(draftId).set({ hideFromWebsite: true }).commit();
    }
  }

  return { hidden: unique };
}

function shouldRepointToPoi(label: string, href: string): boolean {
  if (/hormonforstyrrelser/i.test(href)) return true;
  if (/^poi\b/i.test(label) && !href.includes("/poi")) return true;
  return false;
}

async function repointLandingAndTags() {
  const landing = await sanityClient.fetch<{
    segments?: Array<{
      _key?: string;
      tagLinks?: Array<{ _key?: string; href?: string; labelNo?: string }>;
    }>;
    groups?: Array<{
      _key?: string;
      items?: Array<{ _key?: string; href?: string; titleNo?: string }>;
    }>;
  } | null>(
    `*[_id==$id][0]{
      "segments": landingPage.segmentsSection.segments[]{
        _key,
        tagLinks[]{ _key, href, "labelNo": label[language=="no"][0].value }
      },
      "groups": landingPage.servicesSection.groups[]{
        _key,
        items[]{ _key, href, "titleNo": title[language=="no"][0].value }
      }
    }`,
    { id: CAT_ID },
  );

  const set: Record<string, string> = {};
  for (const segment of landing?.segments || []) {
    for (const tag of segment.tagLinks || []) {
      if (!segment._key || !tag._key) continue;
      if (!shouldRepointToPoi(tag.labelNo || "", tag.href || "")) continue;
      if (tag.href === POI_HREF) continue;
      set[
        `landingPage.segmentsSection.segments[_key=="${segment._key}"].tagLinks[_key=="${tag._key}"].href`
      ] = POI_HREF;
      console.log(`  fold-out ${tag.labelNo}: ${tag.href} → ${POI_HREF}`);
    }
  }
  for (const group of landing?.groups || []) {
    for (const item of group.items || []) {
      if (!group._key || !item._key) continue;
      if (!shouldRepointToPoi(item.titleNo || "", item.href || "")) continue;
      if (item.href === POI_HREF) continue;
      set[
        `landingPage.servicesSection.groups[_key=="${group._key}"].items[_key=="${item._key}"].href`
      ] = POI_HREF;
      console.log(`  services ${item.titleNo}: ${item.href} → ${POI_HREF}`);
    }
  }

  const tags = await sanityClient.fetch<Array<{ _id: string; href?: string }>>(
    `*[_type=="specialistTag" && href match "*hormonforstyrrelser*"]{ _id, href }`,
  );
  if (!DRY_RUN) {
    if (Object.keys(set).length) {
      await sanityClient.patch(CAT_ID).set(set).commit();
    }
    for (const tag of tags || []) {
      console.log(`  specialistTag ${tag._id}: ${tag.href} → ${POI_HREF}`);
      await sanityClient.patch(tag._id).set({ href: POI_HREF }).commit();
    }
  } else {
    for (const tag of tags || []) {
      console.log(`  [dry] specialistTag ${tag._id}: ${tag.href} → ${POI_HREF}`);
    }
  }

  return { landing: Object.keys(set).length, specialistTags: (tags || []).length };
}

async function ensurePmosRelatedIncludesPoi() {
  const related = await sanityClient.fetch<string[]>(
    `*[_id==$id][0].relatedSection.items[]._ref`,
    { id: PMOS_ID },
  );
  const list = related || [];
  if (list.includes(POI_ID)) {
    console.log("  PMOS related already includes POI");
    return;
  }
  console.log("  add POI to PMOS relatedSection");
  if (DRY_RUN) return;
  await sanityClient
    .patch(PMOS_ID)
    .setIfMissing({ "relatedSection.items": [] })
    .insert("after", "relatedSection.items[-1]", [
      { _key: refKey(), _type: "reference", _ref: POI_ID },
    ])
    .commit();
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }

  console.log(`\n[split-pmos-poi] dataset=${DATASET} dry=${DRY_RUN}\n`);

  const poi = await ensurePoiDocument();
  const nav = await linkPoiOnCategory();
  const retired = await retireLegacyHormonePage();
  const links = await repointLandingAndTags();
  await ensurePmosRelatedIncludesPoi();

  const verify = DRY_RUN
    ? null
    : await sanityClient.fetch<{
        pmos?: { titleNo?: string; slugNo?: string };
        poi?: { titleNo?: string; slugNo?: string; reasonsNo?: string[] };
        hormoneHidden?: boolean;
        navHasPoi?: boolean;
        poiHref?: string | null;
      }>(
        `{
          "pmos": *[_id==$pmos][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current
          },
          "poi": *[_id==$poi][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current,
            "reasonsNo": reasons[].title[language=="no"][0].value
          },
          "hormoneHidden": *[_id==$hormone][0].hideFromWebsite == true,
          "navHasPoi": count(*[_id==$cat][0].treatments[_ref==$poi]) > 0,
          "poiHref": *[_id==$cat][0].landingPage.segmentsSection.segments[id=="menstruasjon"].tagLinks[label[language=="no"][0].value == "POI"][0].href
        }`,
        { pmos: PMOS_ID, poi: POI_ID, hormone: LEGACY_HORMONE_ID, cat: CAT_ID },
      );

  if (verify) {
    if (verify.pmos?.slugNo !== "pmos") {
      throw new Error(`PMOS slug is ${verify.pmos?.slugNo}, expected pmos`);
    }
    if (verify.poi?.slugNo !== "poi") {
      throw new Error(`POI slug is ${verify.poi?.slugNo}, expected poi`);
    }
    if (verify.pmos?.slugNo === verify.poi?.slugNo) {
      throw new Error("PMOS and POI share a slug");
    }
    const reasons = (verify.poi?.reasonsNo || []).join(" | ").toLowerCase();
    if (/\bpms\b/.test(reasons) && /\bpmos\b/.test(reasons)) {
      throw new Error("POI reasons still look like mixed hormonforstyrrelser copy");
    }
    if (!verify.navHasPoi) {
      throw new Error("POI is missing from category-gynekologi treatments[]");
    }
    if (verify.poiHref && verify.poiHref !== POI_HREF && verify.poiHref !== PMOS_HREF) {
      // POI tag must not point at the retired mixed page.
      if (/hormonforstyrrelser/i.test(verify.poiHref)) {
        throw new Error(`POI landing tag still points at ${verify.poiHref}`);
      }
    }
  }

  console.log("\n✓ split PMOS / POI");
  console.log(
    JSON.stringify(
      { dataset: DATASET, dryRun: DRY_RUN, poi, nav, retired, links, verify },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
