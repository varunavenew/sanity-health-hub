/**
 * Developer-only: set googleReview.date from seed relative labels
 * so FE relative formatting matches intended copy (e.g. "7 måneder siden").
 *
 *   cd test && npx tsx sanity/patch-google-review-dates-from-seed-developer.ts
 */
import { googleReviews } from "../../src/data/googleReviews";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

function monthsAgoIso(months: number, from = new Date()): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

function weeksAgoIso(weeks: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - weeks * 7);
  return d.toISOString().slice(0, 10);
}

function daysAgoIso(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Parse Norwegian relative seed label → ISO date. */
function seedLabelToIso(label: string): string | null {
  const t = label.trim().toLowerCase();
  const day = t.match(/^(\d+)\s+dag/);
  if (day) return daysAgoIso(Number(day[1]));
  const week = t.match(/^(\d+)\s+uke/);
  if (week) return weeksAgoIso(Number(week[1]));
  const month = t.match(/^(\d+)\s+måned/);
  if (month) return monthsAgoIso(Number(month[1]));
  if (t === "1 måned siden") return monthsAgoIso(1);
  return null;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Bad project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Bad dataset ${DATASET}`);

  const docs = await sanityClient.fetch<
    Array<{ _id: string; author?: string; date?: string }>
  >(`*[_type=="googleReview"]{_id, author, date}`);

  console.log(`DRY_RUN=${DRY_RUN} reviews=${docs.length}`);

  for (const doc of docs) {
    const seed = googleReviews.find((g) => g.name === doc.author);
    if (!seed) {
      console.warn(`no seed for ${doc.author}`);
      continue;
    }
    const next = seedLabelToIso(seed.date);
    if (!next) {
      console.warn(`could not parse "${seed.date}" for ${doc.author}`);
      continue;
    }
    if (doc.date === next) {
      console.log(`ok ${doc.author} ${next}`);
      continue;
    }
    console.log(`→ ${doc.author}: ${doc.date} → ${next} (${seed.date})`);
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ date: next }).commit();
    }
  }

  console.log("\n✓ review dates patched");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
