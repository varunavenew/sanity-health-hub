#!/usr/bin/env npx tsx
/**
 * Recover published specialists hidden by empty draft overlays.
 *
 * The EN keywords migration created minimal draft shells (no name) that make
 * Studio show "Untitled" even when the published document is complete.
 *
 * This script:
 * 1. Deletes draft overlays when a published specialist with a name exists.
 * 2. Deletes orphan draft-only shells with no name (empty duplicates).
 *
 * Usage (from test/):
 *   npm run recover:specialist-drafts:dry
 *   npm run recover:specialist-drafts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type DraftRow = {
  _id: string
  name?: string
  publishedId: string
  publishedName?: string
  publishedExists: boolean
}

async function run() {
  const drafts = await sanityClient.fetch<DraftRow[]>(
    `*[_type == "specialist" && _id in path("drafts.**")]{
      _id,
      name,
      "publishedId": string::split(_id, "drafts.")[1],
      "publishedName": *[_id == string::split(^._id, "drafts.")[1]][0].name,
      "publishedExists": defined(*[_id == string::split(^._id, "drafts.")[1]][0]._id)
    } | order(_id asc)`,
  )

  if (!drafts.length) {
    console.log('No specialist drafts found.')
    return
  }

  let discardPublishedOverlay = 0
  let deleteOrphanShell = 0
  let skipped = 0

  for (const draft of drafts) {
    const hasPublishedWithName =
      draft.publishedExists && Boolean(draft.publishedName?.trim())
    const isOrphanEmptyShell =
      !draft.publishedExists && !draft.name?.trim()

    if (hasPublishedWithName) {
      discardPublishedOverlay += 1
      const label = `${draft._id} → restore "${draft.publishedName}"`
      if (DRY_RUN) {
        console.log(`DRY discard ${label}`)
        continue
      }
      await sanityClient.delete(draft._id)
      console.log(`✓ Discarded draft, restored published: ${label}`)
      continue
    }

    if (isOrphanEmptyShell) {
      deleteOrphanShell += 1
      if (DRY_RUN) {
        console.log(`DRY delete orphan ${draft._id}`)
        continue
      }
      await sanityClient.delete(draft._id)
      console.log(`✓ Deleted orphan empty draft: ${draft._id}`)
      continue
    }

    skipped += 1
    console.log(
      `– Skipped ${draft._id} (published=${draft.publishedExists}, draft name="${draft.name || ''}")`,
    )
  }

  console.log('')
  console.log(
    `${DRY_RUN ? 'Would recover' : 'Recovered'} ${discardPublishedOverlay} published overlay(s), ` +
      `${DRY_RUN ? 'would delete' : 'deleted'} ${deleteOrphanShell} orphan shell(s), skipped ${skipped}.`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
