/**
 * Populate required relatedSpecialistsSection.specialists for every specialist.
 * Picks up to 4 peers from the same primary category (matches live auto-fill).
 *
 * Usage:
 *   cd test && npm run migrate:specialist-related-specialists:dry
 *   cd test && npm run migrate:specialist-related-specialists
 */
import { resolveSpecialistPrimaryCategory } from '../../src/lib/sanity/category-keys'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const MAX_RELATED = 4

type SpecialistRow = {
  _id: string
  name?: string
  sortOrder?: number
  categories?: Array<{ categoryId?: string; slug?: string }>
  relatedSpecialistsSection?: {
    specialists?: Array<{ _ref?: string }>
  }
}

function specialistRefs(ids: string[]) {
  return ids.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || id,
  }))
}

function sortPeers(a: SpecialistRow, b: SpecialistRow): number {
  const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER
  const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) return orderA - orderB
  return String(a.name || '').localeCompare(String(b.name || ''), 'nb')
}

async function run() {
  const specialists = await sanityClient.fetch<SpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, sortOrder,
      "categories": categories[]->{ categoryId, "slug": slug.current },
      relatedSpecialistsSection{ specialists[]{ _ref } }
    }`,
  )

  const byCategory = new Map<string, SpecialistRow[]>()
  for (const doc of specialists) {
    const category = resolveSpecialistPrimaryCategory(doc.categories) || 'annet'
    const list = byCategory.get(category) ?? []
    list.push(doc)
    byCategory.set(category, list)
  }
  for (const list of byCategory.values()) {
    list.sort(sortPeers)
  }

  console.log(`▶ Link related specialists (${specialists.length} profiles)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of specialists) {
    const existing = doc.relatedSpecialistsSection?.specialists ?? []
    if (existing.length > 0 && !FORCE) {
      skipped++
      continue
    }

    const category = resolveSpecialistPrimaryCategory(doc.categories) || 'annet'
    const peers = (byCategory.get(category) ?? [])
      .filter((peer) => peer._id !== doc._id)
      .slice(0, MAX_RELATED)

    if (peers.length === 0) {
      console.log(`  – ${doc.name ?? doc._id}: no peers in ${category}`)
      skipped++
      continue
    }

    const refs = specialistRefs(peers.map((peer) => peer._id))
    console.log(
      `  ✎ ${doc.name ?? doc._id}: ${refs.length} specialist(s) [${category}]`,
    )

    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ 'relatedSpecialistsSection.specialists': refs })
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped: ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
