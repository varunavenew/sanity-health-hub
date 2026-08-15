#!/usr/bin/env npx tsx
/**
 * Developer-only: Fertilitet + Graviditet chooser segments
 * («Fortell oss hvor du er — vi finner veien videre.»)
 * NO verbatim from avenewdemo + EN translations.
 *
 *   cd test && npx tsx sanity/patch-fert-grav-segments-developer.ts
 */
import { randomBytes } from "crypto";
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

function tagLink(no: string, en: string, href: string) {
  return {
    _key: `tag-${randomBytes(4).toString("hex")}`,
    _type: "categoryLandingSegmentTagLink",
    label: i18nString(no, en),
    href,
  };
}

const SECTION_TITLE = i18nString(
  "Fortell oss hvor du er — vi finner veien videre.",
  "Tell us where you are — we will find the way forward.",
);

const FERT_SEGMENTS = [
  {
    _key: "forsta",
    id: "forsta",
    title: i18nString(
      "Jeg vil forstå fruktbarheten min",
      "I want to understand my fertility",
    ),
    description: i18nText(
      "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
      "We carry out a thorough fertility check — hormones, ovarian reserve and ultrasound — so you get clear answers instead of uncertainty.",
    ),
    tagLinks: [
      tagLink("Fertilitetsutredning", "Fertility investigation", "/fertilitet/fertilitetsutredning"),
      tagLink("Hormoner og AMH", "Hormones and AMH", "/fertilitet/fertilitetsutredning"),
      tagLink("Ultralyd", "Ultrasound", "/fertilitet/fertilitetsutredning"),
      tagLink("Egglederundersøkelse (HyFoSy)", "Fallopian tube assessment (HyFoSy)", "/fertilitet/fertilitetsutredning"),
      tagLink("Hysteroskopi", "Hysteroscopy", "/fertilitet/fertilitetsutredning"),
      tagLink("Les mer", "Read more", "/fertilitet/fertilitetsutredning"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/fertilitet/fertilitetsutredning",
  },
  {
    _key: "gravid",
    id: "gravid",
    title: i18nString("Jeg vil bli gravid", "I want to become pregnant"),
    description: i18nText(
      "Har du prøvd i 6–12 måneder uten å lykkes? Vi utreder grundig og legger en plan sammen med deg — fra inseminasjon til IVF.",
      "Have you been trying for 6–12 months without success? We investigate thoroughly and make a plan together with you — from insemination to IVF.",
    ),
    tagLinks: [
      tagLink("Utredning", "Investigation", "/fertilitet/fertilitetsutredning"),
      tagLink("Eggløsningsstimulering", "Ovulation stimulation", "/fertilitet/assistert-befruktning"),
      tagLink(
        "Assistert befruktning (IVF, inseminasjon)",
        "Assisted reproduction (IVF, insemination)",
        "/fertilitet/assistert-befruktning",
      ),
      tagLink("Donorbehandling", "Donor treatment", "/fertilitet/donorbehandling"),
      tagLink("Second opinion", "Second opinion", "/fertilitet/fertilitetsutredning"),
      tagLink(
        "Bestill utredning",
        "Book an investigation",
        "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
      ),
    ],
    ctaLabel: i18nString("", ""),
    href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
  },
  {
    _key: "bevare",
    id: "bevare",
    title: i18nString(
      "Jeg vil bevare mulighetene mine",
      "I want to preserve my options",
    ),
    description: i18nText(
      "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
      "Egg freezing gives you time. We explain what it involves, what it costs and when it is right for you.",
    ),
    tagLinks: [
      tagLink("Nedfrysing av egg", "Egg freezing", "/fertilitet/eggfrys"),
      tagLink("Nedfrysing av spermceller", "Sperm freezing", "/fertilitet/saedanalyse"),
      tagLink("Les mer", "Read more", "/fertilitet/eggfrys"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/fertilitet/eggfrys",
  },
  {
    _key: "mann",
    id: "mann",
    title: i18nString(
      "Jeg er mann og vil sjekke fruktbarheten",
      "I am a man and want to check my fertility",
    ),
    description: i18nText(
      "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
      "Half of the explanation often lies with the man. A simple semen analysis gives you answers — discreetly and quickly.",
    ),
    tagLinks: [
      tagLink("Sædanalyse", "Semen analysis", "/fertilitet/saedanalyse"),
      tagLink("Mannlig fertilitet", "Male fertility", "/fertilitet/saedanalyse"),
      tagLink("Mannlig infertilitet", "Male infertility", "/urologi/infertilitet"),
      tagLink("Hormonstimulering av menn", "Hormone stimulation for men", "/fertilitet/saedanalyse"),
      tagLink("Rådgivning online", "Online counselling", "/fertilitet/infertilitet"),
      tagLink(
        "Bestill analyse",
        "Book an analysis",
        "/booking?kategori=fertilitet&tjeneste=sedanalyse",
      ),
    ],
    ctaLabel: i18nString("", ""),
    href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
  },
];

const GRAV_SEGMENTS = [
  {
    _key: "seg-3",
    id: "tidlig-ultralyd",
    title: i18nString(
      "Jeg vil ta tidlig ultralyd",
      "I want an early ultrasound",
    ),
    description: i18nText(
      "Trygghet tidlig i svangerskapet — vi sjekker hjerteslag, plassering og termin, og tar oss god tid til spørsmålene dine.",
      "Reassurance early in pregnancy — we check heartbeat, location and due date, and take plenty of time for your questions.",
    ),
    tagLinks: [
      tagLink("Tidlig ultralyd", "Early ultrasound", "/graviditet/ultralyd"),
      tagLink("Termin og plassering", "Due date and location", "/graviditet/ultralyd"),
      tagLink("Les mer", "Read more", "/graviditet/ultralyd"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/graviditet/ultralyd",
  },
  {
    _key: "seg-6",
    id: "nipt",
    title: i18nString("Jeg vil ta NIPT", "I want NIPT"),
    description: i18nText(
      "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med tidlig ultralyd hos erfaren spesialist.",
      "The latest non-invasive blood test to detect chromosomal abnormalities — combined with early ultrasound with an experienced specialist.",
    ),
    tagLinks: [
      tagLink("NIPT", "NIPT", "/graviditet/nipt"),
      tagLink("Tidlig ultralyd + NIPT", "Early ultrasound + NIPT", "/graviditet/nipt"),
      tagLink("Les mer", "Read more", "/graviditet/nipt"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/graviditet/nipt",
  },
  {
    _key: "seg-9",
    id: "fosterdiagnostikk",
    title: i18nString(
      "Jeg vil ha fosterdiagnostikk i uke 12–14",
      "I want fetal diagnostics in weeks 12–14",
    ),
    description: i18nText(
      "Grundig organrettet undersøkelse i et viktig vindu i svangerskapet. Du møter en spesialist i fostermedisin.",
      "A thorough organ-focused examination in an important window of pregnancy. You meet a fetal medicine specialist.",
    ),
    tagLinks: [
      tagLink("Fosterdiagnostikk", "Fetal diagnostics", "/graviditet/fosterdiagnostikk"),
      tagLink("Organrettet ultralyd", "Organ-focused ultrasound", "/graviditet/fosterdiagnostikk"),
      tagLink("Les mer", "Read more", "/graviditet/fosterdiagnostikk"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/graviditet/fosterdiagnostikk",
  },
  {
    _key: "seg-c",
    id: "team",
    title: i18nString(
      "Jeg vil ha fast jordmor og lege",
      "I want a dedicated midwife and doctor",
    ),
    description: i18nText(
      "Tett, personlig oppfølging gjennom hele svangerskapet — i ro og uten ventetid. Du møter de samme folkene hver gang.",
      "Close, personal follow-up throughout pregnancy — calmly and without waiting time. You meet the same people every time.",
    ),
    tagLinks: [
      tagLink("Graviditetsoppfølging", "Pregnancy follow-up", "/graviditet/svangerskapsteam"),
      tagLink("Jordmor", "Midwife", "/graviditet/svangerskapsteam"),
      tagLink("Les mer", "Read more", "/graviditet/svangerskapsteam"),
    ],
    ctaLabel: i18nString("", ""),
    href: "/graviditet/svangerskapsteam",
  },
];

async function patchCategory(
  id: string,
  segments: typeof FERT_SEGMENTS,
) {
  await sanityClient
    .patch(id)
    .set({
      "landingPage.segmentsSection.title": SECTION_TITLE,
      "landingPage.segmentsSection.layout": "accordion",
      "landingPage.segmentsSection.segments": segments,
    })
    .commit({ autoGenerateArrayKeys: true });

  return sanityClient.fetch(
    `*[_id==$id][0]{
      "titleNo": landingPage.segmentsSection.title[language=="no"][0].value,
      "titleEn": landingPage.segmentsSection.title[language=="en"][0].value,
      "layout": landingPage.segmentsSection.layout,
      "segments": landingPage.segmentsSection.segments[]{
        "titleNo": title[language=="no"][0].value,
        "titleEn": title[language=="en"][0].value,
        "tagCount": count(tagLinks),
        "tagsNo": tagLinks[].label[language=="no"][0].value
      }
    }`,
    { id },
  );
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const fert = await patchCategory("category-fertilitet", FERT_SEGMENTS);
  const grav = await patchCategory("category-graviditet", GRAV_SEGMENTS);

  console.log("✓ Patched Fertilitet + Graviditet chooser segments on developer");
  console.log(JSON.stringify({ fert, grav }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
