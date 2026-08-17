/**
 * Developer-only: restore fertility treatment Specialists bands.
 *
 * Demo (avenewdemo eggfrys etc.):
 *   title: "Spesialister som utfører dette"
 *   description: "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted."
 *
 *   cd test && npx tsx sanity/patch-fertility-specialists-band-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-fertility-specialists-band-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const TITLE_NO = "Spesialister som utfører dette";
const TITLE_EN = "Specialists who perform this";
const DESC_NO =
  "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.";
const DESC_EN =
  "Experience, specialist expertise and modern technology gathered in one place.";
const SEE_ALL_NO = "Se alle fertilitetsspesialister";
const SEE_ALL_EN = "See all fertility specialists";
const SEE_ALL_HREF = "/spesialister?kategori=fertilitet";

const SPEC = {
  anamika: "specialist-anamika-choudhury",
  birgitte: "specialist-birgitte-mitlid-mork",
  hannah: "specialist-hannah-russell",
  ida: "specialist-ida-waagsbo-bjorntvedt",
  jackson: "specialist-jackson-tok",
  kjersti: "specialist-kjersti-brenden",
  kristian: "specialist-kristian-ophaug",
  sonu: "specialist-sonu-lukose",
} as const;

const TEAM8 = [
  SPEC.anamika,
  SPEC.birgitte,
  SPEC.hannah,
  SPEC.ida,
  SPEC.jackson,
  SPEC.kjersti,
  SPEC.kristian,
  SPEC.sonu,
] as const;

const INFERT_SPECS = [SPEC.birgitte, SPEC.jackson, SPEC.kjersti] as const;

/** Demo parity: eggfrys / most single treatments → Kristian; infertilitet → 3; team pages → TEAM8 */
const SPECIALISTS_BY_ID: Record<string, readonly string[]> = {
  "treatment-fertilitet-eggfrys": [SPEC.kristian],
  "treatment-fertilitet-assistert-befruktning": [SPEC.kristian],
  "treatment-fertilitet-donorbehandling": [SPEC.kristian],
  "treatment-fertilitet-saedanalyse": [SPEC.kristian],
  "treatment-fertilitet-hysteroskopi": [SPEC.kristian],
  "treatment-fertilitet-infertilitet": INFERT_SPECS,
  "treatment-fertilitet-fertilitetsutredning": TEAM8,
  "treatment-fertilitet-assistert-befruktning-for-par-og-single": TEAM8,
  "treatment-fertilitet-mann-og-kvinne-i-parforhold": TEAM8,
  "treatment-fertilitet-to-kvinner-i-parforhold": TEAM8,
  "treatment-fertilitet-singel-kvinne": TEAM8,
  "treatment-fertilitet-singel-mann": TEAM8,
  "treatment-fertilitet-ivf": TEAM8,
  "treatment-fertilitet-teamet": TEAM8,
};

function refKey() {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

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

function specialistsBand(specialistIds: readonly string[], key?: string) {
  return {
    _type: "pageSectionSpecialists" as const,
    _key: key || "specialists-section",
    displayMode: "manual" as const,
    variant: "carousel" as const,
    title: i18nString(TITLE_NO, TITLE_EN),
    description: i18nText(DESC_NO, DESC_EN),
    specialists: refs(specialistIds),
    seeAllHref: SEE_ALL_HREF,
    seeAllLabel: i18nString(SEE_ALL_NO, SEE_ALL_EN),
  };
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    if (!DRY_RUN) await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function patchOne(id: string, specialistIds: readonly string[]) {
  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id });

  if (!Array.isArray(pageSections)) {
    console.warn(`  skip ${id}: no pageSections`);
    return;
  }

  let found = false;
  const nextSections = pageSections.map((section) => {
    if (section._type !== "pageSectionSpecialists") return section;
    found = true;
    const {
      primaryCtaLabel: _p,
      subtitle: _s,
      description: _d,
      title: _t,
      ...rest
    } = section as Record<string, unknown> & {
      primaryCtaLabel?: unknown;
      subtitle?: unknown;
      description?: unknown;
      title?: unknown;
    };
    return {
      ...rest,
      ...specialistsBand(specialistIds, section._key || "specialists-section"),
    };
  });

  if (!found) {
    nextSections.push(specialistsBand(specialistIds));
  }

  console.log(
    `→ ${id} specialists=${specialistIds.length} (${specialistIds.map((s) => s.replace("specialist-", "")).join(", ")})`,
  );

  if (DRY_RUN) return;

  await sanityClient
    .patch(id)
    .set({ pageSections: nextSections })
    .commit({ autoGenerateArrayKeys: true });

  await discardDraft(id);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing dataset "${DATASET}" — developer only`);
  }

  console.log(`DRY_RUN=${DRY_RUN}`);

  for (const [id, specs] of Object.entries(SPECIALISTS_BY_ID)) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) {
      console.warn(`skip missing ${id}`);
      continue;
    }
    await patchOne(id, specs);
  }

  const verify = await sanityClient.fetch(
    `*[_id in $ids]{
      "id": _id,
      "title": pageSections[_type=="pageSectionSpecialists"][0].title[_key=="no"][0].value,
      "desc": pageSections[_type=="pageSectionSpecialists"][0].description[_key=="no"][0].value,
      "n": count(pageSections[_type=="pageSectionSpecialists"][0].specialists)
    }`,
    { ids: Object.keys(SPECIALISTS_BY_ID) },
  );
  console.log("\n✓ verify");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
