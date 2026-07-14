import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_type == "treatment" && defined(promises)]`);
  console.log(`Found ${docs.length} treatments with promises.`);

  const updateI18nArray = (arr: any[] | undefined, enValue: string) => {
    if (!arr) return arr;
    const hasEn = arr.some(item => item.language === "en" || item._key === "en");
    if (!hasEn) {
      return [
        ...arr,
        {
          _type: arr[0]?._type || "internationalizedArrayStringValue",
          _key: "en",
          language: "en",
          value: enValue
        }
      ];
    }
    return arr.map(item => {
      if (item.language === "en" || item._key === "en") {
        return { ...item, value: enValue };
      }
      return item;
    });
  };

  let updatedCount = 0;

  for (const doc of docs) {
    let promisesChanged = false;

    const promises = (doc.promises as any[] || []).map(p => {
      const titleVal = (p.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "";
      const cleanTitle = titleVal.trim().toLowerCase().replace(/[\u00A0\s]+/g, " ");

      let enTitle = "";
      let enDesc = "";

      if (cleanTitle.includes("du bestemmer")) {
        enTitle = "You decide what you are comfortable with";
        enDesc = "All examinations and procedures are done at your pace. You can stop at any time, ask questions along the way, and bring someone with you if you wish.";
      } else if (cleanTitle.includes("spesialister med dybde")) {
        enTitle = "Specialists with depth";
        enDesc = "With us you meet doctors who have specialized deeply within their field – not a general practitioner on placement. You get the right expertise from the very first consultation.";
      } else if (cleanTitle.includes("alt under samme tak")) {
        enTitle = "Everything under one roof";
        enDesc = "If you need further examination, treatment or follow-up – we coordinate the entire process for you.";
      }

      if (enTitle && enDesc) {
        promisesChanged = true;
        return {
          ...p,
          title: updateI18nArray(p.title, enTitle),
          desc: updateI18nArray(p.desc, enDesc)
        };
      }

      return p;
    });

    if (promisesChanged) {
      console.log(`Updating promises for document: ${doc._id}`);
      await sanityClient.patch(doc._id).set({ promises }).commit();
      updatedCount++;
    }
  }

  console.log(`Successfully migrated promises translations for ${updatedCount} treatments in Sanity!`);
}

run().catch(console.error);
