/**
 * Maps static website specialist data → Metodika booking activity group ids.
 * Mirrors InlineBookingSection categoryToBookingIds + per-role mapping for "annet".
 */
import { STATIC_SPECIALIST_CATEGORIES } from './static-specialist-categories'

/** Static booking group keys (InlineBookingSection) → API numeric id. */
export const BOOKING_GROUP_KEY_TO_NUMERIC_ID: Record<string, number> = {
  fertilitet: 1,
  saedanalyse: 3,
  urolog: 6,
  gynekolog: 8,
  fostermedisiner: 10,
  fysioterapeut: 11,
  sexolog: 12,
  ernaringsfysiolog: 13,
  hudlege: 16,
  ortoped: 17,
  psykolog: 19,
  gastrokirurg: 23,
  revmatolog: 27,
  areknuter: 30,
  endokrinolog: 33,
  'sprengte-blodkar': 35,
  handterapeut: 36,
}

/** Site category slug → booking group keys (from InlineBookingSection). */
export const STATIC_CATEGORY_TO_BOOKING_KEYS: Record<string, string[]> = {
  gynekologi: ['gynekolog', 'fostermedisiner'],
  fertilitet: ['fertilitet'],
  urologi: ['urolog'],
  ortopedi: ['ortoped', 'handterapeut'],
  annet: [
    'gastrokirurg',
    'ernaringsfysiolog',
    'psykolog',
    'sexolog',
    'endokrinolog',
    'revmatolog',
    'hudlege',
    'fysioterapeut',
    'areknuter',
    'sprengte-blodkar',
  ],
}

/** Specialist slug → role title (from src/data/specialists / migrate-content). */
export const STATIC_SPECIALIST_TITLES: Record<string, { title: string; subtitle?: string }> = {
  'alenka-bindas': { title: 'Gynekolog' },
  'anamika-choudhury': { title: 'Embryolog', subtitle: 'Fertilitet' },
  'andreas-edenberg': { title: 'Gastrokirurg' },
  'ane-gerda-z-eriksson': { title: 'Gynekolog' },
  'are-haukaen-stodle': { title: 'Ortoped' },
  'ashi-ahmad': { title: 'Gynekolog', subtitle: 'Fødselshjelp' },
  'audun-hoegh-tangerud': { title: 'Ortoped' },
  'birgir-gudbrandsson': { title: 'Revmatolog' },
  'birgitte-aspenes': { title: 'Gynekolog' },
  'birgitte-mitlid-mork': { title: 'Fertilitetslege', subtitle: 'Gynekolog' },
  'bjorn-brennhovd': { title: 'Urolog' },
  'bjorn-robstad': { title: 'Ortoped' },
  'cennet-akdeni': { title: 'Endokrinolog' },
  'einar-andre-brevik': { title: 'Karkirurg' },
  'endre-soreide': { title: 'Ortoped' },
  'erik-berg': { title: 'Plastikkirurg' },
  'gilbert-moatshe': { title: 'Ortoped' },
  'gunnar-dalen': { title: 'Karkirurg' },
  'hannah-russell': { title: 'Fertilitetslege', subtitle: 'Gynekolog' },
  'henrik-michelsen-wahl': { title: 'Gynekolog' },
  'ida-waagsbo-bjorntvedt': { title: 'Fertilitetslege', subtitle: 'Gynekolog' },
  'ingvild-skarpas-aannerud': { title: 'Osteopat' },
  'istvan-zoltan-rigo': { title: 'Ortoped' },
  'jackson-tok': { title: 'Fertilitetslege', subtitle: 'Gynekolog' },
  'jan-roland-lambrecht': { title: 'Gastrokirurg' },
  'jan-ragnar-haugstvedt': { title: 'Ortoped' },
  'jeanette-follestad': { title: 'Sykepleier', subtitle: 'Fertilitet' },
  'jonas-rydinge': { title: 'Ortoped' },
  'jorgen-perminow': { title: 'Gynekolog' },
  'kjersti-brenden': { title: 'Fertilitetslege', subtitle: 'Gynekolog' },
  'kjersti-margrete-finsrud': { title: 'Sexolog' },
  'kristian-marstrand-warholm': { title: 'Ortoped' },
  'kristian-ophaug': { title: 'Fertilitetscoach', subtitle: 'Familieterapeut' },
  'lars-eldar-myrseth': { title: 'Ortoped' },
  'lars-fredrik-qvigstad': { title: 'Urolog' },
  'line-fusdahl-hulleberg': { title: 'Sykepleier', subtitle: 'Fertilitet' },
  'line-jacob': { title: 'Gynekolog' },
  'linn-myrtveit-stensrud': { title: 'Psykolog, PhD' },
  'linnea-torsnes': { title: 'Hudlege' },
  'madeleine-engen': { title: 'Gynekolog' },
  'marc-jacob-strauss': { title: 'Ortoped' },
  'mari-borge-eskerud': { title: 'Ernæringsfysiolog' },
  'maria-thompson-clausen': { title: 'Ernæringsfysiolog' },
  'marian-bale': { title: 'Gastrokirurg' },
  'marthe-hagen': { title: 'Psykolog' },
  'mia-kitter': { title: 'Osteopat' },
  'morten-andersen': { title: 'Urolog' },
  'nabeel-yousaf-khan': { title: 'Urolog' },
  'nicolai-wessel': { title: 'Urolog' },
  'siri-klokstad': { title: 'Gynekolog' },
  'sondre-hassellund': { title: 'Ortoped' },
  'sonu-lukose': { title: 'Embryolog', subtitle: 'Fertilitet' },
  'stig-hegna': { title: 'Ortoped' },
  'tea-berge': { title: 'Ortoped' },
  'thomas-fredrik-thaulow': { title: 'Gynekolog' },
  'tom-henry-sundoen': { title: 'Ortoped' },
  'tonje-westlie': { title: 'Fysioterapeut', subtitle: 'Håndterapeut' },
  'trond-jorgensen': { title: 'Urolog' },
}

function normalizeRoleText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Match role/title text to booking group keys (for annet / ambiguous roles). */
function bookingKeysFromRoleText(title: string, subtitle?: string): string[] {
  const text = normalizeRoleText(`${title} ${subtitle ?? ''}`)
  const keys: string[] = []

  if (text.includes('gynekolog')) keys.push('gynekolog')
  if (text.includes('fostermedisin') || text.includes('graviditet')) keys.push('fostermedisiner')
  if (text.includes('fertilitet') || text.includes('embryolog') || text.includes('sykepleier'))
    keys.push('fertilitet')
  if (text.includes('saed') || text.includes('sæd')) keys.push('saedanalyse')
  if (text.includes('urolog')) keys.push('urolog')
  if (text.includes('ortoped') || text.includes('handkirurg')) keys.push('ortoped')
  if (text.includes('handterapeut')) keys.push('handterapeut')
  if (text.includes('gastro')) keys.push('gastrokirurg')
  if (text.includes('revmatolog')) keys.push('revmatolog')
  if (text.includes('endokrinolog')) keys.push('endokrinolog')
  if (text.includes('sexolog')) keys.push('sexolog')
  if (text.includes('psykolog')) keys.push('psykolog')
  if (text.includes('hudlege') || text.includes('dermatolog')) keys.push('hudlege')
  if (text.includes('ernaeringsfysiolog') || text.includes('ernæringsfysiolog'))
    keys.push('ernaringsfysiolog')
  if (text.includes('osteopat') || text.includes('fysioterapeut')) keys.push('fysioterapeut')
  if (text.includes('karkirurg') || text.includes('areknut') || text.includes('åreknut'))
    keys.push('areknuter')
  if (text.includes('sprengte') && text.includes('blodkar')) keys.push('sprengte-blodkar')

  return [...new Set(keys)]
}

function keysToNumericIds(keys: string[]): number[] {
  const ids = keys
    .map((k) => BOOKING_GROUP_KEY_TO_NUMERIC_ID[k])
    .filter((id): id is number => typeof id === 'number')
  return [...new Set(ids)].sort((a, b) => a - b)
}

/** Resolve booking category ids for one specialist (static site rules). */
export function bookingCategoryIdsForSpecialist(
  slug: string,
  siteCategory: string,
): number[] {
  const role = STATIC_SPECIALIST_TITLES[slug]

  if (siteCategory === 'annet' && role) {
    const fromRole = keysToNumericIds(bookingKeysFromRoleText(role.title, role.subtitle))
    if (fromRole.length > 0) return fromRole
  }

  const keys = STATIC_CATEGORY_TO_BOOKING_KEYS[siteCategory] ?? []
  return keysToNumericIds(keys)
}

/** All static specialists with resolved booking ids. */
export function allStaticSpecialistBookingIds(): { slug: string; ids: number[] }[] {
  return STATIC_SPECIALIST_CATEGORIES.map(({ slug, category }) => ({
    slug,
    ids: bookingCategoryIdsForSpecialist(slug, category),
  }))
}
