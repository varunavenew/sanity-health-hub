/**
 * Developer-only: Graviditet «Hva vi tilbyr» parity vs avenewdemo `/graviditet`.
 *
 *   cd test && npx tsx sanity/patch-graviditet-services-developer.ts
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

function item(
  key: string,
  titleNo: string,
  titleEn: string,
  descNo: string,
  descEn: string,
  href: string,
) {
  return {
    _key: key,
    title: i18nString(titleNo, titleEn),
    description: i18nString(descNo, descEn),
    href,
  };
}

function group(
  key: string,
  labelNo: string,
  labelEn: string,
  items: ReturnType<typeof item>[],
) {
  return {
    _key: key,
    label: i18nString(labelNo, labelEn),
    items,
  };
}

const GRAV = "/graviditet";
const DOC_IDS = ["category-graviditet", "drafts.category-graviditet"] as const;

const SERVICES = {
  title: i18nString("Hva vi tilbyr", "What we offer"),
  description: i18nText(
    "Fra tidlig ultralyd til fast jordmor — hele svangerskapstilbudet vårt finner du her. Trenger du hjelp til å velge, ring oss for en uforpliktende prat.",
    "From early ultrasound to a dedicated midwife — you will find our entire pregnancy offering here. If you need help choosing, call us for a no-obligation chat.",
  ),
  groups: [
    group("sg-tidlig", "Tidlig i svangerskapet", "Early in pregnancy", [
      item(
        "p1",
        "Ultralyd i svangerskapet",
        "Pregnancy ultrasound",
        "Hjerteslag, termin og plassering",
        "Heartbeat, due date and placement",
        `${GRAV}/ultralyd`,
      ),
      item(
        "p2",
        "NIPT",
        "NIPT",
        "Trygg og rask avklaring av kromosomavvik",
        "Safe and fast clarification of chromosomal abnormalities",
        `${GRAV}/nipt`,
      ),
      item(
        "p3",
        "Ultralyd i svangerskapet + NIPT",
        "Pregnancy ultrasound + NIPT",
        "Kombinert tilbud i én konsultasjon",
        "Combined offer in one consultation",
        `${GRAV}/nipt`,
      ),
    ]),
    group("sg-foster", "Fostermedisin og diagnostikk", "Fetal medicine and diagnostics", [
      item(
        "p4",
        "Fosterdiagnostikk",
        "Fetal diagnostics",
        "Detaljert vurdering av fosteret",
        "Detailed assessment of the fetus",
        `${GRAV}/fosterdiagnostikk`,
      ),
      item(
        "p5",
        "Organrettet ultralyd uke 12–14",
        "Organ-focused ultrasound weeks 12–14",
        "Spesialist i fostermedisin",
        "Specialist in fetal medicine",
        `${GRAV}/fosterdiagnostikk`,
      ),
      item(
        "p6",
        "Fostermedisin",
        "Fetal medicine",
        "Fosterets helse og utvikling hos spesialist",
        "Fetal health and development with a specialist",
        `${GRAV}/fostermedisin`,
      ),
    ]),
    group("sg-oppfolging", "Oppfølging gjennom svangerskapet", "Follow-up throughout pregnancy", [
      item(
        "p7",
        "Graviditetsoppfølging",
        "Pregnancy follow-up",
        "Erfarne gynekologer og fostermedisinere hele veien",
        "Experienced gynaecologists and fetal medicine specialists all the way",
        `${GRAV}/svangerskapsteam`,
      ),
      item(
        "p8",
        "Svangerskapskontroll",
        "Pregnancy check-ups",
        "Oppfølging gjennom hele svangerskapet",
        "Follow-up throughout the entire pregnancy",
        `${GRAV}/svangerskapsoppfolging`,
      ),
    ]),
    group("sg-etter", "Etter fødsel og ved tap", "After birth and in case of loss", [
      item(
        "p9",
        "6-ukerskontroll etter fødsel",
        "6-week postnatal check",
        "Undersøkelse og veiledning etter fødsel",
        "Examination and guidance after birth",
        `${GRAV}/6-ukerskontroll`,
      ),
      item(
        "p10",
        "Fødselsskader",
        "Birth injuries",
        "Bristninger, bekkenbunn og plager etter fødsel",
        "Tears, pelvic floor and symptoms after birth",
        `${GRAV}/fodselsskader`,
      ),
      item(
        "p11",
        "Spontanabort",
        "Miscarriage",
        "Utredning, oppfølging og samtale",
        "Investigation, follow-up and conversation",
        `${GRAV}/spontanabort`,
      ),
    ]),
  ],
};

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("\nGraviditet services patch\n");

  for (const id of DOC_IDS) {
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!exists) {
      console.log(`  ⏭  ${id} missing — skip`);
      continue;
    }

    await sanityClient
      .patch(id)
      .set({
        "landingPage.servicesSection.title": SERVICES.title,
        "landingPage.servicesSection.description": SERVICES.description,
        "landingPage.servicesSection.groups": SERVICES.groups,
      })
      .commit({ autoGenerateArrayKeys: false });

    console.log(`  ✅ Patched ${id}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id=="category-graviditet"][0]{
      "groups": landingPage.servicesSection.groups[]{
        "label": label[language=="no"][0].value,
        "titles": items[].title[language=="no"][0].value,
        "hrefs": items[].href
      }
    }`,
  );
  console.log(JSON.stringify(verify, null, 2));
  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
