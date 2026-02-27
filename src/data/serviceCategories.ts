export interface SubItem {
  label: string;
  anchor?: string;
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
          { label: 'Osteopat' },
          { label: 'Sexolog' },
          { label: 'Psykolog' },
          { label: 'Ernæringsfysiolog' },
        ]
      },
      { label: 'Gynekologisk undersøkelse', path: '/behandlinger/gynekologi/undersokelse' },
      { 
        label: 'Urinlekkasje', 
        path: '/behandlinger/gynekologi/urinlekkasje',
        items: [
          { label: 'Stressinkontinens' },
          { label: 'Tranginkontinens' },
          { label: 'Blandingsinkontinens' },
        ]
      },
      { 
        label: 'Endometriose', 
        path: '/behandlinger/gynekologi/endometriose',
        items: [
          { label: 'Symptomer' },
          { label: 'Kirurgi' },
        ]
      },
      { 
        label: 'Overgangsalder', 
        path: '/behandlinger/gynekologi/overgangsalder',
        items: [
          { label: 'Symptomer' },
          { label: 'Hormonbehandling' },
        ]
      },
      { label: 'Vaginale fremfall', path: '/behandlinger/gynekologi/vaginale-fremfall' },
      { label: 'Blødningsforstyrrelser', path: '/behandlinger/gynekologi/blodningsforstyrrelser' },
      { 
        label: 'Celleforandringer', 
        path: '/behandlinger/gynekologi/celleforandringer',
        items: [
          { label: 'HPV og celleforandring' },
          { label: 'Konisering' },
        ]
      },
      { 
        label: 'Cyster på eggstokkene', 
        path: '/behandlinger/gynekologi/cyster',
        items: [
          { label: 'Former for cyste' },
          { label: 'Behandling' },
        ]
      },
      { label: 'Fjerne livmor', path: '/behandlinger/gynekologi/fjerne-livmor' },
      { 
        label: 'Graviditet', 
        path: '/behandlinger/gynekologi/graviditet',
        items: [
          { label: 'Ultralyd' },
          { label: 'NIPT' },
          { label: 'Svangerskapsteam' },
        ]
      },
      { 
        label: 'Gynekologisk kirurgi', 
        path: '/behandlinger/gynekologi/kirurgi',
        items: [
          { label: 'Fremfalloperasjoner' },
          { label: 'Urinlekkasjeoperasjoner' },
          { label: 'Hysterektomi' },
          { label: 'Polypper og muskelknuter' },
          { label: 'Endometriosebehandling' },
        ]
      },
      { 
        label: 'Hormonforstyrrelser', 
        path: '/behandlinger/gynekologi/hormonforstyrrelser',
        items: [
          { label: 'PCOS' },
        ]
      },
      { 
        label: 'Hysteroskopi', 
        path: '/behandlinger/gynekologi/hysteroskopi',
        items: [
          { label: 'Office-hysteroskopi' },
        ]
      },
      { label: 'Labiaplastikk', path: '/behandlinger/gynekologi/labiaplastikk' },
      { 
        label: 'Robotkirurgi', 
        path: '/behandlinger/gynekologi/robotkirurgi',
        items: [
          { label: 'Muskelknuter' },
          { label: 'Dyp endometriose' },
          { label: 'Hysterektomi' },
        ]
      },
      { label: 'Spontanabort', path: '/behandlinger/gynekologi/spontanabort' },
      { label: 'Vulvalidelser', path: '/behandlinger/gynekologi/vulvalidelser' },
    ]
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
          { label: 'Robotkirurgi for nyrekreft' },
          { label: 'Nyrestein' },
        ]
      },
      { 
        label: 'Prostata', 
        path: '/behandlinger/urologi/prostata',
        items: [
          { label: 'Prostataundersøkelse' },
          { label: 'Robotkirurgi' },
        ]
      },
      { label: 'Refertilisering', path: '/behandlinger/urologi/refertilisering' },
      { 
        label: 'Robotkirurgi', 
        path: '/behandlinger/urologi/robotkirurgi',
        items: [
          { label: 'Prostatakreft (RALP)' },
          { label: 'Godartet forstørret prostata (RASP)' },
          { label: 'Brokk' },
        ]
      },
      { label: 'Sterilisering', path: '/behandlinger/urologi/sterilisering' },
      { 
        label: 'Testikler og pung', 
        path: '/behandlinger/urologi/testikler',
        items: [
          { label: 'Testikkelkreft' },
          { label: 'Kul i pungen' },
        ]
      },
    ]
  },
  {
    id: 'fertilitet',
    label: 'Fertilitet',
    path: '/fertilitet',
    subcategories: [
      { label: 'Infertilitet', path: '/behandlinger/fertilitet/infertilitet' },
      { label: 'Assistert befruktning', path: '/behandlinger/fertilitet/assistert-befruktning' },
      { 
        label: 'IVF', 
        path: '/behandlinger/fertilitet/ivf',
        items: [
          { label: 'Det første møtet' },
          { label: 'Fertilitetssjekk' },
          { label: 'Behandling' },
        ]
      },
      { label: 'Eggfrys', path: '/behandlinger/fertilitet/eggfrys' },
      { label: 'Donorbehandling', path: '/behandlinger/fertilitet/donorbehandling' },
      { label: 'Hysteroskopi', path: '/behandlinger/fertilitet/hysteroskopi' },
      { label: 'Sædanalyse', path: '/behandlinger/fertilitet/saedanalyse' },
      { label: 'Fertilitetsteamet', path: '/behandlinger/fertilitet/teamet' },
    ]
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
        label: 'Hudhelse', 
        path: '/behandlinger/flere-fagomrader/hudhelse',
        items: [
          { label: 'Hudpleie' },
          { label: 'Hudforyngelse' },
        ]
      },
      { label: 'Ernæringsfysiolog', path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
      { 
        label: 'Gastrokirurgi', 
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
        items: [
          { label: 'Bariatrisk kirurgi' },
          { label: 'Sleeve gastrektomi' },
          { label: 'Gallestein' },
          { label: 'Brokk' },
        ]
      },
      { label: 'Osteopati', path: '/behandlinger/flere-fagomrader/osteopati' },
      { 
        label: 'Overvektskirurgi', 
        path: '/behandlinger/flere-fagomrader/overvektskirurgi',
        items: [
          { label: 'Gastrisk bypass' },
          { label: 'Sleeve gastrektomi' },
          { label: 'Utredning' },
        ]
      },
      { label: 'Plastikkirurgi', path: '/behandlinger/flere-fagomrader/plastikkirurgi' },
      { label: 'Psykologi', path: '/behandlinger/flere-fagomrader/psykologi' },
      { 
        label: 'Revmatologi', 
        path: '/behandlinger/flere-fagomrader/revmatologi',
        items: [
          { label: 'Utredning' },
          { label: 'Revmatoid artritt' },
          { label: 'Lupus' },
        ]
      },
      { 
        label: 'Robotkirurgi', 
        path: '/behandlinger/flere-fagomrader/robotkirurgi',
        items: [
          { label: 'Muskelknuter' },
          { label: 'Dyp endometriose' },
          { label: 'Hysterektomi' },
          { label: 'Brokk' },
          { label: 'Prostatakreft (RALP)' },
          { label: 'Godartet forstørret prostata (RASP)' },
        ]
      },
      { label: 'Sexologi', path: '/behandlinger/flere-fagomrader/sexologi' },
      { 
        label: 'Åreknutebehandling', 
        path: '/behandlinger/flere-fagomrader/areknuter',
        items: [
          { label: 'Symptomer' },
          { label: 'Behandling' },
          { label: 'Ultralydundersøkelse' },
        ]
      },
    ]
  },
];
