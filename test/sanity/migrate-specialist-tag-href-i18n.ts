#!/usr/bin/env npx tsx
/**
 * Convert specialistTag.href from a single plain string to an
 * internationalizedArrayString (NO + EN), matching the schema change in
 * test/schemaTypes/specialistTag.ts.
 *
 * NO value = the existing href, unchanged.
 * EN value = resolved by matching the existing NO href against the actual
 * treatmentCategory / treatment documents it points to, then reading that
 * same document's real EN slug (not a guess/translation) — e.g.
 * /gynekologi/endometriose -> /gynecology/endometriosis. Category URL
 * segments use the same hardcoded NO/EN map as src/lib/sanity/category-keys.ts
 * (categoryLandingPath) so results match live routing exactly.
 * Falls back to copying the NO value when the href doesn't match any known
 * category/treatment page (e.g. a typo, external URL, or empty) — logged
 * for manual review rather than guessed.
 *
 * Idempotent: tags whose href is already the i18n array shape are skipped.
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-specialist-tag-href-i18n.ts
 *   cd test && npx tsx sanity/migrate-specialist-tag-href-i18n.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/migrate-specialist-tag-href-i18n.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

const FLERE_FAGOMRADER_CATEGORY_ID = 'flere-fagomrader'

/** Same NO/EN URL segments as src/lib/sanity/category-keys.ts categoryLandingPath. */
const CATEGORY_SEGMENT: Record<string, { no: string; en: string }> = {
  gynekologi: { no: 'gynekologi', en: 'gynecology' },
  fertilitet: { no: 'fertilitet', en: 'fertility' },
  urologi: { no: 'urologi', en: 'urology' },
  ortopedi: { no: 'ortopedi', en: 'orthopedics' },
  graviditet: { no: 'graviditet', en: 'pregnancy' },
  [FLERE_FAGOMRADER_CATEGORY_ID]: { no: 'ovrige', en: 'other' },
  annet: { no: 'ovrige', en: 'other' },
}

type CategoryDoc = { categoryId?: string }
type TreatmentDoc = { categoryId?: string; slugNo?: string; slugEn?: string }

function i18nStringField(no: string, en: string) {
  return [
    { _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no },
    { _type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en },
  ]
}

function isI18nArray(value: unknown): boolean {
  return Array.isArray(value) && value.some((v) => v && typeof v === 'object' && 'language' in v)
}

async function main() {
  console.log(`\n[migrate-specialist-tag-href-i18n] dry=${DRY_RUN}\n`)

  const [categories, treatments, tags] = await Promise.all([
    sanityClient.fetch<CategoryDoc[]>(
      `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{categoryId}`,
    ),
    sanityClient.fetch<TreatmentDoc[]>(
      `*[_type == "treatment" && !(_id in path("drafts.**"))]{
        "categoryId": coalesce(categories[0]->categoryId, category->categoryId),
        "slugNo": coalesce(slug[language == "no"][0].value.current, slug[0].value.current),
        "slugEn": slug[language == "en"][0].value.current
      }`,
    ),
    sanityClient.fetch<Array<{ _id: string; href?: unknown }>>(
      `*[_type == "specialistTag"]{_id, href}`,
    ),
  ])

  /** NO href path -> EN href path. */
  const pathMap = new Map<string, string>()

  for (const cat of categories) {
    const seg = cat.categoryId && CATEGORY_SEGMENT[cat.categoryId]
    if (!seg) continue
    pathMap.set(`/${seg.no}`, `/${seg.en}`)
  }

  for (const t of treatments) {
    const seg = t.categoryId && CATEGORY_SEGMENT[t.categoryId]
    if (!seg || !t.slugNo) continue
    const noPath = `/${seg.no}/${t.slugNo}`
    const enPath = `/${seg.en}/${t.slugEn || t.slugNo}`
    pathMap.set(noPath, enPath)
  }

  console.log(`Resolved ${pathMap.size} known NO->EN paths from ${categories.length} categories + ${treatments.length} treatments.\n`)

  let toMigrate = 0
  let alreadyDone = 0
  let noHref = 0
  const unresolved: string[] = []

  for (const tag of tags) {
    if (isI18nArray(tag.href)) {
      alreadyDone += 1
      continue
    }
    const hrefNo = typeof tag.href === 'string' ? tag.href.trim() : ''
    if (!hrefNo) {
      noHref += 1
      continue
    }

    const hrefEn = pathMap.get(hrefNo)
    if (!hrefEn) {
      unresolved.push(`${tag._id}: "${hrefNo}" (no match — copying NO value to EN)`)
    }

    toMigrate += 1
    console.log(`  ~ ${tag._id}: "${hrefNo}" -> EN "${hrefEn || hrefNo}"`)

    if (!DRY_RUN) {
      await sanityClient
        .patch(tag._id)
        .set({ href: i18nStringField(hrefNo, hrefEn || hrefNo) })
        .commit()
    }
  }

  console.log(
    `\n${DRY_RUN ? 'Would migrate' : 'Migrated'} ${toMigrate} tag(s). ` +
      `Already i18n: ${alreadyDone}. No href: ${noHref}.`,
  )

  if (unresolved.length > 0) {
    console.log(`\n${unresolved.length} href(s) didn't match a known page (EN = NO copy, review manually):`)
    for (const line of unresolved) console.log(`  ! ${line}`)
  }
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
