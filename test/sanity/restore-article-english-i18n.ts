#!/usr/bin/env npx tsx
/**
 * Restore English (`en`) article translations removed by remove-article-english-i18n.ts
 * using Sanity document history (exact text from before removal).
 *
 * ENV:
 *   RESTORE_BEFORE_TIME – ISO timestamp (default: 2026-06-03T06:58:00.000Z)
 *   DRY_RUN=1           – preview only
 *
 * Usage (from test/):
 *   npm run restore:article-en:dry
 *   npm run restore:article-en
 */
import { DATASET, sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const RESTORE_BEFORE_TIME =
  process.env.RESTORE_BEFORE_TIME || '2026-06-03T06:58:00.000Z'

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

function enItemFromArray(arr: I18nItem[]): I18nItem | undefined {
  return arr.find((i) => getLang(i) === 'en')
}

/** Merge `en` slots from historical doc into current (keeps other current edits). */
function mergeEnglishFromHistory(
  current: unknown,
  historical: unknown,
): { next: unknown; restored: number } {
  if (historical == null) return { next: current, restored: 0 }
  if (current == null) return { next: historical, restored: 0 }

  if (Array.isArray(current) && Array.isArray(historical)) {
    if (isI18nArray(current) && isI18nArray(historical)) {
      const cur = current as I18nItem[]
      const hist = historical as I18nItem[]
      const histEn = enItemFromArray(hist)
      if (!histEn?.value) return { next: current, restored: 0 }

      const hasEn =
        histEn.value != null &&
        (typeof histEn.value !== 'string' || histEn.value.trim().length > 0) &&
        (!Array.isArray(histEn.value) || histEn.value.length > 0)

      if (!hasEn) return { next: current, restored: 0 }

      const curEnIdx = cur.findIndex((i) => getLang(i) === 'en')
      const restoredEn: I18nItem = {
        _type: histEn._type || cur[0]?._type || 'internationalizedArrayStringValue',
        _key: 'en',
        language: 'en',
        value: JSON.parse(JSON.stringify(histEn.value)),
      }

      if (curEnIdx >= 0) {
        const same =
          JSON.stringify(cur[curEnIdx].value) === JSON.stringify(restoredEn.value)
        if (same) return { next: current, restored: 0 }
        const next = [...cur]
        next[curEnIdx] = { ...next[curEnIdx], ...restoredEn }
        return { next, restored: 1 }
      }

      return { next: [...cur, restoredEn], restored: 1 }
    }

    const len = Math.max(current.length, historical.length)
    let restored = 0
    const next: unknown[] = []
    for (let i = 0; i < len; i++) {
      const r = mergeEnglishFromHistory(current[i], historical[i])
      restored += r.restored
      next[i] = r.next
    }
    return { next, restored }
  }

  if (
    typeof current === 'object' &&
    !Array.isArray(current) &&
    typeof historical === 'object' &&
    !Array.isArray(historical)
  ) {
    let restored = 0
    const next: Record<string, unknown> = { ...(current as Record<string, unknown>) }
    const histObj = historical as Record<string, unknown>
    for (const key of Object.keys(histObj)) {
      if (key.startsWith('_')) continue
      const r = mergeEnglishFromHistory(
        (current as Record<string, unknown>)[key],
        histObj[key],
      )
      restored += r.restored
      next[key] = r.next
    }
    return { next, restored }
  }

  return { next: current, restored: 0 }
}

async function fetchHistoricalDoc(documentId: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await sanityClient.request<{ documents?: Record<string, unknown>[] }>({
      url: `/data/history/${DATASET}/documents/${documentId}?time=${encodeURIComponent(RESTORE_BEFORE_TIME)}`,
    })
    return res?.documents?.[0] ?? null
  } catch (e) {
    console.warn(`  ⚠ History unavailable for ${documentId}:`, (e as Error).message)
    return null
  }
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
  const docs = await sanityClient.fetch<{ _id: string }[]>(
    `*[_type == "article"]{ _id } | order(_id asc)`,
  )

  console.log(`▶ Restore article English from history (before ${RESTORE_BEFORE_TIME})`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let changed = 0
  let totalRestored = 0
  let skipped = 0

  for (const { _id } of docs) {
    const current = await sanityClient.getDocument(_id)
    if (!current) {
      skipped += 1
      continue
    }

    const historical = await fetchHistoricalDoc(_id)
    if (!historical) {
      skipped += 1
      continue
    }

    const { next, restored } = mergeEnglishFromHistory(current, historical)
    if (restored === 0) continue

    changed += 1
    totalRestored += restored
    const patches = topLevelPatches(
      current as Record<string, unknown>,
      next as Record<string, unknown>,
    )

    if (DRY_RUN) {
      console.log(`DRY ${_id} — would restore ${restored} en slot(s)`)
      continue
    }

    await sanityClient
      .patch(_id)
      .set(patches)
      .commit({ autoGenerateArrayKeys: true })
    console.log(`✓ ${_id} — restored ${restored} en slot(s)`)
  }

  console.log(
    `\n${DRY_RUN ? 'Would update' : 'Updated'} ${changed} article(s), ${totalRestored} en slot(s); skipped ${skipped}.`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
