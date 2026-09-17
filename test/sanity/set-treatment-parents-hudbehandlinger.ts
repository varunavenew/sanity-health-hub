#!/usr/bin/env npx tsx
/**
 * Backfill `parent` on the Hudbehandlinger family so breadcrumbs (and their
 * BreadcrumbList JSON-LD) show the full path instead of collapsing straight
 * from "Flere tjenester" to the leaf page.
 *
 * Sets:
 *   treatment-flere-fagomrader-hudbehandlinger        → parent: hudhelse
 *   treatment-flere-fagomrader-hudpleieprodukter      → parent: hudhelse
 *   treatment-flere-fagomrader-hudbehandlinger-*  (6) → parent: hudbehandlinger
 *
 * "Hudlege" is not used as a parent — it was unpublished and consolidated
 * into "Hudhelse" (see unpublish-hudlege-developer.ts), which is also what
 * the live demo URL segment (`hudhelse`) uses.
 *
 * Applies to both the published document and its draft (if one exists), so
 * the breadcrumb is correct whether Studio is previewing a draft or not.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/set-treatment-parents-hudbehandlinger.ts
 *   npx tsx sanity/set-treatment-parents-hudbehandlinger.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/set-treatment-parents-hudbehandlinger.ts
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

const HUDHELSE_ID = 'treatment-flere-fagomrader-hudhelse'
const HUDBEHANDLINGER_ID = 'treatment-flere-fagomrader-hudbehandlinger'

const PARENT_LINKS: Array<{childId: string; parentId: string}> = [
  {childId: HUDBEHANDLINGER_ID, parentId: HUDHELSE_ID},
  {childId: 'treatment-flere-fagomrader-hudpleieprodukter', parentId: HUDHELSE_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-foflekksjekk', parentId: HUDBEHANDLINGER_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi', parentId: HUDBEHANDLINGER_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum', parentId: HUDBEHANDLINGER_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur', parentId: HUDBEHANDLINGER_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader', parentId: HUDBEHANDLINGER_ID},
  {childId: 'treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar', parentId: HUDBEHANDLINGER_ID},
]

function draftId(id: string): string {
  return id.startsWith('drafts.') ? id : `drafts.${id}`
}

function publishedId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

async function main() {
  console.log(
    `\n[set-treatment-parents-hudbehandlinger] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`,
  )

  const allIds = Array.from(
    new Set(PARENT_LINKS.flatMap(({childId, parentId}) => [childId, parentId])),
  )
  const idsToFetch = allIds.flatMap((id) => [publishedId(id), draftId(id)])

  const existing = await sanityClient.fetch<Array<{_id: string; parent?: {_ref?: string}}>>(
    `*[_id in $ids]{_id, parent}`,
    {ids: idsToFetch},
  )
  const existingById = new Map(existing.map((doc) => [doc._id, doc]))

  let plannedWrites = 0

  for (const {childId, parentId} of PARENT_LINKS) {
    for (const id of [publishedId(childId), draftId(childId)]) {
      const doc = existingById.get(id)
      if (!doc) {
        console.log(`  (skip) ${id} does not exist`)
        continue
      }
      if (doc.parent?._ref === publishedId(parentId)) {
        console.log(`  (ok)   ${id}: parent already ${publishedId(parentId)}`)
        continue
      }
      plannedWrites += 1
      console.log(`  ~ ${id}: parent → ${publishedId(parentId)}`)
      if (!DRY_RUN) {
        await sanityClient
          .patch(id)
          .set({parent: {_type: 'reference', _ref: publishedId(parentId)}})
          .commit()
      }
    }
  }

  console.log(
    DRY_RUN
      ? `\n(dry run — ${plannedWrites} write(s) would be made). Re-run without DRY_RUN to apply.\n`
      : `\nDone. ${plannedWrites} write(s) applied.\n`,
  )
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
