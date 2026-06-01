/**
 * Wrap clinicPage.hours in internationalizedArrayString (NO + EN).
 *
 * Run: cd test && npm run migrate:clinic-hours
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const HOURS_EN: Record<string, string> = {
  bekkestua: 'Mon–Fri 08:00–16:00',
  majorstuen: 'Mon–Fri 08:00–16:00',
  moelv: 'Mon–Fri 08:30–15:30',
  moss: 'Mon–Fri 08:00–15:30',
  ski: 'Mon–Fri 08:00–16:00',
}

type I18nItem = { _type: string; language: string; value: string }

function isI18nArray(val: unknown): val is I18nItem[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    (val[0] as I18nItem)._type?.startsWith('internationalizedArray')
  )
}

function pickNo(val: unknown): string {
  if (typeof val === 'string') return val.trim()
  if (!isI18nArray(val)) return ''
  const no = val.find((i) => i.language === 'no') || val[0]
  return typeof no?.value === 'string' ? no.value.trim() : ''
}

function slugFromId(id: string): string {
  return id.replace(/^drafts\./, '').replace(/^clinicPage-/, '')
}

function i18nHours(no: string, en: string): I18nItem[] {
  return [
    { _type: 'internationalizedArrayStringValue', language: 'no', value: no },
    { _type: 'internationalizedArrayStringValue', language: 'en', value: en },
  ]
}

function needsHoursFix(hours: unknown): boolean {
  if (typeof hours === 'string' && hours.trim()) return true
  if (!isI18nArray(hours)) return typeof hours === 'string'
  return !hours.some((i) => i.language === 'en' && i.value?.trim())
}

async function run() {
  // Include drafts — Studio edits drafts; published-only migration left drafts as plain strings.
  const docs = await sanityClient.fetch<
    { _id: string; hours?: unknown; slug?: { current?: string } }[]
  >(`*[_type == "clinicPage"]{ _id, hours, slug }`)

  let updated = 0
  for (const doc of docs) {
    const slug = doc.slug?.current || slugFromId(doc._id)
    if (!slug || slug.startsWith('f7def66e')) {
      console.log(`  · ${doc._id} — skipped (no slug)`)
      continue
    }

    const no =
      pickNo(doc.hours) ||
      (typeof doc.hours === 'string' ? doc.hours.trim() : '')

    if (!no) {
      console.log(`  · ${doc._id} — no hours, skipped`)
      continue
    }

    if (!needsHoursFix(doc.hours)) {
      console.log(`  · ${doc._id} — already valid i18n`)
      continue
    }

    const en =
      HOURS_EN[slug] ||
      no.replace(/Man–Fre/g, 'Mon–Fri').replace(/Man-Fre/g, 'Mon–Fri')

    console.log(`  ✎ ${doc._id} (${slug})`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ hours: i18nHours(no, en) })
        .commit({ autoGenerateArrayKeys: true })
    }
    updated++
  }
  console.log(`\n✓ ${updated} clinic document(s)${DRY_RUN ? ' (dry run)' : ''}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
