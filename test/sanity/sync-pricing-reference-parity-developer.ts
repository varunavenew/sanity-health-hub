#!/usr/bin/env npx tsx
/**
 * Developer-only: sync pricingPage list + learn-more refs from reference scrape
 * (tmp/priser-ref-v2.json), preserving source + apiActivityId on matched lines.
 *
 *   cd test && npx tsx sanity/sync-pricing-reference-parity-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nVal = {
  _type?: string;
  _key?: string;
  language?: string;
  value?: string;
};

type RefItem = { name: string; price: string; note?: string; bookable?: boolean };
type RefSub = {
  label: string;
  learnMoreHref?: string;
  items: RefItem[];
};
type RefSection = { label: string; subcategories: RefSub[] };

const SKIP_SECTION = /erfaring|spisskompetanse/i;

const CATEGORY_META: Record<
  string,
  { bookingCategorySlug: string; treatmentCategoryId?: string; en: string }
> = {
  Gynekologi: {
    bookingCategorySlug: "gynekologi",
    treatmentCategoryId: "category-gynekologi",
    en: "Gynecology",
  },
  Urologi: {
    bookingCategorySlug: "urologi",
    treatmentCategoryId: "category-urologi",
    en: "Urology",
  },
  Fertilitet: {
    bookingCategorySlug: "fertilitet",
    treatmentCategoryId: "category-fertilitet",
    en: "Fertility",
  },
  Ortopedi: {
    bookingCategorySlug: "ortopedi",
    treatmentCategoryId: "category-ortopedi",
    en: "Orthopedics",
  },
  Endokrinologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Endocrinology",
  },
  Ernæringsfysiolog: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Clinical nutrition",
  },
  "Forebyggende helse": {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Preventive health",
  },
  Gastrokirurgi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Gastrointestinal surgery",
  },
  "Graviditet og fostermedisin": {
    bookingCategorySlug: "graviditet",
    treatmentCategoryId: "category-graviditet",
    en: "Pregnancy and fetal medicine",
  },
  Hudhelse: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Skin health",
  },
  Osteopati: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Osteopathy",
  },
  Overvektskirurgi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Bariatric surgery",
  },
  Psykologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Psychology",
  },
  Revmatologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Rheumatology",
  },
  Sexologi: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Sexology",
  },
  Åreknutebehandling: {
    bookingCategorySlug: "flere-fagomrader",
    treatmentCategoryId: "category-flere-fagomrader",
    en: "Varicose vein treatment",
  },
};

const SUB_EN: Record<string, string> = {
  Konsultasjoner: "Consultations",
  "Operasjoner og kirurgi": "Surgery",
  Kirurgi: "Surgery",
  "Robotkirurgi og prostata": "Robotic surgery and prostate",
  Fertilitetsutredning: "Fertility assessment",
  "Assistert befruktning": "Assisted reproduction",
  "Frysebehandlinger (assistert befruktning)":
    "Cryopreservation (assisted reproduction)",
  Inseminasjon: "Insemination",
  "Sædanalyse og mannlig infertilitet": "Semen analysis and male infertility",
  Donorbehandling: "Donor treatment",
  "Nedfrysing og oppbevaring av egne egg": "Egg freezing and storage",
  "Øvrige tjenester": "Other services",
  Håndterapi: "Hand therapy",
  Fysioterapi: "Physiotherapy",
  Endokrinologi: "Endocrinology",
  Ernæringsfysiolog: "Clinical nutrition",
  "Forebyggende helse": "Preventive health",
  Gastrokirurgi: "Gastrointestinal surgery",
  Svangerskapskontroll: "Pregnancy check-ups",
  Fosterdiagnostikk: "Fetal diagnostics",
  "Fødselsforberedelse og oppfølging": "Birth preparation and follow-up",
  "Konsultasjon og priser": "Consultation and prices",
  Hudbehandlinger: "Skin treatments",
  Behandlingsutstyr: "Treatment equipment",
  Hudpleieprodukter: "Skincare products",
  Osteopati: "Osteopathy",
  Overvektskirurgi: "Bariatric surgery",
  Psykologi: "Psychology",
  Revmatologi: "Rheumatology",
  Sexologi: "Sexology",
  Åreknutebehandling: "Varicose vein treatment",
};

/** Clean NO name → EN name (includes newly scraped Fertilitet lines). */
const NAME_EN: Record<string, string> = {
  "IVF 1 forsøk": "IVF 1 attempt",
  "IVF-pakke 3 forsøk, under 39 år": "IVF package 3 attempts, under 39 years",
  "IVF-pakke 3 forsøk, 39–41 år": "IVF package 3 attempts, ages 39–41",
  "Lavdose hormonbehandling for stimulering av eggløsning":
    "Low-dose hormone treatment for ovulation stimulation",
  "Enkel sædanalyse": "Basic semen analysis",
  "Utvidet sædanalyse": "Extended semen analysis",
  "Sædanalyse etter vasektomi": "Semen analysis after vasectomy",
  "Fryseforsøk (FET)": "Frozen embryo transfer (FET)",
  "Nedfrysning av eggceller uten medisinsk indikasjon":
    "Egg freezing without medical indication",
  "Tilbakesetting embryo etter opptining egg og befruktning":
    "Embryo transfer after egg thawing and fertilisation",
  "Tilbakesetting embryo etter opptining og befruktning":
    "Embryo transfer after thawing and fertilisation",
  "Eggdonasjon (inkl. tilbakesetting av én blastocyst)":
    "Egg donation (incl. transfer of one blastocyst)",
  "Graviditetskontroll etter assistert befruktning":
    "Pregnancy check-up after assisted reproduction",
  "Fertilitetsutredning og rådgivning inkl. ultralyd":
    "Fertility assessment and counselling incl. ultrasound",
  "Gynekologisk undersøkelse inkl. ultralyd":
    "Gynaecological examination incl. ultrasound",
  "Oppfølgingssamtale med gynekolog etter forsøk/utredning":
    "Follow-up consultation with a gynaecologist after treatment/assessment",
  "Telefon-/webkonsultasjon med gynekolog":
    "Telephone / online consultation with a gynaecologist",
  "Undersøkelse av livmorhulen (SIS)": "Uterine cavity assessment (SIS)",
  "Undersøkelse av eggledere (SIS + HyCoSy)":
    "Fallopian tube assessment (SIS + HyCoSy)",
  "ICSI (mikroinjeksjon)": "ICSI (microinjection)",
  "Nedfrysning av befruktet egg/blastocyst":
    "Freezing of fertilised egg / blastocyst",
  "Avbrutt behandling (IVF/ICSI) før egguthenting":
    "Discontinued treatment (IVF/ICSI) before egg retrieval",
  "Årlig avgift oppbevaring sæd/egg/blastocyster":
    "Annual storage fee for sperm / eggs / blastocysts",
  "Avbrutt behandling før fryseforsøk":
    "Discontinued treatment before frozen embryo transfer",
  "Inseminasjon med donorsæd (AID)": "Insemination with donor sperm (AID)",
  "Inseminasjon med partnersæd (AIH)": "Insemination with partner sperm (AIH)",
  "Pakkeprisavtale inseminasjon 3 behandlinger":
    "Package price for 3 insemination treatments",
  "Avbrutt behandling inseminasjon": "Discontinued insemination treatment",
  "Nedfrysning av sædceller": "Sperm freezing",
  "PESA/TESA (spermieuthenting)": "PESA/TESA (sperm retrieval)",
  "MicroTESE (inkl. narkose)": "MicroTESE (incl. anaesthesia)",
  Partnerdonasjon: "Partner donation",
  "Nedfrysing av sæd til eggdonasjon": "Sperm freezing for egg donation",
  "Tilbakesetting av opptint embryo eggdonasjon":
    "Transfer of thawed embryo after egg donation",
  "Administrasjonskostnad bestilling donoregg":
    "Administration fee for ordering donor eggs",
  "Administrasjonskostnad bestilling donorsæd":
    "Administration fee for ordering donor sperm",
  "Årlig avgift oppbevaring reserverte donorsæd":
    "Annual storage fee for reserved donor sperm",
  "Konsultasjon/utredning": "Consultation / assessment",
  "Office-hysteroskopi": "Office hysteroscopy",
  "Tester på livmorslimhinne (ERA/ALICE/EMMA)":
    "Endometrial tests (ERA/ALICE/EMMA)",
  "Administrasjonsgebyr flytting embryo/sæd/egg":
    "Administration fee for transferring embryo / sperm / eggs",
  Resept: "Prescription",
  "Blodprøver tatt hos CMedical": "Blood tests taken at CMedical",
  "Henvisning offentlig sykehus": "Referral to a public hospital",
  Administrasjonsgebyr: "Administration fee",
  "Ikke møtt til fertilitetsutredning (avbest. min 24t før)":
    "Missed fertility assessment appointment (cancel at least 24h before)",
  "Ikke møtt til ultralydkontroll/sædanalyse (avbest. min 24t før)":
    "Missed ultrasound / semen analysis appointment (cancel at least 24h before)",
};

const NOTE_EN: Record<string, string> = {
  "per ultralyd": "per ultrasound",
  "Inkluderer alle relevante ultralydundersøkelser, embryodyrkning til blastocyst i embryoscop og første graviditetsultralyd. Dersom ikke befruktning og/eller ingen tilbakesetting av embryo er prisen som en IVF-behandling. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen.":
    "Includes all relevant ultrasound examinations, embryo culture to blastocyst in Embryoscope and the first pregnancy ultrasound. If there is no fertilisation and/or no embryo transfer, the price is as for an IVF treatment. ICSI (microinjection), blastocyst freezing and TESA/PESA are not included in the package.",
  "Betaling må skje før første behandling igangsettes. Forventet normal eggstokkrespons ved igangsetting. Inkluderer inntil 3 egguthentingsforsøk, alle relevante ultralydundersøkelser og embryodyrkning i embryoscop. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen.":
    "Payment must be made before the first treatment starts. Expected normal ovarian response at start. Includes up to 3 egg retrieval attempts, all relevant ultrasound examinations and embryo culture in Embryoscope. ICSI (microinjection), blastocyst freezing and TESA/PESA are not included in the package.",
  "Betaling må skje før første behandling igangsettes, og kvinnen skal ikke være over 41 år. Forventet normal eggstokkrespons ved igangsetting. Inkluderer inntil 3 egguthentingsforsøk, alle relevante ultralydundersøkelser og embryodyrkning i embryoscop. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen.":
    "Payment must be made before the first treatment starts, and the woman must not be over 41 years. Expected normal ovarian response at start. Includes up to 3 egg retrieval attempts, all relevant ultrasound examinations and embryo culture in Embryoscope. ICSI (microinjection), blastocyst freezing and TESA/PESA are not included in the package.",
  "Inkluderer prebehandling, undersøkelse, monitorering med ultralyd før tilbakesetting og første svangerskapskontroll.":
    "Includes pretreatment, examination, ultrasound monitoring before transfer and the first pregnancy check-up.",
  "Inkluderer monitorering med ultralyd under stimulering, egguthenting og nedfrysing av egg, samt ett års lagring fra frysedato.":
    "Includes ultrasound monitoring during stimulation, egg retrieval and egg freezing, plus one year of storage from the freeze date.",
  "Tilbakesetting med partnerens sædceller eller donorsæd. Kostnad for donorsperm, mva. og transport kommer i tillegg.":
    "Transfer with partner sperm or donor sperm. Cost of donor sperm, VAT and transport is additional.",
  "Det anbefales å ha en ejakulasjon 2–5 dager før sædprøven leveres.":
    "It is recommended to ejaculate 2–5 days before the semen sample is delivered.",
  "Det anbefales å ha en ejakulasjon 1–2 dager før sædprøven leveres.":
    "It is recommended to ejaculate 1–2 days before the semen sample is delivered.",
  "Denne undersøkelsen er inkludert ved vasektomi på CMedical.":
    "This examination is included with vasectomy at CMedical.",
  "Beløpet splittes i to innbetalinger: ved oppstart av behandling og ved nedfrysing av blastocyst":
    "The amount is split into two payments: at treatment start and when the blastocyst is frozen",
  "Inkludert i IVF/ICSI-behandling. Pris gjelder ved øvrige behandlinger":
    "Included in IVF/ICSI treatment. Price applies to other treatments",
};

/** Scraped notes that accidentally absorbed the price — replace with clean text. */
const NOTE_FIX_NO: Record<string, string> = {
  "Eggdonasjon (inkl. tilbakesetting av én blastocyst)":
    "Beløpet splittes i to innbetalinger: ved oppstart av behandling og ved nedfrysing av blastocyst",
};

function key() {
  return randomBytes(6).toString("hex");
}

function pick(arr: I18nVal[] | undefined, lang: string): string {
  if (!Array.isArray(arr)) return "";
  const hit = arr.find((x) => x.language === lang || x._key === lang);
  return String(hit?.value ?? "").trim();
}

function i18nStr(no: string, en?: string): I18nVal[] {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en ?? no,
    },
  ];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parsePriceNok(label: string): number | undefined {
  const m = label.replace(/\s/g, "").match(/(\d[\d.]*)/);
  if (!m) return undefined;
  const n = Number(m[1].replace(/\./g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function cleanNote(name: string, note: string | undefined): string {
  if (NOTE_FIX_NO[name]) return NOTE_FIX_NO[name];
  let n = (note || "").trim();
  if (!n) return "";
  // Drop accidental embedded price tokens like "51.000,- ved"
  n = n.replace(/\b\d{1,3}(?:\.\d{3})*,-\s*/g, "").replace(/\s+/g, " ").trim();
  return n;
}

function translateNote(no: string): string {
  if (!no) return "";
  if (NOTE_EN[no]) return NOTE_EN[no];
  // Prefix/suffix tolerant match
  for (const [k, v] of Object.entries(NOTE_EN)) {
    if (normalize(k) === normalize(no)) return v;
  }
  return no;
}

function translateName(no: string, existingEn?: string): string {
  if (NAME_EN[no]) return NAME_EN[no];
  if (existingEn && normalize(existingEn) !== normalize(no)) return existingEn;
  return no;
}

type ExistingItem = {
  _key?: string;
  name?: I18nVal[];
  price?: number;
  priceLabel?: I18nVal[];
  note?: I18nVal[];
  source?: string;
  apiActivityId?: number;
};

function findExistingItem(
  pool: ExistingItem[],
  nameNo: string,
): ExistingItem | undefined {
  const target = normalize(nameNo);
  let best: { item: ExistingItem; score: number } | null = null;
  for (const item of pool) {
    const no = pick(item.name, "no");
    if (!no) continue;
    const n = normalize(no);
    let score = 0;
    if (n === target) score = 1;
    else if (n.startsWith(target) || target.startsWith(n)) score = 0.92;
    else if (n.includes(target) || target.includes(n)) score = 0.8;
    if (score >= 0.8 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item;
}

type LearnTarget =
  | { kind: "treatment"; id: string }
  | { kind: "category" }
  | { kind: "none" };

async function buildLearnMoreIndex(): Promise<Map<string, LearnTarget>> {
  const treatments = await sanityClient.fetch(`
    *[_type=="treatment" && !(_id in path("drafts.**"))]{
      _id,
      "slugNo": coalesce(slug[language=="no"][0].value.current, slug[_key=="no"][0].value.current, slug.current)
    }
  `);
  const bySlug = new Map<string, string>();
  for (const t of treatments as Array<{ _id: string; slugNo?: string }>) {
    if (t.slugNo) bySlug.set(t.slugNo, t._id);
  }
  // Reference uses æ spelling for nutrition slug
  if (!bySlug.has("ernaeringsfysiolog") && bySlug.has("ernaringsfysiolog")) {
    bySlug.set("ernaeringsfysiolog", bySlug.get("ernaringsfysiolog")!);
  }

  const map = new Map<string, LearnTarget>();
  const add = (href: string, target: LearnTarget) => map.set(href, target);

  // Will be filled from scrape hrefs below in main via this helper
  const resolve = (href: string): LearnTarget => {
    const clean = href.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "");
    const parts = clean.split("/").filter(Boolean);
    if (parts[0] === "behandlinger" && parts.length >= 3) {
      const slug = parts[parts.length - 1];
      const id = bySlug.get(slug);
      return id ? { kind: "treatment", id } : { kind: "none" };
    }
    if (parts[0] === "behandlinger" && parts.length === 2) {
      return { kind: "category" };
    }
    if (parts.length === 1) {
      return { kind: "category" };
    }
    return { kind: "none" };
  };

  // expose resolve via map sentinel — return wrapper
  (map as any).__resolve = resolve;
  return map;
}

async function main() {
  console.log("\nSanity Pricing Reference Parity Sync");
  console.log("Project ID:", PROJECT_ID);
  console.log("Dataset:", DATASET);

  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("Refusing to sync outside project 9jhqpk3a / developer.");
  }

  const root = path.join(process.cwd(), "..");
  const refPath = path.join(root, "tmp", "priser-ref-v2.json");
  const ref = JSON.parse(fs.readFileSync(refPath, "utf8")) as {
    sections: RefSection[];
  };

  const page = await sanityClient.fetch<any>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]`,
  );
  if (!page?._id) throw new Error("No published pricingPage found.");

  const learnIndex = await buildLearnMoreIndex();
  const resolveLearn = (learnIndex as any).__resolve as (href: string) => LearnTarget;

  // Flatten existing items for identity preservation
  const existingByCat = new Map<string, ExistingItem[]>();
  for (const cat of page.priceCategories || []) {
    const catName = pick(cat.categoryName, "no");
    const items: ExistingItem[] = [];
    for (const sub of cat.subcategories || []) {
      for (const item of sub.items || []) items.push(item);
    }
    for (const item of cat.items || []) items.push(item);
    existingByCat.set(catName, items);
  }

  let metodika = 0;
  let sanityOnly = 0;
  let learnTreatment = 0;
  let learnCategory = 0;
  let totalLines = 0;
  const added: string[] = [];

  const priceCategories = ref.sections
    .filter((s) => s.label && !SKIP_SECTION.test(s.label) && (s.subcategories || []).length)
    .map((section) => {
      const meta = CATEGORY_META[section.label];
      if (!meta) {
        console.warn("Unknown category, skipping:", section.label);
        return null;
      }
      const existingItems = existingByCat.get(section.label) || [];
      const usedKeys = new Set<string>();

      const subcategories = (section.subcategories || []).map((sub) => {
        const learn = sub.learnMoreHref
          ? resolveLearn(sub.learnMoreHref)
          : { kind: "none" as const };
        if (learn.kind === "treatment") learnTreatment++;
        if (learn.kind === "category") learnCategory++;

        const items = (sub.items || []).map((item) => {
          const nameNo = item.name.trim();
          const noteNo = cleanNote(nameNo, item.note);
          const prev = findExistingItem(
            existingItems.filter((e) => !usedKeys.has(e._key || "")),
            nameNo,
          );
          if (prev?._key) usedKeys.add(prev._key);

          const prevSource = prev?.source === "metodika" ? "metodika" : "sanity";
          const prevId =
            typeof prev?.apiActivityId === "number" && prev.apiActivityId > 0
              ? prev.apiActivityId
              : undefined;

          // Never invent Metodika IDs. Keep prior metodika identity when matched.
          const source = prevSource === "metodika" && prevId ? "metodika" : "sanity";
          const apiActivityId = source === "metodika" ? prevId : undefined;

          if (source === "metodika") metodika++;
          else sanityOnly++;
          totalLines++;

          if (!prev) added.push(`${section.label} / ${nameNo}`);

          const priceLabel = item.price?.trim() || "";
          const priceNum = parsePriceNok(priceLabel);
          const prevEn = pick(prev?.name, "en");
          const prevNoteNo = pick(prev?.note, "no");
          const prevNoteEn = pick(prev?.note, "en");
          const noteEn = noteNo
            ? NOTE_EN[noteNo] ||
              (prevNoteNo &&
              normalize(prevNoteNo) === normalize(noteNo) &&
              prevNoteEn &&
              normalize(prevNoteEn) !== normalize(noteNo)
                ? prevNoteEn
                : translateNote(noteNo))
            : "";

          return {
            _type: "object",
            _key: prev?._key || key(),
            name: i18nStr(nameNo, translateName(nameNo, prevEn)),
            ...(priceNum != null ? { price: priceNum } : {}),
            priceLabel: i18nStr(priceLabel, priceLabel),
            ...(noteNo ? { note: i18nStr(noteNo, noteEn) } : {}),
            source,
            ...(apiActivityId != null ? { apiActivityId } : {}),
          };
        });

        return {
          _type: "object",
          _key: key(),
          label: i18nStr(sub.label, SUB_EN[sub.label] || sub.label),
          ...(learn.kind === "treatment"
            ? {
                treatment: {
                  _type: "reference",
                  _ref: learn.id,
                },
                linkToCategoryPage: false,
              }
            : learn.kind === "category"
              ? { linkToCategoryPage: true }
              : { linkToCategoryPage: false }),
          items,
        };
      });

      return {
        _type: "object",
        _key: key(),
        categoryName: i18nStr(section.label, meta.en),
        bookingCategorySlug: meta.bookingCategorySlug,
        ...(meta.treatmentCategoryId
          ? {
              category: {
                _type: "reference",
                _ref: meta.treatmentCategoryId,
              },
            }
          : {}),
        subcategories,
        items: [],
      };
    })
    .filter(Boolean);

  await sanityClient
    .patch(page._id)
    .set({ priceCategories })
    .commit({ autoGenerateArrayKeys: false });

  console.log(
    JSON.stringify(
      {
        documentId: page._id,
        categories: priceCategories.length,
        totalLines,
        metodika,
        sanityOnly,
        learnTreatment,
        learnCategory,
        addedCount: added.length,
        addedSample: added.slice(0, 20),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
