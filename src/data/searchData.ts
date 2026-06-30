// Centralized search data for autocomplete suggestions
// IMPORTANT: every `path` here MUST resolve to a real route in src/App.tsx
// (either a static <Route> or a dynamic :subId/:methodId handled by
// GenericSubTreatmentPage / GynekologiSubPage / FertilitetSubPage /
// GastrokirurgiMethodPage). Audited against treatmentContent.ts,
// gynekologiSubPages.tsx, fertilitetSubPages.tsx and App.tsx.

export interface SearchItem {
  label: string;
  path: string;
  category: string;
  keywords?: string[];
}

export const searchItems: SearchItem[] = [
  // ─────────────── Gynekologi ───────────────
  { label: 'Gynekologi', path: '/behandlinger/gynekologi', category: 'Fagområde', keywords: ['gyn', 'kvinne', 'kvinnehelse', 'underlivsplager'] },
  { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi/undersokelse', category: 'Gynekologi', keywords: ['undersøkelse', 'kontroll', 'årskontroll', 'gynekolog'] },
  { label: 'Urogynekologi', path: '/behandlinger/gynekologi/vaginale-fremfall', category: 'Gynekologi', keywords: ['urogynekologi', 'fremfall', 'prolaps', 'inkontinens', 'lekkasje', 'bekkenbunn', 'urinlekkasje'] },
  { label: 'Urinlekkasje', path: '/behandlinger/gynekologi/urinlekkasje', category: 'Gynekologi', keywords: ['inkontinens', 'lekkasje', 'urin', 'stressinkontinens'] },
  { label: 'Endometriose', path: '/behandlinger/gynekologi/endometriose', category: 'Gynekologi', keywords: ['smerter', 'underlivssmerter', 'adenomyose', 'magesmerter', 'menssmerter', 'vondt', 'mensen'] },
  { label: 'Overgangsalder', path: '/behandlinger/gynekologi/overgangsalder', category: 'Gynekologi', keywords: ['menopause', 'klimakteriet', 'hormoner', 'hetetokter', 'svette', 'humør', 'mht'] },
  { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall', category: 'Gynekologi', keywords: ['prolaps', 'fremfall', 'tyngde', 'underliv'] },
  { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser', category: 'Gynekologi', keywords: ['blødning', 'menstruasjon', 'uregelmessig', 'kraftig', 'mens', 'mellomblødning'] },
  { label: 'Celleforandringer', path: '/behandlinger/gynekologi/celleforandringer', category: 'Gynekologi', keywords: ['celleprøve', 'livmorhals', 'hpv', 'konisering', 'screening'] },
  { label: 'Cyster på eggstokkene', path: '/behandlinger/gynekologi/cyster', category: 'Gynekologi', keywords: ['cyste', 'eggstokk', 'klump'] },
  { label: 'Fjerne livmor', path: '/behandlinger/gynekologi/fjerne-livmor', category: 'Gynekologi', keywords: ['hysterektomi', 'livmor', 'fjerning'] },
  { label: 'PMS og PMDD', path: '/behandlinger/gynekologi/pms-pmdd', category: 'Gynekologi', keywords: ['premenstruell', 'humørsvingninger', 'pms', 'pmdd'] },
  { label: 'Hormonforstyrrelser', path: '/behandlinger/gynekologi/hormonforstyrrelser', category: 'Gynekologi', keywords: ['hormon', 'pcos', 'østrogen', 'progesteron'] },
  { label: 'Hysteroskopi', path: '/behandlinger/gynekologi/hysteroskopi', category: 'Gynekologi', keywords: ['hysteroskopi', 'kikkertundersøkelse', 'livmor', 'office'] },
  { label: 'Labiaplastikk', path: '/behandlinger/gynekologi/labiaplastikk', category: 'Gynekologi', keywords: ['labia', 'intimkirurgi', 'kjønnslepper'] },
  { label: 'Vaginal tørrhet', path: '/behandlinger/gynekologi/overgangsalder', category: 'Gynekologi', keywords: ['tørrhet', 'vaginal', 'intimhelse'] },
  { label: 'Vulvalidelser', path: '/behandlinger/gynekologi/vulvalidelser', category: 'Gynekologi', keywords: ['vulva', 'vaginisme', 'vulvodyni', 'botox', 'sviing'] },
  { label: 'Fødselsskader', path: '/behandlinger/gynekologi/fodselsskader', category: 'Gynekologi', keywords: ['fødsel', 'ruptur', 'sphincter', 'bekkenbunn'] },
  { label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi/kirurgi', category: 'Gynekologi', keywords: ['operasjon', 'kirurgi', 'inngrep'] },
  { label: 'Robotassistert kirurgi (gynekologi)', path: '/behandlinger/gynekologi/robotkirurgi', category: 'Gynekologi', keywords: ['robot', 'da vinci', 'robotkirurgi'] },
  { label: 'Tverrfaglig team', path: '/behandlinger/gynekologi/tverrfaglig', category: 'Gynekologi', keywords: ['tverrfaglig', 'team', 'osteopat', 'psykolog', 'sexolog', 'ernæring'] },

  // ─────────────── Graviditet og fostermedisin ───────────────
  { label: 'Graviditet og fostermedisin', path: '/behandlinger/graviditet', category: 'Fagområde', keywords: ['gravid', 'foster', 'svangerskap'] },
  { label: 'Ultralyd', path: '/behandlinger/graviditet/ultralyd', category: 'Graviditet', keywords: ['ultralyd', 'scanning', 'fosterultralyd'] },
  { label: 'NIPT', path: '/behandlinger/graviditet/nipt', category: 'Graviditet', keywords: ['nipt', 'fosterdiagnostikk', 'blodprøve', 'tidlig ultralyd'] },
  { label: 'Fostermedisin', path: '/behandlinger/graviditet/fosterdiagnostikk', category: 'Graviditet', keywords: ['foster', 'fosterdiagnostikk', 'misdannelser'] },
  { label: 'Svangerskapsteam', path: '/behandlinger/graviditet/svangerskapsteam', category: 'Graviditet', keywords: ['jordmor', 'svangerskap', 'team', 'oppfølging'] },
  { label: 'Spontanabort', path: '/behandlinger/gynekologi/spontanabort', category: 'Gynekologi', keywords: ['abort', 'tidlig graviditet', 'missed abortion'] },

  // ─────────────── Urologi ───────────────
  { label: 'Urologi', path: '/behandlinger/urologi', category: 'Fagområde', keywords: ['mann', 'menn', 'urin', 'blære'] },
  { label: 'Blære og urinveier', path: '/behandlinger/urologi/blaere', category: 'Urologi', keywords: ['urin', 'blære', 'urinveisinfeksjon', 'uvi', 'cystitt'] },
  { label: 'Forhud', path: '/behandlinger/urologi/forhud', category: 'Urologi', keywords: ['omskjæring', 'fimose', 'trang forhud'] },
  { label: 'Mannlig infertilitet', path: '/behandlinger/urologi/infertilitet', category: 'Urologi', keywords: ['barnløshet', 'sæd', 'fertilitet', 'mannlig'] },
  { label: 'Nyrer', path: '/behandlinger/urologi/nyrer', category: 'Urologi', keywords: ['nyre', 'nyrestein', 'nyrecyster', 'nefrektomi'] },
  { label: 'Prostata', path: '/behandlinger/urologi/prostata', category: 'Urologi', keywords: ['prostata', 'psa', 'vannlatning', 'urinering', 'prostatakreft'] },
  { label: 'Testikler', path: '/behandlinger/urologi/testikler', category: 'Urologi', keywords: ['testikkel', 'pung', 'kul', 'testikkelkreft', 'vondt i pungen'] },
  { label: 'Sterilisering', path: '/behandlinger/urologi/sterilisering', category: 'Urologi', keywords: ['prevensjon', 'sterilisering', 'vasektomi'] },
  { label: 'Refertilisering', path: '/behandlinger/urologi/refertilisering', category: 'Urologi', keywords: ['vasektomi reversering', 'refertilisering'] },
  { label: 'Robotassistert kirurgi (urologi)', path: '/behandlinger/urologi/robotkirurgi', category: 'Urologi', keywords: ['robot', 'da vinci', 'nyrekreft'] },

  // ─────────────── Fertilitet ───────────────
  { label: 'Fertilitet', path: '/behandlinger/fertilitet', category: 'Fagområde', keywords: ['barn', 'graviditet', 'befruktning', 'ivf'] },
  { label: 'Infertilitet', path: '/behandlinger/fertilitet/infertilitet', category: 'Fertilitet', keywords: ['ufrivillig barnløshet', 'barnløshet', 'blir ikke gravid'] },
  { label: 'Assistert befruktning', path: '/behandlinger/fertilitet/assistert-befruktning', category: 'Fertilitet', keywords: ['ivf', 'icsi', 'iui', 'inseminasjon', 'prøverør'] },
  { label: 'Assistert befruktning for par og single', path: '/behandlinger/fertilitet/assistert-befruktning-for-par-og-single', category: 'Fertilitet', keywords: ['par', 'single', 'lesbisk', 'enslig'] },
  { label: 'Fertilitetsutredning', path: '/behandlinger/fertilitet/fertilitetsutredning', category: 'Fertilitet', keywords: ['utredning', 'fertilitetssjekk', 'amh', 'sjekk fertilitet'] },
  { label: 'Nedfrysning av egg', path: '/behandlinger/fertilitet/eggfrys', category: 'Fertilitet', keywords: ['fryse egg', 'eggfrys', 'nedfrysning', 'sosial eggfrys'] },
  { label: 'Donorbehandling', path: '/behandlinger/fertilitet/donorbehandling', category: 'Fertilitet', keywords: ['donor', 'eggdonasjon', 'donorsæd', 'partnerdonasjon'] },
  { label: 'Sædanalyse', path: '/behandlinger/fertilitet/saedanalyse', category: 'Fertilitet', keywords: ['sæd', 'sædprøve', 'mannlig fertilitet', 'mannlig infertilitet', 'sædkontroll'] },
  { label: 'Hysteroskopi (fertilitet)', path: '/behandlinger/fertilitet/hysteroskopi', category: 'Fertilitet', keywords: ['hysteroskopi', 'livmor', 'office'] },

  // ─────────────── Ortopedi ───────────────
  { label: 'Ortopedi', path: '/behandlinger/ortopedi', category: 'Fagområde', keywords: ['bein', 'skjelett', 'ledd', 'muskel'] },
  { label: 'Fot og ankel', path: '/behandlinger/ortopedi/fot-ankel', category: 'Ortopedi', keywords: ['fot', 'ankel', 'achilles', 'ballettankel', 'hallux valgus'] },
  { label: 'Hofte', path: '/behandlinger/ortopedi/hofte', category: 'Ortopedi', keywords: ['hofte', 'artrose', 'hofteskopi'] },
  { label: 'Hånd og albue', path: '/behandlinger/ortopedi/hand-albue', category: 'Ortopedi', keywords: ['hånd', 'albue', 'tennisalbue', 'carpal tunnel', 'håndledd'] },
  { label: 'Kne', path: '/behandlinger/ortopedi/kne', category: 'Ortopedi', keywords: ['kne', 'bruskskader', 'meniskskade', 'korsbånd'] },
  { label: 'Skulder', path: '/behandlinger/ortopedi/skulder', category: 'Ortopedi', keywords: ['skulder', 'rotator', 'frossen skulder'] },

  // ─────────────── Flere fagområder ───────────────
  { label: 'Flere fagområder', path: '/behandlinger/flere-fagomrader', category: 'Fagområde', keywords: ['andre', 'øvrige'] },
  { label: 'Endokrinologi', path: '/behandlinger/flere-fagomrader/endokrinologi', category: 'Andre', keywords: ['hormoner', 'skjoldbruskkjertel', 'diabetes', 'stoffskifte'] },
  { label: 'Hudhelse', path: '/behandlinger/flere-fagomrader/hudhelse', category: 'Andre', keywords: ['hud', 'dermatolog', 'utslett', 'hudlege', 'eksem', 'akne'] },
  { label: 'Hudbehandlinger', path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger', category: 'Andre', keywords: ['hudbehandling', 'laser', 'peeling', 'kosmetisk'] },
  { label: 'Føflekksjekk', path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger', category: 'Andre', keywords: ['føflekk', 'kreftsjekk', 'dermatoskopi'] },
  { label: 'Behandlingsutstyr', path: '/behandlinger/flere-fagomrader/behandlingsutstyr', category: 'Andre', keywords: ['utstyr', 'apparat', 'maskiner'] },
  { label: 'Hudpleieprodukter', path: '/behandlinger/flere-fagomrader/hudpleieprodukter', category: 'Andre', keywords: ['produkter', 'hudpleie', 'serum', 'krem'] },
  { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog', category: 'Andre', keywords: ['ernæring', 'kosthold', 'diett', 'slanking', 'vekt'] },
  { label: 'Gastrokirurgi', path: '/behandlinger/flere-fagomrader/gastrokirurgi', category: 'Andre', keywords: ['mage', 'tarm', 'bariatrisk', 'gastro'] },
  { label: 'Overvektskirurgi', path: '/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi', category: 'Andre', keywords: ['fedmekirurgi', 'sleeve', 'gastrektomi', 'overvekt', 'slanking'] },
  { label: 'Brokkoperasjon', path: '/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon', category: 'Andre', keywords: ['brokk', 'lyskebrokk', 'navlebrokk'] },
  { label: 'Hemorroider og endetarmsplager', path: '/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager', category: 'Andre', keywords: ['hemorroider', 'rektocele', 'endetarm'] },
  { label: 'Osteopati', path: '/behandlinger/flere-fagomrader/osteopati', category: 'Andre', keywords: ['osteopat', 'manuell behandling', 'muskel'] },
  { label: 'Psykologi', path: '/behandlinger/flere-fagomrader/psykologi', category: 'Andre', keywords: ['psykolog', 'terapi', 'mental helse', 'angst', 'depresjon'] },
  { label: 'Sexologi', path: '/behandlinger/flere-fagomrader/sexologi', category: 'Andre', keywords: ['seksualitet', 'parterapi', 'intimitet', 'sex', 'samliv'] },
  { label: 'Plastikkirurgi', path: '/behandlinger/flere-fagomrader/plastikkirurgi', category: 'Andre', keywords: ['plastikk', 'estetisk', 'kosmetisk kirurgi'] },
  { label: 'Revmatologi', path: '/behandlinger/flere-fagomrader/revmatologi', category: 'Andre', keywords: ['revma', 'leddgikt', 'autoimmun'] },
  { label: 'Robotassistert kirurgi', path: '/behandlinger/flere-fagomrader/robotkirurgi', category: 'Andre', keywords: ['robot', 'da vinci', 'robotkirurgi', 'kikkertkirurgi'] },
  { label: 'Åreknuter', path: '/behandlinger/flere-fagomrader/areknuter', category: 'Andre', keywords: ['åreknuter', 'varicer', 'vener'] },

  // ─────────────── Tema-/landingssider ───────────────
  { label: 'Kvinnehelse', path: '/kvinnehelse', category: 'Tema', keywords: ['kvinne', 'tverrfaglig', 'helse'] },
  { label: 'Robotassistert kirurgi', path: '/robotassistert-kirurgi', category: 'Tema', keywords: ['robot', 'da vinci', 'kikkertkirurgi', 'minimal invasiv'] },

  // ─────────────── Sider ───────────────
  { label: 'Priser', path: '/priser', category: 'Side', keywords: ['pris', 'kostnad', 'hva koster', 'prisliste', 'meny', 'prislista', 'pricelist'] },
  { label: 'Om oss', path: '/om-oss', category: 'Side', keywords: ['om', 'hvem', 'klinikk', 'historie', 'cmedical', 'about'] },
  { label: 'Kontakt', path: '/kontakt', category: 'Side', keywords: ['kontakt', 'telefon', 'epost', 'adresse', 'ring', 'contact'] },
  { label: 'Forsikring', path: '/forsikring', category: 'Side', keywords: ['forsikring', 'helseforsikring', 'dekning', 'storebrand', 'if', 'fremtind', 'gjensidige', 'tryg'] },
  { label: 'Tjenester', path: '/tjenester', category: 'Side', keywords: ['tjenester', 'fagområder', 'oversikt', 'behandlinger'] },
  { label: 'Spesialister', path: '/spesialister', category: 'Side', keywords: ['lege', 'spesialist', 'behandler', 'team', 'leger', 'doktor'] },
  { label: 'Klinikker', path: '/klinikker', category: 'Side', keywords: ['klinikk', 'klinikker', 'beliggenhet', 'lokasjon', 'avdeling', 'sted'] },
  { label: 'Aktuelt', path: '/aktuelt', category: 'Side', keywords: ['nyheter', 'artikler', 'blogg', 'aktuelt', 'news'] },
  { label: 'Karriere', path: '/karriere', category: 'Side', keywords: ['jobb', 'karriere', 'ledig stilling', 'work', 'ansettelse'] },
  { label: 'Personvern', path: '/personvern', category: 'Side', keywords: ['personvern', 'gdpr', 'cookies', 'privacy', 'vilkår'] },
  { label: 'Bestill time', path: '/booking', category: 'Side', keywords: ['bestill', 'time', 'avtale', 'booking', 'timebestilling', 'bestille', 'book'] },

  // ─────────────── Klinikker ───────────────
  { label: 'CMedical Oslo Majorstuen', path: '/klinikker/majorstuen', category: 'Klinikk', keywords: ['oslo', 'majorstuen', 'kirkeveien', 'hovedklinikk'] },
  { label: 'CMedical Bekkestua', path: '/klinikker/bekkestua', category: 'Klinikk', keywords: ['bekkestua', 'bærum', 'baerum'] },
  { label: 'CMedical Moss', path: '/klinikker/moss', category: 'Klinikk', keywords: ['moss', 'østfold', 'ostfold'] },
  { label: 'CMedical Moelv', path: '/klinikker/moelv', category: 'Klinikk', keywords: ['moelv', 'innlandet', 'hedmark'] },
];

// ─────────────── Dynamic: specialists ───────────────
import { specialists } from "./specialists";
for (const s of specialists) {
  searchItems.push({
    label: s.name,
    path: `/spesialister/${s.slug}`,
    category: `Spesialist · ${s.title}`,
    keywords: [
      s.title,
      ...(s.expertise || []),
      ...(s.clinics || []),
      s.category,
      'lege', 'spesialist', 'behandler', 'doktor',
    ],
  });
}

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

// Vekt-bonus for fagområde-/oversiktssider når brukeren søker bredt.
const TOP_LEVEL_CATEGORIES = new Set(["Fagområde", "Tema", "Side"]);

// Forhåndsbygd, normalisert indeks for raskere matching
type IndexedItem = SearchItem & {
  _label: string;
  _category: string;
  _keywords: string;
  _all: string;
  _keywordList: string[];
};

const indexedItems: IndexedItem[] = searchItems.map((item) => ({
  ...item,
  _label: normalize(item.label),
  _category: normalize(item.category),
  _keywords: (item.keywords || []).map(normalize).join(" "),
  _keywordList: (item.keywords || []).map(normalize),
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
  threshold: 0.45,
  distance: 200,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
});

/**
 * Google-aktig søk:
 * 1) Utvider query med synonymer (symptom → behandling)
 * 2) Tokeniserer på mellomrom (alle ord må matche – AND)
 * 3) Vekter: eksakt label > label-prefix > label-substring > keyword > category.
 *    Topp-nivå sider (fagområder/tema) får et lite løft slik at "gyn" → Gynekologi.
 * 4) Faller tilbake til Fuse fuzzy ved typo / få treff.
 */
export function searchSuggestions(query: string, limit = 8): SearchItem[] {
  const raw = query.trim();
  if (!raw) return [];

  const expanded = expandQuery(raw);
  const normalizedRaw = normalize(raw);
  const tokens = normalize(expanded)
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  if (tokens.length === 0) return [];

  // Strict-pass: alle tokens må finnes et sted i item, med ranking
  const scored = indexedItems
    .map((item) => {
      let score = 0;
      let allMatched = true;

      // Eksakt label-match → stort løft
      if (item._label === normalizedRaw) score += 400;

      for (const token of tokens) {
        let tokenScore = 0;

        if (item._label === token) tokenScore += 200;
        else if (item._label.startsWith(token)) tokenScore += 120;
        else if (item._label.includes(` ${token}`)) tokenScore += 80;
        else if (item._label.includes(token)) tokenScore += 55;

        // Eksakt keyword-match veier mer enn delvis
        if (item._keywordList.includes(token)) tokenScore += 45;
        else if (item._keywords.includes(token)) tokenScore += 25;

        if (item._category.includes(token)) tokenScore += 10;

        if (tokenScore === 0) {
          if (!item._all.includes(token)) {
            allMatched = false;
            break;
          }
          tokenScore = 5;
        }

        score += tokenScore;
      }

      // Løft topp-nivå sider litt slik at brede søk treffer landingssiden først
      if (TOP_LEVEL_CATEGORIES.has(item.category)) score += 8;

      return { item, score, allMatched };
    })
    .filter((r) => r.allMatched && r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= 3) {
    return scored.slice(0, limit).map((r) => r.item);
  }

  // Fuzzy fallback: typo-toleranse via Fuse
  const fuzzy = fuse.search(normalizedRaw, { limit: limit * 2 });

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
