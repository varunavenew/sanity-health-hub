/**
 * Singleton section data migration (developer dataset only).
 *
 * Goal: populate empty modern sections from existing page data without
 * overwriting configured content, without deleting legacy, and without
 * inventing new frontend-visible content that was never on the page.
 *
 * Idempotent. Homepage is never patched.
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-singleton-section-data.ts
 *   npx tsx sanity/migrate-singleton-section-data.ts
 */
import {sanityClient as client} from './config'
import {pickForLang, pickNo} from '../schemaTypes/i18n'
import {i18nString, i18nText} from './lib/category-landing-i18n'
import {hasSectionType} from './lib/page-sections-migrate'
import {patchSingletonFields} from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const HOMEPAGE_ID = 'homepage'

export type MigrationAction = {
  page: string
  section: string
  action:
    | 'created'
    | 'reused'
    | 'already-existed'
    | 'synced-draft'
    | 'skipped'
    | 'not-applicable'
  detail: string
}

export type MigrationReport = {
  dryRun: boolean
  dataset: string
  actions: MigrationAction[]
  collectionsCreated: string[]
  collectionsReused: string[]
  sharedSectionsCreated: number
  sharedSectionsReused: number
  pagesMigrated: Set<string>
}

function hasUsableI18n(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim() || pickForLang(value, 'en')?.trim())
}

function cloneI18n(value: unknown, asText = false): ReturnType<typeof i18nString> | undefined {
  const no = pickNo(value)?.trim()
  const en = pickForLang(value, 'en')?.trim() || no
  if (!no && !en) return undefined
  return asText ? i18nText(no || en!, en || no!) : i18nString(no || en!, en || no!)
}

async function ensureGuideBookingCta(report: MigrationReport) {
  const docs = await client.fetch<
    Array<{
      _id: string
      pageSections?: unknown[] | null
      ctaTitle?: unknown
      ctaSubtitle?: unknown
      ctaButtonLabel?: unknown
      ctaButtonPath?: string | null
    }>
  >(`*[_id in ["guidePage", "drafts.guidePage"]]{
    _id, pageSections, ctaTitle, ctaSubtitle, ctaButtonLabel, ctaButtonPath
  }`)

  if (docs.length === 0) {
    report.actions.push({
      page: 'guidePage',
      section: 'Booking CTA',
      action: 'skipped',
      detail: 'guidePage document not found',
    })
    return
  }

  const published = docs.find((d) => d._id === 'guidePage') || docs[0]
  if (hasSectionType(published.pageSections || undefined, 'pageSectionBookingCta')) {
    report.actions.push({
      page: 'guidePage',
      section: 'Booking CTA',
      action: 'already-existed',
      detail: 'pageSectionBookingCta already present',
    })
    report.sharedSectionsReused += 1
    return
  }

  const hasLegacy =
    hasUsableI18n(published.ctaTitle) ||
    hasUsableI18n(published.ctaSubtitle) ||
    hasUsableI18n(published.ctaButtonLabel)

  if (!hasLegacy) {
    report.actions.push({
      page: 'guidePage',
      section: 'Booking CTA',
      action: 'skipped',
      detail: 'No legacy CTA fields and no existing Booking CTA band',
    })
    return
  }

  const collectionId = 'migrated-cta-collection.guidePage'
  const existingCollection = await client.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: collectionId,
  })

  const title = cloneI18n(published.ctaTitle) || i18nString('Klar til å starte?', 'Ready to get started?')
  const subtitle =
    cloneI18n(published.ctaSubtitle, true) ||
    i18nText(
      'Book en time hos våre spesialister i dag. Ingen henvisning nødvendig.',
      'Book an appointment with our specialists today. No referral needed.',
    )
  const primaryLabel =
    cloneI18n(published.ctaButtonLabel) || i18nString('Book time nå', 'Book now')
  const primaryPath =
    typeof published.ctaButtonPath === 'string' && published.ctaButtonPath.trim()
      ? published.ctaButtonPath.trim()
      : '/booking'

  if (!existingCollection) {
    const collectionDoc = {
      _id: collectionId,
      _type: 'ctaCollection',
      internalName: 'Guide page Booking CTA',
      description: 'Migrated from guidePage legacy cta* fields. Legacy fields preserved on the page.',
      title,
      subtitle,
      primaryLabel,
      primaryPath,
      showSecondaryButton: false,
      sortOrder: 0,
      notes:
        'Created by migrate-singleton-section-data.ts. Reversible: remove guidePage pageSectionBookingCta and/or this collection.',
    }
    if (DRY_RUN) {
      console.log(`[dry-run] create CTA collection ${collectionId}`)
    } else {
      await client.createOrReplace(collectionDoc)
      console.log(`Created CTA collection ${collectionId}`)
    }
    report.collectionsCreated.push(collectionId)
  } else {
    report.collectionsReused.push(collectionId)
    report.actions.push({
      page: 'guidePage',
      section: 'Booking CTA',
      action: 'reused',
      detail: `Reused CTA collection ${collectionId}`,
    })
  }

  const band = {
    _type: 'pageSectionBookingCta',
    _key: 'guidePage-booking-cta',
    ctaCollection: {_type: 'reference', _ref: collectionId},
    // Keep inline mirrors for dual-read / rollback visibility
    title,
    subtitle,
    primaryLabel,
    primaryPath,
    showSecondaryButton: false,
  }

  const nextSections = [...(Array.isArray(published.pageSections) ? published.pageSections : []), band]

  if (DRY_RUN) {
    console.log('[dry-run] guidePage: append pageSectionBookingCta linked to', collectionId)
  } else {
    await patchSingletonFields('guidePage', {pageSections: nextSections}, 'guidePage')
    console.log('Migrated guidePage Booking CTA ← legacy cta* + CTA collection')
  }

  report.sharedSectionsCreated += 1
  report.pagesMigrated.add('guidePage')
  report.actions.push({
    page: 'guidePage',
    section: 'Booking CTA',
    action: 'created',
    detail: existingCollection
      ? `Linked existing collection ${collectionId}`
      : `Created collection ${collectionId} from legacy cta* fields`,
  })
}

/**
 * If a draft is missing modern fields that published already has, sync them.
 * Never overwrites draft values that are already configured.
 */
async function syncDraftFromPublished(
  documentId: string,
  report: MigrationReport,
): Promise<void> {
  if (documentId === HOMEPAGE_ID) return

  const published = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, {
    id: documentId,
  })
  const draft = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, {
    id: `drafts.${documentId}`,
  })

  if (!published || !draft) return

  const patch: Record<string, unknown> = {}

  const pubSections = published.pageSections
  const draftSections = draft.pageSections
  const pubHasBooking =
    Array.isArray(pubSections) && hasSectionType(pubSections, 'pageSectionBookingCta')
  const draftHasBooking =
    Array.isArray(draftSections) && hasSectionType(draftSections, 'pageSectionBookingCta')
  const draftEmpty =
    !Array.isArray(draftSections) ||
    draftSections.length === 0 ||
    (Array.isArray(pubSections) &&
      pubSections.length > 0 &&
      (!Array.isArray(draftSections) || draftSections.length < pubSections.length) &&
      !draftHasBooking &&
      pubHasBooking)

  // Only sync pageSections when draft has no booking CTA but published does,
  // or draft array is empty while published has sections.
  if (
    Array.isArray(pubSections) &&
    pubSections.length > 0 &&
    (!Array.isArray(draftSections) ||
      draftSections.length === 0 ||
      (pubHasBooking && !draftHasBooking && draftEmpty))
  ) {
    // If draft has some sections, merge missing types only.
    if (Array.isArray(draftSections) && draftSections.length > 0) {
      const merged = [...draftSections]
      let changed = false
      for (const section of pubSections as Array<{_type?: string}>) {
        const type = section?._type
        if (!type) continue
        if (!hasSectionType(merged, type)) {
          merged.push(section)
          changed = true
        }
      }
      if (changed) patch.pageSections = merged
    } else {
      patch.pageSections = pubSections
    }
  }

  const pubFaq = (published.faqCollection as {_ref?: string} | undefined)?._ref
  const draftFaq = (draft.faqCollection as {_ref?: string} | undefined)?._ref
  if (pubFaq && !draftFaq) {
    patch.faqCollection = {_type: 'reference', _ref: pubFaq}
  }

  if (Object.keys(patch).length === 0) return

  if (DRY_RUN) {
    console.log(`[dry-run] sync draft drafts.${documentId} ← published`, Object.keys(patch))
  } else {
    await client
      .patch(`drafts.${documentId}`)
      .set(patch)
      .commit({autoGenerateArrayKeys: true})
    console.log(`Synced draft drafts.${documentId}: ${Object.keys(patch).join(', ')}`)
  }

  report.pagesMigrated.add(documentId)
  report.actions.push({
    page: documentId,
    section: Object.keys(patch).join(', '),
    action: 'synced-draft',
    detail: `Copied from published without overwriting configured draft fields`,
  })
}

async function auditAlreadyConfigured(report: MigrationReport) {
  const pages = [
    'aboutPage',
    'servicesPage',
    'insurancePage',
    'pricingPage',
    'clinicsPage',
    'contactPage',
    'newsPage',
    'guidePage',
    'careersPage',
    'privacyPolicyPage',
  ]

  const docs = await client.fetch<
    Array<{
      _id: string
      _type: string
      pageSections?: Array<{
        _type?: string
        ctaCollection?: {_ref?: string}
        displayMode?: string
      }> | null
      faqCollection?: {_ref?: string} | null
      faqs?: unknown[] | null
      testimonials?: unknown[] | null
      partnersLocalized?: unknown[] | null
      featuredArticles?: unknown[] | null
      ctaTitle?: unknown
      ctaButtonLabel?: unknown
      primaryCtaLabel?: unknown
    }>
  >(
    `*[_type in $types && !(_id in path("drafts.**"))]{
      _id, _type, pageSections, faqCollection, faqs, testimonials, partnersLocalized,
      featuredArticles, ctaTitle, ctaButtonLabel, primaryCtaLabel
    }`,
    {types: pages},
  )

  for (const doc of docs) {
    const sections = Array.isArray(doc.pageSections) ? doc.pageSections : []
    const booking = sections.find((s) => s._type === 'pageSectionBookingCta')
    const specialists = sections.find((s) => s._type === 'pageSectionSpecialists')
    const articles = sections.find((s) => s._type === 'pageSectionArticles')

    if (booking) {
      report.sharedSectionsReused += 1
      report.actions.push({
        page: doc._id,
        section: 'Booking CTA',
        action: 'already-existed',
        detail: booking.ctaCollection?._ref
          ? `ctaCollection=${booking.ctaCollection._ref}`
          : 'inline Booking CTA band',
      })
      if (booking.ctaCollection?._ref) {
        report.collectionsReused.push(booking.ctaCollection._ref)
      }
    }

    if (specialists) {
      report.sharedSectionsReused += 1
      report.actions.push({
        page: doc._id,
        section: 'Specialists',
        action: 'already-existed',
        detail: `displayMode=${specialists.displayMode || 'all'}`,
      })
    }

    if (articles) {
      report.sharedSectionsReused += 1
      report.actions.push({
        page: doc._id,
        section: 'Articles',
        action: 'already-existed',
        detail: `displayMode=${articles.displayMode || 'latest'}`,
      })
    }

    if (doc.faqCollection?._ref) {
      report.collectionsReused.push(doc.faqCollection._ref)
      report.actions.push({
        page: doc._id,
        section: 'FAQ',
        action: 'already-existed',
        detail: `faqCollection=${doc.faqCollection._ref}`,
      })
    } else if (Array.isArray(doc.faqs) && doc.faqs.length > 0) {
      report.actions.push({
        page: doc._id,
        section: 'FAQ',
        action: 'skipped',
        detail: 'Legacy FAQs present but page type has no FAQ Collection field / already handled elsewhere',
      })
    }

    if (Array.isArray(doc.testimonials) && doc.testimonials.length > 0) {
      report.actions.push({
        page: doc._id,
        section: 'Testimonials',
        action: 'already-existed',
        detail: `${doc.testimonials.length} testimonials`,
      })
    }

    if (Array.isArray(doc.partnersLocalized) && doc.partnersLocalized.length > 0) {
      report.actions.push({
        page: doc._id,
        section: 'Partners',
        action: 'already-existed',
        detail: `${doc.partnersLocalized.length} localized partners`,
      })
    }

    if (Array.isArray(doc.featuredArticles) && doc.featuredArticles.length > 0) {
      report.actions.push({
        page: doc._id,
        section: 'Featured Articles',
        action: 'already-existed',
        detail: `${doc.featuredArticles.length} featured article refs (page-owned, not pageSectionArticles)`,
      })
    }
  }
}

async function main() {
  const report: MigrationReport = {
    dryRun: DRY_RUN,
    dataset: process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'unknown',
    actions: [],
    collectionsCreated: [],
    collectionsReused: [],
    sharedSectionsCreated: 0,
    sharedSectionsReused: 0,
    pagesMigrated: new Set(),
  }

  console.log(`▶ Singleton section data migration — DRY_RUN=${DRY_RUN}`)
  console.log('  Homepage: NEVER modified')
  console.log('  Production: refused by config guard\n')

  // Homepage guard — refuse if somehow targeted
  const homepageTouch = process.env.MIGRATE_HOMEPAGE === '1'
  if (homepageTouch) {
    throw new Error('Refusing to migrate homepage (MIGRATE_HOMEPAGE is not allowed).')
  }

  await ensureGuideBookingCta(report)

  for (const id of [
    'aboutPage',
    'servicesPage',
    'insurancePage',
    'pricingPage',
    'clinicsPage',
    'contactPage',
    'newsPage',
    'guidePage',
    'careersPage',
    'privacyPolicyPage',
  ]) {
    await syncDraftFromPublished(id, report)
  }

  await auditAlreadyConfigured(report)

  // Deduplicate collection reuse list
  report.collectionsReused = [...new Set(report.collectionsReused)]
  report.collectionsCreated = [...new Set(report.collectionsCreated)]

  console.log('\n──────────────────────────────────────────')
  console.log(
    JSON.stringify(
      {
        dryRun: report.dryRun,
        dataset: report.dataset,
        pagesMigrated: [...report.pagesMigrated],
        sharedSectionsCreated: report.sharedSectionsCreated,
        sharedSectionsReused: report.sharedSectionsReused,
        collectionsCreated: report.collectionsCreated,
        collectionsReused: report.collectionsReused,
        actionCount: report.actions.length,
      },
      null,
      2,
    ),
  )

  // Write machine-readable actions for the report generator
  const fs = await import('fs')
  const path = await import('path')
  const out = path.join(process.cwd(), 'sanity', '.migration-singleton-section-data.json')
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        ...report,
        pagesMigrated: [...report.pagesMigrated],
      },
      null,
      2,
    ),
  )
  console.log(`\nWrote ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
