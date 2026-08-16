#!/usr/bin/env npx tsx
/**
 * Developer-only: sync fertility treatment heroImage to avenewdemo hero assets.
 *
 *   cd test && npx tsx sanity/patch-fertility-hero-media-developer.ts
 *
 * Reads images from ../tmp/fertility-demo-heroes/ (downloaded demo heroes).
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_DIR = path.join(__dirname, "..", "..", "tmp", "fertility-demo-heroes");
const VERIFY_OUT = path.join(__dirname, "..", "..", "tmp", "fertility-media-verify.json");

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en?: string): I18nItem[] {
  const enVal = en ?? no;
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
      value: enVal,
    },
  ];
}

function contentTypeFor(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

/** Treatments that previously reused a shared hero (sameVisualGuess: no). */
const NEEDS_FIX = new Set([
  "treatment-fertilitet-fertilitetsutredning",
  "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  "treatment-fertilitet-to-kvinner-i-parforhold",
  "treatment-fertilitet-singel-kvinne",
  "treatment-fertilitet-singel-mann",
]);

const TREATMENTS = [
  {
    id: "treatment-fertilitet-fertilitetsutredning",
    slug: "fertilitetsutredning",
    file: "fertilitet-fertilitetsutredning.jpg",
    titleNo: "Fertilitetsutredning",
  },
  {
    id: "treatment-fertilitet-assistert-befruktning",
    slug: "assistert-befruktning",
    file: "fertilitet-assistert-befruktning.jpg",
    titleNo: "Assistert befruktning",
  },
  {
    id: "treatment-fertilitet-eggfrys",
    slug: "eggfrys",
    file: "fertilitet-eggfrys.jpg",
    titleNo: "Eggfrys",
  },
  {
    id: "treatment-fertilitet-donorbehandling",
    slug: "donorbehandling",
    file: "fertilitet-donorbehandling.jpg",
    titleNo: "Donorbehandling",
  },
  {
    id: "treatment-fertilitet-saedanalyse",
    slug: "saedanalyse",
    file: "fertilitet-saedanalyse.jpg",
    titleNo: "Sædanalyse",
  },
  {
    id: "treatment-fertilitet-infertilitet",
    slug: "infertilitet",
    file: "fertilitet-infertilitet.jpg",
    titleNo: "Infertilitet",
  },
  {
    id: "treatment-fertilitet-hysteroskopi",
    slug: "hysteroskopi",
    file: "hysteroskopi.png",
    titleNo: "Hysteroskopi",
  },
  {
    id: "treatment-fertilitet-assistert-befruktning-for-par-og-single",
    slug: "par-og-single",
    file: "assistert-befruktning-par-og-single.png",
    titleNo: "Assistert befruktning for par og single",
  },
  {
    id: "treatment-fertilitet-mann-og-kvinne-i-parforhold",
    slug: "mann-og-kvinne-i-parforhold",
    file: "heterofilt-par.png",
    titleNo: "Mann og kvinne i parforhold",
  },
  {
    id: "treatment-fertilitet-to-kvinner-i-parforhold",
    slug: "to-kvinner-i-parforhold",
    file: "to-kvinner.png",
    titleNo: "To kvinner i parforhold",
  },
  {
    id: "treatment-fertilitet-singel-kvinne",
    slug: "singel-kvinne",
    file: "singel-kvinne.png",
    titleNo: "Singel kvinne",
  },
  {
    id: "treatment-fertilitet-singel-mann",
    slug: "singel-mann",
    file: "mannlig-fertilitet.png",
    titleNo: "Singel mann",
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
    return { assetId: existing._id, reused: true as const, bytes: buffer.length };
  }
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: contentTypeFor(filename),
  });
  return { assetId: asset._id, reused: false as const, bytes: buffer.length };
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  if (!fs.existsSync(HERO_DIR)) {
    throw new Error(`Missing hero dir: ${HERO_DIR}`);
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET}`);
  console.log(`heroes from ${HERO_DIR}`);

  const results: Array<{
    id: string;
    slug: string;
    file: string;
    assetId: string;
    reused: boolean;
    fixed: boolean;
    previousRef?: string | null;
  }> = [];

  for (const t of TREATMENTS) {
    const filePath = path.join(HERO_DIR, t.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing image: ${filePath}`);
    }

    const before = await sanityClient.fetch<{
      _id: string;
      heroRef?: string | null;
    } | null>(
      `*[_id==$id][0]{_id, "heroRef": heroImage.asset._ref}`,
      { id: t.id },
    );
    if (!before?._id) {
      throw new Error(`Missing published treatment: ${t.id}`);
    }

    const upload = await uploadImage(filePath, t.file);
    const heroImage = {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: upload.assetId },
    };

    await sanityClient
      .patch(t.id)
      .set({
        heroImage,
        heroImageAlt: i18nString(t.titleNo),
      })
      .commit();

    await discardDraft(t.id);

    const fixed = NEEDS_FIX.has(t.id);
    results.push({
      id: t.id,
      slug: t.slug,
      file: t.file,
      assetId: upload.assetId,
      reused: upload.reused,
      fixed,
      previousRef: before.heroRef,
    });

    console.log(
      `${fixed ? "FIXED" : "SYNC "} ${t.slug} → ${upload.assetId}${upload.reused ? " (sha reuse)" : " (uploaded)"}`,
    );
  }

  const ids = TREATMENTS.map((t) => t.id);
  const verifyRows = await sanityClient.fetch(
    `*[_id in $ids]{
      _id,
      "slug": coalesce(slug[language=="no"][0].value.current, slug[0].value.current),
      "titleNo": coalesce(title[language=="no"][0].value, title[0].value),
      "heroImageRef": heroImage.asset._ref,
      "heroImageUrl": heroImage.asset->url,
      "heroOriginalFilename": heroImage.asset->originalFilename,
      "heroImageAltNo": heroImageAlt[language=="no"][0].value
    }`,
    { ids },
  );

  const byId = Object.fromEntries(
    (verifyRows as Array<{ _id: string }>).map((r) => [r._id, r]),
  );
  const treatments = TREATMENTS.map((t) => {
    const row = byId[t.id] as
      | {
          heroImageRef?: string;
          heroImageUrl?: string;
          heroOriginalFilename?: string;
          heroImageAltNo?: string;
          titleNo?: string;
        }
      | undefined;
    const patch = results.find((r) => r.id === t.id)!;
    return {
      slug: t.slug,
      sanityId: t.id,
      demoFile: t.file,
      fixed: patch.fixed,
      uploadedAssetId: patch.assetId,
      previousRef: patch.previousRef,
      reusedExistingSha: patch.reused,
      heroImageRef: row?.heroImageRef ?? null,
      heroImageUrl: row?.heroImageUrl ?? null,
      heroOriginalFilename: row?.heroOriginalFilename ?? null,
      heroImageAltNo: row?.heroImageAltNo ?? null,
      titleNo: row?.titleNo ?? t.titleNo,
    };
  });

  const uniqueRefs = new Set(
    treatments.map((t) => t.heroImageRef).filter(Boolean),
  );
  const verify = {
    generatedAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    fixedCount: treatments.filter((t) => t.fixed).length,
    uniqueHeroCount: uniqueRefs.size,
    allDistinct: uniqueRefs.size === 12,
    fixed: treatments.filter((t) => t.fixed).map((t) => ({
      slug: t.slug,
      sanityId: t.sanityId,
      assetId: t.uploadedAssetId,
      demoFile: t.demoFile,
      previousRef: t.previousRef,
    })),
    treatments,
  };

  fs.writeFileSync(VERIFY_OUT, JSON.stringify(verify, null, 2));
  console.log("\nwrote", VERIFY_OUT);
  console.log(
    `unique heroes: ${uniqueRefs.size}/12 (allDistinct=${verify.allDistinct})`,
  );
  console.log(
    "fixed:",
    verify.fixed.map((f) => f.slug).join(", "),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
