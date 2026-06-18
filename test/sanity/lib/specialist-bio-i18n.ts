import { randomBytes } from 'node:crypto'

function blockKey(): string {
  return randomBytes(4).toString('hex')
}

type I18nItem = {
  _type?: string
  _key?: string
  language?: string
  value?: unknown
}

function langOf(item: I18nItem): string | undefined {
  return item.language || item._key
}

export function parseBioParagraphs(bio: string): string[] {
  return bio
    .split(/\n\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

export function bioToPortableText(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block' as const,
    _key: blockKey(),
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: blockKey(),
        text,
        marks: [] as string[],
      },
    ],
  }))
}

function i18nTextEntry(lang: 'no' | 'en', value: string) {
  return {
    _type: 'internationalizedArrayTextValue' as const,
    _key: lang,
    language: lang,
    value,
  }
}

function i18nBioEntry(lang: 'no' | 'en', paragraphs: string[]) {
  return {
    _type: 'internationalizedArrayBlockContentValue' as const,
    _key: lang,
    language: lang,
    value: bioToPortableText(paragraphs),
  }
}

export function i18nBioNo(bio: string) {
  const paragraphs = parseBioParagraphs(bio)
  if (paragraphs.length === 0) return undefined
  return [i18nBioEntry('no', paragraphs)]
}

export function i18nShortBioNo(bio: string) {
  const paragraphs = parseBioParagraphs(bio)
  const short = paragraphs[0] ?? bio.trim()
  if (!short) return undefined
  return [i18nTextEntry('no', short)]
}

export function readI18nNoText(field: unknown): string | undefined {
  if (!Array.isArray(field)) return undefined
  const entry = (field as I18nItem[]).find((item) => langOf(item) === 'no')
  return typeof entry?.value === 'string' && entry.value.trim() ? entry.value.trim() : undefined
}

export function readI18nNoBlocks(field: unknown): unknown[] | undefined {
  if (!Array.isArray(field)) return undefined
  const entry = (field as I18nItem[]).find((item) => langOf(item) === 'no')
  return Array.isArray(entry?.value) && entry.value.length > 0 ? entry.value : undefined
}

export function readI18nEnText(field: unknown): string | undefined {
  if (!Array.isArray(field)) return undefined
  const entry = (field as I18nItem[]).find((item) => langOf(item) === 'en')
  return typeof entry?.value === 'string' && entry.value.trim() ? entry.value.trim() : undefined
}

export function readI18nEnBlocks(field: unknown): unknown[] | undefined {
  if (!Array.isArray(field)) return undefined
  const entry = (field as I18nItem[]).find((item) => langOf(item) === 'en')
  return Array.isArray(entry?.value) && entry.value.length > 0 ? entry.value : undefined
}

export function hasI18nEn(field: unknown): boolean {
  if (!Array.isArray(field)) return false
  const entry = (field as I18nItem[]).find((item) => langOf(item) === 'en')
  if (!entry?.value) return false
  if (typeof entry.value === 'string') return entry.value.trim().length > 0
  if (Array.isArray(entry.value)) return entry.value.length > 0
  return false
}

function blockSpanTexts(blocks: unknown[]): string[] {
  const texts: string[] = []
  for (const block of blocks) {
    const b = block as Record<string, unknown>
    if (b._type !== 'block' || !Array.isArray(b.children)) continue
    for (const child of b.children as Record<string, unknown>[]) {
      if (child._type === 'span' && typeof child.text === 'string' && child.text.trim()) {
        texts.push(child.text.trim())
      }
    }
  }
  return texts
}

/** True when EN is missing or still matches Norwegian (partial rate-limit saves). */
export function needsEnTranslation(noValue: string | undefined, field: unknown): boolean {
  if (!noValue) return false
  const enText = readI18nEnText(field)
  if (!enText) return true
  return enText === noValue
}

export function needsEnBioTranslation(
  noBlocks: unknown[] | undefined,
  field: unknown,
): boolean {
  if (!noBlocks) return false
  const enBlocks = readI18nEnBlocks(field)
  if (!enBlocks) return true
  const noTexts = blockSpanTexts(noBlocks)
  const enTexts = blockSpanTexts(enBlocks)
  if (enTexts.length < noTexts.length) return true
  for (let i = 0; i < noTexts.length; i++) {
    if (enTexts[i] === noTexts[i]) return true
  }
  return false
}

export function mergeI18nTextEn(existing: unknown, enValue: string): unknown[] {
  const items = Array.isArray(existing) ? [...(existing as I18nItem[])] : []
  const enIdx = items.findIndex((item) => langOf(item) === 'en')
  const enEntry = i18nTextEntry('en', enValue)
  if (enIdx >= 0) items[enIdx] = { ...items[enIdx], ...enEntry }
  else items.push(enEntry)
  return items
}

export function mergeI18nBioEn(existing: unknown, enBlocks: unknown[]): unknown[] {
  const items = Array.isArray(existing) ? [...(existing as I18nItem[])] : []
  const enIdx = items.findIndex((item) => langOf(item) === 'en')
  const enEntry = {
    _type: 'internationalizedArrayBlockContentValue' as const,
    _key: 'en',
    language: 'en',
    value: enBlocks,
  }
  if (enIdx >= 0) items[enIdx] = { ...items[enIdx], ...enEntry }
  else items.push(enEntry)
  return items
}

export function cloneBlocksFresh(blocks: unknown[]): unknown[] {
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
