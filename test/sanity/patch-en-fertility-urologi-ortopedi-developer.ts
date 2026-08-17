#!/usr/bin/env npx tsx
/**
 * Developer-only: Populate English (en) i18n slots for fertility, urologi, ortopedi
 * treatment pages from production EN where available, with curated fallbacks.
 *
 * Leaves Norwegian (no) untouched. Content remains Sanity-managed.
 *
 *   cd test && npx tsx sanity/patch-en-fertility-urologi-ortopedi-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-en-fertility-urologi-ortopedi-developer.ts
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1";

const CAT_IDS = [
  "category-fertilitet",
  "category-urologi",
  "category-ortopedi",
] as const;

const SHARED: Record<string, string> = {
  "Relaterte tjenester": "Related services",
  "Se alle fertilitet-tjenester": "See all fertility services",
  "Se alle fertilitetsspesialister": "See all fertility specialists",
  "Se alle urologi-tjenester": "See all urology services",
  "Se alle urologer": "See all urologists",
  "Se alle ortopedi-tjenester": "See all orthopedics services",
  "Se alle ortopeder": "See all orthopedic specialists",
  "Tilpasset dine behov": "Tailored to your needs",
  "Du bestemmer hva du er komfortabel med":
    "You decide what you are comfortable with",
  "Erfarne spesialister": "Experienced specialists",
  "Alt under samme tak": "Everything under one roof",
  "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.":
    "All examinations and procedures are tailored to your needs and wishes. You can stop at any time, ask questions along the way, and bring someone with you if you want.",
  "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.":
    "With us you meet doctors who have specialised in their field — not a generalist on rotation. You get the right expertise from the first consultation.",
  "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.":
    "If you need further assessment, treatment or follow-up — we coordinate the entire pathway for you.",
  "Kort ventetid": "Short waiting time",
  "Ingen henvisning": "No referral needed",
  "Se ledige tider og book": "See available times and book",
  "Ring oss": "Call us",
  "Bestill time hos spesialist": "Book an appointment with a specialist",
  "Bestill time nå": "Book an appointment now",
  "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.":
    "Choose service, clinic and clinician – all in one simple booking.",
  "Spesialister som utfører dette": "Specialists who perform this",
  "Snakk med en av våre spesialister": "Talk to one of our specialists",
  "Snakk med en av våre urologer": "Talk to one of our urologists",
  "Snakk med en av våre ortopeder": "Talk to one of our orthopedic specialists",
  "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.":
    "Experience, specialist expertise and modern technology gathered in one place.",
  "Vi har avtale med de største forsikringsselskapene i Norge.":
    "We have agreements with the largest insurance companies in Norway.",
  "fra 1 800 kr": "from NOK 1,800",
  "fra 1 900 kr": "from NOK 1,900",
  "time fra 2 850 kr": "appointment from NOK 2,850",
  "Konsultasjon urolog": "Urologist consultation",
  "Konsultasjon ortoped skulder": "Orthopedic shoulder consultation",
  "Konsultasjon ortoped kne": "Orthopedic knee consultation",
  "Konsultasjon ortoped hofte": "Orthopedic hip consultation",
  "Konsultasjon ortoped hånd": "Orthopedic hand consultation",
  "Konsultasjon ortoped fot/ankel": "Orthopedic foot/ankle consultation",
};

/** Page titles and short labels that must be English on /en */
const TITLE_EN: Record<string, string> = {
  // Fertility
  "Assistert befruktning": "Assisted reproduction",
  "Assistert befruktning for par og single":
    "Assisted reproduction for couples and individuals",
  Donorbehandling: "Donor treatment",
  Eggfrys: "Egg freezing",
  Fertilitetsutredning: "Fertility assessment",
  Hysteroskopi: "Hysteroscopy",
  Infertilitet: "Infertility",
  IVF: "IVF",
  "Mann og kvinne i parforhold": "Man and woman in a relationship",
  Sædanlyse: "Semen analysis",
  "Sædanlyse": "Semen analysis",
  "Singel kvinne": "Single woman",
  "Singel mann": "Single man",
  "To kvinner i parforhold": "Two women in a relationship",
  Teamet: "The team",
  // Urology
  "Blære og urinveier": "Bladder and urinary tract",
  Forhud: "Foreskin",
  Nyrer: "Kidneys",
  Prostata: "Prostate",
  Refertilisering: "Reversal of sterilisation",
  Robotkirurgi: "Robot-assisted surgery",
  Sterilisering: "Sterilisation",
  Testikler: "Testicles",
  // Orthopedics
  Skulder: "Shoulder",
  Kne: "Knee",
  Hofte: "Hip",
  "Hånd og albue": "Hand and elbow",
  "Fot og ankel": "Foot and ankle",
};

const REASONS_TITLE_EN: Record<string, string> = {
  "Om ivf": "About IVF",
  "Om IVF": "About IVF",
  "Om eggfrys": "About egg freezing",
  "Om fertilitetsutredning": "About fertility assessment",
  "Om hysteroskopi": "About hysteroscopy",
  "Om infertilitet": "About infertility",
  "Om donorbehandling": "About donor treatment",
  "Om sædanlyse": "About semen analysis",
  "Om assistert befruktning": "About assisted reproduction",
  "Om assistert befruktning for par og single":
    "About assisted reproduction for couples and individuals",
  "Om mann og kvinne i parforhold": "About treatment for couples",
  "Om singel kvinne": "About treatment for single women",
  "Om singel mann": "About treatment for single men",
  "Om to kvinner i parforhold": "About treatment for female couples",
  "Om blære og urinveier": "About bladder and urinary tract",
  "Om forhud": "About foreskin",
  "Om infertilitet": "About infertility",
  "Om nyrer": "About kidneys",
  "Om prostata": "About prostate",
  "Om refertilisering": "About reversal of sterilisation",
  "Om robotkirurgi": "About robot-assisted surgery",
  "Om sterilisering": "About sterilisation",
  "Om testikler": "About testicles",
  "Om skulder": "About shoulder",
  "Om kne": "About knee",
  "Om hofte": "About hip",
  "Om hånd og albue": "About hand and elbow",
  "Om fot og ankel": "About foot and ankle",
};

type I18nRow = { _key?: string; _type?: string; language?: string; value?: unknown };

function pick(rows: I18nRow[] | null | undefined, lang: "no" | "en"): string {
  if (!Array.isArray(rows)) return "";
  const hit =
    rows.find((r) => r.language === lang || r._key === lang) || rows[0];
  const v = hit?.value;
  return typeof v === "string" ? v : "";
}

function setEn(rows: I18nRow[] | null | undefined, en: string, asText: boolean): I18nRow[] {
  const type = asText
    ? "internationalizedArrayTextValue"
    : "internationalizedArrayStringValue";
  const current = Array.isArray(rows) ? [...rows] : [];
  const noVal = pick(current, "no");
  const next: I18nRow[] = [];
  const noRow = current.find((r) => r.language === "no" || r._key === "no");
  next.push({
    _key: "no",
    _type: (noRow?._type as string) || type,
    language: "no",
    value: noVal || pick(current, "en") || "",
  });
  next.push({
    _key: "en",
    _type: type,
    language: "en",
    value: en,
  });
  return next;
}

function looksNorwegian(text: string): boolean {
  if (!text) return false;
  if (/[æøåÆØÅ]/.test(text)) return true;
  // Distinctive Norwegian tokens (avoid English overlap like "for"/"en")
  return /\b(og|eller|hos|våre|ikke|uten|ingen|henvisning|ventetid|behandling|utredning|spesialister|kirurgi|pasient|pasientene|lege|legen|undersøkelse|inngrep|tilstand|tilstander|symptomer|operasjon|oppfølging|klinikk|tjenester|bestill|snakk|relaterte|tilpasset|erfarne|underlivet|skulder|kne|hofte|hånd|albue|nyrer|blære|prostata|forhud|sædanlyse|eggfrys|befruktning|infertilitet)\b/i.test(
    text,
  );
}

function translateSimple(no: string): string | null {
  if (!no) return null;
  if (SHARED[no]) return SHARED[no];
  if (TITLE_EN[no]) return TITLE_EN[no];
  if (REASONS_TITLE_EN[no]) return REASONS_TITLE_EN[no];
  // "Om X" pattern
  const om = no.match(/^Om\s+(.+)$/i);
  if (om) {
    const rest = om[1];
    const titled = TITLE_EN[rest] || TITLE_EN[rest.charAt(0).toUpperCase() + rest.slice(1)];
    if (titled) return `About ${titled.charAt(0).toLowerCase()}${titled.slice(1)}`;
  }
  if (no.startsWith("Se alle ") && no.endsWith("-tjenester")) {
    const key = no.slice("Se alle ".length, -"-tjenester".length);
    const map: Record<string, string> = {
      fertilitet: "fertility",
      urologi: "urology",
      ortopedi: "orthopedics",
    };
    return `See all ${map[key] || key} services`;
  }
  if (no.endsWith(" hos CMedical")) {
    const base = no.replace(/ hos CMedical$/, "");
    return `${TITLE_EN[base] || base} at CMedical`;
  }
  return null;
}

function productionClient() {
  return createClient({
    projectId: PROJECT_ID,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_TOKEN,
  });
}

const PROJECTION = `{
  _id,
  title,
  description,
  heroTitle,
  heroDescription,
  heroPrice,
  heroPriceLabel,
  heroImageAlt,
  primaryCtaLabel,
  callCtaLabel,
  reasonsTitle,
  reasonsLead,
  reasonsLead2,
  conversationCtaTitle,
  ctaTitle,
  ctaDescription,
  srOnlyTitle,
  specialistTitle,
  specialistDescription,
  specialistCtaLabel,
  reasons[]{_key, n, title, desc},
  promises[]{_key, title, desc, eyebrow, image},
  heroPoints[]{_key, title},
  relatedSection{
    title, lead, seeAllLabel, seeAllHref, eyebrow,
    items
  },
  pageSections[]{
    _key, _type, title, description, seeAllLabel, primaryCtaLabel, subtitle
  }
}`;

function resolveEn(
  no: string,
  prodEn: string,
  forceShared = false,
): string {
  if (!no) return prodEn || "";
  const shared = translateSimple(no);
  if (shared) return shared;
  if (prodEn && !looksNorwegian(prodEn) && prodEn !== no) return prodEn;
  if (forceShared && SHARED[no]) return SHARED[no];
  // Prefer production EN even if equal for Latin titles (IVF)
  if (prodEn && !looksNorwegian(prodEn)) return prodEn;
  return "";
}

function patchI18nField(
  local: I18nRow[] | null | undefined,
  prod: I18nRow[] | null | undefined,
  asText: boolean,
): I18nRow[] | null {
  const no = pick(local, "no") || pick(prod, "no");
  if (!no && !pick(local, "en") && !pick(prod, "en")) return null;
  const currentEn = pick(local, "en");
  const prodEn = pick(prod, "en");
  let en = resolveEn(no, prodEn);
  if (!en) {
    // Keep existing EN if already English
    if (currentEn && !looksNorwegian(currentEn) && currentEn !== no) en = currentEn;
  }
  if (!en) {
    // Last resort: keep prod EN even if Norwegian-looking, else leave NO text flagged
    en = prodEn || currentEn || no;
  }
  // If still Norwegian and we have a shared translation attempt on shortened forms
  if (looksNorwegian(en) && en === no) {
    const simple = translateSimple(no);
    if (simple) en = simple;
  }
  return setEn(local ?? prod ?? [], en, asText);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Unexpected project ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Developer only, got ${DATASET}`);
  }

  const prod = productionClient();
  console.log(`DRY_RUN=${DRY_RUN} dataset=${DATASET}`);

  const localDocs = await sanityClient.fetch<Array<Record<string, any>>>(
    `*[_type=="treatment" && !(_id in path("drafts.**")) && (
      references($c0) || references($c1) || references($c2)
    )] ${PROJECTION}`,
    { c0: CAT_IDS[0], c1: CAT_IDS[1], c2: CAT_IDS[2] },
  );

  const ids = localDocs.map((d) => d._id);
  const prodDocs = await prod.fetch<Array<Record<string, any>>>(
    `*[_id in $ids] ${PROJECTION}`,
    { ids },
  );
  const prodById = new Map(prodDocs.map((d) => [d._id, d]));

  let patched = 0;
  for (const local of localDocs) {
    const remote = prodById.get(local._id) || {};
    const next: Record<string, unknown> = {};

    const stringFields = [
      "title",
      "heroTitle",
      "heroPrice",
      "heroPriceLabel",
      "heroImageAlt",
      "primaryCtaLabel",
      "callCtaLabel",
      "reasonsTitle",
      "conversationCtaTitle",
      "ctaTitle",
      "srOnlyTitle",
      "specialistTitle",
      "specialistCtaLabel",
    ] as const;

    const textFields = [
      "description",
      "heroDescription",
      "reasonsLead",
      "reasonsLead2",
      "ctaDescription",
      "specialistDescription",
    ] as const;

    for (const f of stringFields) {
      const patchedField = patchI18nField(local[f], remote[f], false);
      if (patchedField) next[f] = patchedField;
    }
    for (const f of textFields) {
      const patchedField = patchI18nField(local[f], remote[f], true);
      if (patchedField) next[f] = patchedField;
    }

    // Hero: prefer patient-facing lead. If EN hero is chip text, use description EN.
    const heroEn = pick(next.heroDescription as I18nRow[], "en");
    const descEn = pick(next.description as I18nRow[], "en");
    if (
      heroEn &&
      descEn &&
      (/waiting time|referral|ventetid|henvisning/i.test(heroEn) ||
        heroEn.length < 40) &&
      descEn.length > heroEn.length
    ) {
      next.heroDescription = setEn(
        next.heroDescription as I18nRow[],
        descEn,
        true,
      );
    }

    // Reasons rows
    if (Array.isArray(local.reasons)) {
      next.reasons = local.reasons.map((row: any, i: number) => {
        const prodRow = remote.reasons?.[i] || {};
        return {
          ...row,
          n: patchI18nField(row.n, prodRow.n, false) || row.n,
          title: patchI18nField(row.title, prodRow.title, false) || row.title,
          desc: patchI18nField(row.desc, prodRow.desc, true) || row.desc,
        };
      });
    }

    // Promises
    if (Array.isArray(local.promises)) {
      next.promises = local.promises.map((row: any, i: number) => {
        const prodRow = remote.promises?.[i] || {};
        return {
          ...row,
          title: patchI18nField(row.title, prodRow.title, false) || row.title,
          desc: patchI18nField(row.desc, prodRow.desc, true) || row.desc,
          eyebrow:
            patchI18nField(row.eyebrow, prodRow.eyebrow, false) || row.eyebrow,
        };
      });
    }

    // Hero points
    if (Array.isArray(local.heroPoints)) {
      next.heroPoints = local.heroPoints.map((row: any, i: number) => {
        const prodRow = remote.heroPoints?.[i] || {};
        return {
          ...row,
          title: patchI18nField(row.title, prodRow.title, false) || row.title,
        };
      });
    }

    // Related section
    if (local.relatedSection) {
      const rs = local.relatedSection;
      const prs = remote.relatedSection || {};
      next.relatedSection = {
        ...rs,
        title: patchI18nField(rs.title, prs.title, false) || rs.title,
        lead: patchI18nField(rs.lead, prs.lead, true) || rs.lead,
        seeAllLabel:
          patchI18nField(rs.seeAllLabel, prs.seeAllLabel, false) ||
          rs.seeAllLabel,
        eyebrow: patchI18nField(rs.eyebrow, prs.eyebrow, false) || rs.eyebrow,
      };
    }

    // Page sections
    if (Array.isArray(local.pageSections)) {
      next.pageSections = local.pageSections.map((sec: any) => {
        const prodSec =
          (remote.pageSections || []).find(
            (s: any) => s._type === sec._type && s._key === sec._key,
          ) ||
          (remote.pageSections || []).find((s: any) => s._type === sec._type) ||
          {};
        return {
          ...sec,
          title: patchI18nField(sec.title, prodSec.title, false) || sec.title,
          description:
            patchI18nField(sec.description, prodSec.description, true) ||
            sec.description,
          seeAllLabel:
            patchI18nField(sec.seeAllLabel, prodSec.seeAllLabel, false) ||
            sec.seeAllLabel,
          primaryCtaLabel:
            patchI18nField(sec.primaryCtaLabel, prodSec.primaryCtaLabel, false) ||
            sec.primaryCtaLabel,
          subtitle:
            patchI18nField(sec.subtitle, prodSec.subtitle, false) ||
            sec.subtitle,
        };
      });
    }

    console.log(`→ ${local._id}`);
    if (!DRY_RUN) {
      await sanityClient.patch(local._id).set(next).commit({
        autoGenerateArrayKeys: true,
      });
      const draftId = `drafts.${local._id}`;
      const draft = await sanityClient.fetch<string | null>(
        `*[_id==$id][0]._id`,
        { id: draftId },
      );
      if (draft) await sanityClient.delete(draftId);
    }
    patched += 1;
  }

  console.log(`\n✓ Patched EN on ${patched} treatments (developer)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
