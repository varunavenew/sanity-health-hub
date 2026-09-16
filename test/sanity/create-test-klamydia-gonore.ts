#!/usr/bin/env npx tsx
/**
 * Create Gynekologi treatment «Test for klamydia/gonoré» and repoint the
 * /no/gynekologi fold-out link to it.
 *
 * EN source (old /en/gynecology/test-for-chlamydia-gonorrhea), without the last
 * two sentences about free condoms. Aina approved that cut before publish.
 *
 *   cd test && npx tsx sanity/create-test-klamydia-gonore.ts
 *   DRY_RUN=1 npx tsx sanity/create-test-klamydia-gonore.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/create-test-klamydia-gonore.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { PROMISE_COPY, SHARED_UI } from "./data/gynekologi-page-content";

const DRY_RUN = process.env.DRY_RUN === "1";

const DOC_ID = "treatment-gynekologi-test-for-klamydia-gonore";
const CAT_ID = "category-gynekologi";
const TEMPLATE_ID = "treatment-gynekologi-undersokelse";
const SLUG_NO = "test-for-klamydia-gonore";
const SLUG_EN = "test-for-chlamydia-gonorrhea";
const HREF = `/gynekologi/${SLUG_NO}`;

const TITLE_NO = "Test for klamydia/gonoré";
const TITLE_EN = "Test for chlamydia/gonorrhoea";

/** EN source minus free-condom sentences, then Norwegian translation. */
const HERO_NO =
  "Hos oss kan du ta en klamydiatest uten kostnad, og ved behov også testes for andre seksuelt overførbare infeksjoner.";
const HERO_EN =
  "At our clinic, you can undergo a chlamydia test free of charge, and if necessary, get tested for other sexually transmitted diseases.";

const MEN_NO =
  "Menn er også velkomne til å ta en klamydia-/gonorétest gratis.";
const MEN_EN =
  "Men are also welcome to take a chlamydia/gonorrhoea test for free.";

const FOLLOWUP_NO =
  "Dersom klamydia eller en annen infeksjon påvises, starter vi behandling og sørger for at smitteoppsporing blir igangsatt. Har du tatt en hjemmetest for klamydia som har vist positivt resultat, kan du komme til oss for behandling og oppfølging.";
const FOLLOWUP_EN =
  "If chlamydia or another disease is detected, we initiate treatment and ensure contact tracing is initiated. If you have taken a home test for chlamydia that has shown a positive result, you can come to us for treatment and handling.";

const FORBIDDEN = /\b(kondom|condom|condoms)\b/i;

const RELATED_IDS = [
  "treatment-gynekologi-undersokelse",
  "treatment-gynekologi-vulvalidelser",
  "treatment-gynekologi-celleforandringer",
  "treatment-gynekologi-vaginisme",
] as const;

function assertNoCondomCopy(...parts: string[]) {
  for (const part of parts) {
    if (FORBIDDEN.test(part)) {
      throw new Error(`Forbidden condom copy in: ${part.slice(0, 80)}`);
    }
  }
}

function refKey(): string {
  return randomBytes(6).toString("hex");
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

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

function reasonRow(
  index: number,
  titleNo: string,
  titleEn: string,
  descNo: string,
  descEn: string,
) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: refKey(),
    n: i18nString(n, n),
    title: i18nString(titleNo, titleEn),
    desc: i18nText(descNo, descEn),
  };
}

type Template = {
  heroImage?: unknown;
  specialists?: string[];
  insurance?: Record<string, unknown> | null;
  promiseImages?: unknown[];
};

async function loadTemplate(): Promise<Template> {
  const row = await sanityClient.fetch<{
    heroImage?: unknown;
    specialists?: string[];
    insurance?: Record<string, unknown> | null;
    promiseImages?: unknown[];
  } | null>(
    `*[_id==$id][0]{
      heroImage,
      "specialists": pageSections[_type=="pageSectionSpecialists"][0].specialists[]._ref,
      "insurance": pageSections[_type=="pageSectionInsurance"][0],
      "promiseImages": promises[].image
    }`,
    { id: TEMPLATE_ID },
  );
  if (!row?.heroImage) {
    throw new Error(`Template heroImage missing on ${TEMPLATE_ID}`);
  }
  return row;
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
    seeAllHref: "/spesialister?kategori=gynekologi",
    seeAllLabel: i18nString(
      SHARED_UI.seeAllGynDocs.no,
      SHARED_UI.seeAllGynDocs.en,
    ),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.a03ee8e4994a4abb",
    },
    title: i18nString(SHARED_UI.bookingTitle.no, SHARED_UI.bookingTitle.en),
    subtitle: i18nText(SHARED_UI.bookingDesc.no, SHARED_UI.bookingDesc.en),
    primaryLabel: i18nString(SHARED_UI.bookNow.no, SHARED_UI.bookNow.en),
  };
}

function buildDoc(template: Template) {
  const specialistIds = template.specialists?.filter(Boolean) ?? [];
  const insurance = template.insurance
    ? { ...template.insurance, _key: "ps-insurance" }
    : null;

  return {
    _id: DOC_ID,
    _type: "treatment",
    pageRole: "service",
    title: i18nString(TITLE_NO, TITLE_EN),
    slug: slugField(SLUG_NO, SLUG_EN),
    searchKeywords: ["klamydia", "gonoré", "chlamydia", "gonorrhoea", "SOI"],
    categories: [{ _key: refKey(), _type: "reference", _ref: CAT_ID }],
    category: { _type: "reference", _ref: CAT_ID },
    description: i18nText(HERO_NO, HERO_EN),
    heroDescription: i18nText(HERO_NO, HERO_EN),
    heroTitle: i18nString(TITLE_NO, TITLE_EN),
    heroImage: template.heroImage,
    heroImageAlt: i18nString(`${TITLE_NO} hos CMedical`, `${TITLE_EN} at CMedical`),
    heroPoints: [
      { _key: refKey(), title: i18nString(SHARED_UI.shortWait.no, SHARED_UI.shortWait.en) },
      { _key: refKey(), title: i18nString(SHARED_UI.noReferral.no, SHARED_UI.noReferral.en) },
    ],
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    hideSeePriser: true,
    reasonsTitle: i18nString("Om testen", "About the test"),
    reasonsLayout: "accordion",
    reasons: [
      reasonRow(0, "Også for menn", "Also for men", MEN_NO, MEN_EN),
      reasonRow(
        1,
        "Behandling og smitteoppsporing",
        "Treatment and contact tracing",
        FOLLOWUP_NO,
        FOLLOWUP_EN,
      ),
    ],
    promises: PROMISE_COPY.standard.map((card, i) => ({
      _key: refKey(),
      title: i18nString(card.titleNo, card.titleEn),
      desc: i18nText(card.descNo, card.descEn),
      ...(template.promiseImages?.[i] ? { image: template.promiseImages[i] } : {}),
    })),
    conversationCtaTitle: i18nString(
      "Snakk med en av våre gynekologer",
      "Talk to one of our gynaecologists",
    ),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString(SHARED_UI.related.no, SHARED_UI.related.en),
      seeAllHref: "/gynekologi",
      seeAllLabel: i18nString(SHARED_UI.seeAllGyn.no, SHARED_UI.seeAllGyn.en),
      asIntro: false,
      asServices: true,
      items: refs(RELATED_IDS),
    },
    pageSections: [
      specialistsSection(specialistIds),
      ...(insurance ? [insurance] : []),
      bookingSection(),
    ],
    srOnlyTitle: i18nString(`${TITLE_NO} hos CMedical`, `${TITLE_EN} at CMedical`),
    bookingService: "undersokelse",
    seo: {
      _type: "seo",
      metaTitle: i18nString(`${TITLE_NO} | CMedical`, `${TITLE_EN} | CMedical`),
      metaDescription: i18nText(HERO_NO, HERO_EN),
      noIndex: false,
    },
    geoSummary: i18nText(HERO_NO, HERO_EN),
  };
}

type TagLink = {
  _key?: string;
  href?: string;
  labelNo?: string;
};

type Segment = {
  _key?: string;
  id?: string;
  tagLinks?: TagLink[];
};

async function repointLandingLink() {
  const segments = await sanityClient.fetch<Segment[]>(
    `*[_id==$id][0].landingPage.segmentsSection.segments[]{
      _key,
      id,
      tagLinks[]{
        _key,
        href,
        "labelNo": label[language=="no"][0].value
      }
    }`,
    { id: CAT_ID },
  );

  const segment = (segments || []).find(
    (row) =>
      row.id === "underliv" ||
      (row.tagLinks || []).some((t) => /klamydia/i.test(t.labelNo || "")),
  );
  const link = (segment?.tagLinks || []).find((t) =>
    /klamydia/i.test(t.labelNo || ""),
  );

  if (!segment?._key || !link?._key) {
    throw new Error("Could not find the klamydia/gonoré tag link on category-gynekologi");
  }

  console.log(
    `  landing link ${link.labelNo}: ${link.href} → ${HREF} (segment ${segment._key}, tag ${link._key})`,
  );

  if (DRY_RUN) return { from: link.href, to: HREF };

  await sanityClient
    .patch(CAT_ID)
    .set({
      [`landingPage.segmentsSection.segments[_key=="${segment._key}"].tagLinks[_key=="${link._key}"].href`]:
        HREF,
    })
    .commit();

  return { from: link.href, to: HREF };
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (!exists) return;
  console.log(`  deleted ${draftId}`);
  if (!DRY_RUN) await sanityClient.delete(draftId);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }

  assertNoCondomCopy(HERO_NO, HERO_EN, MEN_NO, MEN_EN, FOLLOWUP_NO, FOLLOWUP_EN);

  console.log(`Dataset=${DATASET} DRY_RUN=${DRY_RUN} id=${DOC_ID}`);

  const template = await loadTemplate();
  const doc = buildDoc(template);

  if (DRY_RUN) {
    console.log("  would createOrReplace", DOC_ID);
  } else {
    await sanityClient.createOrReplace(doc);
    await discardDraft(DOC_ID);
    console.log(`  published ${DOC_ID}`);
  }

  const link = await repointLandingLink();

  const verify = DRY_RUN
    ? null
    : await sanityClient.fetch(
        `{
          "treatment": *[_id==$id][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current,
            "slugEn": slug[language=="en"][0].value.current,
            "heroNo": description[language=="no"][0].value,
            "reasonsNo": reasons[].title[language=="no"][0].value,
            "reasonsDescNo": reasons[].desc[language=="no"][0].value
          },
          "href": *[_id==$cat][0].landingPage.segmentsSection.segments[].tagLinks[label[language=="no"][0].value match "*klamydia*"][0].href
        }`,
        { id: DOC_ID, cat: CAT_ID },
      );

  if (verify) {
    const blob = JSON.stringify(verify);
    if (FORBIDDEN.test(blob)) {
      throw new Error("Published document still contains condom copy");
    }
  }

  console.log("✓ Test for klamydia/gonoré");
  console.log(JSON.stringify({ dataset: DATASET, dryRun: DRY_RUN, link, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
