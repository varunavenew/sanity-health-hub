/**
 * Migration: Set specialist.bookingCategoryIds from static website booking rules.
 *
 * Uses the same mapping as InlineBookingSection (gynekologi → 8+10, etc.)
 * and role-based ids for "flere fagområder" / annet specialists.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-booking-ids
 *   cd test && npm run migrate:specialist-booking-ids:dry
 */
import { allStaticSpecialistBookingIds } from './data/specialist-booking-category-ids'
import { sanityClient } from './config'
import { setSpecialistBookingCategoryIds } from './lib/patch-specialist'
import { slugFromSpecialistDoc, SPECIALISTS_WITH_SLUG_QUERY } from './lib/specialist-slug-groq'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type SpecialistDoc = {
  _id: string
  name?: string
  slug?: string
  bookingCategoryIds?: number[]
}

function sameIds(a: number[] | undefined, b: number[]): boolean {
  const left = [...(a ?? [])].sort((x, y) => x - y)
  const right = [...b].sort((x, y) => x - y)
  if (left.length !== right.length) return false
  return left.every((id, i) => id === right[i])
}

async function run() {
  const staticMap = new Map(allStaticSpecialistBookingIds().map((s) => [s.slug, s.ids]))

  console.log('📋 Static booking category mapping (sample):')
  for (const [slug, ids] of [...staticMap.entries()].slice(0, 5)) {
    console.log(`   ${slug} → [${ids.join(', ')}]`)
  }
  console.log(`   … ${staticMap.size} specialists total\n`)

  const rawSpecialists = await sanityClient.fetch<SpecialistDoc[]>(SPECIALISTS_WITH_SLUG_QUERY)
  const specialists = rawSpecialists
    .map((doc) => ({ ...doc, slug: slugFromSpecialistDoc(doc) }))
    .filter((doc): doc is SpecialistDoc & { slug: string } => Boolean(doc.slug))

  console.log(`🔍 Found ${rawSpecialists.length} specialist(s) in Sanity, ${specialists.length} with resolvable slug.\n`)

  let updated = 0
  let unchanged = 0
  const unresolved: { slug: string; reason: string }[] = []

  for (const doc of specialists) {
    const slug = doc.slug

    const targetIds = staticMap.get(slug)
    if (!targetIds) {
      unresolved.push({ slug, reason: 'not in static specialist list' })
      continue
    }

    if (targetIds.length === 0) {
      unresolved.push({ slug, reason: 'no booking ids resolved (check role mapping)' })
      continue
    }

    if (!FORCE && sameIds(doc.bookingCategoryIds, targetIds)) {
      unchanged++
      console.log(`   ⏭  ${doc.name ?? slug} — already [${targetIds.join(', ')}]`)
      continue
    }

    if (DRY_RUN) {
      updated++
      console.log(
        `   [dry-run] ${doc.name ?? slug} — [${(doc.bookingCategoryIds ?? []).join(', ') || '∅'}] → [${targetIds.join(', ')}]`,
      )
      continue
    }

    const patchedIds = await setSpecialistBookingCategoryIds(doc._id, targetIds)
    updated++
    console.log(
      `   ✓ ${doc.name ?? slug} → [${targetIds.join(', ')}] (${patchedIds.join(', ')})`,
    )
  }

  const sanitySlugs = new Set(specialists.map((s) => s.slug).filter(Boolean))
  const onlyStatic = [...staticMap.keys()].filter((slug) => !sanitySlugs.has(slug))

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ Updated: ${updated}${DRY_RUN ? ' (dry-run)' : ''}`)
  console.log(`⏭  Unchanged: ${unchanged}`)

  if (unresolved.length) {
    console.log(`\n⚠  Unresolved (${unresolved.length}):`)
    unresolved.forEach((u) => console.log(`     - ${u.slug}: ${u.reason}`))
  }

  if (onlyStatic.length) {
    console.log(`\nℹ  In static list but not in Sanity (${onlyStatic.length}):`)
    onlyStatic.forEach((slug) => console.log(`     - ${slug}`))
  }
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
