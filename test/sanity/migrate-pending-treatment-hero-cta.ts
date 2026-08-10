#!/usr/bin/env npx tsx
/**
 * Fill missing hero CTA labels on pending / newly migrated treatments:
 *
 * - `primaryCtaLabel` — book button (category-specific NO + EN copy)
 * - `callCtaLabel` — "Ring oss" / "Call us" when missing
 *
 * By default only processes TARGET_KEYS from migrate-selected-missing-treatments.ts.
 * Set ALL=1 to patch every treatment missing these fields.
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-pending-treatment-hero-cta.ts
 *   npx tsx sanity/migrate-pending-treatment-hero-cta.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ALL = process.env.ALL === "1";

const TARGET_KEYS = [
  "gynekologi/fodselsskader",
  "gynekologi/fostermedisin",
  "gynekologi/pmos",
  "fertilitet/assistert-befruktning-for-par-og-single",
  "flere-fagomrader/hudbehandlinger",
  "flere-fagomrader/hudbehandlinger/pigmentforandringer-og-solskader",
  "flere-fagomrader/hudbehandlinger/rodhet-og-synlige-blodkar",
  "flere-fagomrader/hudbehandlinger/forbedring-av-hudstruktur",
  "flere-fagomrader/hudbehandlinger/kosmetisk-dermatologi",
  "flere-fagomrader/hudbehandlinger/elastisitet-og-volum",
  "flere-fagomrader/hudbehandlinger/foflekksjekk",
  "flere-fagomrader/behandlingsutstyr",
  "flere-fagomrader/hudpleieprodukter",
  "flere-fagomrader/gastrokirurgi/brokkoperasjon",
  "flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager",
];

const PRIMARY_CTA_BY_CATEGORY: Record<string, { no: string; en: string }> = {
  gynekologi: {
    no: "Bestill time hos en gynekolog",
    en: "Book an appointment with a gynecologist",
  },
  fertilitet: {
    no: "Bestill time hos en fertilitetsspesialist",
    en: "Book an appointment with a fertility specialist",
  },
  urologi: {
    no: "Bestill time hos en urolog",
    en: "Book an appointment with a urologist",
  },
  ortopedi: {
    no: "Bestill time hos en ortoped",
    en: "Book an appointment with an orthopaedic specialist",
  },
  graviditet: {
    no: "Bestill time hos en fostermedisiner",
    en: "Book an appointment with a fetal medicine specialist",
  },
  "flere-fagomrader": {
    no: "Bestill time hos en spesialist",
    en: "Book an appointment with a specialist",
  },
};

const DEFAULT_PRIMARY_CTA = {
  no: "Bestill time",
  en: "Book appointment",
};

const CALL_CTA = {
  no: "Ring oss",
  en: "Call us",
};

type I18nItem = {
  _key: string;
  _type: string;
  language: string;
  value: string;
};

const i18nString = (no: string, en: string): I18nItem[] => [
  { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];

function treatmentDocId(categoryId: string, subPath: string): string {
  return `treatment-${categoryId}-${subPath.replace(/\//g, "-")}`;
}

function targetDocIds(): string[] {
  return TARGET_KEYS.map((key) => {
    const slash = key.indexOf("/");
    return treatmentDocId(key.slice(0, slash), key.slice(slash + 1));
  });
}

function pickNo(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (
    value.find((x) => (x as I18nItem).language === "no")?.value ||
    value.find((x) => (x as I18nItem)._key === "no")?.value ||
    (value[0] as I18nItem)?.value ||
    ""
  );
}

function hasI18nString(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim());
}

function primaryCtaForCategory(categoryId: string | undefined) {
  return PRIMARY_CTA_BY_CATEGORY[categoryId || ""] || DEFAULT_PRIMARY_CTA;
}

async function run() {
  console.log(
    `\n[migrate-pending-treatment-hero-cta] mode=${DRY_RUN ? "DRY_RUN" : "WRITE"} scope=${ALL ? "all missing" : `${TARGET_KEYS.length} TARGET_KEYS`}\n`,
  );

  const scopeIds = ALL ? null : targetDocIds();
  const treatments: Array<{
    _id: string;
    title?: unknown;
    primaryCtaLabel?: unknown;
    callCtaLabel?: unknown;
    categoryId?: string;
  }> = await sanityClient.fetch(
    ALL
      ? `*[_type == "treatment" && !(_id in path("drafts.**"))]{
          _id, title, primaryCtaLabel, callCtaLabel,
          "categoryId": category->categoryId
        }`
      : `*[_type == "treatment" && _id in $ids]{
          _id, title, primaryCtaLabel, callCtaLabel,
          "categoryId": category->categoryId
        }`,
    ALL ? {} : { ids: scopeIds },
  );

  let patched = 0;
  let skipped = 0;

  for (const t of treatments) {
    const label = pickNo(t.title) || t._id;
    const patch: Record<string, unknown> = {};

    if (!hasI18nString(t.primaryCtaLabel)) {
      const copy = primaryCtaForCategory(t.categoryId);
      patch.primaryCtaLabel = i18nString(copy.no, copy.en);
    }

    if (!hasI18nString(t.callCtaLabel)) {
      patch.callCtaLabel = i18nString(CALL_CTA.no, CALL_CTA.en);
    }

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    console.log(`  + ${label}: ${Object.keys(patch).join(", ")}`);
    if (!DRY_RUN) {
      await sanityClient.patch(t._id).set(patch).commit();
    }
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Treatments checked: ${treatments.length}`);
  console.log(`Patched:            ${patched}`);
  console.log(`Skipped (complete):   ${skipped}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
