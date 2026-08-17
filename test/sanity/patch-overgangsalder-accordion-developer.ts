#!/usr/bin/env npx tsx
/**
 * Developer-only: collapse overgangsalder reasons (accordion).
 *
 *   cd test && npx tsx sanity/patch-overgangsalder-accordion-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "treatment-gynekologi-overgangsalder";

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  await sanityClient.patch(DOC_ID).set({ reasonsLayout: "accordion" }).commit();

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{ reasonsLayout, "title": reasonsTitle[language=="no"][0].value }`,
    { id: DOC_ID },
  );
  console.log(JSON.stringify({ dataset: DATASET, id: DOC_ID, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
