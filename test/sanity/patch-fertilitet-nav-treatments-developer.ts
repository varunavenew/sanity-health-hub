#!/usr/bin/env npx tsx
/**
 * Developer-only: set Fertilitet `treatments[]` to the 8 reference nav items.
 *
 *   cd test && npx tsx sanity/patch-fertilitet-nav-treatments-developer.ts
 */
import { DATASET, sanityClient } from "./config";

const CATEGORY_ID = "category-fertilitet";

const NAV_TREATMENT_IDS = [
  "treatment-fertilitet-infertilitet",
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-fertilitetsutredning",
  "treatment-fertilitet-eggfrys",
  "treatment-fertilitet-donorbehandling",
  "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-saedanalyse",
] as const;

async function main() {
  for (const id of NAV_TREATMENT_IDS) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) throw new Error(`Missing published treatment: ${id}`);
  }

  await sanityClient
    .patch(CATEGORY_ID)
    .set({
      treatments: NAV_TREATMENT_IDS.map((id) => ({
        _type: "reference",
        _ref: id,
        _key: id.replace(/^treatment-fertilitet-/, "nav-"),
      })),
    })
    .commit({ autoGenerateArrayKeys: false });

  console.log("✓ Fertilitet nav treatments patched on", DATASET);
  console.log(NAV_TREATMENT_IDS.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
