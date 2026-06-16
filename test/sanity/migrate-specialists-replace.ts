/**
 * Replace all specialist documents in Sanity from src/data/specialists.ts.
 *
 * - createOrReplace published docs (full profile fields + SEO + booking IDs)
 * - uploads photos from src/assets/
 * - links categories, clinics, and generelt FAQ references
 * - optionally deletes specialists not in the static list (DELETE_ORPHANS=1, default)
 *
 * Usage:
 *   cd test && npm run migrate:specialists-replace:dry
 *   cd test && npm run migrate:specialists-replace
 */
import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { API_URL, DATASET, PROJECT_ID, SANITY_TOKEN, sanityClient } from './config'
import { STATIC_CATEGORY_TO_SANITY } from './data/static-specialist-categories'
import { bookingCategoryIdsForSpecialist } from './data/specialist-booking-category-ids'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { i18nBioNo, i18nShortBioNo } from './lib/specialist-bio-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const DELETE_ORPHANS = process.env.DELETE_ORPHANS !== '0'
const ASSETS_DIR = path.resolve(__dirname, '../../src/assets')
const SOURCE_PATH = path.resolve(__dirname, '../../src/data/specialists.ts')

const GENERELT_FAQ_IDS = [
  'faq-finansiering-pris',
  'faq-finansiering-forsikring',
  'faq-finansiering-nedbetaling',
  'faq-praktisk-henvisning',
  'faq-praktisk-ventetid',
  'faq-praktisk-sykemelding',
  'faq-praktisk-utredning',
  'faq-praktisk-personvern',
]

const CLINIC_LABEL_TO_ID: Record<string, string> = {
  majorstuen: 'clinicPage-majorstuen',
  moelv: 'clinicPage-moelv',
  bekkestua: 'clinicPage-bekkestua',
  moss: 'clinicPage-moss',
  ski: 'clinicPage-ski',
}

const IMAGE_SLUG_ALIASES: Record<string, string> = {
  'cennet-akdeni': 'cennet-akdeniz',
}

type StaticSpecialist = {
  name: string
  title: string
  subtitle?: string
  expertise: string[]
  slug: string
  category: string
  bio?: string
  education?: string
  languages?: string[]
  clinics?: string[]
}

const imageCache = new Map<string, string>()

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function toNonEmptyString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function i18nStringNo(value: string) {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value,
    },
  ]
}

function i18nTextNo(value: string) {
  return [
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'no',
      language: 'no',
      value,
    },
  ]
}

function i18nSlug(slug: string) {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current: slug },
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: { _type: 'slug', current: slug },
    },
  ]
}

function truncate(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

function buildSeo(s: StaticSpecialist) {
  const role = s.title
  const bio = s.bio || ''
  return {
    _type: 'seo' as const,
    metaTitle: i18nString(role ? `${s.name} – ${role}` : s.name, role ? `${s.name} – ${role}` : s.name),
    metaDescription: i18nText(
      bio
        ? truncate(bio)
        : truncate(
            `Bestill time hos ${s.name}${role ? `, ${role}` : ''} hos CMedical. Ingen henvisning nødvendig.`,
          ),
      bio
        ? truncate(bio)
        : truncate(
            `Book an appointment with ${s.name}${role ? `, ${role}` : ''} at CMedical. No referral needed.`,
          ),
    ),
  }
}

function loadStaticSpecialists(): StaticSpecialist[] {
  const source = fs.readFileSync(SOURCE_PATH, 'utf8')
  const startMatch = source.match(/export const specialists:\s*Specialist\[\]\s*=\s*\[/)
  if (!startMatch || startMatch.index == null) {
    throw new Error('Could not locate `export const specialists` in src/data/specialists.ts')
  }

  const arrayStart = startMatch.index + startMatch[0].length - 1
  let depth = 0
  let arrayEnd = -1
  for (let i = arrayStart; i < source.length; i++) {
    if (source[i] === '[') depth++
    else if (source[i] === ']') {
      depth--
      if (depth === 0) {
        arrayEnd = i
        break
      }
    }
  }
  if (arrayEnd < 0) throw new Error('Could not locate specialists array end')

  const sanitized = source
    .slice(arrayStart, arrayEnd + 1)
    .replace(/image:\s*[^,\n]+,/g, 'image: null,')

  const parsed = Function(`"use strict"; return (${sanitized});`)() as Array<Record<string, unknown>>

  return parsed
    .map((row) => ({
      name: toNonEmptyString(row.name),
      title: toNonEmptyString(row.title),
      subtitle: toNonEmptyString(row.subtitle) || undefined,
      expertise: Array.isArray(row.expertise)
        ? row.expertise.map((v) => toNonEmptyString(v)).filter(Boolean)
        : [],
      slug: toNonEmptyString(row.slug),
      category: toNonEmptyString(row.category),
      bio: toNonEmptyString(row.bio) || undefined,
      education: toNonEmptyString(row.education) || undefined,
      languages: Array.isArray(row.languages)
        ? row.languages.map((v) => toNonEmptyString(v)).filter(Boolean)
        : undefined,
      clinics: Array.isArray(row.clinics)
        ? row.clinics.map((v) => toNonEmptyString(v)).filter(Boolean)
        : undefined,
    }))
    .filter((s) => s.slug && s.name)
}

function buildImageMap(): Map<string, string> {
  const map = new Map<string, string>()
  const assetsDir = path.join(ASSETS_DIR, 'specialists')
  if (!fs.existsSync(assetsDir)) return map

  for (const file of fs.readdirSync(assetsDir)) {
    const ext = path.extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue
    const slug = path.basename(file, ext)
    map.set(slug, `specialists/${file}`)
  }
  return map
}

function imagePathForSlug(slug: string, imageMap: Map<string, string>): string | null {
  const fileSlug = IMAGE_SLUG_ALIASES[slug] ?? slug
  return imageMap.get(fileSlug) ?? imageMap.get(slug) ?? null
}

async function uploadImage(relativePath: string, label: string) {
  if (imageCache.has(relativePath)) {
    return {
      _type: 'image' as const,
      asset: { _type: 'reference' as const, _ref: imageCache.get(relativePath)! },
    }
  }

  const fullPath = path.join(ASSETS_DIR, relativePath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const ext = path.extname(fullPath).slice(1).toLowerCase()
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  }
  const contentType = mimeTypes[ext] || 'application/octet-stream'
  const assetsUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/${DATASET}`

  const res = await fetch(
    `${assetsUrl}?filename=${encodeURIComponent(path.basename(fullPath))}&label=${encodeURIComponent(label)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: fileBuffer,
    },
  )

  if (!res.ok) {
    console.error(`  ❌ Upload failed ${relativePath}: ${res.status} ${await res.text()}`)
    return null
  }

  const result = (await res.json()) as { document: { _id: string } }
  imageCache.set(relativePath, result.document._id)
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: result.document._id },
  }
}

function clinicRef(label: string, slug: string) {
  const key = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const docId = CLINIC_LABEL_TO_ID[key] ?? CLINIC_LABEL_TO_ID[slugify(label)]
  if (!docId) return null
  return {
    _type: 'reference' as const,
    _ref: docId,
    _key: `clinic-${slugify(label)}`,
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function run() {
  const specialists = loadStaticSpecialists()
  const imageMap = buildImageMap()

  console.log(`▶ Replace specialists from static source (${specialists.length} entries)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Delete orphans: ${DELETE_ORPHANS ? 'yes' : 'no'}\n`)

  const categories = await sanityClient.fetch<{ _id: string; categoryId?: string }[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{ _id, categoryId }`,
  )
  const categoryDocById = new Map<string, string>()
  for (const cat of categories) {
    if (cat.categoryId) categoryDocById.set(cat.categoryId, cat._id)
  }

  const mutations: { createOrReplace?: Record<string, unknown>; delete?: { id: string } }[] = []
  const expectedIds = new Set<string>()

  for (const [index, s] of specialists.entries()) {
    const docId = `specialist-${s.slug}`
    expectedIds.add(docId)

    const sanityCategoryId = STATIC_CATEGORY_TO_SANITY[s.category] ?? 'flere-fagomrader'
    const categoryDocId = categoryDocById.get(sanityCategoryId)
    if (!categoryDocId) {
      console.warn(`  ⚠ No treatmentCategory for ${s.slug} (${sanityCategoryId})`)
    }

    const imageRel = imagePathForSlug(s.slug, imageMap)
    const photo = imageRel ? await uploadImage(imageRel, `specialist-${s.slug}`) : null

    const clinicRefs = (s.clinics ?? [])
      .map((label) => clinicRef(label, s.slug))
      .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref))

    if (clinicRefs.length === 0) {
      console.warn(`  ⚠ No clinic refs for ${s.slug} (${(s.clinics ?? []).join(', ')})`)
    }

    const bookingCategoryIds = bookingCategoryIdsForSpecialist(s.slug, s.category)
    const shortBio =
      s.bio ||
      `${s.name} er ${s.title.toLowerCase()}${s.subtitle ? ` (${s.subtitle.toLowerCase()})` : ''} hos CMedical.`

    const doc: Record<string, unknown> = {
      _id: docId,
      _type: 'specialist',
      name: s.name,
      slug: i18nSlug(s.slug),
      role: i18nStringNo(s.title),
      ...(s.subtitle ? { subtitle: i18nStringNo(s.subtitle) } : {}),
      specialties: s.expertise.map((item) => ({
        _type: 'specialtyItem',
        _key: `spec-${slugify(item)}`,
        label: i18nStringNo(item),
      })),
      categories: categoryDocId
        ? [
            {
              _type: 'reference',
              _ref: categoryDocId,
              _key: `cat-${sanityCategoryId}`,
            },
          ]
        : [],
      bookingCategoryIds,
      clinics: clinicRefs,
      shortBio: s.bio ? i18nShortBioNo(s.bio) : i18nTextNo(shortBio),
      ...(s.bio && i18nBioNo(s.bio) ? { bio: i18nBioNo(s.bio) } : {}),
      ...(s.education
        ? {
            education: [
              {
                _type: 'educationItem',
                _key: 'edu-0',
                label: i18nStringNo(s.education),
              },
            ],
          }
        : {}),
      languages: s.languages?.length ? s.languages : ['Norsk', 'Engelsk'],
      faqs: GENERELT_FAQ_IDS.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: id,
      })),
      bookingEnabled: true,
      sortOrder: index + 1,
      seo: buildSeo(s),
      ...(photo ? { photo } : {}),
    }

    mutations.push({ createOrReplace: doc })
    console.log(`  ${DRY_RUN ? '[dry-run]' : '✓'} ${s.name} (${s.slug})`)
  }

  if (DELETE_ORPHANS) {
    const existing = await sanityClient.fetch<string[]>(
      `*[_type == "specialist"]._id`,
    )
    for (const id of existing) {
      const base = id.replace(/^drafts\./, '')
      if (!expectedIds.has(base)) {
        mutations.push({ delete: { id } })
        console.log(`  ${DRY_RUN ? '[dry-run delete]' : '🗑'} ${id}`)
      }
    }
  }

  if (DRY_RUN) {
    console.log(`\nWould apply ${mutations.length} mutation(s).`)
    return
  }

  const chunkSize = 50
  for (let i = 0; i < mutations.length; i += chunkSize) {
    const chunk = mutations.slice(i, i + chunkSize)
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({ mutations: chunk }),
    })
    if (!res.ok) {
      throw new Error(`Mutation failed: ${res.status} ${await res.text()}`)
    }
  }

  console.log(`\n✅ Replaced ${specialists.length} specialist document(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
