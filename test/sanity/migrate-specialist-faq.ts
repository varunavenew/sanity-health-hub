/**
 * Migrate the specialist FAQ section (Shared Sections → FAQ).
 *
 * Writes, per specialist document:
 *   faqSectionTitle  internationalizedArrayString (NO + EN)  — "Ofte stilte spørsmål"
 *   faqCollection    reference → faqCollection document
 *
 * It also creates/updates the underlying content:
 *   faq             documents (question / answer)
 *   faqCollection   document grouping those faqs
 *
 * Source content = the static fallbacks used on the website today
 * (src/components/specialist/SpecialistFAQ.tsx): "Finansiering" + "Praktisk".
 *
 * Schema-defensive: the live Studio schema for `faq` / `faqCollection` is not in
 * this repo, so the script probes the dataset for an existing document of each
 * type and mirrors its shape:
 *   - i18n (internationalizedArray v5) vs plain string fields
 *   - the array field name on faqCollection (faqs | items | questions | entries)
 * Falls back to i18n + `faqs` when the dataset is empty.
 *
 * Safe to re-run: deterministic _ids + createIfNotExists/patch. Existing
 * faqCollection references on a specialist are kept unless FORCE=1.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialist-faq.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialist-faq.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-specialist-faq.ts
 */
import { sanityClient } from "./config";

const DRY = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

/* ── i18n helpers (internationalizedArray v5) ─────────────────────────── */
type I18n = { _key: string; _type: string; value: string }[];

const i18n = (no: string, en: string): I18n => [
  { _key: "no", _type: "internationalizedArrayStringValue", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
];

const i18nText = (no: string, en: string): I18n => [
  { _key: "no", _type: "internationalizedArrayTextValue", value: no },
  { _key: "en", _type: "internationalizedArrayTextValue", value: en },
];

/* ── Content ──────────────────────────────────────────────────────────── */
interface FaqSource {
  key: string;
  category: "finansiering" | "praktisk";
  sortOrder: number;
  question: { no: string; en: string };
  answer: { no: string; en: string };
}

const FAQS: FaqSource[] = [
  // ── Finansiering ───────────────────────────────────────────────────
  {
    key: "finansiering-pris",
    category: "finansiering",
    sortOrder: 1,
    question: { no: "Pris", en: "Price" },
    answer: {
      no: "Prislister finnes på vår prisside.",
      en: "Price lists are available on our pricing page.",
    },
  },
  {
    key: "finansiering-forsikring",
    category: "finansiering",
    sortOrder: 2,
    question: { no: "Forsikring", en: "Insurance" },
    answer: {
      no: "Vi har forsikringsavtale med: EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse og Vialia. Ta kontakt med legen din for henvisning. Send den til forsikringsselskapet og be om time på CMedical.",
      en: "We have insurance agreements with EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse and Vialia. Ask your doctor for a referral, send it to your insurance company and request an appointment at CMedical.",
    },
  },
  {
    key: "finansiering-nedbetaling",
    category: "finansiering",
    sortOrder: 3,
    question: { no: "Nedbetaling", en: "Instalments" },
    answer: {
      no: "Nedbetaling er tilgjengelig på utvalgte klinikker. Spør oss for mer informasjon.",
      en: "Payment by instalments is available at selected clinics. Ask us for more information.",
    },
  },
  // ── Praktisk ───────────────────────────────────────────────────────
  {
    key: "praktisk-henvisning",
    category: "praktisk",
    sortOrder: 4,
    question: { no: "Trenger jeg henvisning?", en: "Do I need a referral?" },
    answer: {
      no: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk uten refusjonsavtale med det offentlige.",
      en: "No referral is needed. We are a private health clinic without a public reimbursement agreement.",
    },
  },
  {
    key: "praktisk-ventetid",
    category: "praktisk",
    sortOrder: 5,
    question: { no: "Hvor lang er ventetiden?", en: "How long is the waiting time?" },
    answer: {
      no: "Vi har svært korte ventetider. Generelt får du hjelp innen en uke.",
      en: "We have very short waiting times. In general you will get help within a week.",
    },
  },
  {
    key: "praktisk-sykemelding",
    category: "praktisk",
    sortOrder: 6,
    question: { no: "Kan jeg få sykemelding?", en: "Can I get a sick note?" },
    answer: {
      no: "Ja, ved behov kan vi skrive ut sykmelding i henhold til nasjonale retningslinjer.",
      en: "Yes, if needed we can issue a sick note in line with national guidelines.",
    },
  },
  {
    key: "praktisk-utredning",
    category: "praktisk",
    sortOrder: 7,
    question: { no: "Hva skjer i en utredning?", en: "What happens during an assessment?" },
    answer: {
      no: "Vi anbefaler å starte med en konsultasjon. En vanlig utredning varer ca 30 minutter.",
      en: "We recommend starting with a consultation. A typical assessment lasts about 30 minutes.",
    },
  },
  {
    key: "praktisk-personvern",
    category: "praktisk",
    sortOrder: 8,
    question: { no: "Personvernerklæring", en: "Privacy policy" },
    answer: {
      no: "Her finner du vår personvernerklæring: /personvern. Se også CMedicals aktsomhetsvurdering: /aapenhetsloven-2025.",
      en: "You can find our privacy policy at /personvern. See also CMedical's due diligence assessment at /aapenhetsloven-2025.",
    },
  },
];

const COLLECTION_ID = "faqCollection-spesialist-generell";
const COLLECTION_TITLE = {
  no: "Spesialist – praktisk informasjon",
  en: "Specialist – practical information",
};

const SECTION_TITLE = { no: "Ofte stilte spørsmål", en: "Frequently asked questions" };

/* ── Shape detection ──────────────────────────────────────────────────── */
async function detectShape() {
  const [faqSample, collectionSample] = await Promise.all([
    sanityClient.fetch<any>(`*[_type == "faq"][0]`),
    sanityClient.fetch<any>(`*[_type == "faqCollection"][0]`),
  ]);

  const faqI18n = faqSample ? Array.isArray(faqSample.question) : true;

  let itemsField = "faqs";
  let collectionI18n = true;
  if (collectionSample) {
    const candidates = ["faqs", "items", "questions", "entries"];
    itemsField =
      candidates.find((f) => Array.isArray(collectionSample[f])) || "faqs";
    if (collectionSample.title !== undefined) {
      collectionI18n = Array.isArray(collectionSample.title);
    }
  }

  return { faqI18n, itemsField, collectionI18n, collectionSample, faqSample };
}

/* ── Main ─────────────────────────────────────────────────────────────── */
async function run() {
  const shape = await detectShape();
  console.log(
    `🔎 Detected shape → faq i18n: ${shape.faqI18n}, faqCollection items field: "${shape.itemsField}", collection title i18n: ${shape.collectionI18n}`,
  );
  if (!shape.faqSample) console.log("   (no existing faq doc — using i18n defaults)");
  if (!shape.collectionSample)
    console.log("   (no existing faqCollection doc — using i18n defaults)");

  const tx = sanityClient.transaction();

  // 1. FAQ documents
  const faqIds: string[] = [];
  for (const faq of FAQS) {
    const _id = `faq-${faq.key}`;
    faqIds.push(_id);

    const doc: Record<string, unknown> = {
      _id,
      _type: "faq",
      category: faq.category,
      sortOrder: faq.sortOrder,
      question: shape.faqI18n ? i18n(faq.question.no, faq.question.en) : faq.question.no,
      answer: shape.faqI18n ? i18nText(faq.answer.no, faq.answer.en) : faq.answer.no,
    };

    if (DRY) {
      console.log("faq →", JSON.stringify(doc, null, 2));
    } else {
      tx.createOrReplace(doc as any);
    }
  }

  // 2. FAQ collection
  const collection: Record<string, unknown> = {
    _id: COLLECTION_ID,
    _type: "faqCollection",
    title: shape.collectionI18n
      ? i18n(COLLECTION_TITLE.no, COLLECTION_TITLE.en)
      : COLLECTION_TITLE.no,
    [shape.itemsField]: faqIds.map((id) => ({
      _key: id,
      _type: "reference",
      _ref: id,
    })),
  };

  if (DRY) {
    console.log("faqCollection →", JSON.stringify(collection, null, 2));
  } else {
    tx.createOrReplace(collection as any);
  }

  // 3. Link every specialist
  const specialists = await sanityClient.fetch<
    { _id: string; name: string; faqCollection?: { _ref?: string }; faqSectionTitle?: unknown }[]
  >(`*[_type == "specialist"]{_id, name, faqCollection, faqSectionTitle}`);

  let linked = 0;
  let skipped = 0;
  for (const s of specialists) {
    const set: Record<string, unknown> = {};

    if (FORCE || !s.faqCollection?._ref) {
      set.faqCollection = { _type: "reference", _ref: COLLECTION_ID };
    }
    const hasTitle = Array.isArray(s.faqSectionTitle) && s.faqSectionTitle.length > 0;
    if (FORCE || !hasTitle) {
      set.faqSectionTitle = i18n(SECTION_TITLE.no, SECTION_TITLE.en);
    }

    if (Object.keys(set).length === 0) {
      skipped++;
      continue;
    }
    linked++;

    if (DRY) {
      console.log(`specialist ${s.name} (${s._id}) →`, JSON.stringify(set));
    } else {
      tx.patch(s._id, (p) => p.set(set));
    }
  }

  console.log(
    `📄 ${FAQS.length} FAQs · 1 collection · ${linked} specialists to update (${skipped} already set)`,
  );

  if (DRY) {
    console.log("🧪 Dry run — nothing written.");
    return;
  }

  await tx.commit();
  console.log("✅ Specialist FAQ section migrated.");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
