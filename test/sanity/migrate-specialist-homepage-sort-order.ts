#!/usr/bin/env npx tsx
/**
 * Set homepageSortOrder on the 13 homepage-priority specialists (idempotent).
 *
 * Resolves documents by Norwegian slug and verifies the display name before patching.
 *
 * Usage (from test/):
 *   npm run migrate:specialist-homepage-sort-order:dry
 *   npm run migrate:specialist-homepage-sort-order
 */
import { DATASET, sanityClient } from './config'
import { specialistDocumentIds } from './lib/patch-specialist'
import { specialistSlugProjection } from './lib/specialist-slug-groq'

const DRY_RUN = process.env.DRY_RUN === '1'

type SpecialistRow = {
  _id: string
  name?: string
  slug?: string
  homepageSortOrder?: number
}

/** Slug → expected Sanity name → homepage order (verified before patch). */
const HOMEPAGE_PRIORITY: Array<{ slug: string; expectedName: string; order: number }> = [
  { slug: 'madeleine-engen', expectedName: 'Madeleine Engen', order: 1 },
  { slug: 'ida-waagsbo-bjorntvedt', expectedName: 'Ida Waagsbø Bjørntvedt', order: 2 },
  { slug: 'jackson-tok', expectedName: 'Jackson Tok', order: 3 },
  { slug: 'ingvild-skarpas-aannerud', expectedName: 'Ingvild Skarpås Aannerud', order: 4 },
  { slug: 'birgitte-aspenes', expectedName: 'Birgitte Aspenes', order: 5 },
  { slug: 'kristian-marstrand-warholm', expectedName: 'Kristian Marstrand Warholm', order: 6 },
  { slug: 'mari-borge-eskerud', expectedName: 'Mari Borge Eskerud', order: 7 },
  { slug: 'marc-jacob-strauss', expectedName: 'Marc Jacob Strauss', order: 8 },
  { slug: 'jan-ragnar-haugstvedt', expectedName: 'Jan-Ragnar Haugstvedt', order: 9 },
  { slug: 'linnea-torsnes', expectedName: 'Linnea Torsnes', order: 10 },
  { slug: 'kjersti-margrete-finsrud', expectedName: 'Kjersti Margrete Finsrud', order: 11 },
  { slug: 'birgitte-mitlid-mork', expectedName: 'Birgitte Mitlid-Mork', order: 12 },
  { slug: 'siri-klokstad', expectedName: 'Siri Kløkstad', order: 13 },
]

function normalizeName(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

async function patchHomepageSortOrder(documentId: string, order: number): Promise<string[]> {
  const patched: string[] = []

  for (const id of specialistDocumentIds(documentId)) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id })
    if (!exists) continue

    if (DRY_RUN) {
      patched.push(id)
      continue
    }

    await sanityClient.patch(id).set({ homepageSortOrder: order }).commit()
    patched.push(id)
  }

  return patched
}

async function run() {
  const specialists = await sanityClient.fetch<SpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      name,
      ${specialistSlugProjection},
      homepageSortOrder
    }`,
  )

  console.log(`▶ Specialist homepage sort order (${DATASET})`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let patched = 0
  let skipped = 0
  const errors: string[] = []

  for (const entry of HOMEPAGE_PRIORITY) {
    const matches = specialists.filter((row) => row.slug === entry.slug)

    if (matches.length === 0) {
      errors.push(`Missing specialist slug "${entry.slug}" (${entry.expectedName})`)
      continue
    }

    if (matches.length > 1) {
      errors.push(
        `Ambiguous slug "${entry.slug}": ${matches.map((row) => row._id).join(', ')}`,
      )
      continue
    }

    const doc = matches[0]!
    const name = normalizeName(doc.name)

    if (name !== entry.expectedName) {
      errors.push(
        `Name mismatch for slug "${entry.slug}": expected "${entry.expectedName}", got "${name}" (${doc._id})`,
      )
      continue
    }

    if (doc.homepageSortOrder === entry.order) {
      console.log(`  = ${entry.order}. ${name} (${doc._id}) — already set`)
      skipped++
      continue
    }

    const ids = await patchHomepageSortOrder(doc._id, entry.order)
    console.log(`  ✓ ${entry.order}. ${name} (${doc._id}) → homepageSortOrder=${entry.order}`)
    if (ids.length > 0) patched++
  }

  if (errors.length > 0) {
    console.error('\n✗ Migration aborted due to verification errors:')
    for (const message of errors) {
      console.error(`  - ${message}`)
    }
    process.exit(1)
  }

  console.log(`\nDone. Updated: ${patched}, unchanged: ${skipped}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
