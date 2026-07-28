#!/usr/bin/env npx tsx
/**
 * Migrate Guide Categories Intro onto guidePage.
 *
 * Copies the former hardcoded / hero-seeded intro copy into:
 *   - categoriesIntroTitle
 *   - categoriesIntroDescription
 *
 * When heroTitle/heroSubtitle still match that seeded copy, clears them so the
 * site does not render the same text twice (Hero + Categories Intro).
 *
 * Dataset: uses Studio client config (developer by default). No Production writes
 * unless ALLOW_PRODUCTION_MIGRATION=true and dataset is production.
 *
 * Run:
 *   cd test && npm run migrate:guide-categories-intro:dry
 *   cd test && npm run migrate:guide-categories-intro
 */
import {sanityClient} from './config'
import {i18nString, i18nText} from './lib/category-landing-i18n'
import {patchSingletonFields, singletonDocumentIds} from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOCUMENT_ID = 'guidePage'

const INTRO_TITLE_NO = 'Våre Behandlinger'
const INTRO_TITLE_EN = 'Our Treatments'
const INTRO_DESC_NO = 'Spesialiserte behandlinger for kvinnen og mannens underliv'
const INTRO_DESC_EN = "Specialized treatments for women's and men's intimate health"

type I18nRow = {language?: string; _key?: string; value?: string}

function pickLang(value: unknown, lang: 'no' | 'en'): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const match = (value as I18nRow[]).find(
    (row) => (row.language || row._key) === lang,
  )
  const fallback = (value as I18nRow[])[0]
  const text = match?.value ?? fallback?.value
  return typeof text === 'string' ? text.trim() : ''
}

function hasI18nContent(value: unknown): boolean {
  return Boolean(pickLang(value, 'no') || pickLang(value, 'en'))
}

function matchesSeededHero(doc: Record<string, unknown>): boolean {
  const titleNo = pickLang(doc.heroTitle, 'no')
  const titleEn = pickLang(doc.heroTitle, 'en')
  const subNo = pickLang(doc.heroSubtitle, 'no')
  const subEn = pickLang(doc.heroSubtitle, 'en')

  const titleMatches =
    (!titleNo && !titleEn) ||
    titleNo === INTRO_TITLE_NO ||
    titleEn === INTRO_TITLE_EN
  const subMatches =
    (!subNo && !subEn) ||
    subNo === INTRO_DESC_NO ||
    subEn === INTRO_DESC_EN

  return titleMatches && subMatches && Boolean(titleNo || titleEn || subNo || subEn)
}

async function run() {
  console.log('▶ Migrate Guide Categories Intro')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Dataset: ${(sanityClient as {config?: () => {dataset?: string}}).config?.()?.dataset || 'unknown'}\n`)

  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_id in $ids]{_id, _type, heroTitle, heroSubtitle, categoriesIntroTitle, categoriesIntroDescription}`,
    {ids: singletonDocumentIds(DOCUMENT_ID)},
  )

  if (!docs.length) {
    console.error('guidePage not found — run migrate:guide-page first if needed.')
    process.exit(1)
  }

  const published = docs.find((d) => d._id === DOCUMENT_ID) || docs[0]
  const introAlready =
    hasI18nContent(published.categoriesIntroTitle) ||
    hasI18nContent(published.categoriesIntroDescription)

  const fields: Record<string, unknown> = {}
  const unset: string[] = []

  if (!introAlready) {
    fields.categoriesIntroTitle = i18nString(INTRO_TITLE_NO, INTRO_TITLE_EN)
    fields.categoriesIntroDescription = i18nText(INTRO_DESC_NO, INTRO_DESC_EN)
    console.log('  Will set categoriesIntroTitle / categoriesIntroDescription from seeded copy')
  } else {
    console.log('  categoriesIntro* already set — leaving intro fields unchanged')
  }

  if (matchesSeededHero(published)) {
    unset.push('heroTitle', 'heroSubtitle')
    console.log('  Will clear heroTitle / heroSubtitle (matched seeded Categories Intro copy)')
  } else {
    console.log('  Hero copy differs from seeded intro — leaving hero fields unchanged')
  }

  if (!Object.keys(fields).length && !unset.length) {
    console.log('\n✓ Nothing to do')
    return
  }

  if (DRY_RUN) {
    console.log('\n  Would set:', JSON.stringify(fields, null, 2))
    console.log('  Would unset:', unset)
    console.log('\n✓ Dry run complete')
    return
  }

  if (Object.keys(fields).length) {
    const patched = await patchSingletonFields(DOCUMENT_ID, fields, 'guidePage')
    console.log(`  Patched set: ${patched.join(', ')}`)
  }

  if (unset.length) {
    for (const id of singletonDocumentIds(DOCUMENT_ID)) {
      const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, {id})
      if (!exists) continue
      await sanityClient.patch(id).unset(unset).commit()
      console.log(`  Unset on ${id}: ${unset.join(', ')}`)
    }
  }

  console.log('\n✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
