/**
 * Developer-only: Urologi why-section parity vs avenewdemo `/urologi`.
 *
 * - Exact title / ingress / 3 numbered steps (01–03)
 * - Consultation image (urologi-team-trond5.jpg)
 * - Alt: «Urolog i konsultasjon med pasient hos CMedical»
 *
 *   cd test && npx tsx sanity/patch-urologi-why-section-developer.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_IDS = ["category-urologi", "drafts.category-urologi"] as const;
const TEAM_IMAGE_RELATIVE = "categories/urologi-team-trond5.jpg";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    {
      _type: "internationalizedArrayTextValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayTextValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

async function uploadTeamImage(): Promise<{
  _type: "image";
  asset: { _type: "reference"; _ref: string };
}> {
  const fullPath = path.join(ASSETS_DIR, TEAM_IMAGE_RELATIVE);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing image: ${fullPath}`);
  }
  const buffer = fs.readFileSync(fullPath);
  console.log(`  📸 Uploading ${TEAM_IMAGE_RELATIVE} (${buffer.length} bytes)…`);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: "urologi-team-trond5.jpg",
    contentType: "image/jpeg",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function buildWhySection(
  existing: Record<string, unknown> | undefined,
  image: { _type: "image"; asset: { _type: "reference"; _ref: string } },
) {
  return {
    ...(existing || {}),
    title: i18nString(
      "Nordens ledende urologimiljø — samlet på ett sted.",
      "The Nordics' leading urology environment — in one place.",
    ),
    description: i18nText(
      "Hos CMedical møter du flere av Nordens ledende spesialister innen urologi — med direkte tilgang til riktig ekspertise, uten omveier.",
      "At CMedical you meet several of the Nordics' leading specialists in urology — with direct access to the right expertise, without detours.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString(
          "Ledende på robotkirurgi",
          "Leading in robotic surgery",
        ),
        description: i18nText(
          "Som eneste private aktør i Norge tilbyr vi robotassistert kirurgi — over 400 robotoperasjoner i året innen blant annet prostata, blære og nyrer.",
          "As the only private provider in Norway we offer robot-assisted surgery — over 400 robotic operations a year in areas including prostate, bladder and kidneys.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString("Ledende kompetanse", "Leading expertise"),
        description: i18nText(
          "Flere av Nordens fremste urologer, i tverrfaglige team med blant annet osteopat, ernæringsfysiolog, psykolog og sexolog.",
          "Several of the Nordics' foremost urologists, in interdisciplinary teams with osteopath, clinical nutritionist, psychologist and sexologist among others.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Rask hjelp", "Fast help"),
        description: i18nText(
          "Ingen henvisning og kort ventetid — de fleste får time innen en uke.",
          "No referral and short waiting times — most people get an appointment within a week.",
        ),
      },
    ],
    image,
    imageAlt: i18nString(
      "Urolog i konsultasjon med pasient hos CMedical",
      "Urologist in consultation with a patient at CMedical",
    ),
    footerLinkLabel: i18nString(
      "Les mer om klinikken",
      "Learn more about the clinic",
    ),
    footerLinkHref: "/om-oss",
  };
}

async function main() {
  console.log(`\nUrologi why-section patch (DRY_RUN=${DRY_RUN})\n`);

  const image = await uploadTeamImage();
  console.log(`  ✅ Asset ${image.asset._ref}`);

  for (const id of DOC_IDS) {
    const doc = await sanityClient.fetch<{
      _id: string;
      landingPage?: { whySection?: Record<string, unknown> };
    } | null>(`*[_id==$id][0]{ _id, landingPage }`, { id });

    if (!doc?._id) {
      console.log(`  ⏭  ${id} missing — skip`);
      continue;
    }

    const whySection = buildWhySection(doc.landingPage?.whySection, image);
    console.log(`  → ${id}: set why title/steps/image/alt`);

    if (DRY_RUN) {
      console.log(
        JSON.stringify(
          {
            title: whySection.title[0].value,
            steps: whySection.steps.map((s) => ({
              n: s.number,
              title: s.title[0].value,
              desc: s.description[0].value.slice(0, 56) + "…",
            })),
            imageAlt: whySection.imageAlt[0].value,
            imageRef: image.asset._ref,
          },
          null,
          2,
        ),
      );
      continue;
    }

    await sanityClient
      .patch(id)
      .set({ "landingPage.whySection": whySection })
      .commit({ autoGenerateArrayKeys: false });
    console.log(`  ✅ Patched ${id}`);
  }

  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
