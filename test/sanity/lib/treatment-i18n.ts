import { getCachedTranslation, translateNoToEn } from './translate-free'

export function i18nString(no: string, en: string) {
  return [
    { _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: no },
    { _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en },
  ]
}

export function i18nText(no: string, en: string) {
  return [
    { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no },
    { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en },
  ]
}

/** Translate NO → EN using cache; optional chunking for long bodies. */
export async function translateField(no: string, translateEn: boolean): Promise<string> {
  const trimmed = no?.trim() ?? ''
  if (!trimmed || !translateEn) return trimmed

  const cached = getCachedTranslation(trimmed)
  if (cached) return cached

  if (trimmed.length > 3500) {
    const chunks = trimmed.split(/\n\n+/)
    const out: string[] = []
    for (const chunk of chunks) {
      if (!chunk.trim()) continue
      out.push(await translateNoToEn(chunk))
    }
    return out.join('\n\n')
  }

  return translateNoToEn(trimmed)
}

export async function i18nStringTranslated(no: string, translateEn: boolean) {
  const en = translateEn ? await translateField(no, true) : no
  return i18nString(no, en || no)
}

export async function i18nTextTranslated(no: string, translateEn: boolean) {
  const en = translateEn ? await translateField(no, true) : no
  return i18nText(no, en || no)
}
