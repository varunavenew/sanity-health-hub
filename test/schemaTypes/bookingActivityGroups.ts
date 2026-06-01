/** Metodika wbactivitygroups — used in specialist schema and migrations. */
export const BOOKING_ACTIVITY_GROUP_OPTIONS = [
  { id: 1, name: 'Fertilitet' },
  { id: 3, name: 'Sædanalyse' },
  { id: 6, name: 'Urolog' },
  { id: 8, name: 'Gynekolog' },
  { id: 10, name: 'Fostermedisiner - graviditet' },
  { id: 11, name: 'Fysioterapeut / Osteopat' },
  { id: 12, name: 'Sexolog' },
  { id: 13, name: 'Klinisk Ernæringsfysiolog' },
  { id: 16, name: 'Hudlege' },
  { id: 17, name: 'Ortoped' },
  { id: 19, name: 'Psykolog' },
  { id: 23, name: 'Gastrokirurg' },
  { id: 27, name: 'Revmatolog' },
  { id: 30, name: 'Åreknuter' },
  { id: 33, name: 'Endokrinolog' },
  { id: 35, name: 'Sprengte blodkar' },
  { id: 36, name: 'Håndterapeut' },
] as const

export const BOOKING_ACTIVITY_GROUP_IDS = BOOKING_ACTIVITY_GROUP_OPTIONS.map((o) => o.id)

export const bookingActivityGroupList = BOOKING_ACTIVITY_GROUP_OPTIONS.map((o) => ({
  title: `#${o.id} · ${o.name}`,
  value: o.id,
}))
