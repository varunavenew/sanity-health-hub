/**
 * Seed homepage Booking CTA quick-info rows in Sanity:
 *   ✓ Kort ventetid
 *   ✓ Ingen henvisning
 *
 * Creates/updates a Homepage CTA Collection and links homepage.bookingCta.
 * Also patches quickInfoItems on an already-linked collection when empty or long-form.
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-homepage-booking-cta-quickinfo.ts
 *   npx tsx sanity/migrate-homepage-booking-cta-quickinfo.ts
 */
import { sanityClient as client } from "./config";
import { DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY } from "./data/booking-cta-quick-info-defaults";
import { i18nString, i18nText } from "./lib/category-landing-i18n";

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";
const COLLECTION_ID = "cta-collection.homepage";

type HomepageDoc = {
  _id: string;
  bookingCta?: {
    ctaCollection?: { _ref?: string } | null;
    quickInfoItems?: unknown[] | null;
  } | null;
};

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

function needsQuickInfoPatch(items: unknown[] | null | undefined): boolean {
  if (!Array.isArray(items) || items.length === 0) return true;
  const texts = items.map((row) =>
    row && typeof row === "object" ? pickNo((row as { text?: unknown }).text) : "",
  );
  const joined = texts.join(" | ");
  return (
    FORCE ||
    joined.includes("Ledig time") ||
    joined.includes("henvisning nødvendig") ||
    joined.includes("1–3 dager") ||
    joined.includes("1-3 dager")
  );
}

function buildHomepageCtaCollection(): Record<string, unknown> {
  return {
    _id: COLLECTION_ID,
    _type: "ctaCollection",
    internalName: "Homepage Booking CTA",
    description: "Default booking band on the homepage.",
    title: i18nString("Bestill time hos spesialist", "Book an appointment with a specialist"),
    subtitle: i18nText(
      "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
      "Choose service, clinic and practitioner – all in one simple booking.",
    ),
    primaryLabel: i18nString("Bestill time nå", "Book now"),
    primaryPath: "/booking",
    showSecondaryButton: true,
    secondaryLabel: i18nString("Ring oss", "Call us"),
    quickInfoItems: DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY,
    sortOrder: 0,
    notes:
      "Created by migrate-homepage-booking-cta-quickinfo.ts. Quick info: Kort ventetid / Ingen henvisning.",
  };
}

async function patchQuickInfoOnDoc(id: string, label: string) {
  console.log(`  → ${label}: set quickInfoItems`);
  if (DRY_RUN) return;
  await client
    .patch(id)
    .set({ quickInfoItems: DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY })
    .commit({ autoGenerateArrayKeys: false });
  console.log(`  ✅ Patched ${id}`);
}

async function main() {
  console.log(`Homepage Booking CTA quick-info migration — DRY_RUN=${DRY_RUN} FORCE=${FORCE}\n`);

  const collectionExists = await client.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: COLLECTION_ID,
  });

  if (!collectionExists) {
    const doc = buildHomepageCtaCollection();
    if (DRY_RUN) {
      console.log(`[dry-run] create ${COLLECTION_ID}`);
    } else {
      await client.createOrReplace(doc);
      console.log(`Created ${COLLECTION_ID}`);
    }
  } else {
    const existing = await client.fetch<{ quickInfoItems?: unknown[] } | null>(
      `*[_id == $id][0]{ quickInfoItems }`,
      { id: COLLECTION_ID },
    );
    if (needsQuickInfoPatch(existing?.quickInfoItems)) {
      await patchQuickInfoOnDoc(COLLECTION_ID, COLLECTION_ID);
    } else {
      console.log(`Collection ${COLLECTION_ID} already has short quick-info`);
    }
  }

  const homepages = await client.fetch<HomepageDoc[]>(
    `*[_type == "homepage"]{_id, bookingCta}`,
  );

  if (homepages.length === 0) {
    console.error("No homepage documents found — STOP");
    process.exit(1);
  }

  for (const doc of homepages) {
    const linkedRef = doc.bookingCta?.ctaCollection?._ref;
    const bookingCta = doc.bookingCta || { _type: "pageSectionBookingCta" };

    if (linkedRef) {
      const linked = await client.fetch<{ quickInfoItems?: unknown[] } | null>(
        `*[_id == $id][0]{ quickInfoItems }`,
        { id: linkedRef },
      );
      if (needsQuickInfoPatch(linked?.quickInfoItems)) {
        await patchQuickInfoOnDoc(linkedRef, `linked collection ${linkedRef}`);
      }
      continue;
    }

    const nextBookingCta = {
      ...bookingCta,
      _type: "pageSectionBookingCta",
      ctaCollection: { _type: "reference", _ref: COLLECTION_ID },
      quickInfoItems: DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY,
    };

    console.log(`  → ${doc._id}: link bookingCta → ${COLLECTION_ID}`);
    if (DRY_RUN) continue;

    await client
      .patch(doc._id)
      .set({ bookingCta: nextBookingCta })
      .commit({ autoGenerateArrayKeys: true });
    console.log(`  ✅ Linked ${doc._id}`);
  }

  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
