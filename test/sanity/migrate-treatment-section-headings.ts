/**
 * Move section headings from treatmentCategory → treatment documents.
 *
 * Usage:
 *   cd test && npm run migrate:treatment-section-headings:dry
 *   cd test && npm run migrate:treatment-section-headings
 */
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import { defaultPageUi } from './data/treatment-category-bottom-cta'
import { i18nString } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type CategoryRow = {
  _id: string
  categoryId?: string
  linkedServicesSectionTitle?: unknown
  processSectionTitle?: unknown
}

type TreatmentRow = {
  _id: string
  title?: unknown
  linkedServicesSectionTitle?: unknown
  processSectionTitle?: unknown
  category?: { _ref?: string }
}

function hasNoEnI18n(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim() && pickForLang(value, 'en')?.trim())
}

function copyOrDefault(
  source: unknown,
  fallback: { no: string; en: string },
): ReturnType<typeof i18nString> {
  if (hasNoEnI18n(source)) {
    return i18nString(pickNo(source), pickForLang(source, 'en'))
  }
  return i18nString(fallback.no, fallback.en)
}

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId, linkedServicesSectionTitle, processSectionTitle
    }`,
  )

  const categoryById = new Map<string, CategoryRow>()
  for (const cat of categories) {
    const published = cat._id.replace(/^drafts\./, '')
    categoryById.set(cat._id, cat)
    categoryById.set(published, cat)
    categoryById.set(`drafts.${published}`, cat)
  }

  const treatments = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id, title,
      linkedServicesSectionTitle, processSectionTitle,
      category{ _ref }
    }`,
  )

  console.log(`▶ Move section headings to treatments (${treatments.length} treatments)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of treatments) {
    const categoryRef = doc.category?._ref?.replace(/^drafts\./, '')
    const category = categoryRef ? categoryById.get(categoryRef) : undefined

    const patch: Record<string, unknown> = {}

    if (FORCE || !hasNoEnI18n(doc.linkedServicesSectionTitle)) {
      patch.linkedServicesSectionTitle = copyOrDefault(
        category?.linkedServicesSectionTitle,
        defaultPageUi.linkedServicesSectionTitle,
      )
    }

    if (FORCE || !hasNoEnI18n(doc.processSectionTitle)) {
      patch.processSectionTitle = copyOrDefault(
        category?.processSectionTitle,
        defaultPageUi.processSectionTitle,
      )
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

  if (!DRY_RUN) {
    for (const cat of categories) {
      await sanityClient
        .patch(cat._id)
        .unset(['linkedServicesSectionTitle', 'processSectionTitle'])
        .commit()
    }
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} treatments: ${updated}`)
  console.log(`⏭  Skipped (already set): ${skipped}`)
  if (!DRY_RUN) {
    console.log(`🧹 Removed headings from ${categories.length} category documents`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
