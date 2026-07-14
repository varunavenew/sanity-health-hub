import { sanityClient } from "./config";

async function run() {
  const docId = "treatment-flere-fagomrader-endokrinologi";
  const doc = await sanityClient.getDocument(docId);
  if (!doc) {
    console.error("Document not found");
    return;
  }

  // Update helper for root internationalized arrays
  const updateI18nArray = (arr: any[] | undefined, enValue: string) => {
    if (!arr) return arr;
    return arr.map(item => {
      if (item.language === "en" || item._key === "en") {
        return { ...item, value: enValue };
      }
      return item;
    });
  };

  const title = updateI18nArray(doc.title as any[], "Endocrinology");
  const description = updateI18nArray(doc.description as any[], "Endocrinology is a medical specialty dealing with the endocrine system and diseases related to hormone-producing glands.");
  const heroDescription = updateI18nArray(doc.heroDescription as any[], "Endocrinology is a medical specialty dealing with the endocrine system and diseases related to hormone-producing glands.");
  const reasonsTitle = updateI18nArray(doc.reasonsTitle as any[], "About endocrinology");
  const seePricesLabel = updateI18nArray(doc.seePricesLabel as any[], "See prices");
  const callCtaLabel = updateI18nArray(doc.callCtaLabel as any[], "Call us");
  const conversationCtaTitle = updateI18nArray(doc.conversationCtaTitle as any[], "Speak with one of our specialists");
  const primaryCtaLabel = updateI18nArray(doc.primaryCtaLabel as any[], "Find a time and book");

  // Update SEO
  const seo = doc.seo ? {
    ...doc.seo,
    metaTitle: updateI18nArray((doc.seo as any).metaTitle, "Endocrinology | CMedical"),
    metaDescription: updateI18nArray((doc.seo as any).metaDescription, "Endocrinology is a medical specialty dealing with the endocrine system and diseases related to hormone-producing glands.")
  } : undefined;

  // Update Promises
  const promises = (doc.promises as any[] || []).map(p => {
    const titleVal = (p.title as any[] || []).find(t => t.language === "no" || t._key === "no")?.value || "";
    let enTitle = "";
    let enDesc = "";

    if (titleVal.includes("Du bestemmer") || titleVal.includes("du bestemmer")) {
      enTitle = "You decide what you are comfortable with";
      enDesc = "All examinations and procedures are done at your pace. You can stop at any time, ask questions along the way, and bring someone with you if you wish.";
    } else if (titleVal.includes("Spesialister med dybde") || titleVal.includes("spesialister med dybde")) {
      enTitle = "Specialists with depth";
      enDesc = "With us you meet doctors who have specialized deeply within their field – not a general practitioner on placement. You get the right expertise from the very first consultation.";
    } else if (titleVal.includes("Alt under samme tak") || titleVal.includes("alt under samme tak")) {
      enTitle = "Everything under one roof";
      enDesc = "If you need further examination, treatment or follow-up – we coordinate the entire process for you.";
    }

    return {
      ...p,
      title: updateI18nArray(p.title, enTitle),
      desc: updateI18nArray(p.desc, enDesc)
    };
  });

  // Update Reasons
  const reasons = (doc.reasons as any[] || []).map(r => {
    return {
      ...r,
      title: updateI18nArray(r.title, "Endocrinology"),
      desc: updateI18nArray(r.desc, "Endocrinology is a medical specialty dealing with the endocrine system and diseases related to hormone-producing glands.")
    };
  });

  // Commit changes
  const patch: any = {};
  if (title) patch.title = title;
  if (description) patch.description = description;
  if (heroDescription) patch.heroDescription = heroDescription;
  if (reasonsTitle) patch.reasonsTitle = reasonsTitle;
  if (seePricesLabel) patch.seePricesLabel = seePricesLabel;
  if (callCtaLabel) patch.callCtaLabel = callCtaLabel;
  if (conversationCtaTitle) patch.conversationCtaTitle = conversationCtaTitle;
  if (primaryCtaLabel) patch.primaryCtaLabel = primaryCtaLabel;
  if (seo) patch.seo = seo;
  if (promises.length > 0) patch.promises = promises;
  if (reasons.length > 0) patch.reasons = reasons;

  console.log("Patching Endocrinology document in Sanity...");

  await sanityClient.patch(docId).set(patch).commit();
  console.log("Successfully migrated Endocrinology translations in Sanity!");
}

run().catch(console.error);
