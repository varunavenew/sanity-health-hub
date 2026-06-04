#!/usr/bin/env npx tsx
/**
 * Convert homepage heroBanner.slides.ctaLink from plain string → internationalizedArrayString.
 * Fixes Studio "Invalid property value" after schema change.
 *
 * Usage (from test/):
 *   npm run migrate:hero-cta-link-i18n:dry
 *   npm run migrate:hero-cta-link-i18n
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const HOMEPAGE_ID = 'homepage'

type I18nEntry = { _type?: string; language?: string; _key?: string; value?: string }

/** Norwegian internal path → English path */
const CTA_LINK_NO_TO_EN: Record<string, string> = {
  '/gynekologi': '/gynecology',
  '/urologi': '/urology',
  '/fertilitet': '/fertility',
  '/tjenester': '/services',
  '/kvinnehelse': '/kvinnehelse',
  '/robotassistert-kirurgi': '/robotassistert-kirurgi',
  '/tverrfaglige-team': '/tverrfaglige-team',
  '/booking': '/book-appointment',
}

function pickNo(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const no = value.find(
    (e) => (e as I18nEntry).language === 'no' || (e as I18nEntry)._key === 'no',
  ) as I18nEntry | undefined
  if (no?.value) return String(no.value).trim()
  const first = value[0] as I18nEntry | undefined
  return first?.value ? String(first.value).trim() : ''
}

function isI18nArray(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  const first = value[0] as I18nEntry
  return (
    typeof first._type === 'string' &&
    first._type.startsWith('internationalizedArray')
  )
}

function needsMigration(ctaLink: unknown): boolean {
  if (typeof ctaLink === 'string' && ctaLink.trim()) return true
  if (!isI18nArray(ctaLink)) return Boolean(pickNo(ctaLink))
  return false
}

async function run() {
  const doc = await sanityClient.fetch<{
    heroBanner?: { slides?: Record<string, unknown>[] }
  } | null>(`*[_id == $id][0]{ heroBanner }`, { id: HOMEPAGE_ID })

  const slides = doc?.heroBanner?.slides
  if (!slides?.length) {
    console.log('No heroBanner.slides on homepage.')
    return
  }

  let changed = 0
  const updated = slides.map((slide, index) => {
    if (!needsMigration(slide.ctaLink)) {
      return slide
    }
    const linkNo =
      typeof slide.ctaLink === 'string'
        ? slide.ctaLink.trim()
        : pickNo(slide.ctaLink) || '/'
    const linkEn = CTA_LINK_NO_TO_EN[linkNo] ?? linkNo
    changed += 1
    console.log(`  Slide ${index + 1}: ${linkNo} → ${linkEn}`)
    return { ...slide, ctaLink: i18nString(linkNo, linkEn) }
  })

  if (changed === 0) {
    console.log('All slide ctaLink fields are already i18n arrays.')
    return
  }

  if (DRY_RUN) {
    console.log(`\nDry run — would convert ${changed} ctaLink field(s).`)
    return
  }

  await sanityClient
    .patch(HOMEPAGE_ID)
    .set({ heroBanner: { slides: updated } })
    .commit()

  console.log(`✓ homepage heroBanner — migrated ${changed} ctaLink field(s)`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
