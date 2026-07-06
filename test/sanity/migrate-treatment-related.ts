/**
 * Migrate flat related section fields to nested relatedSection object.
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-treatment-related.ts
 *   DRY_RUN=1 cd test && npx tsx sanity/migrate-treatment-related.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type TreatmentRow = {
  _id: string
  relatedEyebrow?: unknown
  relatedTitle?: unknown
  relatedLead?: unknown
  relatedAsIntro?: boolean
  relatedAsServices?: boolean
  relatedSeeAllHref?: string
  relatedSeeAllLabel?: unknown
  related?: Array<{ _ref: string; _type: string; _key?: string }>
}

async function run() {
  console.log(`▶ Migrate treatment related section`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)

  const docs = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment"]{
      _id,
      relatedEyebrow,
      relatedTitle,
      relatedLead,
      relatedAsIntro,
      relatedAsServices,
      relatedSeeAllHref,
      relatedSeeAllLabel,
      related
    }`
  )

  console.log(`  Found ${docs.length} treatments.`)
  let updatedCount = 0

  const transaction = sanityClient.transaction()

  for (const doc of docs) {
    const hasAnyRelatedField =
      doc.relatedEyebrow !== undefined ||
      doc.relatedTitle !== undefined ||
      doc.relatedLead !== undefined ||
      doc.relatedAsIntro !== undefined ||
      doc.relatedAsServices !== undefined ||
      doc.relatedSeeAllHref !== undefined ||
      doc.relatedSeeAllLabel !== undefined ||
      doc.related !== undefined

    if (!hasAnyRelatedField) {
      continue
    }

    const relatedSection: Record<string, any> = {}
    if (doc.relatedEyebrow !== undefined) relatedSection.eyebrow = doc.relatedEyebrow
    if (doc.relatedTitle !== undefined) relatedSection.title = doc.relatedTitle
    if (doc.relatedLead !== undefined) relatedSection.lead = doc.relatedLead
    if (doc.relatedAsIntro !== undefined) relatedSection.asIntro = doc.relatedAsIntro
    if (doc.relatedAsServices !== undefined) relatedSection.asServices = doc.relatedAsServices
    if (doc.relatedSeeAllHref !== undefined) relatedSection.seeAllHref = doc.relatedSeeAllHref
    if (doc.relatedSeeAllLabel !== undefined) relatedSection.seeAllLabel = doc.relatedSeeAllLabel
    if (Array.isArray(doc.related)) {
      relatedSection.items = doc.related.map((ref, idx) => ({
        _type: 'reference',
        _ref: ref._ref,
        _key: ref._key || `rel-${idx}`
      }))
    }

    console.log(`  Updating treatment doc: ${doc._id}`)
    updatedCount++

    transaction.patch(doc._id, {
      set: { relatedSection },
      unset: [
        'relatedEyebrow',
        'relatedTitle',
        'relatedLead',
        'relatedAsIntro',
        'relatedAsServices',
        'relatedSeeAllHref',
        'relatedSeeAllLabel',
        'related'
      ]
    })
  }

  if (updatedCount === 0) {
    console.log(`✅ No treatments need migration.`)
    return
  }

  if (DRY_RUN) {
    console.log(`✅ [DRY RUN] Would commit transaction updating ${updatedCount} docs.`)
  } else {
    console.log(`🚀 Committing transaction for ${updatedCount} docs...`)
    await transaction.commit()
    console.log(`✅ Successfully migrated ${updatedCount} docs.`)
  }
}

run().catch(console.error)
