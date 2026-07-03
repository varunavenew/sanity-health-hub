#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats + pageSections on treatmentCategory `category-urologi` (NO + EN),
 * and uploads hero / expert card images from src/assets.
 *
 * Content from legacy Urologi landing (urology.js).
 *
 * Run from test/:
 *   SANITY_TOKEN=… npm run migrate:urologi-landing
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const uploadCache = new Map<string, string>();

const URO = "/behandlinger/urologi";
const SPEC = "/spesialister?kategori=urologi";

const UROLOGI_ASSET_PATHS = {
  heroImage: "categories/urologi-real.jpg",
  expertProstata: "hero/robotkirurgi-hero.jpg",
  expertTestikler: "hero/urology-hero.jpg",
  expertPenis: "hero/cmedical-hero-2.jpg",
  expertRobot: "hero/robotkirurgi-hero.jpg",
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

function tagLink(no: string, en: string, href: string) {
  return {
    _key: href.replace(/\W/g, "").slice(-12),
    label: i18nString(no, en),
    href,
  };
}

const landingPageBase = {
  srOnlyTitle: i18nString(
    "Urologi hos CMedical — spesialister du kan stole på",
    "Urology at CMedical — specialists you can trust",
  ),
  hero: {
    heading: i18nString("Spesialister", "Specialists"),
    headingEmphasis: i18nString("du kan stole på", "you can trust"),
    body: i18nText(
      "Plager i underlivet er vanligere enn du tror — og enklere å hjelpe enn du kanskje frykter. CMedical er eneste private aktør i Norge som tilbyr robotassisterte operasjoner.",
      "Symptoms in the lower abdomen are more common than you think — and often easier to treat than you may fear. CMedical is the only private provider in Norway offering robot-assisted operations.",
    ),
    bullets: [
      i18nString("Ingen henvisning", "No referral needed"),
      i18nString("Korte ventetider", "Short waiting times"),
      i18nString("Erfarne spesialister", "Experienced specialists"),
    ],
    primaryCtaLabel: i18nString("Bestill urologtime", "Book urology appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Urologi hos CMedical", "Urology at CMedical"),
  },
  segmentsSection: {
    title: i18nString(
      "Vi møter deg der du er — uansett hvorfor du tar kontakt.",
      "We meet you where you are — whatever your reason for reaching out.",
    ),
    titleLine2: i18nString("", ""),
    layout: "grid",
    segments: [
      {
        _key: "seg1",
        id: "mann-underliv",
        title: i18nString("Mann med plager i underlivet", "Man with lower abdominal symptoms"),
        description: i18nText(
          "Prostataproblemer, smerter i testikler, ereksjonsproblemer eller vannlatingsplager — vi hjelper deg finne svar.",
          "Prostate issues, testicular pain, erection problems or urinary symptoms — we help you find answers.",
        ),
        tagLinks: [
          tagLink("Prostata", "Prostate", "/booking?kategori=urologi"),
          tagLink("Vannlating", "Urination", "/booking?kategori=urologi"),
          tagLink("Ereksjon", "Erection", "/booking?kategori=urologi"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/booking?kategori=urologi",
      },
      {
        _key: "seg2",
        id: "kvinne-urologi",
        title: i18nString("Kvinne med urologiske plager", "Woman with urological symptoms"),
        description: i18nText(
          "Urinlekkasje, hyppig vannlating, blæreinfeksjoner eller blod i urinen — urologi gjelder ikke bare menn.",
          "Urinary leakage, frequent urination, bladder infections or blood in urine — urology is not only for men.",
        ),
        tagLinks: [
          tagLink("Inkontinens", "Incontinence", "/booking?kategori=urologi"),
          tagLink("Blære", "Bladder", "/booking?kategori=urologi"),
          tagLink("Nyrer", "Kidneys", "/booking?kategori=urologi"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/booking?kategori=urologi",
      },
      {
        _key: "seg3",
        id: "prostatasjekk",
        title: i18nString("Prostatasjekk", "Prostate check"),
        description: i18nText(
          "Vi anbefaler alle menn over 50 å ta en prostatasjekk — eller tidligere ved symptomer, forhøyet PSA eller arvelighet.",
          "We recommend all men over 50 take a prostate check — or earlier with symptoms, elevated PSA or family history.",
        ),
        tagLinks: [
          tagLink("PSA", "PSA", "/booking?kategori=urologi&tjeneste=prostatasjekk"),
          tagLink("Forebygging", "Prevention", "/booking?kategori=urologi&tjeneste=prostatasjekk"),
          tagLink("Utredning", "Assessment", "/booking?kategori=urologi&tjeneste=prostatasjekk"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/booking?kategori=urologi&tjeneste=prostatasjekk",
      },
      {
        _key: "seg4",
        id: "sterilisering",
        title: i18nString("Sterilisering og fertilitet", "Sterilization and fertility"),
        description: i18nText(
          "Sterilisering, refertilisering og utredning av mannlig infertilitet — raskt, trygt og med kort restitusjon.",
          "Sterilization, reversal and male infertility assessment — fast, safe and with short recovery.",
        ),
        tagLinks: [
          tagLink("Vasektomi", "Vasectomy", "/booking?kategori=urologi"),
          tagLink("Refertilisering", "Reversal", "/booking?kategori=urologi"),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/booking?kategori=urologi",
      },
    ],
  },
  whySection: {
    title: i18nString("", ""),
    description: i18nText("", ""),
    steps: [],
  },
  expertAreasSection: {
    title: i18nString(
      "Eksperter som jobber med det de kan aller best.",
      "Experts who focus on what they do best.",
    ),
    description: i18nText(
      "Hos oss møter du urologer som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier.",
      "You meet urologists who have specialised deeply in their field. That means you get the right expertise from the first consultation — without detours.",
    ),
    layout: "grid",
    areas: [
      {
        _key: "e1",
        title: i18nString("Prostata og urinveier", "Prostate and urinary tract"),
        description: i18nText(
          "Prostatasjekk, forstørret prostata, prostatakreft, blære- og nyreutredning. Vi har Norges fremste urologer.",
          "Prostate checks, enlarged prostate, prostate cancer, bladder and kidney assessments. We have Norway's leading urologists.",
        ),
        href: `${URO}/prostata`,
      },
      {
        _key: "e2",
        title: i18nString("Testikler og pung", "Testicles and scrotum"),
        description: i18nText(
          "Kul, hevelse, smerter eller varicocele — grundig undersøkelse og behandling med spesialister du kan stole på.",
          "Lumps, swelling, pain or varicocele — thorough assessment and treatment by specialists you can trust.",
        ),
        href: `${URO}/testikler`,
      },
      {
        _key: "e3",
        title: i18nString("Penis, forhud og potens", "Penis, foreskin and potency"),
        description: i18nText(
          "Trang forhud, skjev penis, ereksjonsproblemer og lavt testosteron — utredning og behandling i trygge rammer.",
          "Tight foreskin, curved penis, erection problems and low testosterone — assessment and treatment in safe surroundings.",
        ),
        href: `${URO}/penis`,
      },
      {
        _key: "e4",
        title: i18nString("Robotassistert kirurgi", "Robot-assisted surgery"),
        description: i18nText(
          "Eneste private aktør i Norge med robotassisterte operasjoner. Mer presis kirurgi og raskere restitusjon.",
          "The only private provider in Norway with robot-assisted operations. More precise surgery and faster recovery.",
        ),
        href: `${URO}/robotkirurgi`,
      },
    ],
  },
  symptomsSection: {
    title: i18nString("Hva kjenner du på?", "What are you experiencing?"),
    description: i18nText(
      "Velg det som ligner mest på din situasjon — så foreslår vi en god start.",
      "Choose what best matches your situation — and we suggest a good starting point.",
    ),
    items: [
      {
        _key: "s1",
        symptom: i18nString("Svak eller hyppig vannlating", "Weak or frequent urination"),
        service: i18nString("Prostatautredning", "Prostate assessment"),
        href: "/booking?kategori=urologi&tjeneste=prostata",
      },
      {
        _key: "s2",
        symptom: i18nString("Forhøyet PSA eller mistanke om prostatakreft", "Elevated PSA or suspected prostate cancer"),
        service: i18nString("Prostatasjekk", "Prostate check"),
        href: "/booking?kategori=urologi&tjeneste=prostatasjekk",
      },
      {
        _key: "s3",
        symptom: i18nString("Smerter, kul eller hevelse i pungen", "Pain, lump or swelling in scrotum"),
        service: i18nString("Testikkelutredning", "Testicular assessment"),
        href: "/booking?kategori=urologi&tjeneste=testikler",
      },
      {
        _key: "s4",
        symptom: i18nString("Ereksjonsproblemer eller lavt testosteron", "Erection issues or low testosterone"),
        service: i18nString("Potens- og hormonutredning", "Potency and hormone assessment"),
        href: "/booking?kategori=urologi&tjeneste=ereksjon",
      },
      {
        _key: "s5",
        symptom: i18nString("Urinlekkasje eller blæreplager", "Urinary leakage or bladder issues"),
        service: i18nString("Bekkenbunns- og blæreutredning", "Pelvic floor and bladder assessment"),
        href: "/booking?kategori=urologi&tjeneste=urinlekkasje",
      },
      {
        _key: "s6",
        symptom: i18nString("Vurderer sterilisering (vasektomi)", "Considering sterilization (vasectomy)"),
        service: i18nString("Sterilisering", "Sterilization"),
        href: "/booking?kategori=urologi&tjeneste=sterilisering",
      },
    ],
  },
  servicesSection: {
    title: i18nString("Vet du allerede hva du trenger?", "Already know what you need?"),
    description: i18nText(
      "Klikk og book direkte, eller les mer om den enkelte urologiske utredningen eller behandlingen.",
      "Click and book directly, or read more about each individual urological assessment or treatment.",
    ),
    groups: [
      {
        _key: "sg1",
        label: i18nString("Alle behandlinger", "All treatments"),
        items: [
          { _key: "i1", title: i18nString("Prostatasjekk", "Prostate check"), description: i18nString("Utredning og PSA", "Assessment and PSA"), href: `${URO}/prostata` },
          { _key: "i2", title: i18nString("Forstørret prostata", "Enlarged prostate"), description: i18nString("Medisinsk og kirurgisk", "Medical and surgical"), href: `${URO}/prostata` },
          { _key: "i3", title: i18nString("Prostatakreft", "Prostate cancer"), description: i18nString("Diagnose og behandling", "Diagnosis and treatment"), href: `${URO}/prostata` },
          { _key: "i4", title: i18nString("Blære og urinveier", "Bladder and urinary tract"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/blare` },
          { _key: "i5", title: i18nString("Urinlekkasje", "Urinary leakage"), description: i18nString("Konservativ og kirurgisk", "Conservative and surgical"), href: `${URO}/urinlekkasje` },
          { _key: "i6", title: i18nString("Nyrer", "Kidneys"), description: i18nString("Stein, cyster og funksjon", "Stones, cysts and function"), href: `${URO}/nyrer` },
          { _key: "i7", title: i18nString("Kul i pungen", "Scrotal lump"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/testikler` },
          { _key: "i8", title: i18nString("Smerter i testiklene", "Testicular pain"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/testikler` },
          { _key: "i9", title: i18nString("Varicocele", "Varicocele"), description: i18nString("Utredning og kirurgi", "Assessment and surgery"), href: `${URO}/varicocele` },
          { _key: "i10", title: i18nString("Trang forhud (fimose)", "Tight foreskin (phimosis)"), description: i18nString("Konservativ og kirurgisk", "Conservative and surgical"), href: `${URO}/forhud` },
          { _key: "i11", title: i18nString("Skjev penis", "Curved penis"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/penis` },
          { _key: "i12", title: i18nString("Ereksjonsproblemer", "Erection problems"), description: i18nString("Utredning og oppfølging", "Assessment and follow-up"), href: `${URO}/ereksjon` },
          { _key: "i13", title: i18nString("Lavt testosteron", "Low testosterone"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/testosteron` },
          { _key: "i14", title: i18nString("Sterilisering (vasektomi)", "Sterilization (vasectomy)"), description: i18nString("Trygt og raskt inngrep", "Safe and quick procedure"), href: `${URO}/sterilisering` },
          { _key: "i15", title: i18nString("Refertilisering", "Vasectomy reversal"), description: i18nString("Mikrokirurgisk inngrep", "Microsurgical procedure"), href: `${URO}/refertilisering` },
          { _key: "i16", title: i18nString("Mannlig infertilitet", "Male infertility"), description: i18nString("Utredning og behandling", "Assessment and treatment"), href: `${URO}/infertilitet` },
          { _key: "i17", title: i18nString("Robotassistert kirurgi", "Robot-assisted surgery"), description: i18nString("Avansert minimalt invasiv", "Advanced minimally invasive"), href: `${URO}/robotkirurgi` },
          { _key: "i18", title: i18nString("Brokk", "Hernia"), description: i18nString("Robotassistert kirurgi", "Robot-assisted surgery"), href: `${URO}/brokk` },
        ],
      },
    ],
  },
  resultsSection: {
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen urologi de siste årene.",
      "We measure what we do — because you deserve transparency. Here are our urology results from recent years.",
    ),
    categoryLabel: i18nString("Urologi", "Urology"),
    footnote: i18nString(
      "Tall oppdatert per Q1 2026. Resultater varierer individuelt.",
      "Figures updated Q1 2026. Results vary individually.",
    ),
  },
  reviewsSection: {
    eyebrow: i18nString("Hva pasientene sier", "What patients say"),
    title: i18nString("Tilbakemeldinger fra ekte pasienter", "Feedback from real patients"),
    reviews: [
      {
        _key: "r1",
        text: i18nText(
          "Endelig en urolog som tok seg tid til å forklare. Trygt og profesjonelt fra første minutt.",
          "Finally a urologist who took time to explain. Safe and professional from the first minute.",
        ),
        author: "Per H.",
        date: i18nString("1 måned siden", "1 month ago"),
      },
      {
        _key: "r2",
        text: i18nText(
          "Rask time, grundig undersøkelse og tydelig plan. Slik skal det være.",
          "Quick appointment, thorough examination and a clear plan. This is how it should be.",
        ),
        author: "Jan E.",
        date: i18nString("3 måneder siden", "3 months ago"),
      },
      {
        _key: "r3",
        text: i18nText(
          "Vasektomi gjort på under en time, helt smertefritt. Veldig fornøyd med oppfølgingen.",
          "Vasectomy done in under an hour, completely painless. Very happy with the follow-up.",
        ),
        author: "Tom S.",
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
    ctaHref: "/booking?kategori=urologi",
    steps: [
      {
        _key: "j1",
        number: "01",
        title: i18nString("Bestill time", "Book an appointment"),
        description: i18nText(
          "Online booking døgnet rundt. Ingen henvisning, ingen ventetid — du finner et tidspunkt som passer.",
          "Online booking around the clock. No referral, no waiting list — you find a time that fits.",
        ),
      },
      {
        _key: "j2",
        number: "02",
        title: i18nString("Samtalen som rekker", "A conversation that takes its time"),
        description: i18nText(
          "Du møter en urolog som jobber med nettopp det du trenger hjelp med. Vi tar oss tid til historikk og spørsmål.",
          "You meet a urologist who works precisely with what you need help with. We take time for history and questions.",
        ),
      },
      {
        _key: "j3",
        number: "03",
        title: i18nString("Utredning og plan", "Assessment and plan"),
        description: i18nText(
          "Trygg klinisk undersøkelse og en konkret plan — på et språk du forstår. Prøver og ultralyd ofte samme dag.",
          "Safe clinical examination and a concrete plan — in language you understand. Tests and ultrasound often the same day.",
        ),
      },
      {
        _key: "j4",
        number: "04",
        title: i18nString("Tverrfaglig oppfølging", "Cross-disciplinary follow-up"),
        description: i18nText(
          "Ved behov samarbeider urologen med gynekolog, fertilitetsspesialist, psykolog og sexolog — alt under samme tak.",
          "When needed, the urologist collaborates with gynecologist, fertility specialist, psychologist and sexologist — all under one roof.",
        ),
      },
    ],
  },
};

const stats = [
  { _key: "st1", value: "400+", label: i18nString("Robotoperasjoner", "Robot operations"), sub: i18nString("Per år", "Per year") },
  { _key: "st2", value: "8 200", label: i18nString("Konsultasjoner", "Consultations"), sub: i18nString("I 2024", "In 2024") },
  { _key: "st3", value: "97%", label: i18nString("Vil anbefale oss", "Would recommend us"), sub: i18nString("Pasientundersøkelse", "Patient survey") },
  { _key: "st4", value: "< 7 dager", label: i18nString("Ventetid", "Waiting time"), sub: i18nString("Snitt til første time", "Average to first appointment") },
];

const pageSections = [
  {
    _key: "ps-spec",
    _type: "pageSectionSpecialists",
    displayMode: "category",
    categorySlug: "urologi",
    title: i18nString("Urologene som følger deg.", "The urologists who support you."),
    seeAllLabel: i18nString("Se alle urologer", "See all urologists"),
    seeAllHref: SPEC,
    limit: 5,
    variant: "carousel",
  },
  { _key: "ps-cta", _type: "pageSectionBookingCta" },
];

async function main() {
  console.log("▶ Urologi landing migration");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  let heroImage: SanityImageRef | null = null;
  let expertProstata: SanityImageRef | null = null;
  let expertTestikler: SanityImageRef | null = null;
  let expertPenis: SanityImageRef | null = null;
  let expertRobot: SanityImageRef | null = null;

  if (!DRY_RUN) {
    [heroImage, expertProstata, expertTestikler, expertPenis, expertRobot] = await Promise.all([
      uploadImage(UROLOGI_ASSET_PATHS.heroImage, "urologi-hero"),
      uploadImage(UROLOGI_ASSET_PATHS.expertProstata, "urologi-expert-prostata"),
      uploadImage(UROLOGI_ASSET_PATHS.expertTestikler, "urologi-expert-testikler"),
      uploadImage(UROLOGI_ASSET_PATHS.expertPenis, "urologi-expert-penis"),
      uploadImage(UROLOGI_ASSET_PATHS.expertRobot, "urologi-expert-robot"),
    ]);
    console.log("");
  }

  const landingPage = {
    ...landingPageBase,
    expertAreasSection: {
      ...landingPageBase.expertAreasSection,
      areas: landingPageBase.expertAreasSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          e1: expertProstata,
          e2: expertTestikler,
          e3: expertPenis,
          e4: expertRobot,
        };
        const image = imageByKey[area._key] ?? null;
        return image ? { ...area, image, imageAlt: area.title } : area;
      }),
    },
  };

  const patch: Record<string, unknown> = { landingPage, stats, pageSections };
  if (heroImage) patch.heroImage = heroImage;

  if (DRY_RUN) {
    console.log("Would patch category-urologi with landing content + media:");
    console.log(`  heroImage: ${UROLOGI_ASSET_PATHS.heroImage}`);
    console.log(`  expert areas: ${landingPageBase.expertAreasSection.areas.length}`);
    console.log(`  segments: ${landingPageBase.segmentsSection.segments.length}`);
    return;
  }

  await sanityClient.patch("category-urologi").set(patch).commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
