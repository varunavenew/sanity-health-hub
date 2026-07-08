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
    if (doc.relatedEyebrow !== undefined && doc.relatedEyebrow !== null) relatedSection.eyebrow = doc.relatedEyebrow
    if (doc.relatedTitle !== undefined && doc.relatedTitle !== null) relatedSection.title = doc.relatedTitle
    if (doc.relatedLead !== undefined && doc.relatedLead !== null) relatedSection.lead = doc.relatedLead
    if (doc.relatedAsIntro !== undefined && doc.relatedAsIntro !== null) relatedSection.asIntro = doc.relatedAsIntro
    if (doc.relatedAsServices !== undefined && doc.relatedAsServices !== null) relatedSection.asServices = doc.relatedAsServices
    if (doc.relatedSeeAllHref !== undefined && doc.relatedSeeAllHref !== null) relatedSection.seeAllHref = doc.relatedSeeAllHref
    if (doc.relatedSeeAllLabel !== undefined && doc.relatedSeeAllLabel !== null) relatedSection.seeAllLabel = doc.relatedSeeAllLabel
    if (Array.isArray(doc.related) && doc.related.length > 0) {
      relatedSection.items = doc.related
        .filter(ref => ref && ref._ref)
        .map((ref, idx) => ({
          _type: 'reference',
          _ref: ref._ref,
          _key: ref._key || `rel-${idx}`
        }))
    }

    console.log(`  Updating treatment doc: ${doc._id}`)
    updatedCount++

    const patchOps: Record<string, any> = {
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
    }

    if (Object.keys(relatedSection).length > 0) {
      patchOps.set = { relatedSection }
    } else {
      patchOps.unset.push('relatedSection')
    }

    transaction.patch(doc._id, patchOps)
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
