import { sanityClient } from "./config";

async function run() {
  const lang = "en";
  // Fetch the tverrfaglig treatment with the same query structure as the frontend
  const doc = await sanityClient.fetch(
    `*[_type == "treatment" && slug[language == "en"][0].value.current == "multidisciplinary-team-osteopath-sexologist-psychologist-nutritionist" && !(_id in path("drafts.**"))][0]{
      _id,
      relatedSection{
        eyebrow,
        title,
        lead,
        asIntro,
        asServices,
        seeAllHref,
        seeAllLabel,
        items[]->{
          _id,
          title,
          "path": "/en/behandlinger/" + category->slug[language == "en"][0].value.current + "/" + slug[language == "en"][0].value.current
        }
      }
    }`
  );
  console.log(JSON.stringify(doc, null, 2));
}

run().catch(console.error);
