/**
 * Seed geoSummary from existing description/excerpt/intro copy (NO + EN).
 *
 * Usage (from test/):
 *   npm run migrate:geo-summary:dry
 *   npm run migrate:geo-summary
 */
import { sanityClient } from './config'
import { i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type I18nRow = { language?: string; _key?: string; value?: string }

function pickLang(value: unknown, lang: 'no' | 'en'): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const hit = value.find((row) => {
    const item = row as I18nRow
    return item?.language === lang || item?._key === lang
  }) as I18nRow | undefined
  return typeof hit?.value === 'string' ? hit.value.trim() : ''
}

function hasGeoSummary(value: unknown): boolean {
  return Boolean(pickLang(value, 'no') || pickLang(value, 'en'))
}

function firstLine(text: string, max = 320): string {
  const line = text
    .split('\n')
    .map((part) => part.trim())
    .find(Boolean)
  if (!line) return ''
  return line.length > max ? `${line.slice(0, max - 1)}…` : line
}

function buildGeoSummary(sourceNo: string, sourceEn: string) {
  const no = firstLine(sourceNo)
  const en = firstLine(sourceEn || sourceNo)
  if (!no && !en) return null
  return i18nText(no, en)
}

async function patchGeoSummary(id: string, label: string, sourceNo: string, sourceEn: string, existing: unknown) {
  if (!FORCE && hasGeoSummary(existing)) {
    console.log(`– Skipped ${label} (${id}) — geoSummary already set`)
    return
  }

  const geoSummary = buildGeoSummary(sourceNo, sourceEn)
  if (!geoSummary) {
    console.log(`– Skipped ${label} (${id}) — no source text`)
    return
  }

  if (DRY_RUN) {
    console.log(`DRY ${label} (${id}) — would set geoSummary`)
    return
  }

  await sanityClient.patch(id).set({ geoSummary }).commit()
  console.log(`✓ ${label} (${id})`)
}

async function migrateTreatments() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      title?: string
      description?: unknown
      geoSummary?: unknown
    }>
  >(`*[_type == "treatment"]{
    _id,
    "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    description,
    geoSummary
  }`)

  for (const row of rows) {
    const descNo = pickLang(row.description, 'no')
    const descEn = pickLang(row.description, 'en')
    await patchGeoSummary(row._id, row.title || 'treatment', descNo, descEn, row.geoSummary)
  }
}

async function migrateArticles() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      title?: string
      excerpt?: unknown
      geoSummary?: unknown
    }>
  >(`*[_type == "article"]{
    _id,
    "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    excerpt,
    geoSummary
  }`)

  for (const row of rows) {
    const excerptNo = pickLang(row.excerpt, 'no')
    const excerptEn = pickLang(row.excerpt, 'en')
    await patchGeoSummary(row._id, row.title || 'article', excerptNo, excerptEn, row.geoSummary)
  }
}

async function migrateThemePages() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      title?: string
      introTexts?: unknown[]
      geoSummary?: unknown
    }>
  >(`*[_type == "themePage"]{
    _id,
    "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    introTexts,
    geoSummary
  }`)

  for (const row of rows) {
    const firstIntro = Array.isArray(row.introTexts) ? row.introTexts[0] : undefined
    const introNo = pickLang(firstIntro, 'no')
    const introEn = pickLang(firstIntro, 'en')
    await patchGeoSummary(row._id, row.title || 'themePage', introNo, introEn, row.geoSummary)
  }
}

async function migrateTreatmentCategories() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      title?: string
      landingPage?: { hero?: { body?: unknown } }
      geoSummary?: unknown
    }>
  >(`*[_type == "treatmentCategory"]{
    _id,
    "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    landingPage { hero { body } },
    geoSummary
  }`)

  for (const row of rows) {
    const body = row.landingPage?.hero?.body
    const bodyNo = pickLang(body, 'no')
    const bodyEn = pickLang(body, 'en')
    await patchGeoSummary(row._id, row.title || 'treatmentCategory', bodyNo, bodyEn, row.geoSummary)
  }
}

async function migrateSingleton(
  type: string,
  label: string,
  sourceNo: unknown,
  sourceEn: unknown,
  existing: unknown,
  id: string,
) {
  const no =
    typeof sourceNo === 'string' ? sourceNo.trim() : pickLang(sourceNo, 'no')
  const en =
    typeof sourceEn === 'string' ? sourceEn.trim() : pickLang(sourceEn, 'en')
  await patchGeoSummary(id, `${label} (${type})`, no, en, existing)
}

async function migrateSingletonPages() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      _type: string
      geoSummary?: unknown
      tagline?: unknown
      subtitle?: unknown
      introText?: unknown
      heroDescription?: unknown
      heroSubtitle?: unknown
      heroTitle?: unknown
      pageTitle?: unknown
      title?: unknown
    }>
  >(`*[_type in [
    "homepage", "aboutPage", "contactPage", "servicesPage",
    "specialistsPage", "specialistsListingPage", "clinicsPage",
    "newsPage", "guidePage", "bookingPage", "pricingPage",
    "insurancePage", "careersPage", "privacyPolicyPage"
  ]]{
    _id, _type, geoSummary,
    tagline, subtitle, introText, heroDescription, heroSubtitle, heroTitle, pageTitle, title
  }`)

  for (const row of rows) {
    switch (row._type) {
      case 'homepage':
        await migrateSingleton(row._type, 'homepage', row.tagline, row.tagline, row.geoSummary, row._id)
        break
      case 'aboutPage':
      case 'specialistsPage':
        await migrateSingleton(
          row._type,
          pickLang(row.title, 'no') || row._type,
          row.subtitle,
          row.subtitle,
          row.geoSummary,
          row._id,
        )
        break
      case 'contactPage':
      case 'servicesPage':
      case 'pricingPage':
      case 'insurancePage':
      case 'careersPage':
        await migrateSingleton(
          row._type,
          pickLang(row.title, 'no') || row._type,
          row.introText || row.heroSubtitle,
          row.introText || row.heroSubtitle,
          row.geoSummary,
          row._id,
        )
        break
      case 'specialistsListingPage':
      case 'clinicsPage':
        await migrateSingleton(
          row._type,
          pickLang(row.heroTitle, 'no') || row._type,
          row.heroDescription,
          row.heroDescription,
          row.geoSummary,
          row._id,
        )
        break
      case 'newsPage':
        await migrateSingleton(
          row._type,
          pickLang(row.title, 'no') || 'newsPage',
          row.subtitle,
          row.subtitle,
          row.geoSummary,
          row._id,
        )
        break
      case 'guidePage':
        await migrateSingleton(
          row._type,
          pickLang(row.heroTitle, 'no') || 'guidePage',
          row.heroSubtitle,
          row.heroSubtitle,
          row.geoSummary,
          row._id,
        )
        break
      case 'bookingPage':
        await migrateSingleton(row._type, 'bookingPage', row.pageTitle, row.pageTitle, row.geoSummary, row._id)
        break
      case 'privacyPolicyPage':
        await migrateSingleton(
          row._type,
          pickLang(row.title, 'no') || 'privacyPolicyPage',
          pickLang(row.title, 'no'),
          pickLang(row.title, 'en'),
          row.geoSummary,
          row._id,
        )
        break
      default:
        break
    }
  }
}

async function migrateSpecialists() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      name?: string
      shortBio?: unknown
      geoSummary?: unknown
    }>
  >(`*[_type == "specialist" && !(_id in path("drafts.**"))]{
    _id, name, shortBio, geoSummary
  }`)

  for (const row of rows) {
    const bioNo = pickLang(row.shortBio, 'no')
    const bioEn = pickLang(row.shortBio, 'en')
    await patchGeoSummary(row._id, row.name || 'specialist', bioNo, bioEn, row.geoSummary)
  }
}

async function migrateClinics() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      label?: unknown
      title?: unknown
      description?: unknown
      geoSummary?: unknown
    }>
  >(`*[_type == "clinicPage"]{
    _id,
    label,
    title,
    description,
    geoSummary
  }`)

  for (const row of rows) {
    const name = pickLang(row.label, 'no') || pickLang(row.title, 'no') || 'clinicPage'
    const descNo = pickLang(row.description, 'no')
    const descEn = pickLang(row.description, 'en')
    await patchGeoSummary(row._id, name, descNo, descEn, row.geoSummary)
  }
}

async function run() {
  console.log(DRY_RUN ? 'Dry run — no writes\n' : FORCE ? 'Force overwrite enabled\n' : '')

  await migrateTreatments()
  await migrateArticles()
  await migrateThemePages()
  await migrateTreatmentCategories()
  await migrateClinics()
  await migrateSingletonPages()
  await migrateSpecialists()

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
