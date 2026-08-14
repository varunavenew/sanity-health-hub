#!/usr/bin/env npx tsx
/**
 * Developer-only: fix editorial article categories and body block styles.
 *
 *   cd test && npx tsx sanity/fix-article-editorial-developer.ts
 */
import { DATASET, sanityClient } from "./config";

const CATEGORY_BY_SLUG: Record<string, string> = {
  "18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen": "Pasienthistorier",
  "overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe": "Fagartikler",
  "nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter": "Fagartikler",
  "minis-historie-gjennom-mutterns-oyne": "Pasienthistorier",
  "slik-forbereder-hun-seg-til-sydpolen": "Pasienthistorier",
  "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater":
    "Nytt fra oss",
  "fra-operasjonsbordet-til-sydpolen-pa-14-maneder": "Pasienthistorier",
  "livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes":
    "Nytt fra oss",
  "historiene-ingen-snakker-om-etter-fodsel": "Oss i media",
  "jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor": "Pasienthistorier",
  "maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge": "Pasienthistorier",
  "cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse":
    "Nytt fra oss",
  "cmedical-kjoper-livio-oslo": "Nytt fra oss",
  "tanken-slo-meg-ikke-at-det-kunne-vaere-meg": "Pasienthistorier",
  "ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar":
    "Fagartikler",
};

async function articleIdForSlug(slug: string): Promise<string | null> {
  return sanityClient.fetch<string | null>(
    `*[_type == "article" && !(_id in path("drafts.**")) && coalesce(
      slug[language == "no"][0].value.current,
      slug[_key == "no"][0].value.current,
      slug[0].value.current,
      slug.current
    ) == $slug][0]._id`,
    { slug },
  );
}

function patchSectionLabelBlocks(body: unknown): unknown {
  if (!Array.isArray(body)) return body;

  return body.map((entry) => {
    if (!entry || typeof entry !== "object") return entry;
    const block = entry as { _type?: string; style?: string; children?: Array<{ text?: string }> };
    if (block._type !== "block" || block.style !== "normal") return entry;

    const text = (block.children || [])
      .map((child) => child.text || "")
      .join("")
      .trim();

    if (/^Pasienthistorie:$/i.test(text)) {
      return { ...block, style: "h2" };
    }

    return entry;
  });
}

function patchLocalizedBody(bodyField: unknown): unknown {
  if (!Array.isArray(bodyField)) return bodyField;

  const looksLocalized = bodyField.some(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      ("language" in entry || "_key" in entry) &&
      "value" in entry,
  );

  if (!looksLocalized) {
    return patchSectionLabelBlocks(bodyField);
  }

  return bodyField.map((entry) => {
    if (!entry || typeof entry !== "object" || !("value" in entry)) return entry;
    return {
      ...entry,
      value: patchSectionLabelBlocks((entry as { value?: unknown }).value),
    };
  });
}

async function main() {
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run: expected developer dataset, got ${DATASET}`);
  }

  console.log(`Fixing editorial article categories on dataset: ${DATASET}`);

  for (const [slug, category] of Object.entries(CATEGORY_BY_SLUG)) {
    const id = await articleIdForSlug(slug);
    if (!id) {
      console.warn(`  skip (not found): ${slug}`);
      continue;
    }

    const doc = await sanityClient.fetch<{ body?: unknown; category?: string }>(
      `*[_id == $id][0]{ category, body }`,
      { id },
    );

    const nextBody = patchLocalizedBody(doc?.body);
    await sanityClient.patch(id).set({ category, body: nextBody }).commit();
    console.log(`  updated ${slug} -> ${category}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
