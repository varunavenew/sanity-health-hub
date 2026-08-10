#!/usr/bin/env npx tsx
/**
 * Migrate hero bullets (quick-point chips) to landingPage.hero.bullets
 * on every treatmentCategory that has a landingPage.
 *
 * Each bullet is stored as a heroBulletItem object:
 *   { _key: string, title: internationalizedArrayString }
 *
 * This matches the schema: type: 'array', of: [{ type: 'object', name: 'heroBulletItem', fields: [{ name: 'title', ...i18nStr }] }]
 *
 * Usage (from /test):
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-hero-bullets.ts            # dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-hero-bullets.ts --write    # apply
 */
import { sanityClient } from "./config";

const WRITE = process.argv.includes("--write");

// ─── i18n helper ──────────────────────────────────────────────────────────
type I18nItem = {
    _type: string;
    _key: string;
    language: string;
    value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
    return [
        { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
        { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
    ];
}

// ─── Bullet definitions per category ─────────────────────────────────────
// Each bullet becomes: { _key, title: internationalizedArrayString }
const BULLETS: Record<string, Array<{ no: string; en: string }>> = {
    gynekologi: [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Korte ventetider", en: "Short waiting times" },
        { no: "Erfarne spesialister", en: "Experienced specialists" },
    ],
    fertilitet: [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Moderne teknologi", en: "Modern technology" },
        { no: "Tverrfaglig team", en: "Multidisciplinary team" },
    ],
    urologi: [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Korte ventetider", en: "Short waiting times" },
        { no: "Erfarne spesialister", en: "Experienced specialists" },
    ],
    ortopedi: [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Korte ventetider", en: "Short waiting times" },
        { no: "Erfarne spesialister", en: "Experienced specialists" },
    ],
    graviditet: [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Korte ventetider", en: "Short waiting times" },
        { no: "Tverrfaglig team", en: "Multidisciplinary team" },
    ],
    "flere-fagomrader": [
        { no: "Ingen henvisning", en: "No referral needed" },
        { no: "Tverrfaglig team", en: "Multidisciplinary team" },
        { no: "Erfarne spesialister", en: "Experienced specialists" },
    ],
};

// ─── Build the bullets array ──────────────────────────────────────────────
function buildBullets(defs: Array<{ no: string; en: string }>) {
    return defs.map((b, i) => ({
        _key: `bullet-${i}`,
        _type: "heroBulletItem",
        title: i18nString(b.no, b.en),
    }));
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
    console.log(
        WRITE ? "✍️  WRITE mode (will patch Sanity)" : "🔍 DRY-RUN (pass --write to apply)"
    );

    const cats = await sanityClient.fetch<
        Array<{ _id: string; categoryId?: string; slug?: string }>
    >(
        `*[_type == "treatmentCategory" && defined(landingPage)]{
      _id,
      categoryId,
      "slug": coalesce(slug[language == "no"][0].value.current, slug.current)
    }`
    );

    console.log(`Found ${cats.length} treatmentCategory documents with landingPage.\n`);

    let patched = 0;
    let skipped = 0;

    for (const cat of cats) {
        const catId = cat.categoryId || cat.slug || "";
        const defs = BULLETS[catId];

        console.log(`▸ ${catId} (${cat._id})`);

        if (!defs) {
            console.log("   (no BULLETS entry — skipped)");
            skipped++;
            continue;
        }

        const bullets = buildBullets(defs);
        const noValues = bullets.map(
            (b) =>
                (b.title as I18nItem[]).find((e) => e.language === "no")?.value ?? ""
        );
        console.log(`   • bullets ← [${noValues.join(" | ")}]`);

        if (!WRITE) {
            patched++;
            continue;
        }

        try {
            await sanityClient
                .patch(cat._id)
                .set({ "landingPage.hero.bullets": bullets })
                .commit({ autoGenerateArrayKeys: false });
            patched++;
            console.log("   ✓ patched");
        } catch (err) {
            console.error(`   ✗ patch failed: ${(err as Error).message}`);
        }
    }

    console.log("\n── Summary ──────────────────────────────");
    console.log(`Categories patched  : ${patched}`);
    console.log(`Categories skipped  : ${skipped}`);
    if (!WRITE) console.log("\n(dry-run — re-run with --write to apply)");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
