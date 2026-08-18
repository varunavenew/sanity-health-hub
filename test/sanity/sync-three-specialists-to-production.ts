#!/usr/bin/env npx tsx
/**
 * Copy three specialist profiles from developer → production.
 *
 *   - specialist-erik-berg
 *   - specialist-kjersti-margrete-finsrud
 *   - specialist-lars-eldar-myrseth
 *
 * Copies referenced image assets. Drops cross-references (reviews, related
 * specialists) that do not already exist on production.
 *
 * Usage (from test/):
 *   $env:DRY_RUN="1"; $env:ALLOW_PRODUCTION_MIGRATION="true"; npx tsx sanity/sync-three-specialists-to-production.ts
 *   $env:ALLOW_PRODUCTION_MIGRATION="true"; npx tsx sanity/sync-three-specialists-to-production.ts
 */
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";
import { createClient, type SanityClient } from "@sanity/client";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const PROJECT_ID =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  "";
const TOKEN = process.env.SANITY_TOKEN?.trim() || "";

const SPECIALIST_IDS = [
  "specialist-erik-berg",
  "specialist-kjersti-margrete-finsrud",
  "specialist-lars-eldar-myrseth",
] as const;

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing SANITY_PROJECT_ID / SANITY_TOKEN");
  process.exit(1);
}
if (PROJECT_ID !== "9jhqpk3a") {
  throw new Error(`Unexpected project id: ${PROJECT_ID}`);
}
if (process.env.ALLOW_PRODUCTION_MIGRATION !== "true") {
  console.error("Refusing: set ALLOW_PRODUCTION_MIGRATION=true");
  process.exit(1);
}

function clientFor(dataset: "developer" | "production"): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: TOKEN,
  });
}

type RefRow = { _type?: string; _ref?: string; _key?: string };

function collectAssetIds(value: unknown, out: Set<string>) {
  if (!value) return;
  if (Array.isArray(value)) {
    for (const item of value) collectAssetIds(item, out);
    return;
  }
  if (typeof value !== "object") return;
  const row = value as Record<string, unknown>;
  const ref = row._ref;
  if (
    typeof ref === "string" &&
    (ref.startsWith("image-") || ref.startsWith("file-"))
  ) {
    out.add(ref);
  }
  for (const child of Object.values(row)) collectAssetIds(child, out);
}

function remapAssets(value: unknown, map: Map<string, string>): unknown {
  if (!value) return value;
  if (Array.isArray(value)) return value.map((v) => remapAssets(v, map));
  if (typeof value !== "object") return value;
  const row = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(row)) {
    if (key === "_ref" && typeof child === "string" && map.has(child)) {
      next[key] = map.get(child);
    } else {
      next[key] = remapAssets(child, map);
    }
  }
  return next;
}

function filterExistingRefs(
  items: unknown,
  existingIds: Set<string>,
): RefRow[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.filter((row): row is RefRow => {
    if (!row || typeof row !== "object") return false;
    const ref = (row as RefRow)._ref;
    return Boolean(ref && existingIds.has(ref));
  });
}

function sanitizeDoc(
  doc: Record<string, unknown>,
  existingIds: Set<string>,
): Record<string, unknown> {
  const next = { ...doc };
  delete next._rev;
  delete next._createdAt;
  delete next._updatedAt;
  delete next._system;

  if (Array.isArray(next.patientReviews)) {
    next.patientReviews =
      filterExistingRefs(next.patientReviews, existingIds) || [];
  }

  const related = next.relatedSpecialistsSection;
  if (related && typeof related === "object") {
    const section = { ...(related as Record<string, unknown>) };
    const filtered = filterExistingRefs(section.specialists, existingIds);
    if (filtered) section.specialists = filtered;
    next.relatedSpecialistsSection = section;
  }

  if (
    next.faqCollection &&
    typeof next.faqCollection === "object" &&
    typeof (next.faqCollection as RefRow)._ref === "string" &&
    !existingIds.has((next.faqCollection as RefRow)._ref!)
  ) {
    delete next.faqCollection;
  }

  for (const key of ["categories", "clinics"] as const) {
    const filtered = filterExistingRefs(next[key], existingIds);
    if (filtered !== undefined) next[key] = filtered;
  }

  return next;
}

async function ensureAssetsCopied(
  developer: SanityClient,
  production: SanityClient,
  assetIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!assetIds.length) return map;

  const existing = await production.fetch<string[]>(`*[_id in $ids]._id`, {
    ids: assetIds,
  });
  const existingSet = new Set(existing);
  for (const id of existing) map.set(id, id);

  const missing = assetIds.filter((id) => !existingSet.has(id));
  console.log(
    `Assets: ${assetIds.length} referenced, ${existing.length} already on production, ${missing.length} to copy`,
  );

  for (const id of missing) {
    const meta = await developer.fetch<{
      _id: string;
      _type: string;
      originalFilename?: string;
      mimeType?: string;
      url?: string;
      extension?: string;
    } | null>(
      `*[_id==$id][0]{_id,_type,originalFilename,mimeType,url,extension}`,
      { id },
    );
    if (!meta?.url) {
      console.warn(`  skip asset ${id}: missing url on developer`);
      continue;
    }
    console.log(`  copy ${id}`);
    if (DRY_RUN) {
      map.set(id, id);
      continue;
    }
    const res = await fetch(meta.url);
    if (!res.ok) throw new Error(`Asset download failed ${id}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const filename =
      meta.originalFilename ||
      `${id}.${meta.extension || (meta._type === "sanity.fileAsset" ? "bin" : "jpg")}`;
    const created = await production.assets.upload(
      meta._type === "sanity.fileAsset" ? "file" : "image",
      buf,
      { filename, contentType: meta.mimeType || undefined },
    );
    map.set(id, created._id);
    if (created._id !== id) {
      console.log(`    → remapped ${id} -> ${created._id}`);
    }
  }
  return map;
}

async function discardDraft(target: SanityClient, id: string) {
  const draftId = `drafts.${id}`;
  const exists = await target.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) await target.delete(draftId);
}

async function main() {
  const source = clientFor("developer");
  const target = clientFor("production");

  console.log("\n=== sync-three-specialists-to-production ===");
  console.log("projectId:", PROJECT_ID);
  console.log("source: developer");
  console.log("target: production");
  console.log("dryRun:", DRY_RUN);

  const sourceDocs = await source.fetch<
    Array<Record<string, unknown> & { _id: string; name?: string }>
  >(`*[_id in $ids]`, { ids: [...SPECIALIST_IDS] });

  if (sourceDocs.length !== SPECIALIST_IDS.length) {
    const found = new Set(sourceDocs.map((d) => d._id));
    const missing = SPECIALIST_IDS.filter((id) => !found.has(id));
    throw new Error(`Missing on developer: ${missing.join(", ")}`);
  }

  const prodExisting = await target.fetch<
    Array<{ _id: string; name?: string }>
  >(`*[_id in $ids]`, { ids: [...SPECIALIST_IDS] });
  if (prodExisting.length) {
    console.log(
      "Note: already on production:",
      prodExisting.map((d) => d._id).join(", "),
    );
  }

  const assetIds = new Set<string>();
  for (const doc of sourceDocs) collectAssetIds(doc, assetIds);
  const assetMap = await ensureAssetsCopied(source, target, [...assetIds]);

  const existingOnProd = new Set(
    await target.fetch<string[]>(
      `*[
        (
          _type in ["specialist", "googleReview", "review", "treatmentCategory", "clinicPage", "faqCollection"] ||
          _type == "sanity.imageAsset" ||
          _type == "sanity.fileAsset"
        ) &&
        !(_id in path("drafts.**"))
      ]._id`,
    ),
  );
  for (const [from, to] of assetMap) {
    existingOnProd.add(to);
    existingOnProd.add(from);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(process.cwd(), "..", "tmp", "production-backups");
  fs.mkdirSync(backupDir, { recursive: true });

  let created = 0;
  for (const srcRaw of sourceDocs) {
    const id = srcRaw._id;
    const remapped = remapAssets(srcRaw, assetMap) as Record<string, unknown>;
    const doc = sanitizeDoc(remapped, existingOnProd);

    const backupPath = path.join(
      backupDir,
      `${id}-production-before-${stamp}.json`,
    );
    const existing = await target.fetch(`*[_id==$id][0]`, { id });
    fs.writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          existing: existing ?? null,
        },
        null,
        2,
      ),
    );

    console.log(
      `→ ${id} (${String(doc.name || "")}): createOrReplace on production`,
    );
    created++;
    if (!DRY_RUN) {
      await target.createOrReplace(doc as Parameters<SanityClient["createOrReplace"]>[0]);
      await discardDraft(target, id);
    }
  }

  console.log("\nDone.");
  console.log(`  specialists: ${created}${DRY_RUN ? " (dry-run)" : ""}`);
  console.log(`  assets mapped: ${assetMap.size}`);
  console.log(`  backups: ${backupDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
