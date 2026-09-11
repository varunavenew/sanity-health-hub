#!/usr/bin/env npx tsx
/**
 * Convert treatment `reasons[].desc` from plain i18n text (markdown links)
 * to simple Portable Text so Studio shows a text editor with real links.
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-reason-desc-to-blocks.ts
 *   cd test && npx tsx sanity/migrate-reason-desc-to-blocks.ts
 */
import { sanityClient } from './config'
import { markdownToSimpleBlocks } from './lib/markdown-to-simple-blocks'

const DRY_RUN = process.env.DRY_RUN === '1'
const VALUE_TYPE = 'internationalizedArraySimpleBlockContentValue'

type I18nEntry = {
  _key?: string
  _type?: string
  language?: string
  value?: unknown
}

type ReasonRow = {
  _key?: string
  desc?: I18nEntry[]
}

function langOf(entry: I18nEntry): string {
  return entry.language || entry._key || 'no'
}

function isBlockArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.some((block) => block && typeof block === 'object' && (block as {_type?: string})._type === 'block')
  )
}

function convertDesc(desc: I18nEntry[] | undefined): { next: I18nEntry[]; changed: boolean } {
  if (!Array.isArray(desc) || desc.length === 0) return { next: desc ?? [], changed: false }

  let changed = false
  const next = desc.map((entry) => {
    const lang = langOf(entry)
    if (typeof entry.value === 'string') {
      changed = true
      return {
        _key: lang,
        language: lang,
        _type: VALUE_TYPE,
        value: markdownToSimpleBlocks(entry.value),
      }
    }
    if (isBlockArray(entry.value) && entry._type !== VALUE_TYPE) {
      changed = true
      return { ...entry, _key: lang, language: lang, _type: VALUE_TYPE }
    }
    return entry
  })

  return { next, changed }
}

async function run() {
  console.log('▶ Migrate reasons[].desc → simple block content')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const docs = await sanityClient.fetch<
    {_id: string; _type: string; reasons?: ReasonRow[]}[]
  >(`*[_type in ["treatment", "subTreatmentLayout"] && defined(reasons)]{_id, _type, reasons}`)

  let patched = 0
  for (const doc of docs) {
    const reasons = Array.isArray(doc.reasons) ? doc.reasons : []
    let docChanged = false
    const nextReasons = reasons.map((row) => {
      const { next, changed } = convertDesc(row.desc)
      if (!changed) return row
      docChanged = true
      return { ...row, desc: next }
    })

    if (!docChanged) continue

    console.log(`  ${doc._id} (${reasons.length} items)`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ reasons: nextReasons }).commit()
    }
    patched += 1
  }

  console.log(`\n${DRY_RUN ? 'Would patch' : 'Patched'} ${patched} document(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
