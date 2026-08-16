/**
 * Developer-only: align fertility relatedSection.items to demo scrape,
 * with audience pages ordered audience-first (matches expected hub UX).
 *
 * Source: data/demo-fertility-related.json (Playwright scrape of avenewdemo)
 *
 *   cd test && npx tsx sanity/patch-fertility-related-from-demo-developer.ts
 */
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const ID_BY_SLUG: Record<string, string> = {
  fertilitetsutredning: "treatment-fertilitet-fertilitetsutredning",
  "assistert-befruktning": "treatment-fertilitet-assistert-befruktning",
  eggfrys: "treatment-fertilitet-eggfrys",
  donorbehandling: "treatment-fertilitet-donorbehandling",
  saedanalyse: "treatment-fertilitet-saedanalyse",
  infertilitet: "treatment-fertilitet-infertilitet",
  hysteroskopi: "treatment-fertilitet-hysteroskopi",
  "assistert-befruktning-for-par-og-single":
    "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "mann-og-kvinne-i-parforhold": "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  "to-kvinner-i-parforhold": "treatment-fertilitet-to-kvinner-i-parforhold",
  "singel-kvinne": "treatment-fertilitet-singel-kvinne",
  "singel-mann": "treatment-fertilitet-singel-mann",
};

const AUDIENCE_SLUGS = [
  "assistert-befruktning-for-par-og-single",
  "mann-og-kvinne-i-parforhold",
  "to-kvinner-i-parforhold",
  "singel-kvinne",
  "singel-mann",
] as const;

/** Dump order for hub: clinical first, then audience siblings. */
const HUB_RELATED_DUMP = [
  "infertilitet",
  "assistert-befruktning",
  "eggfrys",
  "donorbehandling",
  "hysteroskopi",
  "saedanalyse",
  "mann-og-kvinne-i-parforhold",
  "to-kvinner-i-parforhold",
  "singel-kvinne",
  "singel-mann",
] as const;

const SEE_ALL_HREF = "/fertilitet";

function refs(ids: string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: randomBytes(6).toString("hex"),
  }));
}

function i18nString(no: string, en: string) {
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

function hrefToSlug(href: string): string {
  return href
    .replace(/^\/behandlinger\/fertilitet\//, "")
    .replace(/^\/fertilitet\//, "")
    .replace(/\/$/, "");
}

function clinicalFirst(slugs: string[], selfSlug: string): string[] {
  const clinicalOrder = [
    "infertilitet",
    "assistert-befruktning",
    "eggfrys",
    "donorbehandling",
    "hysteroskopi",
    "saedanalyse",
    "assistert-befruktning-for-par-og-single",
    "mann-og-kvinne-i-parforhold",
    "to-kvinner-i-parforhold",
    "singel-kvinne",
    "singel-mann",
  ];
  const set = new Set(slugs.filter((s) => s && s !== selfSlug));
  const ordered = clinicalOrder.filter((s) => set.has(s));
  const rest = [...set].filter((s) => !ordered.includes(s));
  return [...ordered, ...rest];
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists && !DRY_RUN) await sanityClient.delete(draftId);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Bad project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Bad dataset ${DATASET}`);

  const demoPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "data",
    "demo-fertility-related.json",
  );
  if (!fs.existsSync(demoPath)) {
    throw new Error(`Missing demo scrape: ${demoPath}`);
  }
  const demo = JSON.parse(fs.readFileSync(demoPath, "utf8")) as Record<
    string,
    { relatedHrefs?: string[] }
  >;

  console.log(`DRY_RUN=${DRY_RUN}`);

  for (const [slug, pageId] of Object.entries(ID_BY_SLUG)) {
    const page = demo[slug];
    if (!page?.relatedHrefs?.length) {
      console.warn(`skip ${slug}: no demo related`);
      continue;
    }

    let relatedSlugs: string[];

    if (slug === "assistert-befruktning-for-par-og-single") {
      relatedSlugs = [...HUB_RELATED_DUMP];
    } else if ((AUDIENCE_SLUGS as readonly string[]).includes(slug)) {
      relatedSlugs = clinicalFirst(
        page.relatedHrefs.map(hrefToSlug).filter((s) => s && s !== slug),
        slug,
      );
    } else {
      relatedSlugs = page.relatedHrefs
        .map(hrefToSlug)
        .filter((s) => s && s !== slug);
    }

    const relatedIds = relatedSlugs
      .map((s) => ID_BY_SLUG[s])
      .filter(Boolean) as string[];

    if (relatedIds.length !== relatedSlugs.length) {
      const missing = relatedSlugs.filter((s) => !ID_BY_SLUG[s]);
      console.warn(`  ${slug}: missing ids for`, missing);
    }

    console.log(`→ ${slug} related=${relatedSlugs.join(", ")}`);

    if (DRY_RUN) continue;

    await sanityClient
      .patch(pageId)
      .set({
        relatedSection: {
          _type: "object",
          title: i18nString("Relaterte tjenester", "Related services"),
          seeAllHref: SEE_ALL_HREF,
          seeAllLabel: i18nString(
            "Se alle fertilitet-tjenester",
            "See all fertility services",
          ),
          asIntro: false,
          asServices: true,
          items: refs(relatedIds),
        },
      })
      .commit({ autoGenerateArrayKeys: true });

    await discardDraft(pageId);
  }

  const verify = await sanityClient.fetch(
    `*[_id in $ids]{
      "slug": coalesce(slug[_key=="no"][0].value.current, slug[0].value.current),
      "related": relatedSection.items[]->{
        "s": coalesce(slug[_key=="no"][0].value.current, slug[0].value.current)
      }.s
    } | order(slug asc)`,
    { ids: Object.values(ID_BY_SLUG) },
  );
  console.log("\n✓ verify");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
