// Centralized search data for autocomplete suggestions

export interface SearchItem {
  label: string;
  path: string;
  category: string;
  keywords?: string[];
}

export const searchItems: SearchItem[] = [
  // Gynekologi
  { label: 'Gynekologi', path: '/behandlinger/gynekologi', category: 'Fagområde', keywords: ['gyn', 'kvinne', 'underlivsplager'] },
  { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['undersøkelse', 'kontroll'] },
  { label: 'Urinlekkasje', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['inkontinens', 'lekkasje'] },
  { label: 'Endometriose', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['smerter', 'underlivssmerter'] },
  { label: 'Overgangsalder', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['menopause', 'klimakteriet', 'hormoner'] },
  { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['prolaps', 'fremfall'] },
  { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['blødning', 'menstruasjon', 'uregelmessig'] },
  { label: 'Celleforandringer', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['celleprøve', 'livmorhals', 'hpv'] },
  { label: 'Cyster på eggstokkene', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['cyste', 'eggstokk'] },
  { label: 'Fjerne livmor', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['hysterektomi', 'livmor'] },
  { label: 'Graviditet', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['gravid', 'foster', 'ultralyd'] },
  { label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['operasjon', 'kirurgi'] },
  { label: 'Hormonforstyrrelser', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['hormon', 'pcos'] },
  { label: 'Hysteroskopi', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['kikkertundersøkelse', 'livmor'] },
  { label: 'Labiaplastikk', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['labia', 'intimkirurgi', 'kjønnslepper'] },
  { label: 'Robotkirurgi', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['robot', 'da vinci'] },
  { label: 'Spontanabort', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['abort', 'tidlig graviditet'] },
  { label: 'Vulvalidelser', path: '/behandlinger/gynekologi', category: 'Gynekologi', keywords: ['vulva', 'ytre kjønnsorganer'] },
  
  // Urologi
  { label: 'Urologi', path: '/behandlinger/urologi', category: 'Fagområde', keywords: ['mann', 'urin', 'blære'] },
  { label: 'Blære og urinveier', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['urin', 'blære', 'urinveisinfeksjon'] },
  { label: 'Forhud', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['omskjæring', 'fimose'] },
  { label: 'Mannlig infertilitet', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['barnløshet', 'sæd', 'fertilitet'] },
  { label: 'Nyrer', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['nyre', 'nyrestein'] },
  { label: 'Prostata', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['prostata', 'psa', 'vannlatingsproblemer'] },
  { label: 'Refertilisering', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['reversere sterilisering', 'fertil igjen'] },
  { label: 'Sterilisering', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['vasektomi', 'permanent prevensjon'] },
  { label: 'Testikler og pung', path: '/behandlinger/urologi', category: 'Urologi', keywords: ['testikkel', 'pung', 'åreknuter'] },
  
  // Fertilitet
  { label: 'Fertilitet & IVF', path: '/behandlinger/fertilitet', category: 'Fagområde', keywords: ['barn', 'graviditet', 'befruktning'] },
  { label: 'Infertilitet', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['barnløshet', 'ufruktbar'] },
  { label: 'Assistert befruktning', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['kunstig befruktning', 'iui'] },
  { label: 'IVF', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['prøverør', 'ivf', 'in vitro'] },
  { label: 'Eggfrys', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['fryse egg', 'bevare fertilitet'] },
  { label: 'Donorbehandling', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['donor', 'sæddonor', 'eggdonor'] },
  { label: 'Sædanalyse', path: '/behandlinger/fertilitet', category: 'Fertilitet', keywords: ['sædprøve', 'sædkvalitet'] },
  
  // Ortopedi
  { label: 'Ortopedi', path: '/behandlinger/ortopedi', category: 'Fagområde', keywords: ['bein', 'skjelett', 'ledd'] },
  { label: 'Kne og hofte', path: '/behandlinger/ortopedi', category: 'Ortopedi', keywords: ['kne', 'hofte', 'artrose'] },
  { label: 'Skulder og albue', path: '/behandlinger/ortopedi', category: 'Ortopedi', keywords: ['skulder', 'albue', 'rotator cuff'] },
  { label: 'Rygg og nakke', path: '/behandlinger/ortopedi', category: 'Ortopedi', keywords: ['rygg', 'nakke', 'prolaps', 'isjias'] },
  { label: 'Fot og ankel', path: '/behandlinger/ortopedi', category: 'Ortopedi', keywords: ['fot', 'ankel', 'hallux'] },
  
  // Flere fagområder
  { label: 'Flere fagområder', path: '/behandlinger/flere-fagomrader', category: 'Fagområde', keywords: ['andre', 'øvrige'] },
  { label: 'Endokrinologi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['hormoner', 'skjoldbruskkjertel', 'diabetes'] },
  { label: 'Hudlege', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['hud', 'dermatolog', 'utslett'] },
  { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['ernæring', 'kosthold', 'diett'] },
  { label: 'Gastrokirurgi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['mage', 'tarm', 'fedmekirurgi'] },
  { label: 'Osteopati', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['manuell behandling', 'muskel'] },
  { label: 'Plastikkirurgi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['plastisk', 'kosmetisk', 'estetisk'] },
  { label: 'Psykologi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['psykolog', 'terapi', 'mental helse'] },
  { label: 'Revmatologi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['leddgikt', 'revmatisme', 'autoimmun'] },
  { label: 'Sexologi', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['seksualitet', 'parterapi', 'intimitet'] },
  { label: 'Åreknutebehandling', path: '/behandlinger/flere-fagomrader', category: 'Andre', keywords: ['åreknuter', 'vener'] },
  
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
