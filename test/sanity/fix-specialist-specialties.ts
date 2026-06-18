/**
 * Normalize specialist `specialties` and `education` arrays to object items.
 *
 * Fixes Studio error: "Some items in this list are not objects"
 * caused by legacy migrations writing plain strings or bare i18n arrays.
 *
 * Run:
 *   cd test && npm run fix:specialist-specialties:dry
 *   cd test && npm run fix:specialist-specialties
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nEntry = { _key?: string; language?: string; value?: string }

function pickNo(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const entry =
    value.find((x) => (x as I18nEntry).language === 'no' || (x as I18nEntry)._key === 'no') ||
    value[0]
  if (!entry || typeof entry !== 'object') return ''
  const raw = (entry as I18nEntry).value
  return typeof raw === 'string' ? raw.trim() : ''
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function toI18nLabel(value: unknown): I18nEntry[] | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    return [{ _key: 'no', language: 'no', value: trimmed }]
  }
  if (!Array.isArray(value) || value.length === 0) return null
  const first = value[0]
  if (first && typeof first === 'object' && 'value' in first) {
    const cleaned = value
      .filter((entry) => entry && typeof entry === 'object' && typeof (entry as I18nEntry).value === 'string')
      .map((entry) => {
        const e = entry as I18nEntry
        const lang = e.language || e._key || 'no'
        return { _key: e._key || lang, language: e.language || lang, value: e.value!.trim() }
      })
      .filter((entry) => entry.value)
    return cleaned.length > 0 ? cleaned : null
  }
  return null
}

function normalizeItem(
  entry: unknown,
  index: number,
  itemType: 'specialtyItem' | 'educationItem',
  keyPrefix: string,
): Record<string, unknown> | null {
  if (entry == null) return null

  if (typeof entry === 'string') {
    const label = toI18nLabel(entry)
    if (!label) return null
    const text = pickNo(label)
    return {
      _type: itemType,
      _key: `${keyPrefix}-${slugify(text) || index}`,
      label,
    }
  }

  if (Array.isArray(entry)) {
    const label = toI18nLabel(entry)
    if (!label) return null
    const text = pickNo(label)
    return {
      _type: itemType,
      _key: `${keyPrefix}-${slugify(text) || index}`,
      label,
    }
  }

  if (typeof entry === 'object') {
    const obj = entry as Record<string, unknown>
    const labelSource = 'label' in obj ? obj.label : obj
    const label = toI18nLabel(labelSource)
    if (!label) return null
    const text = pickNo(label)
    const existingKey = typeof obj._key === 'string' ? obj._key : undefined
    return {
      _type: itemType,
      _key: existingKey || `${keyPrefix}-${slugify(text) || index}`,
      label,
    }
  }

  return null
}

function normalizeList(
  items: unknown,
  itemType: 'specialtyItem' | 'educationItem',
  keyPrefix: string,
): Record<string, unknown>[] | undefined {
  if (!Array.isArray(items)) return undefined
  const normalized = items
    .map((entry, index) => normalizeItem(entry, index, itemType, keyPrefix))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
  return normalized
}

function listNeedsFix(items: unknown, itemType: string): boolean {
  if (!Array.isArray(items) || items.length === 0) return false
  return items.some((entry) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return true
    const obj = entry as Record<string, unknown>
    return obj._type !== itemType || !obj.label
  })
}

async function run() {
  const docs = await sanityClient.fetch<
    { _id: string; name?: string; specialties?: unknown; education?: unknown }[]
  >(`*[_type == "specialist"]{ _id, name, specialties, education }`)

  console.log(`▶ Fix specialist specialties/education (${docs.length} docs)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let fixed = 0

  for (const doc of docs) {
    const patch: Record<string, unknown> = {}

    if (listNeedsFix(doc.specialties, 'specialtyItem')) {
      const normalized = normalizeList(doc.specialties, 'specialtyItem', 'spec')
      if (normalized?.length) patch.specialties = normalized
    }

    if (listNeedsFix(doc.education, 'educationItem')) {
      const normalized = normalizeList(doc.education, 'educationItem', 'edu')
      if (normalized?.length) patch.education = normalized
    }

    if (Object.keys(patch).length === 0) continue

    console.log(`  ✎ ${doc.name ?? doc._id} (${doc._id}) → ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    fixed++
  }

  console.log(`\n✓ ${DRY_RUN ? 'Would fix' : 'Fixed'} ${fixed} document(s)`)
}

run().catch((err) => {
  console.error('❌ Fix failed:', err)
  process.exit(1)
})
