/**
 * Migrate treatment specialists + booking CTA into pageSections on treatment.
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-treatment-page-sections.ts
 *   DRY_RUN=1 cd test && npx tsx sanity/migrate-treatment-page-sections.ts
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { hasSectionType } from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type TreatmentRow = {
  _id: string
  title?: unknown
  slug?: { current: string }
  category?: { _id: string; categoryId?: string }
  relatedSpecialists?: Array<{ _ref: string; _type: string }>
  specialistTitle?: unknown
  specialistDescription?: unknown
  specialistCtaLabel?: unknown
  specialistCtaHref?: string
  ctaTitle?: unknown
  ctaDescription?: unknown
  conversationCtaTitle?: unknown
  bookingService?: string
  pageSections?: unknown[]
}

function buildSpecialistsSection(doc: TreatmentRow, categoryId: string) {
  const title = doc.specialistTitle || i18nString(
    'Spesialistene som følger deg.',
    'The specialists who support you.'
  )
  const description = doc.specialistDescription || i18nText(
    'Erfaren, spisskompetanse og moderne teknologi samlet på ett sted.',
    'Experience, expertise and modern technology in one place.'
  )
  const seeAllLabel = doc.specialistCtaLabel || i18nString(
    'Se alle spesialister',
    'See all specialists'
  )
  const seeAllHref = doc.specialistCtaHref || `/spesialister?kategori=${categoryId}`

  return {
    _type: 'pageSectionSpecialists',
    _key: `specialists-section`,
    eyebrow: i18nString('Våre eksperter', 'Our experts'),
    title,
    description,
    displayMode: 'manual',
    specialists: doc.relatedSpecialists?.map((ref, idx) => ({
      _type: 'reference',
      _ref: ref._ref,
      _key: ref._ref || `spec-${idx}`
    })) || [],
    seeAllLabel,
    seeAllHref,
    limit: 8,
    variant: 'carousel'
  }
}

function buildBookingCtaSection(
  doc: TreatmentRow,
  categoryId: string,
  categoryRef: string,
  treatmentSlug: string
) {
  const title = doc.conversationCtaTitle || doc.ctaTitle || i18nString(
    'Bestill time hos spesialist',
    'Book an appointment with a specialist'
  )
  const subtitle = doc.ctaDescription || i18nText(
    'Velg tjeneste, klinikk og behandler – alt i én enkel booking.',
    'Choose service, clinic and practitioner – all in one simple booking.'
  )

  const tjeneste = doc.bookingService || treatmentSlug
  const primaryPath = `/booking?kategori=${categoryId}&tjeneste=${tjeneste}`

  return {
    _type: 'pageSectionBookingCta',
    _key: `booking-cta-section`,
    title,
    subtitle,
    primaryLabel: i18nString('Bestill time nå', 'Book now'),
    primaryPath,
    showSecondaryButton: true,
    secondaryLabel: i18nString('Ring oss', 'Call us'),
    quickInfoItems: [
      {
        _key: 'clock',
        icon: 'clock',
        text: i18nString('Ledig time innen 1–3 dager', 'Available appointments within 1–3 days')
      },
      {
        _key: 'shield',
        icon: 'shield',
        text: i18nString('Ingen henvisning nødvendig', 'No referral needed')
      }
    ],
    bookingCategory: {
      _type: 'reference',
      _ref: categoryRef
    },
    variant: 'dark'
  }
}

async function run() {
  const treatments = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id, title, slug,
      category->{ _id, categoryId },
      relatedSpecialists,
      specialistTitle, specialistDescription, specialistCtaLabel, specialistCtaHref,
      ctaTitle, ctaDescription, conversationCtaTitle,
      bookingService, pageSections
    }`
  )

  console.log(`▶ Migrate treatment page sections (${treatments.length} treatments)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of treatments) {
    const categoryRef = doc.category?._id || ''
    const categoryId = doc.category?.categoryId || ''
    const treatmentSlug = doc.slug?.current || ''
    const existing = Array.isArray(doc.pageSections) ? [...doc.pageSections] : []

    const patchSections = [...existing]
    let changed = false

    if (FORCE || !hasSectionType(patchSections, 'pageSectionSpecialists')) {
      patchSections.push(buildSpecialistsSection(doc, categoryId))
      changed = true
    }

    if (FORCE || !hasSectionType(patchSections, 'pageSectionBookingCta')) {
      patchSections.push(buildBookingCtaSection(doc, categoryId, categoryRef, treatmentSlug))
      changed = true
    }

    if (!changed) {
      skipped++
      continue
    }

    console.log(`  ✎ ${treatmentSlug || doc._id}`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ pageSections: patchSections })
        .unset([
          'relatedSpecialists',
          'specialistTitle',
          'specialistDescription',
          'specialistCtaLabel',
          'specialistCtaHref',
          'ctaTitle',
          'ctaDescription',
          'conversationCtaTitle'
        ])
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} treatments: ${updated}`)
  console.log(`⏭  Skipped (sections already present): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
