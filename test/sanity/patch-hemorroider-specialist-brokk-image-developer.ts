#!/usr/bin/env npx tsx
/**
 * Developer-only: hemorroider page parity vs avenewdemo.
 *
 * - Brokkoperasjon related-card image → grainy orange gastro expert photo
 * - Marian Bale expertise list → 5 items (incl. Endetarmsplager, Generell kirurgi)
 *
 *   cd test && npx tsx sanity/patch-hemorroider-specialist-brokk-image-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const BROKK_ID = "treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon";
const MARIAN_ID = "specialist-marian-bale";
const ORANGE_ASSET_ID =
  "image-32fb72d7b38d890068e167706fb83fc30c391bc9-1080x1920-png";

function i18nLabel(no: string, en: string) {
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

function specialty(key: string, no: string, en: string) {
  return {
    _key: `spec-${key}`,
    _type: "specialtyItem",
    label: i18nLabel(no, en),
  };
}

const MARIAN_SPECIALTIES = [
  specialty("gastrokirurgi", "Gastrokirurgi", "Gastrointestinal surgery"),
  specialty("brokkbehandling", "Brokkbehandling", "Hernia treatment"),
  specialty("laparoskopi", "Laparoskopi", "Laparoscopy"),
  specialty("endetarmsplager", "Endetarmsplager", "Rectal complaints"),
  specialty("generell-kirurgi", "Generell kirurgi", "General surgery"),
];

async function discardDraft(id: string) {
  const draft = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draft,
  });
  if (exists && !DRY_RUN) await sanityClient.delete(draft);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error(`Refuse: ${PROJECT_ID}/${DATASET}`);
  }

  const asset = await sanityClient.fetch<{
    _id: string;
    originalFilename?: string;
    url?: string;
  } | null>(`*[_id==$id][0]{_id, originalFilename, url}`, {
    id: ORANGE_ASSET_ID,
  });
  if (!asset?._id) {
    throw new Error(`Missing orange gastro asset ${ORANGE_ASSET_ID}`);
  }
  console.log("orange asset", asset.originalFilename, asset.url);

  const brokk = await sanityClient.fetch<{
    heroImage?: { _type?: string; asset?: { _ref?: string } };
    heroMedia?: {
      _type?: string;
      mediaType?: string;
      image?: { _type?: string; asset?: { _ref?: string } };
    };
    file?: string;
  } | null>(
    `*[_id==$id][0]{
      heroImage,
      heroMedia,
      "file": heroImage.asset->originalFilename
    }`,
    { id: BROKK_ID },
  );
  if (!brokk) throw new Error(`Missing ${BROKK_ID}`);
  console.log("brokk before", brokk.file, brokk.heroMedia?.image?.asset?._ref);

  const heroImage = {
    ...(brokk.heroImage || {}),
    _type: brokk.heroImage?._type || "image",
    asset: { _type: "reference" as const, _ref: ORANGE_ASSET_ID },
  };
  const heroMedia = {
    ...(brokk.heroMedia || {}),
    _type: brokk.heroMedia?._type || "media",
    mediaType: "image",
    image: {
      ...(brokk.heroMedia?.image || {}),
      _type: brokk.heroMedia?.image?._type || "image",
      asset: { _type: "reference" as const, _ref: ORANGE_ASSET_ID },
    },
  };

  const marian = await sanityClient.fetch<{
    specialties?: Array<{ no?: string }>;
  } | null>(
    `*[_id==$id][0]{
      "specialties": specialties[]{ "no": label[_key=="no"][0].value }
    }`,
    { id: MARIAN_ID },
  );
  console.log(
    "marian specialties before",
    (marian?.specialties || []).map((s) => s.no),
  );

  if (!DRY_RUN) {
    await sanityClient.patch(BROKK_ID).set({ heroImage, heroMedia }).commit();
    await discardDraft(BROKK_ID);

    await sanityClient
      .patch(MARIAN_ID)
      .set({ specialties: MARIAN_SPECIALTIES })
      .commit({ autoGenerateArrayKeys: true });
    await discardDraft(MARIAN_ID);
  }

  console.log(
    DRY_RUN ? "dry-run ok" : "patched",
    BROKK_ID,
    "→",
    asset.originalFilename,
  );
  console.log(
    DRY_RUN ? "dry-run ok" : "patched",
    MARIAN_ID,
    "specialties=",
    MARIAN_SPECIALTIES.length,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
