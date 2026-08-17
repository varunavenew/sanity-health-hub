/**
 * Developer-only: align graviditet NIPT (and sibling) specialists band to demo.
 *
 * Demo NIPT shows displayMode "all" carousel (Andreas Edenberg…), not the
 * manual Ashi/Madeleine picks. SeeAll → /spesialister.
 *
 *   cd test && npx tsx sanity/patch-nipt-specialists-all-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const TITLE_NO = "Spesialister som utfører dette";
const TITLE_EN = "Specialists who perform this";
const DESC_NO =
  "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.";
const DESC_EN =
  "Experience, specialist expertise and modern technology gathered in one place.";

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
  if (exists && !DRY_RUN) await sanityClient.delete(draftId);
}

async function patchTreatment(id: string) {
  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id });

  if (!Array.isArray(pageSections)) {
    console.warn(`skip ${id}: no pageSections`);
    return;
  }

  let found = false;
  const next = pageSections.map((section) => {
    if (section._type !== "pageSectionSpecialists") return section;
    found = true;
    const {
      specialists: _s,
      treatmentCategory: _tc,
      categorySlug: _cs,
      primaryCtaLabel: _p,
      subtitle: _sub,
      limit: _limit,
      ...rest
    } = section as Record<string, unknown>;

    return {
      ...rest,
      _type: "pageSectionSpecialists",
      _key: section._key || "specialists-section",
      displayMode: "all",
      variant: "carousel",
      title: i18nString(TITLE_NO, TITLE_EN),
      description: i18nText(DESC_NO, DESC_EN),
      specialists: [],
      seeAllHref: "/spesialister",
      seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
    };
  });

  if (!found) {
    next.push({
      _type: "pageSectionSpecialists",
      _key: "specialists-section",
      displayMode: "all",
      variant: "carousel",
      title: i18nString(TITLE_NO, TITLE_EN),
      description: i18nText(DESC_NO, DESC_EN),
      specialists: [],
      seeAllHref: "/spesialister",
      seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
    });
  }

  console.log(`→ ${id} displayMode=all`);
  if (DRY_RUN) return;

  await sanityClient
    .patch(id)
    .set({ pageSections: next })
    .commit({ autoGenerateArrayKeys: true });

  await discardDraft(id);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Bad project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Bad dataset ${DATASET}`);

  console.log(`DRY_RUN=${DRY_RUN}`);

  // NIPT is the reported page; also align other graviditet treatments that
  // still use the same wrong 2-person manual list if present.
  const targets = await sanityClient.fetch<Array<{ _id: string; slug: string }>>(
    `*[
      _type=="treatment" &&
      !(_id in path("drafts.**")) &&
      (
        _id == "treatment-graviditet-nipt" ||
        (
          references(*[_type=="treatmentCategory" && (
            categoryId=="graviditet" ||
            slug[language=="no"][0].value.current=="graviditet"
          )][0]._id) &&
          count(pageSections[_type=="pageSectionSpecialists" && displayMode=="manual" && count(specialists)==2]) > 0
        )
      )
    ]{ _id, "slug": coalesce(slug[language=="no"][0].value.current, slug[_key=="no"][0].value.current) }`,
  );

  console.log(
    "targets",
    targets.map((t) => `${t.slug || t._id}`).join(", "),
  );

  for (const t of targets) {
    await patchTreatment(t._id);
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-graviditet-nipt"][0]{
      "mode": pageSections[_type=="pageSectionSpecialists"][0].displayMode,
      "nManual": count(pageSections[_type=="pageSectionSpecialists"][0].specialists),
      "seeAll": pageSections[_type=="pageSectionSpecialists"][0].seeAllHref,
      "title": pageSections[_type=="pageSectionSpecialists"][0].title[language=="no"][0].value
    }`,
  );
  console.log("✓ nipt", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
