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
  { label: 'Urinlekkasje', path: '/behandlinger/gynekologi/urinlekkasje', category: 'Gynekologi', keywords: ['inkontinens', 'lekkasje'] },
  { label: 'Endometriose', path: '/behandlinger/gynekologi/endometriose', category: 'Gynekologi', keywords: ['smerter', 'underlivssmerter', 'adenomyose'] },
  { label: 'Overgangsalder', path: '/behandlinger/gynekologi/overgangsalder', category: 'Gynekologi', keywords: ['menopause', 'klimakteriet', 'hormoner'] },
  { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall', category: 'Gynekologi', keywords: ['prolaps', 'fremfall'] },
  { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser', category: 'Gynekologi', keywords: ['blødning', 'menstruasjon', 'uregelmessig'] },
  { label: 'Celleforandringer', path: '/behandlinger/gynekologi/celleforandringer', category: 'Gynekologi', keywords: ['celleprøve', 'livmorhals', 'hpv', 'konisering'] },
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
  { label: 'Infertilitet', path: '/behandlinger/fertilitet/infertilitet', category: 'Fertilitet', keywords: ['barnløshet', 'ufruktbar'] },
  { label: 'Assistert befruktning', path: '/behandlinger/fertilitet/assistert-befruktning', category: 'Fertilitet', keywords: ['kunstig befruktning', 'ivf', 'icsi', 'inseminasjon'] },
  { label: 'Assistert befruktning med donor', path: '/behandlinger/fertilitet/donorbehandling', category: 'Fertilitet', keywords: ['donor', 'sæddonor', 'eggdonor'] },
  { label: 'Eggfrys', path: '/behandlinger/fertilitet/eggfrys', category: 'Fertilitet', keywords: ['fryse egg', 'bevare fertilitet', 'nedfrysning'] },
  { label: 'Hormonforstyrrelser', path: '/behandlinger/fertilitet/hormonforstyrrelser', category: 'Fertilitet', keywords: ['hormon', 'pcos'] },
  { label: 'Hysteroskopi', path: '/behandlinger/fertilitet/hysteroskopi', category: 'Fertilitet', keywords: ['kikkertundersøkelse', 'livmor'] },

  // Ortopedi
  { label: 'Ortopedi', path: '/behandlinger/ortopedi', category: 'Fagområde', keywords: ['bein', 'skjelett', 'ledd'] },
  { label: 'Fot og ankel', path: '/behandlinger/ortopedi/fot-ankel', category: 'Ortopedi', keywords: ['fot', 'ankel', 'achilles', 'ballettankel'] },
  { label: 'Hofte', path: '/behandlinger/ortopedi/hofte', category: 'Ortopedi', keywords: ['hofte', 'artrose'] },
  { label: 'Hånd og albue', path: '/behandlinger/ortopedi/hand-albue', category: 'Ortopedi', keywords: ['hånd', 'albue', 'tennisalbue', 'carpal tunnel'] },
  { label: 'Kne', path: '/behandlinger/ortopedi/kne', category: 'Ortopedi', keywords: ['kne', 'bruskskader'] },

  // Flere fagområder
  { label: 'Flere fagområder', path: '/behandlinger/flere-fagomrader', category: 'Fagområde', keywords: ['andre', 'øvrige'] },
  { label: 'Endokrinologi', path: '/behandlinger/flere-fagomrader/endokrinologi', category: 'Andre', keywords: ['hormoner', 'skjoldbruskkjertel', 'diabetes'] },
  { label: 'Hudlege', path: '/behandlinger/flere-fagomrader/hudlege', category: 'Andre', keywords: ['hud', 'dermatolog', 'utslett'] },
  
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

export function searchSuggestions(query: string, limit = 8): SearchItem[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return searchItems
    .filter(item => {
      const labelMatch = item.label.toLowerCase().includes(normalizedQuery);
      const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
      const keywordMatch = item.keywords?.some(kw => kw.toLowerCase().includes(normalizedQuery));
      return labelMatch || categoryMatch || keywordMatch;
    })
    .slice(0, limit);
}
