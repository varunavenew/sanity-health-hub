import {useState, useCallback} from 'react'
import {useClient, type DocumentActionComponent, type DocumentActionProps} from 'sanity'
import {useToast} from '@sanity/ui'

// Edge function endpoint. Override with VITE_TRANSLATE_ENDPOINT in .env.local for dev.
const DEFAULT_ENDPOINT =
  'https://vbyoklneqswaevypvbji.supabase.co/functions/v1/translate-content'

const ENDPOINT =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env?.VITE_TRANSLATE_ENDPOINT) ||
  DEFAULT_ENDPOINT

const I18N_VALUE_TYPES = new Set([
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArrayBlockContentValue',
])

interface I18nItem {
  _type: string
  _key?: string
  language?: string
  value?: any
}

interface Job {
  path: (string | number)[]
  noValue: any
  ptBlocks?: boolean
}

// Recursively walk doc, find internationalizedArray fields, return:
//  - jobs: each NO item that needs an EN counterpart created/updated
//  - missing-only: skip if EN already has non-empty value
function collectJobs(node: any, path: (string | number)[], jobs: Job[]) {
  if (node == null) return
  if (Array.isArray(node)) {
    // Detect internationalizedArray field: array of items with i18n value type
    const isI18nArray =
      node.length > 0 &&
      typeof node[0] === 'object' &&
      node[0] !== null &&
      I18N_VALUE_TYPES.has(node[0]._type)

    if (isI18nArray) {
      const items = node as I18nItem[]
      const noItem = items.find((i) => (i.language ?? i._key) === 'no')
      const enItem = items.find((i) => (i.language ?? i._key) === 'en')
      if (noItem && noItem.value != null) {
        const enHasValue =
          enItem &&
          enItem.value != null &&
          (typeof enItem.value === 'string' ? enItem.value.trim().length > 0 : true)
        if (!enHasValue) {
          const isPT =
            noItem._type === 'internationalizedArrayBlockContentValue' &&
            Array.isArray(noItem.value)
          jobs.push({path, noValue: noItem.value, ptBlocks: isPT})
        }
      }
      return
    }

    node.forEach((child, idx) => collectJobs(child, [...path, idx], jobs))
    return
  }
  if (typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key.startsWith('_')) continue
      collectJobs(node[key], [...path, key], jobs)
    }
  }
}

function extractStringsFromBlocks(blocks: any[]): {strings: string[]; refs: {b: number; c: number}[]} {
  const strings: string[] = []
  const refs: {b: number; c: number}[] = []
  blocks.forEach((block, b) => {
    if (block?._type === 'block' && Array.isArray(block.children)) {
      block.children.forEach((child: any, c: number) => {
        if (child?._type === 'span' && typeof child.text === 'string' && child.text.trim()) {
          strings.push(child.text)
          refs.push({b, c})
        }
      })
    }
  })
  return {strings, refs}
}

function rebuildBlocksWithTranslations(
  originalBlocks: any[],
  refs: {b: number; c: number}[],
  translations: string[]
): any[] {
  // Deep clone & strip _key so Sanity assigns fresh ones
  const cloned = JSON.parse(JSON.stringify(originalBlocks)).map((b: any) => {
    delete b._key
    if (Array.isArray(b.children)) b.children = b.children.map((c: any) => ({...c, _key: undefined}))
    if (Array.isArray(b.markDefs)) b.markDefs = b.markDefs.map((m: any) => ({...m, _key: m._key}))
    return b
  })
  refs.forEach((ref, i) => {
    const t = translations[i]
    if (t && cloned[ref.b]?.children?.[ref.c]) {
      cloned[ref.b].children[ref.c].text = t
    }
  })
  return cloned
}

const TranslateToEnglishAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {published, draft, id, type, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const toast = useToast()
  const [running, setRunning] = useState(false)

  const handle = useCallback(async () => {
    setRunning(true)
    const doc = draft || published
    if (!doc) {
      toast.push({status: 'warning', title: 'No content to translate'})
      setRunning(false)
      onComplete()
      return
    }

    const jobs: Job[] = []
    collectJobs(doc, [], jobs)

    if (jobs.length === 0) {
      toast.push({status: 'info', title: 'Nothing to translate', description: 'All English fields already have values.'})
      setRunning(false)
      onComplete()
      return
    }

    // Build flat string list to translate
    const flat: string[] = []
    jobs.forEach((job) => {
      if (job.ptBlocks) {
        const {strings, refs} = extractStringsFromBlocks(job.noValue)
        ;(job as any)._refs = refs
        strings.forEach((s) => flat.push(s))
      } else if (typeof job.noValue === 'string') {
        flat.push(job.noValue)
      }
    })

    if (flat.length === 0) {
      toast.push({status: 'info', title: 'Nothing translatable found'})
      setRunning(false)
      onComplete()
      return
    }

    toast.push({
      status: 'info',
      title: `Translating ${jobs.length} field(s)…`,
      description: `${flat.length} text segment(s) via Lovable AI`,
    })

    let translations: string[]
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({texts: flat}),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errText}`)
      }
      const data = await res.json()
      translations = data.translations
    } catch (e) {
      toast.push({
        status: 'error',
        title: 'Translation failed',
        description: e instanceof Error ? e.message : String(e),
      })
      setRunning(false)
      onComplete()
      return
    }

    // Apply patches: for each job, set the EN slot of the target i18n array
    const docId = draft ? id : id // Sanity client.patch handles drafts via draftId
    const draftId = id.startsWith('drafts.') ? id : `drafts.${id}`

    let tx = client.transaction()
    let translationCursor = 0

    for (const job of jobs) {
      const arrayPath = job.path // path to the i18n array itself
      let enValue: any
      if (job.ptBlocks) {
        const refs = (job as any)._refs as {b: number; c: number}[]
        const segCount = refs.length
        const slice = translations.slice(translationCursor, translationCursor + segCount)
        translationCursor += segCount
        enValue = rebuildBlocksWithTranslations(job.noValue, refs, slice)
      } else {
        enValue = translations[translationCursor++] || ''
      }
      if (enValue === '' || enValue == null) continue

      // Determine the value _type from existing NO item type by looking it up
      // We need it to push a properly typed value. Re-fetch from doc:
      const arr = arrayPath.reduce((acc: any, p) => acc?.[p], doc) as I18nItem[]
      const noItem = arr.find((i) => (i.language ?? i._key) === 'no')
      const enItem = arr.find((i) => (i.language ?? i._key) === 'en')
      const valueType = noItem?._type || 'internationalizedArrayStringValue'

      const pathStr = arrayPath
        .map((p) => (typeof p === 'number' ? `[${p}]` : `.${p}`))
        .join('')
        .replace(/^\./, '')

      if (enItem) {
        // Update existing EN item value
        const enIdx = arr.findIndex((i) => (i.language ?? i._key) === 'en')
        tx = tx.patch(draftId, (p) => p.set({[`${pathStr}[${enIdx}].value`]: enValue}))
      } else {
        // Append new EN item
        const newItem: I18nItem = {
          _type: valueType,
          _key: 'en',
          language: 'en',
          value: enValue,
        }
        tx = tx.patch(draftId, (p) =>
          p.setIfMissing({[pathStr]: []}).insert('after', `${pathStr}[-1]`, [newItem])
        )
      }
    }

    try {
      // Make sure a draft exists first
      const existingDraft = await client.getDocument(draftId).catch(() => null)
      if (!existingDraft && published) {
        await client.create({...published, _id: draftId})
      }
      await tx.commit()
      toast.push({
        status: 'success',
        title: 'Translation complete',
        description: `Updated ${jobs.length} field(s). Review and publish.`,
      })
    } catch (e) {
      toast.push({
        status: 'error',
        title: 'Failed to apply translations',
        description: e instanceof Error ? e.message : String(e),
      })
    } finally {
      setRunning(false)
      onComplete()
    }
  }, [client, draft, published, id, type, toast, onComplete])

  return {
    label: running ? 'Translating…' : 'Translate to English',
    onHandle: handle,
    disabled: running,
    tone: 'primary',
    icon: () => <span style={{fontSize: 14}}>🌐</span>,
  }
}

export default TranslateToEnglishAction
