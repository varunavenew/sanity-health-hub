/**
 * Migrate full treatment page content to Sanity (all fields, NO + EN).
 *
 * Source: test/sanity/data/treatment-full-content.json
 * Regenerate: node scripts/generate-treatment-full-content-json.mjs
 *
 * Usage:
 *   cd test && npm run migrate:treatment-full:dry
 *   cd test && npm run migrate:treatment-full
 *   ONLY_KEYS=fertilitet/donorbehandling npm run migrate:treatment-full
 *   SKIP_EN=1 npm run migrate:treatment-full:no-en
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sanityClient } from './config'
import { i18nStringTranslated, i18nTextTranslated } from './lib/treatment-i18n'
import { saveCache } from './lib/translate-free'
import {
  patchTreatmentFields,
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

type TreatmentSource = {
  title: string
  subtitle: string
  parentCategory: string
  description: string
  benefitsTitle: string
  benefits: string[]
  process: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
  sections: { id?: string; heading: string; content: string }[]
  linkedServices: { label: string; description?: string; path: string }[]
  relatedSpecialistSlugs: string[]
}

const dataPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'data/treatment-full-content.json',
)

async function buildTreatmentFields(source: TreatmentSource) {
  const sections = []
  for (let i = 0; i < (source.sections?.length ?? 0); i++) {
    const s = source.sections[i]
    sections.push({
      _type: 'object',
      _key: s.id || `sec${i}`,
      id: s.id || `section-${i}`,
      heading: await i18nStringTranslated(s.heading, TRANSLATE_EN),
      content: await i18nTextTranslated(s.content, TRANSLATE_EN),
    })
  }

  const process = []
  for (let i = 0; i < (source.process?.length ?? 0); i++) {
    const p = source.process[i]
    process.push({
      _type: 'object',
      _key: `step${i}`,
      title: await i18nStringTranslated(p.title, TRANSLATE_EN),
      description: await i18nTextTranslated(p.description, TRANSLATE_EN),
    })
  }

  const faqs = []
  for (let i = 0; i < (source.faqs?.length ?? 0); i++) {
    const f = source.faqs[i]
    faqs.push({
      _type: 'object',
      _key: `faq${i}`,
      question: await i18nStringTranslated(f.question, TRANSLATE_EN),
      answer: await i18nTextTranslated(f.answer, TRANSLATE_EN),
    })
  }

  const linkedServices = []
  for (let i = 0; i < (source.linkedServices?.length ?? 0); i++) {
    const ls = source.linkedServices[i]
    linkedServices.push({
      _type: 'object',
      _key: `ls${i}`,
      label: await i18nStringTranslated(ls.label, TRANSLATE_EN),
      description: await i18nTextTranslated(ls.description || '', TRANSLATE_EN),
      path: ls.path,
    })
  }

  const benefits = []
  for (const b of source.benefits ?? []) {
    benefits.push(await i18nStringTranslated(b, TRANSLATE_EN))
  }

  const relatedSpecialists = (source.relatedSpecialistSlugs ?? []).map((slug) => ({
    _type: 'reference',
    _ref: `specialist-${slug}`,
    _key: slug,
  }))

  return {
    title: await i18nStringTranslated(source.title, TRANSLATE_EN),
    subtitle: await i18nStringTranslated(source.subtitle || '', TRANSLATE_EN),
    parentCategoryLabel: await i18nStringTranslated(source.parentCategory, TRANSLATE_EN),
    description: await i18nTextTranslated(source.description || '', TRANSLATE_EN),
    benefitsTitle: await i18nStringTranslated(source.benefitsTitle || 'Hvorfor velge oss', TRANSLATE_EN),
    benefits,
    process,
    faqs,
    sections,
    linkedServices,
    relatedSpecialists,
  }
}

async function run() {
  if (!fs.existsSync(dataPath)) {
    console.error(`Missing ${dataPath}. Run: node scripts/generate-treatment-full-content-json.mjs`)
    process.exit(1)
  }

  const byKey = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as Record<string, TreatmentSource>
  const keys = ONLY_KEYS.length ? ONLY_KEYS.filter((k) => byKey[k]) : Object.keys(byKey)

  console.log(
    `🚀 Full treatment content migration${DRY_RUN ? ' (dry run)' : ''}${SKIP_EN ? ' [NO only]' : ' [NO + EN]'}`,
  )
  console.log(`   ${keys.length} treatment(s)\n`)

  const existingIds = await sanityClient.fetch<string[]>(`*[_type == "treatment"]._id`)
  const knownKeys = new Set<string>()
  for (const id of existingIds) {
    const key = treatmentKeyFromId(id)
    if (key) knownKeys.add(key)
  }

  let updated = 0
  const missing: string[] = []

  for (const key of keys) {
    const source = byKey[key]
    const docId = treatmentIdFromKey(key)

    if (!knownKeys.has(key)) {
      missing.push(key)
      console.warn(`   ⚠ No Sanity doc for ${key} (expected ${docId})`)
      continue
    }

    if (DRY_RUN) {
      console.log(`   [dry-run] ${key}`)
      updated++
      continue
    }

    const fields = await buildTreatmentFields(source)
    const patched = await patchTreatmentFields(docId, fields)
    if (patched.length) {
      updated++
      console.log(`   ✓ ${key} → ${patched.join(', ')}`)
    }
  }

  saveCache()
  console.log(`\n✅ Done. Updated ${updated} treatment(s).`)
  if (missing.length) {
    console.log(`   Missing docs: ${missing.length}`)
  }
  if (SKIP_EN) {
    console.log('\n   Run: ONLY=treatment npm run backfill:en')
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
