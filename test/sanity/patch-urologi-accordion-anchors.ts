#!/usr/bin/env npx tsx
/**
 * Ticket #337 — Urologi fold-out links must land on a heading with the
 * clicked word.
 *
 *   Vannlating → /urologi/blaere#vannlating  (existing Blære page)
 *   Ereksjon   → /urologi/ereksjon            (own page; H1 «Ereksjon»)
 *   PSA        → /urologi/prostata#psa
 *   Forebygging→ /urologi/prostata#forebygging
 *   Utredning  → /urologi/prostata#utredning
 *   Bestill …  unchanged
 *
 *   cd test && npx tsx sanity/patch-urologi-accordion-anchors.ts
 *   DRY_RUN=1 npx tsx sanity/patch-urologi-accordion-anchors.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/patch-urologi-accordion-anchors.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { PROMISE_COPY, SHARED_UI } from "./data/gynekologi-page-content";

const DRY_RUN = process.env.DRY_RUN === "1";

const CAT_ID = "category-urologi";
const PROSTATA_ID = "treatment-urologi-prostata";
const BLAERE_ID = "treatment-urologi-blaere";
const FORHUD_ID = "treatment-urologi-forhud";
const EREKSJON_ID = "treatment-urologi-ereksjon";
const TEMPLATE_ID = FORHUD_ID;

const HREF = {
  vannlating: "/urologi/blaere#vannlating",
  ereksjon: "/urologi/ereksjon",
  psa: "/urologi/prostata#psa",
  forebygging: "/urologi/prostata#forebygging",
  utredning: "/urologi/prostata#utredning",
} as const;

const RELATED_IDS = [
  FORHUD_ID,
  PROSTATA_ID,
  "treatment-urologi-infertilitet",
  "treatment-urologi-testikler",
] as const;

const FALLBACK_SPECIALISTS = ["specialist-trond-jorgensen"] as const;

const TITLE_NO = "Ereksjon";
const TITLE_EN = "Erection";
const SLUG_NO = "ereksjon";
const SLUG_EN = "erection";

const HERO_NO =
  "Ereksjonsproblemer er vanligere enn mange tror. Hos CMedical møter du urologer som utreder og behandler i trygge rammer — uten henvisning og med kort ventetid.";
const HERO_EN =
  "Erection problems are more common than many think. At CMedical you meet urologists who assess and treat in safe surroundings — with no referral and a short waiting time.";

const EREKSJON_BODY_NO =
  "Trang forhud, skjev penis, ereksjonsproblemer og lavt testosteron — utredning og behandling i trygge rammer. Vi tar oss tid til historikk og spørsmål, og lager en konkret plan på et språk du forstår. Ved behov samarbeider urologen med sexolog og andre spesialister under samme tak.";
const EREKSJON_BODY_EN =
  "Tight foreskin, curved penis, erection problems and low testosterone — assessment and treatment in safe surroundings. We take time for your history and questions, and make a concrete plan in language you understand. When needed, the urologist works with a sexologist and other specialists under the same roof.";

/** Existing CMedical article copy (prostataundersøkelse). */
const PSA_NO =
  "Mange kan helt naturlig ha høyere eller lavere verdier enn gjennomsnittet. Det betyr at PSA-blodprøven kan vise høye verdier, uten at det nødvendigvis betyr at du har prostatakreft. På samme måte kan verdiene være lave, samtidig som man har prostatakreft. Full utredning og sjekk av prostata er nødvendig for å kunne si noe sikkert.\n\nBlodprøve alene er ikke nok, selv om du senere kan overvåke prostata ved hjelp av én blodprøve i året. Dersom du er over 50 år eller er i risikogruppen, bør du ha en full prostatasjekk årlig. En prostataundersøkelse inkluderer både PSA-blodprøve, ultralyd av prostata og klinisk undersøkelse.\n\nMan må følge med på PSA-verdiene over tid og sammenligne med tidligere funn. Øker PSA-verdiene ved fremtidige blodprøver, så kan det være tegn på prostatakreft, forstørret prostata eller betennelser i prostatakjertelen. I slike tilfeller er det nødvendig med videre utredning.";
const PSA_EN =
  "Many people naturally have higher or lower values than the average. That means the PSA blood test can show high values without it necessarily meaning you have prostate cancer. In the same way, the values can be low even if you do have prostate cancer. A full assessment and prostate check is needed to say anything with certainty.\n\nA blood test alone is not enough, even though you can later monitor the prostate with one blood test a year. If you are over 50 or in a risk group, you should have a full prostate check annually. A prostate examination includes a PSA blood test, ultrasound of the prostate and a clinical examination.\n\nPSA values need to be followed over time and compared with earlier findings. If PSA values rise in later blood tests, that can be a sign of prostate cancer, an enlarged prostate or inflammation of the prostate. In those cases further investigation is needed.";

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
  id: string,
  titleNo: string,
  titleEn: string,
  descNo: string,
  descEn: string,
) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: `reason-${id}`,
    id,
    n: i18nString(n, n),
    title: i18nString(titleNo, titleEn),
    desc: i18nText(descNo, descEn),
  };
}

function titleNo(reason: { title?: Array<{ language?: string; value?: string }> }): string {
  return (
    (reason.title || []).find((row) => row.language === "no" || row.language === "nb")
      ?.value || ""
  );
}

type Template = {
  heroImage?: unknown;
  specialists?: string[];
  insurance?: Record<string, unknown> | null;
  promiseImages?: unknown[];
};

async function loadTemplate(): Promise<Template> {
  const [forhud, blaere] = await Promise.all([
    sanityClient.fetch<{
      heroImage?: unknown;
      promiseImages?: unknown[];
    } | null>(
      `*[_id==$id][0]{
        heroImage,
        "promiseImages": promises[].image
      }`,
      { id: TEMPLATE_ID },
    ),
    sanityClient.fetch<{
      specialists?: string[];
      insurance?: Record<string, unknown> | null;
    } | null>(
      `*[_id==$id][0]{
        "specialists": pageSections[_type=="pageSectionSpecialists"][0].specialists[]._ref,
        "insurance": pageSections[_type=="pageSectionInsurance"][0]
      }`,
      { id: BLAERE_ID },
    ),
  ]);

  if (!forhud?.heroImage) {
    throw new Error(`Template heroImage missing on ${TEMPLATE_ID}`);
  }

  return {
    heroImage: forhud.heroImage,
    promiseImages: forhud.promiseImages,
    specialists: (blaere?.specialists || []).filter(Boolean),
    insurance: blaere?.insurance || null,
  };
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
    seeAllHref: "/spesialister?kategori=urologi",
    seeAllLabel: i18nString("Se alle urologer", "See all urologists"),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.ec36560bac1e9191",
    },
    title: i18nString(SHARED_UI.bookingTitle.no, SHARED_UI.bookingTitle.en),
    subtitle: i18nText(SHARED_UI.bookingDesc.no, SHARED_UI.bookingDesc.en),
    primaryLabel: i18nString(SHARED_UI.bookNow.no, SHARED_UI.bookNow.en),
  };
}

function buildEreksjonDoc(template: Template) {
  const fromTemplate = (template.specialists || []).filter(Boolean);
  const specialistIds = fromTemplate.length
    ? fromTemplate
    : [...FALLBACK_SPECIALISTS];
  const insurance = template.insurance
    ? { ...template.insurance, _key: "ps-insurance" }
    : null;

  return {
    _id: EREKSJON_ID,
    _type: "treatment",
    pageRole: "service",
    title: i18nString(TITLE_NO, TITLE_EN),
    slug: slugField(SLUG_NO, SLUG_EN),
    searchKeywords: [
      "ereksjon",
      "erection",
      "potens",
      "ereksjonsproblemer",
      "testosteron",
    ],
    categories: [{ _key: refKey(), _type: "reference", _ref: CAT_ID }],
    category: { _type: "reference", _ref: CAT_ID },
    description: i18nText(HERO_NO, HERO_EN),
    heroDescription: i18nText(HERO_NO, HERO_EN),
    heroTitle: i18nString(TITLE_NO, TITLE_EN),
    heroImage: template.heroImage,
    heroImageAlt: i18nString(
      `${TITLE_NO} hos CMedical`,
      `${TITLE_EN} at CMedical`,
    ),
    heroPrice: i18nString("fra 1 900 kr", "from NOK 1,900"),
    heroPriceLabel: i18nString("Konsultasjon urolog", "Urology consultation"),
    heroPoints: [
      {
        _key: refKey(),
        title: i18nString(SHARED_UI.shortWait.no, SHARED_UI.shortWait.en),
      },
      {
        _key: refKey(),
        title: i18nString(SHARED_UI.noReferral.no, SHARED_UI.noReferral.en),
      },
    ],
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    hideSeePriser: true,
    reasonsTitle: i18nString("Om ereksjon", "About erection"),
    reasonsLayout: "accordion",
    reasons: [
      reasonRow(0, "ereksjon", TITLE_NO, TITLE_EN, EREKSJON_BODY_NO, EREKSJON_BODY_EN),
    ],
    promises: PROMISE_COPY.comfort.map((card, i) => ({
      _key: refKey(),
      title: i18nString(card.titleNo, card.titleEn),
      desc: i18nText(card.descNo, card.descEn),
      ...(template.promiseImages?.[i] ? { image: template.promiseImages[i] } : {}),
    })),
    conversationCtaTitle: i18nString(
      "Snakk med en av våre urologer",
      "Talk to one of our urologists",
    ),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString("Relaterte tjenester", "Related services"),
      seeAllHref: "/urologi",
      seeAllLabel: i18nString(
        "Se alle urologi-tjenester",
        "See all urology services",
      ),
      asIntro: false,
      asServices: true,
      items: refs(RELATED_IDS),
    },
    pageSections: [
      specialistsSection(specialistIds),
      ...(insurance ? [insurance] : []),
      bookingSection(),
    ],
    srOnlyTitle: i18nString(
      `${TITLE_NO} hos CMedical`,
      `${TITLE_EN} at CMedical`,
    ),
    seo: {
      _type: "seo",
      metaTitle: i18nString(`${TITLE_NO} | CMedical`, `${TITLE_EN} | CMedical`),
      metaDescription: i18nText(HERO_NO, HERO_EN),
      noIndex: false,
    },
    geoSummary: i18nText(HERO_NO, HERO_EN),
  };
}

type ReasonDoc = {
  _key?: string;
  id?: string;
  n?: unknown;
  title?: Array<{ language?: string; value?: string }>;
  desc?: unknown;
  [key: string]: unknown;
};

function withTitleAndId(
  reason: ReasonDoc,
  id: string,
  no: string,
  en: string,
): ReasonDoc {
  return {
    ...reason,
    id,
    title: i18nString(no, en),
  };
}

function renumber(reasons: ReasonDoc[]): ReasonDoc[] {
  return reasons.map((reason, index) => {
    const n = String(index + 1).padStart(2, "0");
    return { ...reason, n: i18nString(n, n) };
  });
}

async function patchBlaereHeading() {
  const reasons = await sanityClient.fetch<ReasonDoc[]>(
    `*[_id==$id][0].reasons[]`,
    { id: BLAERE_ID },
  );
  const list = reasons || [];
  const match = list.find((row) =>
    /^(vannlating)$|vannlatn/i.test(titleNo(row)),
  );
  if (!match?._key) {
    throw new Error("Could not find Vannlatningsproblemer on treatment-urologi-blaere");
  }

  const next = list.map((row) =>
    row._key === match._key
      ? withTitleAndId(row, "vannlating", "Vannlating", "Urination")
      : row,
  );

  console.log(
    `  blaere ${titleNo(match)} → Vannlating (id=vannlating, key ${match._key})`,
  );

  if (!DRY_RUN) {
    await sanityClient.patch(BLAERE_ID).set({ reasons: next }).commit();
    await discardDraft(BLAERE_ID);
  }
}

async function patchProstataHeadings() {
  const reasons = await sanityClient.fetch<ReasonDoc[]>(
    `*[_id==$id][0].reasons[]`,
    { id: PROSTATA_ID },
  );
  const list = reasons || [];

  const utredning = list.find((row) =>
    /^(utredning)$|prostataundersøkelse|prostate examination/i.test(titleNo(row)),
  );
  const forebygging = list.find((row) =>
    /^(forebygging)$|begynne å sjekke|start checking/i.test(titleNo(row)),
  );
  if (!utredning || !forebygging) {
    throw new Error("Could not find Utredning/Forebygging source headings on prostata");
  }

  const rest = list.filter(
    (row) => row._key !== utredning._key && row._key !== forebygging._key,
  );
  const existingPsa = list.find((row) => /^psa$/i.test(titleNo(row)));

  const psa =
    existingPsa && existingPsa._key !== utredning._key && existingPsa._key !== forebygging._key
      ? withTitleAndId(existingPsa, "psa", "PSA", "PSA")
      : reasonRow(0, "psa", "PSA", "PSA", PSA_NO, PSA_EN);

  const next = renumber([
    psa,
    withTitleAndId(forebygging, "forebygging", "Forebygging", "Prevention"),
    withTitleAndId(utredning, "utredning", "Utredning", "Investigation"),
    ...rest.filter((row) => row._key !== existingPsa?._key),
  ]);

  console.log(
    `  prostata headings → ${next.map((row) => `${titleNo(row)}#${row.id}`).join(", ")}`,
  );

  if (!DRY_RUN) {
    await sanityClient.patch(PROSTATA_ID).set({ reasons: next }).commit();
    await discardDraft(PROSTATA_ID);
  }
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

async function repointLandingLinks() {
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

  const wanted: Record<string, string> = {
    Vannlating: HREF.vannlating,
    Ereksjon: HREF.ereksjon,
    PSA: HREF.psa,
    Forebygging: HREF.forebygging,
    Utredning: HREF.utredning,
  };

  const patch: Record<string, string> = {};
  const changes: Array<{ label: string; from?: string; to: string }> = [];

  for (const segment of segments || []) {
    for (const tag of segment.tagLinks || []) {
      const to = tag.labelNo ? wanted[tag.labelNo] : undefined;
      if (!to || !segment._key || !tag._key) continue;
      patch[
        `landingPage.segmentsSection.segments[_key=="${segment._key}"].tagLinks[_key=="${tag._key}"].href`
      ] = to;
      changes.push({ label: tag.labelNo || "", from: tag.href, to });
    }
  }

  const missing = Object.keys(wanted).filter(
    (label) => !changes.some((row) => row.label === label),
  );
  if (missing.length) {
    throw new Error(`Missing fold-out tags: ${missing.join(", ")}`);
  }

  for (const row of changes) {
    console.log(`  ${row.label}: ${row.from} → ${row.to}`);
  }

  if (!DRY_RUN) {
    await sanityClient.patch(CAT_ID).set(patch).commit();
  }

  return changes;
}

async function linkOnCategory() {
  const treatments = await sanityClient.fetch<Array<{ _key?: string; _ref?: string }>>(
    `*[_id==$id][0].treatments[]{ _key, _ref }`,
    { id: CAT_ID },
  );
  const list = treatments || [];
  if (list.some((row) => row._ref === EREKSJON_ID)) {
    console.log("  category.treatments already includes Ereksjon");
    return { linked: true, inserted: false };
  }

  const afterForhud = list.find((row) => row._ref === FORHUD_ID);
  const nextRef = { _type: "reference" as const, _ref: EREKSJON_ID, _key: refKey() };

  console.log(
    afterForhud?._key
      ? "  insert Ereksjon after Forhud in category.treatments"
      : "  append Ereksjon to category.treatments",
  );

  if (DRY_RUN) return { linked: true, inserted: true };

  if (afterForhud?._key) {
    await sanityClient
      .patch(CAT_ID)
      .insert("after", `treatments[_key=="${afterForhud._key}"]`, [nextRef])
      .commit();
  } else {
    await sanityClient
      .patch(CAT_ID)
      .setIfMissing({ treatments: [] })
      .insert("after", "treatments[-1]", [nextRef])
      .commit();
  }

  return { linked: true, inserted: true };
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

  console.log(`Dataset=${DATASET} DRY_RUN=${DRY_RUN}`);

  const template = await loadTemplate();
  const ereksjonDoc = buildEreksjonDoc(template);

  if (DRY_RUN) {
    console.log("  would createOrReplace", EREKSJON_ID);
  } else {
    await sanityClient.createOrReplace(ereksjonDoc);
    await discardDraft(EREKSJON_ID);
    console.log(`  published ${EREKSJON_ID}`);
  }

  await patchBlaereHeading();
  await patchProstataHeadings();
  const links = await repointLandingLinks();
  const categoryLink = await linkOnCategory();

  const verify = DRY_RUN
    ? null
    : await sanityClient.fetch(
        `{
          "ereksjon": *[_id==$eid][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current,
            "slugEn": slug[language=="en"][0].value.current,
            "reasonsNo": reasons[]{ id, "title": title[language=="no"][0].value }
          },
          "prostata": *[_id==$pid][0].reasons[]{ id, "title": title[language=="no"][0].value },
          "blaere": *[_id==$bid][0].reasons[]{ id, "title": title[language=="no"][0].value },
          "hrefs": *[_id==$cat][0].landingPage.segmentsSection.segments[]{
            "title": title[language=="no"][0].value,
            "tags": tagLinks[]{
              "label": label[language=="no"][0].value,
              href
            }
          }
        }`,
        {
          eid: EREKSJON_ID,
          pid: PROSTATA_ID,
          bid: BLAERE_ID,
          cat: CAT_ID,
        },
      );

  console.log("✓ Urologi accordion anchors");
  console.log(
    JSON.stringify({ dataset: DATASET, dryRun: DRY_RUN, links, categoryLink, verify }, null, 2),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
