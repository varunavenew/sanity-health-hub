/**
 * One-off cleanup: remove the Ski clinic document from Sanity.
 * Ski klinikken er nedlagt og skal ikke vises noe sted.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx test/sanity/delete-ski-clinic.ts
 */
import { sanityClient } from "./config";

async function run() {
  const id = "clinicPage-ski";
  console.log(`🗑  Deleting ${id} from Sanity…`);
  try {
    await sanityClient.delete(id);
    console.log("✅ Ski-klinikken er slettet fra Sanity.");
  } catch (err: any) {
    if (err?.statusCode === 404) {
      console.log("ℹ️  Dokumentet finnes ikke (kanskje allerede slettet).");
      return;
    }
    throw err;
  }
}

run().catch((err) => {
  console.error("❌ Sletting feilet:", err.message || err);
  process.exit(1);
});
