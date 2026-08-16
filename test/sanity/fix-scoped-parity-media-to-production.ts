/**
 * Fix media + related-card mismatch after scoped content sync.
 *
 * Root cause of local≠live (e.g. Infertilitet):
 * - Promise/hero assets that only existed on developer were skipped → old prod images kept
 * - Related audience treatments missing on production → related list truncated / wrong cards
 *
 * This script (scoped IDs only):
 * 1) Copies missing image/file assets developer → production
 * 2) Creates the few missing scoped treatment docs (audience fertility + 6-ukerskontroll)
 * 3) Force-patches UI+media fields with remapped asset refs (no prod-image fallback)
 *
 * Usage (from test/):
 *   DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/fix-scoped-parity-media-to-production.ts
 *   ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/fix-scoped-parity-media-to-production.ts
 *
 * Optional:
 *   ONLY_GROUP=fertility|flere|graviditet|ortopedi|urologi
 */
import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient, type SanityClient } from "@sanity/client";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_GROUP = (process.env.ONLY_GROUP || "").trim().toLowerCase();
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

const FERTILITY_IDS = [
  "treatment-fertilitet-fertilitetsutredning",
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-eggfrys",
  "treatment-fertilitet-donorbehandling",
  "treatment-fertilitet-saedanalyse",
  "treatment-fertilitet-infertilitet",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  "treatment-fertilitet-to-kvinner-i-parforhold",
  "treatment-fertilitet-singel-kvinne",
  "treatment-fertilitet-singel-mann",
] as const;

const FLERE_IDS = [
  "treatment-flere-fagomrader-endokrinologi",
  "treatment-flere-fagomrader-ernaringsfysiolog",
  "treatment-flere-fagomrader-hudhelse",
  "treatment-flere-fagomrader-hudbehandlinger",
  "treatment-flere-fagomrader-gastrokirurgi",
  "treatment-flere-fagomrader-plastikkirurgi",
  "treatment-flere-fagomrader-robotkirurgi",
  "treatment-flere-fagomrader-areknuter",
  "treatment-flere-fagomrader-osteopati",
  "treatment-flere-fagomrader-revmatologi",
  "treatment-flere-fagomrader-psykologi",
  "treatment-flere-fagomrader-sexologi",
  "treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon",
  "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager",
  "treatment-flere-fagomrader-overvektskirurgi",
  "treatment-flere-fagomrader-hudpleieprodukter",
  "treatment-flere-fagomrader-behandlingsutstyr",
  "treatment-flere-fagomrader-hudbehandlinger-foflekksjekk",
  "treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi",
  "treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum",
  "treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur",
  "treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader",
  "treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar",
] as const;

const GRAVIDITET_IDS = [
  "treatment-graviditet-nipt",
  "treatment-graviditet-ultralyd",
  "treatment-graviditet-6-ukerskontroll",
  "treatment-graviditet-svangerskapsteam",
  "treatment-graviditet-fosterdiagnostikk",
] as const;

/** Ortopedi pages patched on developer (patch-ortopedi-all-5-content-developer). */
const ORTOPEDI_IDS = [
  "treatment-ortopedi-skulder",
  "treatment-ortopedi-kne",
  "treatment-ortopedi-hofte",
  "treatment-ortopedi-hand-albue",
  "treatment-ortopedi-fot-ankel",
] as const;

/** Urologi pages patched on developer (patch-urologi-all-9-content-developer). */
const UROLOGI_IDS = [
  "treatment-urologi-blaere",
  "treatment-urologi-forhud",
  "treatment-urologi-infertilitet",
  "treatment-urologi-nyrer",
  "treatment-urologi-prostata",
  "treatment-urologi-refertilisering",
  "treatment-urologi-robotkirurgi",
  "treatment-urologi-sterilisering",
  "treatment-urologi-testikler",
] as const;

const GROUPS: Record<string, readonly string[]> = {
  fertility: FERTILITY_IDS,
  flere: FLERE_IDS,
  graviditet: GRAVIDITET_IDS,
  ortopedi: ORTOPEDI_IDS,
  urologi: UROLOGI_IDS,
};

const SCOPED_IDS = ONLY_GROUP
  ? [...(GROUPS[ONLY_GROUP] || [])]
  : [
      ...FERTILITY_IDS,
      ...FLERE_IDS,
      ...GRAVIDITET_IDS,
      ...ORTOPEDI_IDS,
      ...UROLOGI_IDS,
    ];

if (ONLY_GROUP && !GROUPS[ONLY_GROUP]) {
  console.error(
    `Unknown ONLY_GROUP=${ONLY_GROUP}. Use fertility|flere|graviditet|ortopedi|urologi`,
  );
  process.exit(1);
}

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
  "promises",
  "conversationCtaTitle",
  "midCtaPrimaryLabel",
  "midCtaCallLabel",
  "midCtaShowCallButton",
  "relatedSection",
  "pageSections",
  "bookingService",
  "heroImage",
  "heroMedia",
  "heroImageAlt",
  "srOnlyTitle",
  "geoSummary",
  "seo",
] as const;

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
    if (
      key === "_ref" &&
      typeof child === "string" &&
      map.has(child)
    ) {
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
    return row;
  });
}

function stripSystem(doc: Record<string, unknown>) {
  const { _createdAt, _updatedAt, _rev, ...rest } = doc;
  return rest;
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

async function main() {
  const source = clientFor("developer");
  const target = clientFor("production");

  console.log(
    `Fix scoped parity media developer → production (DRY_RUN=${DRY_RUN ? "1" : "0"})`,
  );
  console.log(
    `Scoped IDs: ${SCOPED_IDS.length}${ONLY_GROUP ? ` (group=${ONLY_GROUP})` : ""}`,
  );

  const sourceDocs = await source.fetch<
    Array<Record<string, unknown> & { _id: string }>
  >(`*[_id in $ids]`, { ids: SCOPED_IDS });
  const sourceById = new Map(sourceDocs.map((d) => [d._id, d]));

  const assetIds = new Set<string>();
  for (const doc of sourceDocs) collectAssetIds(doc, assetIds);
  const assetMap = await ensureAssetsCopied(source, target, [...assetIds]);

  let existingOnProd = new Set(
    await target.fetch<string[]>(
      `*[
        (
          _type in ["treatment", "specialist", "review", "ctaCollection", "treatmentCategory"] ||
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

  // Create missing scoped treatments first (so related refs resolve).
  let created = 0;
  for (const id of SCOPED_IDS) {
    if (existingOnProd.has(id)) continue;
    const src = sourceById.get(id);
    if (!src) {
      console.log(`skip create ${id}: missing on developer`);
      continue;
    }
    let body = remapAssets(stripSystem(src), assetMap) as Record<
      string,
      unknown
    > & { _id: string; _type: string };

    if (body.relatedSection) {
      body.relatedSection = sanitizeRelatedSection(
        body.relatedSection,
        existingOnProd,
      );
    }
    if (body.pageSections) {
      body.pageSections = sanitizePageSections(
        body.pageSections,
        existingOnProd,
      );
    }
    if (Array.isArray(body.categories)) {
      body.categories =
        filterExistingRefs(body.categories, existingOnProd) || [];
    }
    if (
      body.category &&
      typeof body.category === "object" &&
      typeof (body.category as RefRow)._ref === "string" &&
      !existingOnProd.has((body.category as RefRow)._ref!)
    ) {
      delete body.category;
    }

    console.log(`CREATE ${id}`);
    created++;
    if (!DRY_RUN) {
      await target.createOrReplace(body);
      existingOnProd.add(id);
    }
  }

  // Refresh existence set after creates
  if (!DRY_RUN && created > 0) {
    existingOnProd = new Set(
      await target.fetch<string[]>(
        `*[
          (
            _type in ["treatment", "specialist", "review", "ctaCollection", "treatmentCategory"] ||
            _type == "sanity.imageAsset" ||
            _type == "sanity.fileAsset"
          ) &&
          !(_id in path("drafts.**"))
        ]._id`,
      ),
    );
  } else if (DRY_RUN) {
    for (const id of SCOPED_IDS) {
      if (sourceById.has(id)) existingOnProd.add(id);
    }
  }

  const targetDocs = await target.fetch<
    Array<Record<string, unknown> & { _id: string }>
  >(`*[_id in $ids]{ _id, ${FORCE_FIELDS.join(", ")} }`, {
    ids: SCOPED_IDS,
  });
  const targetById = new Map(targetDocs.map((d) => [d._id, d]));

  let updated = 0;
  let unchanged = 0;
  let missingProd = 0;

  for (const id of SCOPED_IDS) {
    const srcRaw = sourceById.get(id);
    const dst = targetById.get(id);
    if (!srcRaw) continue;
    if (!dst && !DRY_RUN) {
      missingProd++;
      console.log(`skip patch ${id}: still missing on production`);
      continue;
    }

    const src = remapAssets(srcRaw, assetMap) as Record<string, unknown> & {
      _id: string;
    };
    const patch: Record<string, unknown> = {};
    const changed: string[] = [];

    for (const key of FORCE_FIELDS) {
      if (!(key in src) || src[key] === undefined) continue;
      let nextValue = src[key];
      if (key === "relatedSection") {
        nextValue = sanitizeRelatedSection(nextValue, existingOnProd);
      }
      if (key === "pageSections") {
        nextValue = sanitizePageSections(nextValue, existingOnProd);
      }
      const prev = dst?.[key];
      if (stableJson(nextValue) === stableJson(prev)) continue;
      patch[key] = nextValue;
      changed.push(key);
    }

    if (!changed.length) {
      unchanged++;
      continue;
    }

    console.log(`→ ${id}: ${changed.join(", ")}`);
    updated++;
    if (!DRY_RUN) {
      await target.patch(id).set(patch).commit({ autoGenerateArrayKeys: true });
      const draftId = `drafts.${id}`;
      const draftExists = await target.fetch<string | null>(
        `*[_id==$id][0]._id`,
        { id: draftId },
      );
      if (draftExists) await target.delete(draftId);
    }
  }

  console.log("\nDone.");
  console.log(`  assets mapped: ${assetMap.size}`);
  console.log(`  created treatments: ${created}`);
  console.log(`  updated: ${updated}`);
  console.log(`  unchanged: ${unchanged}`);
  console.log(`  missing production: ${missingProd}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
