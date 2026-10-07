#!/usr/bin/env npx tsx
/**
 * Developer-only: Nutrition expert-area cards + 3 child treatment pages.
 *
 *   cd test && npx tsx sanity/patch-ernaering-expert-areas-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-ernaering-expert-areas-developer.ts
 */
import { randomBytes } from "crypto";
import {
  CATEGORY_REF,
  DEFAULT_HERO_ASSET,
  ERNAERING_CHILD_PAGES,
  ERNAERING_EXPERT_AREA_TITLE,
  PARENT_ID,
  SPECIALIST_MARI,
  type ErnaeringChildPage,
} from "./data/ernaering-expert-area-pages";
import { PROMISE_COPY, SHARED_UI } from "./data/flere-fagomrader-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

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

function slugField(noSlug: string, enSlug: string) {
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

function heroImageRef(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

function reasonRow(index: number, r: ErnaeringChildPage["reasons"][number]) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: refKey(),
    n: i18nString(n, n),
    title: i18nString(r.titleNo, r.titleEn),
    desc: i18nText(r.descNo, r.descEn),
  };
}

function promiseRows(assetId: string) {
  const images = [
    "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
    "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
    "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
  ] as const;
  return PROMISE_COPY.standard.map((card, i) => ({
    _key: refKey(),
    title: i18nString(card.titleNo, card.titleEn),
    desc: i18nText(card.descNo, card.descEn),
    image: heroImageRef(images[i] ?? assetId),
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

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

function specialistsSection() {
  return {
    _type: "pageSectionSpecialists",
    _key: "specialists-section",
    displayMode: "manual",
    variant: "carousel",
    title: i18nString(SHARED_UI.specialistsTitle.no, SHARED_UI.specialistsTitle.en),
    description: i18nText(SHARED_UI.specialistsIntro.no, SHARED_UI.specialistsIntro.en),
    specialists: refs([SPECIALIST_MARI]),
    seeAllHref: "/spesialister",
    seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.33ea61bd3190c308",
    },
    title: i18nString(SHARED_UI.bookingTitle.no, SHARED_UI.bookingTitle.en),
    subtitle: i18nText(SHARED_UI.bookingDesc.no, SHARED_UI.bookingDesc.en),
    primaryLabel: i18nString(SHARED_UI.bookNow.no, SHARED_UI.bookNow.en),
  };
}

function buildChildDoc(
  page: ErnaeringChildPage,
  heroAsset: string,
  relatedIds: readonly string[],
) {
  return {
    _id: page.id,
    _type: "treatment",
    pageRole: "service",
    title: i18nString(page.titleNo, page.titleEn),
    slug: slugField(page.slugNo, page.slugEn),
    categories: [{ _key: refKey(), _type: "reference", _ref: CATEGORY_REF }],
    category: { _type: "reference", _ref: CATEGORY_REF },
    parent: { _type: "reference", _ref: PARENT_ID },
    description: i18nText(page.heroLeadNo, page.heroLeadEn),
    heroDescription: i18nText(page.heroLeadNo, page.heroLeadEn),
    heroTitle: i18nString(page.heroTitleNo, page.heroTitleEn),
    heroImage: heroImageRef(heroAsset),
    heroImageAlt: i18nString(page.ogAltNo, page.ogAltEn),
    heroPoints: heroPointChips(),
    hideSeePriser: true,
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    bookingService: page.bookingService,
    ...(page.reasonsTitleNo.trim() || page.reasonsTitleEn.trim()
      ? { reasonsTitle: i18nString(page.reasonsTitleNo, page.reasonsTitleEn) }
      : {}),
    ...(page.reasonsLeadNo.trim() || page.reasonsLeadEn.trim()
      ? { reasonsLead: i18nText(page.reasonsLeadNo, page.reasonsLeadEn) }
      : {}),
    reasonsLayout: "accordion",
    reasons: page.reasons.map((r, i) => reasonRow(i, r)),
    promises: promiseRows(heroAsset),
    conversationCtaTitle: i18nString(
      "Snakk med en av våre ernæringsfysiologer",
      "Talk to one of our clinical nutritionists",
    ),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString(SHARED_UI.related.no, SHARED_UI.related.en),
      seeAllHref: "/ovrige/ernaeringsfysiolog",
      seeAllLabel: i18nString("Tilbake til ernæringsfysiolog", "Back to clinical nutrition"),
      asIntro: false,
      asServices: true,
      items: refs(relatedIds),
    },
    pageSections: [specialistsSection(), bookingSection()],
    srOnlyTitle: i18nString(
      `${page.heroTitleNo} hos CMedical`,
      `${page.heroTitleEn} at CMedical`,
    ),
    seo: {
      _type: "seo",
      metaTitle: i18nString(page.seoTitleNo, page.seoTitleEn),
      metaDescription: i18nText(page.seoDescNo, page.seoDescEn),
      ogImageAlt: i18nString(page.ogAltNo, page.ogAltEn),
      noIndex: false,
    },
    geoSummary: i18nText(page.geoNo, page.geoEn),
  };
}

function buildExpertAreas(heroAsset: string) {
  return {
    _type: "object",
    title: i18nString(ERNAERING_EXPERT_AREA_TITLE.no, ERNAERING_EXPERT_AREA_TITLE.en),
    items: ERNAERING_CHILD_PAGES.map((page) => ({
      _key: refKey(),
      _type: "object",
      title: i18nString(page.titleNo, page.titleEn),
      desc: i18nText(page.cardDescNo, page.cardDescEn),
      path: page.cardPath,
      image: heroImageRef(heroAsset),
      imageAlt: i18nString(page.titleNo, page.titleEn),
    })),
  };
}

async function assertSlugConflicts() {
  const slugs = ERNAERING_CHILD_PAGES.flatMap((p) => [p.slugNo, p.slugEn]);
  const conflicts = await sanityClient.fetch<
    Array<{ _id: string; slugNo?: string; slugEn?: string }>
  >(
    `*[_type == "treatment" && !(_id in path("drafts.**")) && (
      slug[language == "no"][0].value.current in $slugs
      || slug[language == "en"][0].value.current in $slugs
    ) && !(_id in $allowed)]{
      _id,
      "slugNo": slug[language == "no"][0].value.current,
      "slugEn": slug[language == "en"][0].value.current
    }`,
    {
      slugs,
      allowed: ERNAERING_CHILD_PAGES.map((p) => p.id),
    },
  );
  if (conflicts.length > 0) {
    throw new Error(
      `Slug conflict with existing treatments: ${JSON.stringify(conflicts, null, 2)}`,
    );
  }
  console.log("✓ No slug conflicts for planned child pages");
}

async function resolveHeroAsset(): Promise<string> {
  const parent = await sanityClient.fetch<{ heroAsset?: string }>(
    `*[_id == $id][0]{
      "heroAsset": heroImage.asset._ref
    }`,
    { id: PARENT_ID },
  );
  return parent?.heroAsset?.trim() || DEFAULT_HERO_ASSET;
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: draftId,
  });
  if (exists && !DRY_RUN) {
    await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const parentExists = await sanityClient.fetch<string | null>(
    `*[_id == $id && !(_id in path("drafts.**"))][0]._id`,
    { id: PARENT_ID },
  );
  if (!parentExists) {
    throw new Error(`Missing parent treatment: ${PARENT_ID}`);
  }

  await assertSlugConflicts();
  const heroAsset = await resolveHeroAsset();
  console.log(`Using hero/card image asset: ${heroAsset}`);
  console.log(`DRY_RUN=${DRY_RUN}`);

  const createdIds: string[] = [];
  for (const page of ERNAERING_CHILD_PAGES) {
    console.log(`\n→ ${page.id} (/ovrige/${page.slugNo}, /other/${page.slugEn})`);
    const relatedIds = [PARENT_ID, ...createdIds];
    const doc = buildChildDoc(page, heroAsset, relatedIds);
    if (DRY_RUN) {
      console.log("  [dry-run] would createOrReplace child treatment");
    } else {
      await sanityClient.createOrReplace(doc);
      if (!page.reasonsTitleNo.trim() && !page.reasonsTitleEn.trim()) {
        await sanityClient.patch(page.id).unset(["reasonsTitle"]).commit();
      }
      if (!page.reasonsLeadNo.trim() && !page.reasonsLeadEn.trim()) {
        await sanityClient.patch(page.id).unset(["reasonsLead"]).commit();
      }
      console.log("  ✓ createOrReplace");
    }
    createdIds.push(page.id);
    await discardDraft(page.id);
  }

  if (!DRY_RUN && createdIds.length === ERNAERING_CHILD_PAGES.length) {
    console.log("\n→ Refresh relatedSection sibling links on child pages");
    for (const page of ERNAERING_CHILD_PAGES) {
      const siblingIds = createdIds.filter((id) => id !== page.id);
      await sanityClient
        .patch(page.id)
        .set({
          "relatedSection.items": refs([PARENT_ID, ...siblingIds]),
        })
        .commit();
    }
    console.log("  ✓ related sections updated");
  }

  console.log(`\n→ Parent ${PARENT_ID} expertAreas`);
  const expertAreas = buildExpertAreas(heroAsset);
  if (DRY_RUN) {
    console.log("  [dry-run] would set expertAreas with", expertAreas.items.length, "items");
  } else {
    await sanityClient.patch(PARENT_ID).set({ expertAreas }).commit();
    console.log("  ✓ expertAreas patched");
  }
  await discardDraft(PARENT_ID);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
