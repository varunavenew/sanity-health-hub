export interface SubItem {
  label: string;
  anchor?: string;
  path?: string;
}

export interface SubCategory {
  label: string;
  path: string;
  items?: SubItem[];
}

export interface ServiceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: SubCategory[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'gynekologi',
    label: 'Gynekologi',
    path: '/gynekologi',
    subcategories: [
      { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi/undersokelse' },
      {
        label: 'Urinlekkasje',
        path: '/behandlinger/gynekologi/urinlekkasje',
        items: [
          { label: 'Typer urinlekkasje' },
          { label: 'Behandling urinlekkasje' },
        ]
      },
      {
        label: 'Endometriose',
        path: '/behandlinger/gynekologi/endometriose',
        items: [
          { label: 'Symptomer' },
          { label: 'Kirurgi' },
          { label: 'Adenomyose' },
        ]
      },
      {
        label: 'Overgangsalder',
        path: '/behandlinger/gynekologi/overgangsalder',
        items: [
          { label: 'Symptomer' },
          { label: 'Behandling' },
          { label: 'Fastlegeveiledning' },
        ]
      },
      { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall' },
      { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser' },
      {
        label: 'Celleforandringer',
        path: '/behandlinger/gynekologi/celleforandringer',
        items: [
          { label: 'HPV og celleforandringer' },
          { label: 'Konisering' },
        ]
      },
      {
        label: 'Cyster på eggstokkene',
        path: '/behandlinger/gynekologi/cyster',
        items: [
          { label: 'Former for cyste' },
        ]
      },
      {
        label: 'Fjerne livmor',
        path: '/behandlinger/gynekologi/fjerne-livmor',
        items: [
          { label: 'Fjerning av livmor/hysterektomi' },
        ]
      },
      { label: 'PMS og PMDD', path: '/behandlinger/gynekologi/pms-pmdd' },
      { label: 'Labiaplastikk', path: '/behandlinger/gynekologi/labiaplastikk' },
      { label: 'Vaginal tørrhet', path: '/behandlinger/gynekologi/vaginal-torrhet' },
      {
        label: 'Vulvalidelser',
        path: '/behandlinger/gynekologi/vulvalidelser',
        items: [
          { label: 'Infeksjoner' },
          { label: 'Vaginisme' },
          { label: 'Vulvodyni' },
          { label: 'Botoxbehandling for vaginisme/vulvalidelser' },
        ]
      },
      { label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi/kirurgi' },
      {
        label: 'Robotassistert kirurgi',
        path: '/behandlinger/gynekologi/robotkirurgi',
        items: [
          { label: 'Rask rehabilitering' },
          { label: 'Høy presisjon' },
        ]
      },
    ]
  },
  {
    id: 'graviditet',
    label: 'Graviditet og fostermedisin',
    path: '/graviditet',
    subcategories: [
      { label: 'Ultralyd', path: '/behandlinger/graviditet/ultralyd' },
      { label: 'NIPT', path: '/behandlinger/graviditet/nipt' },
      { label: '6-ukerskontroll etter fødsel', path: '/behandlinger/graviditet/6-ukerskontroll' },
      { label: 'Traumatisk fødsel', path: '/behandlinger/graviditet/traumatisk-fodsel' },
      { label: 'Fødselsangst', path: '/behandlinger/graviditet/fodselsangst' },
      { label: 'For partnere', path: '/behandlinger/graviditet/for-partnere' },
      { label: 'Fostermedisin', path: '/behandlinger/graviditet/fostermedisin' },
      { label: 'Spontanabort', path: '/behandlinger/graviditet/spontanabort' },
    ]
  },
  {
    id: 'fertilitet',
    label: 'Fertilitet',
    path: '/fertilitet',
    subcategories: [
      {
        label: 'Infertilitet',
        path: '/behandlinger/fertilitet/infertilitet',
        items: [
          { label: 'Du er ikke alene' },
          { label: 'Kvinnelig faktor infertilitet' },
          { label: 'Mannlig faktor infertilitet' },
          { label: 'Uforklarlige årsaker til infertilitet' },
        ]
      },
      {
        label: 'Assistert befruktning',
        path: '/behandlinger/fertilitet/assistert-befruktning',
        items: [
          { label: 'IVF - In Vitro Fertilisering' },
          { label: 'ICSI - Intracytoplasmatisk spermieinjeksjon' },
          { label: 'Inseminasjon (AIH)' },
          { label: 'TESA/PESA' },
          { label: 'Micro-TESE' },
        ]
      },
      {
        label: 'Assistert befruktning med donor',
        path: '/behandlinger/fertilitet/donorbehandling',
        items: [
          { label: 'Partnerdonasjon' },
          { label: 'Donorsæd' },
        ]
      },
      {
        label: 'Eggfrys',
        path: '/behandlinger/fertilitet/eggfrys',
        items: [
          { label: 'Hvem kan fryse ned egg?' },
          { label: 'Hva er aldersgrensen for nedfrysning av egg?' },
          { label: 'Slik foregår nedfrysning av egg' },
          { label: 'Hvor mange egg kan jeg få på frys?' },
          { label: 'Hva er risiko ved nedfrysning av egg?' },
        ]
      },
      {
        label: 'Hormonforstyrrelser',
        path: '/behandlinger/fertilitet/hormonforstyrrelser',
        items: [
          { label: 'PCOS' },
        ]
      },
      {
        label: 'Hysteroskopi',
        path: '/behandlinger/fertilitet/hysteroskopi',
        items: [
          { label: 'Office-hysteroskopi' },
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
        label: 'Blære og urinveier',
        path: '/behandlinger/urologi/blaere',
        items: [
          { label: 'Blod i urinen' },
          { label: 'Vannlatningsproblemer' },
          { label: 'TUR-P og TUR-B' },
          { label: 'Innsnevring i urinrøret' },
        ]
      },
      {
        label: 'Forhud',
        path: '/behandlinger/urologi/forhud',
        items: [
          { label: 'Trang forhud' },
        ]
      },
      {
        label: 'Mannlig infertilitet',
        path: '/behandlinger/urologi/infertilitet',
        items: [
          { label: 'Sædanalyse' },
        ]
      },
      {
        label: 'Nyrer',
        path: '/behandlinger/urologi/nyrer',
        items: [
          { label: 'Nyrecyster' },
          { label: 'Tumor' },
        ]
      },
      {
        label: 'Prevensjon',
        path: '/behandlinger/urologi/prevensjon',
        items: [
          { label: 'Behandling' },
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
        label: 'Fot og ankel',
        path: '/behandlinger/ortopedi/fot-ankel',
        items: [
          { label: 'Kompartment-syndrom' },
          { label: 'Ballettankel' },
          { label: 'Haglunds hæl' },
          { label: 'Achilles tendinalgi' },
        ]
      },
      { label: 'Hofte', path: '/behandlinger/ortopedi/hofte' },
      {
        label: 'Hånd og albue',
        path: '/behandlinger/ortopedi/hand-albue',
        items: [
          { label: 'Tennisalbue' },
          { label: 'Håndleddsartroskopi' },
          { label: 'Carpal tunnel syndrom' },
        ]
      },
      {
        label: 'Kne',
        path: '/behandlinger/ortopedi/kne',
        items: [
          { label: 'Bruskskader i kneet' },
        ]
      },
    ]
  },
  {
    id: 'flere',
    label: 'Flere fagområder',
    path: '/flere-fagomrader',
    subcategories: [
      {
        label: 'Endokrinologi',
        path: '/behandlinger/flere-fagomrader/endokrinologi',
        items: [
          { label: 'Stoffskifte' },
          { label: 'Diabetes' },
          { label: 'Hormonsykdommer' },
        ]
      },
      {
        label: 'Hudlege',
        path: '/behandlinger/flere-fagomrader/hudlege',
        items: [
          { label: 'Akne' },
          { label: 'Eksem' },
          { label: 'Rosacea' },
          { label: 'Psoriasis' },
          { label: 'Føflekksjekk' },
          { label: 'Hudkreft' },
        ]
      },
      {
        label: 'Ernæringsfysiolog',
        path: '/behandlinger/flere-fagomrader/ernaringsfysiolog',
        items: [
          { label: 'Formålet' },
        ]
      },
      {
        label: 'Gastrokirurgi',
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
        items: [
          { label: 'Bariatrisk kirurgi' },
          { label: 'Sleeve gastrektomi' },
        ]
      },
      {
        label: 'Overvektskirurgi',
        path: '/behandlinger/flere-fagomrader/overvektskirurgi',
        items: [
          { label: 'Sleeve gastrektomi' },
          { label: 'Sleeve gastrektomi - Før operasjonen' },
          { label: 'Sleeve gastrektomi - Under operasjonen' },
          { label: 'Sleeve gastrektomi - Etter operasjonen' },
          { label: 'Sleeve gastrektomi - Tiden etter hjemkomst' },
          { label: 'Sleeve gastrektomi - Fordeler med moderne kirurgi' },
        ]
      },
      { label: 'Osteopati', path: '/behandlinger/flere-fagomrader/osteopati' },
      { label: 'Psykologi', path: '/behandlinger/flere-fagomrader/psykologi' },
      { label: 'Sexologi', path: '/behandlinger/flere-fagomrader/sexologi' },
      {
        label: 'Kvinnehelse',
        path: '/behandlinger/flere-fagomrader/kvinnehelse',
        items: [
          { label: 'Behandling' },
          { label: 'Tverrfaglig' },
          { label: 'Mål med behandling' },
        ]
      },
      {
        label: 'Tverrfaglig team',
        path: '/behandlinger/flere-fagomrader/tverrfaglig',
        items: [
          { label: 'Osteopat', path: '/behandlinger/flere-fagomrader/osteopati' },
          { label: 'Sexolog', path: '/behandlinger/flere-fagomrader/sexologi' },
          { label: 'Psykolog', path: '/behandlinger/flere-fagomrader/psykologi' },
          { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
        ]
      },
    ]
  },
];
