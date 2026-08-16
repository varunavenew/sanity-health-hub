#!/usr/bin/env npx tsx
/**
 * Developer-only: restore "Relaterte tjenester" carousel on all gynekologi treatments.
 *
 * Prior patches renamed relatedSection → "Andre ting vi hjelper med" and cleared
 * items on overgangsalder. Demo keeps:
 *   - expertAreas = "Andre ting vi hjelper med" (2×2 cards, where used)
 *   - relatedSection = "Relaterte tjenester" (bottom carousel)
 *
 *   cd test && npx tsx sanity/patch-gynekologi-relaterte-tjenester-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

/** Demo / static related lists for pages whose relatedSection was emptied or misused. */
const RELATED_OVERRIDE: Record<string, string[]> = {
  overgangsalder: ["vulvalidelser", "urinlekkasje", "vaginale-fremfall"],
  tverrfaglig: ["overgangsalder", "endometriose", "fodselsskader"],
};

function i18nString(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

function refs(ids: string[]) {
  return ids.map((id, i) => ({
    _type: "reference" as const,
    _ref: id,
    _key: `rel-${i}-${id.replace(/[^a-z0-9]/gi, "").slice(-10)}`,
  }));
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const title = i18nString("Relaterte tjenester", "Related services");
  const seeAllLabel = i18nString(
    "Se alle gynekologi-tjenester",
    "See all gynaecology services",
  );

  const treatments = await sanityClient.fetch<
    Array<{
      _id: string;
      slug?: string;
      relatedItems?: Array<{ _ref?: string }>;
      seeAllHref?: string;
    }>
  >(
    `*[
      _type=="treatment" &&
      references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "slug": slug[language=="no"][0].value.current,
      "relatedItems": relatedSection.items[],
      "seeAllHref": relatedSection.seeAllHref
    }`,
  );

  const allBySlug = await sanityClient.fetch<
    Array<{ _id: string; slug: string }>
  >(
    `*[
      _type=="treatment" &&
      defined(slug) &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "slug": coalesce(
        slug[language=="no"][0].value.current,
        slug[_key=="no"][0].value.current,
        slug.current
      )
    }`,
  );
  const idBySlug = new Map(
    allBySlug.filter((t) => t.slug).map((t) => [t.slug, t._id]),
  );

  let patched = 0;

  for (const doc of treatments) {
    if (!doc.slug || doc.slug === "new-treatment") continue;

    const override = RELATED_OVERRIDE[doc.slug];
    let itemIds: string[];

    if (override) {
      itemIds = [];
      for (const slug of override) {
        const id = idBySlug.get(slug);
        if (!id) {
          console.warn(`  ! missing related slug ${slug} for ${doc.slug}`);
          continue;
        }
        if (id !== doc._id && !itemIds.includes(id)) itemIds.push(id);
      }
    } else {
      itemIds = (doc.relatedItems || [])
        .map((r) => r._ref)
        .filter((id): id is string => Boolean(id) && id !== doc._id);
    }

    if (itemIds.length === 0) {
      console.warn(`⚠ ${doc.slug}: no related items — skipped`);
      continue;
    }

    const seeAllHref =
      doc.seeAllHref && !String(doc.seeAllHref).includes("/behandlinger")
        ? doc.seeAllHref
        : "/gynekologi";

    await sanityClient
      .patch(doc._id)
      .set({
        relatedSection: {
          _type: "object",
          title,
          seeAllHref,
          seeAllLabel,
          asIntro: false,
          asServices: true,
          items: refs(itemIds),
        },
      })
      .commit({ autoGenerateArrayKeys: false });

    const draftId = `drafts.${doc._id}`;
    if (
      await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
        id: draftId,
      })
    ) {
      await sanityClient.delete(draftId);
    }

    patched += 1;
    console.log(`✓ ${doc.slug}: Relaterte tjenester (${itemIds.length})`);
  }

  const verify = await sanityClient.fetch(
    `*[
      _type=="treatment" &&
      references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) &&
      !(_id in path("drafts.**")) &&
      slug[language=="no"][0].value.current in ["overgangsalder","tverrfaglig","endometriose","pmos"]
    ]{
      "slug": slug[language=="no"][0].value.current,
      "relatedTitle": relatedSection.title[language=="no"][0].value,
      "relatedCount": count(relatedSection.items),
      "asServices": relatedSection.asServices,
      "asIntro": relatedSection.asIntro,
      "expertTitle": expertAreas.title[language=="no"][0].value,
      "expertCount": count(expertAreas.items),
      "items": relatedSection.items[]->{
        "slug": slug[language=="no"][0].value.current
      }.slug
    } | order(slug asc)`,
  );

  console.log(
    JSON.stringify({ dataset: DATASET, patched, verify }, null, 2),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
