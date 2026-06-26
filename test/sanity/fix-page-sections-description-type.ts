/**
 * Fix pageSectionSpecialists / pageSectionArticles description (Ingress) fields
 * that were migrated with internationalizedArrayStringValue instead of TextValue.
 *
 * Usage:
 *   cd test && npm run fix:page-sections-description:dry
 *   cd test && npm run fix:page-sections-description
 */
import { sanityClient } from './config'
import { i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nItem = {
  _type?: string
  _key?: string
  language?: string
  value?: string
}

type Section = {
  _type?: string
  _key?: string
  description?: I18nItem[]
}

function fixDescriptionField(description: unknown): I18nItem[] | null {
  if (!Array.isArray(description) || description.length === 0) return null

  const hasWrongType = description.some(
    (item) => item?._type === 'internationalizedArrayStringValue',
  )
  if (!hasWrongType) return null

  const no = description.find((item) => item?.language === 'no')?.value?.trim() || ''
  const en = description.find((item) => item?.language === 'en')?.value?.trim() || no

  return i18nText(no, en)
}

function fixPageSections(sections: unknown[] | undefined): {
  sections: unknown[]
  changed: boolean
} {
  if (!Array.isArray(sections)) return { sections: [], changed: false }

  let changed = false
  const fixed = sections.map((section) => {
    const s = section as Section
    if (s._type !== 'pageSectionSpecialists' && s._type !== 'pageSectionArticles') {
      return section
    }

    const fixedDescription = fixDescriptionField(s.description)
    if (!fixedDescription) return section

    changed = true
    return { ...s, description: fixedDescription }
  })

  return { sections: fixed, changed }
}

async function run() {
  const docs = await sanityClient.fetch<{ _id: string; _type: string; pageSections?: unknown[] }[]>(
    `*[
      defined(pageSections) &&
      count(pageSections[_type in ["pageSectionSpecialists", "pageSectionArticles"]]) > 0
    ]{ _id, _type, pageSections }`,
  )

  console.log(`▶ Fix page section Ingress (description) i18n types`)
  console.log(`  Documents to scan: ${docs.length}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of docs) {
    const { sections, changed } = fixPageSections(doc.pageSections)
    if (!changed) {
      skipped++
      continue
    }

    console.log(`  ✎ ${doc._type}/${doc._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ pageSections: sections }).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would fix' : 'Fixed'} documents: ${updated}`)
  console.log(`⏭  Skipped (already correct): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
