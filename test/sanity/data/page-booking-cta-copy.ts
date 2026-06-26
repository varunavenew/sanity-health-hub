/** Per-page booking CTA copy migrated from hardcoded frontend / i18n. */

export type PageBookingCtaCopy = {
  title: { no: string; en: string }
  subtitle: { no: string; en: string }
  primaryLabel: { no: string; en: string }
  primaryPath?: string
  secondaryLabel?: { no: string; en: string }
  secondaryPath?: string
  showSecondaryButton?: boolean
  /** When `[]`, quick info is hidden. When omitted, defaults apply. */
  quickInfoItems?: { icon: 'clock' | 'shield'; no: string; en: string }[]
}

/** Default pre-footer CTA (BookingCTA / CTASection on most pages). */
export const DEFAULT_PAGE_BOOKING_CTA: PageBookingCtaCopy = {
  title: {
    no: 'Bestill time hos spesialist',
    en: 'Book an appointment with a specialist',
  },
  subtitle: {
    no: 'Velg tjeneste, klinikk og behandler – alt i én enkel booking.',
    en: 'Choose service, clinic and practitioner – all in one simple booking.',
  },
  primaryLabel: {
    no: 'Bestill time nå',
    en: 'Book now',
  },
  primaryPath: '/booking',
  secondaryLabel: {
    no: 'Ring oss',
    en: 'Call us',
  },
  showSecondaryButton: true,
}

/** Priser.tsx hardcoded CTA section (`cta.*` + `nav.bookAppointment`). */
export const PRICING_PAGE_BOOKING_CTA: PageBookingCtaCopy = {
  title: {
    no: 'Ta vare på livet og underlivet',
    en: 'Take care of your health',
  },
  subtitle: {
    no: 'Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging',
    en: 'Be taken seriously – with clinical expertise, respect and comprehensive follow-up',
  },
  primaryLabel: {
    no: 'Bestill time',
    en: 'Book appointment',
  },
  primaryPath: '/booking',
  secondaryLabel: {
    no: 'Kontakt oss',
    en: 'Contact us',
  },
  secondaryPath: '/kontakt',
  showSecondaryButton: true,
  quickInfoItems: [],
}

/** Singleton pages that had hardcoded CTASection / BookingCTA. */
export const SINGLETON_PAGE_BOOKING_CTA: Record<string, PageBookingCtaCopy> = {
  aboutPage: DEFAULT_PAGE_BOOKING_CTA,
  servicesPage: DEFAULT_PAGE_BOOKING_CTA,
  pricingPage: PRICING_PAGE_BOOKING_CTA,
  contactPage: DEFAULT_PAGE_BOOKING_CTA,
  clinicsPage: DEFAULT_PAGE_BOOKING_CTA,
}

/** Documents that should not have auto-seeded page sections. */
export const PAGE_SECTIONS_EXCLUDED_DOC_IDS = new Set([
  'insurancePage',
  'careersPage',
  'specialistsPage',
  'specialistsListingPage',
  'privacyPolicyPage',
  'newsPage',
])

export const PAGE_SECTIONS_EXCLUDED_DOC_TYPES = new Set(['themePage', 'clinicPage'])
