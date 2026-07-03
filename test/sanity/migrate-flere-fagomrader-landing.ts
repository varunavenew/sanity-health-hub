#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats + pageSections on treatmentCategory `category-flere-fagomrader` (NO + EN),
 * and uploads hero / expert card images from src/assets.
 *
 * Content from legacy FlereFagomrader landing (fleradmfgm.js).
 *
 * Run from test/:
 *   SANITY_TOKEN=… npm run migrate:flere-fagomrader-landing
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const uploadCache = new Map<string, string>();

const FF = "/behandlinger/flere-fagomrader";

const FLERE_ASSET_PATHS = {
  heroImage: "categories/flere-fagomrader.jpg",
  expertEndokrinologi: "articles/gastroenterolog.png",
  expertErnaering: "articles/ernaeringsfysiolog.jpg",
  expertHudhelse: "hero/cmedical-skin-texture.jpg",
  expertGastro: "articles/gastroenterolog.png",
  expertPlastikk: "hero/cmedical-hero-1.jpg",
  expertRobot: "hero/robotkirurgi-hero.jpg",
  expertAreknuter: "articles/karkirurgi.jpg",
  expertOsteopati: "articles/osteopat-fysioterapeut.png",
  expertRevmatologi: "articles/revmatolog.png",
  expertPsykologi: "articles/psykologspesialist.png",
  expertSexologi: "articles/sexolog.jpg",
} as const;

type SanityImageRef = {
  _type: "image";
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

const landingPageBase = {
  srOnlyTitle: i18nString(
    "Flere fagområder hos CMedical — tverrfaglige spesialister",
    "More specialties at CMedical — cross-disciplinary specialists",
  ),
  hero: {
    heading: i18nString("Spesialister", "Specialists"),
    headingEmphasis: i18nString("i team", "in teams"),
    body: i18nText(
      "Vi har samlet noen av Nordens fremste spesialister innen hud, psykologi, sexologi, ernæring og kirurgi. Spesialistene jobber i tverrfaglige team — og utelukkende med det de kan aller best.",
      "We have brought together some of the Nordic region's leading specialists in dermatology, psychology, sexology, nutrition and surgery. They work in cross-disciplinary teams — and focus exclusively on what they do best.",
    ),
    bullets: [
      i18nString("Ingen henvisning", "No referral needed"),
      i18nString("Korte ventetider", "Short waiting times"),
      i18nString("Tverrfaglige team", "Cross-disciplinary teams"),
    ],
    primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Flere fagområder hos CMedical", "More specialties at CMedical"),
  },
  segmentsSection: {
    title: i18nString("", ""),
    titleLine2: i18nString("", ""),
    layout: "grid",
    segments: [],
  },
  whySection: {
    title: i18nString("", ""),
    description: i18nText("", ""),
    steps: [],
    imageAlt: i18nString("CMedical klinikk", "CMedical clinic"),
  },
  expertAreasSection: {
    title: i18nString(
      "Eksperter som jobber med det de kan aller best.",
      "Experts who focus on what they do best.",
    ),
    description: i18nText(
      "Hos oss møter du spesialister som har spesialisert seg dypt innenfor sitt fagfelt — og som samarbeider på tvers når det trengs.",
      "You meet specialists who have specialised deeply in their field — and collaborate across disciplines when needed.",
    ),
    layout: "grid",
    areas: [
      {
        _key: "e1",
        title: i18nString("Endokrinologi", "Endocrinology"),
        description: i18nString("Diabetes, skjoldbrusk, hormoner", "Diabetes, thyroid, hormones"),
        href: `${FF}/endokrinologi`,
      },
      {
        _key: "e2",
        title: i18nString("Ernæringsfysiolog", "Clinical nutritionist"),
        description: i18nString("Kosthold, vekttap, intoleranser", "Diet, weight loss, intolerances"),
        href: `${FF}/ernaringsfysiolog`,
      },
      {
        _key: "e3",
        title: i18nString("Hudhelse", "Skin health"),
        description: i18nString("Hudlege, hudbehandlinger, føflekksjekk", "Dermatology, skin treatments, mole checks"),
        href: `${FF}/hudhelse`,
      },
      {
        _key: "e4",
        title: i18nString("Gastrokirurgi", "Gastrointestinal surgery"),
        description: i18nString(
          "Mage, tarm, overvektskirurgi, brokk, hemorroider",
          "Stomach, bowel, bariatric surgery, hernia, haemorrhoids",
        ),
        href: `${FF}/gastrokirurgi`,
      },
      {
        _key: "e5",
        title: i18nString("Plastikkirurgi", "Plastic surgery"),
        description: i18nString("Rekonstruksjon og estetisk", "Reconstructive and aesthetic"),
        href: `${FF}/plastikkirurgi`,
      },
      {
        _key: "e6",
        title: i18nString("Robotassistert kirurgi", "Robot-assisted surgery"),
        description: i18nString("Presis, skånsom kirurgi", "Precise, gentle surgery"),
        href: `${FF}/robotkirurgi`,
      },
      {
        _key: "e7",
        title: i18nString("Åreknutebehandling", "Varicose vein treatment"),
        description: i18nString("Sklerosering, laser, kirurgi", "Sclerotherapy, laser, surgery"),
        href: `${FF}/areknuter`,
      },
      {
        _key: "e8",
        title: i18nString("Osteopati", "Osteopathy"),
        description: i18nString("Muskel, skjelett, kroniske smerter", "Muscle, skeleton, chronic pain"),
        href: `${FF}/osteopati`,
      },
      {
        _key: "e9",
        title: i18nString("Revmatologi", "Rheumatology"),
        description: i18nString("Leddgikt, artrose, bindevev", "Arthritis, osteoarthritis, connective tissue"),
        href: `${FF}/revmatologi`,
      },
      {
        _key: "e10",
        title: i18nString("Psykologi", "Psychology"),
        description: i18nString("Angst, depresjon, traumer", "Anxiety, depression, trauma"),
        href: `${FF}/psykologi`,
      },
      {
        _key: "e11",
        title: i18nString("Sexologi", "Sexology"),
        description: i18nString("Seksuell helse, samliv, identitet", "Sexual health, relationships, identity"),
        href: `${FF}/sexologi`,
      },
    ],
  },
  audiencesSection: {
    title: i18nString("", ""),
    titleAccent: i18nString("", ""),
    readMoreLabel: i18nString("Les mer", "Read more"),
    audiences: [],
  },
  symptomsSection: {
    title: i18nString("", ""),
    description: i18nText("", ""),
    items: [],
  },
  servicesSection: {
    title: i18nString("", ""),
    description: i18nText("", ""),
    groups: [],
  },
  supportSection: {
    title: i18nString("", ""),
    areas: [],
  },
  resultsSection: {
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene fra spesialistene våre på tvers av fagfelt.",
      "We measure what we do — because you deserve transparency. Here are results from our specialists across disciplines.",
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
          "Endelig en psykolog som virkelig lyttet. Jeg følte meg sett fra første time.",
          "Finally a psychologist who really listened. I felt seen from the first session.",
        ),
        author: "Hanne L.",
        date: i18nString("1 måned siden", "1 month ago"),
      },
      {
        _key: "r2",
        text: i18nText(
          "Kombinasjonen av ernæringsfysiolog og endokrinolog forandret hverdagen min.",
          "The combination of nutritionist and endocrinologist changed my everyday life.",
        ),
        author: "Eva M.",
        date: i18nString("3 måneder siden", "3 months ago"),
      },
      {
        _key: "r3",
        text: i18nText(
          "Hudlegen var grundig og forklarte alt. Trygg behandling i hyggelige omgivelser.",
          "The dermatologist was thorough and explained everything. Safe treatment in pleasant surroundings.",
        ),
        author: "Sondre K.",
        date: i18nString("2 måneder siden", "2 months ago"),
      },
    ],
  },
  journeySection: {
    title: i18nString("Fra første kontakt til riktig behandling.", "From first contact to the right treatment."),
    description: i18nText(
      "Du tar kontakt — vi tar over. Slik ser et vanlig forløp ut hos oss, fra du booker time til du er ferdig behandlet.",
      "You get in touch — we take it from there. This is what a typical journey looks like with us, from booking to completed treatment.",
    ),
    ctaLabel: i18nString("Bestill time", "Book appointment"),
    ctaHref: "/booking?kategori=flere-fagomrader",
    steps: [
      {
        _key: "j1",
        number: "01",
        title: i18nString("Bestill når det passer deg", "Book when it suits you"),
        description: i18nText(
          "Online booking døgnet rundt. Usikker på hvem du trenger? Ring oss — vi hjelper deg finne riktig spesialist.",
          "Online booking around the clock. Unsure who you need? Call us — we help you find the right specialist.",
        ),
      },
      {
        _key: "j2",
        number: "02",
        title: i18nString("Samtalen som rekker", "A conversation that takes its time"),
        description: i18nText(
          "Du møter en spesialist som utelukkende jobber med det du trenger. Vi tar oss tid og forklarer på et språk du forstår.",
          "You meet a specialist who focuses exclusively on what you need. We take our time and explain in language you understand.",
        ),
      },
      {
        _key: "j3",
        number: "03",
        title: i18nString("Utredning og plan", "Assessment and plan"),
        description: i18nText(
          "En konkret plan på et språk du forstår. Trenger du videre oppfølging eller samarbeid med andre spesialister, koordinerer vi det.",
          "A concrete plan in language you understand. If you need further follow-up or collaboration with other specialists, we coordinate it.",
        ),
      },
      {
        _key: "j4",
        number: "04",
        title: i18nString("Tverrfaglig oppfølging", "Cross-disciplinary follow-up"),
        description: i18nText(
          "Spesialistene jobber i team. En sexolog samarbeider med gynekologen, en psykolog med urologen — du slipper å starte på nytt.",
          "Specialists work in teams. A sexologist collaborates with the gynecologist, a psychologist with the urologist — you do not have to start over.",
        ),
      },
    ],
  },
};

const stats = [
  {
    _key: "st1",
    value: "30+",
    label: i18nString("Spesialistområder", "Specialist areas"),
    sub: i18nString("Under samme tak", "Under one roof"),
  },
  {
    _key: "st2",
    value: "18 500",
    label: i18nString("Konsultasjoner", "Consultations"),
    sub: i18nString("I 2024", "In 2024"),
  },
  {
    _key: "st3",
    value: "97%",
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
    categorySlug: "annet",
    title: i18nString("Spesialistene som følger deg.", "The specialists who support you."),
    seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
    seeAllHref: "/spesialister?kategori=annet",
    limit: 8,
    variant: "carousel",
  },
  {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  },
];

async function main() {
  console.log("▶ Flere fagområder landing migration");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  let heroImage: SanityImageRef | null = null;
  let expertEndokrinologi: SanityImageRef | null = null;
  let expertErnaering: SanityImageRef | null = null;
  let expertHudhelse: SanityImageRef | null = null;
  let expertGastro: SanityImageRef | null = null;
  let expertPlastikk: SanityImageRef | null = null;
  let expertRobot: SanityImageRef | null = null;
  let expertAreknuter: SanityImageRef | null = null;
  let expertOsteopati: SanityImageRef | null = null;
  let expertRevmatologi: SanityImageRef | null = null;
  let expertPsykologi: SanityImageRef | null = null;
  let expertSexologi: SanityImageRef | null = null;

  if (!DRY_RUN) {
    [
      heroImage,
      expertEndokrinologi,
      expertErnaering,
      expertHudhelse,
      expertGastro,
      expertPlastikk,
      expertRobot,
      expertAreknuter,
      expertOsteopati,
      expertRevmatologi,
      expertPsykologi,
      expertSexologi,
    ] = await Promise.all([
      uploadImage(FLERE_ASSET_PATHS.heroImage, "flere-fagomrader-hero"),
      uploadImage(FLERE_ASSET_PATHS.expertEndokrinologi, "flere-expert-endokrinologi"),
      uploadImage(FLERE_ASSET_PATHS.expertErnaering, "flere-expert-ernaering"),
      uploadImage(FLERE_ASSET_PATHS.expertHudhelse, "flere-expert-hudhelse"),
      uploadImage(FLERE_ASSET_PATHS.expertGastro, "flere-expert-gastro"),
      uploadImage(FLERE_ASSET_PATHS.expertPlastikk, "flere-expert-plastikk"),
      uploadImage(FLERE_ASSET_PATHS.expertRobot, "flere-expert-robot"),
      uploadImage(FLERE_ASSET_PATHS.expertAreknuter, "flere-expert-areknuter"),
      uploadImage(FLERE_ASSET_PATHS.expertOsteopati, "flere-expert-osteopati"),
      uploadImage(FLERE_ASSET_PATHS.expertRevmatologi, "flere-expert-revmatologi"),
      uploadImage(FLERE_ASSET_PATHS.expertPsykologi, "flere-expert-psykologi"),
      uploadImage(FLERE_ASSET_PATHS.expertSexologi, "flere-expert-sexologi"),
    ]);
    console.log("");
  }

  const landingPage = {
    ...landingPageBase,
    expertAreasSection: {
      ...landingPageBase.expertAreasSection,
      areas: landingPageBase.expertAreasSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          e1: expertEndokrinologi,
          e2: expertErnaering,
          e3: expertHudhelse,
          e4: expertGastro,
          e5: expertPlastikk,
          e6: expertRobot,
          e7: expertAreknuter,
          e8: expertOsteopati,
          e9: expertRevmatologi,
          e10: expertPsykologi,
          e11: expertSexologi,
        };
        const image = imageByKey[area._key] ?? null;
        return image ? { ...area, image, imageAlt: area.title } : area;
      }),
    },
  };

  const patch: Record<string, unknown> = {
    landingPage,
    stats,
    pageSections,
  };
  if (heroImage) patch.heroImage = heroImage;

  if (DRY_RUN) {
    console.log("Would patch category-flere-fagomrader with landing content + media:");
    console.log(`  heroImage: ${FLERE_ASSET_PATHS.heroImage}`);
    console.log(`  expert areas: ${landingPageBase.expertAreasSection.areas.length}`);
    return;
  }

  await sanityClient.patch("category-flere-fagomrader").set(patch).commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
