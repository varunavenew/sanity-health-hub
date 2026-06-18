// Static price list — shared between /priser page and treatment hero CTA.
// All prices are guideline "fra"-prices; final price may vary based on time, weekend, etc.

export interface PriceItem {
  name: string;
  price: string;
  duration: string;
  /** Extra explanatory text shown via an "i" info popover on /priser. */
  info?: string;
}

export interface PriceSubcategory {
  label: string;
  path: string;
  items: PriceItem[];
}

export interface PriceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: PriceSubcategory[];
}

import { serviceCategories } from "./serviceCategories";

const rawPriceCategories: PriceCategory[] = [
  {
    id: 'gynekologi',
    label: 'Gynekologi',
    path: '/gynekologi',
    subcategories: [
      {
        label: 'Konsultasjoner',
        path: '/behandlinger/gynekologi/undersokelse',
        items: [
          { name: "Konsultasjon 30 minutter", price: "fra 2.100,-", duration: "30 min" },
        ]
      },
      {
        label: 'Operasjoner og inngrep',
        path: '/behandlinger/gynekologi/operasjoner',
        items: [
          { name: "TVT operasjon", price: "fra 46.000,-", duration: "" },
          { name: "Fremfallsoperasjon", price: "fra 44.000,-", duration: "" },
          { name: "Konisering", price: "fra 9.930,-", duration: "" },
          { name: "Botox blære", price: "fra 16.000,-", duration: "" },
          { name: "Labiaplastikk", price: "fra 40.000,-", duration: "" },
        ]
      },
    ]
  },
  {
    id: 'urologi',
    label: 'Urologi',
    path: '/urologi',
    subcategories: [
      {
        label: 'Konsultasjoner',
        path: '/behandlinger/urologi/konsultasjon',
        items: [
          { name: "Konsultasjon 30 min", price: "fra 1.900,-", duration: "30 min" },
          { name: "Konsultasjon 60 minutter", price: "fra 2.600,-", duration: "60 min" },
        ]
      },
      {
        label: 'Inngrep',
        path: '/behandlinger/urologi/inngrep',
        items: [
          { name: "Fimose (trang forhud)", price: "fra 9.100,-", duration: "" },
          { name: "Sterilisering (inkl. sædanalyse etter 3 mnd)", price: "6.500,-", duration: "" },
          { name: "Sædanalyse (ikke infertilitetsutredning)", price: "800,-", duration: "" },
          { name: "Refertilisering", price: "fra 35.000,-", duration: "" },
        ]
      },
      {
        label: 'Robotkirurgi og prostata',
        path: '/behandlinger/urologi/robotkirurgi',
        items: [
          { name: "RALP (robotkirurgi prostatakreft)", price: "fra 178.500,-", duration: "" },
          { name: "RASP (robotkirurgi godartet prostataforstørrelse)", price: "fra 178.500,-", duration: "" },
          { name: "TUR-P (inklusiv overnatting)", price: "fra 75.000,-", duration: "" },
          { name: "Core Therm (mikrobølge varmebehandling)", price: "fra 49.300,-", duration: "" },
        ]
      },
    ]
  },
  {
    id: 'fertilitet',
    label: 'Fertilitet',
    path: '/fertilitet',
    subcategories: [
      {
        label: 'Fertilitetsutredning',
        path: '/behandlinger/fertilitet/fertilitet-infertilitet',
        items: [
          { name: "Fertilitetsutredning og rådgivning inkl. ultralyd", price: "2.850,-", duration: "" },
          { name: "Gynekologisk undersøkelse inkl. ultralyd", price: "2.100,-", duration: "" },
          { name: "Oppfølgingssamtale med gynekolog etter forsøk/utredning", price: "2.100,-", duration: "" },
          { name: "Telefon-/webkonsultasjon med gynekolog", price: "2.100,-", duration: "" },
          { name: "Undersøkelse av livmorhulen (SIS)", price: "2.500,-", duration: "" },
          { name: "Undersøkelse av eggledere (SIS + HyCoSy)", price: "3.600,-", duration: "" },
          { name: "Lavdose hormonbehandling for stimulering av eggløsning", price: "2.100,- per ultralyd", duration: "" },
        ]
      },
      {
        label: 'Assistert befruktning',
        path: '/behandlinger/fertilitet/ivf',
        items: [
          { name: "IVF 1 forsøk", price: "46.000,-", duration: "", info: "Inkluderer alle relevante ultralydundersøkelser, embryodyrkning til blastocyst i embryoscop og første graviditetsultralyd. Dersom ikke befruktning og/eller ingen tilbakesetting av embryo er prisen som en IVF-behandling. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen." },
          { name: "IVF-pakke 3 forsøk, under 39 år", price: "92.000,-", duration: "", info: "Betaling må skje før første behandling igangsettes. Forventet normal eggstokkrespons ved igangsetting. Inkluderer inntil 3 egguthentingsforsøk, alle relevante ultralydundersøkelser og embryodyrkning i embryoscop. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen." },
          { name: "IVF-pakke 3 forsøk, 39–41 år", price: "115.000,-", duration: "", info: "Betaling må skje før første behandling igangsettes, og kvinnen skal ikke være over 41 år. Forventet normal eggstokkrespons ved igangsetting. Inkluderer inntil 3 egguthentingsforsøk, alle relevante ultralydundersøkelser og embryodyrkning i embryoscop. ICSI (mikroinjeksjon), nedfrysing av blastocyst og TESA/PESA inngår ikke i pakkeavtalen." },
          { name: "ICSI (mikroinjeksjon)", price: "5.000,-", duration: "" },
          { name: "Nedfrysning av befruktet egg/blastocyst", price: "4.500,-", duration: "" },
          { name: "Avbrutt behandling (IVF/ICSI) før egguthenting", price: "7.000,-", duration: "" },
          { name: "Årlig avgift oppbevaring sæd/egg/blastocyster", price: "3.000,-", duration: "" },
        ]
      },
      {
        label: 'Frysebehandlinger (assistert befruktning)',
        path: '/behandlinger/fertilitet/frys',
        items: [
          { name: "Fryseforsøk (FET)", price: "17.500,-", duration: "", info: "Inkluderer prebehandling, undersøkelse, monitorering med ultralyd før tilbakesetting og første svangerskapskontroll." },
          { name: "Avbrutt behandling før fryseforsøk", price: "4.000,-", duration: "" },
          { name: "Nedfrysning av eggceller uten medisinsk indikasjon", price: "30.500,-", duration: "", info: "Inkluderer monitorering med ultralyd under stimulering, egguthenting og nedfrysing av egg, samt ett års lagring fra frysedato." },
          { name: "Tilbakesetting embryo etter opptining egg og befruktning", price: "32.000,-", duration: "", info: "Tilbakesetting med partnerens sædceller eller donorsæd. Kostnad for donorsperm, mva. og transport kommer i tillegg." },
          { name: "Årlig avgift oppbevaring sæd/egg/blastocyster", price: "3.000,-", duration: "" },
        ]
      },
      {
        label: 'Inseminasjon',
        path: '/behandlinger/fertilitet/inseminasjon',
        items: [
          { name: "Inseminasjon med donorsæd (AID)", price: "12.600,-", duration: "" },
          { name: "Inseminasjon med partnersæd (AIH)", price: "12.600,-", duration: "" },
          { name: "Pakkeprisavtale inseminasjon 3 behandlinger", price: "26.000,-", duration: "" },
          { name: "Avbrutt behandling inseminasjon", price: "4.000,-", duration: "" },
        ]
      },
      {
        label: 'Sædanalyse og mannlig infertilitet',
        path: '/behandlinger/fertilitet/saedanalyse',
        items: [
          { name: "Enkel sædanalyse", price: "1.950,-", duration: "", info: "Det anbefales å ha en ejakulasjon 2–5 dager før sædprøven leveres for optimal enkel sædanalyse. Prøven kan medbringes hjemmefra og må leveres CMedical innen 60 min. Prøven må oppbevares kroppstemperert underveis." },
          { name: "Utvidet sædanalyse", price: "5.500,-", duration: "", info: "Det anbefales å ha en ejakulasjon 1–2 dager før sædprøven leveres for optimal utvidet sædanalyse. Prøven må tas på CMedical og timen må bookes i tidsperioden kl 09:00–12:00." },
          { name: "Sædanalyse etter vasektomi", price: "2.200,-", duration: "", info: "Denne undersøkelsen er inkludert ved vasektomi på CMedical." },
          { name: "Nedfrysning av sædceller", price: "4.500,-", duration: "" },
          { name: "PESA/TESA (spermieuthenting)", price: "5.000,-", duration: "" },
          { name: "MicroTESE (inkl. narkose)", price: "37.000,-", duration: "" },
          { name: "Årlig avgift oppbevaring sæd/egg/blastocyster", price: "3.000,-", duration: "" },
        ]
      },
      {
        label: 'Donorbehandling',
        path: '/behandlinger/fertilitet/donor',
        items: [
          { name: "Partnerdonasjon", price: "45.000,-", duration: "" },
          { name: "Eggdonasjon (inkl. tilbakesetting av én blastocyst)", price: "97.000,-", duration: "", info: "Beløpet splittes i to innbetalinger: 51.000,- ved oppstart av behandling og 46.000,- ved nedfrysing av blastocyst." },
          { name: "Nedfrysing av sæd til eggdonasjon", price: "5.000,-", duration: "" },
          { name: "Nedfrysning av befruktet egg/blastocyst", price: "4.500,-", duration: "" },
          { name: "Tilbakesetting av opptint embryo eggdonasjon", price: "17.500,-", duration: "" },
          { name: "Administrasjonskostnad bestilling donoregg", price: "2.150,-", duration: "" },
          { name: "Administrasjonskostnad bestilling donorsæd", price: "2.150,-", duration: "" },
          { name: "Årlig avgift oppbevaring reserverte donorsæd", price: "3.000,-", duration: "" },
        ]
      },
      {
        label: 'Nedfrysing og oppbevaring av egne egg',
        path: '/behandlinger/fertilitet/eggfrysing',
        items: [
          { name: "Konsultasjon/utredning", price: "2.850,-", duration: "" },
          { name: "Nedfrysning av eggceller uten medisinsk indikasjon", price: "30.500,-", duration: "", info: "Inkluderer monitorering med ultralyd under stimulering, egguthenting og nedfrysing av egg, samt ett års lagring fra frysedato." },
          { name: "Tilbakesetting embryo etter opptining og befruktning", price: "32.000,-", duration: "", info: "Tilbakesetting med partnerens sædceller eller donorsæd. Kostnad for donorsperm, mva. og transport kommer i tillegg." },
          { name: "Nedfrysning av befruktet egg/blastocyst", price: "4.500,-", duration: "" },
          { name: "Årlig avgift oppbevaring sæd/egg/blastocyster", price: "3.000,-", duration: "" },
        ]
      },
      {
        label: 'Øvrige tjenester',
        path: '/behandlinger/fertilitet/ovrige',
        items: [
          { name: "Graviditetskontroll etter assistert befruktning", price: "2.100,-", duration: "", info: "Inkludert i IVF/ICSI-behandling. Pris gjelder ved øvrige behandlinger." },
          { name: "Office-hysteroskopi", price: "9.500,-", duration: "" },
          { name: "Tester på livmorslimhinne (ERA/ALICE/EMMA)", price: "fra 13.500,-", duration: "" },
          { name: "Administrasjonsgebyr flytting embryo/sæd/egg", price: "5.000,-", duration: "" },
          { name: "Resept", price: "500,-", duration: "" },
          { name: "Blodprøver tatt hos CMedical", price: "250,-", duration: "" },
          { name: "Henvisning offentlig sykehus", price: "900,-", duration: "" },
          { name: "Administrasjonsgebyr", price: "300,-", duration: "" },
          { name: "Ikke møtt til fertilitetsutredning (avbest. min 24t før)", price: "2.850,-", duration: "" },
          { name: "Ikke møtt til ultralydkontroll/sædanalyse (avbest. min 24t før)", price: "1.950,-", duration: "" },
        ]
      },
    ]
  },
  {
    id: 'ortopedi',
    label: 'Ortopedi',
    path: '/ortopedi',
    subcategories: [
      {
        label: 'Konsultasjoner',
        path: '/behandlinger/ortopedi/konsultasjon',
        items: [
          { name: "Konsultasjon ortoped skulder", price: "1.800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped kne", price: "1.800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped hofte", price: "1.800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped fot/ankel", price: "1.800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped hånd", price: "1.800,-", duration: "30 min" },
          { name: "Konsultasjon ortoped albue", price: "1.800,-", duration: "30 min" },
          { name: "Second opinion konsultasjon", price: "fra 2.800,-", duration: "" },
        ]
      },
      {
        label: 'Håndterapi',
        path: '/behandlinger/ortopedi/hand-albue',
        items: [
          { name: "Konsultasjon håndterapeut", price: "1.400,-", duration: "60 min" },
        ]
      },
      {
        label: 'Fysioterapi',
        path: '/behandlinger/ortopedi/fysioterapi',
        items: [
          { name: "Oppfølgingstime Fysioterapeut / Osteopat 60 min", price: "1.800,-", duration: "1 time" },
          { name: "Oppfølgingstime Fysioterapeut / Osteopat 30 min", price: "950,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'endokrinologi',
    label: 'Endokrinologi',
    path: '/behandlinger/flere-fagomrader/endokrinologi',
    subcategories: [
      {
        label: 'Endokrinologi',
        path: '/behandlinger/flere-fagomrader/endokrinologi',
        items: [
          { name: "Endokrinolog 60 min konsultasjon", price: "4.500,-", duration: "1 time" },
          { name: "Endokrinolog oppfølging/kontroll 30 min", price: "2.900,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'gastrokirurgi',
    label: 'Gastrokirurgi',
    path: '/behandlinger/flere-fagomrader/gastrokirurgi',
    subcategories: [
      {
        label: 'Gastrokirurgi',
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
        items: [
          { name: "Førstegangskonsultasjon fedme vurdering", price: "Gratis", duration: "45 min" },
          { name: "Konsultasjon 30 min (kun samtale)", price: "2.100,-", duration: "30 min" },
          { name: "Anorektoskopi inkl. konsultasjon", price: "fra 4.700,-", duration: "" },
          { name: "Tillegg strikkbehandling (endetarmsundersøkelse)", price: "1.500,-", duration: "" },
          { name: "Mariskfjerning i lokal", price: "fra 7.200,-", duration: "" },
          { name: "Botox for analfissur", price: "5.200,-", duration: "" },
          { name: "Småkirurgi i lokal (fettkul, føflekk)", price: "fra 5.000,-", duration: "" },
          { name: "Inngrodd tånegl", price: "fra 5.500,-", duration: "" },
          { name: "Hemorideoperasjon", price: "fra 28.000,-", duration: "" },
          { name: "Lyskebrokk kikkhullsoperasjon", price: "fra 40.000,-", duration: "" },
          { name: "Navlebrokk kikkhullsoperasjon", price: "fra 46.860,-", duration: "" },
        ]
      },
    ]
  },
  {
    id: 'psykologi',
    label: 'Psykologi',
    path: '/behandlinger/flere-fagomrader/psykologi',
    subcategories: [
      {
        label: 'Psykologi',
        path: '/behandlinger/flere-fagomrader/psykologi',
        items: [
          { name: "Psykolog 50 min", price: "1.900,-", duration: "1 time" },
          { name: "Psykolog 50 min, digitaltime", price: "1.900,-", duration: "1 time" },
          { name: "Psykolog 80 min", price: "2.500,-", duration: "1 time 30 min" },
          { name: "Psykolog 80 min, digitaltime", price: "2.500,-", duration: "1 time 30 min" },
          { name: "Psykolog partime 50 min", price: "2.300,-", duration: "1 time" },
          { name: "Psykolog partime 80 min", price: "2.950,-", duration: "1 time 30 min" },
        ]
      },
    ]
  },
  {
    id: 'sexologi',
    label: 'Sexologi',
    path: '/behandlinger/flere-fagomrader/sexologi',
    subcategories: [
      {
        label: 'Sexologi',
        path: '/behandlinger/flere-fagomrader/sexologi',
        items: [
          { name: "Sexolog individuell", price: "1.750,-", duration: "1 time" },
          { name: "Sexolog for par", price: "1.850,-", duration: "1 time" },
        ]
      },
    ]
  },
  {
    id: 'revmatologi',
    label: 'Revmatologi',
    path: '/behandlinger/flere-fagomrader/revmatologi',
    subcategories: [
      {
        label: 'Revmatologi',
        path: '/behandlinger/flere-fagomrader/revmatologi',
        items: [
          { name: "Førstegangskonsultasjon revmatolog", price: "3.150,-", duration: "45 min" },
        ]
      },
    ]
  },
  {
    id: 'ernaering',
    label: 'Ernæringsfysiolog',
    path: '/behandlinger/flere-fagomrader/ernaeringsfysiolog',
    subcategories: [
      {
        label: 'Ernæringsfysiolog',
        path: '/behandlinger/flere-fagomrader/ernaeringsfysiolog',
        items: [
          { name: "Klinisk ernæringsfysiolog", price: "1.990,-", duration: "1 time" },
          { name: "Klinisk ernæringsfysiolog oppfølging", price: "1.490,-", duration: "45 min" },
        ]
      },
    ]
  },
  {
    id: 'aareknuter',
    label: 'Åreknutebehandling',
    path: '/behandlinger/flere-fagomrader/areknutebehandling',
    subcategories: [
      {
        label: 'Åreknutebehandling',
        path: '/behandlinger/flere-fagomrader/areknutebehandling',
        items: [
          { name: "Konsultasjon 30 min", price: "1.400,-", duration: "30 min" },
          { name: "Åreknuteoperasjon (laser/radiofrekvens – ett ben)", price: "fra 20.900,-", duration: "" },
          { name: "Flebektomi/extripasjon – ett ben", price: "11.000,-", duration: "" },
        ]
      },
    ]
  },
  {
    id: 'graviditet',
    label: 'Graviditet og fostermedisin',
    path: '/behandlinger/graviditet',
    subcategories: [
      {
        label: 'Svangerskapskontroll',
        path: '/behandlinger/graviditet/svangerskapskontroll',
        items: [
          { name: "Svangerskapskontroll", price: "2.150,-", duration: "30 min" },
          { name: "Tidlig ultralyd enkel", price: "2.150,-", duration: "30 min" },
          { name: "Kontroll etter fødsel", price: "2.100,-", duration: "30 min" },
        ]
      },
      {
        label: 'Fosterdiagnostikk',
        path: '/behandlinger/graviditet/fosterdiagnostikk',
        items: [
          { name: "Tidlig ultralyd + NIPT-test", price: "8.990,-", duration: "30 min" },
          { name: "Organrettet ultralyd + NIPT test (uke 12-14)", price: "9.950,-", duration: "30 min" },
          { name: "Organrettet ultralyd", price: "2.100,-", duration: "30 min" },
        ]
      },
      {
        label: 'Fødselsforberedelse og oppfølging',
        path: '/behandlinger/graviditet/fodselsforberedelse',
        items: [
          { name: "Fødselsforberedende samtale", price: "3.200,-", duration: "45 min" },
          { name: "Konsultasjon etter abort eller dødfødsel", price: "3.200,-", duration: "45 min" },
          { name: "Konsultasjon fødselsangst", price: "3.200,-", duration: "45 min" },
          { name: "Konsultasjon traumatisk fødsel", price: "3.200,-", duration: "45 min" },
          { name: "Ammehjelp ved brystbetennelse", price: "3.200,-", duration: "45 min" },
        ]
      },
    ]
  },
  {
    id: 'hudlege',
    label: 'Hudlege',
    path: '/behandlinger/flere-fagomrader/hudlege',
    subcategories: [
      {
        label: 'Konsultasjon',
        path: '/behandlinger/flere-fagomrader/hudlege',
        items: [
          { name: "Konsultasjon hudlege", price: "2.100,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'hudhelse',
    label: 'Hudhelse',
    path: '/behandlinger/flere-fagomrader/hudhelse',
    subcategories: [
      {
        label: 'Konsultasjon',
        path: '/behandlinger/flere-fagomrader/hudhelse',
        items: [
          { name: "Konsultasjon hudlege (vurdering før behandling)", price: "fra 2.100,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'osteopati',
    label: 'Osteopati',
    path: '/behandlinger/flere-fagomrader/osteopati',
    subcategories: [
      {
        label: 'Osteopati',
        path: '/behandlinger/flere-fagomrader/osteopati',
        items: [
          { name: "Osteopat førstekonsultasjon 60 min", price: "1.800,-", duration: "1 time" },
          { name: "Osteopat oppfølging 60 min", price: "1.800,-", duration: "1 time" },
          { name: "Osteopat oppfølging 30 min", price: "950,-", duration: "30 min" },
        ]
      },
    ]
  },
  {
    id: 'overvektskirurgi',
    label: 'Overvektskirurgi',
    path: '/behandlinger/flere-fagomrader/overvektskirurgi',
    subcategories: [
      {
        label: 'Overvektskirurgi',
        path: '/behandlinger/flere-fagomrader/overvektskirurgi',
        items: [
          { name: "Digital konsultasjon fedme vurdering", price: "0,-", duration: "45 min" },
          { name: "Gastric sleeve", price: "Ta kontakt", duration: "" },
          { name: "Gastric bypass", price: "Ta kontakt", duration: "" },
        ]
      },
    ]
  },
];

// Auto-enrich "Flere tjenester" categories so they share the same accordion-in-accordion
// layout as fertilitet. Each sub-treatment from serviceCategories becomes its own
// expandable subgroup with a "Les mer" entry that links to its landing page.
const FLERE = serviceCategories.find((c) => c.id === "flere-fagomrader");

const enrichFlereCategory = (cat: PriceCategory): PriceCategory => {
  if (!FLERE) return cat;
  const match = FLERE.subcategories.find(
    (s) => s.label.toLowerCase() === cat.label.toLowerCase(),
  );
  if (!match?.items?.length) return cat;

  const consultItems = cat.subcategories.flatMap((s) => s.items);
  const consultPath = cat.subcategories[0]?.path ?? cat.path;
  const consultSub: PriceSubcategory | null =
    consultItems.length > 0
      ? { label: "Konsultasjon og priser", path: consultPath, items: consultItems }
      : null;

  const itemSubs: PriceSubcategory[] = match.items.map((it) => ({
    label: it.label,
    path: it.path ?? cat.path,
    items: [
      {
        name: it.label,
        price: "Pris ved konsultasjon",
        duration: "",
      },
    ],
  }));

  return {
    ...cat,
    subcategories: consultSub ? [consultSub, ...itemSubs] : itemSubs,
  };
};

export const priceCategories: PriceCategory[] = rawPriceCategories.map(enrichFlereCategory);

/** Parse "fra 20.900,-" or "1.800,-" → 20900. Returns null for "Gratis"/"Ta kontakt"/etc. */
const parsePrice = (s: string): number | null => {
  const digits = s.replace(/fra\s*/i, "").replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const formatNok = (n: number): string => n.toLocaleString("nb-NO").replace(/\u00A0/g, ".").replace(/\s/g, ".");

const formatFromPrice = (n: number): string => `Pris fra ${formatNok(n)} kr`;

const normalize = (s: string): string =>
  s.toLowerCase()
    .replace(/ø/g, "o").replace(/æ/g, "ae").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Lowest "fra"-price for a given treatment path, formatted as "Pris fra 1.800 kr".
 * Matches priceCategories subcategories whose path equals the given path.
 * Returns null when no numeric prices are configured for the path.
 */
export const getFromPriceForPath = (path: string): string | null => {
  if (!path) return null;
  for (const cat of priceCategories) {
    for (const sub of cat.subcategories) {
      if (sub.path !== path) continue;
      const nums = sub.items.map((i) => parsePrice(i.price)).filter((n): n is number => n !== null);
      if (!nums.length) return null;
      return formatFromPrice(Math.min(...nums));
    }
  }
  return null;
};

/**
 * Lowest "fra"-price by treatment title within a category.
 * Scans all items in the matching category and returns the lowest price
 * among items whose name overlaps (substring, normalized) with the title.
 */
export const getFromPriceForTitle = (categoryId: string, title: string): string | null => {
  if (!categoryId || !title) return null;
  const cat = priceCategories.find((c) => c.id === categoryId);
  if (!cat) return null;
  const nTitle = normalize(title);
  if (!nTitle) return null;
  const titleTokens = nTitle.split(" ").filter((t) => t.length >= 4);
  const matches: number[] = [];
  for (const sub of cat.subcategories) {
    for (const item of sub.items) {
      const nName = normalize(item.name);
      const hit =
        nName.includes(nTitle) ||
        nTitle.includes(nName) ||
        (titleTokens.length > 0 && titleTokens.every((t) => nName.includes(t)));
      if (!hit) continue;
      const p = parsePrice(item.price);
      if (p !== null) matches.push(p);
    }
  }
  if (!matches.length) return null;
  return formatFromPrice(Math.min(...matches));
};

/**
 * Lowest "fra"-price across all items in a category, plus the matching item label.
 * Used on category landing hero (e.g. /fertilitet, /gynekologi, /urologi) to show
 * a small "Tjeneste / Pris fra X kr" block above the CTA.
 */
export const getCategoryEntryPrice = (
  categoryId: string,
): { label: string; price: string } | null => {
  const cat = priceCategories.find((c) => c.id === categoryId);
  if (!cat) return null;
  // Use the first subcategory (typically "Konsultasjoner") so the entry price
  // reflects an initial consultation rather than an unrelated cheap add-on
  // (e.g. sædanalyse 800,- under urologi).
  const sub = cat.subcategories[0];
  if (!sub) return null;
  let best: { label: string; n: number } | null = null;
  for (const item of sub.items) {
    const p = parsePrice(item.price);
    if (p === null) continue;
    if (!best || p < best.n) best = { label: item.name, n: p };
  }
  if (!best) return null;
  return { label: best.label, price: formatFromPrice(best.n) };
};


