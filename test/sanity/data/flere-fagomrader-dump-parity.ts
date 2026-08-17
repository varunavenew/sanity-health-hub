/**
 * Dump-parity overrides for Flere tjenester treatment pages.
 * Source: avenewdemo.online flere-fagomrader dump (user-provided).
 */
export const FLERE_SIBLING_SLUGS = [
  "revmatologi",
  "endokrinologi",
  "plastikkirurgi",
  "osteopati",
  "sexologi",
  "psykologi",
  "ernaeringsfysiolog",
  "areknuter",
  "gastrokirurgi",
  "hudbehandlinger",
] as const;

export function siblingRelated(exclude: string): string[] {
  return FLERE_SIBLING_SLUGS.filter((s) => s !== exclude);
}

const HUD_CHILDREN = [
  "pigmentforandringer-og-solskader",
  "rodhet-og-synlige-blodkar",
  "forbedring-av-hudstruktur",
  "kosmetisk-dermatologi",
  "elastisitet-og-volum",
  "foflekksjekk",
] as const;

export function hudChildRelated(exclude: string): string[] {
  return HUD_CHILDREN.filter((s) => s !== exclude);
}

/** Related lists from dump (order preserved). Empty = hide related band. */
export const RELATED_BY_SLUG: Record<string, string[]> = {
  endokrinologi: siblingRelated("endokrinologi"),
  ernaeringsfysiolog: siblingRelated("ernaeringsfysiolog"),
  plastikkirurgi: siblingRelated("plastikkirurgi"),
  osteopati: siblingRelated("osteopati"),
  revmatologi: siblingRelated("revmatologi"),
  psykologi: siblingRelated("psykologi"),
  sexologi: siblingRelated("sexologi"),
  areknuter: siblingRelated("areknuter"),
  gastrokirurgi: siblingRelated("gastrokirurgi"),
  hudbehandlinger: siblingRelated("hudbehandlinger"),
  // Dump: no Relaterte tjenester band
  hudhelse: [],
  robotkirurgi: [],
  // Gastro children
  brokkoperasjon: ["overvektskirurgi", "hemorroider"],
  hemorroider: ["overvektskirurgi", "brokkoperasjon"],
  overvektskirurgi: ["brokkoperasjon", "hemorroider"],
  // Hudhelse children — "Andre ting"
  hudpleieprodukter: ["hudbehandlinger", "behandlingsutstyr"],
  behandlingsutstyr: ["hudbehandlinger", "hudpleieprodukter"],
  // Nested hudbehandlinger siblings
  foflekksjekk: hudChildRelated("foflekksjekk"),
  "kosmetisk-dermatologi": hudChildRelated("kosmetisk-dermatologi"),
  "elastisitet-og-volum": hudChildRelated("elastisitet-og-volum"),
  "forbedring-av-hudstruktur": hudChildRelated("forbedring-av-hudstruktur"),
  "pigmentforandringer-og-solskader": hudChildRelated(
    "pigmentforandringer-og-solskader",
  ),
  "rodhet-og-synlige-blodkar": hudChildRelated("rodhet-og-synlige-blodkar"),
};

export const RELATED_TITLE_BY_SLUG: Record<
  string,
  { no: string; en: string }
> = {
  hudpleieprodukter: {
    no: "Andre ting vi hjelper med",
    en: "Other ways we can help",
  },
  behandlingsutstyr: {
    no: "Andre ting vi hjelper med",
    en: "Other ways we can help",
  },
  overvektskirurgi: {
    no: "Relaterte tjenester",
    en: "Related services",
  },
};

/** Hero theme chips ("Vi behandler blant annet"). */
export const THEMES_BY_SLUG: Record<
  string,
  { no: string; en: string }[]
> = {
  endokrinologi: [
    { no: "Stoffskifte", en: "Metabolism" },
    { no: "Diabetes", en: "Diabetes" },
    { no: "Binyrer og hormoner", en: "Adrenals and hormones" },
  ],
  ernaeringsfysiolog: [
    { no: "Vekt og kosthold", en: "Weight and diet" },
    { no: "Matintoleranser", en: "Food intolerances" },
    { no: "Sykdomsernæring", en: "Clinical nutrition" },
  ],
  plastikkirurgi: [
    { no: "Bryst", en: "Breast" },
    { no: "Kropp", en: "Body" },
    { no: "Ansikt", en: "Face" },
    { no: "Rekonstruksjon", en: "Reconstruction" },
  ],
  robotkirurgi: [
    { no: "Gynekologisk robotkirurgi", en: "Gynaecological robotic surgery" },
    { no: "Urologisk robotkirurgi", en: "Urological robotic surgery" },
    { no: "Gastrokirurgisk robotkirurgi", en: "Gastrointestinal robotic surgery" },
  ],
  areknuter: [
    { no: "Sklerosering", en: "Sclerotherapy" },
    { no: "Laserbehandling", en: "Laser treatment" },
    { no: "Kirurgisk fjerning", en: "Surgical removal" },
  ],
  osteopati: [
    { no: "Nakke og rygg", en: "Neck and back" },
    { no: "Kroniske smerter", en: "Chronic pain" },
    { no: "Bekkenrelaterte plager", en: "Pelvic-related symptoms" },
  ],
  revmatologi: [
    { no: "Leddgikt", en: "Rheumatoid arthritis" },
    { no: "Artrose", en: "Osteoarthritis" },
    { no: "Bindevevssykdommer", en: "Connective tissue diseases" },
  ],
  psykologi: [
    { no: "Angst og depresjon", en: "Anxiety and depression" },
    { no: "Traumer", en: "Trauma" },
    { no: "Parterapi og relasjoner", en: "Couples therapy and relationships" },
  ],
  sexologi: [
    { no: "Samliv og relasjoner", en: "Partnership and relationships" },
    { no: "Seksuelle funksjonsplager", en: "Sexual function concerns" },
    { no: "Identitet og legning", en: "Identity and orientation" },
  ],
};

export const THEMES_ARIA = {
  no: "Vi behandler blant annet:",
  en: "We treat, among other things:",
} as const;
