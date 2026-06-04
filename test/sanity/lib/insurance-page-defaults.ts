import { i18nString, i18nText } from './category-landing-i18n'

export const INSURANCE_PARTNERS = [
  'EuroAccident',
  'Falck',
  'Fremtind',
  'Gjensidige',
  'If',
  'Storebrand',
  'Tryg',
] as const

const EN_PARTNER: Record<string, string> = {
  EuroAccident: 'EuroAccident',
  Falck: 'Falck',
  Fremtind: 'Fremtind Insurance',
  Gjensidige: 'Gjensidige Insurance',
  If: 'If Insurance',
  Storebrand: 'Storebrand Insurance',
  Tryg: 'Tryg Insurance',
}

const STEPS = [
  {
    no: { title: 'Få henvisning', description: 'Fra fastlege eller spesialist' },
    en: { title: 'Get a referral', description: 'From your GP or a specialist' },
  },
  {
    no: { title: 'Send til forsikring', description: 'For godkjenning av dekning' },
    en: { title: 'Submit to your insurer', description: 'For coverage approval' },
  },
  {
    no: { title: 'Velg CMedical', description: 'Be om behandling hos oss' },
    en: { title: 'Choose CMedical', description: 'Request treatment with us' },
  },
  {
    no: { title: 'Bestill time', description: 'Vi fakturerer forsikringen direkte' },
    en: { title: 'Book an appointment', description: 'We invoice your insurer directly' },
  },
] as const

const BENEFITS = [
  {
    no: {
      title: 'Ingen utlegg',
      description:
        'Du slipper å betale selv – vi sender faktura direkte til forsikringsselskapet.',
    },
    en: {
      title: 'No out-of-pocket costs',
      description:
        'You do not pay upfront – we invoice your insurance company directly.',
    },
  },
  {
    no: {
      title: 'Raskere behandling',
      description: 'Få time innen kort tid med kort ventetid hos våre spesialister.',
    },
    en: {
      title: 'Faster treatment',
      description: 'Get an appointment quickly with short waiting times at our specialists.',
    },
  },
  {
    no: {
      title: 'Alle forsikringer',
      description: 'Vi har avtale med alle store forsikringsselskaper i Norge.',
    },
    en: {
      title: 'All major insurers',
      description: 'We work with all major insurance providers in Norway.',
    },
  },
] as const

export function buildInsuranceSteps() {
  return STEPS.map((s, i) => ({
    _type: 'object' as const,
    _key: `is${i + 1}`,
    title: i18nString(s.no.title, s.en.title),
    description: i18nText(s.no.description, s.en.description),
  }))
}

export function buildInsuranceBenefits() {
  return BENEFITS.map((b, i) => ({
    _type: 'object' as const,
    _key: `ib${i + 1}`,
    title: i18nString(b.no.title, b.en.title),
    description: i18nText(b.no.description, b.en.description),
  }))
}

export function buildPartnersLocalized(partners: string[]) {
  return partners.map((partner, index) => ({
    _type: 'object' as const,
    _key: `partner-${index + 1}`,
    name: i18nString(partner, EN_PARTNER[partner] || partner),
  }))
}

export const DEFAULT_INSURANCE_SEO = {
  _type: 'seo' as const,
  metaTitle: i18nString(
    'Helseforsikring – Bruk forsikringen din hos CMedical',
    'Health insurance – Use your insurance at CMedical',
  ),
  metaDescription: i18nText(
    'CMedical har avtale med alle store forsikringsselskaper. Ingen utlegg – vi fakturerer forsikringen direkte. Kort ventetid og ledende spesialister.',
    'CMedical works with all major insurance providers. No out-of-pocket costs – we bill your insurer directly. Short waiting times and leading specialists.',
  ),
}

/** Full Forsikring page body in Studio-compatible i18n shape. */
export function buildInsurancePageContent(partners: string[] = [...INSURANCE_PARTNERS]) {
  return {
    title: i18nString('Helseforsikring', 'Health Insurance'),
    introText: i18nText(
      'Bruk forsikringen din til raskere behandling hos oss',
      'Use your insurance for faster treatment with us',
    ),
    partners,
    partnersLocalized: buildPartnersLocalized(partners),
    steps: buildInsuranceSteps(),
    benefits: buildInsuranceBenefits(),
    seo: DEFAULT_INSURANCE_SEO,
  }
}
