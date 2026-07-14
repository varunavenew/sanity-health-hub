import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment" && (slug.current match "*robotkirurgi*" || slug[language == "no"][0].value.current match "*robotkirurgi*")]{ _id, title, sections }`);
  for (const doc of docs) {
    console.log(`\n=========================================`);
    console.log(`Document ID: ${doc._id}`);
    console.log(`Title (NO):`, (doc.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    
    if (doc.sections) {
      console.log(`Sections count: ${(doc.sections as any[]).length}`);
      for (const s of doc.sections) {
        console.log(`  - Section ID: ${s.id || s._key}`);
        console.log(`    Heading (NO):`, (s.heading as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
        console.log(`    Heading (EN):`, (s.heading as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
        console.log(`    Content (NO) snippet:`, ((s.content as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "").substring(0, 100));
        console.log(`    Content (EN) snippet:`, ((s.content as any[] || []).find(t => t.language === "en" || t._key === "en")?.value || "").substring(0, 100));
      }
    } else {
      console.log("  No sections field defined in this document.");
    }
  }
}

run().catch(console.error);
