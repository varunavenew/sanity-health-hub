#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` + stats on treatmentCategory `category-fertilitet` (NO + EN).
 *
 * Run from test/:
 *   SANITY_TOKEN=… npx tsx sanity/migrate-fertility-landing.ts
 *
 * Deploy schema first (categoryLanding on treatmentCategory).
 */
import { sanityClient } from "./config";

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

function tags(pairs: [string, string][]): I18nItem[][] {
  return pairs.map(([no, en]) => i18nString(no, en));
}

const landingPage = {
  documentTitle: i18nString(
    "Fertilitet | CMedical — fertilitetsbehandling for alle veier til foreldreskap",
    "Fertility | CMedical — fertility treatment for every path to parenthood",
  ),
  srOnlyTitle: i18nString(
    "Fertilitetsbehandling hos CMedical — IVF, inseminasjon og rådgivning",
    "Fertility treatment at CMedical — IVF, insemination and counselling",
  ),
  hero: {
    eyebrow: i18nString("Fertilitet — CMedical", "Fertility — CMedical"),
    heading: i18nString("Noen ganger trenger kroppen", "Sometimes the body needs"),
    headingEmphasis: i18nString("litt hjelp på veien", "a little help along the way"),
    body: i18nText(
      "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For mange går det av seg selv. For andre tar det litt lenger tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar.",
      "Wanting to become a parent is one of the strongest feelings there is. For many it happens naturally. For others it takes longer — and some need help. It is more common than you think, and there are answers.",
    ),
    bullets: tags([
      ["Ingen henvisning", "No referral needed"],
      ["Korte ventetider", "Short waiting times"],
      ["Erfarne spesialister", "Experienced specialists"],
    ]),
    primaryCtaLabel: i18nString("Bestill konsultasjon", "Book consultation"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Fertilitetsbehandling hos CMedical", "Fertility treatment at CMedical"),
    secondaryImageAlt: i18nString(
      "CMedical fertilitetsklinikk i Sandvika",
      "CMedical fertility clinic in Sandvika",
    ),
  },
  segmentsSection: {
    eyebrow: i18nString("Hva kan vi hjelpe deg med?", "How can we help you?"),
    title: i18nString("Fortell oss hvor du er", "Tell us where you are"),
    titleLine2: i18nString("— vi finner veien videre.", "— we'll find the way forward."),
    segments: [
      {
        _key: "forsta",
        id: "forsta",
        title: i18nString("Jeg vil forstå fruktbarheten min", "I want to understand my fertility"),
        description: i18nText(
          "Vi gjør en grundig fertilitetssjekk — hormoner, eggstokkreserve og ultralyd — så du får tydelige svar i stedet for usikkerhet.",
          "We offer a thorough fertility check — hormones, ovarian reserve and ultrasound — so you get clear answers instead of uncertainty.",
        ),
        tags: tags([
          ["Fertilitetssjekk", "Fertility check"],
          ["Hormoner", "Hormones"],
          ["AMH", "AMH"],
          ["Ultralyd", "Ultrasound"],
          ["Hysteroskopi", "Hysteroscopy"],
          ["Rådgivning online", "Online counselling"],
        ]),
        ctaLabel: i18nString("Les mer", "Read more"),
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
      },
      {
        _key: "gravid",
        id: "gravid",
        title: i18nString("Jeg vil bli gravid", "I want to become pregnant"),
        description: i18nText(
          "Har du prøvd i 6–12 måneder uten å lykkes? Vi finner årsaken og legger en plan — fra inseminasjon til IVF.",
          "Have you tried for 6–12 months without success? We find the cause and make a plan — from insemination to IVF.",
        ),
        tags: tags([
          ["IVF", "IVF"],
          ["Inseminasjon", "Insemination"],
          ["Utredning", "Investigation"],
          ["Assistert befruktning", "Assisted fertilisation"],
          ["Donor-IVF", "Donor IVF"],
          ["Eggløsningsstimulering", "Ovulation stimulation"],
          ["Second opinion", "Second opinion"],
        ]),
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
        tags: tags([
          ["Nedfrysing av egg", "Egg freezing"],
          ["Eggdonasjon", "Egg donation"],
          ["Spermiefrys", "Sperm freezing"],
          ["Eggløsningsstimulering", "Ovulation stimulation"],
        ]),
        ctaLabel: i18nString("Snakk med oss", "Talk to us"),
        href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon",
      },
      {
        _key: "mann",
        id: "mann",
        title: i18nString("Jeg er mann og vil sjekke fruktbarheten", "I'm a man and want to check my fertility"),
        description: i18nText(
          "Halvparten av forklaringen ligger ofte hos mannen. En enkel sædanalyse gir deg svar — diskret og raskt.",
          "Half the explanation often lies with the man. A simple semen analysis gives you answers — discreet and fast.",
        ),
        tags: tags([
          ["Sædanalyse", "Semen analysis"],
          ["Mannlig fertilitet", "Male fertility"],
          ["Rådgivning online", "Online counselling"],
        ]),
        ctaLabel: i18nString("Bestill analyse", "Book analysis"),
        href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
      },
    ],
  },
  whySection: {
    eyebrow: i18nString("Hvorfor CMedical", "Why CMedical"),
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
  },
  audiencesSection: {
    eyebrow: i18nString("For deg som", "For you who"),
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
        href: "/booking?kategori=fertilitet",
        icon: "couple",
      },
      {
        _key: "a2",
        title: i18nString("De ventende", "Those waiting"),
        description: i18nText(
          "Dere er ikke klare ennå, men vil vite hvor dere står. En fertilitetssjekk gir oversikt — og ro.",
          "You are not ready yet, but want to know where you stand. A fertility check gives clarity — and peace of mind.",
        ),
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
        icon: "horizon",
      },
      {
        _key: "a3",
        title: i18nString("Singel", "Single"),
        description: i18nText(
          "Du har bestemt deg for å få barn på egen hånd. Vi følger deg trygt fra første samtale til graviditetstest.",
          "You have decided to have a child on your own. We support you safely from the first conversation to the pregnancy test.",
        ),
        href: "/booking?kategori=fertilitet",
        icon: "arch",
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
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetsutredning",
      },
      {
        _key: "s2",
        symptom: i18nString("Uregelmessig syklus eller mistanke om PCOS", "Irregular cycle or suspected PCOS"),
        service: i18nString("Hormonutredning", "Hormone investigation"),
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
      },
      {
        _key: "s3",
        symptom: i18nString("Jeg vil vite hvor mye tid jeg har", "I want to know how much time I have"),
        service: i18nString("AMH og eggstokkreserve", "AMH and ovarian reserve"),
        href: "/booking?kategori=fertilitet&tjeneste=fertilitetssjekk",
      },
      {
        _key: "s4",
        symptom: i18nString("Vi vurderer nedfrysing av egg", "We are considering egg freezing"),
        service: i18nString("Konsultasjon eggfrys", "Egg freezing consultation"),
        href: "/booking?kategori=fertilitet&tjeneste=eggdonasjon",
      },
      {
        _key: "s5",
        symptom: i18nString("Partneren vil sjekke fruktbarheten", "My partner wants to check fertility"),
        service: i18nString("Sædanalyse", "Semen analysis"),
        href: "/booking?kategori=fertilitet&tjeneste=sedanalyse",
      },
      {
        _key: "s6",
        symptom: i18nString("Vi ønsker å bli foreldre som likekjønnet par", "We want to become parents as a same-sex couple"),
        service: i18nString("Samtale og utredning", "Consultation and investigation"),
        href: "/booking?kategori=fertilitet",
      },
    ],
  },
  servicesSection: {
    eyebrow: i18nString("Tjenester", "Services"),
    title: i18nString("Hva vi tilbyr.", "What we offer."),
    description: i18nText(
      "Fra første samtale til oppfølging — hele fertilitetstilbudet vårt finner du her. Trenger du hjelp til å velge, kan du alltid ringe oss for en uforpliktende prat.",
      "From the first conversation to follow-up — our full fertility offering is here. If you need help choosing, you can always call us for a no-obligation chat.",
    ),
  },
  resultsSection: {
    eyebrow: i18nString("Resultater", "Results"),
    title: i18nString("Tall som forteller en historie.", "Numbers that tell a story."),
    description: i18nText(
      "Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen fertilitetsbehandling de siste årene.",
      "We measure what we do — because you deserve transparency. Here are our fertility treatment results from recent years.",
    ),
    categoryLabel: i18nString("Fertilitet", "Fertility"),
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
  specialistsSection: {
    title: i18nString(
      "Fertilitetsspesialistene som følger deg.",
      "The fertility specialists who support you.",
    ),
    seeAllLabel: i18nString("Se alle fertilitetsspesialister", "See all fertility specialists"),
    seeAllHref: "/spesialister?kategori=fertilitet",
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

async function main() {
  console.log("▶ Patching category-fertilitet landingPage + stats…");
  await sanityClient
    .patch("category-fertilitet")
    .set({ landingPage, stats })
    .commit();
  console.log("✓ Done. Deploy Studio schema if you have not already.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
