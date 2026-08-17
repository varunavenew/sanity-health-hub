/**
 * Developer-only: import Google + Legelisten reviews onto treatments so editors
 * can see which reviews belong to each page.
 *
 * Matching uses the same category keywords as CategoryReviews fallback.
 * Empty lists stay empty only when no library reviews exist.
 *
 *   cd test && npx tsx sanity/patch-treatment-reviews-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-treatment-reviews-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  gynekologi: [
    "gynekolog",
    "kvinne",
    "ida",
    "siri",
    "eggfrys",
    "egg",
    "ivf",
    "osteopat",
    "ingvild",
  ],
  fertilitet: [
    "fertil",
    "ivf",
    "eggfrys",
    "egg",
    "prøverør",
    "befruktning",
    "embryo",
    "jackson",
    "birgitte",
  ],
  urologi: ["urolog", "prostata", "nicolai", "wessel", "robot"],
  ortopedi: [
    "skulder",
    "kne",
    "hånd",
    "fot",
    "operasjon",
    "kirurg",
    "haugstvedt",
    "warholm",
    "kristian",
  ],
  graviditet: ["gravid", "foster", "fødsel", "ultralyd", "nipt"],
};

type ReviewDoc = {
  _id: string;
  author?: string;
  source?: string;
  textNo?: string;
};

function refs(ids: string[]) {
  return ids.map((id, i) => ({
    _type: "reference" as const,
    _ref: id,
    _key: `rev-${i}-${id.replace(/[^a-z0-9]/gi, "").slice(0, 12)}`,
  }));
}

function matchScore(review: ReviewDoc, keywords: string[]): number {
  const hay = `${review.author || ""} ${review.textNo || ""}`.toLowerCase();
  return keywords.reduce((n, kw) => (hay.includes(kw) ? n + 1 : n), 0);
}

function pickForCategory(
  all: ReviewDoc[],
  categoryId: string,
  source: "google" | "legelisten",
  limit: number,
): string[] {
  const keywords = CATEGORY_KEYWORDS[categoryId] || [];
  const pool = all.filter((r) =>
    source === "legelisten" ? r.source === "legelisten" : r.source !== "legelisten",
  );
  if (pool.length === 0) return [];

  const scored = pool
    .map((r) => ({ id: r._id, score: matchScore(r, keywords) }))
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((r) => r.score > 0).map((r) => r.id);
  if (matched.length >= Math.min(3, limit)) return matched.slice(0, limit);

  const rest = scored.filter((r) => r.score === 0).map((r) => r.id);
  return [...matched, ...rest].slice(0, limit);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const reviews = await sanityClient.fetch<ReviewDoc[]>(
    `*[_type=="googleReview"]{
      _id,
      author,
      source,
      "textNo": coalesce(text[_key=="no"][0].value, text[0].value)
    }`,
  );

  const treatments = await sanityClient.fetch<
    Array<{
      _id: string;
      categoryId?: string;
      googleReviews?: unknown[];
      legelistenReviews?: unknown[];
    }>
  >(
    `*[
      _type=="treatment" &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "categoryId": coalesce(
        categories[0]->categoryId,
        category->categoryId
      ),
      googleReviews,
      legelistenReviews
    }`,
  );

  let updated = 0;
  let skipped = 0;

  for (const doc of treatments) {
    const categoryId = doc.categoryId || "";
    const googleIds = pickForCategory(reviews, categoryId, "google", 6);
    const legeIds = pickForCategory(reviews, categoryId, "legelisten", 4);

    const hasGoogle = Array.isArray(doc.googleReviews) && doc.googleReviews.length > 0;
    const hasLege =
      Array.isArray(doc.legelistenReviews) && doc.legelistenReviews.length > 0;

    // Only fill empty lists so editor curation is not overwritten.
    const patch: Record<string, unknown> = {};
    if (!hasGoogle && googleIds.length > 0) patch.googleReviews = refs(googleIds);
    if (!hasLege && legeIds.length > 0) patch.legelistenReviews = refs(legeIds);

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      doc._id,
      categoryId || "(no-cat)",
      `google=${(patch.googleReviews as unknown[] | undefined)?.length ?? "keep"}`,
      `legelisten=${(patch.legelistenReviews as unknown[] | undefined)?.length ?? "keep"}`,
    );

    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${doc._id}`);
      } catch {
        /* none */
      }
    }
    updated++;
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-pmos"][0]{
      "google": googleReviews[]->{ author, source },
      "legelisten": legelistenReviews[]->{ author, source }
    }`,
  );

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}, skipped ${skipped}.`);
  console.log("PMOS reviews:", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
