/**
 * Migrate specialist biographies from src/data/specialists.ts into Sanity.
 *
 * Sets:
 *   - shortBio (first paragraph — used on cards + profile fallback)
 *   - bio (full portable text — all paragraphs from static `bio`)
 *
 * Does NOT modify SEO or other specialist fields.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-biographies:dry
 *   cd test && npm run migrate:specialist-biographies
 *   cd test && FORCE=1 npm run migrate:specialist-biographies
 */
import fs from 'node:fs'
import path from 'node:path'
import { sanityClient } from './config'
import { slugFromSpecialistDoc, specialistSlugProjection } from './lib/specialist-slug-groq'
import { i18nBioNo, i18nShortBioNo } from './lib/specialist-bio-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const SOURCE_PATH = path.resolve(__dirname, '../../src/data/specialists.ts')

const SANITY_SLUG_ALIASES: Record<string, string> = {
  'cennet-akdeniz': 'cennet-akdeni',
}

type StaticSpecialist = {
  slug: string
  name: string
  bio?: string
}

type SpecialistDoc = {
  _id: string
  name?: string
  slug?: string
  shortBio?: unknown
  bio?: unknown
}

function toNonEmptyString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
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
      slug: toNonEmptyString(row.slug),
      bio: toNonEmptyString(row.bio) || undefined,
    }))
    .filter((s) => s.slug && s.name)
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
  if (!entry?.value) return false
  if (Array.isArray(entry.value)) return entry.value.length > 0
  return false
}

function hasMeaningfulShortBio(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  return value.some((item) => {
    if (!item || typeof item !== 'object') return false
    const v = (item as { value?: unknown }).value
    return typeof v === 'string' && v.trim().length > 0
  })
}

async function run() {
  const staticBySlug = new Map(loadStaticSpecialists().map((s) => [s.slug, s]))

  const docs = await sanityClient.fetch<SpecialistDoc[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, ${specialistSlugProjection}, shortBio, bio
    }`,
  )

  console.log(`▶ Migrate specialist biographies (${docs.length} docs, ${staticBySlug.size} static)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0
  let missingStatic = 0

  for (const doc of docs) {
    const sanitySlug = slugFromSpecialistDoc(doc)
    const staticSlug = SANITY_SLUG_ALIASES[sanitySlug] ?? sanitySlug
    const staticItem = staticBySlug.get(staticSlug) ?? staticBySlug.get(sanitySlug)

    if (!staticItem?.bio) {
      missingStatic++
      continue
    }

    const patch: Record<string, unknown> = {}
    const shouldSetBio = FORCE || !hasMeaningfulBio(doc.bio)
    const shouldSetShortBio = FORCE || !hasMeaningfulShortBio(doc.shortBio)

    if (shouldSetBio) {
      const bio = i18nBioNo(staticItem.bio)
      if (bio) patch.bio = bio
    }
    if (shouldSetShortBio) {
      const shortBio = i18nShortBioNo(staticItem.bio)
      if (shortBio) patch.shortBio = shortBio
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    console.log(`  ✎ ${doc.name ?? sanitySlug} → ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped (already set): ${skipped}`)
  console.log(`⚠ No static bio: ${missingStatic}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
