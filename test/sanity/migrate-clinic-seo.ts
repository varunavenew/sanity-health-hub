#!/usr/bin/env npx tsx
/**
 * Seed `seo.metaTitle` / `seo.metaDescription` on each clinicPage document
 * from title, address and description when SEO is missing or legacy plain strings.
 *
 * Usage (from test/):
 *   npm run migrate:clinic-seo:dry
 *   npm run migrate:clinic-seo
 */
import { sanityClient } from './config'
import { i18nString, i18nText, type I18nItem } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type Doc = {
  _id: string
  title?: I18nItem[]
  address?: string
  description?: I18nItem[]
  seo?: { metaTitle?: I18nItem[] | string; metaDescription?: I18nItem[] | string }
}

function readLang(arr: I18nItem[] | undefined, lang: 'no' | 'en'): string {
  if (!Array.isArray(arr)) return ''
  return arr.find((i) => (i.language || i._key) === lang)?.value?.trim() || ''
}

function hasSeo(val: I18nItem[] | string | undefined): boolean {
  if (!val) return false
  if (typeof val === 'string') return val.trim().length > 0
  return val.some((i) => typeof i.value === 'string' && i.value.trim().length > 0)
}

function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

function buildSeo(doc: Doc) {
  const labelNo = readLang(doc.title, 'no')
  const labelEn = readLang(doc.title, 'en') || labelNo
  if (!labelNo) return null

  const descNo = readLang(doc.description, 'no')
  const descEn = readLang(doc.description, 'en') || descNo
  const address = doc.address?.trim() || ''

  const metaTitle = i18nString(
    `CMedical ${labelNo} – Klinikk`,
    `CMedical ${labelEn} – Clinic`,
  )

  const metaDescription = i18nText(
    descNo
      ? truncate(descNo)
      : truncate(
          `Besøk CMedical ${labelNo}.${address ? ` ${address}.` : ''} Åpningstider, tjenester og kontaktinformasjon.`,
        ),
    descEn
      ? truncate(descEn)
      : truncate(
          `Visit CMedical ${labelEn}.${address ? ` ${address}.` : ''} Opening hours, services and contact information.`,
        ),
  )

  return { _type: 'seo' as const, metaTitle, metaDescription }
}

async function run() {
  const docs = await sanityClient.fetch<Doc[]>(
    `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
      _id, title, address, description, seo { metaTitle, metaDescription }
    } | order(address asc)`,
  )

  console.log(`▶ Migrate clinic SEO (${docs.length} docs)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let changed = 0
  let skipped = 0

  for (const doc of docs) {
    const needsMigrate =
      FORCE ||
      !hasSeo(doc.seo?.metaTitle) ||
      !hasSeo(doc.seo?.metaDescription) ||
      typeof doc.seo?.metaTitle === 'string' ||
      typeof doc.seo?.metaDescription === 'string'

    if (!needsMigrate) {
      skipped++
      continue
    }

    const seo = buildSeo(doc)
    if (!seo) {
      console.warn(`  ⚠ skip ${doc._id} — no title`)
      continue
    }

    const label = readLang(doc.title, 'no') || doc._id
    console.log(`  ✎ ${label}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ seo }).commit()
    }
    changed++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${changed}`)
  console.log(`⏭  Skipped: ${skipped}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
