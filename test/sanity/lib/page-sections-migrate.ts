import { pickForLang, pickNo } from '../../schemaTypes/i18n'
import type { PageBookingCtaCopy } from '../data/page-booking-cta-copy'
import { treatmentCategoryBottomCtaByKey } from '../data/treatment-category-bottom-cta'
import { i18nString, i18nText } from './category-landing-i18n'

export const DEFAULT_BOOKING_NO = {
  title: 'Bestill time hos spesialist',
  subtitle: 'Velg tjeneste, klinikk og behandler – alt i én enkel booking.',
  primaryLabel: 'Bestill time nå',
  secondaryLabel: 'Ring oss',
  quickInfo: [
    { icon: 'clock', no: 'Ledig time innen 1–3 dager', en: 'Available appointments within 1–3 days' },
    { icon: 'shield', no: 'Ingen henvisning nødvendig', en: 'No referral needed' },
  ],
}

export const DEFAULT_BOOKING_EN = {
  title: 'Book an appointment with a specialist',
  subtitle: 'Choose service, clinic and practitioner – all in one simple booking.',
  primaryLabel: 'Book now',
  secondaryLabel: 'Call us',
}

/** Hardcoded specialist section copy from legacy category landing pages. */
export const CATEGORY_SPECIALISTS_COPY: Record<
  string,
  { titleNo: string; titleEn: string; seeAllNo: string; seeAllEn: string; seeAllHref: string }
> = {
  gynekologi: {
    titleNo: 'Gynekologene som følger deg.',
    titleEn: 'The gynecologists who support you.',
    seeAllNo: 'Se alle gynekologer',
    seeAllEn: 'See all gynecologists',
    seeAllHref: '/spesialister?kategori=gynekologi',
  },
  fertilitet: {
    titleNo: 'Fertilitetsspesialistene som følger deg.',
    titleEn: 'The fertility specialists who support you.',
    seeAllNo: 'Se alle fertilitetsspesialister',
    seeAllEn: 'See all fertility specialists',
    seeAllHref: '/spesialister?kategori=fertilitet',
  },
  urologi: {
    titleNo: 'Urologene som følger deg.',
    titleEn: 'The urologists who support you.',
    seeAllNo: 'Se alle urologer',
    seeAllEn: 'See all urologists',
    seeAllHref: '/spesialister?kategori=urologi',
  },
  ortopedi: {
    titleNo: 'Ortopedene som følger deg.',
    titleEn: 'The orthopedic specialists who support you.',
    seeAllNo: 'Se alle ortopeder',
    seeAllEn: 'See all orthopedic specialists',
    seeAllHref: '/spesialister?kategori=ortopedi',
  },
  graviditet: {
    titleNo: 'Spesialistene som følger deg gjennom svangerskapet.',
    titleEn: 'The specialists who support you through pregnancy.',
    seeAllNo: 'Se alle spesialister',
    seeAllEn: 'See all specialists',
    seeAllHref: '/spesialister?kategori=graviditet',
  },
  'flere-fagomrader': {
    titleNo: 'Spesialistene som følger deg.',
    titleEn: 'The specialists who support you.',
    seeAllNo: 'Se alle spesialister',
    seeAllEn: 'See all specialists',
    seeAllHref: '/spesialister?kategori=annet',
  },
}

export function hasSectionType(sections: unknown[] | undefined, type: string): boolean {
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

export type BookingCtaOptions = {
  key: string
  titleNo?: string
  titleEn?: string
  subtitleNo?: string
  subtitleEn?: string
  primaryLabelNo?: string
  primaryLabelEn?: string
  primaryPath?: string
  secondaryLabelNo?: string
  secondaryLabelEn?: string
  secondaryPath?: string
  showSecondaryButton?: boolean
  quickInfoItems?: PageBookingCtaCopy['quickInfoItems']
  categoryRef?: string
  variant?: 'dark' | 'warm' | 'withImage'
}

export function buildBookingCtaSectionFromCopy(key: string, copy: PageBookingCtaCopy) {
  return buildBookingCtaSection({
    key,
    titleNo: copy.title.no,
    titleEn: copy.title.en,
    subtitleNo: copy.subtitle.no,
    subtitleEn: copy.subtitle.en,
    primaryLabelNo: copy.primaryLabel.no,
    primaryLabelEn: copy.primaryLabel.en,
    primaryPath: copy.primaryPath,
    secondaryLabelNo: copy.secondaryLabel?.no,
    secondaryLabelEn: copy.secondaryLabel?.en,
    secondaryPath: copy.secondaryPath,
    showSecondaryButton: copy.showSecondaryButton,
    quickInfoItems: copy.quickInfoItems,
  })
}

export function buildBookingCtaSection(options: BookingCtaOptions) {
  const {
    key,
    titleNo = DEFAULT_BOOKING_NO.title,
    titleEn = DEFAULT_BOOKING_EN.title,
    subtitleNo = DEFAULT_BOOKING_NO.subtitle,
    subtitleEn = DEFAULT_BOOKING_EN.subtitle,
    primaryLabelNo = DEFAULT_BOOKING_NO.primaryLabel,
    primaryLabelEn = DEFAULT_BOOKING_EN.primaryLabel,
    primaryPath = '/booking',
    secondaryLabelNo = DEFAULT_BOOKING_NO.secondaryLabel,
    secondaryLabelEn = DEFAULT_BOOKING_EN.secondaryLabel,
    secondaryPath,
    showSecondaryButton = true,
    quickInfoItems,
    categoryRef,
    variant,
  } = options

  const section: Record<string, unknown> = {
    _type: 'pageSectionBookingCta',
    _key: key,
    title: i18nString(titleNo, titleEn),
    subtitle: i18nText(subtitleNo, subtitleEn),
    primaryLabel: i18nString(primaryLabelNo, primaryLabelEn),
    primaryPath,
    showSecondaryButton,
    secondaryLabel: i18nString(secondaryLabelNo, secondaryLabelEn),
  }

  if (secondaryPath?.trim()) {
    section.secondaryPath = secondaryPath.trim()
  }

  if (quickInfoItems !== undefined) {
    section.quickInfoItems = quickInfoItems.map((item) => ({
      _key: item.icon,
      icon: item.icon,
      text: i18nString(item.no, item.en),
    }))
  } else {
    section.quickInfoItems = DEFAULT_BOOKING_NO.quickInfo.map((item) => ({
      _key: item.icon,
      icon: item.icon,
      text: i18nString(item.no, item.en),
    }))
  }

  if (categoryRef) {
    section.bookingCategory = { _type: 'reference', _ref: categoryRef }
  }
  if (variant) {
    section.variant = variant
  }

  return section
}

export function buildCategoryBookingCtaSection(categoryId: string, categoryRef: string) {
  const copy = treatmentCategoryBottomCtaByKey[categoryId]
  if (copy?.bottomCta) {
    return buildBookingCtaSection({
      key: `booking-cta-${categoryId}`,
      titleNo: copy.bottomCta.title.no,
      titleEn: copy.bottomCta.title.en,
      subtitleNo: copy.bottomCta.subtitle.no,
      subtitleEn: copy.bottomCta.subtitle.en,
      primaryLabelNo: copy.bottomCta.primaryLabel.no,
      primaryLabelEn: copy.bottomCta.primaryLabel.en,
      primaryPath: copy.bottomCta.primaryPath || '/booking',
      secondaryLabelNo: copy.bottomCta.secondaryLabel.no,
      secondaryLabelEn: copy.bottomCta.secondaryLabel.en,
      secondaryPath: copy.bottomCta.secondaryPath,
      showSecondaryButton: true,
      quickInfoItems: [],
      categoryRef,
    })
  }
  return buildBookingCtaSection({
    key: `booking-cta-${categoryId}`,
    categoryRef,
  })
}

export type SpecialistsSectionOptions = {
  key: string
  displayMode?: 'all' | 'category' | 'manual'
  categoryRef?: string
  categoryId?: string
  titleNo?: string
  titleEn?: string
  seeAllNo?: string
  seeAllEn?: string
  seeAllHref?: string
  variant?: 'carousel' | 'gridDark' | 'gridLight'
  limit?: number
  legacyTitle?: unknown
  legacySeeAllLabel?: unknown
  legacySeeAllHref?: string
}

export function buildSpecialistsSection(options: SpecialistsSectionOptions) {
  const {
    key,
    displayMode = 'all',
    categoryRef,
    categoryId = '',
    titleNo = 'Møt våre spesialister',
    titleEn = 'Meet our specialists',
    seeAllNo = 'Se alle spesialister',
    seeAllEn = 'See all specialists',
    seeAllHref = '/spesialister',
    variant = 'carousel',
    limit = 24,
    legacyTitle,
    legacySeeAllLabel,
    legacySeeAllHref,
  } = options

  const section: Record<string, unknown> = {
    _type: 'pageSectionSpecialists',
    _key: key,
    eyebrow: i18nString('Våre eksperter', 'Our experts'),
    title: copyOrDefaultTitle(legacyTitle, titleNo, titleEn),
    description: i18nText(
      'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
      'Experience, expertise and modern technology in one place.',
    ),
    displayMode,
    seeAllLabel: copyOrDefaultTitle(legacySeeAllLabel, seeAllNo, seeAllEn),
    seeAllHref: legacySeeAllHref?.trim() || seeAllHref,
    limit,
    variant,
  }

  if (displayMode === 'category' && categoryRef) {
    section.treatmentCategory = { _type: 'reference', _ref: categoryRef }
  }

  return section
}

export function buildCategorySpecialistsSection(
  categoryId: string,
  categoryRef: string,
  legacy?: {
    title?: unknown
    seeAllLabel?: unknown
    seeAllHref?: string
  },
) {
  const copy = CATEGORY_SPECIALISTS_COPY[categoryId]
  const titleNo =
    pickNo(legacy?.title)?.trim() ||
    copy?.titleNo ||
    `Møt våre spesialister innen ${categoryId || 'CMedical'}`
  const titleEn =
    pickForLang(legacy?.title, 'en')?.trim() ||
    copy?.titleEn ||
    `Meet our ${categoryId || 'CMedical'} specialists`
  const seeAllNo =
    pickNo(legacy?.seeAllLabel)?.trim() ||
    copy?.seeAllNo ||
    `Se alle spesialister – ${categoryId}`
  const seeAllEn =
    pickForLang(legacy?.seeAllLabel, 'en')?.trim() ||
    copy?.seeAllEn ||
    `See all ${categoryId} specialists`

  return buildSpecialistsSection({
    key: `specialists-${categoryId}`,
    displayMode: 'category',
    categoryRef,
    categoryId,
    titleNo,
    titleEn,
    seeAllNo,
    seeAllEn,
    seeAllHref: legacy?.seeAllHref?.trim() || copy?.seeAllHref || `/spesialister?kategori=${categoryId}`,
    legacyTitle: legacy?.title,
    legacySeeAllLabel: legacy?.seeAllLabel,
    legacySeeAllHref: legacy?.seeAllHref,
  })
}

export function buildHomepageSpecialistsSection() {
  return buildSpecialistsSection({
    key: 'homepage-specialists',
    displayMode: 'all',
    titleNo: 'Møt våre spesialister',
    titleEn: 'Meet our specialists',
  })
}

export function buildServicesPageSpecialistsSection() {
  return buildSpecialistsSection({
    key: 'services-specialists',
    displayMode: 'all',
    titleNo: 'Spesialistene som utfører behandlingene',
    titleEn: 'The specialists who perform the treatments',
    seeAllNo: 'Se alle spesialister',
    seeAllEn: 'See all specialists',
    seeAllHref: '/spesialister',
    limit: 24,
    variant: 'carousel',
  })
}

export function buildHomepageBookingCtaSection() {
  return buildBookingCtaSection({ key: 'homepage-booking-cta' })
}

/** Booking CTA for individual clinic detail pages (ClinicDetailPage). */
export function buildClinicBookingCtaSection(options: {
  slug: string
  labelNo: string
  labelEn?: string
}) {
  const { slug, labelNo, labelEn = labelNo } = options
  return buildBookingCtaSection({
    key: `booking-cta-${slug}`,
    titleNo: `Bestill time ved CMedical ${labelNo}`,
    titleEn: `Book an appointment at CMedical ${labelEn}`,
    primaryPath: `/booking?klinikk=${encodeURIComponent(slug)}`,
    variant: 'warm',
  })
}

export function bookingPathForTreatment(kategori: string, tjeneste?: string): string {
  const sp = new URLSearchParams()
  if (kategori.trim()) sp.set('kategori', kategori.trim())
  if (tjeneste?.trim()) sp.set('tjeneste', tjeneste.trim())
  const qs = sp.toString()
  return qs ? `/booking?${qs}` : '/booking'
}

/** Dark footer booking CTA for treatment sub-pages (SubTreatmentLayout). */
export function buildSubTreatmentBookingCtaSection(options: {
  slug: string
  categoryRef: string
  kategori: string
  tjeneste?: string
  primaryLabelNo?: string
  primaryLabelEn?: string
}) {
  const {
    slug,
    categoryRef,
    kategori,
    tjeneste,
    primaryLabelNo = DEFAULT_BOOKING_NO.primaryLabel,
    primaryLabelEn = DEFAULT_BOOKING_EN.primaryLabel,
  } = options

  return buildBookingCtaSection({
    key: `booking-cta-${slug}`,
    categoryRef,
    primaryPath: bookingPathForTreatment(kategori, tjeneste),
    primaryLabelNo,
    primaryLabelEn,
    variant: 'dark',
  })
}

export function mergePageSections(
  existing: unknown[] | undefined,
  sections: Record<string, unknown>[],
  force: boolean,
): { sections: unknown[]; changed: boolean } {
  const patchSections = Array.isArray(existing) ? [...existing] : []
  let changed = false

  for (const section of sections) {
    const type = section._type as string
    if (force || !hasSectionType(patchSections, type)) {
      patchSections.push(section)
      changed = true
    }
  }

  return { sections: patchSections, changed }
}
