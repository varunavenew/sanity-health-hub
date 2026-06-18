/**
 * Backfill specialist section headings (FAQ + related specialists) in Sanity.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-section-headings:dry
 *   cd test && npm run migrate:specialist-section-headings
 */
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import { i18nString } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const DEFAULT_FAQ_SECTION_TITLE = i18nString(
  'Ofte stilte spørsmål',
  'Frequently asked questions',
)

const DEFAULT_RELATED_SECTION = {
  eyebrow: i18nString('Samme fagområde', 'Same specialty area'),
  heading: i18nString('Andre spesialister', 'Other specialists'),
  ctaLabel: i18nString('Se alle', 'See all'),
  ctaPath: '/spesialister',
}

type SpecialistRow = {
  _id: string
  name?: string
  faqSectionTitle?: unknown
  relatedSpecialistsSection?: {
    eyebrow?: unknown
    heading?: unknown
    ctaLabel?: unknown
    ctaPath?: string
    specialists?: unknown[]
  }
}

function hasNoEnI18n(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim() && pickForLang(value, 'en')?.trim())
}

async function run() {
  const specialists = await sanityClient.fetch<SpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, faqSectionTitle,
      relatedSpecialistsSection{
        eyebrow, heading, ctaLabel, ctaPath,
        specialists
      }
    }`,
  )

  console.log(`▶ Backfill specialist section headings (${specialists.length} specialists)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of specialists) {
    const patch: Record<string, unknown> = {}
    const section = doc.relatedSpecialistsSection ?? {}
    const relatedPatch: Record<string, unknown> = {}

    if (FORCE || !hasNoEnI18n(doc.faqSectionTitle)) {
      patch.faqSectionTitle = DEFAULT_FAQ_SECTION_TITLE
    }

    if (FORCE || !hasNoEnI18n(section.eyebrow)) {
      relatedPatch.eyebrow = DEFAULT_RELATED_SECTION.eyebrow
    }
    if (FORCE || !hasNoEnI18n(section.heading)) {
      relatedPatch.heading = DEFAULT_RELATED_SECTION.heading
    }
    if (FORCE || !hasNoEnI18n(section.ctaLabel)) {
      relatedPatch.ctaLabel = DEFAULT_RELATED_SECTION.ctaLabel
    }
    if (FORCE || !String(section.ctaPath || '').trim()) {
      relatedPatch.ctaPath = DEFAULT_RELATED_SECTION.ctaPath
    }

    if (Object.keys(relatedPatch).length > 0) {
      patch.relatedSpecialistsSection = {
        ...section,
        ...relatedPatch,
      }
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    console.log(`  ✎ ${doc.name ?? doc._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped (already set): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
