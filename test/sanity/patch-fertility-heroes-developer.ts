/**
 * Developer-only: restore fertility treatment hero copy.
 *
 * Bugs fixed:
 * - NO heroDescription was overwritten with "Uten henvisning • Ingen ventetid"
 *   (that belongs in heroAvailability)
 * - Generic "Kort ventetid / Ingen henvisning" chips instead of page points
 * - Wrong price string "time fra 2 850 kr"
 * - Duplicate title above price (heroPriceLabel fallback)
 *
 * Source: src/data/fertilitetSubPages.tsx + treatmentContent audience pages.
 *
 *   cd test && npx tsx sanity/patch-fertility-heroes-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

function i18nString(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
  ];
}

type Point = { titleNo: string; titleEn: string; descNo: string; descEn: string };

type HeroCfg = {
  id: string;
  titleNo: string;
  titleEn: string;
  heroTitleNo: string;
  heroTitleEn: string;
  heroDescNo: string;
  heroDescEn: string;
  availabilityNo?: string;
  availabilityEn?: string;
  priceNo?: string | null;
  priceEn?: string | null;
  primaryCtaNo: string;
  primaryCtaEn: string;
  points: Point[];
};

const AVAIL_NO = "Uten henvisning • Ingen ventetid";
const AVAIL_EN = "No referral • No waiting time";
const PRICE_CONSULT_NO = "Pris fra 2.850 kr";
const PRICE_CONSULT_EN = "From NOK 2,850";

function chips(points: Point[]) {
  return points.map((p, i) => ({
    _key: `hp-${i}`,
    _type: "object",
    title: i18nString(p.titleNo, p.titleEn),
    desc: i18nText(p.descNo, p.descEn),
  }));
}

const HEROES: HeroCfg[] = [
  {
    id: "treatment-fertilitet-assistert-befruktning",
    titleNo: "Assistert befruktning",
    titleEn: "Assisted reproduction",
    heroTitleNo: "Behandling tilpasset *din* situasjon",
    heroTitleEn: "Treatment tailored to *your* situation",
    heroDescNo:
      "Det finnes flere ulike behandlingsmetoder ved assistert befruktning. Hvilken som anbefales avhenger av årsaken til fertilitetsutfordringene, alder, tidligere sykehistorie og individuelle ønsker og behov. Før oppstart gjennomfører vi en grundig fertilitetsutredning og lager en behandlingsplan tilpasset deg.",
    heroDescEn:
      "There are several treatment methods for assisted reproduction. Which is recommended depends on the cause of fertility challenges, age, medical history and individual wishes. Before starting, we carry out a thorough fertility assessment and make a treatment plan tailored to you.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
    points: [
      {
        titleNo: "IVF — prøverørsbehandling",
        titleEn: "IVF — in vitro fertilisation",
        descNo: "Den vanligste formen for assistert befruktning.",
        descEn: "The most common form of assisted reproduction.",
      },
      {
        titleNo: "ICSI ved nedsatt sædkvalitet",
        titleEn: "ICSI for reduced sperm quality",
        descNo: "Mikroinjeksjon av én sædcelle direkte inn i egget.",
        descEn: "Microinjection of one sperm cell directly into the egg.",
      },
      {
        titleNo: "Inseminasjon (IUI)",
        titleEn: "Insemination (IUI)",
        descNo: "Enklere behandling med partnersæd eller donorsæd.",
        descEn: "A simpler treatment with partner or donor sperm.",
      },
      {
        titleNo: "Behandling med donor",
        titleEn: "Treatment with donor",
        descNo: "Donorsæd og eggdonasjon i henhold til norsk lovgivning.",
        descEn: "Donor sperm and egg donation in accordance with Norwegian law.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-infertilitet",
    titleNo: "Infertilitet",
    titleEn: "Infertility",
    heroTitleNo: "Ufrivillig *barnløshet*",
    heroTitleEn: "Involuntary *childlessness*",
    heroDescNo:
      "Mange opplever at det tar lengre tid enn forventet å bli gravid. Verdens helseorganisasjon (WHO) anslår at omtrent 1 av 6 mennesker vil oppleve infertilitet i løpet av livet. Du er ikke alene — og det finnes hjelp.",
    heroDescEn:
      "Many people find it takes longer than expected to become pregnant. The WHO estimates that about 1 in 6 people will experience infertility during their lifetime. You are not alone — and help is available.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill fertilitetsutredning",
    primaryCtaEn: "Book a fertility assessment",
    points: [
      {
        titleNo: "12 måneders regelen",
        titleEn: "The 12-month rule",
        descNo:
          "Infertilitet defineres vanligvis som manglende graviditet etter 12 måneder med regelmessig samleie uten prevensjon.",
        descEn:
          "Infertility is usually defined as no pregnancy after 12 months of regular intercourse without contraception.",
      },
      {
        titleNo: "Tidligere utredning fra 35 år",
        titleEn: "Earlier assessment from age 35",
        descNo:
          "For kvinner over 35 år anbefales utredning etter 6 måneder, ettersom fertiliteten naturlig avtar med alderen.",
        descEn:
          "For women over 35, assessment is recommended after 6 months, as fertility naturally declines with age.",
      },
      {
        titleNo: "Rammer både kvinner og menn",
        titleEn: "Affects both women and men",
        descNo:
          "Mannlig faktor alene eller i kombinasjon bidrar hos omtrent 40–50 % av par som utredes.",
        descEn:
          "A male factor alone or in combination contributes in about 40–50% of couples assessed.",
      },
      {
        titleNo: "En vanlig medisinsk tilstand",
        titleEn: "A common medical condition",
        descNo: "Ufrivillig barnløshet er ikke noe galt med deg. Vi behandler infertilitet hver dag.",
        descEn: "Involuntary childlessness is not something wrong with you. We treat infertility every day.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-fertilitetsutredning",
    titleNo: "Fertilitetsutredning",
    titleEn: "Fertility assessment",
    heroTitleNo: "Et trygt *første steg*",
    heroTitleEn: "A safe *first step*",
    heroDescNo:
      "Å ta det første steget kan føles stort – enten du kommer alene eller sammen med en partner, og enten du vet hva du ønsker eller fortsatt er i en utforskende fase. Hos oss møter du et fagmiljø som tar seg tid til å lytte, forstå og veilede deg videre. Denne første fasen handler ikke om å ha alle svarene – men om å begynne et sted.",
    heroDescEn:
      "Taking the first step can feel big – whether you come alone or with a partner, and whether you know what you want or are still exploring. With us you meet a clinical team that takes time to listen, understand and guide you. This first phase is not about having all the answers – but about starting somewhere.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill fertilitetsutredning",
    primaryCtaEn: "Book a fertility assessment",
    points: [
      {
        titleNo: "En uforpliktende start",
        titleEn: "A no-obligation start",
        descNo: "Mange begynner med en samtale — vi tilpasser tempoet etter deg.",
        descEn: "Many start with a conversation — we adapt the pace to you.",
      },
      {
        titleNo: "Grundig kartlegging",
        titleEn: "Thorough mapping",
        descNo: "Blodprøver, ultralyd og sædanalyse gir et helhetlig bilde.",
        descEn: "Blood tests, ultrasound and semen analysis give a complete picture.",
      },
      {
        titleNo: "Felles plan videre",
        titleEn: "A shared plan next",
        descNo: "Sammen går vi gjennom resultatene og snakker om alternativene.",
        descEn: "Together we review the results and discuss the options.",
      },
      {
        titleNo: "Samme team hele veien",
        titleEn: "The same team throughout",
        descNo: "Du møter de samme fagpersonene — kontinuitet skaper trygghet.",
        descEn: "You meet the same clinicians — continuity builds trust.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-eggfrys",
    titleNo: "Nedfrysning av egg",
    titleEn: "Egg freezing",
    heroTitleNo: "Litt mer *tid* når du trenger det",
    heroTitleEn: "A little more *time* when you need it",
    heroDescNo:
      "Nedfrysing av egg lar deg ta vare på fertiliteten din nå — uten å måtte ta valget om barn i dag. Vi tilbyr også nedfrysing av sæd og embryo, som del av eller utenfor en IVF-behandling.",
    heroDescEn:
      "Egg freezing lets you protect your fertility now — without deciding about children today. We also offer freezing of sperm and embryos, as part of or outside IVF treatment.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: "Pris fra 30.500 kr",
    priceEn: "From NOK 30,500",
    primaryCtaNo: "Bestill samtale om nedfrysing",
    primaryCtaEn: "Book a freezing consultation",
    points: [
      {
        titleNo: "Egg, sæd og embryo",
        titleEn: "Eggs, sperm and embryos",
        descNo: "Vi fryser ned alt som kan være relevant for fremtiden din.",
        descEn: "We freeze whatever may be relevant for your future.",
      },
      {
        titleNo: "Moderne vitrifikasjonsmetode",
        titleEn: "Modern vitrification",
        descNo: "Skånsom rask nedfrysing som beskytter cellene best mulig.",
        descEn: "Gentle rapid freezing that protects the cells as well as possible.",
      },
      {
        titleNo: "Trygg lagring i Norge",
        titleEn: "Safe storage in Norway",
        descNo: "Lagring under streng kvalitetskontroll på vår klinikk.",
        descEn: "Storage under strict quality control at our clinic.",
      },
      {
        titleNo: "Riktig informasjon før du velger",
        titleEn: "Clear information before you decide",
        descNo: "Vi forklarer realistiske sjanser, kostnader og tidsperspektiv.",
        descEn: "We explain realistic chances, costs and time frames.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-saedanalyse",
    titleNo: "Sædanalyse",
    titleEn: "Semen analysis",
    heroTitleNo: "Halvparten av *svaret* ligger ofte her",
    heroTitleEn: "Half the *answer* is often here",
    heroDescNo:
      "Når et par ikke blir gravide, er årsaken hos mannen i omtrent halvparten av tilfellene. En enkel sædanalyse gir deg svar — og er det naturlige første steget.",
    heroDescEn:
      "When a couple does not conceive, the cause is on the man’s side in about half of cases. A simple semen analysis gives you answers — and is the natural first step.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: "Pris fra 1.950 kr",
    priceEn: "From NOK 1,950",
    primaryCtaNo: "Bestill sædanalyse",
    primaryCtaEn: "Book semen analysis",
    points: [
      {
        titleNo: "Sædanalyse",
        titleEn: "Semen analysis",
        descNo: "Antall, bevegelighet og form — analysert av vårt eget laboratorium.",
        descEn: "Count, motility and morphology — analysed in our own laboratory.",
      },
      {
        titleNo: "Hormonstatus",
        titleEn: "Hormone status",
        descNo: "Blodprøver for testosteron, FSH, LH og andre relevante hormoner.",
        descEn: "Blood tests for testosterone, FSH, LH and other relevant hormones.",
      },
      {
        titleNo: "Mikro-TESE",
        titleEn: "Micro-TESE",
        descNo: "Henting av sædceller fra testikkelen ved azoospermi.",
        descEn: "Retrieval of sperm from the testis in azoospermia.",
      },
      {
        titleNo: "Diskret og rask prosess",
        titleEn: "Discreet and fast",
        descNo: "Du får svar raskt — uten unødvendige besøk.",
        descEn: "You get answers quickly — without unnecessary visits.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-donorbehandling",
    titleNo: "Donorbehandling",
    titleEn: "Donor treatment",
    heroTitleNo: "Donorbehandling — *mange veier* til foreldreskap",
    heroTitleEn: "Donor treatment — *many paths* to parenthood",
    heroDescNo:
      "For noen er bruk av donor en nødvendig del av veien til å få barn. Vi tilbyr behandling med donorsæd og eggdonasjon i henhold til norsk lovgivning — med grundig informasjon og veiledning gjennom hele prosessen.",
    heroDescEn:
      "For some, using a donor is a necessary part of the path to having a child. We offer treatment with donor sperm and egg donation in accordance with Norwegian law — with thorough information and guidance throughout.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill samtale om donorbehandling",
    primaryCtaEn: "Book a donor treatment consultation",
    points: [
      {
        titleNo: "Partnerdonasjon",
        titleEn: "Partner donation",
        descNo: "For likekjønnede par — den ene gir egg som settes tilbake hos partner.",
        descEn: "For same-sex couples — one provides eggs transferred to the partner.",
      },
      {
        titleNo: "Donorsæd fra kvalitetssikrede banker",
        titleEn: "Donor sperm from quality-assured banks",
        descNo: "Livio Sperm Bank, Cryos og European Sperm Bank — med god tilgang på norsk donorsæd.",
        descEn: "Livio Sperm Bank, Cryos and European Sperm Bank — with good access to Norwegian donor sperm.",
      },
      {
        titleNo: "Donoregg ved medisinsk indikasjon",
        titleEn: "Donor eggs when medically indicated",
        descNo: "Tilbys heterofile par der kvinnen ikke kan bruke egne egg.",
        descEn: "Offered to heterosexual couples where the woman cannot use her own eggs.",
      },
      {
        titleNo: "Tett oppfølging og veiledning",
        titleEn: "Close follow-up and guidance",
        descNo: "Vi forklarer Bioteknologiloven og hva som gjelder i din situasjon.",
        descEn: "We explain the Biotechnology Act and what applies in your situation.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-hysteroskopi",
    titleNo: "Hysteroskopi",
    titleEn: "Hysteroscopy",
    heroTitleNo: "Inn i livmoren — *uten snitt*",
    heroTitleEn: "Into the uterus — *without incision*",
    heroDescNo:
      "Hysteroskopi er en skånsom teknikk der vi ser direkte inn i livmoren med et tynt kamera. I et fertilitetsforløp brukes den til å vurdere livmorhulen og fjerne det som kan stå i veien for graviditet — ofte i samme inngrep.",
    heroDescEn:
      "Hysteroscopy is a gentle technique where we look directly into the uterus with a thin camera. In a fertility pathway it is used to assess the uterine cavity and remove what may stand in the way of pregnancy — often in the same procedure.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: "Pris fra 2.500 kr",
    priceEn: "From NOK 2,500",
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
    points: [
      {
        titleNo: "Ingen snitt",
        titleEn: "No incision",
        descNo: "Inngrepet gjøres gjennom skjeden — ingen ytre arr.",
        descEn: "The procedure is done through the vagina — no external scars.",
      },
      {
        titleNo: "Diagnose og behandling samtidig",
        titleEn: "Diagnosis and treatment together",
        descNo: "Polypper og små myomer kan ofte fjernes i samme seanse.",
        descEn: "Polyps and small fibroids can often be removed in the same session.",
      },
      {
        titleNo: "Kort restitusjon",
        titleEn: "Short recovery",
        descNo: "De fleste reiser hjem samme dag og er raskt tilbake i hverdagen.",
        descEn: "Most people go home the same day and return to daily life quickly.",
      },
      {
        titleNo: "Del av fertilitetsutredning",
        titleEn: "Part of fertility assessment",
        descNo: "Funn fra hysteroskopi inngår direkte i den videre behandlingsplanen.",
        descEn: "Findings feed directly into the ongoing treatment plan.",
      },
    ],
  },
  {
    id: "treatment-fertilitet-assistert-befruktning-for-par-og-single",
    titleNo: "Assistert befruktning for par og single",
    titleEn: "Assisted reproduction for couples and singles",
    heroTitleNo: "Assistert befruktning for par og single",
    heroTitleEn: "Assisted reproduction for couples and singles",
    heroDescNo:
      "Hos oss er det plass til ulike veier til det samme ønsket – å få barn. Assistert befruktning kan benyttes av mann og kvinne i parforhold, to kvinner i parforhold, og kvinner som ønsker å bli mor på egen hånd nå eller bevare mulighetene for å bli gravid i fremtiden.",
    heroDescEn:
      "With us there is room for different paths to the same wish – to have a child. Assisted reproduction can be used by man and woman as a couple, two women as a couple, and women who wish to become mothers on their own now or preserve the chance to conceive later.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
    points: [
      {
        titleNo: "Par og single",
        titleEn: "Couples and singles",
        descNo: "Behandling tilpasset din livssituasjon — innenfor Bioteknologiloven.",
        descEn: "Treatment adapted to your life situation — within the Biotechnology Act.",
      },
      {
        titleNo: "IVF, ICSI og IUI",
        titleEn: "IVF, ICSI and IUI",
        descNo: "Vi forklarer hvilken metode som passer for deg.",
        descEn: "We explain which method suits you.",
      },
      {
        titleNo: "Ingen henvisning",
        titleEn: "No referral",
        descNo: "Du kan booke direkte hos oss.",
        descEn: "You can book directly with us.",
      },
      {
        titleNo: "Kort ventetid",
        titleEn: "Short waiting time",
        descNo: "Vi hjelper deg raskt videre.",
        descEn: "We help you move forward quickly.",
      },
    ],
  },
];

/** Audience pages: keep title, restore lead + availability + consult price. */
const AUDIENCE: Array<Omit<HeroCfg, "points"> & { points?: Point[] }> = [
  {
    id: "treatment-fertilitet-mann-og-kvinne-i-parforhold",
    titleNo: "Mann og kvinne i parforhold",
    titleEn: "Man and woman as a couple",
    heroTitleNo: "Mann og kvinne i parforhold",
    heroTitleEn: "Man and woman as a couple",
    heroDescNo:
      "Dere ønsker barn sammen — og trenger kanskje hjelp på veien. Vi utreder begge, forklarer alternativene og lager en plan tilpasset dere.",
    heroDescEn:
      "You want children together — and may need help along the way. We assess both of you, explain the options and make a plan tailored to you.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
  },
  {
    id: "treatment-fertilitet-to-kvinner-i-parforhold",
    titleNo: "To kvinner i parforhold",
    titleEn: "Two women as a couple",
    heroTitleNo: "To kvinner i parforhold",
    heroTitleEn: "Two women as a couple",
    heroDescNo:
      "Dere kan starte behandling med donorsæd eller partnerdonasjon. Vi følger norsk lovgivning og gir trygg veiledning fra første samtale.",
    heroDescEn:
      "You can start treatment with donor sperm or partner donation. We follow Norwegian law and provide safe guidance from the first conversation.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
  },
  {
    id: "treatment-fertilitet-singel-kvinne",
    titleNo: "Singel kvinne",
    titleEn: "Single woman",
    heroTitleNo: "Singel kvinne",
    heroTitleEn: "Single woman",
    heroDescNo:
      "Du kan starte fertilitetsbehandling på egen hånd. Vi forklarer mulighetene — fra utredning til inseminasjon eller IVF med donorsæd.",
    heroDescEn:
      "You can start fertility treatment on your own. We explain the options — from assessment to insemination or IVF with donor sperm.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
  },
  {
    id: "treatment-fertilitet-singel-mann",
    titleNo: "Singel mann",
    titleEn: "Single man",
    heroTitleNo: "Singel mann",
    heroTitleEn: "Single man",
    heroDescNo:
      "Vi hjelper deg med sædanalyse, nedfrysning og veiledning om mulighetene videre — diskret og i ditt tempo.",
    heroDescEn:
      "We help with semen analysis, freezing and guidance on the options ahead — discreetly and at your pace.",
    availabilityNo: AVAIL_NO,
    availabilityEn: AVAIL_EN,
    priceNo: PRICE_CONSULT_NO,
    priceEn: PRICE_CONSULT_EN,
    primaryCtaNo: "Bestill konsultasjon",
    primaryCtaEn: "Book a consultation",
  },
];

const DEFAULT_POINTS: Point[] = [
  {
    titleNo: "Kort ventetid",
    titleEn: "Short waiting time",
    descNo: "Vi hjelper deg raskt videre.",
    descEn: "We help you move forward quickly.",
  },
  {
    titleNo: "Ingen henvisning",
    titleEn: "No referral needed",
    descNo: "Du kan booke direkte hos oss.",
    descEn: "You can book directly with us.",
  },
];

async function patchHero(cfg: HeroCfg) {
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: cfg.id,
  });
  if (!exists) {
    console.warn("SKIP missing", cfg.id);
    return;
  }

  const patch: Record<string, unknown> = {
    title: i18nString(cfg.titleNo, cfg.titleEn),
    heroTitle: i18nString(cfg.heroTitleNo, cfg.heroTitleEn),
    description: i18nText(cfg.heroDescNo, cfg.heroDescEn),
    heroDescription: i18nText(cfg.heroDescNo, cfg.heroDescEn),
    heroAvailability: i18nString(
      cfg.availabilityNo || AVAIL_NO,
      cfg.availabilityEn || AVAIL_EN,
    ),
    heroPoints: chips(cfg.points.length ? cfg.points : DEFAULT_POINTS),
    primaryCtaLabel: i18nString(cfg.primaryCtaNo, cfg.primaryCtaEn),
    callCtaLabel: i18nString("Ring oss", "Call us"),
    hideSeePriser: true,
  };

  if (cfg.priceNo) {
    patch.heroPrice = i18nString(cfg.priceNo, cfg.priceEn || cfg.priceNo);
  }

  console.log(DRY_RUN ? "DRY" : "PATCH", cfg.id, cfg.heroTitleNo);
  if (!DRY_RUN) {
    await sanityClient
      .patch(cfg.id)
      .set(patch)
      .unset(["heroPriceLabel"])
      .commit({ autoGenerateArrayKeys: false });
    try {
      await sanityClient.delete(`drafts.${cfg.id}`);
    } catch {
      /* none */
    }
  }
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Refusing: ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Refusing: ${DATASET}`);

  for (const hero of HEROES) await patchHero(hero);
  for (const row of AUDIENCE) {
    await patchHero({ ...row, points: row.points || DEFAULT_POINTS });
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-fertilitet-assistert-befruktning"][0]{
      "heroTitle": heroTitle[_key=="no"][0].value,
      "heroDesc": heroDescription[_key=="no"][0].value,
      "availability": heroAvailability[_key=="no"][0].value,
      "price": heroPrice[_key=="no"][0].value,
      "points": heroPoints[]{ "t": title[_key=="no"][0].value }
    }`,
  );
  console.log("\nVerify assistert:", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
