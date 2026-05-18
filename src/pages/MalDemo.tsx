import { useParams, Link, Navigate } from "react-router-dom";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import gynekologiHero from "@/assets/categories/gynekologi.jpg";
import gynekologiReal from "@/assets/categories/gynekologi-real.jpg";
import fertilitetReal from "@/assets/categories/fertilitet-real.jpg";
import flereReal from "@/assets/categories/flere-fagomrader.jpg";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import robotkirurgiHero from "@/assets/hero/robotkirurgi-hero.jpg";
import gynekologiHero2 from "@/assets/hero/gynecology-hero.jpg";
import clinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import articleGyn from "@/assets/articles/gynekologi.jpg";
import articleFert from "@/assets/articles/fertilitet.png";
import articleSexolog from "@/assets/articles/sexolog.jpg";
import tverrfagligTeam from "@/assets/hero/tverrfaglig-team.jpg";

import spec1 from "@/assets/specialists/ane-gerda-z-eriksson.webp";
import spec2 from "@/assets/specialists/birgitte-mitlid-mork.jpg";
import spec3 from "@/assets/specialists/jeanette-follestad.jpg";
import spec4 from "@/assets/specialists/marian-bale.jpg";
import spec5 from "@/assets/specialists/tea-berge.jpg";
import spec6 from "@/assets/specialists/kjersti-margrete-finsrud.jpg";

/**
 * MalDemo – komplette mastermal-sider for kundegodkjenning.
 *
 * Hver mal viser ALLE tilgjengelige seksjonstyper med realistisk innhold,
 * bilder og tekst, slik at kunden kan klone malen og slå av/på de
 * seksjonene de ikke trenger – uten å starte fra et tomt ark.
 */

type Section = { _type: string; _key: string; enabled?: boolean; [k: string]: any };

/* ───────── Felles seksjoner med realistisk innhold ───────── */

const ctaSection = (heading: string, body: string): Section => ({
  _type: "sectionCta",
  _key: "cta",
  background: "dark",
  heading,
  body,
  ctaLabel: "Bestill time",
  ctaHref: "/booking",
});

const sharedStats = (heading: string, items: { value: string; label: string }[], background: "dark" | "light" = "dark"): Section => ({
  _type: "sectionStats",
  _key: `stats-${heading.slice(0, 6)}`,
  background,
  heading,
  items: items.map((it, i) => ({ _key: `s${i}`, ...it })),
});

const faqGyn: Section = {
  _type: "sectionFaq",
  _key: "faq",
  heading: "Ofte stilte spørsmål",
  intro: "Det pasientene oftest lurer på før første time.",
  items: [
    { _key: "f1", question: "Trenger jeg henvisning fra fastlege?", answer: "Nei. Du bestiller time direkte hos oss – uten henvisning og uten ventetid." },
    { _key: "f2", question: "Dekker helseforsikringen min behandlingen?", answer: "De fleste norske helseforsikringer dekker konsultasjon, utredning og inngrep hos oss. Vi sender faktura direkte til forsikringsselskapet." },
    { _key: "f3", question: "Hvor raskt får jeg time?", answer: "Som regel innen en uke. Akutte tilfeller prioriteres og kan ofte få time samme dag." },
    { _key: "f4", question: "Kan jeg få sykmelding?", answer: "Ja, vi skriver sykmelding når det er medisinsk begrunnet, etter nasjonale retningslinjer." },
  ],
};

/* ───────── Ekstra seksjonsbibliotek – brukes i alle maler ───────── */

const trustBadges = (heading = "Trygt og kvalitetssikret"): Section => ({
  _type: "sectionTrustBadges",
  _key: "trust",
  heading,
  items: [
    { label: "Godkjent av Helsetilsynet", icon: "shield" },
    { label: "Dekkes av helseforsikring", icon: "fileCheck" },
    { label: "4.9 på 2000+ vurderinger", icon: "star" },
    { label: "Ofte time samme uke", icon: "clock" },
  ],
});

const videoSection = (caption: string, thumbnail: any): Section => ({
  _type: "sectionVideo",
  _key: "video",
  thumbnail,
  caption,
});

const imageGallery = (heading: string, images: { image: any; caption: string }[]): Section => ({
  _type: "sectionImageGallery",
  _key: "gallery",
  heading,
  images,
});

const specialistsSection = (heading: string): Section => ({
  _type: "sectionSpecialists",
  _key: "specialists",
  heading,
  intro: "Erfarne spesialister med smalt fagfelt og bred klinisk erfaring.",
  items: [
    { name: "Ane Gerda Z. Eriksson", role: "Gynekolog", image: spec1 },
    { name: "Birgitte Mitlid-Mork", role: "Gynekolog", image: spec2 },
    { name: "Jeanette Follestad", role: "Fertilitetslege", image: spec3 },
    { name: "Marian Bale", role: "Spesialsykepleier", image: spec4 },
    { name: "Tea Berge", role: "Gynekolog", image: spec5 },
    { name: "Kjersti M. Finsrud", role: "Sexolog", image: spec6 },
  ],
});

const reviewsSection = (heading = "Hva pasientene sier"): Section => ({
  _type: "sectionReviews",
  _key: "reviews",
  heading,
  intro: "Utvalg fra Google-anmeldelser og Legelisten.",
  items: [
    { rating: 5, body: "Endelig en lege som lyttet og forklarte alt på en måte jeg forsto. Følte meg helt trygg.", author: "Maria, 34", source: "Google" },
    { rating: 5, body: "Fikk time samme uke, og oppfølgingen etterpå var upåklagelig. Anbefales på det sterkeste.", author: "Anonym", source: "Legelisten" },
    { rating: 5, body: "Profesjonelt fra første kontakt. Klinikken er moderne og personalet utrolig hyggelig.", author: "Sofie, 41", source: "Google" },
  ],
});

const priceTeaser = (heading = "Hva koster det"): Section => ({
  _type: "sectionPriceTeaser",
  _key: "priceTeaser",
  heading,
  items: [
    { label: "Konsultasjon hos spesialist", price: "fra 1 950,-" },
    { label: "Utvidet undersøkelse", price: "fra 2 800,-" },
    { label: "Inngrep / behandling", price: "fra 4 500,-" },
    { label: "Oppfølgingstime", price: "fra 1 250,-" },
  ],
  ctaHref: "/priser",
});

const relatedThemes = (heading = "Utforsk relaterte tema"): Section => ({
  _type: "sectionRelatedThemes",
  _key: "relatedThemes",
  heading,
  items: [
    { label: "Kvinnehelse", description: "Et samlet tilbud gjennom hele livet.", path: "/kvinnehelse", image: kvinnehelseHero },
    { label: "Robotkirurgi", description: "Skånsom presisjonskirurgi.", path: "/robotkirurgi", image: robotkirurgiHero },
    { label: "Tverrfaglig", description: "Flere spesialister – samme forløp.", path: "/tverrfaglige", image: tverrfagligTeam },
  ],
});

const richIntro = (key: string, heading: string, body: string): Section => ({
  _type: "sectionRichText",
  _key: key,
  heading,
  body,
});

/* ───────── Mal-definisjoner med realistisk innhold ───────── */

const TEMPLATES: Record<
  string,
  { title: string; description: string; sections: Section[] }
> = {
  /* ════════════════ FAGOMRÅDE ════════════════ */
  treatmentCategory: {
    title: "Mal: Fagområde – Gynekologi",
    description:
      "Mastermal for hovedkategorier som Gynekologi, Fertilitet og Urologi. Vist med ekte innhold fra gynekologi-fagområdet.",
    sections: [
      {
        _type: "sectionHero",
        _key: "hero",
        image: gynekologiHero,
        eyebrow: "Ingen ventetid · Ingen henvisning",
        heading: "Gynekologi",
        subheading:
          "Velkommen til CMedical Kvinnehelse. Vi tilbyr et spisset og bredt tilbud innen gynekologi, fertilitet og kirurgi – direkte tilgang til riktig ekspertise, uten omveier.",
        ctaLabel: "Bestill time",
        ctaHref: "/booking",
      },
      {
        _type: "sectionIntro",
        _key: "intro",
        heading: "Trygg gynekologisk spesialisthjelp",
        body:
          "Hos oss møter du gynekologer som jobber med den kvinnesykdommen de kan **aller best**. Ved behov tilbyr vi tverrfaglig behandling med fertilitetsspesialister, sexolog, urolog, ernæringsfysiologer, osteopat, fysioterapeuter, uroterapeut og psykologer – alt under samme tak.",
      },
      sharedStats("Erfaring du kan stole på", [
        { value: "50 000", label: "Konsultasjoner i året" },
        { value: "25+", label: "Års erfaring" },
        { value: "98%", label: "Pasienttilfredshet" },
        { value: "4", label: "Klinikker" },
      ]),
      {
        _type: "sectionServicesList",
        _key: "services",
        heading: "Alt under samme tak",
        intro: "Våre spesialister jobber innenfor disse områdene innen gynekologi:",
        manualItems: [
          { label: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
          { label: "Urinlekkasje", path: "/behandlinger/gynekologi/urinlekkasje" },
          { label: "Endometriose", path: "/behandlinger/gynekologi/endometriose" },
          { label: "Overgangsalder", path: "/behandlinger/gynekologi/overgangsalder" },
          { label: "Vaginale fremfall", path: "/behandlinger/gynekologi/vaginale-fremfall" },
          { label: "Blødningsforstyrrelser", path: "/behandlinger/gynekologi/blodningsforstyrrelser" },
          { label: "PMS og PMDD", path: "/behandlinger/gynekologi/pms-pmdd" },
          { label: "Robotassistert kirurgi", path: "/behandlinger/gynekologi/robotkirurgi" },
        ],
      },
      {
        _type: "sectionServiceGroups",
        _key: "groups",
        heading: "Tjenester gruppert etter livsfase",
        groups: [
          { _key: "g1", caption: "Rutine og forebygging", label: "Den vanlige timen", items: ["Gynekologisk undersøkelse", "Celleforandringer", "Vaginal tørrhet"] },
          { _key: "g2", caption: "Utredning av plager", label: "Når noe ikke kjennes riktig", items: ["Endometriose", "Blødningsforstyrrelser", "PMS og PMDD", "Cyster på eggstokkene"] },
          { _key: "g3", caption: "Livet skifter form", label: "Hormonelle faser", items: ["Overgangsalder", "Urinlekkasje", "Vaginale fremfall"] },
          { _key: "g4", caption: "Kirurgi", label: "Når kirurgi er svaret", items: ["Gynekologisk kirurgi", "Robotassistert kirurgi", "Fjerne livmor", "Labiaplastikk"] },
        ],
      },
      {
        _type: "sectionBenefits",
        _key: "benefits",
        heading: "Hva du kan forvente hos oss",
        items: [
          "Kort ventetid – ofte time samme uke",
          "Erfarne gynekologer med smalt spesialfelt",
          "Tverrfaglig samarbeid når det er behov",
          "Moderne utstyr og robotassistert kirurgi",
          "Tydelig oppfølging etter konsultasjon",
        ],
      },
      {
        _type: "sectionProcess",
        _key: "process",
        heading: "Slik foregår en time hos oss",
        steps: [
          { title: "Bestill time online", description: "Velg klinikk, dag og spesialist. Du trenger ingen henvisning." },
          { title: "Konsultasjon", description: "Grundig samtale og undersøkelse. Vi tar oss tid til å forklare." },
          { title: "Plan og oppfølging", description: "Du får skriftlig oppsummering og klar plan – med tilgang til ditt team." },
        ],
      },
      {
        _type: "sectionJourney",
        _key: "journey",
        heading: "Din vei gjennom oss",
        steps: [
          { _key: "j1", icon: "calendar", label: "Steg 01", title: "Booking", body: "Velg tid som passer deg." },
          { _key: "j2", icon: "stethoscope", label: "Steg 02", title: "Utredning", body: "Trygg og grundig kartlegging." },
          { _key: "j3", icon: "heart", label: "Steg 03", title: "Behandling", body: "Skreddersydd plan og tiltak." },
          { _key: "j4", icon: "users", label: "Steg 04", title: "Oppfølging", body: "Vi følger deg helt i mål." },
        ],
      },
      {
        _type: "sectionAccordionContent",
        _key: "accordion",
        heading: "Praktisk informasjon",
        items: [
          { _key: "a1", heading: "Henvisning", content: "Ingen henvisning nødvendig. Vi er en privat helseklinikk uten refusjonsavtale med det offentlige." },
          { _key: "a2", heading: "Ventetid", content: "Fra ingen til veldig korte ventetider – som regel innen en uke." },
          { _key: "a3", heading: "Sykmelding", content: "Vi skriver sykmelding ved behov, etter nasjonale retningslinjer." },
          { _key: "a4", heading: "Utredning", content: "Vi anbefaler alle å starte med en konsultasjon. En vanlig utredning varer ca 30 minutter." },
        ],
      },
      {
        _type: "sectionQuote",
        _key: "quote",
        quote: "Jeg følte meg sett og ivaretatt fra første øyeblikk. Klare svar og en plan jeg forsto.",
        source: "Pasient, 38 år",
      },
      faqGyn,
      trustBadges(),
      specialistsSection("Spesialister i gynekologi"),
      videoSection("Bli kjent med klinikken vår", gynekologiReal),
      imageGallery("Slik er det å komme til oss", [
        { image: gynekologiHero, caption: "Konsultasjonsrommet" },
        { image: clinicLounge, caption: "Klinikk-lounge" },
        { image: gynekologiReal, caption: "Trygge rammer" },
      ]),
      reviewsSection(),
      priceTeaser("Hva koster gynekologi"),
      relatedThemes("Utforsk relaterte fagområder"),
      ctaSection("Klar for å ta neste steg?", "Bestill time online eller ring oss. Vi er her for deg."),
    ],
  },

  /* ════════════════ TEMASIDE ════════════════ */
  themePage: {
    title: "Mal: Temaside – Kvinnehelse",
    description:
      "Mastermal for tverrgående temaer som Kvinnehelse og Robotkirurgi. Vist med ekte innhold fra Kvinnehelse-satsningen.",
    sections: [
      {
        _type: "sectionHero",
        _key: "hero",
        image: kvinnehelseHero,
        eyebrow: "Tema · Kvinnehelse",
        heading: "Kvinnehelse i hele livet",
        subheading:
          "Vi gjør kvinnehelse til folkehelse – i hele Norden. Et samlet tilbud som følger deg fra ungdom, gjennom fertile år og overgangsalder, til livet etterpå.",
        ctaLabel: "Utforsk tilbudet",
        ctaHref: "/kvinnehelse",
      },
      {
        _type: "sectionIntro",
        _key: "intro",
        heading: "Ett tilbud – mange faser",
        body:
          "Kvinnehelse er mer enn gynekologi. Det er fertilitet, hormoner, bekkenbunn, sex og samliv, psykisk helse og forebygging. Hos oss kobler vi sammen spesialister på tvers, slik at du slipper å lete selv.",
      },
      {
        _type: "sectionRichText",
        _key: "rich-1",
        heading: "Bakgrunn for satsningen",
        body:
          "Kvinner har historisk fått **mindre forskning, lengre ventetid og dårligere svar** på sine helseplager. Vi ønsker å snu det. Derfor har vi samlet ledende spesialister innen kvinnehelse på ett sted, og bygget forløp som tar utgangspunkt i hele livet – ikke bare én diagnose.",
      },
      {
        _type: "sectionLinkedServices",
        _key: "linked",
        heading: "Inngangsporter til tilbudet",
        items: [
          { label: "Gynekologi", description: "Utredning, behandling og kirurgi hos erfarne gynekologer.", path: "/gynekologi" },
          { label: "Fertilitet", description: "Fra fertilitetssjekk til IVF – komplett oppfølging.", path: "/behandlinger/fertilitet" },
          { label: "Overgangsalder", description: "Hormonbehandling og tverrfaglig støtte.", path: "/behandlinger/gynekologi/overgangsalder" },
          { label: "Bekkenbunn", description: "Urinlekkasje, fremfall og fødselsskader.", path: "/behandlinger/gynekologi/urinlekkasje" },
        ],
      },
      {
        _type: "sectionServiceGroups",
        _key: "groups",
        heading: "Temaet dekker mange fagområder",
        groups: [
          { _key: "g1", caption: "Den unge kvinnen", label: "Forebygging og rådgivning", items: ["Prevensjon", "Celleprøve", "Menstruasjonsplager"] },
          { _key: "g2", caption: "Fertile år", label: "Fertilitet og graviditet", items: ["Fertilitetssjekk", "IVF", "Tidlig svangerskap"] },
          { _key: "g3", caption: "Overgang", label: "Hormonelle endringer", items: ["Overgangsalder", "Hormonbehandling", "Søvn og humør"] },
        ],
      },
      sharedStats("Tall som forplikter", [
        { value: "50 000", label: "Konsultasjoner i året" },
        { value: "15+", label: "Spesialiteter samlet" },
        { value: "4", label: "Klinikker i Norge" },
        { value: "98%", label: "Pasienttilfredshet" },
      ]),
      {
        _type: "sectionJourney",
        _key: "journey",
        heading: "Din vei gjennom Kvinnehelse",
        steps: [
          { _key: "j1", icon: "heart", label: "Steg 01", title: "Kartlegging", body: "Vi starter med å forstå hele bildet." },
          { _key: "j2", icon: "users", label: "Steg 02", title: "Tverrfaglig team", body: "Vi setter sammen riktig kompetanse." },
          { _key: "j3", icon: "stethoscope", label: "Steg 03", title: "Behandling", body: "Skreddersydd plan i ditt tempo." },
          { _key: "j4", icon: "calendar", label: "Steg 04", title: "Langsiktig oppfølging", body: "Vi følger deg gjennom livsfasene." },
        ],
      },
      {
        _type: "sectionBenefits",
        _key: "benefits",
        heading: "Hvorfor velge oss",
        items: [
          "Smal spesialisering – bred tilgang",
          "Alt under samme tak",
          "Korte ventetider",
          "Tydelig pasientforløp",
        ],
      },
      {
        _type: "sectionQuote",
        _key: "quote",
        quote: "Jeg har endelig følt meg tatt på alvor. De så hele meg – ikke bare diagnosen.",
        source: "Pasient, 45 år",
      },
      {
        _type: "sectionAccordionContent",
        _key: "accordion",
        heading: "Praktisk informasjon",
        items: [
          { _key: "a1", heading: "Trenger jeg henvisning?", content: "Nei – du bestiller time direkte." },
          { _key: "a2", heading: "Dekker forsikring?", content: "De fleste helseforsikringer dekker våre tjenester." },
          { _key: "a3", heading: "Kan jeg bytte spesialist?", content: "Ja – vi finner riktig person for deg." },
        ],
      },
      {
        _type: "sectionRichText",
        _key: "rich-2",
        heading: "Hva betyr dette for deg",
        body:
          "Du får én inngang til hele kvinnehelse-tilbudet vårt. Du slipper å koordinere selv mellom fastlege, gynekolog og spesialister – vi tar regien sammen med deg.",
      },
      {
        _type: "sectionServicesList",
        _key: "services",
        heading: "Utvalgte behandlinger",
        manualItems: [
          { label: "Gynekologisk undersøkelse", path: "/behandlinger/gynekologi/undersokelse" },
          { label: "Fertilitetssjekk", path: "/behandlinger/fertilitet/fertilitetssjekk" },
          { label: "Overgangsalder", path: "/behandlinger/gynekologi/overgangsalder" },
          { label: "Urinlekkasje", path: "/behandlinger/gynekologi/urinlekkasje" },
        ],
      },
      faqGyn,
      trustBadges("Hvorfor pasienter velger oss"),
      specialistsSection("Møt teamet bak Kvinnehelse"),
      videoSection("Kvinnehelse i hele livet – en kort introduksjon", kvinnehelseHero),
      imageGallery("Glimt fra Kvinnehelse-tilbudet", [
        { image: kvinnehelseHero, caption: "Helhetlig oppfølging" },
        { image: gynekologiReal, caption: "Gynekologisk utredning" },
        { image: tverrfagligTeam, caption: "Tverrfaglig team" },
      ]),
      reviewsSection("Pasienthistorier"),
      priceTeaser("Priser innen kvinnehelse"),
      relatedThemes(),
      ctaSection("Ta kontroll over din kvinnehelse", "Vi er klare når du er klar. Bestill time eller snakk med oss først."),
    ],
  },

  /* ════════════════ UNDERBEHANDLING ════════════════ */
  treatment: {
    title: "Mal: Underbehandling – Fertilitetssjekk",
    description:
      "Mastermal for enkeltbehandlinger. Vist med ekte innhold fra fertilitetssjekk-behandlingen.",
    sections: [
      {
        _type: "sectionHero",
        _key: "hero",
        image: fertilitetReal,
        eyebrow: "Behandling · Fertilitet",
        heading: "Fertilitetssjekk",
        subheading:
          "En komplett kartlegging av din fruktbarhet – uten henvisning. Du får svar, kontekst og en plan for veien videre, alt i én konsultasjon.",
        ctaLabel: "Bestill fertilitetssjekk",
        ctaHref: "/booking",
      },
      {
        _type: "sectionIntro",
        _key: "intro",
        heading: "Hva er en fertilitetssjekk?",
        body:
          "En fertilitetssjekk er en grundig undersøkelse for å vurdere fruktbarhetspotensialet ditt. Vi måler hormonnivåer, ser på eggstokkene med ultralyd, og går gjennom helsehistorikken sammen med deg.",
      },
      {
        _type: "sectionBenefits",
        _key: "benefits",
        heading: "Hva inngår i sjekken",
        items: [
          "Hormonprøver (AMH, FSH, østradiol)",
          "Ultralyd av eggstokker og livmor",
          "Gjennomgang av syklus og helsehistorikk",
          "Skriftlig svar og personlig plan",
          "Tilgang til fertilitetsspesialist for oppfølging",
        ],
      },
      {
        _type: "sectionRichText",
        _key: "rich-1",
        heading: "Når er fertilitetssjekk aktuelt",
        body:
          "Sjekken passer for deg som **vurderer barn nå eller senere**, for par som har prøvd uten å lykkes, eller om du bare vil vite hvor du står. Vi anbefaler ofte sjekk fra **30-årsalderen**, men det er aldri for tidlig eller for sent å få oversikt.",
      },
      {
        _type: "sectionProcess",
        _key: "process",
        heading: "Slik foregår fertilitetssjekken",
        steps: [
          { title: "Forsamtale", description: "Vi går gjennom syklus, helse og ønsker. Tar ca 15 minutter." },
          { title: "Undersøkelse og prøver", description: "Ultralyd og blodprøver – trygt og smertefritt." },
          { title: "Svar og plan", description: "Du får tolket svar og en konkret plan – samme dag eller innen kort tid." },
        ],
      },
      {
        _type: "sectionJourney",
        _key: "journey",
        heading: "Forløpet steg for steg",
        steps: [
          { _key: "j1", icon: "calendar", label: "Steg 01", title: "Booking", body: "Velg tid – ingen henvisning." },
          { _key: "j2", icon: "stethoscope", label: "Steg 02", title: "Sjekk", body: "Hormoner og ultralyd." },
          { _key: "j3", icon: "heart", label: "Steg 03", title: "Svar", body: "Tydelig tolkning og plan." },
          { _key: "j4", icon: "users", label: "Steg 04", title: "Oppfølging", body: "Veien videre, sammen med spesialist." },
        ],
      },
      sharedStats("Trygghet i tall", [
        { value: "30 min", label: "Varighet konsultasjon" },
        { value: "1 uke", label: "Vanlig ventetid" },
        { value: "100%", label: "Direkte tilgang spesialist" },
        { value: "0", label: "Henvisning nødvendig" },
      ], "light"),
      {
        _type: "sectionAccordionContent",
        _key: "accordion",
        heading: "Vanlige spørsmål om sjekken",
        items: [
          { _key: "a1", heading: "Hvor lang tid tar det?", content: "Selve konsultasjonen tar 30–45 minutter. Blodprøvesvar er klare i løpet av få dager." },
          { _key: "a2", heading: "Hva koster det?", content: "Se prislisten vår. Mange helseforsikringer dekker fertilitetssjekk." },
          { _key: "a3", heading: "Kan partner være med?", content: "Ja – vi anbefaler det, og kan også gjøre sædanalyse samtidig." },
        ],
      },
      {
        _type: "sectionQuote",
        _key: "quote",
        quote: "Vi fikk svar samme dag, og en plan vi forsto. Det ga ro – uansett hva veien videre ble.",
        source: "Pasientpar, 34 og 36 år",
      },
      {
        _type: "sectionRichText",
        _key: "rich-2",
        heading: "Etter sjekken",
        body:
          "Du får skriftlig svar med tolkning og anbefalinger. Trenger du videre utredning eller behandling – som IVF eller hormonbehandling – kan du følges opp av samme spesialist hos oss.",
      },
      {
        _type: "sectionLinkedServices",
        _key: "linked",
        heading: "Relaterte behandlinger",
        items: [
          { label: "IVF-behandling", description: "Hele forløpet under samme tak.", path: "/behandlinger/fertilitet" },
          { label: "Sædanalyse", description: "Komplett kartlegging av mannlig fertilitet.", path: "/behandlinger/fertilitet" },
          { label: "Gynekologisk undersøkelse", description: "Helhetlig kvinnehelseundersøkelse.", path: "/behandlinger/gynekologi/undersokelse" },
        ],
      },
      faqGyn,
      trustBadges("Hva du kan stole på"),
      specialistsSection("Spesialister på fertilitet"),
      videoSection("Hva skjer under en fertilitetssjekk", fertilitetReal),
      imageGallery("Inne hos oss", [
        { image: fertilitetReal, caption: "Ultralydrom" },
        { image: clinicLounge, caption: "Venteområde" },
        { image: articleFert, caption: "Trygge samtaler" },
      ]),
      reviewsSection("Andre par sine erfaringer"),
      priceTeaser("Pris på fertilitetssjekk"),
      relatedThemes("Andre tema som kan være relevante"),
      ctaSection("Bestill din fertilitetssjekk", "Få oversikt – og en plan du forstår."),
    ],
  },

  /* ════════════════ NYHETSOPPSLAG ════════════════ */
  newsItem: {
    title: "Mal: Nyhet – Ny robot på Majorstuen",
    description: "Mastermal for korte nyhetsoppslag i Aktuelt-feeden.",
    sections: [
      {
        _type: "sectionHero",
        _key: "hero",
        image: robotkirurgiHero,
        eyebrow: "Aktuelt · 18. mai 2026",
        heading: "Ny da Vinci-robot installert på Majorstuen",
        subheading:
          "Vi tar i bruk siste generasjons kirurgirobot for mer skånsom gynekologisk kirurgi – med raskere restitusjon for pasienten.",
        ctaLabel: "Les mer om robotkirurgi",
        ctaHref: "/behandlinger/gynekologi/robotkirurgi",
      },
      {
        _type: "sectionIntro",
        _key: "intro",
        heading: "Et stort steg for kvinnehelse",
        body:
          "Den nye roboten gir kirurgen presisjon ned på millimeternivå og gjør komplekse inngrep mulig gjennom små åpninger. For pasientene betyr det mindre smerter, kortere sykehusopphold og raskere retur til hverdagen.",
      },
      {
        _type: "sectionRichText",
        _key: "rich-1",
        heading: "Bakgrunn",
        body:
          "Robotassistert kirurgi er allerede standard ved store offentlige sykehus. Med vår nye installasjon er CMedical den **første private aktøren i Norge** som tilbyr da Vinci innen gynekologisk kirurgi i full skala.",
      },
      {
        _type: "sectionQuote",
        _key: "quote",
        quote: "Dette er det største løftet for våre kirurgiske pasienter på mange år.",
        source: "Sjefskirurg, CMedical Majorstuen",
      },
      {
        _type: "sectionBenefits",
        _key: "benefits",
        heading: "Hva betyr det for pasientene",
        items: [
          "Mindre arr og blødninger",
          "Raskere restitusjon – ofte hjem samme dag",
          "Høyere presisjon ved komplekse inngrep",
          "Mulighet for inngrep som tidligere krevde åpen kirurgi",
        ],
      },
      sharedStats("Robotkirurgi i tall", [
        { value: "3x", label: "Raskere restitusjon" },
        { value: "<1 cm", label: "Snittstørrelse" },
        { value: "98%", label: "Pasienttilfredshet" },
        { value: "200+", label: "Inngrep første år" },
      ], "light"),
      {
        _type: "sectionLinkedServices",
        _key: "linked",
        heading: "Les mer",
        items: [
          { label: "Robotassistert kirurgi", description: "Hva det er og hvem det passer for.", path: "/behandlinger/gynekologi/robotkirurgi" },
          { label: "Gynekologisk kirurgi", description: "Vårt fulle kirurgiske tilbud.", path: "/behandlinger/gynekologi/kirurgi" },
        ],
      },
      trustBadges("Trygg kirurgi i Norge"),
      specialistsSection("Kirurgene bak roboten"),
      videoSection("Slik fungerer da Vinci-roboten", robotkirurgiHero),
      imageGallery("Glimt fra operasjonsstuen", [
        { image: robotkirurgiHero, caption: "Den nye roboten" },
        { image: clinicLounge, caption: "Klinikken" },
        { image: gynekologiReal, caption: "Forberedelser" },
      ]),
      reviewsSection("Pasienter etter robotinngrep"),
      priceTeaser("Priser robotassistert kirurgi"),
      relatedThemes("Andre temaer i nyhetsstrømmen"),
      ctaSection("Ønsker du en vurdering?", "Bestill konsultasjon med en av våre kirurger."),
    ],
  },

  /* ════════════════ FAGARTIKKEL ════════════════ */
  article: {
    title: "Mal: Fagartikkel – Overgangsalder",
    description:
      "Mastermal for lengre redaksjonelle artikler med ingress, fagstoff, sitater og SEO. Mer innholdsrik enn forsiden.",
    sections: [
      {
        _type: "sectionHero",
        _key: "hero",
        image: articleGyn,
        eyebrow: "Fagartikkel · Hormoner · 8 min lesetid",
        heading: "Overgangsalder: alt du burde fått vite for 10 år siden",
        subheading:
          "Skrevet av spesialist i gynekologi. Oppdatert mai 2026.",
        ctaLabel: "Bestill hormonkonsultasjon",
        ctaHref: "/behandlinger/gynekologi/overgangsalder",
      },
      {
        _type: "sectionIntro",
        _key: "intro",
        heading: "Forfatterens ingress",
        body:
          "Overgangsalder er ikke en sykdom – men for mange er symptomene så omfattende at hverdagen blir snudd på hodet. Denne artikkelen gir deg en grundig innføring i hva som skjer i kroppen, hvilke behandlinger som finnes, og hvordan du tar gode valg for de neste 30 årene.",
      },
      {
        _type: "sectionRichText",
        _key: "rich-1",
        heading: "Hva skjer egentlig i kroppen",
        body:
          "Overgangsalder defineres som **12 måneder uten menstruasjon**, og inntreffer typisk mellom 45 og 55 år. Eggstokkene produserer mindre østrogen og progesteron, og det påvirker langt mer enn syklus: søvn, humør, hud, bein, hjerte og kognisjon.",
      },
      {
        _type: "sectionQuote",
        _key: "quote",
        quote: "Overgangsalder rammer halvparten av befolkningen – likevel får mange diagnosen 'stress' før de får riktig hjelp.",
        source: "Spesialist i gynekologi",
      },
      {
        _type: "sectionBenefits",
        _key: "benefits",
        heading: "De vanligste symptomene",
        items: [
          "Hetetokter og nattesvette",
          "Søvnvansker og tretthet",
          "Humørsvingninger og angst",
          "Vaginal tørrhet og smerter ved samleie",
          "Konsentrasjonsvansker (\"brain fog\")",
          "Leddsmerter og redusert muskelmasse",
        ],
      },
      {
        _type: "sectionRichText",
        _key: "rich-2",
        heading: "Hva forskningen sier om hormonbehandling",
        body:
          "Etter mange år med skepsis viser nyere studier at **moderne hormonbehandling (MHT)** er trygt og effektivt for de fleste, særlig når den startes innen 10 år etter siste menstruasjon. Vi går gjennom hovedfunnene og hva de betyr i praksis.\n\nLes også vår [pasientguide](/guide) for praktiske råd.",
      },
      {
        _type: "sectionProcess",
        _key: "process",
        heading: "Slik utredes du hos oss",
        steps: [
          { title: "Forsamtale", description: "Vi går gjennom symptomer, helsehistorikk og forventninger." },
          { title: "Blodprøver og undersøkelse", description: "Hormonstatus og generell helsesjekk." },
          { title: "Behandlingsplan", description: "Skreddersydd plan – med eller uten hormoner – og oppfølging." },
        ],
      },
      {
        _type: "sectionAccordionContent",
        _key: "accordion",
        heading: "Vanlige spørsmål",
        items: [
          { _key: "a1", heading: "Er hormonbehandling farlig?", content: "For de fleste friske kvinner er moderne MHT trygt. Risikoen vurderes individuelt." },
          { _key: "a2", heading: "Hvor lenge bør jeg bruke hormoner?", content: "Det varierer. Mange bruker MHT i 5–10 år, men det finnes ingen fast grense." },
          { _key: "a3", heading: "Hva med naturlige alternativer?", content: "Livsstil, kosthold og søvn hjelper. Naturmidler har varierende dokumentasjon – vi går gjennom det sammen." },
        ],
      },
      sharedStats("Overgangsalder i tall", [
        { value: "51", label: "Snittalder for menopause" },
        { value: "80%", label: "Får hetetokter" },
        { value: "30 år", label: "Kvinner lever etter overgang" },
        { value: "1 av 4", label: "Får alvorlige plager" },
      ], "light"),
      {
        _type: "sectionRichText",
        _key: "rich-3",
        heading: "Praktiske råd for hverdagen",
        body:
          "Start med å **kartlegge symptomene** dine i 4 uker. Prioriter søvn, styrketrening 2–3 ganger i uka, og spis nok protein. Snakk med en spesialist før du eventuelt prøver kosttilskudd eller naturmidler.",
      },
      {
        _type: "sectionLinkedServices",
        _key: "linked",
        heading: "Relaterte tjenester",
        items: [
          { label: "Overgangsalder-konsultasjon", description: "Hormonell utredning og behandling.", path: "/behandlinger/gynekologi/overgangsalder" },
          { label: "Gynekologisk undersøkelse", description: "Helhetlig sjekk hos spesialist.", path: "/behandlinger/gynekologi/undersokelse" },
          { label: "Vaginal tørrhet", description: "Behandling og lokal hormonterapi.", path: "/behandlinger/gynekologi/vaginal-torrhet" },
        ],
      },
      faqGyn,
      {
        _type: "sectionQuote",
        _key: "quote-2",
        quote: "God informasjon er halve behandlingen. Når pasienten forstår, blir oppfølgingen tryggere.",
        source: "Spesialist hos CMedical",
      },
      trustBadges("Faglig forankring"),
      specialistsSection("Forfatter og fagpanel"),
      videoSection("Spesialisten forklarer overgangsalder på 3 minutter", articleGyn),
      imageGallery("Bilder fra artikkelen", [
        { image: articleGyn, caption: "Konsultasjon" },
        { image: articleSexolog, caption: "Sex og samliv i overgangen" },
        { image: kvinnehelseHero, caption: "Helhetlig oppfølging" },
      ]),
      reviewsSection("Lesere som har vært hos oss"),
      priceTeaser("Konsultasjon og oppfølging"),
      relatedThemes("Lignende fagartikler og tema"),
      ctaSection("Trenger du å snakke med noen?", "Bestill en konsultasjon med en av våre gynekologer som spesialiserer seg på overgangsalder."),
    ],
  },
};

export default function MalDemo() {
  const { key = "" } = useParams();
  const mal = TEMPLATES[key];

  if (!mal) return <Navigate to="/godkjenning" replace />;

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Mal-banner */}
      <div className="bg-brand-dark text-brand-light">
        <div className="container mx-auto px-6 md:px-16 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-light">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-light/10 text-xs uppercase tracking-wide">
              Mastermal
            </span>
            <span className="hidden sm:inline">{mal.title}</span>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link to="/godkjenning" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Til godkjenning
            </Link>
          </Button>
        </div>
      </div>

      {/* Intro */}
      <header className="container mx-auto px-6 md:px-16 pt-12 pb-4 max-w-3xl">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Komplett mal med ekte innhold og bilder
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">{mal.title}</h1>
        <p className="text-muted-foreground font-light">{mal.description}</p>
      </header>

      <SectionRenderer sections={mal.sections} />

      {/* Footer-CTA tilbake til godkjenning */}
      <div className="border-t border-border bg-background">
        <div className="container mx-auto px-6 md:px-16 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-light text-muted-foreground">Ferdig med å se gjennom?</p>
            <p className="text-foreground font-normal">Gå tilbake og godkjenn eller be om endringer.</p>
          </div>
          <Button asChild>
            <Link to="/godkjenning">Til godkjenning</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
