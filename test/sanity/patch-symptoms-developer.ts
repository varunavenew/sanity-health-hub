#!/usr/bin/env npx tsx
/**
 * Developer-only: «Hva kjenner du på?» symptomsSection for fert/gyn/uro/orto.
 * NO verbatim from avenewdemo + EN translations. Preserves existing images.
 *
 *   cd test && npx tsx sanity/patch-symptoms-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

const TITLE = i18nString("Hva kjenner du på?", "What are you experiencing?");
const DESCRIPTION = i18nText(
  "Velg det som ligner mest på din situasjon — så foreslår vi en god start.",
  "Choose what best matches your situation — and we will suggest a good place to start.",
);

type SymptomDef = {
  key: string;
  symptomNo: string;
  symptomEn: string;
  serviceNo: string;
  serviceEn: string;
  href: string;
  imageAltNo?: string;
  imageAltEn?: string;
};

const FERT = "/fertilitet";
const GYN = "/gynekologi";
const URO = "/urologi";
const ORT = "/ortopedi";

const PATCHES: Array<{ id: string; items: SymptomDef[] }> = [
  {
    id: "category-fertilitet",
    items: [
      {
        key: "s1",
        symptomNo: "Vi har prøvd i over et år uten å lykkes",
        symptomEn: "We have tried for over a year without success",
        serviceNo: "Fertilitetsutredning",
        serviceEn: "Fertility investigation",
        href: `${FERT}/fertilitetsutredning`,
        imageAltNo: "Par i samtale",
        imageAltEn: "Couple in conversation",
      },
      {
        key: "s2",
        symptomNo: "Uregelmessig syklus eller mistanke om PMOS",
        symptomEn: "Irregular cycle or suspected PMOS",
        serviceNo: "Hormonutredning",
        serviceEn: "Hormone investigation",
        href: `${FERT}/fertilitetsutredning`,
        imageAltNo: "Konsultasjon med spesialist",
        imageAltEn: "Consultation with a specialist",
      },
      {
        key: "s3",
        symptomNo: "Jeg vil vite hvor mye tid jeg har",
        symptomEn: "I want to know how much time I have",
        serviceNo: "AMH og eggstokkreserve",
        serviceEn: "AMH and ovarian reserve",
        href: `${FERT}/fertilitetsutredning`,
        imageAltNo: "Stille refleksjon",
        imageAltEn: "Quiet reflection",
      },
      {
        key: "s4",
        symptomNo: "Vi vurderer nedfrysing av egg",
        symptomEn: "We are considering egg freezing",
        serviceNo: "Konsultasjon eggfrys",
        serviceEn: "Egg freezing consultation",
        href: `${FERT}/eggfrys`,
        imageAltNo: "Laboratorium for nedfrysing",
        imageAltEn: "Laboratory for freezing",
      },
      {
        key: "s5",
        symptomNo: "Partneren vil sjekke fruktbarheten",
        symptomEn: "My partner wants to check fertility",
        serviceNo: "Sædanalyse",
        serviceEn: "Semen analysis",
        href: `${FERT}/saedanalyse`,
        imageAltNo: "Mannlig fertilitetsutredning",
        imageAltEn: "Male fertility investigation",
      },
      {
        key: "s6",
        symptomNo: "Vi ønsker å bli foreldre som likekjønnet par",
        symptomEn: "We want to become parents as a same-sex couple",
        serviceNo: "Donorbehandling",
        serviceEn: "Donor treatment",
        href: `${FERT}/donorbehandling`,
        imageAltNo: "Vei mot foreldreskap",
        imageAltEn: "Path to parenthood",
      },
    ],
  },
  {
    id: "category-gynekologi",
    items: [
      {
        key: "s1",
        symptomNo: "Vondt under samleie",
        symptomEn: "Pain during intercourse",
        serviceNo: "Gynekologisk undersøkelse",
        serviceEn: "Gynaecological examination",
        href: `${GYN}/undersokelse`,
      },
      {
        key: "s2",
        symptomNo: "Kraftige eller langvarige menssmerter",
        symptomEn: "Severe or prolonged period pain",
        serviceNo: "Endometriose-utredning",
        serviceEn: "Endometriosis investigation",
        href: `${GYN}/endometriose`,
      },
      {
        key: "s3",
        symptomNo: "Urinlekkasje eller bekkenbunnsplager",
        symptomEn: "Urinary leakage or pelvic floor issues",
        serviceNo: "Bekkenbunnsutredning",
        serviceEn: "Pelvic floor investigation",
        href: `${GYN}/urinlekkasje`,
      },
      {
        key: "s4",
        symptomNo: "Hetetokter, søvnløshet, humørsvingninger",
        symptomEn: "Hot flushes, insomnia, mood swings",
        serviceNo: "Overgangsalder-konsultasjon",
        serviceEn: "Menopause consultation",
        href: `${GYN}/overgangsalder`,
      },
      {
        key: "s5",
        symptomNo: "Uregelmessig syklus eller mistanke om PMOS",
        symptomEn: "Irregular cycle or suspected PMOS",
        serviceNo: "PMOS-utredning",
        serviceEn: "PMOS investigation",
        href: `${GYN}/pcos`,
      },
      {
        key: "s6",
        symptomNo: "Smerter, kløe eller ubehag i vulva",
        symptomEn: "Pain, itching or discomfort in the vulva",
        serviceNo: "Vulva-utredning",
        serviceEn: "Vulva investigation",
        href: `${GYN}/vulvalidelser`,
      },
    ],
  },
  {
    id: "category-urologi",
    items: [
      {
        key: "s1",
        symptomNo: "Svak eller hyppig vannlating",
        symptomEn: "Weak or frequent urination",
        serviceNo: "Prostatautredning",
        serviceEn: "Prostate investigation",
        href: `${URO}/prostata`,
      },
      {
        key: "s2",
        symptomNo: "Forhøyet PSA eller mistanke om prostatakreft",
        symptomEn: "Elevated PSA or suspected prostate cancer",
        serviceNo: "Prostatasjekk",
        serviceEn: "Prostate check",
        href: `${URO}/prostata`,
      },
      {
        key: "s3",
        symptomNo: "Smerter, kul eller hevelse i pungen",
        symptomEn: "Pain, lump or swelling in the scrotum",
        serviceNo: "Testikkelutredning",
        serviceEn: "Testicular investigation",
        href: `${URO}/testikler`,
      },
      {
        key: "s4",
        symptomNo: "Plager fra blære eller urinveier",
        symptomEn: "Bladder or urinary tract issues",
        serviceNo: "Blære- og urinveisutredning",
        serviceEn: "Bladder and urinary tract investigation",
        href: `${URO}/blaere`,
      },
      {
        key: "s5",
        symptomNo: "Spørsmål om nyrene",
        symptomEn: "Questions about the kidneys",
        serviceNo: "Nyreutredning",
        serviceEn: "Kidney investigation",
        href: `${URO}/nyrer`,
      },
      {
        key: "s6",
        symptomNo: "Vurderer sterilisering (vasektomi)",
        symptomEn: "Considering sterilisation (vasectomy)",
        serviceNo: "Sterilisering",
        serviceEn: "Sterilisation",
        href: `${URO}/sterilisering`,
      },
    ],
  },
  {
    id: "category-ortopedi",
    items: [
      {
        key: "s1",
        symptomNo: "Smerter i skulderen ved løft",
        symptomEn: "Shoulder pain when lifting",
        serviceNo: "Skulderutredning",
        serviceEn: "Shoulder investigation",
        href: `${ORT}/skulder`,
      },
      {
        key: "s2",
        symptomNo: "Vondt eller ustabilt kne",
        symptomEn: "Painful or unstable knee",
        serviceNo: "Kneutredning",
        serviceEn: "Knee investigation",
        href: `${ORT}/kne`,
      },
      {
        key: "s3",
        symptomNo: "Hofteslitasje og hoftesmerter",
        symptomEn: "Hip wear and hip pain",
        serviceNo: "Hofteutredning",
        serviceEn: "Hip investigation",
        href: `${ORT}/hofte`,
      },
      {
        key: "s4",
        symptomNo: "Nummenhet eller stikninger i hånden",
        symptomEn: "Numbness or tingling in the hand",
        serviceNo: "Karpaltunnel-utredning",
        serviceEn: "Carpal tunnel investigation",
        href: `${ORT}/hand-albue`,
      },
      {
        key: "s5",
        symptomNo: "Vondt i albuen ved gripe-bevegelser",
        symptomEn: "Elbow pain when gripping",
        serviceNo: "Tennisalbue-utredning",
        serviceEn: "Tennis elbow investigation",
        href: `${ORT}/hand-albue`,
      },
      {
        key: "s6",
        symptomNo: "Smerter eller skader i fot og ankel",
        symptomEn: "Pain or injuries in the foot and ankle",
        serviceNo: "Fot- og ankelutredning",
        serviceEn: "Foot and ankle investigation",
        href: `${ORT}/fot-ankel`,
      },
    ],
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const summary: Record<string, unknown> = {};

  for (const patch of PATCHES) {
    const existing = await sanityClient.fetch<
      Array<{ _key?: string; image?: unknown; imageAlt?: unknown }> | null
    >(
      `*[_id==$id][0].landingPage.symptomsSection.items[]{ _key, image, imageAlt }`,
      { id: patch.id },
    );
    if (existing === null && !(await sanityClient.fetch(`*[_id==$id][0]._id`, { id: patch.id }))) {
      throw new Error(`Missing document ${patch.id}`);
    }

    const byKey = new Map((existing || []).map((row) => [row._key, row]));

    const items = patch.items.map((def) => {
      const prev = byKey.get(def.key);
      const row: Record<string, unknown> = {
        _key: def.key,
        _type: "categoryLandingSymptom",
        symptom: i18nString(def.symptomNo, def.symptomEn),
        service: i18nString(def.serviceNo, def.serviceEn),
        href: def.href,
      };
      if (prev?.image) row.image = prev.image;
      if (def.imageAltNo && def.imageAltEn) {
        row.imageAlt = i18nString(def.imageAltNo, def.imageAltEn);
      } else if (prev?.imageAlt) {
        row.imageAlt = prev.imageAlt;
      }
      return row;
    });

    await sanityClient
      .patch(patch.id)
      .set({
        "landingPage.symptomsSection.title": TITLE,
        "landingPage.symptomsSection.description": DESCRIPTION,
        "landingPage.symptomsSection.items": items,
      })
      .commit({ autoGenerateArrayKeys: true });

    summary[patch.id] = await sanityClient.fetch(
      `*[_id==$id][0]{
        "titleNo": landingPage.symptomsSection.title[language=="no"][0].value,
        "titleEn": landingPage.symptomsSection.title[language=="en"][0].value,
        "items": landingPage.symptomsSection.items[]{
          "symNo": symptom[language=="no"][0].value,
          "svcNo": service[language=="no"][0].value,
          href,
          "hasImage": defined(image.asset)
        }
      }`,
      { id: patch.id },
    );
    console.log(`✓ ${patch.id}`);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
