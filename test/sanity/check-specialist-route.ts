/**
 * Diagnose specialist route data in Sanity.
 * Usage: cd test && npx tsx sanity/check-specialist-route.ts [slug]
 */
import { sanityClient } from "./config";

const slug = process.argv[2] || "trond-jorgensen";

async function main() {
  const data = await sanityClient.fetch<{
    listing: { slugNb?: string; slugEn?: string } | null;
    specialistPublished: { _id: string; name?: string } | null;
    specialist: { _id: string; name?: string; slugNb?: string; slugEn?: string } | null;
    count: number;
  }>(`{
    "listing": *[_type == "specialistsListingPage"][0]{
      "slugNb": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current, slug.current),
      "slugEn": coalesce(slug[language == "en"][0].value.current, slug[_key == "en"][0].value.current, slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current, slug.current)
    },
    "specialistPublished": *[_type == "specialist" && !(_id in path("drafts.**")) && (
      slug.current == $slug
      || slug[0].value.current == $slug
      || slug[language == "no"][0].value.current == $slug
      || slug[_key == "no"][0].value.current == $slug
    )][0]{ _id, name },
    "specialist": *[_type == "specialist" && (
      slug.current == $slug
      || slug[0].value.current == $slug
      || slug[language == "no"][0].value.current == $slug
      || slug[_key == "no"][0].value.current == $slug
    )][0]{
      _id, name,
      "slugNb": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current, slug.current),
      "slugEn": coalesce(slug[language == "en"][0].value.current, slug[_key == "en"][0].value.current, slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current, slug.current)
    },
    "count": count(*[_type == "specialist"])
  }`, { slug });

  console.log(JSON.stringify(data, null, 2));

  const listingNb = data.listing?.slugNb;
  const hasPublished = Boolean(data.specialistPublished);
  const hasDraftOnly = Boolean(data.specialist) && !hasPublished;

  console.log("\nDiagnosis:");
  console.log(`  Listing prefix (NO): ${listingNb ?? "(missing)"}`);
  console.log(`  Published specialist: ${hasPublished}`);
  console.log(`  Draft only: ${hasDraftOnly}`);
  console.log(
    `  /no/spesialister/${slug} routable (published): ${listingNb === "spesialister" && hasPublished}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
