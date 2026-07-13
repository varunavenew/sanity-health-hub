import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment" && defined(expertAreas)]{ _id, title, expertAreas }`);
  console.log(`Found ${docs.length} treatments with expertAreas.`);
  for (const doc of docs) {
    console.log(`\n=========================================`);
    console.log(`Document ID: ${doc._id}`);
    console.log(`Title (NO):`, (doc.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    
    if (doc.expertAreas) {
      console.log(`Expert Areas Title (NO):`, (doc.expertAreas.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
      console.log(`Expert Areas Title (EN):`, (doc.expertAreas.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
      console.log(`Expert Areas Desc (NO):`, (doc.expertAreas.description as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
      console.log(`Expert Areas Desc (EN):`, (doc.expertAreas.description as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);

      if (doc.expertAreas.items) {
        console.log(`Items count: ${doc.expertAreas.items.length}`);
        for (const item of doc.expertAreas.items) {
          console.log(`  - Item Title (NO):`, (item.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
          console.log(`  - Item Title (EN):`, (item.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
          console.log(`    Item Desc (NO):`, (item.desc as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
          console.log(`    Item Desc (EN):`, (item.desc as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
        }
      }
    }
  }
}

run().catch(console.error);
