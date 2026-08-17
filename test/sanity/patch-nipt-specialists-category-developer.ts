#!/usr/bin/env npx tsx
/**
 * Developer-only: NIPT specialists band = demo list (flere fagområder),
 * in the order from avenewdemo /graviditet/nipt.
 *
 *   cd test && npx tsx sanity/patch-nipt-specialists-category-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const TITLE_NO = "Spesialister som utfører dette";
const TITLE_EN = "Specialists who perform this";
const DESC_NO =
  "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.";
const DESC_EN =
  "Experience, specialist expertise and modern technology gathered in one place.";

/** Demo NIPT carousel order. */
const NIPT_SLUGS = [
  "andreas-edenberg",
  "birgir-gudbrandsson",
  "cennet-akdeniz",
  "einar-andre-brevik",
  "erik-berg",
  "gunnar-dalen",
  "ingvild-skarpas-aannerud",
  "jan-roland-lambrecht",
  "jeanette-follestad",
  "kjersti-margrete-finsrud",
  "line-fusdahl-hulleberg",
  "linn-myrtveit-stensrud",
  "linnea-torsnes",
  "mari-borge-eskerud",
  "maria-thompson-clausen",
  "marian-bale",
  "marthe-hagen",
  "mia-kitter",
  "tonje-westlie",
];

function i18nString(no: string, en = no) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayStringValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: en,
    },
  ];
}

function i18nText(no: string, en = no) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: en,
    },
  ];
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) await sanityClient.delete(draftId);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Bad project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Bad dataset ${DATASET}`);

  const specialists = await sanityClient.fetch<
    Array<{ _id: string; slug: string; name: string }>
  >(
    `*[_type=="specialist" && !(_id in path("drafts.**"))]{
      _id, name,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[_key=="no"][0].value.current)
    }`,
  );
  const bySlug = new Map(specialists.map((row) => [row.slug, row]));

  const missing = NIPT_SLUGS.filter((slug) => !bySlug.has(slug));
  if (missing.length) throw new Error(`Missing specialists: ${missing.join(", ")}`);

  const refs = NIPT_SLUGS.map((slug, index) => ({
    _type: "reference" as const,
    _ref: bySlug.get(slug)!._id,
    _key: `spec-${index}`,
  }));

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id=="treatment-graviditet-nipt"][0].pageSections[]`);

  if (!Array.isArray(pageSections)) {
    throw new Error("NIPT has no pageSections");
  }

  let found = false;
  const next = pageSections.map((section) => {
    if (section._type !== "pageSectionSpecialists") return section;
    found = true;
    return {
      _type: "pageSectionSpecialists",
      _key: section._key || "specialists-section",
      displayMode: "manual",
      variant: "carousel",
      title: i18nString(TITLE_NO, TITLE_EN),
      description: i18nText(DESC_NO, DESC_EN),
      specialists: refs,
      seeAllHref: "/spesialister",
      seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
    };
  });

  if (!found) {
    next.push({
      _type: "pageSectionSpecialists",
      _key: "specialists-section",
      displayMode: "manual",
      variant: "carousel",
      title: i18nString(TITLE_NO, TITLE_EN),
      description: i18nText(DESC_NO, DESC_EN),
      specialists: refs,
      seeAllHref: "/spesialister",
      seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
    });
  }

  await sanityClient
    .patch("treatment-graviditet-nipt")
    .set({ pageSections: next })
    .commit({ autoGenerateArrayKeys: true });
  await discardDraft("treatment-graviditet-nipt");

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-graviditet-nipt"][0]{
      "mode": pageSections[_type=="pageSectionSpecialists"][0].displayMode,
      "names": pageSections[_type=="pageSectionSpecialists"][0].specialists[]->name,
      "seeAll": pageSections[_type=="pageSectionSpecialists"][0].seeAllHref
    }`,
  );
  console.log("✓ nipt", JSON.stringify(verify, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
