/**
 * Developer-only: align Gynekologi nav with demo (18 items) and fix 404s.
 *
 * Problem:
 * - `graviditet` + `spontanabort` sit in category-gynekologi.treatments[]
 *   but their `categories` only point at graviditet → `/gynekologi/...` 404s
 * - That extra pregnancy landing in the gyn dropdown makes local 19 vs demo 18
 *
 * Fix:
 * - Remove `treatment-gynekologi-graviditet` from gynekologi nav (→ 18)
 * - Keep spontanabort in gyn nav but ensure it resolves under gynekologi
 * - Add both pregnancy pages to graviditet.treatments[] for the Graviditet menu
 * - Dual-tag categories so /gynekologi/spontanabort and /graviditet/* work
 *
 *   cd test && npx tsx sanity/patch-gynekologi-nav-graviditet-developer.ts
 */
import { DATASET, sanityClient } from "./config";

const GYN_CAT = "category-gynekologi";
const GRAV_CAT = "category-graviditet";

const REMOVE_FROM_GYN_NAV = "treatment-gynekologi-graviditet";
const KEEP_IN_GYN_WITH_DUAL = "treatment-gynekologi-spontanabort";

const GRAV_NAV_IDS = [
  "treatment-graviditet-ultralyd",
  "treatment-graviditet-nipt",
  "treatment-graviditet-svangerskapsteam",
  "treatment-graviditet-fosterdiagnostikk",
  "treatment-gynekologi-graviditet",
  "treatment-gynekologi-spontanabort",
] as const;

function ref(id: string) {
  return {
    _type: "reference" as const,
    _ref: id,
    _key: id.replace(/^treatment-(gynekologi|graviditet)-/, "nav-"),
  };
}

async function assertExists(id: string) {
  const found = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id },
  );
  if (!found) throw new Error(`Missing published treatment: ${id}`);
}

async function setCategories(treatmentId: string, categoryIds: string[]) {
  await sanityClient
    .patch(treatmentId)
    .set({
      categories: categoryIds.map((id, i) => ({
        _type: "reference",
        _ref: id,
        _key: `cat-${i}-${id.replace(/^category-/, "")}`,
      })),
    })
    .commit({ autoGenerateArrayKeys: false });
}

async function main() {
  for (const id of [
    REMOVE_FROM_GYN_NAV,
    KEEP_IN_GYN_WITH_DUAL,
    ...GRAV_NAV_IDS,
  ]) {
    await assertExists(id);
  }

  const gyn = await sanityClient.fetch<{
    treatments?: Array<{ _ref?: string }>;
  } | null>(`*[_id==$id][0]{ treatments }`, { id: GYN_CAT });

  const currentRefs = (gyn?.treatments || [])
    .map((t) => t._ref)
    .filter((id): id is string => Boolean(id));

  if (!currentRefs.includes(REMOVE_FROM_GYN_NAV)) {
    console.log("Note: graviditet already absent from gynekologi nav");
  }

  const nextGynRefs = currentRefs.filter((id) => id !== REMOVE_FROM_GYN_NAV);
  if (!nextGynRefs.includes(KEEP_IN_GYN_WITH_DUAL)) {
    nextGynRefs.push(KEEP_IN_GYN_WITH_DUAL);
  }

  console.log("Gynekologi nav:", currentRefs.length, "→", nextGynRefs.length);

  await sanityClient
    .patch(GYN_CAT)
    .set({ treatments: nextGynRefs.map(ref) })
    .commit({ autoGenerateArrayKeys: false });

  // Spontanabort must resolve under /gynekologi/spontanabort (stays in gyn nav)
  await setCategories(KEEP_IN_GYN_WITH_DUAL, [GYN_CAT, GRAV_CAT]);
  // Graviditet landing lives under Graviditet menu + /graviditet/graviditet
  await setCategories(REMOVE_FROM_GYN_NAV, [GRAV_CAT]);

  await sanityClient
    .patch(GRAV_CAT)
    .set({ treatments: GRAV_NAV_IDS.map(ref) })
    .commit({ autoGenerateArrayKeys: false });

  const verify = await sanityClient.fetch(`{
    "gynCount": count(*[_id=="${GYN_CAT}"][0].treatments),
    "gynSlugs": *[_id=="${GYN_CAT}"][0].treatments[]->{
      "slug": coalesce(slug[_key=="no"][0].value.current, slug[language=="no"][0].value.current, slug.current),
      "cats": categories[]->categoryId
    },
    "gravSlugs": *[_id=="${GRAV_CAT}"][0].treatments[]->{
      "slug": coalesce(slug[_key=="no"][0].value.current, slug[language=="no"][0].value.current, slug.current)
    }
  }`);

  console.log("✓ Patched on", DATASET);
  console.log("Gynekologi count:", verify.gynCount);
  console.log(
    "Gynekologi:",
    (verify.gynSlugs || []).map((t: { slug?: string }) => t.slug).join(", "),
  );
  console.log(
    "Graviditet:",
    (verify.gravSlugs || []).map((t: { slug?: string }) => t.slug).join(", "),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
