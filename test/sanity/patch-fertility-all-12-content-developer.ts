#!/usr/bin/env npx tsx
/**
 * Developer-only: Save Norwegian section content for all 12 fertility treatment pages.
 *
 * Source: avenewdemo extract + user HTML dump.
 * - EN fields = same Norwegian text (per user request)
 * - Paths never use /behandlinger — use /fertilitet/...
 * - Creates 4 missing audience pages if absent
 *
 *   cd test && npx tsx sanity/patch-fertility-all-12-content-developer.ts
 *   DRY_RUN=1 cd test && npx tsx sanity/patch-fertility-all-12-content-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const CATEGORY_ID = "category-fertilitet";
const SEE_ALL_HREF = "/fertilitet";
const SEE_ALL_LABEL = "Se alle fertilitet-tjenester";

const IDS = {
  fertilitetsutredning: "treatment-fertilitet-fertilitetsutredning",
  assistert: "treatment-fertilitet-assistert-befruktning",
  eggfrys: "treatment-fertilitet-eggfrys",
  donor: "treatment-fertilitet-donorbehandling",
  saedanalyse: "treatment-fertilitet-saedanalyse",
  infertilitet: "treatment-fertilitet-infertilitet",
  hysteroskopi: "treatment-fertilitet-hysteroskopi",
  parOgSingle: "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  mannKvinne: "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  toKvinner: "treatment-fertilitet-to-kvinner-i-parforhold",
  singelKvinne: "treatment-fertilitet-singel-kvinne",
  singelMann: "treatment-fertilitet-singel-mann",
} as const;

const SPEC = {
  anamika: "specialist-anamika-choudhury",
  birgitte: "specialist-birgitte-mitlid-mork",
  hannah: "specialist-hannah-russell",
  ida: "specialist-ida-waagsbo-bjorntvedt",
  jackson: "specialist-jackson-tok",
  kjersti: "specialist-kjersti-brenden",
  kristian: "specialist-kristian-ophaug",
  sonu: "specialist-sonu-lukose",
} as const;

const TEAM8 = [
  SPEC.anamika,
  SPEC.birgitte,
  SPEC.hannah,
  SPEC.ida,
  SPEC.jackson,
  SPEC.kjersti,
  SPEC.kristian,
  SPEC.sonu,
] as const;

const INFERT_SPECS = [SPEC.birgitte, SPEC.jackson, SPEC.kjersti] as const;

type Reason = { title: string; desc: string };
type Card = { title: string; desc: string; path: string };
type PageCfg = {
  id: string;
  slug: string;
  demoSlug: string;
  title: string;
  createIfMissing?: boolean;
  relatedIds: string[];
  specialistIds: readonly string[];
  promisesVariant: "standard" | "utredning";
  expertAreas?: { title: string; cards: Card[] };
  reasonsLead?: string;
  heroTitleOverride?: string;
  midCtaOverride?: string;
  primaryCta?: string;
};

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

/** Same text for NO and EN. */
function i18nString(no: string) {
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
      value: no,
    },
  ];
}

function i18nText(no: string) {
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
      value: no,
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

function reasonRow(index: number, r: Reason) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: refKey(),
    n: i18nString(n),
    title: i18nString(r.title),
    desc: i18nText(r.desc),
  };
}

/**
 * Canonical promise card images (developer dataset).
 * Byte-identical to avenewdemo infertilitet benefit imgs (2026-08-15 scrape):
 *   comfort: familie-komfort.webp
 *   specialists: spesialister-med-dybde-madeleine.jpg (NOT promises-2.jpg)
 *   sameRoof: alt-under-samme-tak.jpg
 */
const PROMISE_IMAGES = {
  comfort: "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
  specialists: "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
  sameRoof: "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
} as const;

function promiseImage(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

function promiseRows(variant: "standard" | "utredning") {
  if (variant === "utredning") {
    return [
      {
        _key: refKey(),
        title: i18nString("Du bestemmer hva du er komfortabel med"),
        desc: i18nText(
          "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stille spørsmål underveis og ta med deg noen om du ønsker det.",
        ),
        image: promiseImage(PROMISE_IMAGES.comfort),
      },
      {
        _key: refKey(),
        title: i18nString("Erfarne spesialister"),
        desc: i18nText(
          "Hos oss møter du leger og embryologer med erfaring fra ledende fertilitetssentre — ikke en generalist på utplassering.",
        ),
        image: promiseImage(PROMISE_IMAGES.specialists),
      },
      {
        _key: refKey(),
        title: i18nString("Alt under samme tak"),
        desc: i18nText(
          "Konsultasjon, laboratorium og behandling i samme bygg. Vi koordinerer hele forløpet — ingenting forsvinner mellom sprekker.",
        ),
        image: promiseImage(PROMISE_IMAGES.sameRoof),
      },
    ];
  }
  return [
    {
      _key: refKey(),
      title: i18nString("Tilpasset dine behov"),
      desc: i18nText(
        "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      ),
      image: promiseImage(PROMISE_IMAGES.comfort),
    },
    {
      _key: refKey(),
      title: i18nString("Erfarne spesialister"),
      desc: i18nText(
        "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
      ),
      image: promiseImage(PROMISE_IMAGES.specialists),
    },
    {
      _key: refKey(),
      title: i18nString("Alt under samme tak"),
      desc: i18nText(
        "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
      ),
      image: promiseImage(PROMISE_IMAGES.sameRoof),
    },
  ];
}

function heroPointChips() {
  return [
    { _key: refKey(), title: i18nString("Kort ventetid") },
    { _key: refKey(), title: i18nString("Ingen henvisning") },
  ];
}

function specialistsSection(specialistIds: readonly string[]) {
  return {
    _type: "pageSectionSpecialists",
    _key: "specialists-section",
    displayMode: "manual",
    variant: "carousel",
    // Demo: heading + Erfaring ingress (avenewdemo eggfrys etc.)
    title: i18nString("Spesialister som utfører dette"),
    description: i18nText(
      "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
    ),
    specialists: refs(specialistIds),
    seeAllHref: "/spesialister?kategori=fertilitet",
    seeAllLabel: i18nString("Se alle fertilitetsspesialister"),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.8a9fe69d5dc78649",
    },
    title: i18nString("Bestill time hos spesialist"),
    subtitle: i18nText(
      "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
    ),
    primaryLabel: i18nString("Bestill time nå"),
  };
}

function expertAreasObject(title: string, cards: Card[]) {
  return {
    title: i18nString(title),
    items: cards.map((c) => ({
      _key: refKey(),
      title: i18nString(c.title),
      desc: i18nText(c.desc),
      path: c.path.startsWith("/behandlinger/")
        ? c.path.replace(/^\/behandlinger/, "")
        : c.path,
    })),
  };
}

/** Related lists from user HTML (exclude self via filter at apply time). */
const RELATED_BY_SLUG: Record<string, string[]> = {
  fertilitetsutredning: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  "assistert-befruktning": [
    IDS.infertilitet,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  eggfrys: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  donorbehandling: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  saedanalyse: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  infertilitet: [
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  hysteroskopi: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  // Dump order: clinical services first, then audience siblings (exclude self).
  "assistert-befruktning-for-par-og-single": [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  "mann-og-kvinne-i-parforhold": [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  "to-kvinner-i-parforhold": [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  "singel-kvinne": [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelMann,
  ],
  "singel-mann": [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
  ],
};

const PAGES: PageCfg[] = [
  {
    id: IDS.fertilitetsutredning,
    slug: "fertilitetsutredning",
    demoSlug: "fertilitetsutredning",
    title: "Fertilitetsutredning",
    relatedIds: RELATED_BY_SLUG.fertilitetsutredning,
    specialistIds: TEAM8,
    promisesVariant: "utredning",
    heroTitleOverride: "Et trygt første steg",
    midCtaOverride: "Snakk med en av våre fertilitetsspesialister",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Vi har samlet hele innholdet i utredningen i en oversikt du kan utforske i ditt eget tempo. Trykk på hvert tema for å lese mer.",
    expertAreas: {
      title: "Veien videre",
      cards: [
        {
          title: "IVF — prøverørsbehandling",
          desc: "Når utredningen viser at dere trenger hjelp på veien.",
          path: "/fertilitet/assistert-befruktning",
        },
      ],
    },
  },
  {
    id: IDS.assistert,
    slug: "assistert-befruktning",
    demoSlug: "assistert-befruktning",
    title: "Assistert befruktning",
    relatedIds: RELATED_BY_SLUG["assistert-befruktning"],
    specialistIds: [SPEC.kristian],
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
  },
  {
    id: IDS.eggfrys,
    slug: "eggfrys",
    demoSlug: "eggfrys",
    title: "Eggfrys",
    relatedIds: RELATED_BY_SLUG.eggfrys,
    specialistIds: [SPEC.kristian],
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
  },
  {
    id: IDS.donor,
    slug: "donorbehandling",
    demoSlug: "donorbehandling",
    title: "Donorbehandling",
    relatedIds: RELATED_BY_SLUG.donorbehandling,
    specialistIds: [SPEC.kristian],
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
  },
  {
    id: IDS.saedanalyse,
    slug: "saedanalyse",
    demoSlug: "saedanalyse",
    title: "Sædanalyse",
    relatedIds: RELATED_BY_SLUG.saedanalyse,
    specialistIds: [SPEC.kristian],
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
  },
  {
    id: IDS.infertilitet,
    slug: "infertilitet",
    demoSlug: "infertilitet",
    title: "Infertilitet",
    relatedIds: RELATED_BY_SLUG.infertilitet,
    specialistIds: INFERT_SPECS,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
  },
  {
    id: IDS.hysteroskopi,
    slug: "hysteroskopi",
    demoSlug: "hysteroskopi",
    title: "Hysteroskopi",
    relatedIds: RELATED_BY_SLUG.hysteroskopi,
    specialistIds: [SPEC.kristian],
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen.",
  },
  {
    id: IDS.parOgSingle,
    slug: "assistert-befruktning-for-par-og-single",
    demoSlug: "par-og-single",
    title: "Assistert befruktning for par og single",
    relatedIds: RELATED_BY_SLUG["assistert-befruktning-for-par-og-single"],
    specialistIds: TEAM8,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Hos oss er det plass til ulike veier til det samme ønsket – å få barn. Assistert befruktning kan benyttes av mann og kvinne i parforhold, to kvinner i parforhold, og kvinner som ønsker å bli mor på egen hånd nå eller bevare mulighetene for å bli gravid i fremtiden.",
    expertAreas: {
      title: "Andre ting vi hjelper med",
      cards: [
        {
          title: "Fertilitetsutredning",
          desc: "Grundig kartlegging av fertiliteten — et trygt første steg.",
          path: "/fertilitet/fertilitetsutredning",
        },
        {
          title: "Assistert befruktning",
          desc: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.",
          path: "/fertilitet/assistert-befruktning",
        },
        {
          title: "Eggfrys",
          desc: "Bevar muligheten for graviditet senere i livet.",
          path: "/fertilitet/eggfrys",
        },
      ],
    },
  },
  {
    id: IDS.mannKvinne,
    slug: "mann-og-kvinne-i-parforhold",
    demoSlug: "mann-og-kvinne-i-parforhold",
    title: "Mann og kvinne i parforhold",
    createIfMissing: true,
    relatedIds: RELATED_BY_SLUG["mann-og-kvinne-i-parforhold"],
    specialistIds: TEAM8,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Har dere prøvd en stund – uten å lykkes? Mange av parene som kommer til oss har forsøkt å bli gravide over tid. Uansett hvor dere er i prosessen, møter vi dere med forståelse og respekt.",
    expertAreas: {
      title: "Andre ting vi hjelper med",
      cards: [
        {
          title: "Fertilitetsutredning",
          desc: "Grundig kartlegging av fertiliteten — et trygt første steg.",
          path: "/fertilitet/fertilitetsutredning",
        },
        {
          title: "Assistert befruktning",
          desc: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.",
          path: "/fertilitet/assistert-befruktning",
        },
        {
          title: "Sædanalyse",
          desc: "Kartlegging av sædkvalitet — antall, bevegelighet og form.",
          path: "/fertilitet/saedanalyse",
        },
      ],
    },
  },
  {
    id: IDS.toKvinner,
    slug: "to-kvinner-i-parforhold",
    demoSlug: "to-kvinner-i-parforhold",
    title: "To kvinner i parforhold",
    createIfMissing: true,
    relatedIds: RELATED_BY_SLUG["to-kvinner-i-parforhold"],
    specialistIds: TEAM8,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Flere og flere kvinner velger å få barn sammen som par. Hos oss møter dere et fagmiljø med erfaring, trygghet og forståelse for deres situasjon.",
    expertAreas: {
      title: "Andre ting vi hjelper med",
      cards: [
        {
          title: "Donorbehandling",
          desc: "Donorsæd, partnerdonasjon og donoregg — trygt og oversiktlig.",
          path: "/fertilitet/donorbehandling",
        },
        {
          title: "Assistert befruktning",
          desc: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.",
          path: "/fertilitet/assistert-befruktning",
        },
        {
          title: "Fertilitetsutredning",
          desc: "Grundig kartlegging av fertiliteten — et trygt første steg.",
          path: "/fertilitet/fertilitetsutredning",
        },
      ],
    },
  },
  {
    id: IDS.singelKvinne,
    slug: "singel-kvinne",
    demoSlug: "singel-kvinne",
    title: "Singel kvinne",
    createIfMissing: true,
    relatedIds: RELATED_BY_SLUG["singel-kvinne"],
    specialistIds: TEAM8,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Ønsker du å få barn på egen hånd – eller bevare muligheten for senere? Mange kvinner kommer til oss for å utforske mulighetene – enten de er klare for behandling, ønsker mer kunnskap, eller vurderer å fryse ned egg for fremtiden.",
    expertAreas: {
      title: "Andre ting vi hjelper med",
      cards: [
        {
          title: "Eggfrys",
          desc: "Bevar muligheten for graviditet senere i livet.",
          path: "/fertilitet/eggfrys",
        },
        {
          title: "Donorbehandling",
          desc: "Donorsæd fra godkjente sædbanker — ikke-anonym donor.",
          path: "/fertilitet/donorbehandling",
        },
        {
          title: "Assistert befruktning",
          desc: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.",
          path: "/fertilitet/assistert-befruktning",
        },
      ],
    },
  },
  {
    id: IDS.singelMann,
    slug: "singel-mann",
    demoSlug: "singel-mann",
    title: "Singel mann",
    createIfMissing: true,
    relatedIds: RELATED_BY_SLUG["singel-mann"],
    specialistIds: TEAM8,
    promisesVariant: "standard",
    primaryCta: "Se ledige tider og book",
    reasonsLead:
      "Ønsker du å få innsikt i din fertilitet? En sædanalyse gir viktig informasjon om sædkvaliteten din – og kunnskap gjør det lettere å ta gode valg, både nå og i fremtiden.",
    expertAreas: {
      title: "Andre ting vi hjelper med",
      cards: [
        {
          title: "Sædanalyse",
          desc: "Kartlegging av sædkvalitet — antall, bevegelighet og form.",
          path: "/fertilitet/saedanalyse",
        },
        {
          title: "Fertilitetsutredning",
          desc: "Grundig kartlegging av fertiliteten — et trygt første steg.",
          path: "/fertilitet/fertilitetsutredning",
        },
        {
          title: "Assistert befruktning",
          desc: "IVF, ICSI og IUI — vår hovedside om assistert befruktning.",
          path: "/fertilitet/assistert-befruktning",
        },
      ],
    },
  },
];

type DemoPage = {
  slug: string;
  heroTitle?: string;
  heroLead?: string;
  heroPrice?: string;
  reasonsTitle?: string;
  reasons?: Reason[];
  midCtaTitle?: string;
};

function loadDemoPages(): Map<string, DemoPage> {
  const file = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "_tmp-demo-fertility-content.json",
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

async function ensureCreated(
  page: PageCfg,
  demo: DemoPage,
  templateHeroImage: unknown,
) {
  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id: page.id },
  );
  if (exists) return;

  if (!page.createIfMissing) {
    throw new Error(`Missing published treatment: ${page.id}`);
  }

  const doc = {
    _id: page.id,
    _type: "treatment",
    pageRole: "service",
    title: i18nString(page.title),
    slug: slugField(page.slug),
    categories: [{ _key: refKey(), _type: "reference", _ref: CATEGORY_ID }],
    description: i18nText(demo.heroLead || ""),
    heroTitle: i18nString(demo.heroTitle || page.title),
    heroImage: templateHeroImage,
    heroImageAlt: i18nString(`${page.title} hos CMedical`),
    heroPrice: i18nString(demo.heroPrice || "time fra 2 850 kr"),
    heroPoints: heroPointChips(),
    primaryCtaLabel: i18nString(page.primaryCta || "Se ledige tider og book"),
    callCtaLabel: i18nString("Ring oss"),
    hideSeePriser: true,
    bookingService: page.slug,
    reasonsTitle: i18nString(demo.reasonsTitle || `Om ${page.title.toLowerCase()}`),
    reasonsLayout: "accordion",
    reasons: (demo.reasons || []).map((r, i) => reasonRow(i, r)),
    promises: promiseRows(page.promisesVariant),
    conversationCtaTitle: i18nString(
      page.midCtaOverride ||
        demo.midCtaTitle ||
        "Snakk med en av våre fertilitetsspesialister",
    ),
    relatedSection: {
      _type: "object",
      title: i18nString("Relaterte tjenester"),
      seeAllHref: SEE_ALL_HREF,
      seeAllLabel: i18nString(SEE_ALL_LABEL),
      asIntro: false,
      asServices: true,
      items: [], // related refs applied in patchPage after all docs exist
    },
    expertAreas: page.expertAreas
      ? expertAreasObject(page.expertAreas.title, page.expertAreas.cards)
      : undefined,
    pageSections: [specialistsSection(page.specialistIds), bookingSection()],
    srOnlyTitle: i18nString(`${page.title} hos CMedical`),
    seo: {
      _type: "seo",
      metaTitle: i18nString(`${page.title} | CMedical Fertilitet`),
      metaDescription: i18nText(demo.heroLead || page.title),
      noIndex: false,
    },
    geoSummary: i18nText(demo.heroLead || page.title),
  };

  console.log(`  CREATE ${page.id}`);
  if (!DRY_RUN) {
    await sanityClient.createOrReplace(doc);
  }
}

async function patchPage(page: PageCfg, demo: DemoPage) {
  console.log(`\n→ ${page.slug}`);

  const reasons = (demo.reasons || []).map((r, i) => reasonRow(i, r));
  const relatedIds = page.relatedIds.filter((id) => id !== page.id);

  const patch: Record<string, unknown> = {
    title: i18nString(page.title),
    description: i18nText(demo.heroLead || ""),
    heroTitle: i18nString(
      page.heroTitleOverride || demo.heroTitle || page.title,
    ),
    heroPrice: i18nString(demo.heroPrice || ""),
    heroPoints: heroPointChips(),
    primaryCtaLabel: i18nString(page.primaryCta || "Se ledige tider og book"),
    callCtaLabel: i18nString("Ring oss"),
    hideSeePriser: true,
    reasonsTitle: i18nString(demo.reasonsTitle || `Om ${page.title}`),
    reasonsLayout: "accordion",
    reasons,
    promises: promiseRows(page.promisesVariant),
    conversationCtaTitle: i18nString(
      page.midCtaOverride ||
        "Snakk med en av våre fertilitetsspesialister",
    ),
    relatedSection: {
      _type: "object",
      title: i18nString("Relaterte tjenester"),
      seeAllHref: SEE_ALL_HREF,
      seeAllLabel: i18nString(SEE_ALL_LABEL),
      asIntro: false,
      asServices: true,
      items: refs(relatedIds),
    },
    pageSections: [specialistsSection(page.specialistIds), bookingSection()],
    srOnlyTitle: i18nString(`${page.title} hos CMedical`),
  };

  if (page.reasonsLead) {
    patch.reasonsLead = i18nText(page.reasonsLead);
  }
  if (page.expertAreas) {
    patch.expertAreas = expertAreasObject(
      page.expertAreas.title,
      page.expertAreas.cards,
    );
  } else {
    patch.expertAreas = null;
  }

  // Clear FAQ / insurance so bands stay hidden (parity)
  const unset = ["faqs", "faqCollection", "faqSectionTitle", "insurancePartners"];

  console.log(
    `  reasons=${reasons.length} related=${relatedIds.length} specialists=${page.specialistIds.length} price="${demo.heroPrice || ""}"`,
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
  console.log(`Loaded ${demoMap.size} demo pages. DRY_RUN=${DRY_RUN}`);

  const template = await sanityClient.fetch<{
    heroImage?: unknown;
  } | null>(`*[_id==$id][0]{heroImage}`, { id: IDS.assistert });
  if (!template?.heroImage) {
    throw new Error("Template heroImage missing on assistert-befruktning");
  }

  // Create missing docs first (so related refs resolve)
  for (const page of PAGES) {
    const demo = demoMap.get(page.demoSlug);
    if (!demo) throw new Error(`No demo content for ${page.demoSlug}`);
    await ensureCreated(page, demo, template.heroImage);
  }

  for (const page of PAGES) {
    const demo = demoMap.get(page.demoSlug);
    if (!demo) throw new Error(`No demo content for ${page.demoSlug}`);
    await patchPage(page, demo);
  }

  // Fix any leftover /behandlinger see-all on fertility treatments
  const withBadSeeAll = await sanityClient.fetch<Array<{ _id: string }>>(
    `*[_type=="treatment" && references($cat) && relatedSection.seeAllHref match "/behandlinger*"]{_id}`,
    { cat: CATEGORY_ID },
  );
  for (const row of withBadSeeAll || []) {
    console.log(`\n→ fix seeAllHref on ${row._id}`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(row._id)
        .set({ "relatedSection.seeAllHref": SEE_ALL_HREF })
        .commit();
      await discardDraft(row._id);
    }
  }

  console.log("\n✓ Fertility 12-page content patched on developer");
  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        dryRun: DRY_RUN,
        pages: PAGES.map((p) => p.slug),
        note: "EN = NO; paths use /fertilitet (no /behandlinger)",
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
