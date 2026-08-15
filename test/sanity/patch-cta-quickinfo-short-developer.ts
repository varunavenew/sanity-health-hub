/**
 * Developer-only: set Booking CTA quick-info copy to reference short labels.
 *
 *   Kort ventetid / Ingen henvisning
 *
 * Patches the shared Ortopedi CTA collection + any other CTA collections
 * that still carry the long “Ledig time…” / “Ingen henvisning nødvendig” copy.
 *
 *   cd test && npx tsx sanity/patch-cta-quickinfo-short-developer.ts
 */
import { randomBytes } from "crypto";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

/** Ortopedi shared CTA pack (also used as reference). */
const ORTOPEDI_CTA_ID = "migrated-cta-collection.da5deb1ad7a338f5";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
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
      value: en,
    },
  ];
}

function qiKey(): string {
  return randomBytes(4).toString("hex");
}

const SHORT_QUICK_INFO = [
  {
    _key: `qi-${qiKey()}`,
    icon: "clock",
    text: i18nString("Kort ventetid", "Short waiting time"),
  },
  {
    _key: `qi-${qiKey()}`,
    icon: "shield",
    text: i18nString("Ingen henvisning", "No referral"),
  },
];

function pickNo(text: unknown): string {
  if (!Array.isArray(text)) return typeof text === "string" ? text : "";
  const no = text.find(
    (row) =>
      row &&
      typeof row === "object" &&
      ((row as { language?: string }).language === "no" ||
        (row as { _key?: string })._key === "no"),
  ) as { value?: string } | undefined;
  return no?.value?.trim() || "";
}

async function main() {
  console.log(`\nCTA quick-info short copy (DRY_RUN=${DRY_RUN})\n`);

  const collections = await sanityClient.fetch<
    Array<{
      _id: string;
      title?: unknown;
      quickInfoItems?: Array<{ icon?: string; text?: unknown }>;
    }>
  >(`*[_type=="ctaCollection"]{
    _id,
    title,
    quickInfoItems[]{ icon, text }
  }`);

  const targets = new Set<string>([ORTOPEDI_CTA_ID]);

  for (const row of collections) {
    const texts = (row.quickInfoItems || []).map((item) => pickNo(item.text));
    const joined = texts.join(" | ");
    if (
      joined.includes("Ledig time") ||
      joined.includes("henvisning nødvendig") ||
      joined.includes("1–3 dager") ||
      joined.includes("1-3 dager") ||
      row._id === ORTOPEDI_CTA_ID ||
      row._id === `drafts.${ORTOPEDI_CTA_ID}`
    ) {
      targets.add(row._id);
      // Also patch draft twin if published id is targeted
      if (!row._id.startsWith("drafts.")) {
        targets.add(`drafts.${row._id}`);
      }
    }
  }

  for (const id of targets) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id][0]._id`,
      { id },
    );
    if (!exists) {
      console.log(`  ⏭  ${id} missing`);
      continue;
    }

    console.log(`  → ${id}: Kort ventetid / Ingen henvisning`);
    if (DRY_RUN) continue;

    await sanityClient
      .patch(id)
      .set({ quickInfoItems: SHORT_QUICK_INFO })
      .commit({ autoGenerateArrayKeys: false });
    console.log(`  ✅ Patched ${id}`);
  }

  // Also clear long inline quickInfo on ortopedi pageSectionBookingCta (legacy dual-read).
  for (const pageId of ["category-ortopedi", "drafts.category-ortopedi"]) {
    const page = await sanityClient.fetch<{
      _id: string;
      pageSections?: Array<Record<string, unknown>>;
    } | null>(`*[_id==$id][0]{ _id, pageSections }`, { id: pageId });

    if (!page?.pageSections?.length) continue;

    let changed = false;
    const nextSections = page.pageSections.map((section) => {
      if (section._type !== "pageSectionBookingCta") return section;
      const items = section.quickInfoItems;
      if (!Array.isArray(items) || items.length === 0) return section;
      changed = true;
      return { ...section, quickInfoItems: SHORT_QUICK_INFO };
    });

    if (!changed) {
      console.log(`  ⏭  ${pageId} inline CTA quickInfo empty/unset`);
      continue;
    }

    console.log(`  → ${pageId}: inline booking CTA quickInfo`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(pageId)
        .set({ pageSections: nextSections })
        .commit({ autoGenerateArrayKeys: false });
      console.log(`  ✅ Patched ${pageId}`);
    }
  }

  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
