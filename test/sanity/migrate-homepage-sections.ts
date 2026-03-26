/**
 * Migrate StatsBar, ValueBadges, and PromoBlocks to the Homepage document in Sanity
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-homepage-sections.ts
 */
import { sanityClient as client } from "./config";

const HOMEPAGE_ID = "homepage";

async function migrate() {
  console.log("🚀 Migrating homepage sections (StatsBar, ValueBadges, PromoBlocks)...\n");

  // Ensure homepage document exists
  await client.createIfNotExists({
    _id: HOMEPAGE_ID,
    _type: "homepage",
    title: "CMedical – Forside",
  });

  await client
    .patch(HOMEPAGE_ID)
    .set({
      statsBar: [
        { _key: "stat-1", value: "15 000+", label: "pasienter behandlet" },
        { _key: "stat-2", value: "8+", label: "års erfaring med robotkirurgi" },
        { _key: "stat-3", value: "5", label: "klinikker i Norge" },
        { _key: "stat-4", value: "50+", label: "spesialister" },
      ],
      valueBadges: [
        { _key: "badge-1", icon: "ShieldCheck", label: "Trygg og moderne behandlingsteknologi" },
        { _key: "badge-2", icon: "Building2", label: "Behagelige lokaler" },
        { _key: "badge-3", icon: "Coins", label: "Tilgjengelig pris" },
      ],
      promoBlocks: [
        {
          _key: "promo-1",
          title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
          ctaText: "Les mer",
          ctaLink: "/robotassistert-kirurgi",
        },
        {
          _key: "promo-2",
          title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
          ctaText: "Les mer",
          ctaLink: "/tverrfaglige-team",
        },
      ],
    })
    .commit();

  console.log("✅ StatsBar migrated (4 items)");
  console.log("✅ ValueBadges migrated (3 items)");
  console.log("✅ PromoBlocks migrated (2 items)");
  console.log("\n✅ All homepage sections migrated successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
