/**
 * Migration: Ensure `internationalizedArraySlug` has `language: "en"` entries
 * for all i18n-enabled public-facing schemas.
 *
 * Why:
 * - `migrate-i18n-slugs.ts` seeds only Norwegian (`language: "no"`) and legacy `slug.current`.
 * - Backfilling translated content updates `title`/etc, but the `slug` array values may still miss `en` entries.
 *
 * This script:
 * - Computes expected EN slug from the schema's slug source field (title/name)
 * - Ensures `doc.slug` has a `language: "en"` entry in `internationalizedArraySlug`
 * - If EN slug is missing, inserts it (EN falls back to NO source when EN content is empty)
 * - Preserves existing `_key` where possible; generates `_key` when missing
 *
 * ENV:
 *   DRY_RUN=1        – preview only
 *   ONLY=type1,type2 – limit document types
 *
 * Run:
 *   cd test && npx tsx sanity/migrate-english-slugs.ts
 */

import { randomBytes } from "crypto";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY = (process.env.ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Types that already participate in `migrate-i18n-slugs.ts`.
const TYPE_TO_SLUG_SOURCE_FIELD: Record<string, string> = {
  article: "title",
  clinicPage: "title",
  treatmentCategory: "title",
  treatment: "title",
  specialist: "name",
  themePage: "title",
  jobListing: "title",
  product: "name",
  privacyPolicyPage: "title",
};

function randomKey(): string {
  return randomBytes(8).toString("hex");
}

function isI18nSlugArray(val: unknown): val is any[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === "object" &&
    val[0] !== null &&
    typeof (val[0] as { _type?: string })._type === "string" &&
    String((val[0] as { _type: string })._type).startsWith("internationalizedArraySlug")
  );
}

function isLegacySlugObject(val: unknown): val is { current?: unknown } {
  return !!val && typeof val === "object" && !Array.isArray(val) && "current" in (val as any);
}

function slugify(input: string): string {
  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    // Remove diacritics (e.g. “é” -> “e”)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    cleaned
      // Allow a-z + 0-9, convert everything else to "-"
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .trim() || ""
  );
}

function pickI18nValue(val: unknown, lang: "no" | "en"): string {
  if (typeof val === "string") return val.trim();
  if (!Array.isArray(val) || val.length === 0) return "";

  const entries = val as Array<any>;

  const match = entries.find((e) => (e?.language || e?._key) === lang);
  const noMatch = entries.find((e) => (e?.language || e?._key) === "no");

  const matchedVal = match?.value;
  const noVal = noMatch?.value;

  const getStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return getStr(matchedVal) || getStr(noVal) || getStr(entries[0]?.value) || "";
}

function computeSourceForLang(doc: any, sourceField: string, lang: "no" | "en"): string {
  if (sourceField === "title") {
    return pickI18nValue(doc?.title, lang);
  }
  if (sourceField === "name") {
    const v = doc?.name;
    return typeof v === "string" ? v.trim() : "";
  }
  // Fallback: try to use same i18n picker for unknown fields
  return pickI18nValue(doc?.[sourceField], lang);
}

function getEntryLang(entry: any): string | undefined {
  return (entry?.language || entry?._key) as string | undefined;
}

function ensureKey(entry: any): { entry: any; ensured: boolean } {
  if (entry && typeof entry === "object" && !entry._key) {
    entry._key = randomKey();
    return { entry, ensured: true };
  }
  return { entry, ensured: false };
}

function buildSlugValueEntry(lang: "no" | "en", current: string, existingKey?: string): any {
  return {
    _key: existingKey || randomKey(),
    _type: "internationalizedArraySlugValue",
    language: lang,
    value: { _type: "slug", current },
  };
}

async function run() {
  const types = ONLY.length ? ONLY.filter((t) => TYPE_TO_SLUG_SOURCE_FIELD[t]) : Object.keys(TYPE_TO_SLUG_SOURCE_FIELD);
  console.log("▶ Ensure English slugs (language: en) exist");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}`);
  if (ONLY.length) console.log(`  Types:   ${types.join(", ")}`);
  console.log();

  let patchedDocs = 0;

  for (const type of types) {
    const sourceField = TYPE_TO_SLUG_SOURCE_FIELD[type];
    const docs = await sanityClient.fetch<any[]>(
      `*[_type == "${type}"]{ _id, slug, ${sourceField} }`,
    );

    console.log(`📄 ${type} — ${docs.length} doc(s)`);

    for (const doc of docs) {
      const sourceNo = computeSourceForLang(doc, sourceField, "no");
      const sourceEn = computeSourceForLang(doc, sourceField, "en");
      const noCurrent = slugify(sourceNo);
      const enCurrent = slugify(sourceEn || sourceNo);

      if (!noCurrent && !enCurrent) continue; // nothing to slugify

      const existingSlug = doc.slug;

      let nextSlug: any[] | null = null;
      let changed = false;

      // If already in i18n slug-array form, patch/add just the EN entry.
      if (isI18nSlugArray(existingSlug)) {
        nextSlug = existingSlug.map((e) => ({ ...e }));

        // Ensure any missing keys in existing entries.
        for (const entry of nextSlug) {
          const ensured = ensureKey(entry);
          if (ensured.ensured) changed = true;
        }

        const enIndex = nextSlug.findIndex((e) => getEntryLang(e) === "en");
        if (enIndex === -1) {
          nextSlug.push(buildSlugValueEntry("en", enCurrent));
          changed = true;
        } else {
          const existingEn = nextSlug[enIndex];
          const currentNow = existingEn?.value?.current;
          if (!existingEn.value || typeof currentNow !== "string" || currentNow !== enCurrent) {
            existingEn.value = { ...(existingEn.value || {}), _type: "slug", current: enCurrent };
            nextSlug[enIndex] = existingEn;
            changed = true;
          }
          // In case the existing entry has language unset but _key used as language-like marker.
          if (!existingEn.language && getEntryLang(existingEn) === "en") {
            existingEn.language = "en";
            changed = true;
          }
        }
      } else if (isLegacySlugObject(existingSlug)) {
        // Legacy form: wrap into full i18n array (no + en).
        const legacyCurrent =
          typeof (existingSlug as any).current === "string" ? ((existingSlug as any).current as string).trim() : "";
        const noValue = noCurrent || slugify(legacyCurrent);
        const enValue = enCurrent || noValue;

        nextSlug = [
          buildSlugValueEntry("no", noValue),
          buildSlugValueEntry("en", enValue),
        ];
        changed = true;
      } else if (!existingSlug) {
        nextSlug = [buildSlugValueEntry("no", noCurrent), buildSlugValueEntry("en", enCurrent || noCurrent)];
        changed = true;
      } else {
        // Unknown shape; skip to avoid overwriting.
        continue;
      }

      if (!changed || !nextSlug) continue;

      console.log(`  ✎ ${doc._id} — add/update en slug`);
      if (!DRY_RUN) {
        await sanityClient
          .patch(doc._id)
          .set({ slug: nextSlug })
          .commit({ autoGenerateArrayKeys: true });
      }

      patchedDocs += 1;
    }
  }

  console.log(`\n✓ Done. ${DRY_RUN ? "Would patch" : "Patched"} ${patchedDocs} document(s)`);
}

run().catch((e) => {
  console.error("✗ Failed:", e);
  process.exit(1);
});

