/**
 * Move treatment-page UI fields from treatmentCategory → treatment documents,
 * then remove unused category fields.
 *
 * Usage:
 *   cd test && npm run migrate:treatment-page-ui:dry
 *   cd test && npm run migrate:treatment-page-ui
 */
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import {
  defaultPageUi,
  treatmentCategoryBottomCtaByKey,
} from './data/treatment-category-bottom-cta'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type CategoryRow = {
  _id: string
  categoryId?: string
  quickInfoItems?: unknown[]
  faqSectionTitle?: unknown
  bottomCta?: Record<string, unknown>
}

type TreatmentRow = {
  _id: string
  title?: unknown
  quickInfoItems?: unknown[]
  faqSectionTitle?: unknown
  bottomCta?: Record<string, unknown>
  category?: { _id?: string; categoryId?: string }
}

function hasNoEnI18n(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim() && pickForLang(value, 'en')?.trim())
}

function hasQuickInfoItems(items: unknown[] | undefined): boolean {
  if (!Array.isArray(items) || items.length === 0) return false
  return items.every((item) => hasNoEnI18n(item))
}

function hasBottomCta(cta: Record<string, unknown> | undefined): boolean {
  if (!cta) return false
  return (
    hasNoEnI18n(cta.title) &&
    hasNoEnI18n(cta.subtitle) &&
    hasNoEnI18n(cta.primaryLabel) &&
    hasNoEnI18n(cta.secondaryLabel) &&
    Boolean(String(cta.secondaryPath || '').trim())
  )
}

function quickInfoFromDefaults(categoryId: string) {
  const copy = treatmentCategoryBottomCtaByKey[categoryId]
  const items = copy?.quickInfoItems ?? defaultPageUi.quickInfoItems
  return items.map((item) => i18nString(item.no, item.en))
}

function pageUiFromDefaults(categoryId: string) {
  const copy = treatmentCategoryBottomCtaByKey[categoryId]
  if (!copy) return null
  return {
    quickInfoItems: quickInfoFromDefaults(categoryId),
    faqSectionTitle: i18nString(copy.faqSectionTitle.no, copy.faqSectionTitle.en),
    bottomCta: {
      title: i18nString(copy.bottomCta.title.no, copy.bottomCta.title.en),
      subtitle: i18nText(copy.bottomCta.subtitle.no, copy.bottomCta.subtitle.en),
      primaryLabel: i18nString(copy.bottomCta.primaryLabel.no, copy.bottomCta.primaryLabel.en),
      secondaryLabel: i18nString(copy.bottomCta.secondaryLabel.no, copy.bottomCta.secondaryLabel.en),
      primaryPath: copy.bottomCta.primaryPath ?? '',
      secondaryPath: copy.bottomCta.secondaryPath ?? '/kontakt',
    },
  }
}

function copyQuickInfo(source: unknown[] | undefined, categoryId: string) {
  if (hasQuickInfoItems(source)) return source
  return quickInfoFromDefaults(categoryId)
}

function copyFaqTitle(source: unknown, categoryId: string) {
  if (hasNoEnI18n(source)) return source
  const copy = treatmentCategoryBottomCtaByKey[categoryId]
  const title = copy?.faqSectionTitle ?? {
    no: 'Ofte stilte spørsmål',
    en: 'Frequently asked questions',
  }
  return i18nString(title.no, title.en)
}

function copyBottomCta(source: Record<string, unknown> | undefined, categoryId: string) {
  if (hasBottomCta(source)) return source
  return pageUiFromDefaults(categoryId)?.bottomCta ?? null
}

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId, quickInfoItems, faqSectionTitle, bottomCta
    }`,
  )

  const categoryById = new Map<string, CategoryRow>()
  for (const cat of categories) {
    const published = cat._id.replace(/^drafts\./, '')
    categoryById.set(cat._id, cat)
    categoryById.set(published, cat)
    categoryById.set(`drafts.${published}`, cat)
    if (cat.categoryId) categoryById.set(cat.categoryId, cat)
  }

  const treatments = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id, title, quickInfoItems, faqSectionTitle, bottomCta,
      category->{ _id, categoryId }
    }`,
  )

  console.log(`▶ Move page UI fields to treatments (${treatments.length} treatments)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of treatments) {
    const categoryRef = doc.category?._id?.replace(/^drafts\./, '')
    const category = categoryRef ? categoryById.get(categoryRef) : undefined
    const categoryId = category?.categoryId || doc.category?.categoryId || ''

    const patch: Record<string, unknown> = {}

    if (FORCE || !hasQuickInfoItems(doc.quickInfoItems)) {
      patch.quickInfoItems = copyQuickInfo(category?.quickInfoItems, categoryId)
    }

    if (FORCE || !hasNoEnI18n(doc.faqSectionTitle)) {
      patch.faqSectionTitle = copyFaqTitle(category?.faqSectionTitle, categoryId)
    }

    if (FORCE || !hasBottomCta(doc.bottomCta)) {
      const cta = copyBottomCta(category?.bottomCta, categoryId)
      if (cta) patch.bottomCta = cta
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    console.log(`  ✎ ${pickNo(doc.title) || doc._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updated++
  }

  const categoryUnset = [
    'description',
    'longDescription',
    'heroVideo',
    'quickInfoItems',
    'faqSectionTitle',
    'bottomCta',
    'landingPage.documentTitle',
  ]

  if (!DRY_RUN) {
    for (const cat of categories) {
      await sanityClient.patch(cat._id).unset(categoryUnset).commit()
    }
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} treatments: ${updated}`)
  console.log(`⏭  Skipped (already set): ${skipped}`)
  if (!DRY_RUN) {
    console.log(`🧹 Removed unused fields from ${categories.length} category documents`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
