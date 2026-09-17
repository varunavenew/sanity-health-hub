#!/usr/bin/env npx tsx
/**
 * Create Gynekologi treatment «Konisering» and repoint both /no/gynekologi
 * links (fold-out tag + «Hva vi tilbyr» row) to it.
 *
 * Old subTopic text reused as-is (Aina 7 Sep 13:08 «OK»). Splits the
 * Celleforandringer reuse that currently opens for «Konisering».
 *
 *   cd test && npx tsx sanity/create-konisering.ts
 *   DRY_RUN=1 npx tsx sanity/create-konisering.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/create-konisering.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { PROMISE_COPY, SHARED_UI } from "./data/gynekologi-page-content";

const DRY_RUN = process.env.DRY_RUN === "1";

const DOC_ID = "treatment-gynekologi-konisering";
const CAT_ID = "category-gynekologi";
const TEMPLATE_ID = "treatment-gynekologi-celleforandringer";
const SLUG_NO = "konisering";
const SLUG_EN = "cone-biopsy";
const HREF = `/gynekologi/${SLUG_NO}`;

const TITLE_NO = "Konisering";
const TITLE_EN = "Cone biopsy";

/** Ticket #300 — old site subTopic text, reuse as-is. */
const BODY_NO =
  "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft. Hos vår klinikk på Bekkestua tilbyr vi konisering i lokalbedøvelse, utført av vår erfarne gynekolog Birgitte Aspenes. Inngrepet tar vanligvis rundt 15 minutter, og du blir godt ivaretatt i rolige og trygge omgivelser. Vi vet at dette kan oppleves som en sårbar situasjon, derfor legger vi stor vekt på å møte deg med trygghet og omsorg gjennom hele prosessen. Inngrepet blir utført i narkose om du er veldig engstelig.";

const BODY_EN =
  "Cone biopsy is a minor surgical procedure that removes a small part of the outer layer of the cervix. The procedure prevents the cell changes from developing into cervical cancer. At our Bekkestua clinic we offer cone biopsy under local anaesthetic, performed by our experienced gynaecologist Birgitte Aspenes. The procedure usually takes around 15 minutes, and you will be well looked after in calm and safe surroundings. We know this can feel like a vulnerable situation, so we place great emphasis on meeting you with safety and care throughout the process. The procedure is performed under general anaesthesia if you are very anxious.";

const HERO_NO =
  "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft.";
const HERO_EN =
  "Cone biopsy is a minor surgical procedure that removes a small part of the outer layer of the cervix. The procedure prevents the cell changes from developing into cervical cancer.";

const RELATED_IDS = [
  "treatment-gynekologi-celleforandringer",
  "treatment-gynekologi-undersokelse",
  "treatment-gynekologi-hysteroskopi",
  "treatment-gynekologi-kirurgi",
] as const;

const FALLBACK_SPECIALISTS = [
  "specialist-birgitte-aspenes",
  "specialist-ane-gerda-z-eriksson",
  "specialist-siri-klokstad",
] as const;

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
  const fromTemplate = (template.specialists || []).filter(Boolean);
  const specialistIds = fromTemplate.includes(FALLBACK_SPECIALISTS[0])
    ? [
        FALLBACK_SPECIALISTS[0],
        ...fromTemplate.filter((id) => id !== FALLBACK_SPECIALISTS[0]),
      ]
    : [...FALLBACK_SPECIALISTS];
  const insurance = template.insurance
    ? { ...template.insurance, _key: "ps-insurance" }
    : null;

  return {
    _id: DOC_ID,
    _type: "treatment",
    pageRole: "service",
    title: i18nString(TITLE_NO, TITLE_EN),
    slug: slugField(SLUG_NO, SLUG_EN),
    searchKeywords: [
      "konisering",
      "cone biopsy",
      "conisation",
      "conization",
      "celleforandringer",
      "livmorhals",
      "dysplasi",
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
    reasonsTitle: i18nString("Om konisering", "About cone biopsy"),
    reasonsLayout: "accordion",
    reasons: [
      {
        _key: refKey(),
        n: i18nString("01", "01"),
        title: i18nString("Om inngrepet", "About the procedure"),
        desc: i18nText(BODY_NO, BODY_EN),
      },
    ],
    promises: PROMISE_COPY.standard.map((card, i) => ({
      _key: refKey(),
      title: i18nString(card.titleNo, card.titleEn),
      desc: i18nText(card.descNo, card.descEn),
      ...(template.promiseImages?.[i]
        ? { image: template.promiseImages[i] }
        : {}),
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
    srOnlyTitle: i18nString(
      `${TITLE_NO} hos CMedical`,
      `${TITLE_EN} at CMedical`,
    ),
    bookingService: SLUG_NO,
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

type ServiceItem = {
  groupKey?: string;
  itemKey?: string;
  href?: string;
  titleNo?: string;
};

async function repointLandingLinks() {
  const landing = await sanityClient.fetch<{
    segments?: Segment[];
    serviceItems?: ServiceItem[];
  } | null>(
    `*[_id==$id][0]{
      "segments": landingPage.segmentsSection.segments[]{
        _key,
        id,
        tagLinks[]{
          _key,
          href,
          "labelNo": label[language=="no"][0].value
        }
      },
      "serviceItems": landingPage.servicesSection.groups[]{
        "groupKey": _key,
        "itemKey": items[title[language=="no"][0].value == "Konisering"][0]._key,
        "href": items[title[language=="no"][0].value == "Konisering"][0].href,
        "titleNo": items[title[language=="no"][0].value == "Konisering"][0].title[language=="no"][0].value
      }[defined(itemKey)]
    }`,
    { id: CAT_ID },
  );

  const segment = (landing?.segments || []).find(
    (row) =>
      row.id === "underliv" ||
      (row.tagLinks || []).some((t) => /^konisering$/i.test(t.labelNo || "")),
  );
  const tag = (segment?.tagLinks || []).find((t) =>
    /^konisering$/i.test(t.labelNo || ""),
  );
  const service = (landing?.serviceItems || []).find((row) =>
    /^konisering$/i.test(row.titleNo || ""),
  );

  if (!segment?._key || !tag?._key) {
    throw new Error("Could not find the Konisering fold-out tag on category-gynekologi");
  }
  if (!service?.groupKey || !service.itemKey) {
    throw new Error(
      "Could not find the Konisering «Hva vi tilbyr» item on category-gynekologi",
    );
  }

  const patch: Record<string, string> = {
    [`landingPage.segmentsSection.segments[_key=="${segment._key}"].tagLinks[_key=="${tag._key}"].href`]:
      HREF,
    [`landingPage.servicesSection.groups[_key=="${service.groupKey}"].items[_key=="${service.itemKey}"].href`]:
      HREF,
  };

  console.log(
    `  fold-out ${tag.labelNo}: ${tag.href} → ${HREF} (segment ${segment._key}, tag ${tag._key})`,
  );
  console.log(
    `  services ${service.titleNo}: ${service.href} → ${HREF} (group ${service.groupKey}, item ${service.itemKey})`,
  );

  if (!DRY_RUN) {
    await sanityClient.patch(CAT_ID).set(patch).commit();
  }

  return {
    foldOut: { from: tag.href, to: HREF },
    services: { from: service.href, to: HREF },
  };
}

async function linkOnCategory() {
  const treatments = await sanityClient.fetch<Array<{ _key?: string; _ref?: string }>>(
    `*[_id==$id][0].treatments[]{ _key, _ref }`,
    { id: CAT_ID },
  );
  const list = treatments || [];
  if (list.some((row) => row._ref === DOC_ID)) {
    console.log("  category.treatments already includes Konisering");
    return { linked: true, inserted: false };
  }

  const afterCelle = list.find(
    (row) => row._ref === "treatment-gynekologi-celleforandringer",
  );
  const nextRef = { _type: "reference" as const, _ref: DOC_ID, _key: refKey() };

  console.log(
    afterCelle?._key
      ? `  insert Konisering after celleforandringer in category.treatments`
      : `  append Konisering to category.treatments`,
  );

  if (DRY_RUN) return { linked: true, inserted: true };

  if (afterCelle?._key) {
    await sanityClient
      .patch(CAT_ID)
      .insert("after", `treatments[_key=="${afterCelle._key}"]`, [nextRef])
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

  const links = await repointLandingLinks();
  const categoryLink = await linkOnCategory();

  const verify = DRY_RUN
    ? null
    : await sanityClient.fetch<{
        treatment?: {
          titleNo?: string;
          slugNo?: string;
          slugEn?: string;
          heroNo?: string;
          reasonsNo?: string[];
          reasonsDescNo?: string[];
        };
        foldOutHref?: string | string[] | null;
        servicesHref?: string | string[] | null;
        celleStillExists?: boolean;
      }>(
        `{
          "treatment": *[_id==$id][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current,
            "slugEn": slug[language=="en"][0].value.current,
            "heroNo": description[language=="no"][0].value,
            "reasonsNo": reasons[].title[language=="no"][0].value,
            "reasonsDescNo": reasons[].desc[language=="no"][0].value
          },
          "foldOutHref": *[_id==$cat][0].landingPage.segmentsSection.segments[id=="underliv"].tagLinks[label[language=="no"][0].value == "Konisering"][0].href,
          "servicesHref": *[_id==$cat][0].landingPage.servicesSection.groups[label[language=="no"][0].value == "Behandling og kirurgi"].items[title[language=="no"][0].value == "Konisering"][0].href,
          "celleStillExists": defined(*[_id=="treatment-gynekologi-celleforandringer"][0]._id)
        }`,
        { id: DOC_ID, cat: CAT_ID },
      );

  if (verify) {
    const body = JSON.stringify(verify);
    if (!body.includes("Birgitte Aspenes") || !body.includes("Bekkestua")) {
      throw new Error("Published Konisering text is missing Birgitte Aspenes / Bekkestua");
    }
    if (!body.includes("narkose")) {
      throw new Error("Published Konisering text is missing anaesthesia (narkose) sentence");
    }
    const foldOutHref = Array.isArray(verify.foldOutHref)
      ? verify.foldOutHref.find((value) => typeof value === "string")
      : verify.foldOutHref;
    const servicesHref = Array.isArray(verify.servicesHref)
      ? verify.servicesHref.find((value) => typeof value === "string")
      : verify.servicesHref;
    if (foldOutHref !== HREF || servicesHref !== HREF) {
      throw new Error(
        `Konisering links were not repointed: foldOut=${String(foldOutHref)} services=${String(servicesHref)}`,
      );
    }
    if (!verify.celleStillExists) {
      throw new Error("Celleforandringer treatment is missing after Konisering create");
    }
  }

  console.log("✓ Konisering");
  console.log(
    JSON.stringify(
      { dataset: DATASET, dryRun: DRY_RUN, links, categoryLink, verify },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
