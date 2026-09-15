/**
 * Seed Site Settings `emergencyNoticeText` (113 line) when missing.
 *
 * One editable string for Ortopedi, Gynekologi and Øvrige.
 *
 * Usage:
 *   cd test && npm run migrate:emergency-notice:dry
 *   cd test && npm run migrate:emergency-notice
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const DEFAULT_NO = 'Ved livstruende akutte behov — ring 113.'
const DEFAULT_EN = 'In life-threatening emergencies — call 113.'

function i18nString(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

type SettingsDoc = {
  _id: string
  emergencyNoticeText?: unknown
}

function hasText(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (!Array.isArray(value)) return false
  return value.some((item) => {
    const text = typeof item?.value === 'string' ? item.value.trim() : ''
    return text.length > 0
  })
}

async function main() {
  console.log(`Emergency notice (113) migration — DRY_RUN=${DRY_RUN}`)

  const docs = await client.fetch<SettingsDoc[]>(
    `*[_type == "siteSettings"]{_id, emergencyNoticeText}`,
  )

  if (docs.length === 0) {
    console.error('No siteSettings documents found — STOP')
    process.exit(1)
  }

  const patch = {emergencyNoticeText: i18nString(DEFAULT_NO, DEFAULT_EN)}

  for (const doc of docs) {
    if (hasText(doc.emergencyNoticeText)) {
      console.log(`skip ${doc._id}: emergencyNoticeText already set`)
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] patch ${doc._id}`, patch)
      continue
    }

    await client.patch(doc._id).set(patch).commit()
    console.log(`Updated ${doc._id} emergencyNoticeText`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
