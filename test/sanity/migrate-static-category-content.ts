/**
 * Migrate static category content from `src/pages/treatments/categoryPageContent.ts`
 * into the Sanity `treatmentCategory` documents.
 *
 * Idempotent: only writes fields that are currently missing on the document.
 * Pass FORCE=1 to overwrite existing values.
 *
 * After running this, re-run `translate-all-content.ts` to generate the
 * English (`_en`) parallel fields via the Lovable AI Gateway.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 *   FORCE=1 SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> npx tsx sanity/migrate-static-category-content.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'
// Static source of truth (NO only)
import { categoryNewContent } from '../../src/pages/treatments/categoryPageContent'

const FORCE = process.env.FORCE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// Map Lucide icon components from the static file back to a string name.
// The migrate-time `icon` field on journey steps is the imported component;
// we serialize it to a Lucide name string for Sanity (frontend uses getIcon()).
const iconName = (icon: any): string => {
  if (!icon) return 'circle'
  if (typeof icon === 'string') return icon
  // React components have displayName or name set by lucide-react
  return icon.displayName || icon.render?.displayName || icon.name || 'circle'
}

async function migrate() {
  const allDocs = await sanityClient.fetch<any[]>(
    `*[_type == "treatmentCategory"]{ _id, categoryId, subtitle, servicesHeading, servicesIntro, serviceGroups, journey, staticFaqs, closingTitle, closingBody, closingCta, bookingPath }`,
  )
  const byId = new Map(allDocs.map((d) => [d.categoryId, d]))

  let updatedCount = 0
  let skippedCount = 0
  let missingCount = 0

  for (const [slug, content] of Object.entries(categoryNewContent)) {
    const doc = byId.get(slug)
    if (!doc) {
      console.log(`⚠️  No Sanity document for categoryId="${slug}" — skipping`)
      missingCount++
      continue
    }

    const patch: Record<string, any> = {}

    const setIfMissing = (field: string, value: any) => {
      if (value == null || value === '') return
      if (!FORCE && doc[field] != null && doc[field] !== '' &&
          (!Array.isArray(doc[field]) || doc[field].length > 0)) return
      patch[field] = value
    }

    setIfMissing('subtitle', content.subtitle)
    setIfMissing('servicesHeading', content.servicesHeading)
    setIfMissing('servicesIntro', content.servicesIntro)
    setIfMissing('closingTitle', content.closingTitle)
    setIfMissing('closingBody', content.closingBody)
    setIfMissing('closingCta', content.closingCta)
    setIfMissing('bookingPath', content.bookingPath)

    setIfMissing(
      'serviceGroups',
      content.groups.map((g) => ({
        _key: key(),
        _type: 'object',
        label: g.label,
        serviceNames: g.serviceNames,
      })),
    )

    setIfMissing(
      'journey',
      content.journey.map((j) => ({
        _key: key(),
        _type: 'object',
        icon: iconName(j.icon),
        label: j.label,
        title: j.title,
        body: j.body,
      })),
    )

    setIfMissing(
      'staticFaqs',
      content.faqs.map((f) => ({
        _key: key(),
        _type: 'object',
        question: f.question,
        answer: f.answer,
      })),
    )

    if (Object.keys(patch).length === 0) {
      console.log(`✓ ${slug} — already up to date`)
      skippedCount++
      continue
    }

    console.log(`✎ ${slug} — patching: ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updatedCount++
  }

  console.log('')
  console.log(
    `Done. Updated: ${updatedCount}, skipped: ${skippedCount}, missing docs: ${missingCount}${
      DRY_RUN ? ' (DRY RUN — nothing written)' : ''
    }`,
  )
  console.log('')
  console.log('Next step: re-run translate-all-content.ts to generate _en fields:')
  console.log('  SANITY_TOKEN=<token> npx tsx sanity/translate-all-content.ts')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
