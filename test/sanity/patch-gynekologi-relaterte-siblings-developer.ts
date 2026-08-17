#!/usr/bin/env npx tsx
/**
 * Developer-only: Relaterte tjenester = Gynekologi nav order (demo),
 * excluding the current treatment only.
 *
 * Demo order on overgangsalder starts:
 *   1. tverrfaglig
 *   2. undersokelse
 *   3. urinlekkasje
 *   4. endometriose
 *   …
 *
 *   cd test && npx tsx sanity/patch-gynekologi-relaterte-siblings-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

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

  const cat = await sanityClient.fetch<{
    treatments?: Array<{ _id: string; slug?: string; pageRole?: string }>;
  } | null>(
    `*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]{
      "treatments": treatments[]->{
        _id,
        pageRole,
        "slug": coalesce(
          slug[language=="no"][0].value.current,
          slug[_key=="no"][0].value.current,
          slug.current
        )
      }
    }`,
  );

  // Exact demo order = category Behandlinger[] list (nav order).
  const ordered = (cat?.treatments || []).filter(
    (t) =>
      t?._id &&
      t.slug &&
      t.slug !== "new-treatment" &&
      t.pageRole !== "team",
  );

  if (ordered.length < 3) {
    throw new Error(`Expected gynekologi nav items, got ${ordered.length}`);
  }

  console.log(
    "Demo order:",
    ordered.map((t, i) => `${i + 1}.${t.slug}`).join(" "),
  );

  const treatments = await sanityClient.fetch<
    Array<{ _id: string; slug?: string }>
  >(
    `*[
      _type=="treatment" &&
      references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) &&
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

  let patched = 0;

  for (const doc of treatments) {
    if (!doc.slug || doc.slug === "new-treatment") continue;

    // Same list as demo, minus the page you are on.
    const itemIds = ordered
      .filter((t) => t._id !== doc._id && t.slug !== doc.slug)
      .map((t) => t._id);

    if (itemIds.length === 0) {
      console.warn(`⚠ ${doc.slug}: no related items`);
      continue;
    }

    await sanityClient
      .patch(doc._id)
      .set({
        relatedSection: {
          _type: "object",
          title,
          seeAllHref: "/gynekologi",
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
    const preview = ordered
      .filter((t) => t._id !== doc._id)
      .slice(0, 4)
      .map((t) => t.slug)
      .join(", ");
    console.log(`✓ ${doc.slug}: ${itemIds.length} → ${preview}, …`);
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-overgangsalder"][0]{
      "title": relatedSection.title[language=="no"][0].value,
      "first": relatedSection.items[0..3]->{
        "slug": slug[language=="no"][0].value.current
      }.slug
    }`,
  );

  console.log(JSON.stringify({ dataset: DATASET, patched, verify }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
