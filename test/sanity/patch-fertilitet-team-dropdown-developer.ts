#!/usr/bin/env npx tsx
/**
 * Optional CMS parity for Fertilitetsteamet / The Fertility Team.
 *
 * - Appends `treatment-fertilitet-teamet` to category-fertilitet.treatments[] when missing
 * - Ensures pageRole stays "team" (frontend redirects to specialists listing)
 * - Sets EN title to "The Fertility Team"
 *
 * The website dropdown reads linked treatments from the category doc; if the
 * treatment is linked but not published (or the category link is unpublished),
 * Studio still shows it while the site omits it until publish.
 *
 *   cd test && npx tsx sanity/patch-fertilitet-team-dropdown-developer.ts
 *   cd test && DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/patch-fertilitet-team-dropdown-developer.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/patch-fertilitet-team-dropdown-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const CATEGORY_ID = "category-fertilitet";
const TEAM_TREATMENT_ID = "treatment-fertilitet-teamet";
const DRY_RUN = process.env.DRY_RUN === "1";

function i18nString(no: string, en: string) {
  return [
    { _key: "no", language: "no", value: no },
    { _key: "en", language: "en", value: en },
  ];
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer" && DATASET !== "production") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Expected developer or production.`);
  }

  const teamExists = await sanityClient.fetch<string | null>(
    `*[_id == $id && !(_id in path("drafts.**"))][0]._id`,
    { id: TEAM_TREATMENT_ID },
  );
  if (!teamExists) {
    throw new Error(`Missing published treatment: ${TEAM_TREATMENT_ID}`);
  }

  const category = await sanityClient.fetch<{
    treatments?: Array<{ _ref: string; _key?: string; _type?: string }>;
  } | null>(`*[_id == $id][0]{ treatments }`, { id: CATEGORY_ID });

  if (!category) {
    throw new Error(`Missing category: ${CATEGORY_ID}`);
  }

  const treatments = category.treatments || [];
  const alreadyLinked = treatments.some((ref) => ref._ref === TEAM_TREATMENT_ID);

  console.log(`Dataset: ${DATASET}`);
  console.log(`Dry run: ${DRY_RUN ? "yes" : "no"}`);
  console.log(`Team linked in dropdown list: ${alreadyLinked ? "yes" : "no"}`);

  if (!DRY_RUN) {
    if (!alreadyLinked) {
      await sanityClient
        .patch(CATEGORY_ID)
        .setIfMissing({ treatments: [] })
        .append("treatments", [
          {
            _type: "reference",
            _ref: TEAM_TREATMENT_ID,
            _key: "teamet",
          },
        ])
        .commit();
      console.log("✓ Appended team treatment to category-fertilitet.treatments");
    }

    await sanityClient
      .patch(TEAM_TREATMENT_ID)
      .set({
        pageRole: "team",
        title: i18nString("Fertilitetsteamet", "The Fertility Team"),
      })
      .commit();
    console.log("✓ Ensured team pageRole + EN title on treatment-fertilitet-teamet");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
