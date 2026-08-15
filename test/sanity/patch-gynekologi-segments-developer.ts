#!/usr/bin/env npx tsx
/**
 * Developer-only: update Gynekologi life-phase segment cards to match
 * avenewdemo `/gynekologi` (NO verbatim + EN translations).
 *
 *   cd test && npx tsx sanity/patch-gynekologi-segments-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "category-gynekologi";

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

function tagLink(no: string, en: string, href: string) {
  return {
    _key: `tag-${randomBytes(4).toString("hex")}`,
    _type: "categoryLandingSegmentTagLink",
    label: i18nString(no, en),
    href,
  };
}

const SEGMENTS = [
  {
    _key: "lp1",
    id: "menstruasjon",
    title: i18nString(
      "Menstruasjonssyklus, hormonell helse og prevensjon",
      "Menstrual cycle, hormonal health and contraception",
    ),
    description: i18nText(
      "Vi hjelper deg med prevensjon, menstruasjonsforstyrrelser og hormonelle plager — ingen skal leve med plager vi kan hjelpe deg med.",
      "We help you with contraception, menstrual disorders and hormonal symptoms — no one should live with problems we can help you with.",
    ),
    tagLinks: [
      tagLink("Prevensjonsveiledning", "Contraception counselling", "/gynekologi/undersokelse"),
      tagLink("PMOS", "PMOS", "/gynekologi/pcos"),
      tagLink("POI", "POI", "/gynekologi/poi"),
      tagLink("PMS / PMDD", "PMS / PMDD", "/gynekologi/pms-pmdd"),
      tagLink("Blødningsforstyrrelser", "Bleeding disorders", "/gynekologi/blodningsforstyrrelser"),
      tagLink("Cyster på eggstokkene", "Ovarian cysts", "/gynekologi/cyster"),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: "/gynekologi/blodningsforstyrrelser",
  },
  {
    _key: "lp2",
    id: "underliv",
    title: i18nString(
      "Smerter eller ubehag i underlivet og livmoren",
      "Pain or discomfort in the pelvic area and uterus",
    ),
    description: i18nText(
      "Vondt under samleie, vedvarende underlivsplager eller funn som bør undersøkes — vi tar oss tid til å forstå hva som skjer.",
      "Pain during intercourse, persistent pelvic symptoms or findings that need investigation — we take the time to understand what is going on.",
    ),
    tagLinks: [
      tagLink("Vulvalidelser og vulvodyni", "Vulvar disorders and vulvodynia", "/gynekologi/vulvalidelser"),
      tagLink("Vaginisme", "Vaginismus", "/gynekologi/vaginisme"),
      tagLink("Hudproblemer i vulva", "Vulvar skin problems", "/gynekologi/vulvalidelser"),
      tagLink("Test for klamydia / gonoré", "Chlamydia / gonorrhoea testing", "/gynekologi/undersokelse"),
      tagLink("Celleforandringer", "Cell changes", "/gynekologi/celleforandringer"),
      tagLink("Konisering", "Cone biopsy", "/gynekologi/celleforandringer"),
      tagLink("Endometriose og adenomyose", "Endometriosis and adenomyosis", "/gynekologi/endometriose"),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: "/gynekologi/vulvalidelser",
  },
  {
    _key: "lp3",
    id: "graviditet",
    title: i18nString(
      "Graviditet, fødsel og tiden etter",
      "Pregnancy, birth and the time after",
    ),
    description: i18nText(
      "Svangerskapskontroll, ultralyd, fostermedisin, etterkontroll og bekkenbunn hører hjemme i graviditetsområdet vårt — der finner du hele tilbudet samlet.",
      "Antenatal care, ultrasound, fetal medicine, postnatal check-ups and pelvic floor belong in our pregnancy area — that is where you will find the full range of services.",
    ),
    tagLinks: [
      tagLink("Se alle graviditetstjenester", "See all pregnancy services", "/graviditet"),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: "/graviditet",
  },
  {
    _key: "lp4",
    id: "urogynekologi",
    title: i18nString(
      "Urogynekologi — fremfall og lekkasje",
      "Urogynecology — prolapse and leakage",
    ),
    description: i18nText(
      "Tyngdefølelse i underlivet, fremfall (prolaps) eller urinlekkasje kan oppstå i alle livsfaser. Vi utreder og behandler både konservativt og kirurgisk.",
      "A feeling of heaviness in the pelvic area, prolapse or urinary leakage can occur at any life stage. We investigate and treat both conservatively and surgically.",
    ),
    tagLinks: [
      tagLink("Urogynekologi", "Urogynecology", "/gynekologi/urogynekologi"),
      tagLink("Vaginale fremfall", "Vaginal prolapse", "/gynekologi/vaginale-fremfall"),
      tagLink("Urininkontinens", "Urinary incontinence", "/gynekologi/urinlekkasje"),
      tagLink("Tyngdefølelse i underlivet", "Pelvic heaviness", "/gynekologi/urogynekologi"),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: "/gynekologi/urogynekologi",
  },
  {
    _key: "lp5",
    id: "overgangsalder",
    title: i18nString(
      "Overgangsalder — på dine premisser",
      "Menopause — on your terms",
    ),
    description: i18nText(
      "Perimenopause og menopause kan være krevende. Vi hjelper deg å forstå kroppen og finner riktig behandling for deg.",
      "Perimenopause and menopause can be challenging. We help you understand your body and find the right treatment for you.",
    ),
    tagLinks: [
      tagLink("Overgangsalder / klimakteriet", "Menopause / climacteric", "/gynekologi/overgangsalder"),
      tagLink("Hormonbehandling", "Hormone therapy", "/gynekologi/overgangsalder"),
      tagLink("Tørrhet i underlivet", "Vaginal dryness", "/gynekologi/overgangsalder"),
      tagLink("Hetetokter og søvnproblemer", "Hot flushes and sleep problems", "/gynekologi/overgangsalder"),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: "/gynekologi/overgangsalder",
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id][0]._id`,
    { id: DOC_ID },
  );
  if (!exists) throw new Error(`Missing document ${DOC_ID}`);

  await sanityClient
    .patch(DOC_ID)
    .set({
      "landingPage.segmentsSection.title": i18nString(
        "Kroppen endrer seg gjennom livet — vi er her i alle fasene.",
        "The body changes throughout life — we are here in every phase.",
      ),
      "landingPage.segmentsSection.layout": "accordion",
      "landingPage.segmentsSection.segments": SEGMENTS,
    })
    .commit({ autoGenerateArrayKeys: true });

  const verify = await sanityClient.fetch(`*[_id==$id][0]{
    "titleNo": landingPage.segmentsSection.title[language=="no"][0].value,
    "titleEn": landingPage.segmentsSection.title[language=="en"][0].value,
    "segments": landingPage.segmentsSection.segments[]{
      "titleNo": title[language=="no"][0].value,
      "titleEn": title[language=="en"][0].value,
      "descNo": description[language=="no"][0].value,
      "tagCount": count(tagLinks),
      "tagsNo": tagLinks[].label[language=="no"][0].value
    }
  }`, { id: DOC_ID });

  console.log("✓ Patched gynekologi segments on developer");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
