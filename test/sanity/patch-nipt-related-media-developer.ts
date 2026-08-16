#!/usr/bin/env npx tsx
/**
 * Developer-only: NIPT related services + hero/media parity vs avenewdemo.
 *
 * - Download demo hero/card images and set treatment.heroImage
 * - Fix related list refs/order
 * - Spontanabort: graviditet category first (path /graviditet/spontanabort)
 * - Graviditet card: slug → svangerskapsoppfolging (demo href)
 *
 *   cd test && npx tsx sanity/patch-nipt-related-media-developer.ts
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.join(__dirname, "..", "..", "tmp", "nipt-demo-media");

const ACCESS = "cmedical2026";
const DEMO_ORIGIN = "https://avenewdemo.online";

type MediaTarget = {
  id: string;
  file: string;
  url: string;
  titleNo: string;
};

/** Demo asset URLs from scrape of /behandlinger/graviditet/nipt */
const MEDIA: MediaTarget[] = [
  {
    id: "treatment-graviditet-nipt",
    file: "nipt.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/a49611b0-6915-4d08-bf9d-325ce074e684/nipt.png`,
    titleNo: "NIPT",
  },
  {
    id: "treatment-gynekologi-graviditet",
    file: "gynekologi-graviditet.jpg",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/e878873e-757c-486a-9237-da27e1855464/gynekologi-graviditet.jpg`,
    titleNo: "Graviditet",
  },
  {
    id: "treatment-gynekologi-spontanabort",
    file: "gynekologi-spontanabort.jpg",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/62084f5a-81d5-4abf-9620-8c776ad3fbf8/gynekologi-spontanabort.jpg`,
    titleNo: "Spontanabort",
  },
  {
    id: "treatment-gynekologi-fodselsskader",
    file: "fodselsskader-ny.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/efeda2d1-42b2-4e96-85d1-4345ec52a3be/fodselsskader-ny.png`,
    titleNo: "Fødselsskader",
  },
  {
    id: "treatment-gynekologi-fostermedisin",
    file: "fostermedisin.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/658bb1ef-779c-4d2a-b2ec-9a9bdaf79d98/fostermedisin.png`,
    titleNo: "Fostermedisin",
  },
  {
    id: "treatment-graviditet-ultralyd",
    file: "ultralyd.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/fa1d37d6-c263-43d7-a8bc-52ab9a6b3478/ultralyd.png`,
    titleNo: "Ultralyd i svangerskapet",
  },
  {
    id: "treatment-graviditet-6-ukerskontroll",
    file: "6-ukerskontroll.jpg",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/5b326de0-1253-4543-815b-9674aacdbe7e/6-ukerskontroll.jpg`,
    titleNo: "6-ukerskontroll etter fødsel",
  },
  {
    id: "treatment-graviditet-svangerskapsteam",
    file: "svangerskapsteam.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/9d4695fd-9fc5-4b83-9715-f2eca00829cc/svangerskapsteam.png`,
    titleNo: "Graviditetsoppfølging",
  },
  {
    id: "treatment-graviditet-fosterdiagnostikk",
    file: "fosterdiagnostikk.png",
    url: `${DEMO_ORIGIN}/__l5e/assets-v1/f6c4985e-de45-42bf-bf97-fb82881c7497/fosterdiagnostikk.png`,
    titleNo: "Fosterdiagnostikk",
  },
];

/** Demo related order on NIPT */
const NIPT_RELATED_IDS = [
  "treatment-gynekologi-graviditet", // Graviditet → /graviditet/svangerskapsoppfolging
  "treatment-gynekologi-spontanabort",
  "treatment-gynekologi-fodselsskader",
  "treatment-gynekologi-fostermedisin",
  "treatment-graviditet-ultralyd",
  "treatment-graviditet-6-ukerskontroll",
  "treatment-graviditet-svangerskapsteam",
  "treatment-graviditet-fosterdiagnostikk",
] as const;

const CAT_GRAVIDITET = "category-graviditet";
const CAT_GYNEKOLOGI = "category-gynekologi";

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

function slugField(noSlug: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: noSlug },
    },
    {
      _key: "en",
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: noSlug },
    },
  ];
}

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function downloadAll() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  for (const m of MEDIA) {
    const dest = path.join(MEDIA_DIR, m.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`  keep ${m.file}`);
      continue;
    }
    console.log(`  download ${m.file}`);
    const res = await fetch(m.url, {
      headers: {
        // password gate sometimes needs cookie; try direct asset first
        Cookie: `access=${ACCESS}`,
      },
    });
    if (!res.ok) {
      // retry via unlocked session not available here — try without cookie
      const res2 = await fetch(m.url);
      if (!res2.ok) throw new Error(`Failed ${m.url}: ${res.status}/${res2.status}`);
      const buf = Buffer.from(await res2.arrayBuffer());
      fs.writeFileSync(dest, buf);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
  }
}

async function uploadImage(filePath: string, filename: string) {
  const buffer = fs.readFileSync(filePath);
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) {
    return { assetId: existing._id, reused: true as const };
  }
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: contentTypeFor(filename),
  });
  return { assetId: asset._id, reused: false as const };
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists && !DRY_RUN) await sanityClient.delete(draftId);
}

async function patchHero(id: string, assetId: string, titleNo: string) {
  console.log(`→ hero ${id} ← ${assetId}`);
  if (DRY_RUN) return;
  await sanityClient
    .patch(id)
    .set({
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      },
      // FE prefers heroMedia when present — keep both in sync.
      heroMedia: {
        _type: "media",
        mediaType: "image",
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        },
      },
      heroImageAlt: i18nString(titleNo),
    })
    .commit();
  await discardDraft(id);
}

async function fixPathsAndRelated() {
  // Graviditet card: demo URL /graviditet/svangerskapsoppfolging
  console.log("→ slug treatment-gynekologi-graviditet → svangerskapsoppfolging");
  if (!DRY_RUN) {
    await sanityClient
      .patch("treatment-gynekologi-graviditet")
      .set({
        title: i18nString("Graviditet"),
        slug: slugField("svangerskapsoppfolging"),
        categories: [
          {
            _key: refKey(),
            _type: "reference",
            _ref: CAT_GRAVIDITET,
          },
        ],
      })
      .commit();
    await discardDraft("treatment-gynekologi-graviditet");
  }

  // Spontanabort: graviditet first so related path is /graviditet/spontanabort
  console.log("→ categories treatment-gynekologi-spontanabort (graviditet first)");
  if (!DRY_RUN) {
    await sanityClient
      .patch("treatment-gynekologi-spontanabort")
      .set({
        categories: [
          { _key: refKey(), _type: "reference", _ref: CAT_GRAVIDITET },
          { _key: refKey(), _type: "reference", _ref: CAT_GYNEKOLOGI },
        ],
      })
      .commit();
    await discardDraft("treatment-gynekologi-spontanabort");
  }

  // NIPT related list
  console.log("→ NIPT relatedSection items (demo order)");
  if (!DRY_RUN) {
    await sanityClient
      .patch("treatment-graviditet-nipt")
      .set({
        relatedSection: {
          _type: "object",
          title: i18nString("Relaterte tjenester", "Related services"),
          seeAllHref: "/graviditet",
          seeAllLabel: i18nString(
            "Se alle graviditet-tjenester",
            "See all pregnancy services",
          ),
          asIntro: false,
          asServices: true,
          items: refs(NIPT_RELATED_IDS),
        },
      })
      .commit({ autoGenerateArrayKeys: true });
    await discardDraft("treatment-graviditet-nipt");
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Bad project ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Bad dataset ${DATASET}`);

  console.log(`DRY_RUN=${DRY_RUN}`);
  console.log("Downloading demo media…");
  await downloadAll();

  for (const m of MEDIA) {
    const filePath = path.join(MEDIA_DIR, m.file);
    if (!fs.existsSync(filePath)) throw new Error(`Missing ${filePath}`);
    const size = fs.statSync(filePath).size;
    if (size < 500) throw new Error(`Too small ${m.file} (${size}b) — download failed?`);
    const { assetId, reused } = await uploadImage(filePath, m.file);
    console.log(`  asset ${m.file} → ${assetId}${reused ? " (reuse)" : ""}`);
    await patchHero(m.id, assetId, m.titleNo);
  }

  await fixPathsAndRelated();

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-graviditet-nipt"][0]{
      "hero": heroImage.asset->originalFilename,
      "heroUrl": heroImage.asset->url,
      "related": relatedSection.items[]->{
        _id,
        "title": coalesce(title[language=="no"][0].value, title[0].value),
        "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
        "cat0": coalesce(categories[0]->slug[language=="no"][0].value.current, categories[0]->categoryId),
        "heroFile": heroImage.asset->originalFilename
      }
    }`,
  );
  console.log("\n✓ verify");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
