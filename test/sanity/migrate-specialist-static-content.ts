/**
 * Migration: Backfill specialist profile content from src/data/specialists.ts.
 *
 * Purpose:
 * - Move remaining static specialist profile fields into Sanity so profile pages
 *   no longer depend on static fallbacks for intro/content.
 *
 * Fields (patched when missing, unless FORCE=1):
 * - role (internationalizedArrayString)
 * - subtitle (internationalizedArrayString)
 * - shortBio (internationalizedArrayText)
 * - bio (internationalizedArrayBlockContent — full biography paragraphs)
 * - specialties (array of internationalizedArrayString)
 * - education (array of internationalizedArrayString)
 * - languages (string[])
 *
 * Usage:
 *   cd test && npm run migrate:specialist-static:dry
 *   cd test && npm run migrate:specialist-static
 */
import fs from 'node:fs'
import path from 'node:path'
import { sanityClient } from './config'
import { slugFromSpecialistDoc, specialistSlugProjection } from './lib/specialist-slug-groq'
import { i18nBioNo, i18nShortBioNo } from './lib/specialist-bio-i18n'

type StaticSpecialist = {
  name?: string
  slug?: string
  title?: string
  subtitle?: string
  expertise?: string[]
  bio?: string
  education?: string
  languages?: string[]
}

type SpecialistDoc = {
  _id: string
  name?: string
  slug?: string
  role?: unknown
  subtitle?: unknown
  shortBio?: unknown
  bio?: unknown
  specialties?: unknown
  education?: unknown
  languages?: unknown
}

type I18nStringValue = {
  _type: 'internationalizedArrayStringValue'
  _key: 'no'
  language: 'no'
  value: string
}

type I18nTextValue = {
  _type: 'internationalizedArrayTextValue'
  _key: 'no'
  language: 'no'
  value: string
}

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const SANITY_SLUG_ALIASES: Record<string, string> = {
  // Sanity slug -> static slug alias
  'cennet-akdeniz': 'cennet-akdeni',
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function i18nStringNo(value: string): I18nStringValue[] {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value,
    },
  ]
}

function i18nTextNo(value: string): I18nTextValue[] {
  return [
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'no',
      language: 'no',
      value,
    },
  ]
}

function toNonEmptyString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function hasMeaningfulValue(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (!Array.isArray(value)) return false
  for (const item of value) {
    if (typeof item === 'string' && item.trim()) return true
    if (Array.isArray(item) && hasMeaningfulValue(item)) return true
    if (item && typeof item === 'object' && 'value' in item) {
      const inner = (item as { value?: unknown }).value
      if (typeof inner === 'string' && inner.trim()) return true
    }
  }
  return false
}

function hasMeaningfulBio(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  const entry = value.find(
    (item) =>
      item &&
      typeof item === 'object' &&
      ((item as { language?: string; _key?: string }).language === 'no' ||
        (item as { _key?: string })._key === 'no'),
  ) as { value?: unknown } | undefined
  return Array.isArray(entry?.value) && entry.value.length > 0
}

function loadStaticSpecialists(): StaticSpecialist[] {
  const sourcePath = path.resolve(__dirname, '../../src/data/specialists.ts')
  const source = fs.readFileSync(sourcePath, 'utf8')

  const startMatch = source.match(/export const specialists:\s*Specialist\[\]\s*=\s*\[/)
  if (!startMatch || startMatch.index == null) {
    throw new Error('Could not locate `export const specialists` in src/data/specialists.ts')
  }

  const arrayStart = startMatch.index + startMatch[0].length - 1
  if (arrayStart < 0 || source[arrayStart] !== '[') {
    throw new Error('Could not locate specialists array start `[`')
  }

  let depth = 0
  let arrayEnd = -1
  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        arrayEnd = i
        break
      }
    }
  }

  if (arrayEnd < 0) {
    throw new Error('Could not locate specialists array end `]`')
  }

  const arrayLiteral = source.slice(arrayStart, arrayEnd + 1)
  const sanitized = arrayLiteral.replace(/image:\s*[^,\n]+,/g, 'image: null,')

  const parsed = Function(`"use strict"; return (${sanitized});`)() as Array<
    Record<string, unknown>
  >

  return parsed
    .map((row) => ({
      name: toNonEmptyString(row.name),
      slug: toNonEmptyString(row.slug),
      title: toNonEmptyString(row.title),
      subtitle: toNonEmptyString(row.subtitle),
      expertise: Array.isArray(row.expertise)
        ? row.expertise.map((v) => toNonEmptyString(v)).filter(Boolean)
        : [],
      bio: toNonEmptyString(row.bio),
      education: toNonEmptyString(row.education),
      languages: Array.isArray(row.languages)
        ? row.languages.map((v) => toNonEmptyString(v)).filter(Boolean)
        : [],
    }))
    .filter((s) => s.slug)
}

async function run() {
  const staticSpecialists = loadStaticSpecialists()
  const staticBySlug = new Map(staticSpecialists.map((s) => [s.slug as string, s]))
  const staticByName = new Map(
    staticSpecialists
      .filter((s) => s.name)
      .map((s) => [normalizeName(s.name as string), s] as const),
  )

  console.log('▶ Backfill specialist content from static source')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}`)
  console.log(`  Static specialists loaded: ${staticSpecialists.length}\n`)

  const docs = await sanityClient.fetch<SpecialistDoc[]>(
    `*[_type == "specialist"]{
      _id,
      name,
      ${specialistSlugProjection},
      role,
      subtitle,
      shortBio,
      bio,
      specialties,
      education,
      languages
    }`,
  )

  const withSlug = docs
    .map((doc) => ({ ...doc, slug: slugFromSpecialistDoc(doc) }))
    .filter((doc): doc is SpecialistDoc & { slug: string } => Boolean(doc.slug))

  let updated = 0
  let unchanged = 0
  let matchedByAlias = 0
  let matchedByName = 0
  const unresolved: string[] = []
  const matchedStaticSlugs = new Set<string>()

  for (const doc of withSlug) {
    const aliasSlug = SANITY_SLUG_ALIASES[doc.slug]
    let staticItem =
      staticBySlug.get(doc.slug) ||
      (aliasSlug ? staticBySlug.get(aliasSlug) : undefined)

    if (!staticItem && doc.name) {
      staticItem = staticByName.get(normalizeName(doc.name))
      if (staticItem) matchedByName++
    } else if (staticItem && aliasSlug) {
      matchedByAlias++
    }

    if (!staticItem) {
      unresolved.push(`${doc.slug}: not found in static list`)
      continue
    }
    if (staticItem.slug) matchedStaticSlugs.add(staticItem.slug)

    const patch: Record<string, unknown> = {}

    if (staticItem.title && (FORCE || !hasMeaningfulValue(doc.role))) {
      patch.role = i18nStringNo(staticItem.title)
    }
    if (staticItem.subtitle && (FORCE || !hasMeaningfulValue(doc.subtitle))) {
      patch.subtitle = i18nStringNo(staticItem.subtitle)
    }
    if (staticItem.bio && (FORCE || !hasMeaningfulValue(doc.shortBio))) {
      const shortBio = i18nShortBioNo(staticItem.bio)
      if (shortBio) patch.shortBio = shortBio
    }
    if (staticItem.bio && (FORCE || !hasMeaningfulBio(doc.bio))) {
      const bio = i18nBioNo(staticItem.bio)
      if (bio) patch.bio = bio
    }
    if (
      staticItem.expertise &&
      staticItem.expertise.length &&
      (FORCE || !hasMeaningfulValue(doc.specialties))
    ) {
      patch.specialties = staticItem.expertise.map((item, index) => ({
        _type: 'specialtyItem',
        _key: `spec-${index}`,
        label: i18nStringNo(item),
      }))
    }
    if (staticItem.education && (FORCE || !hasMeaningfulValue(doc.education))) {
      patch.education = [{ _type: 'educationItem', label: i18nStringNo(staticItem.education) }]
    }
    if (
      staticItem.languages &&
      staticItem.languages.length &&
      (FORCE || !hasMeaningfulValue(doc.languages))
    ) {
      patch.languages = staticItem.languages
    }

    if (!Object.keys(patch).length) {
      unchanged++
      continue
    }

    if (DRY_RUN) {
      updated++
      console.log(
        `  [dry-run] ${doc.name ?? doc.slug} (${doc._id}) → ${Object.keys(patch).join(', ')}`,
      )
      continue
    }

    await sanityClient.patch(doc._id).set(patch).commit()
    updated++
    console.log(`  ✓ ${doc.name ?? doc.slug} (${doc._id}) → ${Object.keys(patch).join(', ')}`)
  }

  const staticOnly = [...staticBySlug.keys()].filter((slug) => !matchedStaticSlugs.has(slug))

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ Updated: ${updated}${DRY_RUN ? ' (dry-run)' : ''}`)
  console.log(`⏭  Unchanged: ${unchanged}`)
  console.log(`🔁 Matched via alias: ${matchedByAlias}`)
  console.log(`🧩 Matched via name fallback: ${matchedByName}`)
  if (unresolved.length) {
    console.log(`⚠ Unresolved: ${unresolved.length}`)
    unresolved.slice(0, 20).forEach((line) => console.log(`   - ${line}`))
    if (unresolved.length > 20) console.log(`   … +${unresolved.length - 20} more`)
  }
  if (staticOnly.length) {
    console.log(`ℹ Static-only slugs not found in Sanity: ${staticOnly.length}`)
    staticOnly.slice(0, 20).forEach((slug) => console.log(`   - ${slug}`))
    if (staticOnly.length > 20) console.log(`   … +${staticOnly.length - 20} more`)
  }
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
