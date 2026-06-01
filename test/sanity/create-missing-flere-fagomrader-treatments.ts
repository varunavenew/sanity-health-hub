/**
 * Create missing flere-fagomrader treatment documents in Sanity (NO + EN content).
 *
 * Source: test/sanity/data/treatment-full-content.json
 *
 * Usage:
 *   cd test && npm run create:flere-fagomrader-treatments:dry
 *   cd test && npm run create:flere-fagomrader-treatments
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { sanityClient } from './config'
import { i18nStringTranslated, i18nTextTranslated } from './lib/treatment-i18n'
import { saveCache } from './lib/translate-free'
import { treatmentIdFromKey, treatmentKeyFromId } from './lib/patch-treatment'

const DRY_RUN = process.env.DRY_RUN === '1'
const SKIP_EN = process.env.SKIP_EN === '1'
const TRANSLATE_EN = !SKIP_EN
const CATEGORY_REF = 'category-flere-fagomrader'

const TARGET_PREFIX = 'flere-fagomrader/'

type TreatmentSource = {
  title: string
  subtitle: string
  parentCategory: string
  description: string
  benefitsTitle?: string
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

function slugKey(): string {
  return randomBytes(8).toString('hex')
}

function slugify(input: string): string {
  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return cleaned.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
}

function pickI18nStringValue(arr: unknown, lang: 'no' | 'en'): string {
  if (!Array.isArray(arr)) return ''
  const match = arr.find((e: { language?: string; _key?: string; value?: string }) => {
    return (e.language || e._key) === lang
  })
  return (match?.value as string) || ''
}

function buildSlugArray(noSlug: string, enSlug: string) {
  return [
    {
      _key: slugKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current: noSlug },
    },
    {
      _key: slugKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: { _type: 'slug', current: enSlug || noSlug },
    },
  ]
}

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

  const existingIds = await sanityClient.fetch<string[]>(`*[_type == "treatment"]._id`)
  const knownKeys = new Set<string>()
  for (const id of existingIds) {
    const key = treatmentKeyFromId(id)
    if (key) knownKeys.add(key)
  }

  const toCreate = Object.keys(byKey).filter(
    (k) => k.startsWith(TARGET_PREFIX) && !knownKeys.has(k),
  )

  console.log(
    `🚀 Create missing flere-fagomrader treatments${DRY_RUN ? ' (dry run)' : ''}${SKIP_EN ? ' [NO only]' : ' [NO + EN]'}`,
  )
  console.log(`   ${toCreate.length} document(s) to create\n`)

  if (toCreate.length === 0) {
    console.log('✅ Nothing to create — all flere-fagomrader treatments already exist.')
    return
  }

  const newRefs: { _type: 'reference'; _ref: string; _key: string }[] = []

  for (const key of toCreate) {
    const source = byKey[key]
    const docId = treatmentIdFromKey(key)
    const noSlug = key.split('/')[1] || slugify(source.title)
    const fields = await buildTreatmentFields(source)
    const enTitle = pickI18nStringValue(fields.title, 'en') || source.title
    const enSlug = slugify(enTitle) || noSlug

    const doc = {
      _id: docId,
      _type: 'treatment',
      category: { _type: 'reference', _ref: CATEGORY_REF },
      slug: buildSlugArray(noSlug, enSlug),
      ...fields,
    }

    console.log(`   • ${key} → ${docId} (slug: ${noSlug} / ${enSlug})`)

    if (!DRY_RUN) {
      await sanityClient.createOrReplace(doc)
      newRefs.push({ _type: 'reference', _ref: docId, _key: docId })
    }
  }

  if (!DRY_RUN && newRefs.length > 0) {
    const category = await sanityClient.fetch<{ _id: string; treatments?: unknown[] } | null>(
      `*[_type == "treatmentCategory" && categoryId == "flere-fagomrader"][0]{ _id, treatments }`,
    )
    if (category?._id) {
      const existing = Array.isArray(category.treatments) ? category.treatments : []
      const existingRefs = new Set(
        existing.map((r: { _ref?: string }) => r?._ref).filter(Boolean),
      )
      const merged = [
        ...existing,
        ...newRefs.filter((r) => !existingRefs.has(r._ref)),
      ]
      await sanityClient.patch(category._id).set({ treatments: merged }).commit()
      console.log(`\n   ✓ Linked ${newRefs.length} treatment(s) on ${category._id}`)
    }
  }

  saveCache()
  console.log(`\n✅ Done. ${DRY_RUN ? 'Would create' : 'Created'} ${toCreate.length} treatment(s).`)
  if (!DRY_RUN) {
    console.log('   Next: npm run migrate:slugs:en  (if any slug still missing EN)')
  }
}

run().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
