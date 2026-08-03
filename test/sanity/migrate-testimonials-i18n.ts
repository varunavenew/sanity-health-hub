/**
 * Wrap testimonial text/location/treatment plain strings in internationalizedArray
 * shape (developer dataset alignment). Idempotent — skips fields already i18n.
 *
 * Production already uses i18n arrays; this script is for developer only.
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-testimonials-i18n.ts
 *   npx tsx sanity/migrate-testimonials-i18n.ts
 */
import { sanityClient } from './config'
import { DATASET } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nItem = {_type: string; language: string; value: string}

function isI18nArray(val: unknown): val is I18nItem[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    typeof (val[0] as I18nItem)._type === 'string' &&
    (val[0] as I18nItem)._type.startsWith('internationalizedArray')
  )
}

function i18nText(no: string): I18nItem[] {
  return [{_type: 'internationalizedArrayTextValue', language: 'no', value: no}]
}

function i18nString(no: string): I18nItem[] {
  return [{_type: 'internationalizedArrayStringValue', language: 'no', value: no}]
}

function wrapField(
  value: unknown,
  kind: 'text' | 'string',
): I18nItem[] | undefined {
  if (value == null) return undefined
  if (isI18nArray(value)) return undefined
  if (typeof value !== 'string' || !value.trim()) return undefined
  return kind === 'text' ? i18nText(value.trim()) : i18nString(value.trim())
}

async function run() {
  if (DATASET === 'production') {
    console.error('Refusing to run on production — data is already i18n-shaped.')
    process.exit(1)
  }

  const docs = await sanityClient.fetch<
    {
      _id: string
      name: string
      text?: unknown
      location?: unknown
      treatment?: unknown
    }[]
  >(`*[_type == "testimonial"] | order(name asc)`)

  let updated = 0
  for (const doc of docs) {
    const patch: Record<string, I18nItem[]> = {}
    const text = wrapField(doc.text, 'text')
    const location = wrapField(doc.location, 'string')
    const treatment = wrapField(doc.treatment, 'string')
    if (text) patch.text = text
    if (location) patch.location = location
    if (treatment) patch.treatment = treatment

    if (Object.keys(patch).length === 0) {
      console.log(`  · ${doc._id} — already i18n`)
      continue
    }

    console.log(`  ✎ ${doc._id} (${doc.name}) — ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit({autoGenerateArrayKeys: true})
    }
    updated++
  }

  console.log(
    `\n✓ ${DRY_RUN ? 'Would update' : 'Updated'} ${updated} testimonial(s) on ${DATASET}`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
