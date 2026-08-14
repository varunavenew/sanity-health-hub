#!/usr/bin/env npx tsx
/**
 * Developer-only: Gynekologi category page parity vs avenewdemo `/gynekologi`.
 *
 * Updates landing copy, symptoms (PMOS), manual specialists (9 ordered),
 * insurance partners (live reference order), booking CTA, clears FAQ.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-parity-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-gynekologi";
const DRAFT_ID = "drafts.category-gynekologi";

const SPECIALIST_IDS = [
  "specialist-alenka-bindas",
  "specialist-ane-gerda-z-eriksson",
  "specialist-ashi-ahmad",
  "specialist-birgitte-aspenes",
  "specialist-henrik-michelsen-wahl",
  "specialist-jorgen-perminow",
  "specialist-madeleine-engen",
  "specialist-siri-klokstad",
  "specialist-thomas-fredrik-thaulow",
] as const;

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function specialtyItems(pairs: Array<[string, string]>) {
  return pairs.map(([no, en]) => ({
    _type: "specialtyItem" as const,
    _key: `spec-${slugify(no)}`,
    label: i18nString(no, en),
  }));
}

const SPECIALIST_CARD: Record<
  string,
  {
    role: [string, string];
    subtitle: [string, string];
    specialties: Array<[string, string]>;
  }
> = {
  "specialist-alenka-bindas": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Spesialist", "Specialist"],
    specialties: [["Gynekologi", "Gynecology"]],
  },
  "specialist-ane-gerda-z-eriksson": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Robotkirurg", "Robot surgeon"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Robotkirurgi", "Robot surgery"],
      ["Gynekologisk kreftbehandling", "Gynecological cancer treatment"],
    ],
  },
  "specialist-ashi-ahmad": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Fødselshjelp", "Obstetrics"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Fødselshjelp", "Obstetrics"],
      ["Fostermedisin", "Fetal medicine"],
      ["Ultralyd", "Ultrasound"],
      ["NIPT", "NIPT"],
    ],
  },
  "specialist-birgitte-aspenes": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Kirurg", "Surgeon"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Kirurgi", "Surgery"],
      ["Overgangsalder", "Menopause"],
      ["Urogynekologi", "Urogynecology"],
    ],
  },
  "specialist-henrik-michelsen-wahl": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Kirurg", "Surgeon"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Endometriose", "Endometriosis"],
      ["Gynekologisk kirurgi", "Gynecological surgery"],
    ],
  },
  "specialist-jorgen-perminow": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Spesialist", "Specialist"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Obstetrikk", "Obstetrics"],
    ],
  },
  "specialist-madeleine-engen": {
    role: ["Gynekolog", "Gynecologist"],
    subtitle: ["Kirurg", "Surgeon"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Urogynekologi", "Urogynecology"],
      ["Bekkenbunnshelse", "Pelvic floor health"],
    ],
  },
  "specialist-siri-klokstad": {
    role: ["Gynekologi", "Gynecology"],
    subtitle: ["Gynekolog", "Gynecologist"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Underlivsplager", "Pelvic disorders"],
      ["Vulvasmerter", "Vulvar pain"],
      ["Hormoner", "Hormones"],
      ["Prevensjon", "Contraception"],
    ],
  },
  "specialist-thomas-fredrik-thaulow": {
    role: ["Gynekologi", "Gynecology"],
    subtitle: ["Gynekolog", "Gynecologist"],
    specialties: [
      ["Gynekologi", "Gynecology"],
      ["Endometriose", "Endometriosis"],
      ["Laparoskopi", "Laparoscopy"],
      ["Hysteroskopi", "Hysteroscopy"],
      ["Endoskopisk kirurgi", "Endoscopic surgery"],
    ],
  },
};

const INSURANCE_PARTNERS = [
  ["gjensidige", "Gjensidige"],
  ["if", "If"],
  ["fremtind", "Fremtind"],
  ["avanova", "Avanova"],
  ["tryg", "Tryg"],
  ["vertikal", "Vertikal"],
  ["falck", "Falck"],
  ["euro-accident", "Euro Accident"],
] as const;

const SECTION_ORDER = [
  "segments",
  "why",
  "audiences",
  "expertAreas",
  "symptoms",
  "services",
  "support",
  "results",
  "reviews",
  "spotlight",
  "specialists",
] as const;

async function patchDoc(docId: string) {
  const current = await sanityClient.fetch<{
    landingPage?: Record<string, any>;
    pageSections?: Array<Record<string, any>>;
  } | null>(`*[_id == $id][0]{ landingPage, pageSections }`, { id: docId });

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${docId}.landingPage missing`);
  }

  const lp = current.landingPage;
  const hero = lp.hero || {};

  const nextHero = {
    ...hero,
    heading: i18nString("Kvinnehelse", "Women's health"),
    headingEmphasis: i18nString("for livet", "for life"),
    body: i18nText(
      "Vi følger deg gjennom hele livet – fra de første spørsmålene i tenårene, gjennom barneønske og svangerskap, fødsel og barseltid, til tiden før, under og etter overgangsalder. Vi har gynekologer med ekspertise innen alle de vanligste kvinnelidelsene, ved behov får du hjelp fra andre spesialister som psykolog, osteopat eller sexolog. Hos oss får du helhetlig omsorg.",
      "We support you through every stage of life – from the first questions in your teens, through trying to conceive and pregnancy, birth and the postnatal period, to the time before, during and after menopause. Our gynecologists have expertise across the most common women's health conditions, and when needed you get help from other specialists such as a psychologist, osteopath or sexologist. With us you receive holistic care.",
    ),
    bullets: [
      {
        _key: "b1",
        _type: "heroBulletItem",
        title: i18nString("Ingen henvisning", "No referral needed"),
      },
      {
        _key: "b2",
        _type: "heroBulletItem",
        title: i18nString("Korte ventetider", "Short waiting times"),
      },
    ],
    primaryCtaLabel: i18nString(
      "Bestill gynekologisk undersøkelse",
      "Book gynecological examination",
    ),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    entryPriceLabel: i18nString("Generell undersøkelse", "General examination"),
    entryPriceValue: i18nString("Pris fra 2.100 kr", "From NOK 2,100"),
    primaryBookingService: hero.primaryBookingService || "generell-undersokelse",
  };

  const whySection = {
    ...lp.whySection,
    title: i18nString(
      "Nordens mest komplette kvinnehelsetilbud — samlet på ett sted.",
      "The Nordics' most complete women's health offering — in one place.",
    ),
    description: i18nText(
      "Hos CMedical får du utredning, kirurgi, svangerskapsoppfølging og fertilitetsklinikk samlet på ett sted — med direkte tilgang til riktig ekspertise, uten omveier.",
      "At CMedical you get assessment, surgery, pregnancy care and a fertility clinic in one place — with direct access to the right expertise, without detours.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString("En trygg base for kvinnehelse", "A safe base for women's health"),
        description: i18nText(
          "Konsultasjon, ultralyd, kirurgi og fertilitetsbehandling under samme tak. Du slipper å bli sendt videre — vi tar deg gjennom hele forløpet.",
          "Consultation, ultrasound, surgery and fertility treatment under one roof. You are not sent elsewhere — we guide you through the whole journey.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString("Ledende kompetanse", "Leading expertise"),
        description: i18nText(
          "Gynekologer med spesialisering fra Rikshospitalet og ledende kvinnehelsemiljøer i Norden — i tverrfaglig samarbeid med osteopat, sexolog, psykolog og ernæringsfysiolog.",
          "Gynecologists specialised at Rikshospitalet and leading women's health centres in the Nordics — in interdisciplinary collaboration with osteopath, sexologist, psychologist and clinical nutritionist.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Tett oppfølging", "Close follow-up"),
        description: i18nText(
          "Du får ett team som følger deg over tid — fra første samtale til kontroll etter behandling. Direkte tilgang til riktig ekspertise, uten omveier.",
          "You get one team that follows you over time — from the first conversation to follow-up after treatment. Direct access to the right expertise, without detours.",
        ),
      },
    ],
  };

  const audiencesSection = {
    ...lp.audiencesSection,
    title: i18nString(
      "Kvinnehelse gjennom hele livsløpet.",
      "Women's health through the entire life course.",
    ),
    titleAccent: i18nString("", ""),
    readMoreLabel: i18nString("Les mer", "Read more"),
    audiences: (lp.audiencesSection?.audiences || []).map((a: any) => {
      const titleNo = a?.title?.find?.((t: any) => t.language === "no")?.value || "";
      if (titleNo.includes("Første")) {
        return {
          ...a,
          title: i18nString("Første gynekologtime", "First gynecology appointment"),
          description: i18nText(
            "Det første møtet skal være trygt og forklart. Vi tar oss tid — uansett om det er prevensjon, syklus eller bare et spørsmål du har båret på lenge.",
            "Your first visit should feel safe and clearly explained. We take our time — whether it is contraception, your cycle or a question you have carried for a long time.",
          ),
        };
      }
      if (titleNo.includes("Gravid")) {
        return {
          ...a,
          title: i18nString("Gravid eller nylig forløst", "Pregnant or recently given birth"),
          description: i18nText(
            "Ultralyd, svangerskapsoppfølging, 6-ukerskontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
            "Ultrasound, pregnancy care, 6-week check-up and pelvic floor — we support you through the whole journey, including what comes after.",
          ),
        };
      }
      if (titleNo.includes("Midt")) {
        return {
          ...a,
          title: i18nString("Midt i livet og videre", "Mid-life and beyond"),
          description: i18nText(
            "Overgangsalder, hormoner, urinlekkasje eller fremfall — vi hjelper deg å forstå kroppen og finne riktig behandling på dine premisser.",
            "Menopause, hormones, urinary leakage or prolapse — we help you understand your body and find the right treatment on your terms.",
          ),
        };
      }
      return a;
    }),
  };

  const expertAreasSection = {
    ...lp.expertAreasSection,
    eyebrow: i18nString("", ""),
    title: i18nString(
      "Utredning og behandling — for hver fase av kvinnelivet.",
      "Assessment and treatment — for every phase of a woman's life.",
    ),
    description: i18nText(
      "Hos oss møter du gynekologer som jobber med få og utvalgte kvinnesykdommer, hvor de har særskilt kompetanse. Det gjør at du raskere kommer til riktig vurdering og behandling.",
      "You meet gynecologists who work with a select set of women's health conditions where they have particular expertise. That means you reach the right assessment and treatment faster.",
    ),
    areas: (lp.expertAreasSection?.areas || []).map((area: any, index: number) => {
      if (index === 0) {
        return {
          ...area,
          title: i18nString("Endometriose og adenomyose", "Endometriosis and adenomyosis"),
          description: i18nText(
            "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
            "We are leaders in Northern Europe in endometriosis treatment with robot-assisted surgery — including complex cases.",
          ),
        };
      }
      if (index === 1) {
        return {
          ...area,
          title: i18nString(
            "Fødselsskader og bekkenbunnshelse",
            "Birth injuries and pelvic floor health",
          ),
          description: i18nText(
            "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
            "From tears to urinary leakage — we treat through conversation and surgery when needed. You deserve to be heard.",
          ),
        };
      }
      return area;
    }),
  };

  const symptomsSection = {
    ...lp.symptomsSection,
    title: i18nString("Hva kjenner du på?", "What are you experiencing?"),
    description: i18nText(
      "Velg det som ligner mest på din situasjon — så foreslår vi en god start.",
      "Choose what best matches your situation — and we will suggest a good place to start.",
    ),
    items: (lp.symptomsSection?.items || []).map((item: any) => {
      const symptomNo =
        item?.symptom?.find?.((t: any) => t.language === "no")?.value || "";
      const serviceNo =
        item?.service?.find?.((t: any) => t.language === "no")?.value || "";
      if (
        symptomNo.includes("PCOS") ||
        symptomNo.includes("PMOS") ||
        serviceNo.includes("PCOS") ||
        serviceNo.includes("PMOS")
      ) {
        return {
          ...item,
          symptom: i18nString(
            "Uregelmessig syklus eller mistanke om PMOS",
            "Irregular cycle or suspected PMOS",
          ),
          service: i18nString("PMOS-utredning", "PMOS investigation"),
        };
      }
      return item;
    }),
  };

  const pageSections = (current.pageSections || []).map((section) => {
    if (section._type === "pageSectionSpecialists") {
      return {
        ...section,
        displayMode: "manual",
        categorySlug: "gynekologi",
        variant: section.variant || "carousel",
        limit: 9,
        specialists: refs(SPECIALIST_IDS),
        title: i18nString(
          "Gynekologene som følger deg.",
          "The gynecologists who support you.",
        ),
        description: i18nText(
          "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
          "Experience, specialist expertise and modern technology in one place.",
        ),
        seeAllLabel: i18nString("Se alle gynekologer", "See all gynecologists"),
        seeAllHref: "/spesialister?kategori=gynekologi",
      };
    }
    if (section._type === "pageSectionInsurance") {
      const { insuranceCollection: _drop, ...rest } = section as Record<
        string,
        unknown
      > & { insuranceCollection?: unknown };
      return {
        ...rest,
        eyebrow: i18nString("Forsikringspartnere", "Insurance partners"),
        title: i18nString(
          "Vi har avtale med de største forsikringsselskapene i Norge.",
          "We have agreements with the largest insurance companies in Norway.",
        ),
        partners: INSURANCE_PARTNERS.map(([key, label]) => ({
          _key: key,
          key,
          label: i18nString(label, label),
        })),
      };
    }
    if (section._type === "pageSectionBookingCta") {
      return {
        ...section,
        title: i18nString(
          "Bestill time hos spesialist",
          "Book an appointment with a specialist",
        ),
        subtitle: i18nString(
          "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
          "Choose service, clinic and clinician – all in one simple booking.",
        ),
        primaryLabel: i18nString("Bestill time nå", "Book now"),
        primaryPath: "/booking?kategori=gynekologi",
        showSecondaryButton: true,
        secondaryLabel: i18nString("Ring oss", "Call us"),
        bookingCategory: {
          _type: "reference",
          _ref: DOC_ID,
        },
      };
    }
    return section;
  });

  if (!pageSections.some((s) => s._type === "pageSectionInsurance")) {
    pageSections.push({
      _key: "ps-insurance",
      _type: "pageSectionInsurance",
      eyebrow: i18nString("Forsikringspartnere", "Insurance partners"),
      title: i18nString(
        "Vi har avtale med de største forsikringsselskapene i Norge.",
        "We have agreements with the largest insurance companies in Norway.",
      ),
      partners: INSURANCE_PARTNERS.map(([key, label]) => ({
        _key: key,
        key,
        label: i18nString(label, label),
      })),
    });
  }

  if (!pageSections.some((s) => s._type === "pageSectionBookingCta")) {
    pageSections.push({
      _key: "ps-cta",
      _type: "pageSectionBookingCta",
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=gynekologi",
      showSecondaryButton: true,
      secondaryLabel: i18nString("Ring oss", "Call us"),
    });
  }

  const landingPage = {
    ...lp,
    hero: nextHero,
    whySection,
    audiencesSection,
    expertAreasSection,
    symptomsSection,
    sectionOrder: [...SECTION_ORDER],
  };

  const patch = {
    landingPage,
    pageSections,
    faqs: [],
  };

  if (DRY_RUN) {
    console.log(`[dry-run] Would patch ${docId}`);
    console.log("  specialists:", SPECIALIST_IDS.length, "manual");
    console.log("  insurance:", INSURANCE_PARTNERS.map(([, l]) => l).join(", "));
    console.log("  sectionOrder:", SECTION_ORDER.join(" → "));
    return;
  }

  await sanityClient
    .patch(docId)
    .set(patch)
    .unset(["faqCollection", "faqSectionTitle", "faqSectionDescription"])
    .commit({ autoGenerateArrayKeys: true });

  console.log(`✓ Patched ${docId}`);
}

async function patchSpecialists() {
  for (const id of SPECIALIST_IDS) {
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!exists) throw new Error(`Missing specialist: ${id}`);

    const card = SPECIALIST_CARD[id];
    if (!card) throw new Error(`No card config for ${id}`);

    const patch: Record<string, unknown> = {
      role: i18nString(card.role[0], card.role[1]),
      subtitle: i18nString(card.subtitle[0], card.subtitle[1]),
      specialties: specialtyItems(card.specialties),
    };

    // Publishability requires clinics[]; these two were missing refs.
    if (id === "specialist-alenka-bindas") {
      patch.name = "Alenka Bindas";
      patch.clinics = [
        { _type: "reference", _ref: "clinicPage-moelv", _key: "clinic-moelv-0" },
      ];
    }
    if (id === "specialist-henrik-michelsen-wahl") {
      patch.clinics = [
        {
          _type: "reference",
          _ref: "clinicPage-majorstuen",
          _key: "clinic-majorstuen-0",
        },
      ];
    }

    if (DRY_RUN) {
      console.log(`[dry-run] specialist ${id}`, card.role[0], "·", card.subtitle[0]);
      continue;
    }

    await sanityClient.patch(id).set(patch).commit({ autoGenerateArrayKeys: true });
    console.log(`✓ ${id}`);
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("▶ Gynekologi parity patch");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  await patchSpecialists();
  await patchDoc(DOC_ID);

  const draft = await sanityClient.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: DRAFT_ID,
  });
  if (draft) {
    await patchDoc(DRAFT_ID);
  }

  const verify = await sanityClient.fetch(`*[_id == $id][0]{
    "heroBody": landingPage.hero.body[language=="no"][0].value,
    "bullets": landingPage.hero.bullets[]{ "t": title[language=="no"][0].value },
    "whyTitle": landingPage.whySection.title[language=="no"][0].value,
    "audiencesTitle": landingPage.audiencesSection.title[language=="no"][0].value,
    "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
    "expert0": landingPage.expertAreasSection.areas[0].title[language=="no"][0].value,
    "symptom5": landingPage.symptomsSection.items[4]{
      "s": symptom[language=="no"][0].value,
      "svc": service[language=="no"][0].value
    },
    "sectionOrder": landingPage.sectionOrder,
    "faqCollection": faqCollection,
    "faqs": count(faqs),
    "spec": pageSections[_type=="pageSectionSpecialists"][0]{
      displayMode, limit,
      "title": title[language=="no"][0].value,
      "ids": specialists[]._ref
    },
    "insurance": pageSections[_type=="pageSectionInsurance"][0].partners[].label[language=="no"][0].value,
    "cta": pageSections[_type=="pageSectionBookingCta"][0].title[language=="no"][0].value
  }`, { id: DOC_ID });

  console.log("\nVerify:\n", JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
