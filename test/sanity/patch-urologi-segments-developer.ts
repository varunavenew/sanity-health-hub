#!/usr/bin/env npx tsx
/**
 * Developer-only: Urologi chooser segments
 * («Vi møter deg der du er — uansett hvorfor du tar kontakt.»)
 * NO verbatim from avenewdemo + EN translations.
 *
 *   cd test && npx tsx sanity/patch-urologi-segments-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "category-urologi";

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
    _key: "seg1",
    id: "mann-underliv",
    title: i18nString(
      "Mann med plager i underlivet",
      "Man with pelvic symptoms",
    ),
    description: i18nText(
      "Prostataproblemer, smerter i testikler, ereksjonsproblemer eller vannlatingsplager — vi hjelper deg finne svar.",
      "Prostate problems, testicular pain, erection problems or urinary symptoms — we help you find answers.",
    ),
    tagLinks: [
      tagLink("Prostata", "Prostate", "/urologi/prostata"),
      tagLink("Vannlating", "Urination", "/urologi/prostata"),
      tagLink("Ereksjon", "Erection", "/urologi/prostata"),
      tagLink("Bestill konsultasjon", "Book a consultation", "/booking?kategori=urologi"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/booking?kategori=urologi",
  },
  {
    _key: "seg2",
    id: "kvinne-urologi",
    title: i18nString(
      "Kvinne med urologiske plager",
      "Woman with urological symptoms",
    ),
    description: i18nText(
      "Urinlekkasje, hyppig vannlating, blæreinfeksjoner eller blod i urinen — urologi gjelder ikke bare menn.",
      "Urinary leakage, frequent urination, bladder infections or blood in the urine — urology is not only for men.",
    ),
    tagLinks: [
      tagLink("Inkontinens", "Incontinence", "/urologi/blaere"),
      tagLink("Blære", "Bladder", "/urologi/blaere"),
      tagLink("Nyrer", "Kidneys", "/urologi/nyrer"),
      tagLink("Les mer", "Read more", "/urologi/blaere"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/urologi/blaere",
  },
  {
    _key: "seg3",
    id: "prostatasjekk",
    title: i18nString("Prostatasjekk", "Prostate check"),
    description: i18nText(
      "Vi anbefaler alle menn over 50 å ta en prostatasjekk — eller tidligere ved symptomer, forhøyet PSA eller arvelighet.",
      "We recommend that all men over 50 have a prostate check — or earlier if you have symptoms, elevated PSA or a family history.",
    ),
    tagLinks: [
      tagLink("PSA", "PSA", "/urologi/prostata"),
      tagLink("Forebygging", "Prevention", "/urologi/prostata"),
      tagLink("Utredning", "Investigation", "/urologi/prostata"),
      tagLink(
        "Bestill prostatasjekk",
        "Book a prostate check",
        "/booking?kategori=urologi&tjeneste=prostatasjekk",
      ),
    ],
    ctaLabel: i18nString("", ""),
    href: "/booking?kategori=urologi&tjeneste=prostatasjekk",
  },
  {
    _key: "seg4",
    id: "sterilisering",
    title: i18nString(
      "Sterilisering og fertilitet",
      "Sterilisation and fertility",
    ),
    description: i18nText(
      "Sterilisering, refertilisering og utredning av mannlig infertilitet — raskt, trygt og med kort restitusjon.",
      "Sterilisation, reversal and investigation of male infertility — quickly, safely and with a short recovery.",
    ),
    tagLinks: [
      tagLink("Vasektomi", "Vasectomy", "/urologi/sterilisering"),
      tagLink("Refertilisering", "Reversal", "/urologi/refertilisering"),
      tagLink("Bestill time", "Book an appointment", "/booking?kategori=urologi"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/booking?kategori=urologi",
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
        "Vi møter deg der du er — uansett hvorfor du tar kontakt.",
        "We meet you where you are — whatever your reason for getting in touch.",
      ),
      "landingPage.segmentsSection.layout": "accordion",
      "landingPage.segmentsSection.segments": SEGMENTS,
    })
    .commit({ autoGenerateArrayKeys: true });

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{
      "titleNo": landingPage.segmentsSection.title[language=="no"][0].value,
      "titleEn": landingPage.segmentsSection.title[language=="en"][0].value,
      "layout": landingPage.segmentsSection.layout,
      "segments": landingPage.segmentsSection.segments[]{
        "titleNo": title[language=="no"][0].value,
        "titleEn": title[language=="en"][0].value,
        "tagsNo": tagLinks[].label[language=="no"][0].value,
        "hrefs": tagLinks[].href
      }
    }`,
    { id: DOC_ID },
  );

  console.log("✓ Patched urologi segments on developer");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
