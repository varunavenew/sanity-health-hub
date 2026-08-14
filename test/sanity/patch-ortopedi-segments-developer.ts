#!/usr/bin/env npx tsx
/**
 * Developer-only: Ortopedi chooser segments
 * («Vi møter deg uansett hvorfor du tar kontakt.»)
 * NO verbatim from avenewdemo + EN translations.
 *
 *   cd test && npx tsx sanity/patch-ortopedi-segments-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "category-ortopedi";
const ORT = "/ortopedi";
const SPEC = "/spesialister?kategori=ortopedi";

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
    _key: "akutt",
    id: "akutt",
    title: i18nString("Akutt skade eller smerte", "Acute injury or pain"),
    description: i18nText(
      "Vridd kne, vondt etter et fall, akutt skulder- eller hoftesmerte — vi ser deg raskt og legger en plan med en gang.",
      "Twisted knee, pain after a fall, acute shoulder or hip pain — we see you quickly and put a plan in place right away.",
    ),
    tagLinks: [
      tagLink("Akutt", "Acute", `${ORT}/kne`),
      tagLink("Diagnose", "Diagnosis", `${ORT}/skulder`),
      tagLink("MR", "MRI", `${ORT}/kne`),
    ],
    ctaLabel: i18nString("", ""),
    href: `${ORT}/kne`,
  },
  {
    _key: "slitasje",
    id: "slitasje",
    title: i18nString("Slitasje og kroniske plager", "Wear and chronic symptoms"),
    description: i18nText(
      "Kne- og hofteslitasje, frossen skulder, langvarige smerter — utredning og behandling i ditt tempo.",
      "Knee and hip wear, frozen shoulder, long-term pain — investigation and treatment at your pace.",
    ),
    tagLinks: [
      tagLink("Artrose", "Osteoarthritis", `${ORT}/kne`),
      tagLink("Smerte", "Pain", `${ORT}/skulder`),
      tagLink("Bevegelse", "Movement", `${ORT}/hofte`),
    ],
    ctaLabel: i18nString("", ""),
    href: `${ORT}/hofte`,
  },
  {
    _key: "second",
    id: "second",
    title: i18nString("Trenger second opinion", "Need a second opinion"),
    description: i18nText(
      "Har du fått en diagnose du er usikker på? Vi får ofte pasienter med kompliserte caser — og ser dem med nye øyne.",
      "Have you received a diagnosis you are unsure about? We often see patients with complex cases — and look at them with fresh eyes.",
    ),
    tagLinks: [
      tagLink("Second opinion", "Second opinion", SPEC),
      tagLink("Vurdering", "Assessment", SPEC),
    ],
    ctaLabel: i18nString("", ""),
    href: SPEC,
  },
  {
    _key: "kirurgi",
    id: "kirurgi",
    title: i18nString("Klar for kirurgi eller injeksjon", "Ready for surgery or injection"),
    description: i18nText(
      "Artroskopi, kortisoninjeksjon, PRP eller hyaluronsyre — vi tilbyr hele bredden av ortopediske behandlinger.",
      "Arthroscopy, cortisone injection, PRP or hyaluronic acid — we offer the full range of orthopaedic treatments.",
    ),
    tagLinks: [
      tagLink("Kirurgi", "Surgery", `${ORT}/kne`),
      tagLink("PRP", "PRP", `${ORT}/kne`),
      tagLink("Injeksjon", "Injection", `${ORT}/kne`),
    ],
    ctaLabel: i18nString("", ""),
    href: `${ORT}/kne`,
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
        "Vi møter deg uansett hvorfor du tar kontakt.",
        "We meet you whatever your reason for getting in touch.",
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
        "tagsEn": tagLinks[].label[language=="en"][0].value,
        "hrefs": tagLinks[].href
      }
    }`,
    { id: DOC_ID },
  );

  console.log("✓ Patched ortopedi segments on developer");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
