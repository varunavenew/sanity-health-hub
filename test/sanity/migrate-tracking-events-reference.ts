#!/usr/bin/env npx tsx
/**
 * Seed trackingEventsReference singleton (read-only SEO/GTM event documentation).
 *
 *   cd test && npx tsx sanity/migrate-tracking-events-reference.ts
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-tracking-events-reference.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from './config'
import {
  TRACKING_EVENTS_SEED,
  TRACKING_OWNERSHIP_SPLIT,
  TRACKING_PARAMETER_KEYS,
  TRACKING_REFERENCE_OVERVIEW,
} from './data/tracking-events-reference'

const DOC_ID = 'trackingEventsReference'
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1'

async function main() {
  if (PROJECT_ID !== '9jhqpk3a') {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`)
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`)

  const existing = await sanityClient.fetch<{ _id?: string; seoTeamNotes?: string } | null>(
    `*[_id == $id][0]{ _id, seoTeamNotes }`,
    { id: DOC_ID },
  )

  const doc = {
    _id: DOC_ID,
    _type: 'trackingEventsReference',
    overview: TRACKING_REFERENCE_OVERVIEW,
    parameterKeysReference: TRACKING_PARAMETER_KEYS,
    ownershipSplit: TRACKING_OWNERSHIP_SPLIT,
    events: TRACKING_EVENTS_SEED.map(({ _key, ...rest }) => ({ _key, ...rest })),
    ...(existing?.seoTeamNotes ? { seoTeamNotes: existing.seoTeamNotes } : {}),
  }

  if (existing?._id) {
    console.log(`→ Updating ${DOC_ID} (preserving seoTeamNotes if set)`)
  } else {
    console.log(`→ Creating ${DOC_ID}`)
  }

  if (DRY_RUN) {
    console.log(JSON.stringify(doc, null, 2))
    return
  }

  await sanityClient.createOrReplace(doc)
  console.log('✓ trackingEventsReference ready')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
