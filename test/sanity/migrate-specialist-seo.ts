#!/usr/bin/env npx tsx
/**
 * Seed `seo.metaTitle` / `seo.metaDescription` on each specialist document
 * from name, role and shortBio when SEO is empty.
 *
 * Usage (from test/):
 *   npm run migrate:specialist-seo:dry
 *   npm run migrate:specialist-seo
 */
import { sanityClient } from './config'
import { i18nString, i18nText, type I18nItem } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type Doc = {
  _id: string
  name?: string
  role?: I18nItem[]
  shortBio?: I18nItem[]
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
  const name = doc.name?.trim() || ''
  if (!name) return null

  const roleNo = readLang(doc.role, 'no')
  const roleEn = readLang(doc.role, 'en') || roleNo
  const bioNo = readLang(doc.shortBio, 'no')
  const bioEn = readLang(doc.shortBio, 'en') || bioNo

  const metaTitle = i18nString(
    roleNo ? `${name} – ${roleNo}` : name,
    roleEn ? `${name} – ${roleEn}` : name,
  )

  const metaDescription = i18nText(
    bioNo ||
      truncate(
        `Bestill time hos ${name}${roleNo ? `, ${roleNo}` : ''} hos CMedical. Ingen henvisning nødvendig.`,
      ),
    bioEn ||
      truncate(
        `Book an appointment with ${name}${roleEn ? `, ${roleEn}` : ''} at CMedical. No referral needed.`,
      ),
  )

  return { _type: 'seo' as const, metaTitle, metaDescription }
}

async function run() {
  const docs = await sanityClient.fetch<Doc[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, role, shortBio, seo { metaTitle, metaDescription }
    } | order(name asc)`,
  )

  let changed = 0
  for (const doc of docs) {
    if (!FORCE && hasSeo(doc.seo?.metaTitle) && hasSeo(doc.seo?.metaDescription)) {
      continue
    }

    const seo = buildSeo(doc)
    if (!seo) continue

    changed += 1
    if (DRY_RUN) {
      console.log(`DRY ${doc._id} (${doc.name})`)
      continue
    }

    await sanityClient.patch(doc._id).set({ seo }).commit()
    console.log(`✓ ${doc.name}`)
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${changed} specialist(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
