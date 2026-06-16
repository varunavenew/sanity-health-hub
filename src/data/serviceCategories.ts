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
      {
        label: 'Tverrfaglig team',
        path: '/behandlinger/gynekologi/tverrfaglig',
        items: [
          { label: 'Osteopat', path: '/behandlinger/flere-fagomrader/osteopati' },
          { label: 'Sexolog', path: '/behandlinger/flere-fagomrader/sexologi' },
          { label: 'Psykolog', path: '/behandlinger/flere-fagomrader/psykologi' },
          { label: 'Ernæring', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
        ],
      },
      { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi/undersokelse' },
      { label: 'Urinlekkasje', path: '/behandlinger/gynekologi/urinlekkasje' },
      { label: 'Endometriose', path: '/behandlinger/gynekologi/endometriose' },
      { label: 'Overgangsalder', path: '/behandlinger/gynekologi/overgangsalder' },
      { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall' },
      { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser' },
      { label: 'Celleforandringer', path: '/behandlinger/gynekologi/celleforandringer' },
      { label: 'Cyster på eggstokkene', path: '/behandlinger/gynekologi/cyster' },
      { label: 'Fjerne livmor', path: '/behandlinger/gynekologi/fjerne-livmor' },
      { label: 'Fostermedisin', path: '/behandlinger/gynekologi/fostermedisin' },
      { label: 'Fødselsskader', path: '/behandlinger/gynekologi/fodselsskader' },
      { label: 'Graviditet', path: '/behandlinger/gynekologi/graviditet' },
      { label: 'Gynekologisk kirurgi', path: '/behandlinger/gynekologi/kirurgi' },
      { label: 'Hysteroskopi', path: '/behandlinger/gynekologi/hysteroskopi' },
      { label: 'Labiaplastikk', path: '/behandlinger/gynekologi/labiaplastikk' },
      { label: 'NIPT', path: '/behandlinger/gynekologi/nipt' },
      { label: 'PMOS', path: '/behandlinger/gynekologi/pmos' },
      { label: 'PMS og PMDD', path: '/behandlinger/gynekologi/pms-pmdd' },
      { label: 'Robotassistert kirurgi', path: '/behandlinger/gynekologi/robotkirurgi' },
      { label: 'Spontanabort', path: '/behandlinger/gynekologi/spontanabort' },
      { label: 'Vulvalidelser', path: '/behandlinger/gynekologi/vulvalidelser' },
    ],
  },
  {
    id: 'graviditet',
    label: 'Graviditet',
    path: '/graviditet',
    subcategories: [
      { label: 'Ultralyd', path: '/behandlinger/graviditet/ultralyd' },
      { label: 'NIPT', path: '/behandlinger/graviditet/nipt' },
      { label: 'Svangerskapsteam', path: '/behandlinger/graviditet/svangerskapsteam' },
      { label: 'Fosterdiagnostikk', path: '/behandlinger/graviditet/fosterdiagnostikk' },
    ],
  },
  {
    id: 'fertilitet',
    label: 'Fertilitet',
    path: '/fertilitet',
    subcategories: [
      { label: 'Infertilitet', path: '/behandlinger/fertilitet/infertilitet' },
      { label: 'Assistert befruktning', path: '/behandlinger/fertilitet/assistert-befruktning' },
      { label: 'Fertilitetsutredning', path: '/behandlinger/fertilitet/fertilitetsutredning' },
      { label: 'Eggfrys', path: '/behandlinger/fertilitet/eggfrys' },
      { label: 'Donorbehandling', path: '/behandlinger/fertilitet/donorbehandling' },
      { label: 'Assistert befruktning for par og single', path: '/behandlinger/fertilitet/par-og-single' },
      { label: 'Fertilitetsutredning i juli', path: '/behandlinger/fertilitet/fertilitetsutredning-juli' },
      { label: 'Hysteroskopi', path: '/behandlinger/fertilitet/hysteroskopi' },
      { label: 'Sædanalyse', path: '/behandlinger/fertilitet/saedanalyse' },
      { label: 'Prisliste fertilitet', path: '/priser/fertilitet' },
    ],
  },
  {
    id: 'urologi',
    label: 'Urologi',
    path: '/urologi',
    subcategories: [
      { label: 'Blære og urinveier', path: '/behandlinger/urologi/blaere' },
      { label: 'Forhud', path: '/behandlinger/urologi/forhud' },
      { label: 'Mannlig infertilitet', path: '/behandlinger/urologi/infertilitet' },
      { label: 'Nyrer', path: '/behandlinger/urologi/nyrer' },
      { label: 'Prostata', path: '/behandlinger/urologi/prostata' },
      { label: 'Refertilisering', path: '/behandlinger/urologi/refertilisering' },
      { label: 'Robotassistert kirurgi', path: '/behandlinger/urologi/robotkirurgi' },
      { label: 'Sterilisering', path: '/behandlinger/urologi/sterilisering' },
      { label: 'Testikler og pung', path: '/behandlinger/urologi/testikler' },
    ],
  },
  {
    id: 'ortopedi',
    label: 'Ortopedi',
    path: '/ortopedi',
    subcategories: [
      { label: 'Fot og ankel', path: '/behandlinger/ortopedi/fot-ankel' },
      { label: 'Hofte', path: '/behandlinger/ortopedi/hofte' },
      { label: 'Hånd og albue', path: '/behandlinger/ortopedi/hand-albue' },
      { label: 'Kne', path: '/behandlinger/ortopedi/kne' },
      { label: 'Skulder', path: '/behandlinger/ortopedi/skulder' },
    ],
  },
  {
    id: 'flere-fagomrader',
    label: 'Flere tjenester',
    path: '/flere-fagomrader',
    subcategories: [
      { label: 'Endokrinologi', path: '/behandlinger/flere-fagomrader/endokrinologi' },
      { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
      { label: 'Hudlege', path: '/behandlinger/flere-fagomrader/hudlege' },
      {
        label: 'Hudhelse',
        path: '/behandlinger/flere-fagomrader/hudhelse',
        items: [
          { label: 'Hudbehandlinger', path: '/behandlinger/flere-fagomrader/hudbehandlinger' },
          { label: 'Behandlingsutstyr', path: '/behandlinger/flere-fagomrader/behandlingsutstyr' },
          { label: 'Hudpleieprodukter', path: '/behandlinger/flere-fagomrader/hudpleieprodukter' },
        ],
      },
      {
        label: 'Overvektskirurgi',
        path: '/behandlinger/flere-fagomrader/overvektskirurgi',
        items: [
          { label: 'Sleeve-gastrektomi', path: '/behandlinger/flere-fagomrader/sleeve-gastrektomi' },
        ],
      },
      { label: 'Gastrokirurgi', path: '/behandlinger/flere-fagomrader/gastrokirurgi' },
      { label: 'Osteopati', path: '/behandlinger/flere-fagomrader/osteopati' },
      { label: 'Plastikkirurgi', path: '/behandlinger/flere-fagomrader/plastikkirurgi' },
      { label: 'Psykologi', path: '/behandlinger/flere-fagomrader/psykologi' },
      { label: 'Revmatologi', path: '/behandlinger/flere-fagomrader/revmatologi' },
      { label: 'Robotassistert kirurgi', path: '/behandlinger/flere-fagomrader/robotkirurgi' },
      { label: 'Sexologi', path: '/behandlinger/flere-fagomrader/sexologi' },
      { label: 'Åreknutebehandling', path: '/behandlinger/flere-fagomrader/areknuter' },
    ],
  },
];
