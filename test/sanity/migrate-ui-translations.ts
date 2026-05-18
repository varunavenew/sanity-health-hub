/**
 * Migration: flatten src/i18n/locales/{nb,en}.json into a single
 * `uiTranslations` Sanity document so editors can change UI labels.
 *
 * Run:
 *   SANITY_TOKEN=... npx tsx test/sanity/migrate-ui-translations.ts
 *
 * Idempotent — replaces the document's `entries[]` on each run.
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sanityClient } from './config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')

type Bundle = Record<string, unknown>

function flatten(obj: Bundle, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Bundle, key))
    } else if (v != null) {
      out[key] = String(v)
    }
  }
  return out
}

async function main() {
  const nb = JSON.parse(readFileSync(resolve(root, 'src/i18n/locales/nb.json'), 'utf8'))
  const en = JSON.parse(readFileSync(resolve(root, 'src/i18n/locales/en.json'), 'utf8'))

  const nbFlat = flatten(nb)
  const enFlat = flatten(en)

  const allKeys = Array.from(new Set([...Object.keys(nbFlat), ...Object.keys(enFlat)])).sort()
  const entries = allKeys.map((key) => ({
    _key: key.replace(/\./g, '_'),
    _type: 'entry',
    key,
    nb: nbFlat[key] ?? '',
    en: enFlat[key] ?? '',
  }))

  console.log(`📦 ${entries.length} translation keys`)

  await sanityClient.createOrReplace({
    _id: 'uiTranslations',
    _type: 'uiTranslations',
    title: 'UI-tekster (nav, knapper, etiketter)',
    entries,
  })

  console.log('✅ uiTranslations updated')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
