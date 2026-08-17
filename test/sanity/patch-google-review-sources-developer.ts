#!/usr/bin/env npx tsx
/**
 * Developer-only: set googleReview.source from local seed (googleReviews.ts).
 * review-10/11/12/14 → legelisten; all others → google.
 *
 *   cd test && npx tsx sanity/patch-google-review-sources-developer.ts
 */
import { googleReviews } from "../../src/data/googleReviews";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const docs = await sanityClient.fetch<
    Array<{ _id: string; author?: string }>
  >(
    `*[_type == "googleReview" && !(_id in path("drafts.**"))]{_id, author}`,
  );

  const byId = new Map(
    googleReviews.map((r) => [`review-${r.id}`, r.source] as const),
  );
  const byAuthor = new Map(
    googleReviews.map((r) => [r.name.trim().toLowerCase(), r.source] as const),
  );

  let patched = 0;
  for (const doc of docs) {
    const idKey = doc._id.replace(/^drafts\./, "");
    const fromId = byId.get(idKey);
    const fromAuthor = doc.author
      ? byAuthor.get(doc.author.trim().toLowerCase())
      : undefined;
    const source = fromId || fromAuthor || "google";

    await sanityClient.patch(doc._id).set({ source }).commit();
    patched += 1;
    console.log(`✓ ${doc._id} (${doc.author || "—"}) → ${source}`);
  }

  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        patched,
        legelistenExpected: googleReviews.filter((r) => r.source === "legelisten")
          .map((r) => `review-${r.id}`),
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
