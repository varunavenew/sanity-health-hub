import { createClient } from '@sanity/client'

export type PreviewLocale = 'nb' | 'en'

export const PREVIEW_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://sanity-care-craft.lovable.app'

/** Norwegian path → English path when URLs differ between locales. */
const EN_PATH_OVERRIDES: Record<string, string> = {
  '/om-oss': '/about',
  '/kontakt': '/contact',
}

const previewClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

async function treatmentPath(doc: SanityPreviewDoc, locale: PreviewLocale): Promise<string> {
  const slug = pickSlugForLocale(doc?.slug, locale)
  if (!slug) return '/behandlinger'

  const categoryRef = doc?.category?._ref
  if (categoryRef) {
    const lang = locale === 'en' ? 'en' : 'no'
    const cat = await previewClient.fetch<{ slug?: string; categoryId?: string } | null>(
      `*[_id == $id][0]{
        "slug": coalesce(
          slug[language == $lang][0].value.current,
          slug[language == "no"][0].value.current,
          slug[0].value.current,
          slug.current
        ),
        categoryId
      }`,
      { id: categoryRef, lang },
    )
    const categorySlug = cat?.slug || cat?.categoryId
    if (categorySlug) return `/behandlinger/${categorySlug}/${slug}`
  }

  return `/behandlinger/${slug}`
}

type SanityPreviewDoc = {
  slug?: { current?: string } | Array<{ language?: string; _key?: string; value?: { current?: string } }>
  category?: { _ref?: string }
}

function pickSlugForLocale(
  slug: SanityPreviewDoc['slug'],
  locale: PreviewLocale,
): string | undefined {
  if (!slug) return undefined
  const lang = locale === 'en' ? 'en' : 'no'
  if (Array.isArray(slug)) {
    const entry =
      slug.find((e) => (e.language || e._key) === lang) ||
      slug.find((e) => (e.language || e._key) === 'no') ||
      slug[0]
    return entry?.value?.current
  }
  return slug.current
}

async function pathForType(
  schemaType: string,
  doc: SanityPreviewDoc | undefined,
  locale: PreviewLocale,
): Promise<string> {
  const slug = pickSlugForLocale(doc?.slug, locale)

  switch (schemaType) {
    case 'homepage':
      return '/'
    case 'aboutPage':
      return '/om-oss'
    case 'contactPage':
      return '/kontakt'
    case 'pricingPage':
      return '/priser'
    case 'insurancePage':
      return '/forsikring'
    case 'servicesPage':
      return '/tjenester'
    case 'article':
      return slug ? `/aktuelt/${slug}` : '/aktuelt'
    case 'clinicPage':
      return slug ? `/klinikker/${slug}` : '/klinikker'
    case 'specialist':
      return slug ? `/spesialister/${slug}` : '/spesialister'
    case 'themePage':
      return slug ? `/tema/${slug}` : '/tema'
    case 'jobListing':
      return slug ? `/karriere/${slug}` : '/karriere'
    case 'treatmentCategory':
      return slug ? `/behandlinger/${slug}` : '/behandlinger'
    case 'treatment':
      return treatmentPath(doc || {}, locale)
    default:
      return '/'
  }
}

function mapPathToEnglish(nbPath: string): string {
  if (nbPath === '/') return '/'
  for (const [nb, en] of Object.entries(EN_PATH_OVERRIDES)) {
    if (nbPath === nb) return en
    if (nbPath.startsWith(`${nb}/`)) return `${en}${nbPath.slice(nb.length)}`
  }
  return nbPath
}

/** Build a locale-prefixed frontend preview URL for a Sanity document. */
export async function buildPreviewUrl(
  schemaType: string,
  doc: SanityPreviewDoc | undefined,
  locale: PreviewLocale,
  baseUrl: string = PREVIEW_BASE_URL,
): Promise<string> {
  let path = await pathForType(schemaType, doc, locale)
  if (locale === 'en') {
    path = mapPathToEnglish(path)
  }

  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}/${locale}${normalized}`
}
