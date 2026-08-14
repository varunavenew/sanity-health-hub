/**
 * Studio-only: heal internationalized-array rows after Duplicate/Add races.
 *
 * sanity-plugin-internationalized-array v5 stores language in `language` and
 * requires unique `_key`s. A mount race (historically from `defaultLanguages`)
 * can insert a second "no" row → field validation error → Publish disabled.
 *
 * This wrapper dedupes by language and ensures each row has `language` + unique `_key`.
 */
import {useEffect, useRef} from 'react'
import {type ObjectInputProps, set} from 'sanity'

function newKey(prefix: string): string {
  return `${prefix}${Math.random().toString(16).slice(2, 10)}`
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isI18nRow(item: unknown): item is Record<string, unknown> {
  if (!isPlainObject(item)) return false
  const type = item._type
  return typeof type === 'string' && type.startsWith('internationalizedArray')
}

function langOf(item: Record<string, unknown>): string {
  if (typeof item.language === 'string' && item.language) return item.language
  if (item._key === 'no' || item._key === 'en') return item._key
  return ''
}

/** Returns a healed clone when i18n arrays need repair; otherwise the same reference. */
export function healInternationalizedArrays(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(isI18nRow)) {
      // Only heal broken states that block Publish (duplicate / missing language).
      // Do not rewrite legacy `_key: "no"|"en"` alone — that would dirty every open.
      const byLang = new Map<string, Record<string, unknown>>()
      let needsHeal = false
      const usedKeys = new Set<string>()

      for (const row of value) {
        const lang = langOf(row)
        if (!lang) {
          needsHeal = true
          continue
        }
        if (!row.language) needsHeal = true
        if (byLang.has(lang)) {
          needsHeal = true
          continue
        }
        if (typeof row._key === 'string') {
          if (usedKeys.has(row._key)) needsHeal = true
          usedKeys.add(row._key)
        }
        byLang.set(lang, row)
      }

      if (value.length !== byLang.size) needsHeal = true

      if (!needsHeal) return value

      const healed: Record<string, unknown>[] = []
      const pushLang = (lang: string, prev: Record<string, unknown>) => {
        healed.push({
          ...prev,
          language: lang,
          _key: newKey(lang),
        })
      }

      for (const lang of ['no', 'en']) {
        const prev = byLang.get(lang)
        if (prev) pushLang(lang, prev)
      }
      for (const [lang, prev] of byLang) {
        if (lang === 'no' || lang === 'en') continue
        pushLang(lang, prev)
      }
      return healed
    }

    let arrayChanged = false
    const next = value.map((item) => {
      const healed = healInternationalizedArrays(item)
      if (healed !== item) arrayChanged = true
      return healed
    })
    return arrayChanged ? next : value
  }

  if (isPlainObject(value)) {
    let objectChanged = false
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value)) {
      const healed = healInternationalizedArrays(child)
      if (healed !== child) objectChanged = true
      next[key] = healed
    }
    return objectChanged ? next : value
  }

  return value
}

export function HealInternationalizedArrays(props: ObjectInputProps) {
  const {value, onChange, renderDefault} = props
  const healingRef = useRef(false)

  useEffect(() => {
    if (healingRef.current || value == null) return
    const healed = healInternationalizedArrays(value)
    if (healed === value) return
    healingRef.current = true
    onChange(set(healed))
    const t = window.setTimeout(() => {
      healingRef.current = false
    }, 0)
    return () => window.clearTimeout(t)
  }, [value, onChange])

  return renderDefault(props)
}
