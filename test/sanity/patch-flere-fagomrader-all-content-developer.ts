#!/usr/bin/env npx tsx
/**
 * Developer-only: Save flere-fagomrader treatment content NO+EN.
 *
 * Source: user reference dump + data/flere-fagomrader-page-content.ts
 * - Proper Norwegian + English i18n fields
 * - Always sets heroDescription (avoids chip text override)
 * - Promise images = canonical demo assets
 * - Public paths: /no/ovrige/{slug}, /en/other/{slug} (never /behandlinger)
 * - Keeps insurance pageSection; clears FAQ
 *
 *   cd test && npx tsx sanity/patch-flere-fagomrader-all-content-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-flere-fagomrader-all-content-developer.ts
 */
import { randomBytes } from "crypto";
import {
  FLERE_PAGE_CONTENT,
  PROMISE_COPY,
  SHARED_UI,
  type PageContent,
  type ReasonI18n,
} from "./data/flere-fagomrader-page-content";
import {
  RELATED_BY_SLUG,
  RELATED_TITLE_BY_SLUG,
  THEMES_ARIA,
  THEMES_BY_SLUG,
} from "./data/flere-fagomrader-dump-parity";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const CAT = "category-flere-fagomrader";

const PROMISE_IMAGES = {
  comfort: "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
  specialists: "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
  sameRoof: "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
} as const;

const SPEC = {
  andreas: "specialist-andreas-edenberg",
  birgir: "specialist-birgir-gudbrandsson",
  cennet: "specialist-cennet-akdeniz",
  einar: "specialist-einar-andre-brevik",
  erik: "specialist-erik-berg",
  gunnar: "specialist-gunnar-dalen",
  ingvild: "specialist-ingvild-skarpas-aannerud",
  jan: "specialist-jan-roland-lambrecht",
  jeanette: "specialist-jeanette-follestad",
  kjersti: "specialist-kjersti-margrete-finsrud",
  line: "specialist-line-fusdahl-hulleberg",
  linn: "specialist-linn-myrtveit-stensrud",
  linnea: "specialist-linnea-torsnes",
  mari: "specialist-mari-borge-eskerud",
  maria: "specialist-maria-thompson-clausen",
  marian: "specialist-marian-bale",
  marthe: "specialist-marthe-hagen",
  mia: "specialist-mia-kitter",
  tonje: "specialist-tonje-westlie",
  bjorn: "specialist-bjorn-brennhovd",
  nicolai: "specialist-nicolai-wessel",
  thomas: "specialist-thomas-fredrik-thaulow",
  kristian: "specialist-kristian-ophaug",
} as const;

const DEFAULT_TEAM = [
  SPEC.andreas,
  SPEC.birgir,
  SPEC.cennet,
  SPEC.einar,
  SPEC.erik,
  SPEC.gunnar,
  SPEC.ingvild,
  SPEC.jan,
  SPEC.jeanette,
  SPEC.kjersti,
  SPEC.line,
  SPEC.linn,
  SPEC.linnea,
  SPEC.mari,
  SPEC.maria,
  SPEC.marian,
  SPEC.marthe,
  SPEC.mia,
  SPEC.tonje,
] as const;

type PageCfg = {
  id: string;
  slug: string;
  seeAll: "all" | "gastro" | "hudhelse" | "hudbehandlinger";
};

const PAGES: PageCfg[] = [
  { id: "treatment-flere-fagomrader-endokrinologi", slug: "endokrinologi", seeAll: "all" },
  {
    id: "treatment-flere-fagomrader-ernaringsfysiolog",
    slug: "ernaeringsfysiolog",
    seeAll: "all",
  },
  { id: "treatment-flere-fagomrader-hudhelse", slug: "hudhelse", seeAll: "hudhelse" },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger",
    slug: "hudbehandlinger",
    seeAll: "hudhelse",
  },
  { id: "treatment-flere-fagomrader-gastrokirurgi", slug: "gastrokirurgi", seeAll: "gastro" },
  { id: "treatment-flere-fagomrader-plastikkirurgi", slug: "plastikkirurgi", seeAll: "all" },
  { id: "treatment-flere-fagomrader-robotkirurgi", slug: "robotkirurgi", seeAll: "all" },
  { id: "treatment-flere-fagomrader-areknuter", slug: "areknuter", seeAll: "all" },
  { id: "treatment-flere-fagomrader-osteopati", slug: "osteopati", seeAll: "all" },
  { id: "treatment-flere-fagomrader-revmatologi", slug: "revmatologi", seeAll: "all" },
  { id: "treatment-flere-fagomrader-psykologi", slug: "psykologi", seeAll: "all" },
  { id: "treatment-flere-fagomrader-sexologi", slug: "sexologi", seeAll: "all" },
  {
    id: "treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon",
    slug: "brokkoperasjon",
    seeAll: "gastro",
  },
  {
    id: "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager",
    slug: "hemorroider",
    seeAll: "gastro",
  },
  {
    id: "treatment-flere-fagomrader-overvektskirurgi",
    slug: "overvektskirurgi",
    seeAll: "gastro",
  },
  {
    id: "treatment-flere-fagomrader-hudpleieprodukter",
    slug: "hudpleieprodukter",
    seeAll: "hudhelse",
  },
  {
    id: "treatment-flere-fagomrader-behandlingsutstyr",
    slug: "behandlingsutstyr",
    seeAll: "hudhelse",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-foflekksjekk",
    slug: "foflekksjekk",
    seeAll: "hudbehandlinger",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi",
    slug: "kosmetisk-dermatologi",
    seeAll: "hudbehandlinger",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum",
    slug: "elastisitet-og-volum",
    seeAll: "hudbehandlinger",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur",
    slug: "forbedring-av-hudstruktur",
    seeAll: "hudbehandlinger",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader",
    slug: "pigmentforandringer-og-solskader",
    seeAll: "hudbehandlinger",
  },
  {
    id: "treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar",
    slug: "rodhet-og-synlige-blodkar",
    seeAll: "hudbehandlinger",
  },
];

const BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

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

function slugField(noSlug: string) {
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
      value: { _type: "slug", current: noSlug },
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

function promiseRows() {
  const images = [
    PROMISE_IMAGES.comfort,
    PROMISE_IMAGES.specialists,
    PROMISE_IMAGES.sameRoof,
  ] as const;
  return PROMISE_COPY.standard.map((card, i) => ({
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

function heroThemeChips(themes: { no: string; en: string }[]) {
  return themes.map((t) => i18nString(t.no, t.en));
}

function specialistsSection(specialistIds: readonly string[]) {
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

function categoryRefs() {
  return {
    categories: [{ _key: refKey(), _type: "reference" as const, _ref: CAT }],
    category: { _type: "reference" as const, _ref: CAT },
  };
}

function seeAllNav(kind: PageCfg["seeAll"]) {
  if (kind === "gastro") {
    return {
      href: "/ovrige/gastrokirurgi",
      labelNo: SHARED_UI.seeAllGastro.no,
      labelEn: SHARED_UI.seeAllGastro.en,
    };
  }
  if (kind === "hudhelse") {
    return {
      href: "/ovrige/hudhelse",
      labelNo: SHARED_UI.seeAllHudhelse.no,
      labelEn: SHARED_UI.seeAllHudhelse.en,
    };
  }
  if (kind === "hudbehandlinger") {
    return {
      href: "/ovrige/hudbehandlinger",
      labelNo: SHARED_UI.seeAllHudbehandlinger.no,
      labelEn: SHARED_UI.seeAllHudbehandlinger.en,
    };
  }
  return {
    href: "/ovrige",
    labelNo: SHARED_UI.seeAll.no,
    labelEn: SHARED_UI.seeAll.en,
  };
}

function resolveSpecialists(page: PageCfg): string[] {
  switch (page.slug) {
    case "ernaeringsfysiolog":
      return [SPEC.mari];
    case "areknuter":
      return [SPEC.einar];
    case "osteopati":
      return [SPEC.ingvild];
    case "revmatologi":
      return [SPEC.birgir];
    case "psykologi":
      return [SPEC.kristian];
    case "sexologi":
      return [SPEC.kjersti];
    case "gastrokirurgi":
    case "brokkoperasjon":
    case "overvektskirurgi":
      return [SPEC.andreas, SPEC.jan];
    case "hemorroider":
      return [SPEC.marian];
    case "robotkirurgi":
      return [SPEC.bjorn, SPEC.nicolai, SPEC.thomas];
    // Dump shows the full Flere tjenester carousel team
    case "endokrinologi":
    case "plastikkirurgi":
    case "hudhelse":
    case "hudbehandlinger":
    case "hudpleieprodukter":
    case "behandlingsutstyr":
    case "foflekksjekk":
    case "kosmetisk-dermatologi":
    case "elastisitet-og-volum":
    case "forbedring-av-hudstruktur":
    case "pigmentforandringer-og-solskader":
    case "rodhet-og-synlige-blodkar":
      return [...DEFAULT_TEAM];
    default:
      return [...DEFAULT_TEAM];
  }
}

function resolveRelatedIds(page: PageCfg, content: PageContent): string[] {
  const dumpRelated = RELATED_BY_SLUG[page.slug];
  const preferredSlugs =
    dumpRelated !== undefined ? dumpRelated : content.relatedSlugs || [];

  const preferred = preferredSlugs
    .map((sl) => BY_SLUG.get(sl)?.id)
    .filter((id): id is string => Boolean(id) && id !== page.id);

  return [...new Set(preferred)].slice(0, 12);
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
  const nav = seeAllNav(page.seeAll);
  const cats = categoryRefs();
  const reasons = content.reasons.map((r, i) => reasonRow(i, r));
  const relatedTitle =
    RELATED_TITLE_BY_SLUG[page.slug] || SHARED_UI.related;
  const themes = THEMES_BY_SLUG[page.slug] || [];

  const patch: Record<string, unknown> = {
    title: i18nString(content.titleNo, content.titleEn),
    slug: slugField(page.slug),
    ...cats,
    description: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroTitle: i18nString(content.heroTitleNo, content.heroTitleEn),
    heroPoints: heroPointChips(),
    themesAriaLabel: i18nString(THEMES_ARIA.no, THEMES_ARIA.en),
    heroThemes: heroThemeChips(themes),
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    hideSeePriser: true,
    promises: promiseRows(),
    conversationCtaTitle: i18nString(content.midCtaNo, content.midCtaEn),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString(relatedTitle.no, relatedTitle.en),
      seeAllHref: nav.href,
      seeAllLabel: i18nString(nav.labelNo, nav.labelEn),
      asIntro: false,
      asServices: true,
      items: refs(relatedIds),
    },
    pageSections: [
      specialistsSection(specialistIds),
      ...(insurance ? [insurance] : []),
      bookingSection(),
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

  if (content.heroPriceNo && content.heroPriceEn) {
    patch.heroPrice = i18nString(content.heroPriceNo, content.heroPriceEn);
  }

  if (content.heroPriceLabelNo && content.heroPriceLabelEn) {
    patch.heroPriceLabel = i18nString(
      content.heroPriceLabelNo,
      content.heroPriceLabelEn,
    );
  }

  if (content.reasonsLeadNo && content.reasonsLeadEn) {
    patch.reasonsLead = i18nText(content.reasonsLeadNo, content.reasonsLeadEn);
  }

  if (content.reasons.length > 0) {
    patch.reasonsTitle = i18nString(content.reasonsTitleNo, content.reasonsTitleEn);
    patch.reasonsLayout = content.reasonsLayout || "accordion";
    patch.reasons = reasons;
  }

  return patch;
}

async function patchPage(page: PageCfg, content: PageContent) {
  console.log(`\n→ ${page.slug} (${page.id})`);

  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id: page.id },
  );
  if (!exists) {
    throw new Error(`Missing published treatment: ${page.id}`);
  }

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id: page.id });

  const insurance = Array.isArray(pageSections)
    ? pageSections.find((s) => s._type === "pageSectionInsurance")
    : undefined;

  const specialistIds = resolveSpecialists(page);
  const relatedIds = resolveRelatedIds(page, content);
  const patch = buildDocFields(
    page,
    content,
    specialistIds,
    relatedIds,
    insurance,
  );

  const unset = ["faqs", "faqCollection", "faqSectionTitle"];
  if (!content.reasonsLeadNo) unset.push("reasonsLead");
  if (!content.heroPriceLabelNo) unset.push("heroPriceLabel");
  if (!content.heroPriceNo) unset.push("heroPrice");
  if (!(THEMES_BY_SLUG[page.slug] || []).length) unset.push("heroThemes");
  if (content.reasons.length === 0) {
    unset.push("reasons", "reasonsTitle", "reasonsLead", "reasonsLead2", "reasonsLayout");
  }
  if (page.slug === "hemorroider") {
    unset.push("flow", "flowTitle", "flowImage", "flowEyebrow", "flowLinkLabel", "flowLinkHref");
  }

  console.log(
    `  reasons=${content.reasons.length} related=${relatedIds.length} specialists=${specialistIds.length} themes=${(THEMES_BY_SLUG[page.slug] || []).length} price="${content.heroPriceNo || "—"}" insurance=${Boolean(insurance)}`,
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

  console.log(
    `Content pages=${Object.keys(FLERE_PAGE_CONTENT).length} mapped=${PAGES.length} DRY_RUN=${DRY_RUN}`,
  );

  let ok = 0;
  for (const page of PAGES) {
    const content = FLERE_PAGE_CONTENT[page.slug];
    if (!content) {
      throw new Error(`Missing content for slug ${page.slug}`);
    }
    await patchPage(page, content);
    ok += 1;
  }

  console.log(`\nDone. Patched ${ok}/${PAGES.length} pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
