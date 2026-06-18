#!/usr/bin/env npx tsx
/**
 * Copy category landing browser title + description into `seo.metaTitle` / `seo.metaDescription`.
 *
 * Sources:
 *   metaTitle       ← landingPage.documentTitle
 *   metaDescription ← description (category field), else landingPage.hero.body (truncated)
 *
 * Usage (from test/):
 *   npm run migrate:category-seo-from-landing:dry
 *   npm run migrate:category-seo-from-landing
 */
import { sanityClient } from './config'
import { i18nString, i18nText, type I18nItem } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type Doc = {
  _id: string
  categoryId?: string
  title?: I18nItem[]
  description?: I18nItem[]
  landingPage?: {
    documentTitle?: I18nItem[]
    hero?: { body?: I18nItem[] }
  }
  seo?: {
    metaTitle?: I18nItem[] | string
    metaDescription?: I18nItem[] | string
  }
}

function getLang(item: I18nItem): string {
  return item.language || item._key || 'no'
}

function readLang(arr: I18nItem[] | undefined, lang: 'no' | 'en'): string {
  if (!Array.isArray(arr)) return ''
  return arr.find((i) => getLang(i) === lang)?.value?.trim() || ''
}

function hasI18nValue(val: I18nItem[] | string | undefined): boolean {
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

function firstParagraph(text: string): string {
  return text.split(/\n\n+/)[0]?.trim() || text.trim()
}

function buildMetaDescription(doc: Doc): I18nItem[] | undefined {
  const noDesc = readLang(doc.description, 'no')
  const enDesc = readLang(doc.description, 'en')
  const noHero = firstParagraph(readLang(doc.landingPage?.hero?.body, 'no'))
  const enHero = firstParagraph(readLang(doc.landingPage?.hero?.body, 'en'))

  const no = truncate(noDesc || noHero)
  const en = truncate(enDesc || enHero)
  if (!no && !en) return undefined
  return i18nText(no, en || no)
}

function buildMetaTitle(doc: Doc): I18nItem[] | undefined {
  const fromLanding = doc.landingPage?.documentTitle
  if (hasI18nValue(fromLanding)) return fromLanding as I18nItem[]

  const noTitle = readLang(doc.title, 'no')
  const enTitle = readLang(doc.title, 'en')
  if (!noTitle && !enTitle) return undefined
  return i18nString(
    noTitle ? `${noTitle} | CMedical` : `${enTitle} | CMedical`,
    enTitle ? `${enTitle} | CMedical` : `${noTitle} | CMedical`,
  )
}

async function run() {
  const docs = await sanityClient.fetch<Doc[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id,
      categoryId,
      title,
      description,
      landingPage { documentTitle, hero { body } },
      seo { metaTitle, metaDescription }
    } | order(categoryId asc)`,
  )

  if (!docs.length) {
    console.log('No treatment categories found.')
    return
  }

  let changed = 0

  for (const doc of docs) {
    const metaTitle = buildMetaTitle(doc)
    const metaDescription = buildMetaDescription(doc)
    if (!metaTitle && !metaDescription) {
      console.log(`– Skipped ${doc._id} (no title/description sources)`)
      continue
    }

    if (
      !FORCE &&
      hasI18nValue(doc.seo?.metaTitle) &&
      hasI18nValue(doc.seo?.metaDescription)
    ) {
      console.log(`– Skipped ${doc._id} (seo already set; use FORCE=1 to overwrite)`)
      continue
    }

    const seo = {
      _type: 'seo' as const,
      ...(metaTitle ? { metaTitle } : doc.seo?.metaTitle ? { metaTitle: doc.seo.metaTitle } : {}),
      ...(metaDescription
        ? { metaDescription }
        : doc.seo?.metaDescription
          ? { metaDescription: doc.seo.metaDescription }
          : {}),
    }

    changed += 1
    const label = doc.categoryId || doc._id
    if (DRY_RUN) {
      console.log(
        `DRY ${label}: title="${readLang(metaTitle, 'en') || readLang(metaTitle, 'no')}" desc="${(readLang(metaDescription, 'en') || readLang(metaDescription, 'no')).slice(0, 60)}…"`,
      )
      continue
    }

    await sanityClient.patch(doc._id).set({ seo }).commit()
    console.log(`✓ ${label}`)
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${changed} categor(ies).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
