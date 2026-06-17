/**
 * Move landing specialists + booking CTA into pageSections on treatmentCategory.
 *
 * Usage:
 *   cd test && npm run migrate:category-page-sections:dry
 *   cd test && npm run migrate:category-page-sections
 */
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type CategoryRow = {
  _id: string
  categoryId?: string
  pageSections?: unknown[]
  landingPage?: {
    specialistsSection?: {
      title?: unknown
      seeAllLabel?: unknown
      seeAllHref?: string
    }
  }
}

const DEFAULT_BOOKING_NO = {
  title: 'Bestill time hos spesialist',
  subtitle: 'Velg tjeneste, klinikk og behandler – alt i én enkel booking.',
  primaryLabel: 'Bestill time nå',
  secondaryLabel: 'Ring oss',
  quickInfo: [
    { icon: 'clock', no: 'Ledig time innen 1–3 dager', en: 'Appointment available within 1–3 days' },
    { icon: 'shield', no: 'Ingen henvisning nødvendig', en: 'No referral required' },
  ],
}

const DEFAULT_BOOKING_EN = {
  title: 'Book an appointment with a specialist',
  subtitle: 'Choose service, clinic and practitioner – all in one simple booking.',
  primaryLabel: 'Book now',
  secondaryLabel: 'Call us',
}

function hasSectionType(sections: unknown[] | undefined, type: string): boolean {
  if (!Array.isArray(sections)) return false
  return sections.some((s) => (s as { _type?: string })?._type === type)
}

function copyOrDefaultTitle(
  source: unknown,
  fallbackNo: string,
  fallbackEn: string,
): ReturnType<typeof i18nString> {
  if (pickNo(source)?.trim() && pickForLang(source, 'en')?.trim()) {
    return i18nString(pickNo(source)!, pickForLang(source, 'en')!)
  }
  return i18nString(fallbackNo, fallbackEn)
}

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId, pageSections,
      landingPage { specialistsSection { title, seeAllLabel, seeAllHref } }
    }`,
  )

  console.log(`▶ Migrate category page sections (${categories.length} categories)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const cat of categories) {
    const categoryId = cat.categoryId || ''
    const legacy = cat.landingPage?.specialistsSection
    const existing = Array.isArray(cat.pageSections) ? [...cat.pageSections] : []

    const patchSections = [...existing]
    let changed = false

    if (FORCE || !hasSectionType(patchSections, 'pageSectionSpecialists')) {
      const titleNo =
        pickNo(legacy?.title)?.trim() ||
        `Møt våre spesialister innen ${categoryId || 'CMedical'}`
      const titleEn =
        pickForLang(legacy?.title, 'en')?.trim() ||
        `Meet our ${categoryId || 'CMedical'} specialists`
      const seeAllNo =
        pickNo(legacy?.seeAllLabel)?.trim() ||
        `Se alle spesialister – ${categoryId}`
      const seeAllEn =
        pickForLang(legacy?.seeAllLabel, 'en')?.trim() ||
        `See all ${categoryId} specialists`

      patchSections.push({
        _type: 'pageSectionSpecialists',
        _key: `specialists-${categoryId}`,
        eyebrow: i18nString('Våre eksperter', 'Our experts'),
        title: copyOrDefaultTitle(legacy?.title, titleNo, titleEn),
        description: i18nString(
          'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
          'Experience, expertise and modern technology in one place.',
        ),
        displayMode: 'category',
        treatmentCategory: { _type: 'reference', _ref: cat._id },
        seeAllLabel: copyOrDefaultTitle(legacy?.seeAllLabel, seeAllNo, seeAllEn),
        seeAllHref: legacy?.seeAllHref?.trim() || `/spesialister?kategori=${categoryId}`,
        limit: 24,
        variant: 'carousel',
      })
      changed = true
    }

    if (FORCE || !hasSectionType(patchSections, 'pageSectionBookingCta')) {
      patchSections.push({
        _type: 'pageSectionBookingCta',
        _key: `booking-cta-${categoryId}`,
        title: i18nString(DEFAULT_BOOKING_NO.title, DEFAULT_BOOKING_EN.title),
        subtitle: i18nText(DEFAULT_BOOKING_NO.subtitle, DEFAULT_BOOKING_EN.subtitle),
        primaryLabel: i18nString(
          DEFAULT_BOOKING_NO.primaryLabel,
          DEFAULT_BOOKING_EN.primaryLabel,
        ),
        primaryPath: '/booking',
        bookingCategory: { _type: 'reference', _ref: cat._id },
        secondaryLabel: i18nString(
          DEFAULT_BOOKING_NO.secondaryLabel,
          DEFAULT_BOOKING_EN.secondaryLabel,
        ),
        quickInfoItems: DEFAULT_BOOKING_NO.quickInfo.map((item) => ({
          _key: item.icon,
          icon: item.icon,
          text: i18nString(item.no, item.en),
        })),
      })
      changed = true
    }

    if (!changed) {
      skipped++
      continue
    }

    console.log(`  ✎ ${categoryId || cat._id}`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(cat._id)
        .set({ pageSections: patchSections })
        .unset(['landingPage.specialistsSection'])
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} categories: ${updated}`)
  console.log(`⏭  Skipped (sections already present): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
