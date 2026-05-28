/**
 * Backfill English (`en`) for all internationalizedArray fields (no Lovable key required).
 *
 * Uses MyMemory free translation by default. Optional: LOVABLE_API_KEY for higher quality.
 * Deduplicates strings and caches to `.translation-cache.json` (resumable).
 *
 * ENV:
 *   DRY_RUN=1           – preview only
 *   FORCE=1             – overwrite existing EN
 *   ONLY=type1,type2    – limit document types
 *   LOVABLE_API_KEY     – optional, use Lovable AI instead of free translators
 *   TRANSLATE_PROVIDER  – lingva (default) | google | mymemory | auto
 *   TRANSLATION_CACHE   – path to cache file (default: sanity/.translation-cache.json)
 *   TRANSLATE_DELAY_MS  – delay between API calls (default 1000)
 *   CONTINUE_ON_ERROR   – default 1; set to 0 to stop on first API failure
 *   ENABLE_GOOGLE_FALLBACK=1 – off by default (Google rate-limits many IPs)
 *   OFFLINE_ONLY=1      – only use cache/seed files, no network
 *
 * If APIs fail mid-run, apply what is cached first:
 *   npx tsx sanity/apply-english-from-cache.ts
 *
 * Run:
 *   cd test
 *   npx tsx sanity/backfill-english-i18n.ts
 */
import { sanityClient } from './config'
import { getWorkingLingvaHosts, saveCache, translateNoToEn } from './lib/translate-free'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const OFFLINE_ONLY = process.env.OFFLINE_ONLY === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY
const ONLY = (process.env.ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const I18N_VALUE_TYPES = new Set([
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArrayBlockContentValue',
])

const DOCUMENT_TYPES = [
  'article',
  'aboutPage',
  'treatment',
  'treatmentCategory',
  'homepage',
  'contactPage',
  'clinicPage',
  'servicesPage',
  'insurancePage',
  'themePage',
  'pricingPage',
  'specialistsPage',
  'specialist',
  'privacyPolicyPage',
  'faq',
  'siteSettings',
  'googleReview',
  'googleReviewSettings',
]

interface I18nItem {
  _type: string
  _key?: string
  language?: string
  value?: unknown
}

interface Job {
  path: (string | number)[]
  valueType: string
  noValue: unknown
  ptBlocks: boolean
}

function getLang(item: I18nItem): string | undefined {
  return item.language || item._key
}

function enHasValue(enItem: I18nItem | undefined): boolean {
  if (!enItem || enItem.value == null) return false
  if (typeof enItem.value === 'string') return enItem.value.trim().length > 0
  if (Array.isArray(enItem.value)) return enItem.value.length > 0
  return true
}

function collectJobs(node: unknown, path: (string | number)[], jobs: Job[]) {
  if (node == null) return

  if (Array.isArray(node)) {
    const isI18nArray =
      node.length > 0 &&
      typeof node[0] === 'object' &&
      node[0] !== null &&
      I18N_VALUE_TYPES.has((node[0] as I18nItem)._type)

    if (isI18nArray) {
      const items = node as I18nItem[]
      const noItem = items.find((i) => getLang(i) === 'no')
      const enItem = items.find((i) => getLang(i) === 'en')
      if (noItem && noItem.value != null && (FORCE || !enHasValue(enItem))) {
        const ptBlocks =
          noItem._type === 'internationalizedArrayBlockContentValue' &&
          Array.isArray(noItem.value)
        jobs.push({
          path,
          valueType: noItem._type,
          noValue: noItem.value,
          ptBlocks,
        })
      }
      return
    }

    node.forEach((child, idx) => collectJobs(child, [...path, idx], jobs))
    return
  }

  if (typeof node === 'object') {
    for (const key of Object.keys(node as object)) {
      if (key.startsWith('_')) continue
      collectJobs((node as Record<string, unknown>)[key], [...path, key], jobs)
    }
  }
}

async function lovableTranslate(text: string): Promise<string> {
  if (!LOVABLE_API_KEY || !text?.trim()) return ''
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content:
            'Translate Norwegian (Bokmål) medical website content to professional English. Return ONLY the translation. Keep CMedical, Livio Oslo unchanged.',
        },
        { role: 'user', content: text },
      ],
    }),
  })
  if (!res.ok) return ''
  const json = await res.json()
  return json?.choices?.[0]?.message?.content?.trim() || ''
}

async function translateText(text: string): Promise<string> {
  if (LOVABLE_API_KEY) return lovableTranslate(text)
  return translateNoToEn(text)
}

function cloneBlocksFresh(blocks: unknown[]): unknown[] {
  return JSON.parse(JSON.stringify(blocks)).map((b: Record<string, unknown>) => {
    delete b._key
    if (Array.isArray(b.children)) {
      b.children = (b.children as Record<string, unknown>[]).map((c) => {
        delete c._key
        return c
      })
    }
    if (Array.isArray(b.markDefs)) {
      b.markDefs = (b.markDefs as Record<string, unknown>[]).map((m) => {
        delete m._key
        return m
      })
    }
    return b
  })
}

async function translateBlocks(blocks: unknown[]): Promise<unknown[]> {
  const cloned = cloneBlocksFresh(blocks)
  for (const block of cloned) {
    const b = block as Record<string, unknown>
    if (b._type === 'block' && Array.isArray(b.children)) {
      for (const child of b.children as Record<string, unknown>[]) {
        if (
          child._type === 'span' &&
          typeof child.text === 'string' &&
          child.text.trim().length >= 2
        ) {
          const t = await translateText(child.text)
          if (t) child.text = t
        }
      }
    }
  }
  return cloned
}

function setAtPath(root: Record<string, unknown>, path: (string | number)[], value: unknown) {
  if (path.length === 0) return
  let cur: unknown = root
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (typeof key === 'number') {
      if (!Array.isArray(cur)) return
      cur = cur[key]
    } else {
      cur = (cur as Record<string, unknown>)[key]
    }
  }
  const last = path[path.length - 1]
  if (typeof last === 'number' && Array.isArray(cur)) {
    cur[last] = value
  } else if (typeof last === 'string' && cur && typeof cur === 'object') {
    ;(cur as Record<string, unknown>)[last] = value
  }
}

async function applyJobs(doc: Record<string, unknown>, jobs: Job[]) {
  const next = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>
  let applied = 0

  for (const job of jobs) {
    const arr = job.path.reduce<unknown>((acc, p) => {
      if (acc == null) return undefined
      return (acc as Record<string, unknown> | unknown[])[p as keyof typeof acc]
    }, next) as I18nItem[] | undefined

    if (!Array.isArray(arr)) continue

    let enValue: unknown
    if (job.ptBlocks && Array.isArray(job.noValue)) {
      enValue = await translateBlocks(job.noValue)
    } else if (typeof job.noValue === 'string') {
      enValue = await translateText(job.noValue)
    } else {
      continue
    }

    if (
      enValue == null ||
      (typeof enValue === 'string' && !enValue.trim()) ||
      (Array.isArray(enValue) && enValue.length === 0)
    ) {
      continue
    }

    const newArr = [...arr]
    const enIdx = newArr.findIndex((i) => getLang(i) === 'en')
    if (enIdx >= 0) {
      newArr[enIdx] = { ...newArr[enIdx], value: enValue }
    } else {
      newArr.push({
        _type: job.valueType,
        language: 'en',
        value: enValue,
      })
    }

    setAtPath(next, job.path, newArr)
    applied++
  }

  return { next, applied }
}

function topLevelPatches(
  original: Record<string, unknown>,
  updated: Record<string, unknown>
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

/** Collect unique plain strings needed for translation across all pending jobs */
function collectUniqueStrings(jobs: Job[]): string[] {
  const set = new Set<string>()
  const walkBlocks = (blocks: unknown[]) => {
    for (const block of blocks) {
      const b = block as Record<string, unknown>
      if (b._type === 'block' && Array.isArray(b.children)) {
        for (const child of b.children as Record<string, unknown>[]) {
          if (child._type === 'span' && typeof child.text === 'string') {
            const t = child.text.trim()
            if (t.length >= 2) set.add(t)
          }
        }
      }
    }
  }
  for (const job of jobs) {
    if (job.ptBlocks && Array.isArray(job.noValue)) walkBlocks(job.noValue)
    else if (typeof job.noValue === 'string' && job.noValue.trim()) set.add(job.noValue.trim())
  }
  return [...set]
}

async function run() {
  const types = ONLY.length
    ? DOCUMENT_TYPES.filter((t) => ONLY.includes(t))
    : DOCUMENT_TYPES

  const translator = LOVABLE_API_KEY
    ? 'Lovable AI'
    : `${process.env.TRANSLATE_PROVIDER || 'lingva'} (free; cache: .translation-cache.json)`

  console.log('▶ Backfill English i18n')
  console.log(`  Translator: ${translator}`)
  console.log(`  Dry run:    ${DRY_RUN ? '✓ (no writes)' : '✗'}`)
  console.log(`  Force:      ${FORCE ? '✓' : '✗'}`)
  if (ONLY.length) console.log(`  Types:      ${types.join(', ')}`)
  if (!LOVABLE_API_KEY && !OFFLINE_ONLY && !DRY_RUN) {
    await getWorkingLingvaHosts()
  }
  console.log()

  // Phase 1: gather all jobs across documents
  const docJobs: { doc: Record<string, unknown>; jobs: Job[] }[] = []
  for (const docType of types) {
    const docs = await sanityClient.fetch<Record<string, unknown>[]>(
      `*[_type == "${docType}"]`
    )
    for (const doc of docs) {
      const jobs: Job[] = []
      collectJobs(doc, [], jobs)
      if (jobs.length > 0) docJobs.push({ doc, jobs })
    }
  }

  const allJobs = docJobs.flatMap((d) => d.jobs)
  const uniqueStrings = collectUniqueStrings(allJobs)
  console.log(
    `Found ${docJobs.length} document(s) with ${allJobs.length} field(s) to translate (${uniqueStrings.length} unique strings)`
  )

  if (DRY_RUN) {
    console.log('\n  ℹ DRY_RUN=1 — re-run without it to write to Sanity\n')
    return
  }

  // Phase 2: pre-translate unique strings (deduped cache)
  if (!LOVABLE_API_KEY) {
    console.log('\n⏳ Pre-translating unique strings (cached for resume)…')
    let done = 0
    for (const s of uniqueStrings) {
      try {
        await translateNoToEn(s)
        done++
        if (done % 50 === 0) {
          console.log(`  … ${done}/${uniqueStrings.length}`)
          saveCache()
        }
      } catch (e) {
        console.warn(`  ⚠ ${(e as Error).message}`)
        saveCache()
        continue
      }
    }
    saveCache()
    console.log(`  ✓ ${done} strings in cache\n`)
  }

  // Phase 3: apply per document
  let totalDocs = 0
  let totalFields = 0

  for (const { doc, jobs } of docJobs) {
    try {
      const { next, applied } = await applyJobs(doc, jobs)
      if (applied === 0) {
        console.log(`  · ${doc._id} — skipped`)
        continue
      }
      const patches = topLevelPatches(doc, next)
      console.log(`  ✎ ${doc._id} — ${applied} field(s)`)
      await sanityClient
        .patch(String(doc._id))
        .set(patches)
        .commit({ autoGenerateArrayKeys: true })
      totalDocs++
      totalFields += applied
    } catch (e) {
      console.error(`  ✗ ${doc._id}:`, (e as Error).message)
    }
  }

  saveCache()
  console.log(`\n✓ Done — ${totalDocs} document(s), ${totalFields} field(s) written to Sanity`)
}

run().catch((e) => {
  console.error('✗ Backfill failed:', e)
  saveCache()
  process.exit(1)
})
