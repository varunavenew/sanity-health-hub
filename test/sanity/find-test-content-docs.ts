#!/usr/bin/env npx tsx
import { sanityClient } from "./config";

async function main() {
  const bySlug = await sanityClient.fetch(
    `*[defined(slug) && (
      slug[language == "no"][0].value.current match "new-*"
      || slug[language == "en"][0].value.current match "new-*"
    )]{ _id, _type, "slugNo": slug[language=="no"][0].value.current, "slugEn": slug[language=="en"][0].value.current }`,
  );
  console.log("by slug pattern:", JSON.stringify(bySlug, null, 2));

  const byTitle = await sanityClient.fetch(
    `*[_type in ["treatment", "treatmentCategory"] && (
      title[language=="no"][0].value match "new *"
      || title[language=="en"][0].value match "new *"
      || title[language=="no"][0].value match "test *"
      || title[language=="en"][0].value match "test *"
    )]{ _id, _type, title, slug }`,
  );
  console.log("by title:", JSON.stringify(byTitle, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
