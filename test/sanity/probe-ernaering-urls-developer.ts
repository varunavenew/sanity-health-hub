#!/usr/bin/env npx tsx
import { DATASET, PROJECT_ID, sanityClient } from "./config";

async function main() {
  console.log({ PROJECT_ID, DATASET });

  const parent = await sanityClient.fetch(
    `*[_id == "treatment-flere-fagomrader-ernaringsfysiolog"][0]{
      _id,
      "heroThemes": heroThemes[]{ "no": title[language=="no"][0].value },
      expertAreas{
        title,
        items[]{ path, "titleNo": title[language=="no"][0].value, "descNo": desc[language=="no"][0].value }
      },
      sectionOrder,
      "reasonsCount": count(reasons)
    }`,
  );
  console.log("\n=== Parent nutrition ===");
  console.log(JSON.stringify(parent, null, 2));

  const slugHits = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**")) && (
      slug[language=="no"][0].value.current in ["gravid","fertilitet","overgangsalder","fertilitet-ernaering","overgangsalder-ernaering"]
      || slug[language=="en"][0].value.current in ["pregnancy","fertility","menopause","pregnancy-ernaering","fertility-nutrition","menopause-nutrition"]
    )]{
      _id,
      "slugNo": slug[language=="no"][0].value.current,
      "slugEn": slug[language=="en"][0].value.current,
      "cat": category->title[language=="no"][0].value
    } | order(_id asc)`,
  );
  console.log("\n=== Treatments by slug (conflict check) ===");
  console.log(JSON.stringify(slugHits, null, 2));

  const ourChildren = await sanityClient.fetch(
    `*[_id match "treatment-flere-fagomrader-ernaringsfysiolog-*"]{
      _id, "slugNo": slug[language=="no"][0].value.current, "slugEn": slug[language=="en"][0].value.current
    }`,
  );
  console.log("\n=== Our nutrition child docs ===");
  console.log(JSON.stringify(ourChildren, null, 2));

  const landings = await sanityClient.fetch(
    `*[_type == "landingPage" && (
      slug.current in ["fertilitet","graviditet","gynekologi"]
    )]{ _id, "slug": slug.current, "titleNo": title[language=="no"][0].value }`,
  );
  console.log("\n=== Related landings ===");
  console.log(JSON.stringify(landings, null, 2));

  for (const page of ourChildren) {
    if (page._id === "treatment-flere-fagomrader-ernaringsfysiolog") continue;
    const detail = await sanityClient.fetch(
      `*[_id == $id][0]{
        parentTreatment->{ _id, "slugNo": slug[language=="no"][0].value.current },
        "navInCategory": *[_type=="treatmentCategory" && _id=="category-flere-fagomrader"][0].navigation.items[]._ref
      }`,
      { id: page._id },
    );
    console.log(`\n=== Child meta ${page._id} ===`);
    console.log(JSON.stringify(detail, null, 2));
  }

  const routeIndex = await sanityClient.fetch(
    `*[_type == "treatment" && _id in $ids]{
      _id,
      "slugNo": slug[language=="no"][0].value.current,
      "slugEn": slug[language=="en"][0].value.current,
      categoryId
    }`,
    {
      ids: [
        "treatment-flere-fagomrader-ernaringsfysiolog-gravid",
        "treatment-gynekologi-overgangsalder",
      ],
    },
  );
  console.log("\n=== Route index fields (sample) ===");
  console.log(JSON.stringify(routeIndex, null, 2));
}

main();
