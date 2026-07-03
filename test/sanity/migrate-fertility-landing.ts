#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats + pageSections on treatmentCategory `category-fertilitet` (NO + EN),
 * and uploads hero / section images + hero video from src/assets.
 *
 * Run from test/:
 *   SANITY_TOKEN=… npm run migrate:fertilitet-landing
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const uploadCache = new Map<string, string>();

const FERT = "/behandlinger/fertilitet";

/** Local paths relative to src/assets — matches legacy Fertility.tsx imports where available. */
const FERT_ASSET_PATHS = {
  heroVideo: "hero/fertilitet-video.mp4",
  heroImage: "categories/fertilitet-real.jpg",
  whyImage: "hero/hero-clinic-lounge.jpg",
  spotlightImage: "hero/fertility-hero.jpg",
  expertInfertilitet: "fertility/journey-01-consultation.jpg",
  expertAssistert: "fertility/journey-02-lab.jpg",
  expertUtredning: "fertility/journey-01-consultation.jpg",
  expertEggfrys: "hero/cmedical-family-hands.jpg",
  expertDonor: "fertility/journey-03-result.jpg",
  expertSaed: "hero/fertility-hero.jpg",
  symptomCouple: "hero/cmedical-family-hands.jpg",
  symptomConsultation: "fertility/journey-01-consultation.jpg",
  symptomWaiting: "hero/pdf1-woman1.jpg",
  symptomLab: "fertility/journey-02-lab.jpg",
  symptomHero: "categories/fertilitet-real.jpg",
  symptomSingle: "hero/pdf1-family.jpg",
  supportPsykologi: "articles/psykologspesialist.png",
  supportSexologi: "articles/sexolog.jpg",
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
    "Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning",
    "Fertility treatment at CMedical — IVF, insemination and counselling",
  ),
  hero: {
    heading: i18nString("Noen ganger trenger kroppen", "Sometimes the body needs"),
    headingEmphasis: i18nString("litt hjelp på veien", "a little help along the way"),
    body: i18nText(
      "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For mange går det av seg selv. For andre tar det litt lenger tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar.",
      "Wanting to become a parent is one of the strongest feelings there is. For many it happens naturally. For others it takes longer — and some need help. It is more common than you think, and there are answers.",
    ),
    bullets: [
      i18nString("Ingen henvisning", "No referral needed"),
      i18nString("Korte ventetider", "Short waiting times"),
      i18nString("Erfarne spesialister", "Experienced specialists"),
    ],
    primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Fertilitetsbehandling hos CMedical", "Fertility treatment at CMedical"),
  },
  segmentsSection: {
    title: i18nString("Fortell oss hvor du er", "Tell us where you are"),
    titleLine2: i18nString("— vi finner veien videre.", "— we'll find the way forward."),
    layout: "grid",
    segments: [
      {
        _key: "forsta",
        id: "forsta",
        title: i18nString("Jeg vil forstå fruktbarheten min", "I want to understand my fertility"),
        description: i18nText(
          "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
          "We offer a thorough fertility check — hormones, ovarian reserve and ultrasound — so you get clear answers instead of uncertainty.",
        ),
        tagLinks: [
          tagLink("Fertilitetsutredning", "Fertility investigation", `${FERT}/fertilitetsutredning`),
          tagLink("Hormoner", "Hormones", `${FERT}/fertilitetsutredning`),
          tagLink("AMH", "AMH", `${FERT}/fertilitetsutredning`),
          tagLink("Ultralyd", "Ultrasound", `${FERT}/fertilitetsutredning`),
          tagLink("Hysteroskopi", "Hysteroscopy", `${FERT}/fertilitetsutredning`),
          tagLink("Rådgivning online", "Online counselling", `${FERT}/infertilitet`),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: `${FERT}/fertilitetsutredning`,
      },
      {
        _key: "gravid",
        id: "gravid",
        title: i18nString("Jeg vil bli gravid", "I want to become pregnant"),
        description: i18nText(
          "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
          "Have you tried for 6–12 months without success? We find the cause and make a plan — from insemination to IVF.",
        ),
        tagLinks: [
          tagLink("IVF", "IVF", `${FERT}/assistert-befruktning`),
          tagLink("Inseminasjon", "Insemination", `${FERT}/assistert-befruktning`),
          tagLink("Utredning", "Investigation", `${FERT}/fertilitetsutredning`),
          tagLink("Assistert befruktning", "Assisted fertilisation", `${FERT}/assistert-befruktning`),
          tagLink("Donor-IVF", "Donor IVF", `${FERT}/donorbehandling`),
          tagLink("Eggløsningsstimulering", "Ovulation stimulation", `${FERT}/assistert-befruktning`),
          tagLink("Second opinion", "Second opinion", `${FERT}/fertilitetsutredning`),
        ],
        ctaLabel: i18nString("Bestill utredning", "Book investigation"),
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
      },
      {
        _key: "bevare",
        id: "bevare",
        title: i18nString("Jeg vil bevare mulighetene mine", "I want to preserve my options"),
        description: i18nText(
          "Nedfrysing av egg gir deg tid. Vi forklarer hva det innebærer, hva det koster og når det er riktig for deg.",
          "Egg freezing gives you time. We explain what it involves, what it costs and when it is right for you.",
        ),
        tagLinks: [
          tagLink("Nedfrysing av egg", "Egg freezing", `${FERT}/eggfrys`),
          tagLink("Eggdonasjon", "Egg donation", `${FERT}/donorbehandling`),
          tagLink("Spermiefrys", "Sperm freezing", `${FERT}/eggfrys`),
          tagLink("Eggløsningsstimulering", "Ovulation stimulation", `${FERT}/assistert-befruktning`),
        ],
        ctaLabel: i18nString("Les mer", "Read more"),
        href: `${FERT}/eggfrys`,
      },
      {
        _key: "mann",
        id: "mann",
        title: i18nString("Jeg er mann og vil sjekke fruktbarheten", "I'm a man and want to check my fertility"),
        description: i18nText(
          "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
          "Half the explanation often lies with the man. A simple semen analysis gives you answers — discreet and fast.",
        ),
        tagLinks: [
          tagLink("Sædanalyse", "Semen analysis", `${FERT}/saedanalyse`),
          tagLink("Mannlig fertilitet", "Male fertility", `${FERT}/saedanalyse`),
          tagLink("Rådgivning online", "Online counselling", `${FERT}/infertilitet`),
        ],
        ctaLabel: i18nString("Bestill analyse", "Book analysis"),
        href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
      },
    ],
  },
  whySection: {
    title: i18nString("Det beste fra to klinikker — samlet på ett sted.", "The best of two clinics — in one place."),
    description: i18nText(
      "Livio og CMedical Sandvika har slått seg sammen. Det betyr mer erfaring, samme team — og et tilbud som dekker hele veien.",
      "Livio and CMedical Sandvika have joined forces. That means more experience, the same team — and a service that covers the whole journey.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString("Et trygt sted å starte", "A safe place to start"),
        description: i18nText(
          "Klinikk og laboratorium under samme tak. Ingen lange transporter, ingen mellommenn — bare oss og dere.",
          "Clinic and laboratory under one roof. No long transfers, no middlemen — just us and you.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString("Ledende kompetanse", "Leading expertise"),
        description: i18nText(
          "Spesialister med erfaring fra Rikshospitalet, Livio og internasjonale fertilitetssentre.",
          "Specialists with experience from Rikshospitalet, Livio and international fertility centres.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Tett oppfølging", "Close follow-up"),
        description: i18nText(
          "Vi følger dere før, under og etter — også gjennom de vanskelige beskjedene.",
          "We support you before, during and after — including through difficult news.",
        ),
      },
    ],
    footerLinkLabel: i18nString("Les mer om klinikken", "Learn more about the clinic"),
    footerLinkHref: "/om-oss",
  },
  audiencesSection: {
    title: i18nString("Alle er velkomne", "Everyone is welcome"),
    titleAccent: i18nString("— uansett utgangspunkt.", "— whatever your starting point."),
    readMoreLabel: i18nString("Les mer", "Read more"),
    audiences: [
      {
        _key: "a1",
        title: i18nString("Heterofile par", "Heterosexual couples"),
        description: i18nText(
          "Dere har prøvd en stund og lurer på om noe er galt. Vi starter med utredning av begge — ingen henvisning, ingen ventetid.",
          "You have been trying for a while and wonder if something is wrong. We start by investigating both — no referral, no waiting list.",
        ),
        href: `${FERT}/infertilitet`,
        icon: "users",
      },
      {
        _key: "a2",
        title: i18nString("De ventende", "Those waiting"),
        description: i18nText(
          "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
          "You are not ready yet, but want to know where you stand. A fertility check gives clarity — and peace of mind.",
        ),
        href: `${FERT}/fertilitetsutredning`,
        icon: "clock",
      },
      {
        _key: "a3",
        title: i18nString("Singel", "Single"),
        description: i18nText(
          "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
          "You have decided to have a child on your own. We support you safely from the first conversation to the pregnancy test.",
        ),
        href: `${FERT}/donorbehandling`,
        icon: "user",
      },
    ],
  },
  expertAreasSection: {
    title: i18nString(
      "Eksperter som jobber med det de kan aller best.",
      "Experts who focus on what they do best.",
    ),
    description: i18nText(
      "Hos oss møter du fertilitetsspesialister som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier.",
      "You meet fertility specialists who have specialised deeply in their field. That means the right expertise from the first consultation — without detours.",
    ),
    layout: "grid",
    areas: [
      {
        _key: "e1",
        title: i18nString("Infertilitet", "Infertility"),
        description: i18nText(
          "Årsaker til ufrivillig barnløshet hos kvinner og menn – og når du bør søke hjelp.",
          "Causes of involuntary childlessness in women and men — and when to seek help.",
        ),
        href: `${FERT}/infertilitet`,
      },
      {
        _key: "e2",
        title: i18nString("Assistert befruktning", "Assisted fertilisation"),
        description: i18nText(
          "IVF, ICSI og inseminasjon — også med donor. Norges eldste private fertilitetsklinikk, med erfaring siden 1989.",
          "IVF, ICSI and insemination — including with donor. Norway's oldest private fertility clinic, with experience since 1989.",
        ),
        href: `${FERT}/assistert-befruktning`,
      },
      {
        _key: "e3",
        title: i18nString("Fertilitetsutredning", "Fertility investigation"),
        description: i18nText(
          "Grundig kartlegging som gir svar og en plan tilpasset deg.",
          "Thorough assessment that gives answers and a plan tailored to you.",
        ),
        href: `${FERT}/fertilitetsutredning`,
      },
      {
        _key: "e4",
        title: i18nString("Nedfrysing av egg", "Egg freezing"),
        description: i18nText(
          "For deg som vil bevare mulighetene dine. Vi forklarer hva som er realistisk å forvente — og hva som ikke er det.",
          "For those who want to preserve their options. We explain what is realistic to expect — and what is not.",
        ),
        href: `${FERT}/eggfrys`,
      },
      {
        _key: "e5",
        title: i18nString("Donorbehandling", "Donor treatment"),
        description: i18nText(
          "Donorsæd, donoregg og partnerdonasjon — vi følger dere trygt gjennom hele forløpet, etter norsk lov.",
          "Donor sperm, donor eggs and partner donation — we guide you safely through the whole process, under Norwegian law.",
        ),
        href: `${FERT}/donorbehandling`,
      },
      {
        _key: "e6",
        title: i18nString("Sædanalyse", "Semen analysis"),
        description: i18nText(
          "Sædprøve, hormonprøver og avanserte teknikker som mikro-TESE. Halvparten av forklaringen ligger ofte hos mannen.",
          "Semen sample, hormone tests and advanced techniques such as micro-TESE. Half the explanation often lies with the man.",
        ),
        href: `${FERT}/saedanalyse`,
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
        symptom: i18nString("Vi har prøvd i over et år uten å lykkes", "We have tried for over a year without success"),
        service: i18nString("Fertilitetsutredning", "Fertility investigation"),
        href: `${FERT}/fertilitetsutredning`,
        imageAlt: i18nString("Par i samtale", "Couple in conversation"),
      },
      {
        _key: "s2",
        symptom: i18nString("Uregelmessig syklus eller mistanke om PCOS", "Irregular cycle or suspected PCOS"),
        service: i18nString("Hormonutredning", "Hormone investigation"),
        href: `${FERT}/fertilitetsutredning`,
        imageAlt: i18nString("Konsultasjon med spesialist", "Consultation with specialist"),
      },
      {
        _key: "s3",
        symptom: i18nString("Jeg vil vite hvor mye tid jeg har", "I want to know how much time I have"),
        service: i18nString("AMH og eggstokkreserve", "AMH and ovarian reserve"),
        href: `${FERT}/fertilitetsutredning`,
        imageAlt: i18nString("Stille refleksjon", "Quiet reflection"),
      },
      {
        _key: "s4",
        symptom: i18nString("Vi vurderer nedfrysing av egg", "We are considering egg freezing"),
        service: i18nString("Konsultasjon eggfrys", "Egg freezing consultation"),
        href: `${FERT}/eggfrys`,
        imageAlt: i18nString("Laboratorium for nedfrysing", "Laboratory for freezing"),
      },
      {
        _key: "s5",
        symptom: i18nString("Partneren vil sjekke fruktbarheten", "My partner wants to check fertility"),
        service: i18nString("Sædanalyse", "Semen analysis"),
        href: `${FERT}/saedanalyse`,
        imageAlt: i18nString("Mannlig fertilitetsutredning", "Male fertility investigation"),
      },
      {
        _key: "s6",
        symptom: i18nString("Vi ønsker å bli foreldre som likekjønnet par", "We want to become parents as a same-sex couple"),
        service: i18nString("Donorbehandling", "Donor treatment"),
        href: `${FERT}/donorbehandling`,
        imageAlt: i18nString("Vei mot foreldreskap", "Path to parenthood"),
      },
    ],
  },
  servicesSection: {
    title: i18nString("Hva vi tilbyr", "What we offer"),
    description: i18nText(
      "Fra første samtale til oppfølging — hele fertilitetstilbudet vårt finner du her. Trenger du hjelp til å velge, ring oss for en uforpliktende prat.",
      "From the first conversation to follow-up — our full fertility offering is here. If you need help choosing, call us for a no-obligation chat.",
    ),
    groups: [
      {
        _key: "sg1",
        label: i18nString("Undersøkelse og utredning", "Examination and investigation"),
        items: [
          {
            _key: "sg1i1",
            title: i18nString("Fertilitetsutredning", "Fertility investigation"),
            description: i18nString("Blodprøver, ultralyd og sædanalyse", "Blood tests, ultrasound and semen analysis"),
            href: `${FERT}/fertilitetsutredning`,
          },
          {
            _key: "sg1i2",
            title: i18nString("Infertilitet", "Infertility"),
            description: i18nString("Forstå årsaker og veien videre", "Understand causes and the way forward"),
            href: `${FERT}/infertilitet`,
          },
          {
            _key: "sg1i3",
            title: i18nString("Sædanalyse", "Semen analysis"),
            description: i18nString("Mannlig fertilitet og mikro-TESE", "Male fertility and micro-TESE"),
            href: `${FERT}/saedanalyse`,
          },
          {
            _key: "sg1i4",
            title: i18nString("Hysteroskopi", "Hysteroscopy"),
            description: i18nString("Skånsom vurdering av livmorhulen", "Gentle assessment of the uterine cavity"),
            href: `${FERT}/hysteroskopi`,
          },
        ],
      },
      {
        _key: "sg2",
        label: i18nString("Behandling", "Treatment"),
        items: [
          {
            _key: "sg2i1",
            title: i18nString("Assistert befruktning", "Assisted fertilisation"),
            description: i18nString("IVF, ICSI og inseminasjon (IUI)", "IVF, ICSI and insemination (IUI)"),
            href: `${FERT}/assistert-befruktning`,
          },
          {
            _key: "sg2i2",
            title: i18nString("Donorbehandling", "Donor treatment"),
            description: i18nString("Donorsæd, donoregg og partnerdonasjon", "Donor sperm, donor eggs and partner donation"),
            href: `${FERT}/donorbehandling`,
          },
          {
            _key: "sg2i3",
            title: i18nString("Nedfrysing av egg", "Egg freezing"),
            description: i18nString("Egg, sæd og embryo", "Eggs, sperm and embryos"),
            href: `${FERT}/eggfrys`,
          },
          {
            _key: "sg2i4",
            title: i18nString("Gynekologi og kirurgi", "Gynecology and surgery"),
            description: i18nString("Polypper, endometriose, myomer", "Polyps, endometriosis, fibroids"),
            href: "/behandlinger/gynekologi",
          },
        ],
      },
    ],
  },
  supportSection: {
    title: i18nString("Støtte gjennom fertilitetsprosessen", "Support through the fertility process"),
    areas: [
      {
        _key: "sup1",
        title: i18nString("Psykisk hjelp under fertilitetsprosess", "Mental health support during fertility treatment"),
        description: i18nText(
          "Rådgivning og støtte fra psykolog for deg som står i en fertilitetsprosess.",
          "Counselling and support from a psychologist for those going through fertility treatment.",
        ),
        href: "/behandlinger/flere-fagomrader/psykologi",
        imageAlt: i18nString("Psykisk hjelp under fertilitetsprosess", "Mental health support during fertility treatment"),
      },
      {
        _key: "sup2",
        title: i18nString("Intimitet i parforhold under fertilitetsprosess", "Intimacy in relationships during fertility treatment"),
        description: i18nText(
          "Veiledning fra sexolog om intimitet og parforhold gjennom fertilitetsforløpet.",
          "Guidance from a sexologist on intimacy and relationships through the fertility journey.",
        ),
        href: "/behandlinger/flere-fagomrader/sexologi",
        imageAlt: i18nString("Intimitet i parforhold under fertilitetsprosess", "Intimacy in relationships during fertility treatment"),
      },
    ],
  },
  resultsSection: {
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen fertilitetsbehandling de siste årene.",
      "We measure what we do — because you deserve transparency. Here are our fertility treatment results from recent years.",
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
          "Vi følte oss trygge fra første møte. De tok seg virkelig tid til å bli kjent med oss og vårt utgangspunkt — og det betød alt.",
          "We felt safe from the first meeting. They really took time to get to know us and our situation — and that meant everything.",
        ),
        author: "Hilde",
        date: i18nString("IVF-forløp 2024", "IVF journey 2024"),
      },
      {
        _key: "r2",
        text: i18nText(
          "Profesjonelle, varme og tydelige hele veien. Endelig følte vi at noen lyttet og hadde en plan vi kunne forstå.",
          "Professional, warm and clear throughout. Finally we felt someone was listening and had a plan we could understand.",
        ),
        author: "Marte og Jonas",
        date: i18nString("1 måned siden", "1 month ago"),
      },
      {
        _key: "r3",
        text: i18nText(
          "Korte ventetider, dyktige spesialister og et tilbud som faktisk er tilpasset oss. Anbefales på det sterkeste.",
          "Short waiting times, skilled specialists and a service truly tailored to us. Highly recommended.",
        ),
        author: "Sara L.",
        date: i18nString("3 måneder siden", "3 months ago"),
      },
    ],
  },
  spotlightSection: {
    title: i18nString("Begynn med en", "Start with a"),
    titleEmphasis: i18nString("fertilitetsutredning", "fertility investigation"),
    text: i18nText(
      "En grundig kartlegging av eggstokkreserve, hormoner og anatomi — slik at du vet hvor du står. Du møter en spesialist som går gjennom funnene og legger en plan tilpasset deg og din partner.",
      "A thorough assessment of ovarian reserve, hormones and anatomy — so you know where you stand. You meet a specialist who reviews the findings and creates a plan tailored to you and your partner.",
    ),
    ctaLabel: i18nString("Les mer om fertilitetsutredning", "Learn more about fertility investigation"),
    ctaHref: `${FERT}/fertilitetsutredning`,
  },
};

const stats = [
  {
    _key: "st1",
    value: "42%",
    label: i18nString("Suksessrate IVF", "IVF success rate"),
    sub: i18nString("Kvinner under 35 år", "Women under 35"),
  },
  {
    _key: "st2",
    value: "3 800+",
    label: i18nString("Barn født", "Children born"),
    sub: i18nString("Siden oppstart i 1989", "Since 1989"),
  },
  {
    _key: "st3",
    value: "11 200",
    label: i18nString("Egg uthentet", "Eggs retrieved"),
    sub: i18nString("Siste 5 år", "Last 5 years"),
  },
  {
    _key: "st4",
    value: "1 450",
    label: i18nString("IVF-sykluser", "IVF cycles"),
    sub: i18nString("Gjennomført i 2024", "Completed in 2024"),
  },
];

const pageSections = [
  {
    _key: "ps-spec",
    _type: "pageSectionSpecialists",
    displayMode: "category",
    categorySlug: "fertilitet",
    title: i18nString(
      "Fertilitetsspesialistene som følger deg.",
      "The fertility specialists who support you.",
    ),
    seeAllLabel: i18nString("Se alle fertilitetsspesialister", "See all fertility specialists"),
    seeAllHref: "/spesialister?kategori=fertilitet",
    limit: 5,
    variant: "carousel",
  },
  {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  },
];

async function main() {
  console.log("▶ Fertilitet landing migration");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  let heroVideo: SanityFileRef | null = null;
  let heroImage: SanityImageRef | null = null;
  let whyImage: SanityImageRef | null = null;
  let spotlightImage: SanityImageRef | null = null;
  let expertInfertilitet: SanityImageRef | null = null;
  let expertAssistert: SanityImageRef | null = null;
  let expertUtredning: SanityImageRef | null = null;
  let expertEggfrys: SanityImageRef | null = null;
  let expertDonor: SanityImageRef | null = null;
  let expertSaed: SanityImageRef | null = null;
  let symptomCouple: SanityImageRef | null = null;
  let symptomConsultation: SanityImageRef | null = null;
  let symptomWaiting: SanityImageRef | null = null;
  let symptomLab: SanityImageRef | null = null;
  let symptomHero: SanityImageRef | null = null;
  let symptomSingle: SanityImageRef | null = null;
  let supportPsykologi: SanityImageRef | null = null;
  let supportSexologi: SanityImageRef | null = null;

  if (!DRY_RUN) {
    [
      heroVideo,
      heroImage,
      whyImage,
      spotlightImage,
      expertInfertilitet,
      expertAssistert,
      expertUtredning,
      expertEggfrys,
      expertDonor,
      expertSaed,
      symptomCouple,
      symptomConsultation,
      symptomWaiting,
      symptomLab,
      symptomHero,
      symptomSingle,
      supportPsykologi,
      supportSexologi,
    ] = await Promise.all([
      uploadVideo(FERT_ASSET_PATHS.heroVideo, "fertilitet-hero-video"),
      uploadImage(FERT_ASSET_PATHS.heroImage, "fertilitet-hero-poster"),
      uploadImage(FERT_ASSET_PATHS.whyImage, "fertilitet-why-section"),
      uploadImage(FERT_ASSET_PATHS.spotlightImage, "fertilitet-spotlight"),
      uploadImage(FERT_ASSET_PATHS.expertInfertilitet, "fertilitet-expert-infertilitet"),
      uploadImage(FERT_ASSET_PATHS.expertAssistert, "fertilitet-expert-assistert"),
      uploadImage(FERT_ASSET_PATHS.expertUtredning, "fertilitet-expert-utredning"),
      uploadImage(FERT_ASSET_PATHS.expertEggfrys, "fertilitet-expert-eggfrys"),
      uploadImage(FERT_ASSET_PATHS.expertDonor, "fertilitet-expert-donor"),
      uploadImage(FERT_ASSET_PATHS.expertSaed, "fertilitet-expert-saed"),
      uploadImage(FERT_ASSET_PATHS.symptomCouple, "fertilitet-symptom-couple"),
      uploadImage(FERT_ASSET_PATHS.symptomConsultation, "fertilitet-symptom-consultation"),
      uploadImage(FERT_ASSET_PATHS.symptomWaiting, "fertilitet-symptom-waiting"),
      uploadImage(FERT_ASSET_PATHS.symptomLab, "fertilitet-symptom-lab"),
      uploadImage(FERT_ASSET_PATHS.symptomHero, "fertilitet-symptom-hero"),
      uploadImage(FERT_ASSET_PATHS.symptomSingle, "fertilitet-symptom-single"),
      uploadImage(FERT_ASSET_PATHS.supportPsykologi, "fertilitet-support-psykologi"),
      uploadImage(FERT_ASSET_PATHS.supportSexologi, "fertilitet-support-sexologi"),
    ]);
    console.log("");
  }

  const landingPage = {
    ...landingPageBase,
    whySection: {
      ...landingPageBase.whySection,
      ...(whyImage ? { image: whyImage } : {}),
      imageAlt: i18nString(
        "CMedical fertilitetsklinikk i Sandvika",
        "CMedical fertility clinic in Sandvika",
      ),
    },
    expertAreasSection: {
      ...landingPageBase.expertAreasSection,
      areas: landingPageBase.expertAreasSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          e1: expertInfertilitet,
          e2: expertAssistert,
          e3: expertUtredning,
          e4: expertEggfrys,
          e5: expertDonor,
          e6: expertSaed,
        };
        const image = imageByKey[area._key] ?? null;
        return image ? { ...area, image, imageAlt: area.title } : area;
      }),
    },
    symptomsSection: {
      ...landingPageBase.symptomsSection,
      items: landingPageBase.symptomsSection.items.map((item) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          s1: symptomCouple,
          s2: symptomConsultation,
          s3: symptomWaiting,
          s4: symptomLab,
          s5: symptomHero,
          s6: symptomSingle,
        };
        const image = imageByKey[item._key] ?? null;
        return image ? { ...item, image } : item;
      }),
    },
    supportSection: {
      ...landingPageBase.supportSection,
      areas: landingPageBase.supportSection.areas.map((area) => {
        const imageByKey: Record<string, SanityImageRef | null> = {
          sup1: supportPsykologi,
          sup2: supportSexologi,
        };
        const image = imageByKey[area._key] ?? null;
        return image ? { ...area, image } : area;
      }),
    },
    spotlightSection: {
      ...landingPageBase.spotlightSection,
      ...(spotlightImage ? { image: spotlightImage } : {}),
      imageAlt: i18nString(
        "Konsultasjon med fertilitetsspesialist hos CMedical",
        "Fertility specialist consultation at CMedical",
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
    console.log("Would patch category-fertilitet with landing content + media:");
    console.log(`  heroVideo: ${FERT_ASSET_PATHS.heroVideo}`);
    console.log(`  heroImage: ${FERT_ASSET_PATHS.heroImage}`);
    console.log(`  whyImage: ${FERT_ASSET_PATHS.whyImage}`);
    console.log(`  spotlight: ${FERT_ASSET_PATHS.spotlightImage}`);
    return;
  }

  await sanityClient.patch("category-fertilitet").set(patch).commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
