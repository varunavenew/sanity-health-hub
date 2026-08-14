import { DATASET, sanityClient } from "./config";

async function main() {
  console.log("project 9jhqpk3a dataset", DATASET);
  if (DATASET !== "developer") throw new Error("developer only");

  for (const needle of ["Madeleine Engen", "HER Awards", "Kvinnehelseprisen", "foreldre"]) {
    const hits = await sanityClient.fetch(
      `*[_type == "article" && (
        coalesce(title[language=="no"][0].value, title[0].value, title) match $q ||
        coalesce(title[language=="en"][0].value, title[0].value, title) match $q ||
        coalesce(slug[language=="no"][0].value.current, slug[0].value.current, slug.current) match $q
      )]{
        _id,
        category,
        publishedAt,
        "titleNo": coalesce(title[language=="no"][0].value, title[0].value, title),
        "titleEn": coalesce(title[language=="en"][0].value, title[0].value, title),
        "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current, slug.current)
      }`,
      { q: `*${needle}*` },
    );
    console.log(`\n--- search: "${needle}" (${hits.length}) ---`);
    for (const h of hits) console.log(JSON.stringify(h));
  }

  const news = await sanityClient.fetch(`*[_id=="newsPage"][0]{
    "featured": featuredArticles[]->{
      "title": coalesce(title[language=="no"][0].value, title[0].value),
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current)
    },
    "listing": listingArticles[]->{
      "title": coalesce(title[language=="no"][0].value, title[0].value),
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current)
    },
    socialPlatformCards[]{ platform, url, "title": title[language=="no"][0].value },
    instagramSectionTitle,
    socialSectionTitle,
    socialMode,
    "socialPosts": count(socialPosts),
    instagramProfile{
      "username": username[language=="no"][0].value,
      postsCount, followersCount
    }
  }`);

  console.log("\n--- newsPage CMS ---");
  console.log(JSON.stringify(news, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
