/**
 * Exclude team pages from Related Services:
 * - Mark team treatment documents with pageRole: "team"
 * - Remove team-page references from relatedSection.items on all treatments
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-treatment-related-exclude-team.ts
 *   DRY_RUN=1 cd test && npx tsx sanity/migrate-treatment-related-exclude-team.ts
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production cd test && npx tsx sanity/migrate-treatment-related-exclude-team.ts
 */
import {createClient} from '@sanity/client'
import {DATASET, PROJECT_ID, API_VERSION, SANITY_TOKEN} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

/** Include draft documents (drafts.*) alongside published ids. */
const migrationClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: SANITY_TOKEN,
  perspective: 'raw',
})

type TreatmentRow = {
  _id: string
  slug?: string
  pageRole?: string
  relatedSection?: {
    items?: Array<{_ref: string; _key?: string; _type?: string}>
  }
}

async function run() {
  console.log('▶ Migrate: exclude team pages from Related Services')
  console.log(`  Dataset: ${DATASET}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)

  const treatments = await migrationClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment"]{
      _id,
      pageRole,
      "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
      relatedSection
    }`,
  )

  const teamIds = new Set(
    treatments
      .filter((t) => t.pageRole === 'team' || t.slug === 'teamet')
      .map((t) => t._id),
  )

  console.log(`  Team pages: ${teamIds.size}`)
  for (const id of teamIds) {
    const doc = treatments.find((t) => t._id === id)
    console.log(`    - ${id} (${doc?.slug ?? '?'})`)
  }

  let markedTeam = 0
  let cleanedRelated = 0
  let removedRefs = 0

  const tx = migrationClient.transaction()

  for (const doc of treatments) {
    const shouldBeTeam = doc.pageRole === 'team' || doc.slug === 'teamet'
    if (shouldBeTeam && doc.pageRole !== 'team') {
      markedTeam++
      if (!DRY_RUN) {
        tx.patch(doc._id, {set: {pageRole: 'team'}})
      }
    }

    const items = doc.relatedSection?.items
    if (!items?.length) continue

    const filtered = items.filter((ref) => !teamIds.has(ref._ref))
    if (filtered.length === items.length) continue

    removedRefs += items.length - filtered.length
    cleanedRelated++

    if (!DRY_RUN) {
      tx.patch(doc._id, {
        set: {
          'relatedSection.items': filtered,
        },
      })
    }
  }

  if (!DRY_RUN) {
    await tx.commit()
  }

  console.log(`  Marked team role: ${markedTeam}`)
  console.log(`  Cleaned relatedSection on: ${cleanedRelated} treatments`)
  console.log(`  Removed team refs: ${removedRefs}`)
  console.log(DRY_RUN ? '  (dry run — no writes)' : '  ✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
