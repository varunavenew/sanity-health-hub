#!/usr/bin/env npx tsx
/**
 * Convert treatment `reasonsLead` / `reasonsLead2` (Symptoms — Introduction 1/2)
 * from plain i18n text to simple Portable Text, so Studio shows a text editor
 * and multi-paragraph copy renders as separate paragraphs on the website
 * instead of collapsing into one run-on line.
 *
 * Sibling of migrate-reason-desc-to-blocks.ts (same conversion, different fields).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-reasons-lead-to-blocks.ts
 *   cd test && npx tsx sanity/migrate-reasons-lead-to-blocks.ts
 */
import { sanityClient } from './config'
import { markdownToSimpleBlocks } from './lib/markdown-to-simple-blocks'

const DRY_RUN = process.env.DRY_RUN === '1'
const VALUE_TYPE = 'internationalizedArraySimpleBlockContentValue'
const FIELDS = ['reasonsLead', 'reasonsLead2'] as const

type I18nEntry = {
  _key?: string
  _type?: string
  language?: string
  value?: unknown
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

function convertField(field: I18nEntry[] | undefined): { next: I18nEntry[]; changed: boolean } {
  if (!Array.isArray(field) || field.length === 0) return { next: field ?? [], changed: false }

  let changed = false
  const next = field.map((entry) => {
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
  console.log('▶ Migrate reasonsLead / reasonsLead2 → simple block content')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const docs = await sanityClient.fetch<
    Record<string, unknown>[]
  >(`*[_type == "treatment" && (defined(reasonsLead) || defined(reasonsLead2))]{_id, reasonsLead, reasonsLead2}`)

  let patched = 0
  for (const doc of docs) {
    const id = doc._id as string
    const patch: Record<string, I18nEntry[]> = {}
    const changes: string[] = []

    for (const field of FIELDS) {
      const { next, changed } = convertField(doc[field] as I18nEntry[] | undefined)
      if (!changed) continue
      patch[field] = next
      changes.push(field)
    }

    if (changes.length === 0) continue

    console.log(`  ${id} (${changes.join(', ')})`)
    if (!DRY_RUN) {
      await sanityClient.patch(id).set(patch).commit()
    }
    patched += 1
  }

  console.log(`\n${DRY_RUN ? 'Would patch' : 'Patched'} ${patched} document(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
