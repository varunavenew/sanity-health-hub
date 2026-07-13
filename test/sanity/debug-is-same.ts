import { sanityClient } from "./config";

async function run() {
  const treatments = await sanityClient.fetch(
    `*[_type == "treatment" && slug[language == "no"][0].value.current == "donorbehandling"]{
      _id,
      title,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
      "categorySlug": *[_type == "treatmentCategory" && references(^._id)][0].slug.current,
      relatedSpecialists,
      pageSections
    }`
  );
  console.log("Resolved treatment details:", JSON.stringify(treatments, null, 2));
}

run().catch(console.error);
