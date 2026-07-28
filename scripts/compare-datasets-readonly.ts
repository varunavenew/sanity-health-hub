/**
 * READ-ONLY compare of developer vs production datasets.
 * Does not mutate anything.
 */
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {createClient, type SanityClient} from '@sanity/client'
import {fileURLToPath} from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
loadEnv({path: path.join(root, '.env.local')})
loadEnv({path: path.join(root, 'test', '.env.local')})
loadEnv({path: path.join(root, '.env')})

const projectId =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const token = process.env.SANITY_TOKEN?.trim()
if (!projectId || !token) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_TOKEN')
  process.exit(1)
}

function client(dataset: string): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

async function snapshot(c: SanityClient, dataset: string) {
  const q = `{
    "dataset": $dataset,
    "published": count(*[!(_id in path("drafts.**"))]),
    "drafts": count(*[_id in path("drafts.**")]),
    "byType": *[!(_id in path("drafts.**"))] | order(_type asc) {
      "t": _type
    },
    "guide": *[_type == "guidePage" && !(_id in path("drafts.**"))][0]{
      _id,
      "title": title,
      "hasSeo": defined(seo),
      "seoTitleNo": count(seo.title[_key == "no" || language == "no"]),
      "seoTitleEn": count(seo.title[_key == "en" || language == "en"]),
      "guideSections": count(guideSections),
      "sectionTitles": guideSections[].title,
      "hasCategoriesIntro": defined(categoriesIntroTitle) || defined(categoriesIntro),
      "categoriesIntroTitle": categoriesIntroTitle,
      "pageSectionsCount": count(pageSections),
      "pageSectionTypes": pageSections[]._type,
      "hasLegacyCta": defined(ctaTitle) || defined(ctaText) || defined(closingCta),
      "hasFeaturedCategories": count(featuredCategories)
    },
    "homepage": *[_type == "homepage" && !(_id in path("drafts.**"))][0]{
      _id,
      "hasSpecialistsSection": defined(specialistsSection),
      "specialistsDisplayMode": specialistsSection.displayMode,
      "pageSectionsCount": count(pageSections),
      "pageSectionTypes": pageSections[]._type,
      "heroSlides": count(heroSlides),
      "hasBookingCta": defined(bookingCta) || count(pageSections[_type == "pageSectionBookingCta"]) > 0,
      "faqCollectionRef": faqCollection._ref,
      "hasInlineFaqs": count(faqs) > 0
    },
    "pricing": *[_type == "pricingPage" && !(_id in path("drafts.**"))][0]{
      _id, "pageSectionsCount": count(pageSections), "hasSeo": defined(seo)
    },
    "services": *[_type == "servicesPage" && !(_id in path("drafts.**"))][0]{
      _id, "pageSectionsCount": count(pageSections), "hasSeo": defined(seo)
    },
    "clinics": *[_type == "clinicsPage" && !(_id in path("drafts.**"))][0]{
      _id, "pageSectionsCount": count(pageSections)
    },
    "contact": *[_type == "contactPage" && !(_id in path("drafts.**"))][0]{
      _id, "pageSectionsCount": count(pageSections)
    },
    "insurance": *[_type == "insurancePage" && !(_id in path("drafts.**"))][0]{
      _id, "pageSectionsCount": count(pageSections), "partners": count(partners)
    },
    "news": *[_type == "newsPage" && !(_id in path("drafts.**"))][0]{
      _id, "filters": count(filters), "filterKeys": filters[].key
    },
    "about": *[_type == "aboutPage" && !(_id in path("drafts.**"))][0]{_id},
    "careers": *[_type == "careersPage" && !(_id in path("drafts.**"))][0]{_id},
    "siteSettings": *[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
      _id,
      "navItems": count(mainNavigation),
      "footerLinks": count(footerAboutLinks),
      "hasBusinessReputation": defined(businessReputation),
      "googleAvg": businessReputation.googleAverageRating,
      "legelistenAvg": businessReputation.legelistenAverageRating
    },
    "counts": {
      "ctaCollection": count(*[_type == "ctaCollection" && !(_id in path("drafts.**"))]),
      "faqCollection": count(*[_type == "faqCollection" && !(_id in path("drafts.**"))]),
      "insuranceCollection": count(*[_type == "insuranceCollection" && !(_id in path("drafts.**"))]),
      "faq": count(*[_type == "faq" && !(_id in path("drafts.**"))]),
      "specialist": count(*[_type == "specialist" && !(_id in path("drafts.**"))]),
      "treatment": count(*[_type == "treatment" && !(_id in path("drafts.**"))]),
      "treatmentCategory": count(*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]),
      "clinicPage": count(*[_type == "clinicPage" && !(_id in path("drafts.**"))]),
      "article": count(*[_type == "article" && !(_id in path("drafts.**"))]),
      "googleReview": count(*[_type == "googleReview" && !(_id in path("drafts.**"))])
    },
    "ctaSample": *[_type == "ctaCollection" && !(_id in path("drafts.**"))] | order(internalName asc)[0...20]{internalName, _id},
    "insuranceSample": *[_type == "insuranceCollection" && !(_id in path("drafts.**"))] | order(internalName asc)[0...20]{internalName, _id},
    "brokenRefs": count(*[!(_id in path("drafts.**"))][references(*[_id in path("drafts.**")]._id)]),
    "pageBandsWithCollection": {
      "bookingCtaLinked": count(*[!(_id in path("drafts.**"))][count(pageSections[_type == "pageSectionBookingCta" && defined(collection._ref)]) > 0]),
      "insuranceLinked": count(*[!(_id in path("drafts.**"))][count(pageSections[_type == "pageSectionInsurance" && defined(collection._ref)]) > 0]),
      "bookingCtaInlineOnly": count(*[!(_id in path("drafts.**"))][count(pageSections[_type == "pageSectionBookingCta" && !defined(collection._ref)]) > 0]),
      "insuranceInlineOnly": count(*[!(_id in path("drafts.**"))][count(pageSections[_type == "pageSectionInsurance" && !defined(collection._ref)]) > 0])
    },
    "mediaUsage": {
      "docsWithMediaObject": count(*[!(_id in path("drafts.**")) && defined(media.mediaType)]),
      "categoriesWithMedia": count(*[_type == "treatmentCategory" && !(_id in path("drafts.**")) && defined(media)]),
      "treatmentsWithMedia": count(*[_type == "treatment" && !(_id in path("drafts.**")) && defined(media)])
    }
  }`

  const raw = await c.fetch(q, {dataset})
  const byType: Record<string, number> = {}
  for (const row of raw.byType as {t: string}[]) {
    byType[row.t] = (byType[row.t] || 0) + 1
  }
  delete raw.byType
  raw.typeCounts = byType
  return raw
}

async function main() {
  const [dev, prod] = await Promise.all([
    snapshot(client('developer'), 'developer'),
    snapshot(client('production'), 'production'),
  ])

  const out = {developer: dev, production: prod}
  const {writeFileSync} = await import('fs')
  const {resolve} = await import('path')
  const outPath = resolve(process.cwd(), 'scripts/_dataset-compare-out.json')
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
