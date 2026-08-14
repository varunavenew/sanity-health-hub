#!/usr/bin/env npx tsx
/**
 * Developer-only: replace «Assistert befruktning — for par og single» card media
 * with current avenewdemo assets (heterofilt-par / to-kvinner / singel-kvinne / mannlig-fertilitet).
 *
 *   cd test && npx tsx sanity/patch-fertilitet-audience-media-developer.ts
 */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "category-fertilitet";
const REF_DIR = path.join(process.cwd(), "..", "tmp", "audience-media-ref");

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

const CARDS = [
  {
    match: /mann og kvinne/i,
    file: "0-Mann_og_kvinne_i_parforhold.jpg",
    filename: "fertilitet-audience-heterofilt-par.jpg",
    altNo: "Mann og kvinne i parforhold",
    altEn: "Man and woman as a couple",
  },
  {
    match: /to kvinner/i,
    file: "1-To_kvinner_i_parforhold.jpg",
    filename: "fertilitet-audience-to-kvinner.jpg",
    altNo: "To kvinner i parforhold",
    altEn: "Two women as a couple",
  },
  {
    match: /singel kvinne/i,
    file: "2-Singel_kvinne.jpg",
    filename: "fertilitet-audience-singel-kvinne.jpg",
    altNo: "Singel kvinne",
    altEn: "Single woman",
  },
  {
    match: /singel mann/i,
    file: "3-Singel_mann.jpg",
    filename: "fertilitet-audience-singel-mann.jpg",
    altNo: "Singel mann",
    altEn: "Single man",
  },
] as const;

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath);
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) {
    return {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: existing._id },
    };
  }
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const doc = await sanityClient.fetch<{
    audiences: Array<{
      _key: string;
      titleNo?: string;
      image?: unknown;
      imageAlt?: unknown;
      [key: string]: unknown;
    }>;
  } | null>(
    `*[_id==$id][0]{
      "audiences": landingPage.audiencesSection.audiences[]{
        ...,
        "titleNo": title[language=="no"][0].value
      }
    }`,
    { id: DOC_ID },
  );

  if (!doc?.audiences?.length) {
    throw new Error(`Missing audiences on ${DOC_ID}`);
  }

  const uploads = await Promise.all(
    CARDS.map(async (card) => {
      const filePath = path.join(REF_DIR, card.file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing scraped asset: ${filePath}`);
      }
      const image = await uploadImage(filePath, card.filename);
      return { ...card, image };
    }),
  );

  const nextAudiences = doc.audiences.map((audience) => {
    const title = audience.titleNo || "";
    const match = uploads.find((u) => u.match.test(title));
    if (!match) return audience;
    const { titleNo: _drop, ...rest } = audience;
    return {
      ...rest,
      image: match.image,
      imageAlt: i18nString(match.altNo, match.altEn),
    };
  });

  await sanityClient
    .patch(DOC_ID)
    .set({ "landingPage.audiencesSection.audiences": nextAudiences })
    .commit({ autoGenerateArrayKeys: true });

  // Keep Studio draft in sync
  const published = await sanityClient.getDocument(DOC_ID);
  if (published) {
    const { _rev, ...rest } = published as Record<string, unknown> & { _rev?: string };
    await sanityClient.createOrReplace({ ...rest, _id: `drafts.${DOC_ID}` });
  }

  const check = await sanityClient.fetch(
    `*[_id==$id][0]{
      "audiences": landingPage.audiencesSection.audiences[]{
        "title": title[language=="no"][0].value,
        "alt": imageAlt[language=="no"][0].value,
        "url": image.asset->url,
        "original": image.asset->originalFilename
      }
    }`,
    { id: DOC_ID },
  );

  console.log(JSON.stringify(check, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
