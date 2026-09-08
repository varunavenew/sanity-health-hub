#!/usr/bin/env npx tsx
import { sanityClient } from "./config";

const SLUG_NO = "vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi";
const SLUG_EN = "we-take-up-the-fight-against-prostate-cancer-with-robotic-surgery";

async function main() {
  const doc = await sanityClient.fetch(
    `*[_id == "article-robotkirurgi-prostatakreft" || _id == "drafts.article-robotkirurgi-prostatakreft"]{
      _id, _type, publishedAt, category,
      slug,
      "titleNo": title[language=="no"][0].value,
      "hasBody": defined(body)
    }`,
  );
  console.log("Documents:", JSON.stringify(doc, null, 2));

  const bySlugNo = await sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && (
      slug[language == "no"][0].value.current == $slug
      || slug[_key == "no"][0].value.current == $slug
    )][0]{ _id, slug }`,
    { slug: SLUG_NO },
  );
  console.log("By slug NO:", JSON.stringify(bySlugNo, null, 2));

  const bySlugEn = await sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**")) && (
      slug[language == "en"][0].value.current == $slug
      || slug[_key == "en"][0].value.current == $slug
    )][0]{ _id, slug }`,
    { slug: SLUG_EN },
  );
  console.log("By slug EN:", JSON.stringify(bySlugEn, null, 2));

  const indexArticles = await sanityClient.fetch(
    `*[_type == "article" && !(_id in path("drafts.**"))]{
      _id,
      "slugNb": slug[language=="no"][0].value.current,
      "slugEn": slug[language=="en"][0].value.current
    }`,
  );
  const inIndex = indexArticles.find((a: { _id: string }) => a._id === "article-robotkirurgi-prostatakreft");
  console.log("In route index articles:", inIndex ?? "NOT FOUND");

  const newsPage = await sanityClient.fetch(
    `*[_type=="newsPage" && !(_id in path("drafts.**"))][0]{
      "slugNb": slug[language=="no"][0].value.current,
      "slugEn": slug[language=="en"][0].value.current
    }`,
  );
  console.log("newsPage slugs:", newsPage);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
