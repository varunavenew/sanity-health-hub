/**
 * Developer-only: Ortopedi why-section parity vs avenewdemo `/ortopedi`.
 *
 * - Exact title / ingress / 3 numbered steps (01–03)
 * - Team image (ortopedi-team.jpg) + alt "Ortopedene i CMedical"
 *
 *   cd test && npx tsx sanity/patch-ortopedi-why-section-developer.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_IDS = ["category-ortopedi", "drafts.category-ortopedi"] as const;
const TEAM_IMAGE_RELATIVE = "categories/ortopedi-team.jpg";
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
    throw new Error(`Missing team image: ${fullPath}`);
  }
  const buffer = fs.readFileSync(fullPath);
  console.log(`  📸 Uploading ${TEAM_IMAGE_RELATIVE} (${buffer.length} bytes)…`);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: "ortopedi-team.jpg",
    contentType: "image/jpeg",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function buildWhySection(existing: Record<string, unknown> | undefined, image: {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
}) {
  return {
    ...(existing || {}),
    title: i18nString(
      "Landets fremste ortopeder — uten ventetid.",
      "The country's foremost orthopedists — without waiting.",
    ),
    description: i18nText(
      "Hos CMedical møter du noen av landets fremste ortopediske kirurger. Du får den samme ekspertisen som ved de store universitetssykehusene — uten henvisning og uten lang ventetid.",
      "At CMedical you meet some of the country's foremost orthopedic surgeons. You get the same expertise as at the major university hospitals — without a referral and without a long wait.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString("Alt under samme tak", "Everything under one roof"),
        description: i18nText(
          "Utredning, bildediagnostikk og kirurgi samlet — for skulder, kne, hofte, hånd og albue, fot og ankel.",
          "Assessment, imaging and surgery in one place — for shoulder, knee, hip, hand and elbow, foot and ankle.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString("Ledende kompetanse", "Leading expertise"),
        description: i18nText(
          "Noen av landets fremste kirurger tar seg av selv de mest komplekse tilfellene.",
          "Some of the country's foremost surgeons handle even the most complex cases.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Tett oppfølging", "Close follow-up"),
        description: i18nText(
          "Ett tverrfaglig team med fysioterapeut og osteopat følger deg fra første konsultasjon til kontroll etter behandling.",
          "One interdisciplinary team with physiotherapist and osteopath follows you from the first consultation to follow-up after treatment.",
        ),
      },
    ],
    image,
    imageAlt: i18nString(
      "Ortopedene i CMedical",
      "The orthopedists at CMedical",
    ),
  };
}

async function main() {
  console.log(`\nOrtopedi why-section patch (DRY_RUN=${DRY_RUN})\n`);

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
              desc: s.description[0].value.slice(0, 48) + "…",
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
