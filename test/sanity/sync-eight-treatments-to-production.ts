#!/usr/bin/env npx tsx
/**
 * Force-sync the 8 staging-404 treatment pages (plus brokkoperasjon hero
 * and Marian Bale specialties) from developer → production.
 *
 * Overwrites production content so it matches developer. Copies missing
 * assets. Unsets fields that were cleared on developer (e.g. hemorroider
 * flow, areknuter Om-section).
 *
 * Usage (from test/):
 *   $env:DRY_RUN="1"; $env:ALLOW_PRODUCTION_MIGRATION="true"; npx tsx sanity/sync-eight-treatments-to-production.ts
 *   $env:ALLOW_PRODUCTION_MIGRATION="true"; npx tsx sanity/sync-eight-treatments-to-production.ts
 */
import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient, type SanityClient } from "@sanity/client";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1";
const PROJECT_ID =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  "";
const TOKEN = process.env.SANITY_TOKEN?.trim() || "";

if (!PROJECT_ID || !TOKEN) {
  console.error("Missing SANITY_PROJECT_ID / SANITY_TOKEN");
  process.exit(1);
}
if (process.env.ALLOW_PRODUCTION_MIGRATION !== "true") {
  console.error("Refusing: set ALLOW_PRODUCTION_MIGRATION=true");
  process.exit(1);
}

/** The 8 pages that 404'd on staging, plus brokkoperasjon related-card image. */
const TREATMENT_IDS = [
  "treatment-urologi-blaere",
  "treatment-urologi-testikler",
  "treatment-urologi-infertilitet",
  "treatment-ortopedi-fot-ankel",
  "treatment-graviditet-ultralyd",
  "treatment-gynekologi-vulvalidelser",
  "treatment-flere-fagomrader-areknuter",
  "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager",
  "treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon",
] as const;

const SPECIALIST_ID = "specialist-marian-bale";

const FORCE_FIELDS = [
  "title",
  "heroTitle",
  "heroDescription",
  "description",
  "heroPrice",
  "heroPriceLabel",
  "heroAvailability",
  "heroThemes",
  "heroPoints",
  "themesAriaLabel",
  "primaryCtaLabel",
  "callCtaLabel",
  "hideSeePriser",
  "reasonsTitle",
  "reasonsLead",
  "reasonsLead2",
  "reasonsLayout",
  "reasons",
  "flow",
  "flowTitle",
  "flowImage",
  "flowImageAlt",
  "flowLinkLabel",
  "flowLinkHref",
  "flowEyebrow",
  "promises",
  "conversationCtaTitle",
  "midCtaPrimaryLabel",
  "midCtaCallLabel",
  "midCtaShowCallButton",
  "relatedSection",
  "pageSections",
  "insuranceEyebrow",
  "insuranceTitle",
  "insurancePartners",
  "bookingService",
  "heroImage",
  "heroMedia",
  "heroImageAlt",
  "srOnlyTitle",
  "geoSummary",
  "seo",
  "categories",
  "slug",
] as const;

const UNSET_IF_EMPTY = [
  "flow",
  "flowTitle",
  "flowImage",
  "flowImageAlt",
  "flowLinkLabel",
  "flowLinkHref",
  "flowEyebrow",
  "reasons",
  "reasonsTitle",
  "reasonsLead",
  "reasonsLead2",
  "heroPrice",
  "heroPriceLabel",
  "faqs",
  "faqCollection",
  "faqSectionTitle",
] as const;

const SPECIALIST_FIELDS = ["specialties", "role", "subtitle"] as const;

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: TOKEN,
  });
}

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

type RefRow = { _type?: string; _ref?: string; _key?: string };

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

function sanitizeRelatedSection(
  related: unknown,
  existingIds: Set<string>,
): unknown {
  if (!related || typeof related !== "object") return related;
  const section = { ...(related as Record<string, unknown>) };
  const filtered = filterExistingRefs(section.items, existingIds);
  if (filtered) section.items = filtered;
  return section;
}

function sanitizePageSections(
  sections: unknown,
  existingIds: Set<string>,
): unknown {
  if (!Array.isArray(sections)) return sections;
  return sections.map((section) => {
    if (!section || typeof section !== "object") return section;
    const row = { ...(section as Record<string, unknown>) };
    if (Array.isArray(row.specialists)) {
      row.specialists = filterExistingRefs(row.specialists, existingIds) || [];
    }
    if (Array.isArray(row.reviews)) {
      row.reviews = filterExistingRefs(row.reviews, existingIds) || [];
    }
    if (
      row.ctaCollection &&
      typeof row.ctaCollection === "object" &&
      typeof (row.ctaCollection as RefRow)._ref === "string" &&
      !existingIds.has((row.ctaCollection as RefRow)._ref!)
    ) {
      delete row.ctaCollection;
    }
    if (
      row.insuranceCollection &&
      typeof row.insuranceCollection === "object" &&
      typeof (row.insuranceCollection as RefRow)._ref === "string" &&
      !existingIds.has((row.insuranceCollection as RefRow)._ref!)
    ) {
      delete row.insuranceCollection;
    }
    return row;
  });
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
}

function stableJson(value: unknown): string {
  return JSON.stringify(value ?? null);
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
  const allIds = [...TREATMENT_IDS, SPECIALIST_ID];

  console.log(
    `Sync 8 treatments developer → production (DRY_RUN=${DRY_RUN ? "1" : "0"})`,
  );

  const sourceDocs = await source.fetch<
    Array<Record<string, unknown> & { _id: string }>
  >(`*[_id in $ids]`, { ids: allIds });
  const sourceById = new Map(sourceDocs.map((d) => [d._id, d]));

  const assetIds = new Set<string>();
  for (const doc of sourceDocs) collectAssetIds(doc, assetIds);
  const assetMap = await ensureAssetsCopied(source, target, [...assetIds]);

  let existingOnProd = new Set(
    await target.fetch<string[]>(
      `*[
        (
          _type in ["treatment", "specialist", "review", "ctaCollection", "insuranceCollection", "treatmentCategory"] ||
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

  const targetDocs = await target.fetch<
    Array<Record<string, unknown> & { _id: string }>
  >(`*[_id in $ids]`, { ids: allIds });
  const targetById = new Map(targetDocs.map((d) => [d._id, d]));

  let updated = 0;
  let unchanged = 0;

  for (const id of TREATMENT_IDS) {
    const srcRaw = sourceById.get(id);
    const dst = targetById.get(id);
    if (!srcRaw) {
      console.log(`skip ${id}: missing on developer`);
      continue;
    }
    if (!dst) {
      console.log(`skip ${id}: missing on production`);
      continue;
    }

    const src = remapAssets(srcRaw, assetMap) as Record<string, unknown>;
    const patch: Record<string, unknown> = {};
    const changed: string[] = [];
    const unset: string[] = [];

    for (const key of FORCE_FIELDS) {
      if (!(key in src) || src[key] === undefined) continue;
      let nextValue = src[key];
      if (key === "relatedSection") {
        nextValue = sanitizeRelatedSection(nextValue, existingOnProd);
      }
      if (key === "pageSections") {
        nextValue = sanitizePageSections(nextValue, existingOnProd);
      }
      if (stableJson(nextValue) === stableJson(dst[key])) continue;
      patch[key] = nextValue;
      changed.push(key);
    }

    for (const key of UNSET_IF_EMPTY) {
      if (isEmpty(src[key]) && !isEmpty(dst[key])) {
        unset.push(key);
        delete patch[key];
      }
    }

    if (!changed.length && !unset.length) {
      unchanged++;
      continue;
    }

    console.log(
      `→ ${id}: set=[${changed.join(", ")}] unset=[${unset.join(", ")}]`,
    );
    updated++;
    if (!DRY_RUN) {
      let p = target.patch(id);
      if (Object.keys(patch).length) p = p.set(patch);
      if (unset.length) p = p.unset(unset);
      await p.commit({ autoGenerateArrayKeys: true });
      await discardDraft(target, id);
    }
  }

  const specSrc = sourceById.get(SPECIALIST_ID);
  const specDst = targetById.get(SPECIALIST_ID);
  if (specSrc && specDst) {
    const patch: Record<string, unknown> = {};
    const changed: string[] = [];
    for (const key of SPECIALIST_FIELDS) {
      if (!(key in specSrc) || specSrc[key] === undefined) continue;
      if (stableJson(specSrc[key]) === stableJson(specDst[key])) continue;
      patch[key] = specSrc[key];
      changed.push(key);
    }
    if (changed.length) {
      console.log(`→ ${SPECIALIST_ID}: set=[${changed.join(", ")}]`);
      updated++;
      if (!DRY_RUN) {
        await target
          .patch(SPECIALIST_ID)
          .set(patch)
          .commit({ autoGenerateArrayKeys: true });
        await discardDraft(target, SPECIALIST_ID);
      }
    } else {
      unchanged++;
    }
  }

  console.log("\nDone.");
  console.log(`  assets mapped: ${assetMap.size}`);
  console.log(`  updated: ${updated}${DRY_RUN ? " (dry-run)" : ""}`);
  console.log(`  unchanged: ${unchanged}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
