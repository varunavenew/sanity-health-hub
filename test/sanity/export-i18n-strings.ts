/**
 * Export all unique Norwegian strings from i18n fields (for building a static cache).
 * Run: npx tsx sanity/export-i18n-strings.ts > sanity/i18n-strings-no.json
 */
import { writeFileSync } from 'fs'
import { join } from 'path'
import { sanityClient } from './config'

const I18N_VALUE_TYPES = new Set([
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArrayBlockContentValue',
])

const DOCUMENT_TYPES = [
  'article', 'aboutPage', 'treatment', 'treatmentCategory', 'homepage',
  'contactPage', 'clinicPage', 'servicesPage', 'insurancePage', 'themePage',
  'pricingPage', 'specialistsPage', 'specialist', 'privacyPolicyPage',
]

function collectStrings(node: unknown, set: Set<string>) {
  if (node == null) return
  if (Array.isArray(node)) {
    const isI18n =
      node.length > 0 &&
      typeof node[0] === 'object' &&
      node[0] !== null &&
      I18N_VALUE_TYPES.has((node[0] as { _type: string })._type)
    if (isI18n) {
      const no = (node as { language?: string; _key?: string; value?: unknown }[]).find(
        (e) => (e.language || e._key) === 'no'
      )
      if (no?.value != null) addValue(no.value, set)
      return
    }
    node.forEach((c) => collectStrings(c, set))
    return
  }
  if (typeof node === 'object') {
    for (const k of Object.keys(node as object)) {
      if (!k.startsWith('_')) collectStrings((node as Record<string, unknown>)[k], set)
    }
  }
}

function addValue(value: unknown, set: Set<string>) {
  if (typeof value === 'string' && value.trim()) set.add(value.trim())
  else if (Array.isArray(value)) {
    for (const block of value) {
      const b = block as { _type?: string; children?: { text?: string }[] }
      if (b._type === 'block' && b.children) {
        for (const c of b.children) {
          if (c.text?.trim()) set.add(c.text.trim())
        }
      }
    }
  }
}

async function run() {
  const all = new Set<string>()
  for (const t of DOCUMENT_TYPES) {
    const docs = await sanityClient.fetch<Record<string, unknown>[]>(`*[_type == "${t}"]`)
    for (const doc of docs) collectStrings(doc, all)
  }
  const list = [...all].sort()
  const out = join(__dirname, 'i18n-strings-no.json')
  writeFileSync(out, JSON.stringify(list, null, 2))
  console.error(`Wrote ${list.length} strings to ${out}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
