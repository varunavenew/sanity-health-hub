import { sanityClient } from "./config";

const CATEGORY_NUMERIC_IDS: Record<string, number> = {
  gynekologi: 8,
  fertilitet: 1,
  urologi: 6,
  ortopedi: 17,
  graviditet: 10,
  "flere-fagomrader": 23,
};

type CategoryDoc = {
  _id: string;
  title?: string;
  categoryId?: string;
  categoryNumericId?: number;
};

async function run() {
  const docs = await sanityClient.fetch<CategoryDoc[]>(
    `*[_type == "treatmentCategory"]{_id, title, categoryId, categoryNumericId}`,
  );

  if (!docs.length) {
    console.log("No treatmentCategory documents found.");
    return;
  }

  let updated = 0;
  for (const doc of docs) {
    const key = (doc.categoryId || "").trim();
    const target = CATEGORY_NUMERIC_IDS[key];
    if (!target) {
      console.log(`Skipping ${doc._id} (${doc.title || "untitled"}) — unknown categoryId "${key}"`);
      continue;
    }

    if (doc.categoryNumericId === target) {
      console.log(`OK ${doc._id} (${key}) already set to ${target}`);
      continue;
    }

    await sanityClient.patch(doc._id).set({ categoryNumericId: target }).commit();
    updated += 1;
    console.log(`Updated ${doc._id} (${key}) => categoryNumericId=${target}`);
  }

  console.log(`Done. Updated ${updated} document(s).`);
}

run().catch((err) => {
  console.error("Failed to set category numeric IDs:", err);
  process.exit(1);
});

