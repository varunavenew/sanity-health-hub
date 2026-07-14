import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment" && (slug.current match "*robotkirurgi*" || slug[language == "no"][0].value.current match "*robotkirurgi*")]{ _id, title, reasonsTitle, reasonsLead, reasonsLead2 }`);
  for (const doc of docs) {
    console.log(`\n=========================================`);
    console.log(`Document ID: ${doc._id}`);
    console.log(`Title (NO):`, (doc.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    
    console.log(`reasonsTitle (NO):`, (doc.reasonsTitle as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    console.log(`reasonsTitle (EN):`, (doc.reasonsTitle as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);

    console.log(`reasonsLead (NO):`, (doc.reasonsLead as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    console.log(`reasonsLead (EN):`, (doc.reasonsLead as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);

    console.log(`reasonsLead2 (NO):`, (doc.reasonsLead2 as any[] || []).find(t => t.language === "no" || t._key === "no")?.value);
    console.log(`reasonsLead2 (EN):`, (doc.reasonsLead2 as any[] || []).find(t => t.language === "en" || t._key === "en")?.value);
  }
}

run().catch(console.error);
