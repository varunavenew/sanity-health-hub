#!/usr/bin/env npx tsx
/**
 * Ticket #305 — Fertilitet treatment «Egglederundersøkelse (HyFoSy)».
 *
 * The «Hva vi tilbyr» row currently opens Fertilitetsutredning. This creates
 * a dedicated page and repoints that link (and the matching fold-out tag).
 *
 * Clinician copy can replace the body later; the page is structured around
 * what HyFoSy is, what happens, preparation, duration, and how to book.
 *
 *   cd test && DRY_RUN=1 npx tsx sanity/create-hyfosy.ts
 *   cd test && npx tsx sanity/create-hyfosy.ts
 *
 * Production:
 *   SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/create-hyfosy.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import { PROMISE_COPY, SHARED_UI } from "./data/gynekologi-page-content";

const DRY_RUN = process.env.DRY_RUN === "1";

const DOC_ID = "treatment-fertilitet-hyfosy";
const CAT_ID = "category-fertilitet";
const TEMPLATE_ID = "treatment-fertilitet-hysteroskopi";
const SLUG_NO = "hyfosy";
const SLUG_EN = "hyfosy";
const HREF = `/fertilitet/${SLUG_NO}`;

const TITLE_NO = "Egglederundersøkelse (HyFoSy)";
const TITLE_EN = "Fallopian tube examination (HyFoSy)";

const HERO_NO =
  "Egglederundersøkelse med HyFoSy er en skånsom ultralydundersøkelse som viser om egglederne er åpne. Den inngår ofte i en fertilitetsutredning når vi trenger svar på om egget og sædcellene kan møtes naturlig.";
const HERO_EN =
  "A HyFoSy fallopian tube examination is a gentle ultrasound scan that shows whether the tubes are open. It is often part of a fertility assessment when we need to know whether egg and sperm can meet naturally.";

const WHAT_NO =
  "HyFoSy (hysterosalpingo-foam-sonografi) er en ultralydundersøkelse av egglederne. Et tynt kateter føres gjennom livmorhalsen, og en skånsom skumkontrast sprøytes inn. På ultralyd ser legen om skummet passerer gjennom egglederne — det forteller om de er åpne, delvis åpne eller tette.\n\nÅpne eggledere er en forutsetning for å bli gravid uten assistert befruktning. Er en eller begge tette, forklarer det ofte hvorfor det ikke har lykkes, og hjelper oss å anbefale riktig neste steg — for eksempel IVF.";
const WHAT_EN =
  "HyFoSy (hysterosalpingo-foam sonography) is an ultrasound examination of the fallopian tubes. A thin catheter is passed through the cervix and a gentle foam contrast is introduced. On ultrasound the doctor watches whether the foam passes through the tubes — showing whether they are open, partly open or blocked.\n\nOpen tubes are needed to conceive without assisted fertilisation. If one or both are blocked, that often explains why pregnancy has not happened, and helps us recommend the right next step — for example IVF.";

const DURING_NO =
  "Du ligger som ved en vanlig gynekologisk undersøkelse. Legen fører et tynt kateter gjennom livmorhalsen og sprøyter inn skumkontrast mens egglederne følges på ultralyd. Mange kjenner et kort press eller menstruasjonslignende verk når kontrasten passerer — det går vanligvis raskt over.\n\nUndersøkelsen gjøres uten narkose. Du kan stille spørsmål underveis, og du kan be om pause. Etterpå går de fleste rett tilbake til hverdagen.";
const DURING_EN =
  "You lie as for a normal gynaecological examination. The doctor passes a thin catheter through the cervix and introduces foam contrast while following the tubes on ultrasound. Many people feel a brief pressure or period-like cramping as the contrast passes — it usually settles quickly.\n\nThe examination is done without general anaesthetic. You can ask questions along the way and ask for a pause. Afterwards most people go straight back to their day.";

const PREP_NO =
  "Undersøkelsen gjøres vanligvis etter mensen og før eggløsning, slik at vi unngår å undersøke i en tidlig, uoppdaget graviditet. Unngå samleie fra mensen starter og frem til undersøkelsen, med mindre legen har sagt noe annet.\n\nTa med en bind. Noen får litt spotting etterpå. Fortell oss om allergier, tidligere infeksjoner i underlivet, eller om du bruker blodfortynnende. Du trenger ikke faste.";
const PREP_EN =
  "The examination is usually done after your period and before ovulation, so we avoid scanning in an early, undetected pregnancy. Avoid intercourse from the start of your period until the examination, unless your doctor has said otherwise.\n\nBring a sanitary pad. Some people have a little spotting afterwards. Tell us about allergies, previous pelvic infections, or if you take blood thinners. You do not need to fast.";

const DURATION_NO =
  "Selve undersøkelsen tar vanligvis 15–30 minutter. Du bør sette av litt ekstra tid til samtale før og etter, slik at dere rekker å gå gjennom funnene og hva de betyr for veien videre.";
const DURATION_EN =
  "The examination itself usually takes 15–30 minutes. Allow a little extra time for a conversation before and after, so you can go through the findings and what they mean for next steps.";

const BOOK_NO =
  "Du trenger ikke henvisning. Bestill time via knappen på siden, eller ring oss så hjelper vi deg å velge riktig time. Egglederundersøkelse kan være et eget besøk, eller inngå i en bredere fertilitetsutredning — vi avklarer det sammen med deg.";
const BOOK_EN =
  "You do not need a referral. Book via the button on this page, or call us and we will help you choose the right appointment. A tubal examination can be a visit on its own, or part of a broader fertility assessment — we decide that together with you.";

const RELATED_IDS = [
  "treatment-fertilitet-fertilitetsutredning",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-saedanalyse",
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

function reason(
  n: string,
  titleNo: string,
  titleEn: string,
  descNo: string,
  descEn: string,
) {
  return {
    _key: refKey(),
    n: i18nString(n, n),
    title: i18nString(titleNo, titleEn),
    desc: i18nText(descNo, descEn),
  };
}

function flowStep(
  n: string,
  titleNo: string,
  titleEn: string,
  descNo: string,
  descEn: string,
) {
  return {
    _key: refKey(),
    _type: "flowStep",
    n: i18nString(n, n),
    title: i18nString(titleNo, titleEn),
    desc: i18nText(descNo, descEn),
  };
}

type Template = {
  heroImage?: unknown;
  flowImage?: unknown;
  specialists?: string[];
  insurance?: Record<string, unknown> | null;
  promiseImages?: unknown[];
  pageSections?: unknown[];
};

async function loadTemplate(): Promise<Template> {
  const row = await sanityClient.fetch<{
    heroImage?: unknown;
    flowImage?: unknown;
    specialists?: string[];
    insurance?: Record<string, unknown> | null;
    promiseImages?: unknown[];
    pageSections?: unknown[];
  } | null>(
    `*[_id==$id][0]{
      heroImage,
      flowImage,
      "specialists": pageSections[_type=="pageSectionSpecialists"][0].specialists[]._ref,
      "insurance": pageSections[_type=="pageSectionInsurance"][0],
      "promiseImages": promises[].image,
      pageSections
    }`,
    { id: TEMPLATE_ID },
  );
  if (!row?.heroImage) {
    throw new Error(`Template heroImage missing on ${TEMPLATE_ID}`);
  }
  return row;
}

function remapPageSections(sections: unknown[] | undefined) {
  if (!Array.isArray(sections) || sections.length === 0) return [];
  return sections.map((section) => {
    if (!section || typeof section !== "object") return section;
    const row = section as Record<string, unknown>;
    if (row._type === "pageSectionSpecialists") {
      return {
        ...row,
        _key: "specialists-section",
        seeAllHref: "/spesialister?kategori=fertilitet",
      };
    }
    if (row._type === "pageSectionInsurance") {
      return { ...row, _key: "ps-insurance" };
    }
    if (row._type === "pageSectionBookingCta") {
      return { ...row, _key: "booking-cta-section" };
    }
    return { ...row, _key: typeof row._key === "string" ? row._key : refKey() };
  });
}

function buildDoc(template: Template) {
  const specialistIds = (template.specialists || []).filter(Boolean);
  const insurance = template.insurance
    ? { ...template.insurance, _key: "ps-insurance" }
    : null;
  const pageSections = remapPageSections(template.pageSections);
  if (pageSections.length === 0 && specialistIds.length === 0) {
    throw new Error(`Template specialists/pageSections missing on ${TEMPLATE_ID}`);
  }

  return {
    _id: DOC_ID,
    _type: "treatment",
    pageRole: "service",
    hideFromWebsite: false,
    title: i18nString(TITLE_NO, TITLE_EN),
    slug: slugField(SLUG_NO, SLUG_EN),
    searchKeywords: [
      "hyfosy",
      "hycosy",
      "egglederundersøkelse",
      "eggleder",
      "eggledere",
      "fallopian",
      "tubal",
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
    heroPrice: i18nString("fra 3.600 kr", "from NOK 3,600"),
    heroPriceLabel: i18nString(TITLE_NO, TITLE_EN),
    primaryCtaLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    callCtaLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    hideSeePriser: true,
    flowTitle: i18nString(
      "Slik foregår egglederundersøkelsen",
      "How the tubal examination is done",
    ),
    flowImage: template.flowImage,
    flow: [
      flowStep(
        "01",
        "Samtale",
        "Conversation",
        "Vi går gjennom hvorfor undersøkelsen er aktuell, og hva du kan forvente.",
        "We go through why the examination is relevant and what you can expect.",
      ),
      flowStep(
        "02",
        "Forberedelse",
        "Preparation",
        "Riktig tidspunkt i syklusen, og enkle råd før du kommer.",
        "The right time in your cycle, and simple advice before you arrive.",
      ),
      flowStep(
        "03",
        "Undersøkelsen",
        "The examination",
        "Ultralyd med skumkontrast — uten narkose, vanligvis 15–30 minutter.",
        "Ultrasound with foam contrast — no general anaesthetic, usually 15–30 minutes.",
      ),
      flowStep(
        "04",
        "Svar og veien videre",
        "Results and next steps",
        "Legen forklarer funnene og hva de betyr for fertilitetsplanen.",
        "The doctor explains the findings and what they mean for your fertility plan.",
      ),
    ],
    reasonsTitle: i18nString(
      "Om egglederundersøkelse (HyFoSy)",
      "About fallopian tube examination (HyFoSy)",
    ),
    reasonsLayout: "accordion",
    reasons: [
      reason("01", "Hva er HyFoSy?", "What is HyFoSy?", WHAT_NO, WHAT_EN),
      reason(
        "02",
        "Hva skjer under undersøkelsen?",
        "What happens during the examination?",
        DURING_NO,
        DURING_EN,
      ),
      reason("03", "Forberedelse", "Preparation", PREP_NO, PREP_EN),
      reason("04", "Varighet", "Duration", DURATION_NO, DURATION_EN),
      reason("05", "Slik booker du", "How to book", BOOK_NO, BOOK_EN),
    ],
    promises: PROMISE_COPY.comfort.map((card, i) => ({
      _key: refKey(),
      title: i18nString(card.titleNo, card.titleEn),
      desc: i18nText(card.descNo, card.descEn),
      ...(template.promiseImages?.[i]
        ? { image: template.promiseImages[i] }
        : {}),
    })),
    conversationCtaTitle: i18nString(
      "Snakk med en av våre fertilitetsspesialister",
      "Talk to one of our fertility specialists",
    ),
    midCtaPrimaryLabel: i18nString(SHARED_UI.bookCta.no, SHARED_UI.bookCta.en),
    midCtaCallLabel: i18nString(SHARED_UI.callCta.no, SHARED_UI.callCta.en),
    midCtaShowCallButton: true,
    relatedSection: {
      _type: "object",
      title: i18nString(SHARED_UI.related.no, SHARED_UI.related.en),
      seeAllHref: "/fertilitet",
      seeAllLabel: i18nString(
        "Se alle fertilitet-tjenester",
        "See all fertility services",
      ),
      asIntro: false,
      asServices: true,
      items: refs(RELATED_IDS),
    },
    pageSections:
      pageSections.length > 0
        ? pageSections
        : [
            {
              _type: "pageSectionSpecialists",
              _key: "specialists-section",
              displayMode: "manual",
              variant: "carousel",
              title: i18nString(
                SHARED_UI.specialistsTitle.no,
                SHARED_UI.specialistsTitle.en,
              ),
              specialists: refs(specialistIds),
              seeAllHref: "/spesialister?kategori=fertilitet",
            },
            ...(insurance ? [insurance] : []),
          ],
    srOnlyTitle: i18nString(
      `${TITLE_NO} hos CMedical`,
      `${TITLE_EN} at CMedical`,
    ),
    bookingService: "fertilitetsutredning",
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

function isHyfosyLabel(value?: string) {
  const text = value || "";
  return /hyfosy|egglederundersøkelse/i.test(text);
}

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
        "itemKey": items[
          title[language=="no"][0].value match "Eggleder*"
          || title[language=="no"][0].value match "*HyFoSy*"
        ][0]._key,
        "href": items[
          title[language=="no"][0].value match "Eggleder*"
          || title[language=="no"][0].value match "*HyFoSy*"
        ][0].href,
        "titleNo": items[
          title[language=="no"][0].value match "Eggleder*"
          || title[language=="no"][0].value match "*HyFoSy*"
        ][0].title[language=="no"][0].value
      }[defined(itemKey)]
    }`,
    { id: CAT_ID },
  );

  const segment = (landing?.segments || []).find((row) =>
    (row.tagLinks || []).some((t) => isHyfosyLabel(t.labelNo)),
  );
  const tag = (segment?.tagLinks || []).find((t) => isHyfosyLabel(t.labelNo));
  const service = (landing?.serviceItems || []).find((row) =>
    isHyfosyLabel(row.titleNo),
  );

  if (!service?.groupKey || !service.itemKey) {
    throw new Error(
      "Could not find the Egglederundersøkelse (HyFoSy) «Hva vi tilbyr» item on category-fertilitet",
    );
  }

  const patch: Record<string, string> = {
    [`landingPage.servicesSection.groups[_key=="${service.groupKey}"].items[_key=="${service.itemKey}"].href`]:
      HREF,
  };

  console.log(
    `  services ${service.titleNo}: ${service.href} → ${HREF} (group ${service.groupKey}, item ${service.itemKey})`,
  );

  if (segment?._key && tag?._key) {
    patch[
      `landingPage.segmentsSection.segments[_key=="${segment._key}"].tagLinks[_key=="${tag._key}"].href`
    ] = HREF;
    console.log(
      `  fold-out ${tag.labelNo}: ${tag.href} → ${HREF} (segment ${segment._key}, tag ${tag._key})`,
    );
  } else {
    console.log("  no HyFoSy fold-out tag found (services row still patched)");
  }

  if (!DRY_RUN) {
    await sanityClient.patch(CAT_ID).set(patch).commit();
  }

  return {
    foldOut: tag ? { from: tag.href, to: HREF } : null,
    services: { from: service.href, to: HREF },
  };
}

async function linkOnCategory() {
  const treatments = await sanityClient.fetch<
    Array<{ _key?: string; _ref?: string }>
  >(`*[_id==$id][0].treatments[]{ _key, _ref }`, { id: CAT_ID });
  const list = treatments || [];
  if (list.some((row) => row._ref === DOC_ID)) {
    console.log("  category.treatments already includes HyFoSy");
    return { linked: true, inserted: false };
  }

  const afterHysteroskopi = list.find(
    (row) => row._ref === "treatment-fertilitet-hysteroskopi",
  );
  const nextRef = { _type: "reference" as const, _ref: DOC_ID, _key: refKey() };

  console.log(
    afterHysteroskopi?._key
      ? "  insert HyFoSy after hysteroskopi in category.treatments"
      : "  append HyFoSy to category.treatments",
  );

  if (DRY_RUN) return { linked: true, inserted: true };

  if (afterHysteroskopi?._key) {
    await sanityClient
      .patch(CAT_ID)
      .insert("after", `treatments[_key=="${afterHysteroskopi._key}"]`, [nextRef])
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
          reasonsNo?: string[];
        };
        servicesHref?: string | string[] | null;
        navHasHyfosy?: boolean;
      }>(
        `{
          "treatment": *[_id==$id][0]{
            "titleNo": title[language=="no"][0].value,
            "slugNo": slug[language=="no"][0].value.current,
            "reasonsNo": reasons[].title[language=="no"][0].value
          },
          "servicesHref": *[_id==$cat][0].landingPage.servicesSection.groups[].items[
            title[language=="no"][0].value match "*HyFoSy*"
          ][0].href,
          "navHasHyfosy": count(*[_id==$cat][0].treatments[_ref==$id]) > 0
        }`,
        { id: DOC_ID, cat: CAT_ID },
      );

  if (verify) {
    const servicesHref = Array.isArray(verify.servicesHref)
      ? verify.servicesHref.find((value) => typeof value === "string")
      : verify.servicesHref;
    if (verify.treatment?.titleNo !== TITLE_NO) {
      throw new Error(
        `Unexpected title: ${String(verify.treatment?.titleNo)}`,
      );
    }
    if (verify.treatment?.slugNo !== SLUG_NO) {
      throw new Error(`Unexpected slug: ${String(verify.treatment?.slugNo)}`);
    }
    if (
      !(verify.treatment?.reasonsNo || []).some((title) =>
        /skjer under undersøkelsen/i.test(title || ""),
      )
    ) {
      throw new Error("HyFoSy page is missing the examination accordion");
    }
    if (servicesHref !== HREF) {
      throw new Error(
        `HyFoSy «Hva vi tilbyr» was not repointed: ${String(servicesHref)}`,
      );
    }
    if (!verify.navHasHyfosy) {
      throw new Error("HyFoSy is missing from category-fertilitet.treatments[]");
    }
  }

  console.log("✓ HyFoSy");
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
