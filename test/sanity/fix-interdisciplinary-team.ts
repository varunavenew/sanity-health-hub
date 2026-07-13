#!/usr/bin/env npx tsx
/**
 * Fix the "Our interdisciplinary team" relatedSection for the
 * gynekologi/tverrfaglig treatment document:
 *  1. Set asIntro = true (so it renders as the intro block)
 *  2. Set correct title: "Vårt tverrfaglige team" / "Our interdisciplinary team"
 *  3. Set correct lead text in both languages
 *  4. Fix English titles/slugs for the 4 linked treatments (Osteopat, Sexolog, Psykolog, Ernæringsfysiolog)
 */
import { sanityClient } from "./config";

const DOC_ID = "treatment-gynekologi-tverrfaglig";

function i18nNoEn(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", value: en },
  ];
}

function i18nTextNoEn(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayTextValue", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", value: en },
  ];
}

async function fixLinkedTreatmentTitles() {
  // Fix English titles for the 4 linked treatment documents
  const fixes = [
    {
      id: "treatment-flere-fagomrader-osteopati",
      titleNo: "Osteopat",
      titleEn: "Osteopath",
      slugEn: "osteopath",
    },
    {
      id: "treatment-flere-fagomrader-sexologi",
      titleNo: "Sexologi",
      titleEn: "Sexologist",
      slugEn: "sexologist",
    },
    {
      id: "treatment-flere-fagomrader-psykologi",
      titleNo: "Psykologi",
      titleEn: "Psychology",
      slugEn: "psychology",
    },
    {
      id: "treatment-flere-fagomrader-ernaringsfysiolog",
      titleNo: "Ernæringsfysiolog",
      titleEn: "Nutritionist",
      slugEn: "nutritionist",
    },
  ];

  for (const fix of fixes) {
    // Get current title array
    const doc = await sanityClient.fetch(
      `*[_id == $id][0]{ title, slug }`,
      { id: fix.id }
    );
    if (!doc) {
      console.log(`⚠ Not found: ${fix.id}`);
      continue;
    }

    // Build updated title: keep no entry, update/add en entry
    const currentTitle = Array.isArray(doc.title) ? doc.title : [];
    const noEntry = currentTitle.find(
      (t: any) => t.language === "no" || t._key === "no"
    ) || { _key: "no", _type: "internationalizedArrayStringValue", value: fix.titleNo };
    const enEntry = {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      value: fix.titleEn,
    };

    // Build updated slug: keep no entry, update/add en entry
    const currentSlug = Array.isArray(doc.slug) ? doc.slug : [];
    const noSlug = currentSlug.find(
      (s: any) => s.language === "no" || s._key === "no"
    );
    const enSlugEntry = {
      _key: "en",
      _type: "internationalizedArrayStringValue" as const,
      value: { _type: "slug", current: fix.slugEn },
    };

    await sanityClient
      .patch(fix.id)
      .set({
        title: [noEntry, enEntry],
      })
      .commit();

    console.log(`  ✓ Fixed title for ${fix.id}: "${fix.titleEn}"`);
  }
}

async function fixTverrfagligRelatedSection() {
  await sanityClient
    .patch(DOC_ID)
    .set({
      "relatedSection.asIntro": true,
      "relatedSection.title": i18nNoEn(
        "Vårt tverrfaglige team",
        "Our interdisciplinary team"
      ),
      "relatedSection.lead": i18nTextNoEn(
        "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
        "Our gynecologists focus exclusively on what they do best, and when needed we collaborate in unique expert teams with psychologists, sexologists, nutritionists, physiotherapists, osteopaths, and urotherapists. This multidisciplinary approach is truly unique!"
      ),
      "relatedSection.seeAllHref": "/behandlinger/gynekologi",
      "relatedSection.seeAllLabel": i18nNoEn(
        "Se alle gynekologi-tjenester",
        "See all gynecology services"
      ),
      "relatedSection.eyebrow": i18nNoEn(
        "Ekspertteam",
        "Expert team"
      ),
    })
    .commit();

  console.log(`  ✓ Fixed relatedSection for ${DOC_ID}`);
}

async function run() {
  console.log("🔧 Fixing interdisciplinary team section...\n");

  console.log("1. Fixing English titles for linked treatments...");
  await fixLinkedTreatmentTitles();

  console.log("\n2. Fixing relatedSection on tverrfaglig document...");
  await fixTverrfagligRelatedSection();

  console.log("\n✅ Done! The interdisciplinary team section should now render correctly.");
  console.log("   - asIntro: true → renders as intro block (not bottom related block)");
  console.log("   - title: 'Our interdisciplinary team'");
  console.log("   - Items: Osteopath, Sexologist, Psychology, Nutritionist");
}

run().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
