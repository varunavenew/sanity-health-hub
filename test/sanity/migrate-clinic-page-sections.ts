/**
 * Seed booking CTA pageSections on all clinicPage documents.
 *
 * Usage:
 *   cd test && npm run migrate:clinic-page-sections:dry
 *   cd test && npm run migrate:clinic-page-sections
 */
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import { sanityClient } from './config'
import {
  buildClinicBookingCtaSection,
  hasSectionType,
  mergePageSections,
} from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type ClinicRow = {
  _id: string
  title?: unknown
  pageSections?: unknown[]
  slug?: string
}

function clinicSlug(doc: ClinicRow): string {
  if (doc.slug?.trim()) return doc.slug.trim()
  return doc._id.replace(/^drafts\./, '').replace(/^clinicPage-/, '')
}

async function run() {
  const clinics = await sanityClient.fetch<ClinicRow[]>(
    `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
      _id,
      title,
      pageSections,
      "slug": coalesce(
        slug[language == "no"][0].value.current,
        slug[_key == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      )
    }`,
  )

  console.log('▶ Migrate clinic page sections (booking CTA)')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}`)
  console.log(`  Clinics found: ${clinics.length}\n`)

  let updated = 0
  let skipped = 0

  for (const clinic of clinics) {
    const slug = clinicSlug(clinic)
    const labelNo = pickNo(clinic.title)?.trim() || slug
    const labelEn = pickForLang(clinic.title, 'en')?.trim() || labelNo
    const section = buildClinicBookingCtaSection({ slug, labelNo, labelEn })
    const { sections, changed } = mergePageSections(
      clinic.pageSections,
      [section],
      FORCE,
    )

    if (!changed) {
      console.log(`  ⏭  ${slug} — booking CTA already present`)
      skipped++
      continue
    }

    console.log(`  ✎  ${slug} — add booking CTA`)
    if (!DRY_RUN) {
      await sanityClient.patch(clinic._id).set({ pageSections: sections }).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} clinics: ${updated}`)
  console.log(`⏭  Skipped: ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
