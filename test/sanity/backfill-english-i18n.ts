/**
 * Backfill English (`en`) for all internationalizedArray fields (no paid API key required).
 *
 * Uses MyMemory free translation by default. Optional AI: OPENAI_API_KEY or LOVABLE_API_KEY.
 * Deduplicates strings and caches to `.translation-cache.json` (resumable).
 *
 * ENV:
 *   DRY_RUN=1           – preview only
 *   FORCE=1             – overwrite existing EN
 *   ONLY=type1,type2    – limit document types
 *   OPENAI_API_KEY      – optional, OpenAI Chat Completions (sk-...)
 *   OPENAI_MODEL        – optional, default gpt-4o-mini
 *   LOVABLE_API_KEY     – optional, Lovable AI Gateway (lv_...)
 *   TRANSLATE_PROVIDER  – lingva (default) | google | mymemory | auto
 *   TRANSLATION_CACHE   – path to cache file (default: sanity/.translation-cache.json)
 *   TRANSLATE_DELAY_MS  – delay between API calls (default 500 for OpenAI, 1500 for free)
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
import {
  cacheTranslation,
  getCachedTranslation,
  getWorkingLingvaHosts,
  saveCache,
  translateNoToEn,
} from './lib/translate-free'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const OFFLINE_ONLY = process.env.OFFLINE_ONLY === '1'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim()
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY?.trim()
const USES_AI = !!(OPENAI_API_KEY || LOVABLE_API_KEY)
const AI_DELAY_MS = Number(
  process.env.TRANSLATE_DELAY_MS || (OPENAI_API_KEY ? 500 : 1500)
)
const AI_MAX_RETRIES = Number(process.env.AI_MAX_RETRIES || 6)
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

function isNorwegian(text: string): boolean {
  const t = text.toLowerCase();
  if (/[æøå]/.test(t)) return true;
  const noWords = [
    ' og ', ' eller ', ' som ', ' med ', ' fra ', ' til ', ' inngrep ',
    ' inngrepet ', ' pasient ', ' pasientene ', ' refertilisering ', 
    ' sterilisering ', ' sæd ', ' sædleder ', ' sædlederne ', ' sædblæren ', 
    ' testiklene ', ' sædceller ', ' sædprøve ', ' sæduttømmingen ', 
    ' narkose ', ' reise ', ' hjem ', ' samme ', ' dag ', ' spesialist ',
    ' er en ', ' for menn ', ' man ', ' kutter ', ' transportere ',
    ' av pasientene ', ' kan regne ', ' få spermier ', ' etter inngrepet ',
    ' gjøres i ', ' lett narkose ', ' kan reise ', ' en kontroll ', ' måned ',
    ' måneder ', ' etter inngrepet ', ' stoffskifte ', ' hormonsykdommer ',
    ' hormonutredning ', ' ventetid ', ' henvisning '
  ];
  for (const word of noWords) {
    if (t.includes(word)) return true;
  }
  return false;
}

function enHasValue(enItem: I18nItem | undefined, noItem: I18nItem | undefined): boolean {
  if (!enItem || enItem.value == null) return false;
  
  if (typeof enItem.value === 'string') {
    const val = enItem.value.trim();
    if (val.length === 0) return false;
    
    if (noItem && typeof noItem.value === 'string') {
      const noVal = noItem.value.trim();
      if (val === noVal && val.length > 8) {
        return false;
      }
    }
    
    if (isNorwegian(val)) {
      return false;
    }
    
    return true;
  }
  
  if (Array.isArray(enItem.value)) {
    if (enItem.value.length === 0) return false;
    
    const textContent = enItem.value
      .map((block: any) => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join(' ');
        }
        return '';
      })
      .join(' ');
      
    if (isNorwegian(textContent)) {
      return false;
    }
    
    if (noItem && Array.isArray(noItem.value)) {
      if (JSON.stringify(enItem.value) === JSON.stringify(noItem.value)) {
        if (textContent.trim().length > 12) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  return true;
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
      if (noItem && noItem.value != null && (FORCE || !enHasValue(enItem, noItem))) {
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

const AI_SYSTEM_PROMPT =
  'Translate Norwegian (Bokmål) medical website content to professional English. ' +
  'Return ONLY the translation. Keep CMedical, Livio Oslo unchanged.'

let aiAuthWarned = false

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function chatCompletionsTranslate(
  url: string,
  apiKey: string,
  model: string,
  providerLabel: string,
  text: string
): Promise<string> {
  if (!apiKey || !text?.trim()) return ''

  for (let attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const wait = Math.min(60_000, 2_000 * 2 ** (attempt - 1))
      console.warn(`  ⚠ ${providerLabel} retry ${attempt}/${AI_MAX_RETRIES} in ${wait}ms…`)
      await sleep(wait)
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    })

    if (res.ok) {
      const json = await res.json()
      await sleep(AI_DELAY_MS)
      return json?.choices?.[0]?.message?.content?.trim() || ''
    }

    if (res.status === 429 && attempt < AI_MAX_RETRIES) {
      const retryAfter = Number(res.headers.get('retry-after'))
      const wait = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(60_000, 3_000 * 2 ** attempt)
      if (!aiAuthWarned) {
        aiAuthWarned = true
        console.warn(
          `\n  ⚠ ${providerLabel} rate limit (429). Retrying with backoff — ` +
            `set TRANSLATE_DELAY_MS=1000 to slow down.\n`
        )
      }
      await sleep(wait)
      continue
    }

    if (!aiAuthWarned) {
      aiAuthWarned = true
      if (res.status === 401 || res.status === 403) {
        console.error(
          `\n  ✗ ${providerLabel} API ${res.status} — check your API key in test/.env.local.\n`
        )
      } else if (res.status === 429) {
        console.error(
          `\n  ✗ ${providerLabel} API 429 — rate limit / quota exceeded. ` +
            `Wait a few minutes, check billing at platform.openai.com, ` +
            `then re-run (cache resumes).\n`
        )
      } else {
        console.error(`\n  ✗ ${providerLabel} API ${res.status} — translation requests are failing.\n`)
      }
    }
    return ''
  }

  return ''
}

async function openaiTranslate(text: string): Promise<string> {
  return chatCompletionsTranslate(
    'https://api.openai.com/v1/chat/completions',
    OPENAI_API_KEY || '',
    OPENAI_MODEL,
    'OpenAI',
    text
  )
}

async function lovableTranslate(text: string): Promise<string> {
  return chatCompletionsTranslate(
    'https://ai.gateway.lovable.dev/v1/chat/completions',
    LOVABLE_API_KEY || '',
    'google/gemini-2.5-flash',
    'Lovable',
    text
  )
}

async function translateText(text: string): Promise<string> {
  const trimmed = text?.trim()
  if (!trimmed) return ''

  const cached = getCachedTranslation(trimmed)
  if (cached) return cached

  let result = ''
  if (OPENAI_API_KEY) result = await openaiTranslate(trimmed)
  else if (LOVABLE_API_KEY) result = await lovableTranslate(trimmed)
  else return translateNoToEn(trimmed)

  if (result) {
    cacheTranslation(trimmed, result)
    saveCache()
  }
  return result
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

  const translator = OPENAI_API_KEY
    ? `OpenAI (${OPENAI_MODEL})`
    : LOVABLE_API_KEY
      ? 'Lovable AI'
      : `${process.env.TRANSLATE_PROVIDER || 'lingva'} (free; cache: .translation-cache.json)`

  console.log('▶ Backfill English i18n')
  console.log(`  Translator: ${translator}`)
  console.log(`  Dry run:    ${DRY_RUN ? '✓ (no writes)' : '✗'}`)
  console.log(`  Force:      ${FORCE ? '✓' : '✗'}`)
  if (ONLY.length) console.log(`  Types:      ${types.join(', ')}`)
  if (
    !OPENAI_API_KEY &&
    LOVABLE_API_KEY &&
    !LOVABLE_API_KEY.startsWith('lv_') &&
    LOVABLE_API_KEY.startsWith('sk-')
  ) {
    console.warn(
      '\n  ⚠ LOVABLE_API_KEY looks like an OpenAI key (sk-...). ' +
        'Use OPENAI_API_KEY for OpenAI, or lv_... for Lovable gateway.\n'
    )
  }
  if (!USES_AI && !OFFLINE_ONLY && !DRY_RUN) {
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

  // Phase 2: pre-translate unique strings (deduped cache — critical for AI rate limits)
  console.log('\n⏳ Pre-translating unique strings (cached for resume)…')
  let done = 0
  let translated = 0
  for (const s of uniqueStrings) {
    const before = getCachedTranslation(s)
    try {
      const out = await translateText(s)
      done++
      if (out && !before) translated++
      if (done % 25 === 0) {
        console.log(`  … ${done}/${uniqueStrings.length} (${translated} new)`)
        saveCache()
      }
    } catch (e) {
      console.warn(`  ⚠ ${(e as Error).message}`)
      saveCache()
      done++
    }
  }
  saveCache()
  console.log(`  ✓ ${done} strings ready (${translated} newly translated)\n`)

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
