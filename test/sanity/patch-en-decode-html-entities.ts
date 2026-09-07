#!/usr/bin/env npx tsx
/**
 * Decode literal HTML entities in English i18n fields on treatment + specialist docs.
 *
 * Fixes EN strings like &#10;, &#39;, &quot;, &apos;, &hellip;
 *
 * Usage (from test/):
 *   npm run patch:en-decode-entities:dry
 *   npm run patch:en-decode-entities
 *
 * Production (intentional):
 *   npm run patch:en-decode-entities:production:dry
 *   npm run patch:en-decode-entities:production
 */
import { DATASET, sanityClient } from "./config";
import {
  containsHtmlEntities,
  decodeHtmlEntities,
} from "./lib/decode-html-entities";

const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_TYPES = (process.env.ONLY || "treatment,specialist")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const I18N_VALUE_TYPES = new Set([
  "internationalizedArrayStringValue",
  "internationalizedArrayTextValue",
  "internationalizedArrayBlockContentValue",
]);

type I18nItem = {
  _type?: string;
  _key?: string;
  language?: string;
  value?: unknown;
};

type PatchStats = {
  docs: number;
  fields: number;
  entities: number;
};

function langOf(item: I18nItem): string {
  return item.language || item._key || "";
}

function countEntities(text: string): number {
  const matches = text.match(
    /&#\d+;|&#x[0-9a-f]+;|&(?:quot|apos|amp|lt|gt|nbsp|hellip);/gi,
  );
  return matches?.length ?? 0;
}

function decodeBlockContent(blocks: unknown): {
  next: unknown;
  changed: boolean;
  entities: number;
} {
  if (!Array.isArray(blocks)) return { next: blocks, changed: false, entities: 0 };
  let changed = false;
  let entities = 0;
  const next = blocks.map((block) => {
    if (!block || typeof block !== "object") return block;
    const b = block as Record<string, unknown>;
    if (b._type !== "block" || !Array.isArray(b.children)) return block;
    const children = b.children.map((child) => {
      if (!child || typeof child !== "object") return child;
      const c = child as Record<string, unknown>;
      if (typeof c.text !== "string" || !containsHtmlEntities(c.text)) return child;
      entities += countEntities(c.text);
      changed = true;
      return { ...c, text: decodeHtmlEntities(c.text) };
    });
    return { ...b, children };
  });
  return { next, changed, entities };
}

function walkAndPatchClone(
  node: unknown,
  stats: { fields: number; entities: number },
): boolean {
  if (Array.isArray(node)) {
    let any = false;
    for (const item of node) {
      any = walkAndPatchClone(item, stats) || any;
    }
    return any;
  }

  if (!node || typeof node !== "object") return false;
  const obj = node as Record<string, unknown>;

  if (I18N_VALUE_TYPES.has(String(obj._type)) && langOf(obj as I18nItem) === "en") {
    if (typeof obj.value === "string" && containsHtmlEntities(obj.value)) {
      stats.entities += countEntities(obj.value);
      obj.value = decodeHtmlEntities(obj.value);
      stats.fields++;
      return true;
    }
    if (Array.isArray(obj.value)) {
      const { next, changed, entities } = decodeBlockContent(obj.value);
      if (changed) {
        stats.entities += entities;
        obj.value = next;
        stats.fields++;
        return true;
      }
    }
    return false;
  }

  let changed = false;
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object") {
      changed = walkAndPatchClone(value, stats) || changed;
    }
  }
  return changed;
}

function cloneDoc(doc: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
}

function collectTopLevelSetOps(
  original: Record<string, unknown>,
  patched: Record<string, unknown>,
): Record<string, unknown> {
  const setOps: Record<string, unknown> = {};
  for (const key of Object.keys(patched)) {
    if (key.startsWith("_")) continue;
    if (JSON.stringify(original[key]) !== JSON.stringify(patched[key])) {
      setOps[key] = patched[key];
    }
  }
  return setOps;
}

async function patchDocument(
  doc: Record<string, unknown>,
  stats: PatchStats,
): Promise<boolean> {
  const cloned = cloneDoc(doc);
  const fieldStats = { fields: 0, entities: 0 };
  const changed = walkAndPatchClone(cloned, fieldStats);
  if (!changed) return false;

  const setOps = collectTopLevelSetOps(doc, cloned);
  if (Object.keys(setOps).length === 0) return false;

  stats.docs++;
  stats.fields += fieldStats.fields;
  stats.entities += fieldStats.entities;

  console.log(
    `  ✎ ${doc._id} — ${Object.keys(setOps).length} top-level field(s), ~${fieldStats.entities} entity token(s)`,
  );

  if (!DRY_RUN) {
    await sanityClient.patch(String(doc._id)).set(setOps).commit();
  }
  return true;
}

async function main() {
  console.log(
    `\nHTML entity decode — dataset: ${DATASET}${DRY_RUN ? " (DRY RUN)" : ""}\n`,
  );

  const stats: PatchStats = { docs: 0, fields: 0, entities: 0 };
  const typeFilter = ONLY_TYPES.map((t) => `_type == "${t}"`).join(" || ");

  const ids = await sanityClient.fetch<string[]>(
    `*[( ${typeFilter} ) && !(_id in path("drafts.**"))]._id`,
  );

  console.log(`Scanning ${ids.length} published document(s)…\n`);

  for (const id of ids) {
    const doc = await sanityClient.fetch<Record<string, unknown> | null>(
      `*[_id == $id][0]`,
      { id },
    );
    if (doc) await patchDocument(doc, stats);
  }

  // Also patch drafts when a published doc exists (Erlend: specialist fixes in drafts).
  const draftIds = await sanityClient.fetch<string[]>(
    `*[( ${typeFilter} ) && _id in path("drafts.**")]._id`,
  );
  if (draftIds.length > 0) {
    console.log(`\nScanning ${draftIds.length} draft document(s)…\n`);
    for (const id of draftIds) {
      const doc = await sanityClient.fetch<Record<string, unknown> | null>(
        `*[_id == $id][0]`,
        { id },
      );
      if (doc) await patchDocument(doc, stats);
    }
  }

  console.log("\n── Summary ──");
  console.log(`  Documents patched: ${stats.docs}`);
  console.log(`  EN fields updated: ${stats.fields}`);
  console.log(`  Entity tokens removed: ~${stats.entities}`);
  if (DRY_RUN) console.log("\n  (Dry run — no writes.)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
