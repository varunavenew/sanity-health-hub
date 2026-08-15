#!/usr/bin/env npx tsx
/**
 * Developer-only: «Hva vi tilbyr» servicesSection for all category landings
 * (fertilitet, gynekologi, urologi, ortopedi, graviditet).
 * NO verbatim from avenewdemo + EN translations.
 *
 *   cd test && npx tsx sanity/patch-hva-vi-tilbyr-developer.ts
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

function item(key: string, titleNo: string, titleEn: string, descNo: string, descEn: string, href: string) {
  return {
    _key: key,
    title: i18nString(titleNo, titleEn),
    description: i18nString(descNo, descEn),
    href,
  };
}

function group(key: string, labelNo: string, labelEn: string, items: ReturnType<typeof item>[]) {
  return {
    _key: key,
    label: i18nString(labelNo, labelEn),
    items,
  };
}

const FERT = "/fertilitet";
const GYN = "/gynekologi";
const URO = "/urologi";
const ORT = "/ortopedi";
const GRAV = "/graviditet";

const PATCHES: Array<{
  id: string;
  title: ReturnType<typeof i18nString>;
  description: ReturnType<typeof i18nText>;
  groups: ReturnType<typeof group>[];
}> = [
  {
    id: "category-fertilitet",
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Fra første samtale til oppfølging — hele fertilitetstilbudet vårt finner du her. Trenger du hjelp til å velge, ring oss for en uforpliktende prat.",
      "From the first conversation to follow-up — our full fertility offering is here. If you need help choosing, call us for a no-obligation chat.",
    ),
    groups: [
      group("sg-utredning", "Undersøkelse og utredning", "Examination and assessment", [
        item("f1", "Fertilitetsutredning", "Fertility investigation", "Blodprøver, ultralyd og sædanalyse", "Blood tests, ultrasound and semen analysis", `${FERT}/fertilitetsutredning`),
        item("f2", "Infertilitet", "Infertility", "Forstå årsaker og veien videre", "Understand causes and the way forward", `${FERT}/infertilitet`),
        item("f3", "Sædanalyse", "Semen analysis", "Mannlig fertilitet og mikro-TESE", "Male fertility and micro-TESE", `${FERT}/saedanalyse`),
        item("f4", "Mannlig infertilitet", "Male infertility", "Utredning av mannlig fruktbarhet", "Investigation of male fertility", `${URO}/infertilitet`),
        item("f5", "Egglederundersøkelse (HyFoSy)", "Fallopian tube examination (HyFoSy)", "Skånsom undersøkelse av eggledere", "Gentle examination of the fallopian tubes", `${FERT}/fertilitetsutredning`),
        item("f6", "Hysteroskopi", "Hysteroscopy", "Skånsom vurdering av livmorhulen", "Gentle assessment of the uterine cavity", `${FERT}/hysteroskopi`),
      ]),
      group("sg-behandling", "Behandling", "Treatment", [
        item("f7", "Assistert befruktning", "Assisted fertilisation", "IVF, ICSI og inseminasjon (IUI)", "IVF, ICSI and insemination (IUI)", `${FERT}/assistert-befruktning`),
        item("f8", "Hormonstimulering", "Hormone stimulation", "Eggløsningsstimulering og hormonbehandling", "Ovulation stimulation and hormone treatment", `${FERT}/assistert-befruktning`),
        item("f9", "Donorbehandling", "Donor treatment", "Donorsæd, donoregg og partnerdonasjon", "Donor sperm, donor eggs and partner donation", `${FERT}/donorbehandling`),
        item("f10", "Nedfrysning av egg", "Egg freezing", "Egg, sæd og embryo", "Eggs, sperm and embryos", `${FERT}/eggfrys`),
        item("f11", "Nedfrysing av spermceller", "Sperm freezing", "Bevar mulighetene dine", "Preserve your options", `${FERT}/eggfrys`),
        item("f12", "Gynekologi og kirurgi", "Gynaecology and surgery", "Polypper, endometriose, myomer", "Polyps, endometriosis, fibroids", GYN),
      ]),
    ],
  },
  {
    id: "category-gynekologi",
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Dette er undersøkelsene, behandlingene og inngrepene vi utfører. Usikker på hva du trenger? Start med en gynekologisk undersøkelse — så tar vi det derfra.",
      "These are the examinations, treatments and procedures we offer. Unsure what you need? Start with a gynaecological examination — and we will take it from there.",
    ),
    groups: [
      group("sg-utredning", "Undersøkelse og utredning", "Examination and assessment", [
        item("g1", "Gynekologisk undersøkelse", "Gynaecological examination", "Helsesjekk og førstekonsultasjon", "Health check and first consultation", `${GYN}/undersokelse`),
        item("g2", "Ultralyd", "Ultrasound", "Gynekologisk og tidlig graviditet", "Gynaecological and early pregnancy", `${GYN}/undersokelse`),
        item("g3", "Hysteroskopi", "Hysteroscopy", "Undersøkelse av livmorhulen", "Examination of the uterine cavity", `${GYN}/hysteroskopi`),
        item("g4", "Office-hysteroskopi", "Office hysteroscopy", "Poliklinisk inngrep uten narkose", "Outpatient procedure without anaesthesia", `${GYN}/hysteroskopi`),
        item("g5", "NIPT", "NIPT", "Fosterdiagnostikk", "Fetal diagnostics", `${GRAV}/nipt`),
        item("g6", "Prevensjon og rådgivning", "Contraception and counselling", "Valg av riktig prevensjon", "Choosing the right contraception", `${GYN}/undersokelse`),
      ]),
      group("sg-behandling", "Behandling og kirurgi", "Treatment and surgery", [
        item("g7", "Hormonbehandling", "Hormone therapy", "Overgangsalder og hormonforstyrrelser", "Menopause and hormonal disorders", `${GYN}/overgangsalder`),
        item("g8", "Botoxbehandling", "Botox treatment", "Vaginisme og vulvalidelser", "Vaginismus and vulvar conditions", `${GYN}/vulvalidelser`),
        item("g9", "Konisering", "Cone biopsy", "Behandling av celleforandringer", "Treatment of cell changes", `${GYN}/celleforandringer`),
        item("g10", "6-ukers kontroll etter fødsel", "6-week postnatal check", "Oppfølging etter fødsel", "Follow-up after birth", `${GRAV}/6-ukerskontroll`),
        item("g11", "Robotassistert kirurgi", "Robot-assisted surgery", "Høy presisjon, rask rehabilitering", "High precision, fast recovery", `${GYN}/robotkirurgi`),
        item("g12", "Gynekologisk kirurgi", "Gynaecological surgery", "Laparoskopi og åpen kirurgi", "Laparoscopy and open surgery", `${GYN}/kirurgi`),
        item("g13", "Fjerne livmor (hysterektomi)", "Hysterectomy", "Kirurgisk fjerning av livmor", "Surgical removal of the uterus", `${GYN}/fjerne-livmor`),
        item("g14", "Labiaplastikk", "Labiaplasty", "Kirurgisk inngrep", "Surgical procedure", `${GYN}/labiaplastikk`),
      ]),
    ],
  },
  {
    id: "category-urologi",
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Dette er utredningene, behandlingene og inngrepene vi utfører. Vet du allerede hva du trenger? Velg fra listen — eller les mer om den enkelte tjenesten.",
      "These are the assessments, treatments and procedures we perform. Already know what you need? Choose from the list — or read more about each service.",
    ),
    groups: [
      group("sg-utredning", "Undersøkelse og utredning", "Examination and assessment", [
        item("u1", "Prostatasjekk", "Prostate check", "Utredning og PSA", "Investigation and PSA", `${URO}/prostata`),
        item("u2", "Blære og urinveier", "Bladder and urinary tract", "Utredning og behandling", "Investigation and treatment", `${URO}/blaere`),
        item("u3", "Nyrer", "Kidneys", "Cyster, tumor og nefrektomi", "Cysts, tumour and nephrectomy", `${URO}/nyrer`),
        item("u4", "Kul i pungen", "Scrotal lump", "Utredning og behandling", "Investigation and treatment", `${URO}/testikler`),
        item("u5", "Smerter i testiklene", "Testicular pain", "Utredning og behandling", "Investigation and treatment", `${URO}/testikler`),
        item("u6", "Mannlig infertilitet", "Male infertility", "Utredning og behandling", "Investigation and treatment", `${URO}/infertilitet`),
      ]),
      group("sg-behandling", "Behandling og kirurgi", "Treatment and surgery", [
        item("u7", "Forstørret prostata", "Enlarged prostate", "Medisinsk og kirurgisk", "Medical and surgical", `${URO}/prostata`),
        item("u8", "Prostatakreft", "Prostate cancer", "Diagnose og behandling", "Diagnosis and treatment", `${URO}/prostata`),
        item("u9", "Trang forhud (fimose)", "Tight foreskin (phimosis)", "Konservativ og kirurgisk", "Conservative and surgical", `${URO}/forhud`),
        item("u10", "Sterilisering (vasektomi)", "Sterilisation (vasectomy)", "Trygt og raskt inngrep", "Safe and quick procedure", `${URO}/sterilisering`),
        item("u11", "Refertilisering", "Reversal", "Mikrokirurgisk inngrep", "Microsurgical procedure", `${URO}/refertilisering`),
        item("u12", "Robotassistert kirurgi", "Robot-assisted surgery", "Avansert minimalt invasiv", "Advanced minimally invasive", `${URO}/robotkirurgi`),
      ]),
    ],
  },
  {
    id: "category-ortopedi",
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Dette er utredningene, behandlingene og inngrepene vi utfører. Vet du allerede hva du trenger? Velg fra listen — eller les mer om den enkelte tjenesten.",
      "These are the assessments, treatments and procedures we perform. Already know what you need? Choose from the list — or read more about each service.",
    ),
    groups: [
      group("sg-omrader", "Behandlingsområder", "Treatment areas", [
        item(
          "o1",
          "Skulder",
          "Shoulder",
          "Innklemming, kalkavleiring, rotatormansjettskade og frossen skulder.",
          "Impingement, calcific deposit, rotator cuff injury and frozen shoulder.",
          `${ORT}/skulder`,
        ),
        item(
          "o2",
          "Kne",
          "Knee",
          "Kneslitasje, korsbåndruptur, meniskskade og artroskopi.",
          "Knee wear, ACL rupture, meniscus injury and arthroscopy.",
          `${ORT}/kne`,
        ),
        item(
          "o3",
          "Hofte",
          "Hip",
          "Hofteslitasje, labrumskade og hoftekirurgi.",
          "Hip wear, labrum injury and hip surgery.",
          `${ORT}/hofte`,
        ),
        item(
          "o4",
          "Hånd og albue",
          "Hand and elbow",
          "Karpaltunnelsyndrom, dupuytrens kontraktur, tennis- og golfalbue.",
          "Carpal tunnel syndrome, Dupuytren's contracture, tennis and golfer's elbow.",
          `${ORT}/hand-albue`,
        ),
        item(
          "o5",
          "Fot og ankel",
          "Foot and ankle",
          "Hælspore, hælsmerte og ankelbåndskade.",
          "Heel spur, heel pain and ankle ligament injury.",
          `${ORT}/fot-ankel`,
        ),
      ]),
    ],
  },
  {
    id: "category-graviditet",
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Fra tidlig ultralyd til fast jordmor — hele svangerskapstilbudet vårt finner du her. Trenger du hjelp til å velge, ring oss for en uforpliktende prat.",
      "From early ultrasound to a dedicated midwife — you will find our entire pregnancy offering here. If you need help choosing, call us for a no-obligation chat.",
    ),
    groups: [
      group("sg-tidlig", "Tidlig i svangerskapet", "Early in pregnancy", [
        item("p1", "Ultralyd i svangerskapet", "Pregnancy ultrasound", "Hjerteslag, termin og plassering", "Heartbeat, due date and placement", `${GRAV}/ultralyd`),
        item("p2", "NIPT", "NIPT", "Trygg og rask avklaring av kromosomavvik", "Safe and fast clarification of chromosomal abnormalities", `${GRAV}/nipt`),
        item("p3", "Ultralyd i svangerskapet + NIPT", "Pregnancy ultrasound + NIPT", "Kombinert tilbud i én konsultasjon", "Combined offer in one consultation", `${GRAV}/nipt`),
      ]),
      group("sg-foster", "Fostermedisin og diagnostikk", "Fetal medicine and diagnostics", [
        item("p4", "Fosterdiagnostikk", "Fetal diagnostics", "Detaljert vurdering av fosteret", "Detailed assessment of the fetus", `${GRAV}/fosterdiagnostikk`),
        item("p5", "Organrettet ultralyd uke 12–14", "Organ-focused ultrasound weeks 12–14", "Spesialist i fostermedisin", "Specialist in fetal medicine", `${GRAV}/fosterdiagnostikk`),
        item("p6", "Fostermedisin", "Fetal medicine", "Fosterets helse og utvikling hos spesialist", "Fetal health and development with a specialist", `${GRAV}/fostermedisin`),
      ]),
      group("sg-oppfolging", "Oppfølging gjennom svangerskapet", "Follow-up throughout pregnancy", [
        item("p7", "Graviditetsoppfølging", "Pregnancy follow-up", "Erfarne gynekologer og fostermedisinere hele veien", "Experienced gynaecologists and fetal medicine specialists all the way", `${GRAV}/svangerskapsteam`),
        item("p8", "Svangerskapskontroll", "Pregnancy check-ups", "Oppfølging gjennom hele svangerskapet", "Follow-up throughout the entire pregnancy", `${GRAV}/svangerskapsoppfolging`),
      ]),
      group("sg-etter", "Etter fødsel og ved tap", "After birth and in case of loss", [
        item("p9", "6-ukerskontroll etter fødsel", "6-week postnatal check", "Undersøkelse og veiledning etter fødsel", "Examination and guidance after birth", `${GRAV}/6-ukerskontroll`),
        item("p10", "Fødselsskader", "Birth injuries", "Bristninger, bekkenbunn og plager etter fødsel", "Tears, pelvic floor and symptoms after birth", `${GRAV}/fodselsskader`),
        item("p11", "Spontanabort", "Miscarriage", "Utredning, oppfølging og samtale", "Investigation, follow-up and conversation", `${GRAV}/spontanabort`),
      ]),
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
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id: patch.id });
    if (!exists) throw new Error(`Missing document ${patch.id}`);

    await sanityClient
      .patch(patch.id)
      .set({
        "landingPage.servicesSection.title": patch.title,
        "landingPage.servicesSection.description": patch.description,
        "landingPage.servicesSection.groups": patch.groups,
      })
      .commit({ autoGenerateArrayKeys: true });

    summary[patch.id] = await sanityClient.fetch(
      `*[_id==$id][0]{
        "titleNo": landingPage.servicesSection.title[language=="no"][0].value,
        "titleEn": landingPage.servicesSection.title[language=="en"][0].value,
        "groups": landingPage.servicesSection.groups[]{
          "labelNo": label[language=="no"][0].value,
          "items": count(items),
          "titlesNo": items[].title[language=="no"][0].value
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
