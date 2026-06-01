/**
 * Migrate all treatment content sections to Sanity (NO + EN i18n arrays).
 *
 * Source: test/sanity/data/treatment-sections.json
 * (regenerate: node scripts/generate-treatment-sections-json.mjs)
 *
 * Usage:
 *   cd test && npm run migrate:treatment-sections:dry
 *   cd test && npm run migrate:treatment-sections
 *   SKIP_EN=1 …           — write NO only (then: ONLY=treatment npm run backfill:en)
 *   ONLY_KEYS=fertilitet/donorbehandling — limit keys (comma-separated)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sanityClient } from './config'
import { i18nStringTranslated, i18nTextTranslated } from './lib/treatment-i18n'
import { saveCache } from './lib/translate-free'
import {
  setTreatmentSections,
  treatmentIdFromKey,
  treatmentKeyFromId,
} from './lib/patch-treatment'

const DRY_RUN = process.env.DRY_RUN === '1'
const SKIP_EN = process.env.SKIP_EN === '1'
const TRANSLATE_EN = !SKIP_EN
const ONLY_KEYS = (process.env.ONLY_KEYS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

type SectionSource = { id?: string; heading: string; content: string }

const dataPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'data/treatment-sections.json',
)

async function buildI18nSections(
  sections: SectionSource[],
): Promise<Array<{ _type: string; _key: string; id: string; heading: unknown; content: unknown }>> {
  const out = []
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i]
    const heading = await i18nStringTranslated(s.heading, TRANSLATE_EN)
    const content = await i18nTextTranslated(s.content, TRANSLATE_EN)
    out.push({
      _type: 'object',
      _key: s.id || `sec${i}`,
      id: s.id || `section-${i}`,
      heading,
      content,
    })
  }
  return out
}

async function run() {
  if (!fs.existsSync(dataPath)) {
    console.error(`Missing ${dataPath}. Run: node scripts/generate-treatment-sections-json.mjs`)
    process.exit(1)
  }

  const sectionsByKey = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Record<
    string,
    SectionSource[]
  >

  const keys = ONLY_KEYS.length
    ? ONLY_KEYS.filter((k) => sectionsByKey[k])
    : Object.keys(sectionsByKey)

  console.log(
    `🚀 Treatment sections migration${DRY_RUN ? ' (dry run)' : ''}${SKIP_EN ? ' [NO only]' : ' [NO + EN]'}`,
  )
  console.log(`   ${keys.length} treatment key(s)\n`)

  const existingIds = await sanityClient.fetch<string[]>(`*[_type == "treatment"]._id`)
  const keyById = new Map<string, string>()
  for (const id of existingIds) {
    const key = treatmentKeyFromId(id)
    if (key) keyById.set(id.replace(/^drafts\./, ''), key)
  }

  let updated = 0
  let skipped = 0
  const missing: string[] = []

  for (const key of keys) {
    const sections = sectionsByKey[key]
    if (!sections?.length) continue

    const docId = treatmentIdFromKey(key)
    const exists = keyById.has(docId)
    if (!exists) {
      missing.push(key)
      console.warn(`   ⚠ No Sanity doc for ${key} (expected _id ${docId})`)
      continue
    }

    if (DRY_RUN) {
      console.log(`   [dry-run] ${key} — ${sections.length} section(s)`)
      updated++
      continue
    }

    const i18nSections = await buildI18nSections(sections)
    const patched = await setTreatmentSections(docId, i18nSections)
    if (patched.length) {
      updated++
      console.log(`   ✓ ${key} → ${patched.join(', ')} (${sections.length} sections)`)
    } else {
      skipped++
    }
  }

  saveCache()

  console.log(`\n✅ Done. Updated ${updated}, skipped ${skipped}.`)
  if (missing.length) {
    console.log(`   Missing Sanity documents (${missing.length}): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`)
  }
  if (SKIP_EN) {
    console.log('\n   Run English backfill: ONLY=treatment npm run backfill:en')
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
