/**
 * Wrap siteSettings navigation labels in internationalizedArrayString (NO + EN).
 * Fixes Studio errors on mainNavigation, footerAboutLinks, ctaButton.label.
 *
 * Run: cd test && npm run migrate:site-settings
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nItem = { _type: string; language: string; value: string }

const NAV_ID_EN: Record<string, string> = {
  services: 'Services',
  pricing: 'Pricing',
  insurance: 'Insurance',
  news: 'News',
  about: 'About us',
  clinics: 'Clinics',
  contact: 'Contact',
  specialists: 'Specialists',
}

const LABEL_EN: Record<string, string> = {
  Tjenester: 'Services',
  Priser: 'Pricing',
  Forsikring: 'Insurance',
  Aktuelt: 'News',
  'Om oss': 'About us',
  Kontakt: 'Contact',
  Spesialister: 'Specialists',
  Klinikker: 'Clinics',
  Karriere: 'Careers',
  'Bestill time': 'Book appointment',
}

function isI18nArray(val: unknown): val is I18nItem[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    (val[0] as I18nItem)._type?.startsWith('internationalizedArray')
  )
}

function pickNo(val: unknown): string {
  if (typeof val === 'string') return val.trim()
  if (!isI18nArray(val)) return ''
  const no = val.find((i) => i.language === 'no') || val[0]
  return typeof no?.value === 'string' ? no.value.trim() : ''
}

function toEn(no: string, navId?: string): string {
  if (navId && NAV_ID_EN[navId]) return NAV_ID_EN[navId]
  return LABEL_EN[no] || no
}

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: 'internationalizedArrayStringValue', language: 'no', value: no },
    { _type: 'internationalizedArrayStringValue', language: 'en', value: en },
  ]
}

function wrapLabel(label: unknown, navId?: string): I18nItem[] | unknown {
  if (isI18nArray(label)) {
    const no = pickNo(label)
    const enItem = label.find((i) => i.language === 'en')
    if (enItem?.value?.trim()) return label
    if (!no) return label
    return i18nString(no, toEn(no, navId))
  }
  if (typeof label === 'string' && label.trim()) {
    const no = label.trim()
    return i18nString(no, toEn(no, navId))
  }
  return label
}

type NavItem = {
  _key?: string
  _type?: string
  label?: unknown
  navId?: string
  path?: string
  isServicesDropdown?: boolean
}

function fixNavItems(items: NavItem[] | undefined): NavItem[] | undefined {
  if (!items?.length) return items
  return items.map((item) => ({
    ...item,
    label: wrapLabel(item.label, item.navId),
  }))
}

async function run() {
  const docs = await sanityClient.fetch<
    {
      _id: string
      mainNavigation?: NavItem[]
      footerAboutLinks?: NavItem[]
      ctaButton?: { label?: unknown; path?: string }
    }[]
  >(`*[_type == "siteSettings"]`)

  if (docs.length === 0) {
    console.log('No siteSettings document found.')
    return
  }

  for (const doc of docs) {
    const patch: Record<string, unknown> = {}
    let changed = false

    if (doc.mainNavigation?.length) {
      const next = fixNavItems(doc.mainNavigation)
      if (JSON.stringify(next) !== JSON.stringify(doc.mainNavigation)) {
        patch.mainNavigation = next
        changed = true
      }
    }

    if (doc.footerAboutLinks?.length) {
      const next = fixNavItems(doc.footerAboutLinks)
      if (JSON.stringify(next) !== JSON.stringify(doc.footerAboutLinks)) {
        patch.footerAboutLinks = next
        changed = true
      }
    }

    if (doc.ctaButton) {
      const nextLabel = wrapLabel(doc.ctaButton.label)
      if (JSON.stringify(nextLabel) !== JSON.stringify(doc.ctaButton.label)) {
        patch.ctaButton = { ...doc.ctaButton, label: nextLabel }
        changed = true
      }
    }

    if (!changed) {
      console.log(`  · ${doc._id} — already valid`)
      continue
    }

    console.log(`  ✎ ${doc._id} — mainNavigation, footerAboutLinks, ctaButton`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: true })
    }
  }

  console.log(`\n✓ Done${DRY_RUN ? ' (dry run)' : ''}`)
}

run().catch((e) => {
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
