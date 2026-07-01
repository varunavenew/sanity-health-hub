#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats + pageSections on treatmentCategory `category-gynekologi` (NO + EN),
 * and uploads hero / section images + hero video from src/assets.
 *
 * Run from test/:
 *   SANITY_TOKEN=… npm run migrate:gynekologi-landing
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const uploadCache = new Map<string, string>();

/** Local paths relative to src/assets — matches legacy Gynecology.tsx imports. */
const GYN_ASSET_PATHS = {
  heroVideo: "hero/gynekologi-video.mp4",
  heroImage: "categories/gynekologi-real.jpg",
  whyImage: "hero/hero-clinic-lounge.jpg",
  spotlightImage: "hero/gynecology-hero.jpg",
  expertEndometriose: "hero/gynecology-hero.jpg",
  expertBekkenbunn: "hero/hero-pregnancy.jpg",
  expertOvergangsalder: "hero/cmedical-hero-2.jpg",
  expertVulva: "hero/kvinnehelse-hero.jpg",
  expertUrogynekologi: "hero/hero-pregnancy.jpg",
} as const;

type SanityImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
};

type SanityFileRef = {
  _type: "file";
  asset: { _type: "reference"; _ref: string };
};

async function uploadImage(
  relativePath: string,
  label?: string,
): Promise<SanityImageRef | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`);
    return null;
  }

  if (uploadCache.has(relativePath)) {
    return {
      _type: "image",
      asset: { _type: "reference", _ref: uploadCache.get(relativePath)! },
    };
  }

  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const contentType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  console.log(`  📸 Uploading ${relativePath}…`);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: label ? `${label}.${ext}` : path.basename(fullPath),
    contentType,
  });

  uploadCache.set(relativePath, asset._id);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function uploadVideo(
  relativePath: string,
  label?: string,
): Promise<SanityFileRef | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Video not found: ${relativePath}`);
    return null;
  }

  if (uploadCache.has(relativePath)) {
    return {
      _type: "file",
      asset: { _type: "reference", _ref: uploadCache.get(relativePath)! },
    };
  }

  const buffer = fs.readFileSync(fullPath);
  console.log(`  🎬 Uploading ${relativePath}…`);
  const asset = await sanityClient.assets.upload("file", buffer, {
    filename: label ? `${label}.mp4` : path.basename(fullPath),
    contentType: "video/mp4",
  });

  uploadCache.set(relativePath, asset._id);
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

type I18nItem = {
  _type: string;
  _key?: string;
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
    _key: href.replace(/\W/g, "").slice(-12),
    label: i18nString(no, en),
    href,
  };
}

const landingPageBase = {
  srOnlyTitle: i18nString(
    "Gynekologi hos CMedical — kvinnehelse for livet",
    "Gynecology at CMedical — women's health for life",
  ),
  hero: {
    heading: i18nString("Kvinnehelse", "Women's health"),
    headingEmphasis: i18nString("for livet", "for life"),
    body: i18nText(
      "Vi følger deg gjennom hele livet — fra de første spørsmålene i tenårene, gjennom svangerskap og overgangsalder, og videre. Gynekologene våre jobber med det de kan best, og vi tar oss alltid tid til å forstå hele deg.",
      "We support you through every stage of life — from your first questions in your teens, through pregnancy and menopause, and beyond. Our gynecologists focus on what they do best, and we always take time to understand you as a whole person.",
    ),
    bullets: [
      i18nString("Ingen henvisning", "No referral needed"),
      i18nString("Korte ventetider", "Short waiting times"),
      i18nString("Erfarne spesialister", "Experienced specialists"),
    ],
    primaryCtaLabel: i18nString(
      "Bestill gynekologisk undersøkelse",
      "Book gynecological examination",
    ),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString(
      "Gynekologi og kvinnehelse hos CMedical",
      "Gynecology and women's health at CMedical",
    ),
    primaryBookingService: "generell-undersokelse",
  },
  segmentsSection: {
    title: i18nString(
      "Kroppen endrer seg gjennom livet — vi er her i alle fasene.",
      "Your body changes through life — we are here in every phase.",
    ),
    layout: "accordion",
    segments: [
      {
        _key: "lp1",
        id: "menstruasjon",
        title: i18nString(
          "Menstruasjonssyklus, hormonell helse og prevensjon",
          "Menstrual cycle, hormonal health and contraception",
        ),
        description: i18nText(
          "Vi hjelper deg med prevensjon, syklusforstyrrelser og hormonelle plager — og finner ut hva som er normalt for nettopp deg.",
          "We help with contraception, cycle disorders and hormonal issues — and find out what is normal for you.",
        ),
        tagLinks: [
          tagLink("Prevensjonsveiledning", "Contraception counselling", "/behandlinger/gynekologi/undersokelse"),
          tagLink("PCOS & POI", "PCOS & POI", "/behandlinger/gynekologi/pcos"),
          tagLink("Hormonforstyrrelser", "Hormonal disorders", "/behandlinger/gynekologi/pcos"),
          tagLink("PMS / PMDD", "PMS / PMDD", "/behandlinger/gynekologi/pms-pmdd"),
          tagLink("Uregelmessige eller kraftige blødninger", "Irregular or heavy bleeding", "/behandlinger/gynekologi/blodningsforstyrrelser"),
          tagLink("Muskelknuter og polypper", "Fibroids and polyps", "/behandlinger/gynekologi/cyster"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/behandlinger/gynekologi/blodningsforstyrrelser",
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
          "Pain during intercourse, persistent pelvic symptoms or findings that need investigation — we take time to understand what is going on.",
        ),
        tagLinks: [
          tagLink("Vulvodyni", "Vulvodynia", "/behandlinger/gynekologi/vulvalidelser"),
          tagLink("Vaginisme", "Vaginismus", "/behandlinger/gynekologi/vulvalidelser"),
          tagLink("Hudproblemer i vulva", "Vulvar skin problems", "/behandlinger/gynekologi/vulvalidelser"),
          tagLink("Test for klamydia / gonoré", "Chlamydia / gonorrhoea test", "/behandlinger/gynekologi/undersokelse"),
          tagLink("Celleforandringer og cyster", "Cell changes and cysts", "/behandlinger/gynekologi/celleforandringer"),
          tagLink("Konisering", "Cone biopsy", "/behandlinger/gynekologi/celleforandringer"),
          tagLink("Endometriose", "Endometriosis", "/behandlinger/gynekologi/endometriose"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/behandlinger/gynekologi/vulvalidelser",
      },
      {
        _key: "lp3",
        id: "graviditet",
        title: i18nString("Graviditet, fødsel og tiden etter", "Pregnancy, birth and afterwards"),
        description: i18nText(
          "Svangerskapskontroll, ultralyd, etterkontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
          "Antenatal care, ultrasound, postnatal check-ups and pelvic floor — we support you through the whole journey, including what comes after.",
        ),
        tagLinks: [
          tagLink("Tidlig ultralyd", "Early ultrasound", "/behandlinger/graviditet/ultralyd"),
          tagLink("NIPT", "NIPT", "/behandlinger/graviditet/nipt"),
          tagLink("Graviditetsoppfølging", "Pregnancy care", "/behandlinger/graviditet/svangerskapsteam"),
          tagLink("6-ukerskontroll etter fødsel", "6-week postnatal check", "/behandlinger/gynekologi/fodselsskader"),
          tagLink("Spontanabort", "Miscarriage", "/behandlinger/gynekologi/spontanabort"),
          tagLink("Abort", "Abortion", "/behandlinger/gynekologi/undersokelse"),
          tagLink("Fødselsskader", "Birth injuries", "/behandlinger/gynekologi/fodselsskader"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/behandlinger/graviditet",
      },
      {
        _key: "lp4",
        id: "urogynekologi",
        title: i18nString("Urogynekologi — fremfall og lekkasje", "Urogynecology — prolapse and leakage"),
        description: i18nText(
          "Tyngdefølelse i underlivet, fremfall (prolaps) eller urinlekkasje kan oppstå i alle livsfaser. Vi utreder og behandler både konservativt og kirurgisk.",
          "Heaviness in the pelvic area, prolapse or urinary leakage can occur at any life stage. We investigate and treat both conservatively and surgically.",
        ),
        tagLinks: [
          tagLink("Urogynekologi (samlet)", "Urogynecology (overview)", "/behandlinger/gynekologi/urogynekologi"),
          tagLink("Vaginale fremfall", "Vaginal prolapse", "/behandlinger/gynekologi/vaginale-fremfall"),
          tagLink("Urininkontinens", "Urinary incontinence", "/behandlinger/gynekologi/urinlekkasje"),
          tagLink("Bekkenbunnsdysfunksjon", "Pelvic floor dysfunction", "/behandlinger/gynekologi/urogynekologi"),
          tagLink("Tyngdefølelse i underlivet", "Pelvic heaviness", "/behandlinger/gynekologi/urogynekologi"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/behandlinger/gynekologi/urogynekologi",
      },
      {
        _key: "lp5",
        id: "overgangsalder",
        title: i18nString("Overgangsalder — på dine premisser", "Menopause — on your terms"),
        description: i18nText(
          "Perimenopause og menopause kan være krevende. Vi hjelper deg å forstå kroppen og finner riktig behandling for deg.",
          "Perimenopause and menopause can be challenging. We help you understand your body and find the right treatment for you.",
        ),
        tagLinks: [
          tagLink("Overgangsalder / klimakteriet", "Menopause / climacteric", "/behandlinger/gynekologi/overgangsalder"),
          tagLink("Hormonbehandling", "Hormone therapy", "/behandlinger/gynekologi/overgangsalder"),
          tagLink("Tørrhet i underlivet", "Vaginal dryness", "/behandlinger/gynekologi/overgangsalder"),
          tagLink("Hetetokter og søvnproblemer", "Hot flushes and sleep problems", "/behandlinger/gynekologi/overgangsalder"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/behandlinger/gynekologi/overgangsalder",
      },
    ],
  },
  whySection: {
    title: i18nString(
      "Det beste fra to klinikker — samlet på ett sted.",
      "The best of two clinics — in one place.",
    ),
    description: i18nText(
      "Livio og CMedical Sandvika har slått seg sammen. Det betyr mer erfaring, samme team — og et tilbud som dekker hele veien.",
      "Livio and CMedical Sandvika have joined forces. That means more experience, the same team — and a service that covers the whole journey.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString("En trygg base for kvinnehelse", "A safe base for women's health"),
        description: i18nText(
          "Konsultasjon, ultralyd og inngrep under samme tak. Du slipper å bli sendt videre — vi tar deg gjennom hele forløpet.",
          "Consultation, ultrasound and procedures under one roof. No referrals elsewhere — we guide you through the whole journey.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString("Ledende kompetanse", "Leading expertise"),
        description: i18nText(
          "Gynekologer med spesialisering fra Rikshospitalet, Livio og ledende kvinnehelsemiljøer i Norden.",
          "Gynecologists specialised at Rikshospitalet, Livio and leading women's health centres in the Nordics.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Tett oppfølging", "Close follow-up"),
        description: i18nText(
          "Du får ett team som følger deg over tid — fra første samtale til kontroll etter behandling.",
          "One team follows you over time — from the first conversation to follow-up after treatment.",
        ),
      },
    ],
    footerLinkLabel: i18nString("Les mer om klinikken", "Learn more about the clinic"),
    footerLinkHref: "/om-oss",
  },
  audiencesSection: {
    title: i18nString("Alle er velkomne", "Everyone is welcome"),
    titleAccent: i18nString("— uansett livsfase.", "— whatever your life stage."),
    readMoreLabel: i18nString("Les mer", "Read more"),
    audiences: [
      {
        _key: "a1",
        title: i18nString("Første gynekologtime", "First gynecology appointment"),
        description: i18nText(
          "Det første møtet skal være trygt og forklart. Vi tar oss tid — uansett om det er prevensjon, syklus eller bare et spørsmål du har båret på lenge.",
          "Your first visit should feel safe and clearly explained. We take our time — whether it is contraception, your cycle or a question you have carried for a long time.",
        ),
        href: "/behandlinger/gynekologi/undersokelse",
        icon: "user",
      },
      {
        _key: "a2",
        title: i18nString("Gravid eller nylig forløst", "Pregnant or recently given birth"),
        description: i18nText(
          "Ultralyd, svangerskapsoppfølging, 6-ukerskontroll og bekkenbunn — vi følger deg gjennom hele forløpet, også det som kommer etter.",
          "Ultrasound, pregnancy care, 6-week check-up and pelvic floor — we support you through the whole journey, including what comes after.",
        ),
        href: "/graviditet",
        icon: "users",
      },
      {
        _key: "a3",
        title: i18nString("Midt i livet og videre", "Mid-life and beyond"),
        description: i18nText(
          "Overgangsalder, hormoner, urinlekkasje eller fremfall — vi hjelper deg å forstå kroppen og finne riktig behandling på dine premisser.",
          "Menopause, hormones, urinary leakage or prolapse — we help you understand your body and find the right treatment on your terms.",
        ),
        href: "/behandlinger/gynekologi/overgangsalder",
        icon: "clock",
      },
    ],
  },
  expertAreasSection: {
    eyebrow: i18nString("Spesialistområder", "Specialist areas"),
    title: i18nString(
      "Eksperter som jobber med det de kan aller best.",
      "Experts who focus on what they do best.",
    ),
    description: i18nText(
      "Hos oss møter du gynekologer som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier.",
      "You meet gynecologists who have specialised deeply in their field. That means the right expertise from the first consultation — without detours.",
    ),
    areas: [
      {
        _key: "e1",
        title: i18nString("Endometriose", "Endometriosis"),
        description: i18nText(
          "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
          "We are leaders in Northern Europe in endometriosis treatment with robot-assisted surgery — including complex cases.",
        ),
        href: "/behandlinger/gynekologi/endometriose",
      },
      {
        _key: "e2",
        title: i18nString("Fødselsskader og bekkenbunnshelse", "Birth injuries and pelvic floor health"),
        description: i18nText(
          "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
          "From tears to urinary leakage — we treat through conversation and surgery when needed. You deserve to be heard.",
        ),
        href: "/behandlinger/gynekologi/urinlekkasje",
      },
      {
        _key: "e3",
        title: i18nString("Overgangsalder", "Menopause"),
        description: i18nText(
          "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
          "Safe, up-to-date hormone therapy — based on your history and wishes. We take time for the conversation.",
        ),
        href: "/behandlinger/gynekologi/overgangsalder",
      },
      {
        _key: "e4",
        title: i18nString("Vulvasmerter", "Vulvar pain"),
        description: i18nText(
          "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
          "Vulvar pain and discomfort is often overlooked. Here you meet specialists who understand — and find answers.",
        ),
        href: "/behandlinger/gynekologi/vulvalidelser",
      },
      {
        _key: "e5",
        title: i18nString("Urogynekologi", "Urogynecology"),
        description: i18nText(
          "Fremfall (prolaps) og urinlekkasje samlet – utredning og behandling.",
          "Prolapse and urinary leakage — investigation and treatment in one place.",
        ),
        href: "/behandlinger/gynekologi/urogynekologi",
      },
    ],
  },
  symptomsSection: {
    title: i18nString("Hva kjenner du på?", "What are you experiencing?"),
    description: i18nText(
      "Velg det som ligner mest på din situasjon — så foreslår vi en god start.",
      "Choose what best matches your situation — and we will suggest a good place to start.",
    ),
    items: [
      {
        _key: "s1",
        symptom: i18nString("Vondt under samleie", "Pain during intercourse"),
        service: i18nString("Gynekologisk undersøkelse", "Gynecological examination"),
        href: "/behandlinger/gynekologi/undersokelse",
      },
      {
        _key: "s2",
        symptom: i18nString("Kraftige eller langvarige menssmerter", "Severe or prolonged period pain"),
        service: i18nString("Endometriose-utredning", "Endometriosis investigation"),
        href: "/behandlinger/gynekologi/endometriose",
      },
      {
        _key: "s3",
        symptom: i18nString("Urinlekkasje eller bekkenbunnsplager", "Urinary leakage or pelvic floor issues"),
        service: i18nString("Bekkenbunnsutredning", "Pelvic floor investigation"),
        href: "/behandlinger/gynekologi/urinlekkasje",
      },
      {
        _key: "s4",
        symptom: i18nString("Hetetokter, søvnløshet, humørsvingninger", "Hot flushes, insomnia, mood swings"),
        service: i18nString("Overgangsalder-konsultasjon", "Menopause consultation"),
        href: "/behandlinger/gynekologi/overgangsalder",
      },
      {
        _key: "s5",
        symptom: i18nString("Uregelmessig syklus eller mistanke om PCOS", "Irregular cycle or suspected PCOS"),
        service: i18nString("PCOS-utredning", "PCOS investigation"),
        href: "/behandlinger/gynekologi/pcos",
      },
      {
        _key: "s6",
        symptom: i18nString("Smerter, kløe eller ubehag i vulva", "Pain, itching or discomfort in the vulva"),
        service: i18nString("Vulva-utredning", "Vulvar investigation"),
        href: "/behandlinger/gynekologi/vulvalidelser",
      },
    ],
  },
  servicesSection: {
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Dette er undersøkelsene, behandlingene og inngrepene vi utfører. Usikker på hva du trenger? Start med en gynekologisk undersøkelse — så tar vi det derfra.",
      "These are the examinations, treatments and procedures we offer. Unsure what you need? Start with a gynecological examination — and we will take it from there.",
    ),
    groups: [
      {
        _key: "sg1",
        label: i18nString("Undersøkelse og utredning", "Examination and investigation"),
        items: [
          {
            _key: "sg1i1",
            title: i18nString("Gynekologisk undersøkelse", "Gynecological examination"),
            description: i18nString("Helsesjekk og førstekonsultasjon", "Health check and first consultation"),
            href: "/behandlinger/gynekologi/undersokelse",
          },
          {
            _key: "sg1i2",
            title: i18nString("Ultralyd", "Ultrasound"),
            description: i18nString("Gynekologisk og tidlig graviditet", "Gynecological and early pregnancy"),
            href: "/behandlinger/gynekologi/undersokelse",
          },
          {
            _key: "sg1i3",
            title: i18nString("Hysteroskopi", "Hysteroscopy"),
            description: i18nString("Undersøkelse av livmorhulen", "Examination of the uterine cavity"),
            href: "/behandlinger/gynekologi/kirurgi",
          },
          {
            _key: "sg1i4",
            title: i18nString("Office-hysteroskopi", "Office hysteroscopy"),
            description: i18nString("Poliklinisk inngrep uten narkose", "Outpatient procedure without anaesthesia"),
            href: "/behandlinger/gynekologi/kirurgi",
          },
          {
            _key: "sg1i5",
            title: i18nString("NIPT", "NIPT"),
            description: i18nString("Fosterdiagnostikk", "Fetal diagnostics"),
            href: "/behandlinger/graviditet/nipt",
          },
          {
            _key: "sg1i6",
            title: i18nString("Prevensjon og rådgivning", "Contraception and counselling"),
            description: i18nString("Valg av riktig prevensjon", "Choosing the right contraception"),
            href: "/behandlinger/gynekologi/undersokelse",
          },
        ],
      },
      {
        _key: "sg2",
        label: i18nString("Behandling og kirurgi", "Treatment and surgery"),
        items: [
          {
            _key: "sg2i1",
            title: i18nString("Hormonbehandling", "Hormone therapy"),
            description: i18nString("Overgangsalder og hormonforstyrrelser", "Menopause and hormonal disorders"),
            href: "/behandlinger/gynekologi/overgangsalder",
          },
          {
            _key: "sg2i2",
            title: i18nString("Botoxbehandling", "Botox treatment"),
            description: i18nString("Vaginisme og vulvalidelser", "Vaginismus and vulvar conditions"),
            href: "/behandlinger/gynekologi/vulvalidelser",
          },
          {
            _key: "sg2i3",
            title: i18nString("Konisering", "Cone biopsy"),
            description: i18nString("Behandling av celleforandringer", "Treatment of cell changes"),
            href: "/behandlinger/gynekologi/celleforandringer",
          },
          {
            _key: "sg2i4",
            title: i18nString("6-ukers kontroll etter fødsel", "6-week postnatal check"),
            description: i18nString("Oppfølging etter fødsel", "Follow-up after birth"),
            href: "/behandlinger/gynekologi/undersokelse",
          },
          {
            _key: "sg2i5",
            title: i18nString("Robotassistert kirurgi", "Robot-assisted surgery"),
            description: i18nString("Høy presisjon, rask rehabilitering", "High precision, fast recovery"),
            href: "/behandlinger/gynekologi/robotkirurgi",
          },
          {
            _key: "sg2i6",
            title: i18nString("Gynekologisk kirurgi", "Gynecological surgery"),
            description: i18nString("Laparoskopi og åpen kirurgi", "Laparoscopy and open surgery"),
            href: "/behandlinger/gynekologi/kirurgi",
          },
          {
            _key: "sg2i7",
            title: i18nString("Fjerne livmor (hysterektomi)", "Hysterectomy"),
            description: i18nString("Kirurgisk fjerning av livmor", "Surgical removal of the uterus"),
            href: "/behandlinger/gynekologi/fjerne-livmor",
          },
          {
            _key: "sg2i8",
            title: i18nString("Labiaplastikk", "Labiaplasty"),
            description: i18nString("Kirurgisk inngrep", "Surgical procedure"),
            href: "/behandlinger/gynekologi/labiaplastikk",
          },
        ],
      },
    ],
  },
  resultsSection: {
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen gynekologi de siste årene.",
      "We measure what we do — because you deserve transparency. Here are our gynecology results from recent years.",
    ),
    footnote: i18nString(
      "Tall oppdatert per Q1 2026. Resultater varierer individuelt.",
      "Figures updated Q1 2026. Results vary individually.",
    ),
  },
  reviewsSection: {
    title: i18nString("Tilbakemeldinger fra ekte pasienter", "Feedback from real patients"),
    reviews: [
      {
        _key: "r1",
        text: i18nText(
          "Trygg og god konsultasjon. Endelig en gynekolog som tok seg tid og forsto plagene mine.",
          "A safe, good consultation. Finally a gynecologist who took time and understood my symptoms.",
        ),
        author: "Anne K.",
        date: i18nString("2 måneder siden", "2 months ago"),
      },
      {
        _key: "r2",
        text: i18nText(
          "Fryktet konsultasjonen, men ble møtt med varme og kompetanse. Anbefales på det varmeste.",
          "I was afraid of the appointment, but was met with warmth and competence. Highly recommended.",
        ),
        author: "Marit S.",
        date: i18nString("3 måneder siden", "3 months ago"),
      },
      {
        _key: "r3",
        text: i18nText(
          "Veldig fornøyd. Korte ventetider, dyktig spesialist og tydelige svar — slik kvinnehelse bør være.",
          "Very satisfied. Short waiting times, skilled specialist and clear answers — women's health as it should be.",
        ),
        author: "Ingrid L.",
        date: i18nString("1 måned siden", "1 month ago"),
      },
    ],
  },
  spotlightSection: {
    title: i18nString("Begynn med en", "Start with a"),
    titleEmphasis: i18nString("gynekologisk undersøkelse", "gynecological examination"),
    text: i18nText(
      "En grundig helsesjekk med samtale, klinisk undersøkelse og ultralyd. Du møter en spesialist som tar seg tid til å forstå hele bildet — og legger en plan tilpasset deg.",
      "A thorough health check with conversation, clinical examination and ultrasound. You meet a specialist who takes time to understand the full picture — and creates a plan tailored to you.",
    ),
    ctaLabel: i18nString("Les mer om gynekologisk undersøkelse", "Learn more about gynecological examination"),
    ctaHref: "/behandlinger/gynekologi/undersokelse",
  },
};

const stats = [
  {
    _key: "st1",
    value: "9 600+",
    label: i18nString("Konsultasjoner", "Consultations"),
    sub: i18nString("Per år", "Per year"),
  },
  {
    _key: "st2",
    value: "2 100",
    label: i18nString("Ultralydundersøkelser", "Ultrasound examinations"),
    sub: i18nString("I 2024", "In 2024"),
  },
  {
    _key: "st3",
    value: "98%",
    label: i18nString("Vil anbefale oss", "Would recommend us"),
    sub: i18nString("Pasientundersøkelse", "Patient survey"),
  },
  {
    _key: "st4",
    value: "< 7 dager",
    label: i18nString("Ventetid", "Waiting time"),
    sub: i18nString("Snitt til første time", "Average to first appointment"),
  },
];

const pageSections = [
  {
    _key: "ps-spec",
    _type: "pageSectionSpecialists",
    displayMode: "category",
    categorySlug: "gynekologi",
    title: i18nString("Gynekologene som følger deg.", "The gynecologists who support you."),
    seeAllLabel: i18nString("Se alle gynekologer", "See all gynecologists"),
    seeAllHref: "/spesialister?kategori=gynekologi",
    limit: 8,
    variant: "carousel",
  },
  {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  },
];

async function main() {
  console.log("▶ Gynekologi landing migration");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  let heroVideo: SanityFileRef | null = null;
  let heroImage: SanityImageRef | null = null;
  let whyImage: SanityImageRef | null = null;
  let spotlightImage: SanityImageRef | null = null;
  let expertEndometriose: SanityImageRef | null = null;
  let expertBekkenbunn: SanityImageRef | null = null;
  let expertOvergangsalder: SanityImageRef | null = null;
  let expertVulva: SanityImageRef | null = null;
  let expertUrogynekologi: SanityImageRef | null = null;

  if (!DRY_RUN) {
    [
      heroVideo,
      heroImage,
      whyImage,
      spotlightImage,
      expertEndometriose,
      expertBekkenbunn,
      expertOvergangsalder,
      expertVulva,
      expertUrogynekologi,
    ] = await Promise.all([
      uploadVideo(GYN_ASSET_PATHS.heroVideo, "gynekologi-hero-video"),
      uploadImage(GYN_ASSET_PATHS.heroImage, "gynekologi-hero-fallback"),
      uploadImage(GYN_ASSET_PATHS.whyImage, "gynekologi-why-section"),
      uploadImage(GYN_ASSET_PATHS.spotlightImage, "gynekologi-spotlight"),
      uploadImage(GYN_ASSET_PATHS.expertEndometriose, "gynekologi-expert-endometriose"),
      uploadImage(GYN_ASSET_PATHS.expertBekkenbunn, "gynekologi-expert-bekkenbunn"),
      uploadImage(GYN_ASSET_PATHS.expertOvergangsalder, "gynekologi-expert-overgangsalder"),
      uploadImage(GYN_ASSET_PATHS.expertVulva, "gynekologi-expert-vulva"),
      uploadImage(GYN_ASSET_PATHS.expertUrogynekologi, "gynekologi-expert-urogynekologi"),
    ]);
    console.log("");
  }

  const landingPage = {
    ...landingPageBase,
    whySection: {
      ...landingPageBase.whySection,
      ...(whyImage ? { image: whyImage } : {}),
      imageAlt: i18nString(
        "CMedical kvinnehelseklinikk i Sandvika",
        "CMedical women's health clinic in Sandvika",
      ),
    },
    expertAreasSection: {
      ...landingPageBase.expertAreasSection,
      areas: landingPageBase.expertAreasSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          e1: expertEndometriose,
          e2: expertBekkenbunn,
          e3: expertOvergangsalder,
          e4: expertVulva,
          e5: expertUrogynekologi,
        };
        const image = imageByKey[area._key] ?? null;
        return image
          ? {
              ...area,
              image,
              imageAlt: area.title,
            }
          : area;
      }),
    },
    spotlightSection: {
      ...landingPageBase.spotlightSection,
      ...(spotlightImage ? { image: spotlightImage } : {}),
      imageAlt: i18nString(
        "Konsultasjon hos gynekolog hos CMedical",
        "Gynecology consultation at CMedical",
      ),
    },
  };

  const patch: Record<string, unknown> = {
    landingPage,
    stats,
    pageSections,
  };
  if (heroImage) patch.heroImage = heroImage;
  if (heroVideo) patch.heroVideo = heroVideo;

  if (DRY_RUN) {
    console.log("Would patch category-gynekologi with landing content + media:");
    console.log(`  heroVideo: ${GYN_ASSET_PATHS.heroVideo}`);
    console.log(`  heroImage: ${GYN_ASSET_PATHS.heroImage}`);
    console.log(`  whyImage: ${GYN_ASSET_PATHS.whyImage}`);
    console.log(`  spotlight: ${GYN_ASSET_PATHS.spotlightImage}`);
    return;
  }

  await sanityClient.patch("category-gynekologi").set(patch).commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
