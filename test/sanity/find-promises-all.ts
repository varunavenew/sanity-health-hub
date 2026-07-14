import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment"]{ _id, title, promises }`);
  for (const doc of docs) {
    const noTitle = (doc.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "";
    const enTitle = (doc.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value || "";
    console.log(`\nDocument: ${doc._id} (NO: "${noTitle}" / EN: "${enTitle}")`);
    if (doc.promises) {
      console.log(`  Promises: ${(doc.promises as any[]).length}`);
      for (const p of doc.promises) {
        const pNoTitle = (p.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "";
        const pEnTitle = (p.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value || "";
        console.log(`    - NO Promise: "${pNoTitle}"`);
        console.log(`    - EN Promise: "${pEnTitle}"`);
      }
    } else {
      console.log("  No promises defined.");
    }
  }
}

run().catch(console.error);
