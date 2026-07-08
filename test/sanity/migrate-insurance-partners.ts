import { sanityClient } from "./config";

const i18n = (no: string, en: string) => [
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

const DEFAULT_PARTNERS = [
  ["gjensidige", "Gjensidige"],
  ["if", "If"],
  ["fremtind", "Fremtind"],
  ["storebrand", "Storebrand"],
  ["tryg", "Tryg"],
  ["vertikal", "Vertikal"],
  ["codan", "Codan"],
  ["eika", "Eika"],
].map(([key, label]) => ({
  _key: key,
  key,
  label: i18n(label, label),
}));

async function main() {
  console.log("🏥 Fetching all treatments...");
  const treatments = await sanityClient.fetch<{ _id: string; insurancePartners?: any; insuranceEyebrow?: any; insuranceTitle?: any }[]>(
    `*[_type == "treatment"]{
      _id,
      insurancePartners,
      insuranceEyebrow,
      insuranceTitle
    }`
  );

  console.log(`   Found ${treatments.length} treatments.`);

  let patched = 0;
  const transaction = sanityClient.transaction();

  for (const doc of treatments) {
    const patch: Record<string, any> = {};

    // Seed insurancePartners if missing, null, or empty array
    if (!doc.insurancePartners || (Array.isArray(doc.insurancePartners) && doc.insurancePartners.length === 0)) {
      patch.insurancePartners = DEFAULT_PARTNERS;
    }

    // Seed insuranceEyebrow if missing
    if (!doc.insuranceEyebrow || (Array.isArray(doc.insuranceEyebrow) && doc.insuranceEyebrow.length === 0)) {
      patch.insuranceEyebrow = i18n("Forsikringspartnere", "Insurance partners");
    }

    // Seed insuranceTitle if missing
    if (!doc.insuranceTitle || (Array.isArray(doc.insuranceTitle) && doc.insuranceTitle.length === 0)) {
      patch.insuranceTitle = i18n("Vi samarbeider med de største forsikringsselskapene", "We work with the leading insurance providers");
    }

    if (Object.keys(patch).length > 0) {
      transaction.patch(doc._id, { set: patch });
      patched++;
    }
  }

  if (patched > 0) {
    console.log(`🚀 Committing transaction for ${patched} documents...`);
    await transaction.commit();
    console.log("✅ Successfully migrated insurance partners.");
  } else {
    console.log("✅ All documents are already up-to-date.");
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
