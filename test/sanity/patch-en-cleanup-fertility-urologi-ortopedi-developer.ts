/**
 * Follow-up: clean EN HTML entities + fix remaining Norwegian EN slots
 * for fertility / urologi / ortopedi on developer.
 *
 *   cd test && npx tsx sanity/patch-en-cleanup-fertility-urologi-ortopedi-developer.ts
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1";

type I18nRow = { _key?: string; _type?: string; language?: string; value?: unknown };

const TITLE_FIX: Record<string, string> = {
  "En emosjonell prosess": "An emotional process",
  "Rådgivning: Fertilitetsbehandling og parforholdet":
    "Counselling: Fertility treatment and the relationship",
  "Inseminasjon (AIH)": "Insemination (AIH)",
  "IVF - In Vitro Fertilisering": "IVF – in vitro fertilisation",
  "ICSI - Intracytoplasmatisk spermieinjeksjon":
    "ICSI – intracytoplasmic sperm injection",
  Donorsæd: "Donor sperm",
  Partnerdonasjon: "Partner donation",
  "Enkel sædprøve": "Basic semen analysis",
  Behandling: "Treatment",
  "Før og etter inngrepet": "Before and after the procedure",
  "Singel mann": "Single man",
  "Singel kvinne": "Single woman",
  "Mann og kvinne i parforhold": "Man and woman in a relationship",
  "To kvinner i parforhold": "Two women in a relationship",
  "Hvem kan få hjelp hos oss?": "Who can get help with us?",
  "Når skal du begynne å sjekke prostata?":
    "When should you start checking your prostate?",
};

const MID_FIX: Record<string, string> = {
  "Snakk med en av våre fertilitetsspesialister":
    "Talk to one of our fertility specialists",
  "Snakk med en av våre spesialister": "Talk to one of our specialists",
  "Snakk med en av våre urologer": "Talk to one of our urologists",
  "Snakk med en av våre ortopeder": "Talk to one of our orthopedic specialists",
};

/** EN body text keyed by Norwegian reason title (when production EN is missing). */
const DESC_BY_NO_TITLE: Record<string, string> = {
  "En emosjonell prosess":
    "Fertility treatment is not only medical — it is also a personal and emotional journey. Many experience a range of feelings along the way: hope, uncertainty, vulnerability and expectation. We take the whole person seriously and offer support throughout.",
  "Rådgivning: Fertilitetsbehandling og parforholdet":
    "A long period of trying to conceive can affect both intimacy and sexuality in a relationship. Many describe the process as an emotional roller coaster. Counselling — alone or together — can strengthen communication and help you cope during and after treatment.",
  "Inseminasjon (AIH)":
    "Insemination is a treatment where prepared sperm is injected directly into the uterine cavity. Insemination with donor sperm is often the first choice for single women or couples who need donor sperm.",
  "IVF - In Vitro Fertilisering":
    "In vitro fertilisation means fertilisation outside the body, often called IVF or “test-tube” treatment. In practice, mature eggs are retrieved in a minor procedure under local anaesthesia, fertilised in the laboratory, and an embryo is transferred to the uterus.",
  "ICSI - Intracytoplasmatisk spermieinjeksjon":
    "ICSI is used when sperm function is reduced. It is often called microinjection. The method is partly similar to IVF, but instead of placing egg and sperm together, a single sperm is injected directly into the egg under a microscope.",
  Donorsæd:
    "We use donor sperm from Livio Sperm Bank, Cryos and European Sperm Bank. We have good access to Norwegian donor sperm from Livio Sperm Bank.\n\nUnder Norwegian guidelines we use sperm from non-anonymous donors. The child has the right to know the donor’s identity at age 15.",
  Partnerdonasjon:
    "Partner donation became legal in Norway on 1 January 2021 and may be relevant for two women in a relationship.\n\nUnder the Biotechnology Act, one partner can donate eggs that are fertilised and transferred to the other partner.",
  "Enkel sædprøve":
    "A basic semen analysis gives a fundamental assessment of sperm quality, including count, concentration, motility and appearance. This provides important information about fertility and is often the first step in a male fertility investigation.",
  "Singel mann":
    "Would you like insight into your fertility?\nMany men contact us for a better understanding of their own fertility — out of curiosity, as part of family planning, or before a possible later treatment. We offer clear testing and guidance.",
  "Singel kvinne":
    "Do you want to have a child on your own — or preserve the option for later?\nChoosing to have a child alone is a big and important decision. Many women come to us to explore the options — whether they are ready to start now or want to plan ahead.",
  "Mann og kvinne i parforhold":
    "Have you been trying for a while — without success?\nMany couples who come to us have tried to conceive over time. For some it has been months, for others several years. Some are ready to seek help immediately; others want information first. We meet you where you are.",
  "To kvinner i parforhold":
    "More and more women choose to have children together as a couple. With us you meet a professional environment with experience, safety and understanding of your situation.\n\nWhen you contact us, we start with a conversation where we map your wishes and plan the next steps together.",
  "Hvem kan få hjelp hos oss?":
    "With us there is room for different paths toward the same goal — having a child. Assisted reproduction can be used by a man and a woman in a relationship, two women in a relationship, and women who wish to become mothers on their own.",
  "Når skal du begynne å sjekke prostata?":
    "“I recommend that all men in their 50s take a PSA test every year. Men under 50 who belong to a risk group should also have their prostate checked regularly,” says Dr Jørgensen.\n\nRisk groups include men with a close relative who has had prostate cancer.",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#10;/g, "\n")
    .replace(/&#13;/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function looksNo(text: string): boolean {
  if (!text) return false;
  if (/[æøåÆØÅ]/.test(text)) return true;
  return /\b(og|eller|hos|våre|ikke|uten|ingen|henvisning|ventetid|behandling|utredning|befruktning|sædanlyse|eggfrys|undersøkelse|inngrep|symptomer|operasjon|oppfølging|tjenester|bestill|snakk|relaterte|tilpasset|erfarne|ønsker|mange|kvinner|menn|parene|livmorhulen|prøverørsbehandling|donorsæd|sædprøve|emosjonell|rådgivning|parforholdet)\b/i.test(
    text,
  );
}

function translateDesc(noTitle: string, noDesc: string, enDesc: string): string {
  if (enDesc && !looksNo(enDesc) && enDesc !== noDesc) return decodeEntities(enDesc);
  if (DESC_BY_NO_TITLE[noTitle]) return DESC_BY_NO_TITLE[noTitle];
  return decodeEntities(enDesc || noDesc);
}

function pick(rows: I18nRow[] | null | undefined, lang: "no" | "en"): string {
  if (!Array.isArray(rows)) return "";
  const hit = rows.find((r) => r.language === lang || r._key === lang) || rows[0];
  return typeof hit?.value === "string" ? hit.value : "";
}

function setEn(rows: I18nRow[], en: string, asText: boolean): I18nRow[] {
  const type = asText
    ? "internationalizedArrayTextValue"
    : "internationalizedArrayStringValue";
  const no = pick(rows, "no");
  return [
    {
      _key: "no",
      _type: type,
      language: "no",
      value: no || pick(rows, "en") || "",
    },
    { _key: "en", _type: type, language: "en", value: en },
  ];
}

function cleanI18n(rows: I18nRow[] | null | undefined, asText: boolean): I18nRow[] | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  let en = pick(rows, "en");
  const no = pick(rows, "no");
  if (!en && !no) return null;
  if (en) en = decodeEntities(en);
  if (MID_FIX[en]) en = MID_FIX[en];
  if (TITLE_FIX[en]) en = TITLE_FIX[en];
  if (TITLE_FIX[no] && (en === no || looksNo(en))) en = TITLE_FIX[no];
  // Chip hero → prefer longer description if available elsewhere (handled separately)
  return setEn(rows, en || no, asText);
}

async function main() {
  if (DATASET !== "developer") throw new Error("developer only");
  const prod = createClient({
    projectId: PROJECT_ID,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_TOKEN,
  });

  const localDocs = await sanityClient.fetch<Array<Record<string, any>>>(
    `*[_type=="treatment" && !(_id in path("drafts.**")) && (
      references("category-fertilitet") || references("category-urologi") || references("category-ortopedi")
    )]{
      _id, description, heroDescription, conversationCtaTitle, reasons,
      promises[]{_key, title, desc, eyebrow, image},
      relatedSection, pageSections,
      title, reasonsTitle, heroPriceLabel, primaryCtaLabel, callCtaLabel, heroPoints
    }`,
  );

  // NOTE: always fetch promises with image — never omit it or a later
  // .set({promises}) will wipe media.

  const ids = localDocs.map((d) => d._id);
  const prodDocs = await prod.fetch<Array<Record<string, any>>>(
    `*[_id in $ids]{ _id, reasons[]{title, desc}, conversationCtaTitle, description, heroDescription }`,
    { ids },
  );
  const prodById = new Map(prodDocs.map((d) => [d._id, d]));

  let n = 0;
  for (const doc of localDocs) {
    const remote = prodById.get(doc._id) || {};
    const next: Record<string, unknown> = {};

    for (const f of [
      "title",
      "reasonsTitle",
      "heroPriceLabel",
      "primaryCtaLabel",
      "callCtaLabel",
      "conversationCtaTitle",
    ] as const) {
      const cleaned = cleanI18n(doc[f], false);
      if (cleaned) next[f] = cleaned;
    }
    for (const f of ["description", "heroDescription"] as const) {
      const cleaned = cleanI18n(doc[f], true);
      if (cleaned) next[f] = cleaned;
    }

    // Prefer patient-facing description over chip hero on EN
    const heroEn = pick(next.heroDescription as I18nRow[], "en");
    const descEn = pick(next.description as I18nRow[], "en");
    if (
      heroEn &&
      descEn &&
      descEn.length > 60 &&
      (/waiting time|referral|ventetid|henvisning/i.test(heroEn) ||
        heroEn.length < 45)
    ) {
      next.heroDescription = setEn(
        next.heroDescription as I18nRow[],
        decodeEntities(descEn),
        true,
      );
    }

    if (Array.isArray(doc.reasons)) {
      next.reasons = doc.reasons.map((row: any) => {
        const noTitle = pick(row.title, "no");
        let title = cleanI18n(row.title, false) || row.title;
        let desc = cleanI18n(row.desc, true) || row.desc;

        // If EN title/desc still Norwegian, try production match by NO title
        const enTitle = pick(title, "en");
        const enDesc = pick(desc, "en");
        if (looksNo(enTitle) || enTitle === noTitle) {
          const prodRow = (remote.reasons || []).find(
            (r: any) => pick(r.title, "no") === noTitle || pick(r.title, "en"),
          );
          const prodTitleEn = prodRow ? pick(prodRow.title, "en") : "";
          if (prodTitleEn && !looksNo(prodTitleEn)) {
            title = setEn(row.title || [], prodTitleEn, false);
          } else if (TITLE_FIX[noTitle]) {
            title = setEn(row.title || [], TITLE_FIX[noTitle], false);
          }
        }
        if (looksNo(enDesc) || enDesc === pick(row.desc, "no")) {
          const prodRow = (remote.reasons || []).find(
            (r: any) => pick(r.title, "no") === noTitle,
          );
          const prodDescEn = prodRow ? pick(prodRow.desc, "en") : "";
          const translated = translateDesc(
            noTitle,
            pick(row.desc, "no"),
            prodDescEn || enDesc,
          );
          desc = setEn(row.desc || [], translated, true);
        }

        return { ...row, title, desc };
      });
    }

    if (Array.isArray(doc.promises)) {
      next.promises = doc.promises.map((row: any) => ({
        ...row,
        title: cleanI18n(row.title, false) || row.title,
        desc: cleanI18n(row.desc, true) || row.desc,
      }));
    }

    if (Array.isArray(doc.heroPoints)) {
      next.heroPoints = doc.heroPoints.map((row: any) => ({
        ...row,
        title: cleanI18n(row.title, false) || row.title,
      }));
    }

    if (doc.relatedSection) {
      next.relatedSection = {
        ...doc.relatedSection,
        title: cleanI18n(doc.relatedSection.title, false) || doc.relatedSection.title,
        seeAllLabel:
          cleanI18n(doc.relatedSection.seeAllLabel, false) ||
          doc.relatedSection.seeAllLabel,
        lead: cleanI18n(doc.relatedSection.lead, true) || doc.relatedSection.lead,
      };
    }

    if (Array.isArray(doc.pageSections)) {
      next.pageSections = doc.pageSections.map((sec: any) => ({
        ...sec,
        title: cleanI18n(sec.title, false) || sec.title,
        description: cleanI18n(sec.description, true) || sec.description,
        seeAllLabel: cleanI18n(sec.seeAllLabel, false) || sec.seeAllLabel,
        primaryCtaLabel:
          cleanI18n(sec.primaryCtaLabel, false) || sec.primaryCtaLabel,
      }));
    }

    console.log(`→ ${doc._id}`);
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(next).commit({
        autoGenerateArrayKeys: true,
      });
      const draftId = `drafts.${doc._id}`;
      const draft = await sanityClient.fetch(`*[_id==$id][0]._id`, {
        id: draftId,
      });
      if (draft) await sanityClient.delete(draftId);
    }
    n += 1;
  }

  console.log(`\n✓ Cleanup done on ${n} treatments`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
