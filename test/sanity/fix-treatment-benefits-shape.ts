/**
 * Fix treatment.benefits stored as plain strings / i18n arrays instead of objects.
 *
 * Usage (from test/):
 *   npm run fix:treatment-benefits-shape:dry
 *   npm run fix:treatment-benefits-shape
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'

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

function isValidBenefitObject(item: unknown): boolean {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false
  const row = item as { _type?: string; title?: unknown }
  return row._type === 'treatmentBenefit' && Boolean(row.title)
}

function normalizeBenefitItem(item: unknown, index: number): Record<string, unknown> | null {
  if (typeof item === 'string') {
    const text = item.trim()
    if (!text) return null
    return {
      _type: 'treatmentBenefit',
      _key: `benefit-${index}`,
      title: i18nString(text, text),
    }
  }

  if (Array.isArray(item)) {
    const no = pickLang(item, 'no')
    const en = pickLang(item, 'en') || no
    if (!no && !en) return null
    return {
      _type: 'treatmentBenefit',
      _key: `benefit-${index}`,
      title: i18nString(no, en),
    }
  }

  if (item && typeof item === 'object') {
    const row = item as Record<string, unknown>
    if (isValidBenefitObject(row)) {
      return {
        ...row,
        _key: typeof row._key === 'string' ? row._key : `benefit-${index}`,
      }
    }
    if (row.title) {
      const no = pickLang(row.title, 'no')
      const en = pickLang(row.title, 'en') || no
      if (!no && !en) return null
      return {
        _type: 'treatmentBenefit',
        _key: typeof row._key === 'string' ? row._key : `benefit-${index}`,
        title: Array.isArray(row.title) ? row.title : i18nString(no, en),
      }
    }
  }

  return null
}

function normalizeBenefits(benefits: unknown[] | undefined | null) {
  if (!Array.isArray(benefits)) return { changed: false, next: benefits }
  const needsFix = benefits.some((item) => !isValidBenefitObject(item))
  if (!needsFix) return { changed: false, next: benefits }

  const next = benefits
    .map((item, index) => normalizeBenefitItem(item, index))
    .filter((item): item is Record<string, unknown> => Boolean(item))

  return { changed: true, next }
}

async function run() {
  const rows = await sanityClient.fetch<
    Array<{
      _id: string
      title?: unknown
      benefits?: unknown[]
    }>
  >(`*[_type == "treatment" && defined(benefits) && count(benefits) > 0]{
    _id,
    "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
    benefits
  }`)

  console.log(DRY_RUN ? 'Dry run — no writes\n' : '')
  let fixed = 0

  for (const row of rows) {
    const { changed, next } = normalizeBenefits(row.benefits)
    if (!changed || !Array.isArray(next)) continue

    const label = typeof row.title === 'string' ? row.title : row._id
    console.log(`✎ ${label} (${row._id}) — ${row.benefits?.length ?? 0} → ${next.length} benefit object(s)`)

    if (!DRY_RUN) {
      await sanityClient.patch(row._id).set({ benefits: next }).commit()
    }
    fixed++
  }

  console.log(`\n${DRY_RUN ? 'Would fix' : 'Fixed'} ${fixed} treatment document(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
