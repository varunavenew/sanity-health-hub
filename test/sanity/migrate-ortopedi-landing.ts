#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats + pageSections on treatmentCategory `category-ortopedi` (NO + EN),
 * and uploads hero / expert card images from src/assets.
 *
 * Content from legacy Ortopedi landing (orthopedsadmf.js).
 *
 * Run from test/:
 *   SANITY_TOKEN=… npm run migrate:ortopedi-landing
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const uploadCache = new Map<string, string>();

const ORT = "/behandlinger/ortopedi";
const SPEC = "/spesialister?kategori=ortopedi";

const ORTOPEDI_ASSET_PATHS = {
  heroImage: "categories/ortopedi-real.jpg",
  expertSkulder: "hero/hero-treatment.jpg",
  expertKne: "hero/hero-technology.jpg",
  expertHand: "hero/cmedical-hands.jpg",
  expertSecondOpinion: "hero/cmedical-hero-3.jpg",
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
    "Ortopedi hos CMedical — når det gjør vondt",
    "Orthopaedics at CMedical — when it hurts",
  ),
  hero: {
    heading: i18nString("Det gjør vondt.", "It hurts."),
    headingEmphasis: i18nString("La oss finne ut hvorfor.", "Let's find out why."),
    body: i18nText(
      "Våre ortopeder er eksperter på skader og sykdommer i muskler, bein, ledd og sener. Noen av landets fremste kirurger jobber hos oss — også med second opinion.",
      "Our orthopaedic specialists are experts in injuries and conditions affecting muscles, bones, joints and tendons. Some of the country's leading surgeons work with us — including for second opinions.",
    ),
    bullets: [
      i18nString("Ingen henvisning", "No referral needed"),
      i18nString("Korte ventetider", "Short waiting times"),
      i18nString("Erfarne spesialister", "Experienced specialists"),
    ],
    primaryCtaLabel: i18nString("Bestill ortopedtime", "Book orthopaedic appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Ortopedi hos CMedical", "Orthopaedics at CMedical"),
  },
  segmentsSection: {
    title: i18nString(
      "Vi møter deg uansett hvorfor du tar kontakt.",
      "We meet you whatever reason you get in touch.",
    ),
    titleLine2: i18nString("", ""),
    layout: "grid",
    segments: [
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
        ctaLabel: i18nString("Les mer", "Read more"),
        href: `${ORT}/kne`,
      },
      {
        _key: "slitasje",
        id: "slitasje",
        title: i18nString("Slitasje og kroniske plager", "Wear and chronic problems"),
        description: i18nText(
          "Kne- og hofteslitasje, frossen skulder, langvarige smerter — utredning og behandling i ditt tempo.",
          "Knee and hip osteoarthritis, frozen shoulder, long-term pain — investigation and treatment at your pace.",
        ),
        tagLinks: [
          tagLink("Artrose", "Osteoarthritis", `${ORT}/kne`),
          tagLink("Smerte", "Pain", `${ORT}/skulder`),
          tagLink("Bevegelse", "Movement", `${ORT}/hofte`),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: `${ORT}/hofte`,
      },
      {
        _key: "second",
        id: "second",
        title: i18nString("Trenger second opinion", "Need a second opinion"),
        description: i18nText(
          "Har du fått en diagnose du er usikker på? Vi får ofte pasienter med kompliserte caser — og ser dem med nye øyne.",
          "Have you received a diagnosis you are unsure about? We often see patients with complex cases — and review them with fresh eyes.",
        ),
        tagLinks: [
          tagLink("Second opinion", "Second opinion", SPEC),
          tagLink("Vurdering", "Assessment", SPEC),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
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
        ctaLabel: i18nString("Les mer", "Read more"),
        href: `${ORT}/kne`,
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
      "Hos oss møter du ortopeder som har spesialisert seg dypt innenfor sitt fagfelt — fra skulder og kne til hånd og fot.",
      "You meet orthopaedic specialists who have specialised deeply in their field — from shoulder and knee to hand and foot.",
    ),
    layout: "grid",
    areas: [
      {
        _key: "e1",
        title: i18nString("Skulder", "Shoulder"),
        description: i18nText(
          "Inneklemming, kalkavleiringer, rotatormansjettskader, frossen og ustabil skulder — utredet og behandlet av spesialister.",
          "Impingement, calcific deposits, rotator cuff injuries, frozen and unstable shoulder — assessed and treated by specialists.",
        ),
        href: `${ORT}/skulder`,
      },
      {
        _key: "e2",
        title: i18nString("Kne og hofte", "Knee and hip"),
        description: i18nText(
          "Korsbånd, menisk, slitasje og labrumskader. Vi tilbyr både konservativ behandling og avansert artroskopi.",
          "Ligament, meniscus, osteoarthritis and labrum injuries. We offer both conservative treatment and advanced arthroscopy.",
        ),
        href: `${ORT}/kne`,
      },
      {
        _key: "e3",
        title: i18nString("Hånd, albue og fot", "Hand, elbow and foot"),
        description: i18nText(
          "Karpaltunnel, tennisalbue, Dupuytren, hælspore — presisjonskirurgi og injeksjonsbehandling.",
          "Carpal tunnel, tennis elbow, Dupuytren's, heel spur — precision surgery and injection therapy.",
        ),
        href: `${ORT}/hand-albue`,
      },
      {
        _key: "e4",
        title: i18nString("Andre vurdering", "Another assessment"),
        description: i18nText(
          "Kompliserte skader eller diagnoser du er usikker på? Noen av landets fremste ortopeder ser på det med nye øyne.",
          "Complex injuries or diagnoses you are unsure about? Some of the country's leading orthopaedic surgeons review them with fresh eyes.",
        ),
        href: SPEC,
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
        symptom: i18nString("Smerter i skulderen ved løft", "Shoulder pain when lifting"),
        service: i18nString("Skulderutredning", "Shoulder assessment"),
        href: `${ORT}/skulder`,
      },
      {
        _key: "s2",
        symptom: i18nString("Vondt eller ustabilt kne", "Painful or unstable knee"),
        service: i18nString("Kneutredning", "Knee assessment"),
        href: `${ORT}/kne`,
      },
      {
        _key: "s3",
        symptom: i18nString("Hofteslitasje eller liesmerter", "Hip osteoarthritis or groin pain"),
        service: i18nString("Hofteutredning", "Hip assessment"),
        href: `${ORT}/hofte`,
      },
      {
        _key: "s4",
        symptom: i18nString("Nummenhet eller stikninger i hånden", "Numbness or tingling in the hand"),
        service: i18nString("Karpaltunnel-utredning", "Carpal tunnel assessment"),
        href: `${ORT}/hand-albue`,
      },
      {
        _key: "s5",
        symptom: i18nString("Vondt i albuen ved gripe-bevegelser", "Elbow pain when gripping"),
        service: i18nString("Tennisalbue-utredning", "Tennis elbow assessment"),
        href: `${ORT}/hand-albue`,
      },
      {
        _key: "s6",
        symptom: i18nString("Smerter eller skader i fot og ankel", "Pain or injuries in foot and ankle"),
        service: i18nString("Fot- og ankelutredning", "Foot and ankle assessment"),
        href: `${ORT}/fot-ankel`,
      },
    ],
  },
  servicesSection: {
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Dette er utredningene, behandlingene og inngrepene vi utfører. Vet du allerede hva du trenger? Velg fra listen — eller les mer om den enkelte tjenesten.",
      "These are the assessments, treatments and procedures we perform. Already know what you need? Choose from the list — or read more about each service.",
    ),
    groups: [
      {
        _key: "sg1",
        label: i18nString("Behandlingsområder", "Treatment areas"),
        items: [
          {
            _key: "sg1i1",
            title: i18nString("Skulder", "Shoulder"),
            description: i18nString(
              "Inneklemming, kalkavleiringer, rotatormansjettskader og frossen skulder.",
              "Impingement, calcific deposits, rotator cuff injuries and frozen shoulder.",
            ),
            href: `${ORT}/skulder`,
          },
          {
            _key: "sg1i2",
            title: i18nString("Kne", "Knee"),
            description: i18nString(
              "Kneslitasje, korsbåndruptur, meniskskader og artroskopi.",
              "Knee osteoarthritis, ACL rupture, meniscus injuries and arthroscopy.",
            ),
            href: `${ORT}/kne`,
          },
          {
            _key: "sg1i3",
            title: i18nString("Hofte", "Hip"),
            description: i18nString(
              "Hofteslitasje, labrumskade og hoftekirurgi.",
              "Hip osteoarthritis, labrum injury and hip surgery.",
            ),
            href: `${ORT}/hofte`,
          },
          {
            _key: "sg1i4",
            title: i18nString("Hånd og albue", "Hand and elbow"),
            description: i18nString(
              "Karpaltunnelsyndrom, Dupuytrens kontraktur, tennis- og golfalbue.",
              "Carpal tunnel syndrome, Dupuytren's contracture, tennis and golfer's elbow.",
            ),
            href: `${ORT}/hand-albue`,
          },
          {
            _key: "sg1i5",
            title: i18nString("Fot og ankel", "Foot and ankle"),
            description: i18nString(
              "Hælspore, hælsmerter og ankelbåndskader.",
              "Heel spur, heel pain and ankle ligament injuries.",
            ),
            href: `${ORT}/fot-ankel`,
          },
        ],
      },
    ],
  },
  resultsSection: {
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen ortopedi de siste årene.",
      "We measure what we do — because you deserve transparency. Here are our orthopaedic results from recent years.",
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
          "Endelig fikk jeg en klar diagnose og en plan. Ortopeden tok seg tid og forklarte alt grundig.",
          "Finally I got a clear diagnosis and a plan. The orthopaedic specialist took their time and explained everything thoroughly.",
        ),
        author: "Knut R.",
        date: i18nString("2 måneder siden", "2 months ago"),
      },
      {
        _key: "r2",
        text: i18nText(
          "Operert på kneet og tilbake i trening på 8 uker. Profesjonelt fra start til slutt.",
          "Had knee surgery and back in training in 8 weeks. Professional from start to finish.",
        ),
        author: "Mari T.",
        date: i18nString("3 måneder siden", "3 months ago"),
      },
      {
        _key: "r3",
        text: i18nText(
          "Second opinion som forandret alt. Anbefales på det varmeste.",
          "A second opinion that changed everything. Highly recommended.",
        ),
        author: "Lars B.",
        date: i18nString("1 måned siden", "1 month ago"),
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
    ctaHref: "/booking?kategori=ortopedi",
    steps: [
      {
        _key: "j1",
        number: "01",
        title: i18nString("Bestill når det passer deg", "Book when it suits you"),
        description: i18nText(
          "Online booking døgnet rundt. Ingen henvisning, ingen ventetid — vi matcher deg med riktig spesialist.",
          "Online booking around the clock. No referral, no waiting list — we match you with the right specialist.",
        ),
      },
      {
        _key: "j2",
        number: "02",
        title: i18nString("Samtalen som rekker", "A conversation that takes its time"),
        description: i18nText(
          "Du møter en ortoped som jobber med ditt område. Vi tar historikk, ser på bilder og gjør en grundig undersøkelse.",
          "You meet an orthopaedic specialist who works in your area. We take your history, review imaging and perform a thorough examination.",
        ),
      },
      {
        _key: "j3",
        number: "03",
        title: i18nString("Diagnose og plan", "Diagnosis and plan"),
        description: i18nText(
          "Du forlater konsultasjonen med en klar diagnose og en konkret plan — på et språk du forstår.",
          "You leave the consultation with a clear diagnosis and a concrete plan — in language you understand.",
        ),
      },
      {
        _key: "j4",
        number: "04",
        title: i18nString("Tverrfaglig oppfølging", "Cross-disciplinary follow-up"),
        description: i18nText(
          "Ved behov samarbeider ortopeden med fysioterapeut, manuellterapeut, osteopat og ernæringsfysiolog.",
          "When needed, the orthopaedic specialist collaborates with physiotherapist, manual therapist, osteopath and nutritionist.",
        ),
      },
    ],
  },
};

const stats = [
  {
    _key: "st1",
    value: "12 400+",
    label: i18nString("Konsultasjoner", "Consultations"),
    sub: i18nString("Per år", "Per year"),
  },
  {
    _key: "st2",
    value: "1 800",
    label: i18nString("Inngrep og artroskopier", "Procedures and arthroscopies"),
    sub: i18nString("I 2024", "In 2024"),
  },
  {
    _key: "st3",
    value: "96%",
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
    categorySlug: "ortopedi",
    title: i18nString("Ortopedene som følger deg.", "The orthopaedic specialists who support you."),
    seeAllLabel: i18nString("Se alle ortopeder", "See all orthopaedic specialists"),
    seeAllHref: SPEC,
    limit: 5,
    variant: "carousel",
  },
  {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  },
];

async function main() {
  console.log("▶ Ortopedi landing migration");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  let heroImage: SanityImageRef | null = null;
  let expertSkulder: SanityImageRef | null = null;
  let expertKne: SanityImageRef | null = null;
  let expertHand: SanityImageRef | null = null;
  let expertSecondOpinion: SanityImageRef | null = null;

  if (!DRY_RUN) {
    [heroImage, expertSkulder, expertKne, expertHand, expertSecondOpinion] = await Promise.all([
      uploadImage(ORTOPEDI_ASSET_PATHS.heroImage, "ortopedi-hero"),
      uploadImage(ORTOPEDI_ASSET_PATHS.expertSkulder, "ortopedi-expert-skulder"),
      uploadImage(ORTOPEDI_ASSET_PATHS.expertKne, "ortopedi-expert-kne"),
      uploadImage(ORTOPEDI_ASSET_PATHS.expertHand, "ortopedi-expert-hand"),
      uploadImage(ORTOPEDI_ASSET_PATHS.expertSecondOpinion, "ortopedi-expert-second-opinion"),
    ]);
    console.log("");
  }

  const landingPage = {
    ...landingPageBase,
    expertAreasSection: {
      ...landingPageBase.expertAreasSection,
      areas: landingPageBase.expertAreasSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          e1: expertSkulder,
          e2: expertKne,
          e3: expertHand,
          e4: expertSecondOpinion,
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
    console.log("Would patch category-ortopedi with landing content + media:");
    console.log(`  heroImage: ${ORTOPEDI_ASSET_PATHS.heroImage}`);
    console.log(`  expert areas: ${landingPageBase.expertAreasSection.areas.length}`);
    console.log(`  segments: ${landingPageBase.segmentsSection.segments.length}`);
    return;
  }

  await sanityClient.patch("category-ortopedi").set(patch).commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
