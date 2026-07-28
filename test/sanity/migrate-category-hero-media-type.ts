/**
 * Phase 14D — Set treatmentCategory.heroMediaType from existing media.
 *
 * Rule (preserves current website behaviour):
 *   If heroVideo exists → heroMediaType = "video"
 *   Otherwise          → heroMediaType = "image"
 *
 * Does not touch heroImage / heroVideo assets.
 *
 * Usage (from test/):
 *   npm run migrate:category-hero-media-type:dry
 *   npm run migrate:category-hero-media-type
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { sanityClient, DATASET } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, "../../docs");

type CategoryRow = {
  _id: string;
  categoryId?: string;
  title?: unknown;
  heroMediaType?: string;
  heroImage?: unknown;
  heroVideo?: unknown;
  hasHeroImage: boolean;
  hasHeroVideo: boolean;
};

function hasAsset(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const asset = (value as { asset?: { _ref?: string } }).asset;
  return Boolean(asset?._ref);
}

async function run() {
  const rows = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory"] | order(_id asc) {
      _id,
      categoryId,
      title,
      heroMediaType,
      heroImage,
      heroVideo,
      "hasHeroImage": defined(heroImage.asset),
      "hasHeroVideo": defined(heroVideo.asset)
    }`,
  );

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(
    DOCS_DIR,
    `_phase-14d_backup_${stamp}_heroMediaType.json`,
  );

  const backup = {
    dataset: DATASET,
    exportedAt: new Date().toISOString(),
    note: "Pre-migration snapshot of treatmentCategory hero media fields",
    documents: rows.map((r) => ({
      _id: r._id,
      categoryId: r.categoryId,
      heroMediaType: r.heroMediaType ?? null,
      hasHeroImage: r.hasHeroImage || hasAsset(r.heroImage),
      hasHeroVideo: r.hasHeroVideo || hasAsset(r.heroVideo),
      heroImage: r.heroImage ?? null,
      heroVideo: r.heroVideo ?? null,
    })),
  };

  if (!DRY_RUN) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), "utf8");
    console.log(`Backup written: ${backupPath}\n`);
  } else {
    console.log(`DRY_RUN — would write backup to ${backupPath}\n`);
  }

  console.log(`▶ Set heroMediaType on ${rows.length} treatmentCategory docs`);
  console.log(`  Dataset: ${DATASET}`);
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  const results: Array<{
    _id: string;
    categoryId?: string;
    hasHeroVideo: boolean;
    previous: string | null;
    next: "image" | "video";
    status: "patched" | "unchanged" | "would-patch" | "would-skip";
  }> = [];

  for (const row of rows) {
    const hasVideo = row.hasHeroVideo || hasAsset(row.heroVideo);
    const next: "image" | "video" = hasVideo ? "video" : "image";
    const previous = row.heroMediaType ?? null;
    const needsPatch = previous !== next;

    let status: (typeof results)[number]["status"];
    if (!needsPatch) {
      status = DRY_RUN ? "would-skip" : "unchanged";
    } else if (DRY_RUN) {
      status = "would-patch";
    } else {
      await sanityClient.patch(row._id).set({ heroMediaType: next }).commit();
      status = "patched";
    }

    results.push({
      _id: row._id,
      categoryId: row.categoryId,
      hasHeroVideo: hasVideo,
      previous,
      next,
      status,
    });

    const mark =
      status === "patched" || status === "would-patch" ? "✎" : "·";
    console.log(
      `  ${mark} ${row.categoryId ?? row._id}: ${previous ?? "(unset)"} → ${next} [${status}]`,
    );
  }

  const runLogPath = path.join(
    DOCS_DIR,
    "TREATMENT_CATEGORY_HERO_MEDIA_TYPE_MIGRATION_RUN.json",
  );
  const runLog = {
    dataset: DATASET,
    ranAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    backupPath: DRY_RUN ? null : backupPath,
    results,
  };

  if (!DRY_RUN) {
    fs.writeFileSync(runLogPath, JSON.stringify(runLog, null, 2), "utf8");
    console.log(`\nRun log: ${runLogPath}`);
  }

  const patched = results.filter(
    (r) => r.status === "patched" || r.status === "would-patch",
  ).length;
  console.log(
    `\n✅ ${DRY_RUN ? "Would patch" : "Patched"} ${patched} / ${rows.length} documents`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
