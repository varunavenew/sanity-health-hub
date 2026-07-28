/**
 * Shared Studio document input: auto-fill localized URL slug (NO/EN) while typing
 * when empty or still matching the last auto value. Manual edits lock.
 *
 * Source (same behaviour for both):
 * - `title` internationalizedArray (Treatment / Treatment Category), or
 * - `name` plain string (Specialist) — same source for NO and EN
 */
import {useLayoutEffect, useRef} from 'react'
import {ObjectInputProps, PatchEvent, set} from 'sanity'
import {pickForLang, slugifyForUrl} from '../../schemaTypes/i18n'

type Lang = 'no' | 'en'

type SlugEntry = {
  _type?: string
  _key?: string
  language?: string
  value?: {_type?: string; current?: string} | string
}

function readSlugCurrent(slugField: unknown, lang: Lang): string {
  if (!Array.isArray(slugField)) return ''
  const entry = (slugField as SlugEntry[]).find(
    (x) => (x.language || x._key) === lang,
  )
  if (!entry) return ''
  const v = entry.value
  if (v && typeof v === 'object' && 'current' in v) {
    return typeof v.current === 'string' ? v.current.trim() : ''
  }
  if (typeof v === 'string') return v.trim()
  return ''
}

function sourceTitleForLang(
  doc: {title?: unknown; name?: unknown},
  lang: Lang,
): string {
  const fromTitle = pickForLang(doc.title, lang)?.trim()
  if (fromTitle) return fromTitle
  if (typeof doc.name === 'string') return doc.name.trim()
  return ''
}

function mergeSlugFills(
  existing: unknown,
  fills: Partial<Record<Lang, string>>,
): SlugEntry[] {
  const prev = Array.isArray(existing) ? ([...existing] as SlugEntry[]) : []
  const byLang = new Map<string, SlugEntry>()

  for (const entry of prev) {
    const lang = entry.language || entry._key
    if (lang) byLang.set(lang, entry)
  }

  for (const lang of ['no', 'en'] as const) {
    const fill = fills[lang]
    if (!fill) continue
    const existingEntry = byLang.get(lang)
    byLang.set(lang, {
      _type: 'internationalizedArraySlugValue',
      _key: existingEntry?._key || lang,
      language: lang,
      value: {
        _type: 'slug',
        current: fill,
      },
    })
  }

  const others = prev.filter((e) => {
    const lang = e.language || e._key
    return Boolean(lang && lang !== 'no' && lang !== 'en')
  })

  const ordered: SlugEntry[] = []
  for (const lang of ['no', 'en'] as const) {
    const entry = byLang.get(lang)
    if (entry) ordered.push(entry)
  }
  return [...ordered, ...others]
}

function shouldAutoFill(current: string, expected: string, lastAuto: string): boolean {
  if (!expected) return false
  if (!current) return true
  if (lastAuto && current === lastAuto) return true
  if (
    !lastAuto &&
    current.length <= 2 &&
    expected.startsWith(current) &&
    current !== expected
  ) {
    return true
  }
  return false
}

export function AutoSlugFromTitleInput(props: ObjectInputProps) {
  const {value, onChange, renderDefault} = props
  const lastAutoRef = useRef<Partial<Record<Lang, string>>>({})
  const manualLockRef = useRef<Partial<Record<Lang, boolean>>>({})

  useLayoutEffect(() => {
    const doc = (value || {}) as {
      title?: unknown
      name?: unknown
      slug?: unknown
    }

    const fills: Partial<Record<Lang, string>> = {}

    for (const lang of ['no', 'en'] as const) {
      const title = sourceTitleForLang(doc, lang)
      const expected = title ? slugifyForUrl(title) : ''
      const current = readSlugCurrent(doc.slug, lang)
      const lastAuto = lastAutoRef.current[lang] || ''

      if (!current && manualLockRef.current[lang]) {
        manualLockRef.current[lang] = false
        lastAutoRef.current[lang] = undefined
      }

      if (
        current &&
        lastAuto &&
        current !== lastAuto &&
        current !== expected
      ) {
        manualLockRef.current[lang] = true
      }

      if (current && !lastAuto && expected && current !== expected) {
        if (!(current.length <= 2 && expected.startsWith(current))) {
          manualLockRef.current[lang] = true
        }
      }

      if (manualLockRef.current[lang]) continue
      if (!expected) continue

      if (current === expected) {
        lastAutoRef.current[lang] = expected
        continue
      }

      if (!shouldAutoFill(current, expected, lastAuto)) continue

      fills[lang] = expected
      lastAutoRef.current[lang] = expected
    }

    if ((Object.keys(fills) as Lang[]).length === 0) return

    const nextSlug = mergeSlugFills(doc.slug, fills)
    onChange(PatchEvent.from(set(nextSlug, ['slug'])))
  }, [value, onChange])

  return renderDefault(props)
}
