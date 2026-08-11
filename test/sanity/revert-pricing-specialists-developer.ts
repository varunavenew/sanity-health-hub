/**
 * Developer-only: revert Pricing specialists repair.
 *
 * Restores pre-repair shape as closely as possible:
 * - published pricingPage: remove specialistsSection (was missing before repair)
 * - drafts.pricingPage: unset displayMode + maxItems (leave other stub fields)
 *
 * Does NOT touch production.
 *
 *   cd test && DRY_RUN=1 npx tsx sanity/revert-pricing-specialists-developer.ts
 *   cd test && npx tsx sanity/revert-pricing-specialists-developer.ts
 */
import {sanityClient, DATASET} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const DRAFT_ID = 'drafts.pricingPage'
const PUBLISHED_ID = 'pricingPage'

async function run() {
  if (DATASET !== 'developer') {
    throw new Error(
      `Refusing: dataset is "${DATASET}". This revert is developer-only.`,
    )
  }

  const [published, draft] = await Promise.all([
    sanityClient.fetch<{
      _id: string
      specialistsSection?: {
        displayMode?: string | null
        maxItems?: number | null
        layout?: string | null
      } | null
    } | null>(`*[_id == $id][0]{_id, specialistsSection}`, {id: PUBLISHED_ID}),
    sanityClient.fetch<{
      _id: string
      specialistsSection?: {
        displayMode?: string | null
        maxItems?: number | null
        layout?: string | null
      } | null
    } | null>(`*[_id == $id][0]{_id, specialistsSection}`, {id: DRAFT_ID}),
  ])

  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        mode: DRY_RUN ? 'DRY_RUN' : 'WRITE',
        before: {
          published: published
            ? {
                hasSection: Boolean(published.specialistsSection),
                displayMode: published.specialistsSection?.displayMode ?? null,
                maxItems: published.specialistsSection?.maxItems ?? null,
              }
            : null,
          draft: draft
            ? {
                hasSection: Boolean(draft.specialistsSection),
                displayMode: draft.specialistsSection?.displayMode ?? null,
                maxItems: draft.specialistsSection?.maxItems ?? null,
              }
            : null,
        },
        willDo: {
          published: 'unset specialistsSection (restore missing section)',
          draft: 'unset specialistsSection.displayMode + specialistsSection.maxItems',
        },
      },
      null,
      2,
    ),
  )

  if (DRY_RUN) {
    console.log('Dry-run only — no writes.')
    return
  }

  if (published?.specialistsSection) {
    await sanityClient.patch(PUBLISHED_ID).unset(['specialistsSection']).commit()
    console.log(`✓ ${PUBLISHED_ID}: unset specialistsSection`)
  } else {
    console.log(`↷ ${PUBLISHED_ID}: no specialistsSection to remove`)
  }

  if (draft?.specialistsSection) {
    await sanityClient
      .patch(DRAFT_ID)
      .unset([
        'specialistsSection.displayMode',
        'specialistsSection.maxItems',
      ])
      .commit()
    console.log(`✓ ${DRAFT_ID}: unset displayMode + maxItems`)
  } else {
    console.log(`↷ ${DRAFT_ID}: no specialistsSection`)
  }

  console.log('Done. Production was not touched.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
