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
      { label: 'Urogynekologi (fremfall og lekkasje)', path: '/behandlinger/gynekologi/urogynekologi' },
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
      { label: 'Fertilitetssjekk', path: '/behandlinger/fertilitet/fertilitetssjekk' },
      { label: 'IVF', path: '/behandlinger/fertilitet/assistert-befruktning' },
      { label: 'IUI', path: '/behandlinger/fertilitet/assistert-befruktning' },
      { label: 'Nedfrysing', path: '/behandlinger/fertilitet/eggfrys' },
      { label: 'Eggdonasjon', path: '/behandlinger/fertilitet/donorbehandling' },
      { label: 'Mannlig fertilitet', path: '/behandlinger/fertilitet/saedanalyse' },
      { label: 'Psykisk helsehjelp', path: '/behandlinger/fertilitet/infertilitet' },
      { label: 'PGT', path: '/behandlinger/fertilitet/assistert-befruktning' },
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
      {
        label: 'Endokrinologi',
        path: '/behandlinger/flere-fagomrader/endokrinologi',
        items: [
          { label: 'Stoffskifte', path: '/behandlinger/flere-fagomrader/endokrinologi-stoffskifte' },
          { label: 'Diabetes', path: '/behandlinger/flere-fagomrader/endokrinologi-diabetes' },
          { label: 'Binyrer og hormoner', path: '/behandlinger/flere-fagomrader/endokrinologi-binyrer' },
        ],
      },
      {
        label: 'Ernæringsfysiolog',
        path: '/behandlinger/flere-fagomrader/ernaringsfysiolog',
        items: [
          { label: 'Vekt og kosthold', path: '/behandlinger/flere-fagomrader/ernaring-vekt' },
          { label: 'Matintoleranser', path: '/behandlinger/flere-fagomrader/ernaring-intoleranser' },
          { label: 'Sykdomsernæring', path: '/behandlinger/flere-fagomrader/ernaring-sykdom' },
        ],
      },
      {
        label: 'Hudhelse',
        path: '/behandlinger/flere-fagomrader/hudhelse',
        items: [
          { label: 'Hudbehandlinger', path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
          { label: 'Behandlingsutstyr', path: '/behandlinger/flere-fagomrader/behandlingsutstyr' },
          { label: 'Hudpleieprodukter', path: '/behandlinger/flere-fagomrader/hudpleieprodukter' },
        ],
      },
      {
        label: 'Overvektskirurgi',
        path: '/behandlinger/flere-fagomrader/overvektskirurgi',
        items: [
          { label: 'Sleeve-gastrektomi', path: '/behandlinger/flere-fagomrader/sleeve-gastrektomi' },
          { label: 'Gastrisk bypass', path: '/behandlinger/flere-fagomrader/gastrisk-bypass' },
          { label: 'Oppfølging etter overvektskirurgi', path: '/behandlinger/flere-fagomrader/overvektskirurgi-oppfolging' },
        ],
      },
      {
        label: 'Gastrokirurgi',
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
        items: [
          { label: 'Bariatrisk kirurgi', path: '/behandlinger/flere-fagomrader/overvektskirurgi' },
          { label: 'Sleeve gastrektomi', path: '/behandlinger/flere-fagomrader/sleeve-gastrektomi' },
        ],
      },
      {
        label: 'Osteopati',
        path: '/behandlinger/flere-fagomrader/osteopati',
        items: [
          { label: 'Nakke og rygg', path: '/behandlinger/flere-fagomrader/osteopati-nakke-rygg' },
          { label: 'Kroniske smerter', path: '/behandlinger/flere-fagomrader/osteopati-kroniske-smerter' },
          { label: 'Bekkenrelaterte plager', path: '/behandlinger/flere-fagomrader/osteopati-bekken' },
        ],
      },
      {
        label: 'Plastikkirurgi',
        path: '/behandlinger/flere-fagomrader/plastikkirurgi',
        items: [
          { label: 'Bryst', path: '/behandlinger/flere-fagomrader/plastikkirurgi-bryst' },
          { label: 'Kropp', path: '/behandlinger/flere-fagomrader/plastikkirurgi-kropp' },
          { label: 'Ansikt', path: '/behandlinger/flere-fagomrader/plastikkirurgi-ansikt' },
          { label: 'Rekonstruksjon', path: '/behandlinger/flere-fagomrader/plastikkirurgi-rekonstruksjon' },
        ],
      },
      {
        label: 'Psykologi',
        path: '/behandlinger/flere-fagomrader/psykologi',
        items: [
          { label: 'Angst og depresjon', path: '/behandlinger/flere-fagomrader/psykologi-angst-depresjon' },
          { label: 'Traumer', path: '/behandlinger/flere-fagomrader/psykologi-traumer' },
          { label: 'Parterapi og relasjoner', path: '/behandlinger/flere-fagomrader/psykologi-parterapi' },
        ],
      },
      {
        label: 'Revmatologi',
        path: '/behandlinger/flere-fagomrader/revmatologi',
        items: [
          { label: 'Leddgikt', path: '/behandlinger/flere-fagomrader/revmatologi-leddgikt' },
          { label: 'Artrose', path: '/behandlinger/flere-fagomrader/revmatologi-artrose' },
          { label: 'Bindevevssykdommer', path: '/behandlinger/flere-fagomrader/revmatologi-bindevev' },
        ],
      },
      {
        label: 'Robotassistert kirurgi',
        path: '/behandlinger/flere-fagomrader/robotkirurgi',
        items: [
          { label: 'Gynekologisk robotkirurgi', path: '/behandlinger/flere-fagomrader/robotkirurgi-gynekologi' },
          { label: 'Urologisk robotkirurgi', path: '/behandlinger/flere-fagomrader/robotkirurgi-urologi' },
          { label: 'Gastrokirurgisk robotkirurgi', path: '/behandlinger/flere-fagomrader/robotkirurgi-gastro' },
        ],
      },
      {
        label: 'Sexologi',
        path: '/behandlinger/flere-fagomrader/sexologi',
        items: [
          { label: 'Samliv og relasjoner', path: '/behandlinger/flere-fagomrader/sexologi-samliv' },
          { label: 'Seksuelle funksjonsplager', path: '/behandlinger/flere-fagomrader/sexologi-funksjon' },
          { label: 'Identitet og legning', path: '/behandlinger/flere-fagomrader/sexologi-identitet' },
        ],
      },
      {
        label: 'Åreknutebehandling',
        path: '/behandlinger/flere-fagomrader/areknuter',
        items: [
          { label: 'Sklerosering', path: '/behandlinger/flere-fagomrader/areknuter-sklerosering' },
          { label: 'Laserbehandling', path: '/behandlinger/flere-fagomrader/areknuter-laser' },
          { label: 'Kirurgisk fjerning', path: '/behandlinger/flere-fagomrader/areknuter-kirurgi' },
        ],
      },
    ],
  },
];
