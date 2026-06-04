#!/usr/bin/env npx tsx
/**
 * Remove English (`en`) translations from all article documents.
 *
 * Strips `en` entries from internationalizedArray fields (title, slug, excerpt,
 * body, image alt, seo, etc.) on published and draft articles.
 *
 * Usage (from test/):
 *   npm run remove:article-en:dry
 *   npm run remove:article-en
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nItem = {
  _type?: string
  _key?: string
  language?: string
  value?: unknown
}

function getLang(item: I18nItem): string | undefined {
  return item.language || item._key
}

function isI18nArray(node: unknown[]): boolean {
  if (!node.length) return false
  const first = node[0]
  return (
    typeof first === 'object' &&
    first !== null &&
    typeof (first as I18nItem)._type === 'string' &&
    (first as I18nItem)._type!.startsWith('internationalizedArray')
  )
}

function stripEnglish(node: unknown): { next: unknown; removed: number } {
  if (node == null) return { next: node, removed: 0 }

  if (Array.isArray(node)) {
    if (isI18nArray(node)) {
      const items = node as I18nItem[]
      const filtered = items.filter((i) => getLang(i) !== 'en')
      const removed = items.length - filtered.length
      return { next: filtered, removed }
    }

    let removed = 0
    const next = node.map((child) => {
      const r = stripEnglish(child)
      removed += r.removed
      return r.next
    })
    return { next, removed }
  }

  if (typeof node === 'object') {
    let removed = 0
    const next: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.startsWith('_')) {
        next[key] = value
        continue
      }
      const r = stripEnglish(value)
      removed += r.removed
      next[key] = r.next
    }
    return { next, removed }
  }

  return { next: node, removed: 0 }
}

function topLevelPatches(
  original: Record<string, unknown>,
  updated: Record<string, unknown>,
): Record<string, unknown> {
  const patches: Record<string, unknown> = {}
  for (const key of Object.keys(updated)) {
    if (key.startsWith('_')) continue
    if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
      patches[key] = updated[key]
    }
  }
  return patches
}

async function run() {
  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "article"]`,
  )

  if (!docs.length) {
    console.log('No article documents found.')
    return
  }

  let changed = 0
  let totalRemoved = 0

  for (const doc of docs) {
    const { next, removed } = stripEnglish(doc)
    if (removed === 0) continue

    changed += 1
    totalRemoved += removed
    const patches = topLevelPatches(doc, next as Record<string, unknown>)

    if (DRY_RUN) {
      console.log(`DRY ${doc._id} — would remove ${removed} en slot(s)`)
      continue
    }

    await sanityClient
      .patch(String(doc._id))
      .set(patches)
      .commit({ autoGenerateArrayKeys: true })
    console.log(`✓ ${doc._id} — removed ${removed} en slot(s)`)
  }

  console.log(
    `\n${DRY_RUN ? 'Would update' : 'Updated'} ${changed} article(s), ${totalRemoved} en slot(s) total.`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
