#!/usr/bin/env npx tsx
/**
 * Seed treatmentCategory.profileHighlight* for specialist profile bands (demo parity).
 *
 *   cd test && npx tsx sanity/patch-category-profile-highlight-intros.ts --dry-run
 */
import { sanityClient, DATASET, PROJECT_ID } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

type Copy = { titleNo: string; titleEn: string; introNo: string; introEn: string };

const COPY: Record<string, Copy> = {
  graviditet: {
    titleNo: "Graviditet",
    titleEn: "Pregnancy",
    introNo:
      "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere.",
    introEn:
      "You are welcome for follow-up throughout pregnancy. We offer prenatal diagnostics such as NIPT and early ultrasound. Our team includes obstetricians, specialist gynaecologists and fetal medicine doctors.",
  },
  gynekologi: {
    titleNo: "Gynekologi",
    titleEn: "Gynecology",
    introNo:
      "Velkommen til CMedical Kvinnehelse og våre spesialister innen gynekologi, fertilitet og kirurgi. Vi tilbyr et spisset og bredt tilbud som gir deg direkte tilgang til riktig ekspertise, uten omveier.",
    introEn:
      "Welcome to CMedical women's health and our specialists in gynecology, fertility and surgery. We offer focused, broad care with direct access to the right expertise.",
  },
  fertilitet: {
    titleNo: "Fertilitet",
    titleEn: "Fertility",
    introNo:
      "Vi hjelper deg som ønsker å bli gravid – med utredning, behandling og tett oppfølging. Vårt fertilitetsteam kombinerer medisinsk spisskompetanse med psykologisk støtte når du trenger det.",
    introEn:
      "We support you on your path to pregnancy with assessment, treatment and close follow-up from our fertility team.",
  },
  urologi: {
    titleNo: "Urologi",
    titleEn: "Urology",
    introNo:
      "Urologi omhandler plager og sykdommer knyttet til mannens underliv og urinorganer hos begge kjønn. Våre spesialister hjelper deg med utredning og behandling – uten henvisning.",
    introEn:
      "Urology covers conditions of the male reproductive system and urinary tract in all patients. Our specialists offer assessment and treatment without referral.",
  },
  ortopedi: {
    titleNo: "Ortopedi",
    titleEn: "Orthopedics",
    introNo:
      "Hos oss møter du ortopediske spesialister som jobber med muskel- og skjelettplager, idrettsskader og leddproblemer – med korte ventetider og moderne utstyr.",
    introEn:
      "Meet orthopaedic specialists for musculoskeletal problems, sports injuries and joint conditions – with short waiting times.",
  },
  "flere-fagomrader": {
    titleNo: "Flere fagområder",
    titleEn: "More specialties",
    introNo:
      "Vi har samlet noen av Nordens fremste spesialister innen gastrokirurgi, revmatologi, dermatologi, ernæring, karkirurgi, osteopati, psykologi og sexologi.",
    introEn:
      "Leading specialists across gastroenterology, rheumatology, dermatology, nutrition, vascular surgery, osteopathy, psychology and sexology.",
  },
};

function i18nString(no: string, en: string) {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Unexpected project ${PROJECT_ID}`);
  console.log(`Dataset: ${DATASET}`, DRY_RUN ? "(dry run)" : "");

  for (const [categoryId, copy] of Object.entries(COPY)) {
    const doc = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "treatmentCategory" && categoryId == $categoryId][0]{ _id }`,
      { categoryId },
    );
    if (!doc?._id) {
      console.warn(`skip ${categoryId}: category doc not found`);
      continue;
    }
    const id = doc._id.replace(/^drafts\./, "");
    console.log(`→ ${categoryId} (${id})`);
    if (DRY_RUN) continue;
    await sanityClient
      .patch(id)
      .set({
        profileHighlightTitle: i18nString(copy.titleNo, copy.titleEn),
        profileHighlightIntro: i18nText(copy.introNo, copy.introEn),
      })
      .commit();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
