/**
 * Verify singleton section card statuses against stored developer-dataset content.
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/verify-singleton-section-data.ts
 */
import fs from 'fs'
import path from 'path'
import {sanityClient as client} from './config'
import {pickNo, pickForLang} from '../schemaTypes/i18n'
import {countArray, countReferenceArray} from './page-editor/documentMeta'

type SectionStatus = {
  section: string
  status: string
  applicable: boolean
}

type PageResult = {
  id: string
  type: string
  sections: SectionStatus[]
}

function i18nReady(value: unknown): boolean {
  return Boolean(pickNo(value)?.trim() || pickForLang(value, 'en')?.trim())
}

function seoReady(seo: unknown): string {
  if (!seo || typeof seo !== 'object') return 'Not configured'
  const metaTitle = (seo as {metaTitle?: unknown}).metaTitle
  return i18nReady(metaTitle) ? 'Ready' : 'Not configured'
}

function heroStatus(doc: Record<string, unknown>): string {
  if (
    i18nReady(doc.title) ||
    i18nReady(doc.heroTitle) ||
    i18nReady(doc.heroEyebrow) ||
    i18nReady(doc.subtitle) ||
    i18nReady(doc.introText) ||
    i18nReady(doc.heroSubtitle) ||
    doc.heroImage
  ) {
    return 'Configured'
  }
  return 'Not configured'
}

function bookingStatus(pageSections: unknown): string {
  if (!Array.isArray(pageSections)) return 'Not configured'
  const band = pageSections.find((s: any) => s?._type === 'pageSectionBookingCta')
  if (!band) return 'Not configured'
  if (band.ctaCollection?._ref) return 'Collection linked'
  return 'Configured'
}

function specialistsStatus(pageSections: unknown): string {
  if (!Array.isArray(pageSections)) return 'Not configured'
  const band = pageSections.find((s: any) => s?._type === 'pageSectionSpecialists')
  if (!band) return 'Not configured'
  const mode = band.displayMode || 'all'
  if (mode === 'all') return 'All Specialists'
  if (mode === 'category') return 'Filtered by category'
  const count = countArray(band.specialists)
  return count ? `${count} Specialist${count === 1 ? '' : 's'}` : 'Not configured'
}

function articlesStatus(pageSections: unknown): string {
  if (!Array.isArray(pageSections)) return 'Not configured'
  const band = pageSections.find((s: any) => s?._type === 'pageSectionArticles')
  if (!band) return 'Not configured'
  const mode = band.displayMode || 'latest'
  if (mode === 'manual') {
    const count = countReferenceArray(band.articles)
    return count ? `${count} Article${count === 1 ? '' : 's'}` : 'Not configured'
  }
  if (mode === 'category') return 'Filtered by category'
  return 'Latest articles'
}

function faqStatus(doc: Record<string, unknown>): string {
  if ((doc.faqCollection as {_ref?: string} | undefined)?._ref) return 'Collection linked'
  const faqs = doc.faqs
  if (Array.isArray(faqs) && faqs.length > 0) return 'Legacy only'
  return 'Not configured'
}

async function main() {
  const allowlists: Record<
    string,
    {faq: boolean; booking: boolean; articles: boolean; specialists: boolean; testimonials: boolean; partners: boolean}
  > = {
    aboutPage: {faq: false, booking: true, articles: true, specialists: true, testimonials: false, partners: false},
    servicesPage: {faq: true, booking: true, articles: true, specialists: true, testimonials: false, partners: false},
    insurancePage: {faq: false, booking: true, articles: true, specialists: false, testimonials: false, partners: true},
    pricingPage: {faq: true, booking: true, articles: true, specialists: true, testimonials: true, partners: false},
    clinicsPage: {faq: false, booking: true, articles: true, specialists: false, testimonials: false, partners: false},
    contactPage: {faq: false, booking: true, articles: false, specialists: false, testimonials: false, partners: false},
    newsPage: {faq: false, booking: true, articles: false, specialists: false, testimonials: false, partners: false},
    guidePage: {faq: false, booking: true, articles: false, specialists: false, testimonials: false, partners: false},
    careersPage: {faq: false, booking: false, articles: false, specialists: false, testimonials: false, partners: false},
    privacyPolicyPage: {
      faq: false,
      booking: false,
      articles: false,
      specialists: false,
      testimonials: false,
      partners: false,
    },
  }

  const docs = await client.fetch(
    `*[_type in $types && !(_id in path("drafts.**"))]{
      _id, _type, title, heroTitle, heroEyebrow, subtitle, introText, heroSubtitle, heroImage,
      faqCollection, faqs, pageSections, testimonials, partnersLocalized, seo,
      "legacyCta": coalesce(ctaTitle, ctaButtonLabel),
      "legacyFaqsPreserved": count(faqs)
    }`,
    {types: Object.keys(allowlists)},
  )

  const results: PageResult[] = []

  for (const doc of docs as any[]) {
    const allow = allowlists[doc._type]
    if (!allow) continue
    const sections: SectionStatus[] = [
      {section: 'Hero', status: heroStatus(doc), applicable: true},
      {
        section: 'FAQ',
        status: allow.faq ? faqStatus(doc) : 'N/A',
        applicable: allow.faq,
      },
      {
        section: 'Booking CTA',
        status: allow.booking ? bookingStatus(doc.pageSections) : 'N/A',
        applicable: allow.booking,
      },
      {
        section: 'Articles',
        status: allow.articles ? articlesStatus(doc.pageSections) : 'N/A',
        applicable: allow.articles,
      },
      {
        section: 'Specialists',
        status: allow.specialists ? specialistsStatus(doc.pageSections) : 'N/A',
        applicable: allow.specialists,
      },
      {
        section: 'Testimonials',
        status: allow.testimonials
          ? (() => {
              const count = countReferenceArray(doc.testimonials)
              if (!count) return 'Not configured'
              return `${count} Testimonial${count === 1 ? '' : 's'}`
            })()
          : 'N/A',
        applicable: allow.testimonials,
      },
      {
        section: 'Partners',
        status: allow.partners
          ? (() => {
              const count = countArray(doc.partnersLocalized)
              if (!count) return 'Not configured'
              return `${count} Partners`
            })()
          : 'N/A',
        applicable: allow.partners,
      },
      {section: 'SEO', status: seoReady(doc.seo), applicable: true},
    ]
    results.push({id: doc._id, type: doc._type, sections})
  }

  results.sort((a, b) => a.type.localeCompare(b.type))

  for (const page of results) {
    console.log(`\n## ${page.type} (${page.id})`)
    for (const s of page.sections) {
      if (!s.applicable) {
        console.log(`  ${s.section.padEnd(14)} N/A`)
        continue
      }
      const mark = s.status === 'Not configured' ? '○' : '●'
      console.log(`  ${mark} ${s.section.padEnd(14)} ${s.status}`)
    }
  }

  // Homepage untouched check
  const homepage = await client.fetch(`*[_id == "homepage"][0]{_id, _updatedAt, faqCollection, "ps": pageSections[]._type}`)
  console.log('\nHomepage (must remain untouched by this migration):', JSON.stringify(homepage))

  const out = path.join(process.cwd(), 'sanity', '.verify-singleton-section-data.json')
  fs.writeFileSync(out, JSON.stringify({results, homepage}, null, 2))
  console.log(`\nWrote ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
