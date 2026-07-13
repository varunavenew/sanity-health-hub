import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment" && (slug.current match "*robotkirurgi*" || slug[language == "no"][0].value.current match "*robotkirurgi*")]`);
  for (const doc of docs) {
    console.log(`\n=========================================`);
    console.log(`Document ID: ${doc._id}`);
    console.log(`Title (NO):`, (doc.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    console.log(`Title (EN):`, (doc.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
    
    console.log(`reasonsTitle (NO):`, (doc.reasonsTitle as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    console.log(`reasonsTitle (EN):`, (doc.reasonsTitle as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);

    if (doc.reasons) {
      console.log(`Reasons count: ${(doc.reasons as any[]).length}`);
      for (const r of doc.reasons) {
        console.log(`  - Reason Title (NO):`, (r.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
        console.log(`  - Reason Title (EN):`, (r.title as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
        console.log(`    Reason Desc (NO):`, (r.desc as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
        console.log(`    Reason Desc (EN):`, (r.desc as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
      }
    }
  }
}

run().catch(console.error);
