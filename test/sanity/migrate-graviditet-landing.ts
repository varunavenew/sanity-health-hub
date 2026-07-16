/**
 * Migration: Populate landingPage (+ FAQ + stats) for the graviditet
 * treatmentCategory document from the live /graviditet page content.
 *
 * Fully localized (NO + EN) using v5 internationalized arrays with `language`.
 *
 * Run with:
 *   cd test
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-graviditet-landing.ts --dry-run
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-graviditet-landing.ts
 *   SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-graviditet-landing.ts   # overwrite existing landingPage
 */

import { sanityClient as client } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";
const CATEGORY_ID = "graviditet";
const GRAV = "/behandlinger/graviditet";

/* ─────────────────────────── i18n helpers (v5) ─────────────────────────── */

type I18nStr = { _key: string; _type: "internationalizedArrayStringValue"; language: string; value: string };
type I18nTxt = { _key: string; _type: "internationalizedArrayTextValue"; language: string; value: string };

const i18nStr = (no: string, en: string): I18nStr[] => [
  { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];
const i18nTxt = (no: string, en: string): I18nTxt[] => [
  { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
];

let keySeq = 0;
const k = (prefix: string) => `${prefix}-${(++keySeq).toString(36)}`;

/* ─────────────────────────────── HERO ─────────────────────────────── */

const hero = {
  layout: "split",
  eyebrow: i18nStr("Graviditet og fostermedisin", "Pregnancy and fetal medicine"),
  heading: i18nStr(
    "Et svangerskap er noe av",
    "A pregnancy is one of"
  ),
  headingEmphasis: i18nStr(
    "det mest sårbare som finnes",
    "the most vulnerable experiences there is"
  ),
  body: i18nTxt(
    "Barneønske, svangerskapskontroll og tiden etter fødsel — vi følger deg gjennom hele forløpet.",
    "Trying to conceive, pregnancy check-ups and the time after birth — we follow you through the entire journey."
  ),
  bullets: [
    { _key: k("b"), _type: "heroBulletItem", title: i18nStr("Ingen henvisning", "No referral needed") },
    { _key: k("b"), _type: "heroBulletItem", title: i18nStr("Korte ventetider", "Short wait times") },
  ],
  primaryCtaLabel: i18nStr("Bestill time", "Book an appointment"),
  secondaryCtaLabel: i18nStr("Ring oss", "Call us"),
  heroImageAlt: i18nStr("Gravid kvinne hos CMedical", "Pregnant woman at CMedical"),
};

/* ────────────────────────────── SEGMENTS ────────────────────────────── */

const segmentsSection = {
  eyebrow: i18nStr("Hvor er du i svangerskapet?", "Where are you in your pregnancy?"),
  title: i18nStr("Fortell oss hvor du er", "Tell us where you are"),
  titleLine2: i18nStr("— vi finner veien videre.", "— we'll find the way forward."),
  layout: "accordion",
  segments: [
    {
      _key: k("seg"),
      _type: "categoryLandingSegment",
      id: "tidlig-ultralyd",
      title: i18nStr("Jeg vil ta tidlig ultralyd", "I want an early ultrasound"),
      description: i18nTxt(
        "Trygghet tidlig i svangerskapet — vi sjekker hjerteslag, plassering og termin, og tar oss god tid til spørsmålene dine.",
        "Peace of mind early in pregnancy — we check the heartbeat, placement and due date, and take our time with your questions."
      ),
      tagLinks: [
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Tidlig ultralyd", "Early ultrasound"), href: `${GRAV}/ultralyd` },
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Termin og plassering", "Due date and placement"), href: `${GRAV}/ultralyd` },
      ],
      ctaLabel: i18nStr("Les mer", "Read more"),
      href: `${GRAV}/ultralyd`,
    },
    {
      _key: k("seg"),
      _type: "categoryLandingSegment",
      id: "nipt",
      title: i18nStr("Jeg vil ta NIPT", "I want a NIPT test"),
      description: i18nTxt(
        "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med tidlig ultralyd hos erfaren spesialist.",
        "The newest non-invasive blood test to detect chromosomal abnormalities — combined with early ultrasound by an experienced specialist."
      ),
      tagLinks: [
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("NIPT", "NIPT"), href: `${GRAV}/nipt` },
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Tidlig ultralyd + NIPT", "Early ultrasound + NIPT"), href: `${GRAV}/nipt` },
      ],
      ctaLabel: i18nStr("Les mer", "Read more"),
      href: `${GRAV}/nipt`,
    },
    {
      _key: k("seg"),
      _type: "categoryLandingSegment",
      id: "fosterdiagnostikk",
      title: i18nStr("Jeg vil ha fosterdiagnostikk i uke 12–14", "I want fetal diagnostics in weeks 12–14"),
      description: i18nTxt(
        "Grundig organrettet undersøkelse i et viktig vindu i svangerskapet. Du møter en spesialist i fostermedisin.",
        "A thorough organ-focused examination in an important window of the pregnancy. You'll meet a specialist in fetal medicine."
      ),
      tagLinks: [
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Fosterdiagnostikk", "Fetal diagnostics"), href: `${GRAV}/fosterdiagnostikk` },
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Organrettet ultralyd", "Organ-focused ultrasound"), href: `${GRAV}/fosterdiagnostikk` },
      ],
      ctaLabel: i18nStr("Les mer", "Read more"),
      href: `${GRAV}/fosterdiagnostikk`,
    },
    {
      _key: k("seg"),
      _type: "categoryLandingSegment",
      id: "team",
      title: i18nStr("Jeg vil ha fast jordmor og lege", "I want a dedicated midwife and doctor"),
      description: i18nTxt(
        "Tett, personlig oppfølging gjennom hele svangerskapet — i ro og uten ventetid. Du møter de samme folkene hver gang.",
        "Close, personal follow-up through the entire pregnancy — calm and without waiting. You meet the same people every time."
      ),
      tagLinks: [
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Graviditetsoppfølging", "Pregnancy follow-up"), href: `${GRAV}/svangerskapsteam` },
        { _key: k("tl"), _type: "categoryLandingSegmentTagLink", label: i18nStr("Jordmor", "Midwife"), href: `${GRAV}/svangerskapsteam` },
      ],
      ctaLabel: i18nStr("Les mer", "Read more"),
      href: `${GRAV}/svangerskapsteam`,
    },
  ],
};

/* ─────────────────────── WHY CHOOSE US (why) ─────────────────────── */

const whySection = {
  eyebrow: i18nStr("Hvorfor CMedical", "Why CMedical"),
  title: i18nStr(
    "Trygghet hele veien — fra første kontroll til etter fødsel.",
    "Safety all the way — from the first check-up to after birth."
  ),
  description: i18nTxt(
    "Hos CMedical får du et team som følger deg gjennom hele svangerskapet, ikke en ny behandler hver gang.",
    "At CMedical you get a team that follows you through the entire pregnancy — not a new provider every time."
  ),
  steps: [
    {
      _key: k("step"), _type: "categoryLandingStep",
      number: "01",
      title: i18nStr("Fast jordmor og lege", "A dedicated midwife and doctor"),
      description: i18nTxt(
        "Du møter de samme menneskene hver gang. De kjenner historien din, og du slipper å starte på nytt.",
        "You meet the same people every time. They know your story, so you don't have to start over."
      ),
    },
    {
      _key: k("step"), _type: "categoryLandingStep",
      number: "02",
      title: i18nStr("Ledende fostermedisinere", "Leading fetal medicine specialists"),
      description: i18nTxt(
        "Spesialister med erfaring fra Rikshospitalet og fostermedisinsk avdeling — på samme klinikk som jordmoren din.",
        "Specialists with experience from Rikshospitalet and the fetal medicine department — at the same clinic as your midwife."
      ),
    },
    {
      _key: k("step"), _type: "categoryLandingStep",
      number: "03",
      title: i18nStr("Også der det er vanskelig", "Also when things are difficult"),
      description: i18nTxt(
        "Vi følger deg gjennom det fine — og gjennom det vondt. Tap, traumatiske fødsler og fødselsangst hører hjemme her.",
        "We follow you through the good — and through the hard. Loss, traumatic births and birth anxiety belong here too."
      ),
    },
  ],
  imageAlt: i18nStr("CMedical klinikk", "CMedical clinic"),
};

/* ───────────────────────── EXPERT AREAS ───────────────────────── */

const expertAreasSection = {
  eyebrow: i18nStr("Våre fagområder", "Our areas of expertise"),
  title: i18nStr(
    "Eksperter som jobber med det de kan aller best.",
    "Experts who work with what they know best."
  ),
  description: i18nTxt(
    "Hos oss møter du jordmødre, gynekologer og fostermedisinere som har spesialisert seg dypt innenfor svangerskap og fødsel — uten omveier.",
    "With us you meet midwives, gynecologists and fetal medicine specialists who have specialised deeply in pregnancy and birth — without detours."
  ),
  readMoreLabel: i18nStr("Les mer", "Read more"),
  layout: "carousel",
  areas: [
    {
      _key: k("area"), _type: "categoryLandingExpertArea",
      title: i18nStr("Tidlig ultralyd", "Early ultrasound"),
      description: i18nTxt(
        "Trygghet tidlig i svangerskapet. Vi sjekker hjerteslag, plassering og termin — og tar oss god tid til spørsmålene dine.",
        "Peace of mind early in pregnancy. We check heartbeat, placement and due date — and take our time with your questions."
      ),
      href: `${GRAV}/ultralyd`,
      imageAlt: i18nStr("Tidlig ultralyd", "Early ultrasound"),
    },
    {
      _key: k("area"), _type: "categoryLandingExpertArea",
      title: i18nStr("NIPT", "NIPT"),
      description: i18nTxt(
        "Den nyeste, ikke-invasive blodprøven for å avdekke kromosomavvik — kombinert med tidlig ultralyd hos erfaren spesialist.",
        "The newest non-invasive blood test to detect chromosomal abnormalities — combined with early ultrasound by an experienced specialist."
      ),
      href: `${GRAV}/nipt`,
      imageAlt: i18nStr("NIPT", "NIPT"),
    },
    {
      _key: k("area"), _type: "categoryLandingExpertArea",
      title: i18nStr("Fosterdiagnostikk uke 12–14", "Fetal diagnostics weeks 12–14"),
      description: i18nTxt(
        "Grundig organrettet undersøkelse i et viktig vindu i svangerskapet. Du møter en spesialist i fostermedisin.",
        "A thorough organ-focused examination in an important window of the pregnancy. You'll meet a specialist in fetal medicine."
      ),
      href: `${GRAV}/fosterdiagnostikk`,
      imageAlt: i18nStr("Fosterdiagnostikk", "Fetal diagnostics"),
    },
    {
      _key: k("area"), _type: "categoryLandingExpertArea",
      title: i18nStr("Graviditetsoppfølging", "Pregnancy follow-up"),
      description: i18nTxt(
        "Erfarne gynekologer og fostermedisinere følger deg gjennom hele svangerskapet. Tett, personlig oppfølging — i ro og uten ventetid.",
        "Experienced gynecologists and fetal medicine specialists follow you through the entire pregnancy. Close, personal follow-up — calm and without waiting."
      ),
      href: `${GRAV}/svangerskapsteam`,
      imageAlt: i18nStr("Graviditetsoppfølging", "Pregnancy follow-up"),
    },
  ],
};

/* ─────────────────────────── SERVICES ─────────────────────────── */

const servicesSection = {
  eyebrow: i18nStr("Hva vi tilbyr", "What we offer"),
  title: i18nStr("Hva vi tilbyr", "What we offer"),
  description: i18nTxt(
    "Fra tidlig ultralyd til fast jordmor — hele svangerskapstilbudet vårt finner du her. Trenger du hjelp til å velge, ring oss for en uforpliktende prat.",
    "From early ultrasound to a dedicated midwife — you'll find our entire pregnancy offering here. If you need help choosing, call us for a no-obligation chat."
  ),
  groups: [
    {
      _key: k("grp"), _type: "categoryLandingServiceGroup",
      label: i18nStr("Tidlig i svangerskapet", "Early in pregnancy"),
      items: [
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("Tidlig ultralyd", "Early ultrasound"),
          description: i18nStr("Hjerteslag, termin og plassering", "Heartbeat, due date and placement"),
          href: `${GRAV}/ultralyd` },
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("NIPT", "NIPT"),
          description: i18nStr("Trygg og rask avklaring av kromosomavvik", "Safe and fast screening for chromosomal abnormalities"),
          href: `${GRAV}/nipt` },
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("Tidlig ultralyd + NIPT", "Early ultrasound + NIPT"),
          description: i18nStr("Kombinert tilbud i én konsultasjon", "Combined offer in a single consultation"),
          href: `${GRAV}/nipt` },
      ],
    },
    {
      _key: k("grp"), _type: "categoryLandingServiceGroup",
      label: i18nStr("Fostermedisin og diagnostikk", "Fetal medicine and diagnostics"),
      items: [
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("Fosterdiagnostikk", "Fetal diagnostics"),
          description: i18nStr("Detaljert vurdering av fosteret", "Detailed assessment of the fetus"),
          href: `${GRAV}/fosterdiagnostikk` },
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("Organrettet ultralyd uke 12–14", "Organ-focused ultrasound weeks 12–14"),
          description: i18nStr("Spesialist i fostermedisin", "Specialist in fetal medicine"),
          href: `${GRAV}/fosterdiagnostikk` },
      ],
    },
    {
      _key: k("grp"), _type: "categoryLandingServiceGroup",
      label: i18nStr("Oppfølging gjennom svangerskapet", "Follow-up throughout pregnancy"),
      items: [
        { _key: k("s"), _type: "categoryLandingServiceItem",
          title: i18nStr("Graviditetsoppfølging", "Pregnancy follow-up"),
          description: i18nStr("Erfarne gynekologer og fostermedisinere hele veien", "Experienced gynecologists and fetal medicine specialists all the way"),
          href: `${GRAV}/svangerskapsteam` },
      ],
    },
  ],
};

/* ─────────────────────────── RESULTS ─────────────────────────── */

const resultsSection = {
  eyebrow: i18nStr("Resultater", "Results"),
  title: i18nStr("Tall som forteller en historie.", "Numbers that tell a story."),
  description: i18nTxt(
    "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er noen tall fra svangerskapsoppfølgingen vår de siste årene.",
    "We measure what we do — because you deserve transparency. Here are some numbers from our pregnancy care in recent years."
  ),
  categoryLabel: i18nStr("Graviditet", "Pregnancy"),
  footnote: i18nStr(
    "Tall oppdatert per Q1 2026. Resultater varierer individuelt.",
    "Numbers updated as of Q1 2026. Results vary individually."
  ),
};

/* ─────────────────────────── REVIEWS ─────────────────────────── */

const reviewsSection = {
  eyebrow: i18nStr("Pasienthistorier", "Patient stories"),
  title: i18nStr("Tilbakemeldinger fra ekte pasienter", "Feedback from real patients"),
  reviews: [
    {
      _key: k("rev"), _type: "categoryLandingReview",
      text: i18nTxt(
        "Jeg ble møtt med ro og tid. Endelig en jordmor som husket meg fra forrige time og som så hele situasjonen.",
        "I was met with calm and time. Finally a midwife who remembered me from the previous appointment and saw the whole picture."
      ),
      author: "Ingrid",
      date: i18nStr("Svangerskap 2025", "Pregnancy 2025"),
    },
    {
      _key: k("rev"), _type: "categoryLandingReview",
      text: i18nTxt(
        "Vi tok NIPT og tidlig ultralyd her, og fikk en grundig forklaring vi forsto. Trygghet i en sårbar tid.",
        "We had NIPT and an early ultrasound here, and got a thorough explanation we understood. Reassurance in a vulnerable time."
      ),
      author: "Anna og Henrik",
      date: i18nStr("2 måneder siden", "2 months ago"),
    },
    {
      _key: k("rev"), _type: "categoryLandingReview",
      text: i18nTxt(
        "Etter en tøff fødsel forrige gang trengte jeg samtaler før vi turte å prøve igjen. Det betød alt.",
        "After a tough birth last time I needed conversations before we dared to try again. It meant everything."
      ),
      author: "Kine M.",
      date: i18nStr("4 måneder siden", "4 months ago"),
    },
  ],
};

/* ─────────────────────────── SPOTLIGHT ─────────────────────────── */

const spotlightSection = {
  title: i18nStr("Start med en", "Start with an"),
  titleEmphasis: i18nStr("tidlig ultralyd", "early ultrasound"),
  text: i18nTxt(
    "En trygg start på svangerskapet. Vi sjekker hjerteslag, plassering og termin — og gir deg ro til å puste litt før resten av reisen begynner.",
    "A safe start to your pregnancy. We check heartbeat, placement and due date — and give you the peace to breathe before the rest of the journey begins."
  ),
  ctaLabel: i18nStr("Les mer om tidlig ultralyd", "Read more about early ultrasound"),
  ctaHref: `${GRAV}/ultralyd`,
  imageAlt: i18nStr("Tidlig ultralyd hos CMedical", "Early ultrasound at CMedical"),
};

/* ─────────────────────────── JOURNEY ─────────────────────────── */

const journeySection = {
  title: i18nStr(
    "Fra første kontakt til riktig oppfølging.",
    "From first contact to the right follow-up."
  ),
  description: i18nTxt(
    "Du tar kontakt — vi tar over. Slik ser et vanlig svangerskapsforløp ut hos oss, fra du booker time til kontrollen etter fødsel.",
    "You reach out — we take over. This is what a typical pregnancy journey looks like with us, from booking to the after-birth check-up."
  ),
  steps: [
    { _key: k("j"), _type: "categoryLandingStep", number: "01",
      title: i18nStr("Bestill time", "Book an appointment"),
      description: i18nTxt(
        "Du booker direkte — ingen henvisning, ingen ventetid. Vi finner et tidspunkt som passer ditt svangerskap.",
        "You book directly — no referral, no wait. We find a time that suits your pregnancy."
      ) },
    { _key: k("j"), _type: "categoryLandingStep", number: "02",
      title: i18nStr("Første konsultasjon", "First consultation"),
      description: i18nTxt(
        "Du møter jordmoren eller spesialisten din. Vi tar oss tid til samtalen før vi gjør en grundig vurdering.",
        "You meet your midwife or specialist. We take time for the conversation before doing a thorough assessment."
      ) },
    { _key: k("j"), _type: "categoryLandingStep", number: "03",
      title: i18nStr("Plan og oppfølging", "Plan and follow-up"),
      description: i18nTxt(
        "Sammen legger vi en plan for resten av svangerskapet, tilpasset deg og din historikk.",
        "Together we create a plan for the rest of the pregnancy, tailored to you and your history."
      ) },
    { _key: k("j"), _type: "categoryLandingStep", number: "04",
      title: i18nStr("Etter fødsel", "After birth"),
      description: i18nTxt(
        "Vi følger deg også etter fødsel — med kontroll, ammehjelp og samtaler om det som var.",
        "We follow you after birth too — with check-ups, breastfeeding support and conversations about what happened."
      ) },
  ],
  ctaLabel: i18nStr("Bestill time", "Book an appointment"),
  ctaHref: `/booking?kategori=${CATEGORY_ID}`,
};

/* ─────────────────────────── LANDING PAGE ─────────────────────────── */

const landingPage = {
  hero,
  segmentsSection,
  whySection,
  expertAreasSection,
  servicesSection,
  resultsSection,
  reviewsSection,
  spotlightSection,
  journeySection,
  sectionOrder: ["segments", "why", "expertAreas", "services", "results", "reviews", "spotlight", "journey"],
  breadcrumbHomeLabel: i18nStr("Hjem", "Home"),
  srOnlyTitle: i18nStr(
    "Graviditet og fostermedisin hos CMedical — ultralyd, NIPT og svangerskapsoppfølging",
    "Pregnancy and fetal medicine at CMedical — ultrasound, NIPT and pregnancy follow-up"
  ),
};

/* ─────────────────────────── STATS (category-level) ─────────────────────────── */

const stats = [
  {
    _key: k("stat"), _type: "object", value: "60 000",
    label: i18nStr("Årlige pasientbesøk", "Annual patient visits"),
    sub: i18nStr("På tvers av klinikkene", "Across our clinics"),
  },
  {
    _key: k("stat"), _type: "object", value: "3 500",
    label: i18nStr("Operasjoner", "Surgeries"),
    sub: i18nStr("Per år", "Per year"),
  },
  {
    _key: k("stat"), _type: "object", value: "4,8/5",
    label: i18nStr("Snittvurdering", "Average rating"),
    sub: i18nStr("Fra pasienter på Google", "From patients on Google"),
  },
  {
    _key: k("stat"), _type: "object", value: "50+",
    label: i18nStr("Spesialister", "Specialists"),
    sub: i18nStr("På tvers av fagfelt", "Across specialties"),
  },
];

/* ─────────────────────────── SEO ─────────────────────────── */

const seo = {
  metaTitle: i18nStr(
    "Graviditet og fostermedisin | CMedical",
    "Pregnancy and fetal medicine | CMedical"
  ),
  metaDescription: i18nTxt(
    "Svangerskapskontroll, tidlig ultralyd, NIPT, fosterdiagnostikk og fødselsforberedelse hos CMedical. Fast jordmor, ingen henvisning, korte ventetider.",
    "Pregnancy check-ups, early ultrasound, NIPT, fetal diagnostics and birth preparation at CMedical. Dedicated midwife, no referral, short wait times."
  ),
  noIndex: false,
};

/* ─────────────────────────── COMMIT ─────────────────────────── */

async function main() {
  console.log(`🚀 Migrating /graviditet landing page${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " [FORCE]" : ""}\n`);

  const doc = await client.fetch<{ _id: string; landingPage?: unknown; stats?: unknown[] } | null>(
    `*[_type == "treatmentCategory" && categoryId == $cid][0]{ _id, landingPage, stats }`,
    { cid: CATEGORY_ID }
  );

  if (!doc) {
    console.error(`❌ No treatmentCategory found with categoryId="${CATEGORY_ID}". Run seed-treatments first.`);
    process.exit(1);
  }

  console.log(`Found category doc: ${doc._id}`);

  const patch: Record<string, unknown> = {};

  const hasLanding = doc.landingPage && typeof doc.landingPage === "object" && Object.keys(doc.landingPage as object).length > 0;
  if (hasLanding && !FORCE) {
    console.log("  ⏭  landingPage already populated (use FORCE=1 to overwrite)");
  } else {
    patch.landingPage = landingPage;
    console.log("  ✅ Setting landingPage (hero, segments, why, expertAreas, services, results, reviews, spotlight, journey)");
  }

  const hasStats = Array.isArray(doc.stats) && doc.stats.length > 0;
  if (hasStats && !FORCE) {
    console.log(`  ⏭  stats already populated (${(doc.stats as unknown[]).length} items) — skipping`);
  } else {
    patch.stats = stats;
    console.log("  ✅ Setting stats (4 items)");
  }

  // Always set SEO (it's required by schema) — but only overwrite when FORCE
  patch.seo = seo;
  console.log("  ✅ Setting seo");

  if (Object.keys(patch).length === 0) {
    console.log("Nothing to do.");
    return;
  }

  if (DRY_RUN) {
    console.log("\nDry run — no changes committed.");
    console.log("Patch preview:", JSON.stringify(patch, null, 2).slice(0, 500) + "...");
    return;
  }

  console.log("\n⏳ Committing patch...");
  await client.patch(doc._id).set(patch).commit();
  console.log("✅ Done.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
