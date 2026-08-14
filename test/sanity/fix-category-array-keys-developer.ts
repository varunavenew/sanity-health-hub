#!/usr/bin/env npx tsx
/**
 * Developer-only: regenerate unique `_key` values for nested arrays on
 * treatment category landing pages (published + drafts).
 *
 * Fixes Studio "Non-unique keys" on Keywords with links / other arrays
 * so editors can see and edit keyword rows.
 *
 *   cd test && npx tsx sanity/fix-category-array-keys-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const IDS = [
  "category-fertilitet",
  "category-gynekologi",
  "category-urologi",
  "category-ortopedi",
  "category-graviditet",
  "category-flere-fagomrader",
] as const;

const ARRAY_PARENT_HINTS = new Set([
  "segments",
  "tagLinks",
  "tags",
  "steps",
  "audiences",
  "areas",
  "items",
  "groups",
  "reviews",
  "stats",
  "phases",
  "bullets",
  "specialists",
  "pageSections",
]);

function newKey(prefix: string): string {
  return `${prefix}-${randomBytes(5).toString("hex")}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Keep language `_key` as no/en; regenerate everything else in arrays of objects. */
function rekeyValue(value: unknown, path: string[] = []): unknown {
  if (Array.isArray(value)) {
    const parent = path[path.length - 1] || "arr";
    const shouldRekeyObjects =
      ARRAY_PARENT_HINTS.has(parent) ||
      value.some((item) => isPlainObject(item) && typeof item._key === "string");

    return value.map((item, index) => {
      if (!isPlainObject(item)) return item;

      const next = { ...item } as Record<string, unknown>;
      const isI18nEntry =
        typeof next.language === "string" &&
        (next.language === "no" || next.language === "en") &&
        "value" in next;

      if (shouldRekeyObjects && !isI18nEntry) {
        const prefix =
          parent === "tagLinks"
            ? "tag"
            : parent === "segments"
              ? "seg"
              : parent.slice(0, 6) || "item";
        next._key = newKey(`${prefix}${index}`);
      } else if (isI18nEntry) {
        // Plugin v5: language lives in `language`; `_key` must be unique/random.
        // Forcing `_key` to "no"/"en" breaks Studio Duplicate + Publish.
        if (!next.language && (next._key === "no" || next._key === "en")) {
          next.language = next._key;
        }
        if (
          typeof next.language === "string" &&
          (next._key === "no" || next._key === "en" || !next._key)
        ) {
          next._key = newKey(String(next.language));
        }
      }

      for (const [k, v] of Object.entries(next)) {
        if (k === "_key") continue;
        next[k] = rekeyValue(v, [...path, k]);
      }
      return next;
    });
  }

  if (isPlainObject(value)) {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = rekeyValue(v, [...path, k]);
    }
    return next;
  }

  return value;
}

function findDuplicateKeys(
  value: unknown,
  path = "",
  out: Array<{ path: string; key: string; count: number }> = [],
): typeof out {
  if (Array.isArray(value)) {
    const counts = new Map<string, number>();
    for (const item of value) {
      if (isPlainObject(item) && typeof item._key === "string") {
        counts.set(item._key, (counts.get(item._key) || 0) + 1);
      }
    }
    for (const [key, count] of counts) {
      if (count > 1) out.push({ path, key, count });
    }
    value.forEach((item, i) => findDuplicateKeys(item, `${path}[${i}]`, out));
  } else if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      findDuplicateKeys(v, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
}

async function fixDoc(id: string) {
  const doc = await sanityClient.getDocument(id);
  if (!doc) return { id, skipped: true };

  const landingPage = rekeyValue((doc as { landingPage?: unknown }).landingPage, [
    "landingPage",
  ]);
  const pageSections = rekeyValue((doc as { pageSections?: unknown }).pageSections, [
    "pageSections",
  ]);

  await sanityClient
    .patch(id)
    .set({
      ...(landingPage !== undefined ? { landingPage } : {}),
      ...(pageSections !== undefined ? { pageSections } : {}),
    })
    .commit({ autoGenerateArrayKeys: false });

  const after = await sanityClient.fetch(
    `*[_id==$id][0]{
      "segN": count(landingPage.segmentsSection.segments),
      "tagN": count(landingPage.segmentsSection.segments[].tagLinks[]),
      "sample": landingPage.segmentsSection.segments[0]{
        "title": title[language=="no"][0].value,
        "tags": tagLinks[]{ _key, "label": label[language=="no"][0].value }
      }
    }`,
    { id },
  );

  const full = await sanityClient.getDocument(id);
  const dupes = findDuplicateKeys({
    landingPage: (full as { landingPage?: unknown })?.landingPage,
    pageSections: (full as { pageSections?: unknown })?.pageSections,
  });

  return { id, after, dupes };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const targets = IDS.flatMap((id) => [id, `drafts.${id}`]);
  const summary: unknown[] = [];

  for (const id of targets) {
    const result = await fixDoc(id);
    summary.push(result);
    if ("skipped" in result && result.skipped) {
      console.log(`· skip missing ${id}`);
    } else {
      console.log(
        `✓ ${id} tags=${(result as { after?: { tagN?: number } }).after?.tagN} dupes=${
          (result as { dupes?: unknown[] }).dupes?.length || 0
        }`,
      );
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
