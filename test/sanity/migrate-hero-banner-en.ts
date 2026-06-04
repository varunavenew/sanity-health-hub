#!/usr/bin/env npx tsx
/**
 * Add English (EN) copy + localized CTA links to homepage heroBanner slides.
 *
 * Usage (from test/):
 *   npm run migrate:hero-banner-en:dry
 *   npm run migrate:hero-banner-en
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const HOMEPAGE_ID = 'homepage'

type I18nEntry = { language?: string; _key?: string; value?: string }

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

/** Norwegian internal path → English path (locale prefix added by the app router) */
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

/** EN copy aligned with current Studio hero slides */
const SLIDE_EN_BY_SUBHEADING: Record<
  string,
  { heading: string; subheading: string; ctaText: string }
> = {
  Kvinnehelse: {
    heading: "Strengthened women's health – throughout life's journey",
    subheading: "Women's health",
    ctaText: 'Read more',
  },
  Urologi: {
    heading: "Men's health and urology",
    subheading: 'Urology',
    ctaText: 'Read more',
  },
  Teknologi: {
    heading: "The country's first private provider with robotic surgery",
    subheading: 'Technology',
    ctaText: 'Read more',
  },
  Fertilitet: {
    heading: 'Your journey to parenthood',
    subheading: 'Fertility',
    ctaText: 'Read more',
  },
  Fertilitetsteamet: {
    heading: 'Leading environment\nin fertility',
    subheading: 'Fertility team',
    ctaText: 'Read more',
  },
}

const SLIDE_EN_BY_HEADING_SNIPPET: [string, (typeof SLIDE_EN_BY_SUBHEADING)[string]][] = [
  ['Kvinnehelse', SLIDE_EN_BY_SUBHEADING.Kvinnehelse],
  ['fertilitet', SLIDE_EN_BY_SUBHEADING.Fertilitet],
  ['Robotassistert', SLIDE_EN_BY_SUBHEADING.Teknologi],
  ['foreldreskap', SLIDE_EN_BY_SUBHEADING.Fertilitet],
  ['Mannshelse', SLIDE_EN_BY_SUBHEADING.Urologi],
  ['robotkirurgi', SLIDE_EN_BY_SUBHEADING.Teknologi],
]

function resolveEnCopy(slide: {
  heading?: unknown
  subheading?: unknown
  ctaLink?: unknown
}): (typeof SLIDE_EN_BY_SUBHEADING)[string] | null {
  const subNo = pickNo(slide.subheading)
  if (subNo && SLIDE_EN_BY_SUBHEADING[subNo]) {
    return SLIDE_EN_BY_SUBHEADING[subNo]
  }
  const headNo = pickNo(slide.heading)
  for (const [snippet, en] of SLIDE_EN_BY_HEADING_SNIPPET) {
    if (headNo.includes(snippet) || subNo.includes(snippet)) return en
  }
  return null
}

function resolveEnCtaLink(linkNo: string): string {
  return CTA_LINK_NO_TO_EN[linkNo] ?? linkNo
}

function hasEn(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.some(
    (e) => (e as I18nEntry).language === 'en' || (e as I18nEntry)._key === 'en',
  )
}

async function run() {
  const doc = await sanityClient.fetch<{
    heroBanner?: { slides?: Record<string, unknown>[] }
  } | null>(`*[_id == $id][0]{ heroBanner }`, { id: HOMEPAGE_ID })

  const slides = doc?.heroBanner?.slides
  if (!slides?.length) {
    console.log('No heroBanner.slides on homepage — nothing to migrate.')
    return
  }

  const updated = slides.map((slide, index) => {
    const en = resolveEnCopy(slide)
    const linkNo =
      pickNo(slide.ctaLink) || (typeof slide.ctaLink === 'string' ? slide.ctaLink.trim() : '') || '/'
    const linkEn = resolveEnCtaLink(linkNo)

    if (!en) {
      console.warn(`– Slide ${index + 1}: no EN text mapping (subheading: "${pickNo(slide.subheading)}")`)
      if (typeof slide.ctaLink === 'string' && slide.ctaLink.trim()) {
        return {
          ...slide,
          ctaLink: i18nString(slide.ctaLink.trim(), resolveEnCtaLink(slide.ctaLink.trim())),
        }
      }
      return slide
    }

    const headingNo = pickNo(slide.heading) || en.heading
    const subNo = pickNo(slide.subheading) || en.subheading
    const ctaNo = pickNo(slide.ctaText) || 'Les mer'

    if (
      !FORCE &&
      hasEn(slide.heading) &&
      hasEn(slide.subheading) &&
      hasEn(slide.ctaLink)
    ) {
      console.log(`– Slide ${index + 1} (${subNo}): EN already set`)
      return slide
    }

    if (
      !FORCE &&
      hasEn(slide.heading) &&
      hasEn(slide.subheading) &&
      typeof slide.ctaLink === 'string'
    ) {
      console.log(`– Slide ${index + 1} (${subNo}): fixing plain-string ctaLink`)
      return { ...slide, ctaLink: i18nString(linkNo, linkEn) }
    }

    return {
      ...slide,
      heading: i18nString(headingNo, en.heading),
      subheading: i18nString(subNo, en.subheading),
      ctaText: i18nString(ctaNo, en.ctaText),
      ctaLink: i18nString(linkNo, linkEn),
    }
  })

  if (DRY_RUN) {
    console.log('\nDry run — would patch heroBanner.slides:')
    updated.forEach((s, i) => {
      const linkNo = pickNo(s.ctaLink)
      const linkEnEntry = Array.isArray(s.ctaLink)
        ? (s.ctaLink as I18nEntry[]).find((e) => e.language === 'en' || e._key === 'en')
        : null
      console.log(
        `  ${i + 1}. [${pickNo(s.subheading)}] CTA: ${linkNo} → ${linkEnEntry?.value ?? resolveEnCtaLink(linkNo)}`,
      )
    })
    return
  }

  await sanityClient
    .patch(HOMEPAGE_ID)
    .set({ heroBanner: { slides: updated } })
    .commit()

  console.log(`✓ homepage heroBanner — ${updated.length} slides (NO + EN text & links)`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
