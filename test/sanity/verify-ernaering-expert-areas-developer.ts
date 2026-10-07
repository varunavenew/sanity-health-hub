#!/usr/bin/env npx tsx
import { sanityClient } from "./config";

async function main() {
  const parent = await sanityClient.fetch(
    `*[_id == "treatment-flere-fagomrader-ernaringsfysiolog"][0]{
      "eaCount": count(expertAreas.items),
      expertAreas{ items[]{ path, "titleNo": title[language == "no"][0].value } }
    }`,
  );
  console.log("Parent expertAreas:", JSON.stringify(parent, null, 2));

  const children = await sanityClient.fetch(
    `*[_id in [
      "treatment-flere-fagomrader-ernaringsfysiolog-gravid",
      "treatment-flere-fagomrader-ernaringsfysiolog-fertilitet-ernaering",
      "treatment-flere-fagomrader-ernaringsfysiolog-overgangsalder-ernaering"
    ]]{ _id, "slugNo": slug[language == "no"][0].value.current, "slugEn": slug[language == "en"][0].value.current }`,
  );
  console.log("Children:", JSON.stringify(children, null, 2));
}

main();
