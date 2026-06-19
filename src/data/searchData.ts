// Centralized search data for autocomplete suggestions

export interface SearchItem {
  label: string;
  path: string;
  category: string;
  keywords?: string[];
}

export const searchItems: SearchItem[] = [
  // Gynekologi
  { label: 'Gynekologi', path: '/behandlinger/gynekologi', category: 'Tjeneste', keywords: ['gyn', 'kvinne', 'underlivsplager'] },
  { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi/undersokelse', category: 'Gynekologi', keywords: ['undersøkelse', 'kontroll'] },
  { label: 'Urogynekologi', path: '/behandlinger/gynekologi/urogynekologi', category: 'Gynekologi', keywords: ['urogynekologi', 'fremfall', 'prolaps', 'inkontinens', 'lekkasje', 'bekkenbunn', 'urinlekkasje'] },
  { label: 'Urinlekkasje', path: '/behandlinger/gynekologi/urinlekkasje', category: 'Gynekologi', keywords: ['inkontinens', 'lekkasje'] },
  { label: 'Endometriose', path: '/behandlinger/gynekologi/endometriose', category: 'Gynekologi', keywords: ['smerter', 'underlivssmerter', 'adenomyose', 'magesmerter', 'menssmerter', 'vondt'] },
  { label: 'Overgangsalder', path: '/behandlinger/gynekologi/overgangsalder', category: 'Gynekologi', keywords: ['menopause', 'klimakteriet', 'hormoner', 'hetetokter', 'svette', 'humør'] },
  { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall', category: 'Gynekologi', keywords: ['prolaps', 'fremfall', 'tyngde', 'underliv'] },
  { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser', category: 'Gynekologi', keywords: ['blødning', 'menstruasjon', 'uregelmessig', 'kraftig', 'mens'] },
  { label: 'Celleforandringer', path: '/behandlinger/gynekologi/celleforandringer', category: 'Gynekologi', keywords: ['celleprøve', 'livmorhals', 'hpv', 'konisering', 'screening'] },
  { label: 'Cyster på eggstokkene', path: '/behandlinger/gynekologi/cyster', category: 'Gynekologi', keywords: ['cyste', 'eggstokk'] },
  { label: 'Fjerne livmor', path: '/behandlinger/gynekologi/fjerne-livmor', category: 'Gynekologi', keywords: ['hysterektomi', 'livmor'] },
  { label: 'PMS og PMDD', path: '/behandlinger/gynekologi/pms-pmdd', category: 'Gynekologi', keywords: ['premenstruell', 'humørsvingninger', 'pms'] },
  { label: 'Labiaplastikk', path: '/behandlinger/gynekologi/labiaplastikk', category: 'Gynekologi', keywords: ['labia', 'intimkirurgi', 'kjønnslepper'] },
  { label: 'Vaginal tørrhet', path: '/behandlinger/gynekologi/vaginal-torrhet', category: 'Gynekologi', keywords: ['tørrhet', 'vaginal', 'intimhelse'] },
  { label: 'Vulvalidelser', path: '/behandlinger/gynekologi/vulvalidelser', category: 'Gynekologi', keywords: ['vulva', 'vaginisme', 'vulvodyni', 'botox'] },
  { label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi/kirurgi', category: 'Gynekologi', keywords: ['operasjon', 'kirurgi'] },
  { label: 'Robotassistert kirurgi', path: '/behandlinger/gynekologi/robotkirurgi', category: 'Gynekologi', keywords: ['robot', 'da vinci'] },

  // Graviditet og fostermedisin
  { label: 'Graviditet og fostermedisin', path: '/behandlinger/graviditet', category: 'Fagområde', keywords: ['gravid', 'foster', 'svangerskap'] },
  { label: 'Ultralyd', path: '/behandlinger/graviditet/ultralyd', category: 'Graviditet', keywords: ['ultralyd', 'scanning'] },
  { label: 'NIPT', path: '/behandlinger/graviditet/nipt', category: 'Graviditet', keywords: ['nipt', 'fosterdiagnostikk', 'blodprøve'] },
  { label: '6-ukerskontroll etter fødsel', path: '/behandlinger/graviditet/6-ukerskontroll', category: 'Graviditet', keywords: ['etterkontroll', 'barsel', 'fødsel'] },
  { label: 'Traumatisk fødsel', path: '/behandlinger/graviditet/traumatisk-fodsel', category: 'Graviditet', keywords: ['fødselstrauma', 'fødsel'] },
  { label: 'Fødselsangst', path: '/behandlinger/graviditet/fodselsangst', category: 'Graviditet', keywords: ['angst', 'fødsel', 'tokofob'] },
  { label: 'For partnere', path: '/behandlinger/graviditet/for-partnere', category: 'Graviditet', keywords: ['partner', 'far', 'medforelder'] },
  { label: 'Fostermedisin', path: '/behandlinger/graviditet/fostermedisin', category: 'Graviditet', keywords: ['foster', 'fosterdiagnostikk'] },
  { label: 'Spontanabort', path: '/behandlinger/graviditet/spontanabort', category: 'Graviditet', keywords: ['abort', 'tidlig graviditet'] },

  // Urologi
  { label: 'Urologi', path: '/behandlinger/urologi', category: 'Fagområde', keywords: ['mann', 'urin', 'blære'] },
  { label: 'Blære og urinveier', path: '/behandlinger/urologi/blaere', category: 'Urologi', keywords: ['urin', 'blære', 'urinveisinfeksjon'] },
  { label: 'Forhud', path: '/behandlinger/urologi/forhud', category: 'Urologi', keywords: ['omskjæring', 'fimose'] },
  { label: 'Mannlig infertilitet', path: '/behandlinger/urologi/infertilitet', category: 'Urologi', keywords: ['barnløshet', 'sæd', 'fertilitet'] },
  { label: 'Nyrer', path: '/behandlinger/urologi/nyrer', category: 'Urologi', keywords: ['nyre', 'nyrestein', 'nyrecyster'] },
  { label: 'Prevensjon', path: '/behandlinger/urologi/prevensjon', category: 'Urologi', keywords: ['prevensjon', 'sterilisering'] },

  // Fertilitet
  { label: 'Fertilitet', path: '/behandlinger/fertilitet', category: 'Fagområde', keywords: ['barn', 'graviditet', 'befruktning', 'ivf'] },
  { label: 'Fertilitetssjekk', path: '/behandlinger/fertilitet/fertilitetssjekk', category: 'Fertilitet', keywords: ['kartlegging', 'utredning', 'amh'] },
  { label: 'IVF', path: '/behandlinger/fertilitet/ivf', category: 'Fertilitet', keywords: ['prøverør', 'assistert befruktning', 'icsi'] },
  { label: 'IUI', path: '/behandlinger/fertilitet/iui', category: 'Fertilitet', keywords: ['inseminasjon'] },
  { label: 'Nedfrysing', path: '/behandlinger/fertilitet/nedfrysing', category: 'Fertilitet', keywords: ['fryse egg', 'eggfrys', 'nedfrysning', 'sædfrys'] },
  { label: 'Eggdonasjon', path: '/behandlinger/fertilitet/eggdonasjon', category: 'Fertilitet', keywords: ['donor', 'eggdonor', 'donorbehandling'] },
  { label: 'Mannlig fertilitet', path: '/behandlinger/fertilitet/mannlig-fertilitet', category: 'Fertilitet', keywords: ['sæd', 'sædanalyse', 'mannlig infertilitet'] },
  { label: 'Psykisk helsehjelp', path: '/behandlinger/fertilitet/psykisk-helsehjelp', category: 'Fertilitet', keywords: ['psykolog', 'støtte'] },
  { label: 'PGT', path: '/behandlinger/fertilitet/pgt', category: 'Fertilitet', keywords: ['genetisk testing', 'embryo'] },

  // Ortopedi
  { label: 'Ortopedi', path: '/behandlinger/ortopedi', category: 'Fagområde', keywords: ['bein', 'skjelett', 'ledd'] },
  { label: 'Fot og ankel', path: '/behandlinger/ortopedi/fot-ankel', category: 'Ortopedi', keywords: ['fot', 'ankel', 'achilles', 'ballettankel'] },
  { label: 'Hofte', path: '/behandlinger/ortopedi/hofte', category: 'Ortopedi', keywords: ['hofte', 'artrose'] },
  { label: 'Hånd og albue', path: '/behandlinger/ortopedi/hand-albue', category: 'Ortopedi', keywords: ['hånd', 'albue', 'tennisalbue', 'carpal tunnel'] },
  { label: 'Kne', path: '/behandlinger/ortopedi/kne', category: 'Ortopedi', keywords: ['kne', 'bruskskader'] },

  // Flere fagområder
  { label: 'Flere fagområder', path: '/behandlinger/flere-fagomrader', category: 'Fagområde', keywords: ['andre', 'øvrige'] },
  { label: 'Endokrinologi', path: '/behandlinger/flere-fagomrader/endokrinologi', category: 'Andre', keywords: ['hormoner', 'skjoldbruskkjertel', 'diabetes'] },
  { label: 'Hudhelse', path: '/behandlinger/flere-fagomrader/hudhelse', category: 'Andre', keywords: ['hud', 'dermatolog', 'utslett', 'hudlege'] },
  
  { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog', category: 'Andre', keywords: ['ernæring', 'kosthold', 'diett'] },
  { label: 'Gastrokirurgi', path: '/behandlinger/flere-fagomrader/gastrokirurgi', category: 'Andre', keywords: ['mage', 'tarm', 'bariatrisk'] },
  { label: 'Overvektskirurgi', path: '/behandlinger/flere-fagomrader/overvektskirurgi', category: 'Andre', keywords: ['fedmekirurgi', 'sleeve', 'gastrektomi', 'overvekt'] },
  { label: 'Osteopati', path: '/behandlinger/flere-fagomrader/osteopati', category: 'Andre', keywords: ['manuell behandling', 'muskel'] },
  { label: 'Psykologi', path: '/behandlinger/flere-fagomrader/psykologi', category: 'Andre', keywords: ['psykolog', 'terapi', 'mental helse'] },
  { label: 'Sexologi', path: '/behandlinger/flere-fagomrader/sexologi', category: 'Andre', keywords: ['seksualitet', 'parterapi', 'intimitet'] },
  { label: 'Kvinnehelse', path: '/behandlinger/flere-fagomrader/kvinnehelse', category: 'Andre', keywords: ['kvinne', 'tverrfaglig'] },
  { label: 'Tverrfaglig team', path: '/behandlinger/flere-fagomrader/tverrfaglig', category: 'Andre', keywords: ['tverrfaglig', 'team'] },

  // Sider
  { label: 'Priser', path: '/priser', category: 'Side', keywords: ['pris', 'kostnad', 'hva koster'] },
  { label: 'Om oss', path: '/om-oss', category: 'Side', keywords: ['om', 'hvem', 'klinikk'] },
  { label: 'Kontakt', path: '/kontakt', category: 'Side', keywords: ['kontakt', 'telefon', 'epost', 'adresse'] },
  { label: 'Forsikring', path: '/forsikring', category: 'Side', keywords: ['forsikring', 'helseforsikring', 'dekning'] },
  { label: 'Bestill time', path: '/booking', category: 'Side', keywords: ['bestill', 'time', 'avtale', 'booking'] },
];

import Fuse from "fuse.js";
import { expandQuery } from "./searchSynonyms";

// Normaliser diakritikk: æ→ae, ø→o, å→a + lowercase
const normalize = (s: string): string =>
  s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Forhåndsbygd, normalisert indeks for raskere matching
type IndexedItem = SearchItem & {
  _label: string;
  _category: string;
  _keywords: string;
  _all: string;
};

const indexedItems: IndexedItem[] = searchItems.map((item) => ({
  ...item,
  _label: normalize(item.label),
  _category: normalize(item.category),
  _keywords: (item.keywords || []).map(normalize).join(" "),
  _all: normalize(
    [item.label, item.category, ...(item.keywords || [])].join(" ")
  ),
}));

// Fuse for typo-toleranse (fallback når strict ikke gir treff)
const fuse = new Fuse(indexedItems, {
  keys: [
    { name: "_label", weight: 0.6 },
    { name: "_keywords", weight: 0.3 },
    { name: "_category", weight: 0.1 },
  ],
  threshold: 0.4, // 0 = eksakt, 1 = match alt
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
});

/**
 * Google-aktig søk:
 * 1) Utvider query med synonymer (symptom → behandling)
 * 2) Tokeniserer på mellomrom (alle ord må matche – AND)
 * 3) Vekter: label-prefix > label-substring > keyword > category
 * 4) Faller tilbake til Fuse fuzzy ved typo / få treff
 */
export function searchSuggestions(query: string, limit = 8): SearchItem[] {
  const raw = query.trim();
  if (!raw) return [];

  const expanded = expandQuery(raw);
  const tokens = normalize(expanded)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  if (tokens.length === 0) return [];

  // Strict-pass: alle tokens må finnes et sted i item, med ranking
  const scored = indexedItems
    .map((item) => {
      let score = 0;
      let allMatched = true;

      for (const token of tokens) {
        let tokenScore = 0;

        if (item._label.startsWith(token)) tokenScore += 100;
        else if (item._label.includes(` ${token}`)) tokenScore += 70;
        else if (item._label.includes(token)) tokenScore += 50;

        if (item._keywords.includes(token)) tokenScore += 30;
        if (item._category.includes(token)) tokenScore += 10;

        if (tokenScore === 0) {
          // Token ikke funnet i dette item — krev minst delvis match
          if (!item._all.includes(token)) {
            allMatched = false;
            break;
          }
          tokenScore = 5;
        }

        score += tokenScore;
      }

      return { item, score, allMatched };
    })
    .filter((r) => r.allMatched && r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= 3) {
    return scored.slice(0, limit).map((r) => r.item);
  }

  // Fuzzy fallback: typo-toleranse via Fuse
  const fuzzyQuery = normalize(raw);
  const fuzzy = fuse.search(fuzzyQuery, { limit: limit * 2 });

  // Slå sammen strict + fuzzy, dedupliser på path
  const seen = new Set(scored.map((r) => r.item.path));
  const merged: SearchItem[] = scored.map((r) => r.item);

  for (const f of fuzzy) {
    if (!seen.has(f.item.path)) {
      seen.add(f.item.path);
      merged.push(f.item);
      if (merged.length >= limit) break;
    }
  }

  return merged.slice(0, limit);
}
