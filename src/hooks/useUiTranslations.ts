import { useEffect } from 'react'
import i18n from '@/i18n/config'
import { sanityClient } from '@/lib/sanityClient'

type Entry = { key: string; nb?: string; en?: string }

function unflatten(entries: Entry[], lang: 'nb' | 'en') {
  const out: Record<string, unknown> = {}
  for (const e of entries) {
    const value = e[lang]
    if (!value) continue
    const parts = e.key.split('.')
    let cur: Record<string, unknown> = out
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i]
      if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {}
      cur = cur[k] as Record<string, unknown>
    }
    cur[parts[parts.length - 1]] = value
  }
  return out
}

/**
 * Fetches UI translations from Sanity once on mount and overrides
 * i18next's resource bundles. Falls back silently to the JSON files
 * shipped in src/i18n/locales/ if Sanity is unavailable.
 */
export function useUiTranslations() {
  useEffect(() => {
    let cancelled = false
    sanityClient
      .fetch<{ entries?: Entry[] } | null>(
        `*[_id == "uiTranslations"][0]{ entries }`,
      )
      .then((doc) => {
        if (cancelled || !doc?.entries?.length) return
        const nb = unflatten(doc.entries, 'nb')
        const en = unflatten(doc.entries, 'en')
        i18n.addResourceBundle('nb', 'translation', nb, true, true)
        i18n.addResourceBundle('en', 'translation', en, true, true)
      })
      .catch(() => {
        /* keep JSON fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])
}
