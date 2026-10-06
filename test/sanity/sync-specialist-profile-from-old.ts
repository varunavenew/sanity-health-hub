#!/usr/bin/env npx tsx
/**
 * Sync specialist profileTreatments + featuredCategory for the verified 29.
 *
 * Rules (Mansoor / editors):
 * - Treatment cards = old Sanity specialistPage.treatments[] order
 * - Highlight band = category of the first old treatment (matches demo:
 *   first list item is the highlighted area, e.g. Ashi → Graviditet)
 * - That highlight also stays first on the card list when it maps to a treatment
 *
 * Usage:
 *   cd test && npx tsx sanity/sync-specialist-profile-from-old.ts --dry-run
 *   cd test && npx tsx sanity/sync-specialist-profile-from-old.ts --slug=ashi-ahmad
 */
import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient, type SanityClient } from "@sanity/client";
import { sanityClient, DATASET, PROJECT_ID } from "./config";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const ONLY_SLUG = slugArg?.split("=")[1]?.trim();

const OLD_PROJECT = process.env.OLD_SANITY_PROJECT_ID?.trim() || "bk8rw7yi";
const OLD_DATASET = process.env.OLD_SANITY_DATASET?.trim() || "production";
const OLD_TOKEN = process.env.OLD_SANITY_TOKEN?.trim();

const APPROVED_SLUGS = [
  "alenka-bindas",
  "ane-gerda-z-eriksson",
  "are-haukaen-stodle",
  "ashi-ahmad",
  "birgitte-aspenes",
  "birgitte-mitlid-mork",
  "bjorn-brennhovd",
  "bjorn-robstad",
  "endre-soreide",
  "hannah-russell",
  "ida-waagsbo-bjorntvedt",
  "istvan-zoltan-rigo",
  "jackson-tok",
  "jan-ragnar-haugstvedt",
  "jeanette-follestad",
  "jonas-rydinge",
  "jorgen-perminow",
  "kristian-marstrand-warholm",
  "madeleine-engen",
  "marc-jacob-strauss",
  "morten-andersen",
  "nabeel-yousaf-khan",
  "nicolai-wessel",
  "siri-klokstad",
  "stig-hegna",
  "tea-berge",
  "thomas-fredrik-thaulow",
  "tom-henry-sundoen",
  "trond-jorgensen",
];

const CATEGORY_SLUGS = new Set([
  "graviditet",
  "gynekologi",
  "fertilitet",
  "urologi",
  "ortopedi",
  "flere-fagomrader",
]);

/** Old treatmentPage slug → new treatment slug when they differ. */
const SLUG_ALIASES: Record<string, string> = {
  "fot-og-ankel": "fot-ankel",
  blodningsfortyrrelser: "blodningsforstyrrelser",
  "blaere-og-urinveier": "blaere",
  "testikler-og-pung": "testikler",
  "fertilitet-infertilitet": "infertilitet",
};

type TreatmentHit = { _id: string; slug: string; categoryId: string };

function refsFromIds(ids: string[]) {
  return ids.map((id, i) => ({
    _type: "reference" as const,
    _ref: id.replace(/^drafts\./, ""),
    _key: `pt-${id.replace(/^specialist-|^treatment-|^treatmentCategory-/, "").slice(0, 24)}-${i}`,
  }));
}

async function buildTreatmentIndex(client: SanityClient): Promise<Map<string, TreatmentHit[]>> {
  const rows = await client.fetch<TreatmentHit[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
      "categoryId": coalesce(categories[0]->categoryId, category->categoryId)
    }`,
  );
  const map = new Map<string, TreatmentHit[]>();
  for (const row of rows) {
    const slug = row.slug?.trim();
    if (!slug || !row._id) continue;
    const hit: TreatmentHit = {
      _id: row._id.replace(/^drafts\./, ""),
      slug,
      categoryId: row.categoryId || "",
    };
    const list = map.get(slug) || [];
    list.push(hit);
    map.set(slug, list);
    if (row.categoryId) {
      const keyed = `${row.categoryId}/${slug}`;
      const keyedList = map.get(keyed) || [];
      keyedList.push(hit);
      map.set(keyed, keyedList);
    }
  }
  return map;
}

function resolveTreatment(
  oldSlug: string,
  index: Map<string, TreatmentHit[]>,
  specialistCategoryIds: string[],
): TreatmentHit | undefined {
  const lookup = SLUG_ALIASES[oldSlug] || oldSlug;
  const hits =
    index.get(lookup) ||
    specialistCategoryIds.flatMap((cid) => index.get(`${cid}/${lookup}`) || []) ||
    [];
  if (!hits.length) return undefined;
  const preferred = specialistCategoryIds.find((cid) => hits.some((h) => h.categoryId === cid));
  if (preferred) return hits.find((h) => h.categoryId === preferred);
  return hits[0];
}

async function main() {
  if (!OLD_TOKEN) {
    console.error("Missing OLD_SANITY_TOKEN in .env.local");
    process.exit(1);
  }

  const oldClient = createClient({
    projectId: OLD_PROJECT,
    dataset: OLD_DATASET,
    apiVersion: "2024-01-01",
    token: OLD_TOKEN,
    useCdn: false,
  });

  console.log(`New Sanity: ${PROJECT_ID}/${DATASET}`);
  console.log(`Old Sanity: ${OLD_PROJECT}/${OLD_DATASET}`);
  console.log(DRY_RUN ? "DRY RUN\n" : "APPLY\n");

  const treatmentIndex = await buildTreatmentIndex(sanityClient);
  const categoryIdToDocId = new Map<string, string>();
  const categoryRows = await sanityClient.fetch<Array<{ _id: string; categoryId?: string }>>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{ _id, categoryId }`,
  );
  for (const row of categoryRows) {
    const cid = row.categoryId?.trim();
    if (cid) categoryIdToDocId.set(cid, row._id.replace(/^drafts\./, ""));
  }

  const specialistCats = await sanityClient.fetch<
    Array<{ slug?: string; categoryIds?: string[] }>
  >(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current),
      "categoryIds": categories[]->categoryId
    }`,
  );
  const catsBySlug = new Map<string, string[]>();
  for (const row of specialistCats) {
    if (row.slug) catsBySlug.set(row.slug, (row.categoryIds || []).filter(Boolean));
  }

  const slugs = ONLY_SLUG ? [ONLY_SLUG] : APPROVED_SLUGS;

  for (const slug of slugs) {
    const oldDoc = await oldClient.fetch<{
      name?: string;
      treatments?: Array<{ slug?: string; title?: string }>;
    } | null>(
      `*[_type == "specialistPage" && slug.current == $slug][0]{
        name,
        "treatments": treatments[]->{
          "slug": slug.current,
          title
        }
      }`,
      { slug },
    );

    if (!oldDoc) {
      console.warn(`⚠ ${slug}: not found in old Sanity`);
      continue;
    }

    const specialistCategoryIds = catsBySlug.get(slug) || [];
    const oldSlugs = (oldDoc.treatments || [])
      .map((t) => t.slug?.trim())
      .filter((s): s is string => Boolean(s));

    const treatmentIds: string[] = [];
    const seen = new Set<string>();
    let featuredCategoryId: string | undefined;
    const unmapped: string[] = [];

    for (const oldSlug of oldSlugs) {
      if (CATEGORY_SLUGS.has(oldSlug) && !featuredCategoryId) {
        featuredCategoryId = oldSlug;
      }

      const hit = resolveTreatment(oldSlug, treatmentIndex, specialistCategoryIds);
      if (!hit) {
        if (!CATEGORY_SLUGS.has(oldSlug)) unmapped.push(oldSlug);
        continue;
      }
      if (seen.has(hit._id)) continue;
      seen.add(hit._id);
      treatmentIds.push(hit._id);
      if (!featuredCategoryId && hit.categoryId) {
        featuredCategoryId = hit.categoryId;
      }
    }

    const featuredCatRef = featuredCategoryId
      ? categoryIdToDocId.get(featuredCategoryId)
      : undefined;

    const specialistId = `specialist-${slug}`;
    const patch: Record<string, unknown> = {};

    if (treatmentIds.length) {
      patch.profileTreatments = refsFromIds(treatmentIds);
    } else {
      patch.profileTreatments = [];
    }
    if (featuredCatRef) {
      patch.featuredCategory = { _type: "reference", _ref: featuredCatRef };
    }

    console.log(
      `→ ${slug} (${oldDoc.name}): cards=${treatmentIds.length} [${oldSlugs.join(", ")}] highlight=${featuredCategoryId || "-"}`,
    );
    if (unmapped.length) {
      console.warn(`  ⚠ unmapped: ${unmapped.join(", ")}`);
    }

    if (DRY_RUN) continue;

    await sanityClient.patch(specialistId).set(patch).commit();
    console.log(`  ✓ patched ${specialistId}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
