/**
 * Write English i18n fields to Sanity using ONLY `.translation-cache.json`
 * (no translation API calls). Run after a partial backfill or when APIs are down.
 *
 *   npx tsx sanity/apply-english-from-cache.ts
 *   ONLY=homepage,article npx tsx sanity/apply-english-from-cache.ts
 */
import { sanityClient } from './config'
import { getCachedTranslation, saveCache } from './lib/translate-free'

// Reuse job collection from backfill (inline minimal copy)
const I18N_VALUE_TYPES = new Set([
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArrayBlockContentValue',
])

const DOCUMENT_TYPES = [
  'article', 'aboutPage', 'treatment', 'treatmentCategory', 'homepage',
  'contactPage', 'clinicPage', 'servicesPage', 'insurancePage', 'themePage',
  'pricingPage', 'specialistsPage', 'specialist', 'privacyPolicyPage',
]

const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean)

interface Job {
  path: (string | number)[]
  valueType: string
  noValue: unknown
  ptBlocks: boolean
}

function getLang(item: { language?: string; _key?: string }) {
  return item.language || item._key
}

function enHasValue(enItem: { value?: unknown } | undefined) {
  if (!enItem || enItem.value == null) return false
  if (typeof enItem.value === 'string') return enItem.value.trim().length > 0
  if (Array.isArray(enItem.value)) return enItem.value.length > 0
  return true
}

function collectJobs(node: unknown, path: (string | number)[], jobs: Job[]) {
  if (node == null) return
  if (Array.isArray(node)) {
    const isI18n =
      node.length > 0 &&
      typeof node[0] === 'object' &&
      node[0] !== null &&
      I18N_VALUE_TYPES.has((node[0] as { _type: string })._type)
    if (isI18n) {
      const items = node as { language?: string; _key?: string; value?: unknown; _type: string }[]
      const noItem = items.find((i) => getLang(i) === 'no')
      const enItem = items.find((i) => getLang(i) === 'en')
      if (noItem && noItem.value != null && !enHasValue(enItem)) {
        jobs.push({
          path,
          valueType: noItem._type,
          noValue: noItem.value,
          ptBlocks:
            noItem._type === 'internationalizedArrayBlockContentValue' &&
            Array.isArray(noItem.value),
        })
      }
      return
    }
    node.forEach((c, i) => collectJobs(c, [...path, i], jobs))
    return
  }
  if (typeof node === 'object') {
    for (const k of Object.keys(node as object)) {
      if (!k.startsWith('_')) collectJobs((node as Record<string, unknown>)[k], [...path, k], jobs)
    }
  }
}

function cloneBlocks(blocks: unknown[]): unknown[] {
  return JSON.parse(JSON.stringify(blocks)).map((b: Record<string, unknown>) => {
    delete b._key
    if (Array.isArray(b.children)) {
      b.children = (b.children as Record<string, unknown>[]).map((c) => {
        delete c._key
        return c
      })
    }
    return b
  })
}

function translateBlocksFromCache(blocks: unknown[]): unknown[] | null {
  const cloned = cloneBlocks(blocks)
  let any = false
  for (const block of cloned) {
    const b = block as Record<string, unknown>
    if (b._type === 'block' && Array.isArray(b.children)) {
      for (const child of b.children as Record<string, unknown>[]) {
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim().length >= 2) {
          const t = getCachedTranslation(child.text)
          if (t) {
            child.text = t
            any = true
          }
        }
      }
    }
  }
  return any ? cloned : null
}

function setAtPath(root: Record<string, unknown>, path: (string | number)[], value: unknown) {
  let cur: unknown = root
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    cur = (cur as Record<string, unknown> | unknown[])[key as keyof typeof cur]
  }
  const last = path[path.length - 1]
  if (typeof last === 'number' && Array.isArray(cur)) cur[last] = value
  else if (typeof last === 'string' && cur && typeof cur === 'object') {
    ;(cur as Record<string, unknown>)[last] = value
  }
}

async function run() {
  const types = ONLY.length ? DOCUMENT_TYPES.filter((t) => ONLY.includes(t)) : DOCUMENT_TYPES
  console.log('▶ Apply English from cache only (no API calls)\n')

  let docsPatched = 0
  let fieldsPatched = 0
  let fieldsSkipped = 0

  for (const docType of types) {
    const docs = await sanityClient.fetch<Record<string, unknown>[]>(`*[_type == "${docType}"]`)
    for (const doc of docs) {
      const jobs: Job[] = []
      collectJobs(doc, [], jobs)
      if (jobs.length === 0) continue

      const next = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>
      let applied = 0

      for (const job of jobs) {
        let enValue: unknown
        if (job.ptBlocks && Array.isArray(job.noValue)) {
          enValue = translateBlocksFromCache(job.noValue)
        } else if (typeof job.noValue === 'string') {
          enValue = getCachedTranslation(job.noValue) || ''
        }
        if (!enValue || (typeof enValue === 'string' && !enValue.trim())) {
          fieldsSkipped++
          continue
        }

        const arr = job.path.reduce<unknown>((acc, p) => {
          if (acc == null) return undefined
          return (acc as Record<string, unknown> | unknown[])[p as keyof typeof acc]
        }, next) as { language?: string; _key?: string; value?: unknown; _type: string }[]

        if (!Array.isArray(arr)) continue

        const newArr = [...arr]
        const enIdx = newArr.findIndex((i) => getLang(i) === 'en')
        if (enIdx >= 0) newArr[enIdx] = { ...newArr[enIdx], value: enValue }
        else newArr.push({ _type: job.valueType, language: 'en', value: enValue })

        setAtPath(next, job.path, newArr)
        applied++
      }

      if (applied === 0) continue

      const patches: Record<string, unknown> = {}
      for (const key of Object.keys(next)) {
        if (key.startsWith('_')) continue
        if (JSON.stringify(doc[key]) !== JSON.stringify(next[key])) patches[key] = next[key]
      }

      await sanityClient
        .patch(String(doc._id))
        .set(patches)
        .commit({ autoGenerateArrayKeys: true })
      console.log(`  ✎ ${doc._id} — ${applied} field(s) from cache`)
      docsPatched++
      fieldsPatched += applied
    }
  }

  saveCache()
  console.log(
    `\n✓ Applied ${fieldsPatched} field(s) on ${docsPatched} document(s); ${fieldsSkipped} field(s) still missing in cache`
  )
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
