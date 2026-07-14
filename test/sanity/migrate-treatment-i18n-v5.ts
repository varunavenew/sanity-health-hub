/**
 * Migration: normalize treatment internationalized-array entries from v4 to v5.
 *
 * Fixes Studio warnings where language is stored in `_key` instead of `language`.
 *
 * ENV:
 *   DRY_RUN=1 - preview only
 *
 * Run:
 *   cd test
 *   $env:DRY_RUN='1'; npx tsx sanity/migrate-treatment-i18n-v5.ts
 *   npx tsx sanity/migrate-treatment-i18n-v5.ts
 */
import { createHash } from "crypto";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const LANGUAGE_KEYS = new Set(["no", "en"]);
const SYSTEM_FIELDS = new Set(["_id", "_rev", "_createdAt", "_updatedAt", "_type"]);

type JsonObject = Record<string, unknown>;

function isRecord(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stableKey(docId: string, path: string, language: string, value: unknown): string {
  const hash = createHash("sha1")
    .update(`${docId}:${path}:${language}:${JSON.stringify(value)}`)
    .digest("hex")
    .slice(0, 16);

  return `i18n-${hash}`;
}

function isInternationalizedArrayValue(value: JsonObject): boolean {
  return (
    typeof value._type === "string" &&
    value._type.startsWith("internationalizedArray") &&
    value._type.endsWith("Value")
  );
}

function normalizeI18nEntry(
  entry: JsonObject,
  docId: string,
  path: string,
): { value: JsonObject; changed: boolean } {
  if (!isInternationalizedArrayValue(entry)) {
    return { value: entry, changed: false };
  }

  const currentKey = typeof entry._key === "string" ? entry._key : "";
  const currentLanguage = typeof entry.language === "string" ? entry.language : "";
  const language = currentLanguage || (LANGUAGE_KEYS.has(currentKey) ? currentKey : "");

  if (!language) {
    return { value: entry, changed: false };
  }

  const next = { ...entry };
  let changed = false;

  if (next.language !== language) {
    next.language = language;
    changed = true;
  }

  if (!currentKey || LANGUAGE_KEYS.has(currentKey)) {
    next._key = stableKey(docId, path, language, next.value);
    changed = true;
  }

  return { value: next, changed };
}

function normalizeValue(
  value: unknown,
  docId: string,
  path: string,
): { value: unknown; changed: boolean } {
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item, index) => {
      const result = normalizeValue(item, docId, `${path}[${index}]`);
      if (result.changed) changed = true;
      return result.value;
    });

    return changed ? { value: next, changed } : { value, changed: false };
  }

  if (!isRecord(value)) {
    return { value, changed: false };
  }

  const i18nEntry = normalizeI18nEntry(value, docId, path);
  const base = i18nEntry.changed ? i18nEntry.value : value;

  let changed = i18nEntry.changed;
  const next: JsonObject = i18nEntry.changed ? { ...i18nEntry.value } : { ...value };

  for (const [key, child] of Object.entries(base)) {
    const result = normalizeValue(child, docId, `${path}.${key}`);
    if (result.changed) {
      next[key] = result.value;
      changed = true;
    }
  }

  return changed ? { value: next, changed } : { value, changed: false };
}

async function run() {
  console.log("▶ Normalize treatment i18n arrays to v5 language field");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}`);
  console.log();

  const docs = await sanityClient.fetch<JsonObject[]>(
    `*[_type == "treatment"]{...}`,
  );

  let patchedDocs = 0;
  let changedFields = 0;

  for (const doc of docs) {
    const docId = String(doc._id || "");
    const patch: JsonObject = {};

    for (const [field, value] of Object.entries(doc)) {
      if (SYSTEM_FIELDS.has(field)) continue;

      const result = normalizeValue(value, docId, field);
      if (result.changed) {
        patch[field] = result.value;
      }
    }

    const fields = Object.keys(patch);
    if (fields.length === 0) continue;

    patchedDocs += 1;
    changedFields += fields.length;
    console.log(`  ${DRY_RUN ? "✎" : "✓"} ${docId} — ${fields.join(", ")}`);

    if (!DRY_RUN) {
      await sanityClient
        .patch(docId)
        .set(patch)
        .commit({ autoGenerateArrayKeys: true });
    }
  }

  console.log(
    `\n✓ Done. ${DRY_RUN ? "Would patch" : "Patched"} ${patchedDocs} treatment document(s), ${changedFields} top-level field(s).`,
  );
}

run().catch((error) => {
  console.error("✗ Failed:", error);
  process.exit(1);
});
