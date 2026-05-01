/**
 * Migration: Convert plain-string fields on `article` and `aboutPage`
 * documents into `internationalizedArray` shape, and (optionally) add
 * an English translation entry produced by the Lovable AI Gateway.
 *
 * Source shape examples (legacy):
 *   title:   "Velkommen"
 *   excerpt: "..."
 *   body:    [ {_type:'block', ...} , {_type:'image', ...} ]
 *
 * Target shape (after migration):
 *   title:   [{_key:'auto', language:'no', _type:'internationalizedArrayStringValue',      value:'Velkommen'},
 *             {_key:'auto', language:'en', _type:'internationalizedArrayStringValue',      value:'Welcome'}]
 *   excerpt: [{_key:'auto', language:'no', _type:'internationalizedArrayTextValue',        value:'...'},
 *             {_key:'auto', language:'en', _type:'internationalizedArrayTextValue',        value:'...'}]
 *   body:    [{_key:'auto', language:'no', _type:'internationalizedArrayBlockContentValue', value:[...blocks]},
 *             {_key:'auto', language:'en', _type:'internationalizedArrayBlockContentValue', value:[...blocks]}]
 *
 * Idempotent: skips fields that are already arrays of i18n entries.
 *
 * ENV:
 *   SANITY_TOKEN     – required, write access
 *   LOVABLE_API_KEY  – optional, enables EN auto-translation (falls back to
 *                      empty EN entry that editors fill in manually)
 *   TRANSLATE        – '1' to call AI; '0' (default) to seed EN as empty
 *   DRY_RUN          – '1' to log only, no writes
 */
import { sanityClient } from './config'

const TRANSLATE = process.env.TRANSLATE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY

type I18nValueType =
  | 'internationalizedArrayStringValue'
  | 'internationalizedArrayTextValue'
  | 'internationalizedArrayBlockContentValue'

const VALUE_TYPE_BY_FIELD: Record<string, I18nValueType> = {
  title: 'internationalizedArrayStringValue',
  subtitle: 'internationalizedArrayStringValue',
  alt: 'internationalizedArrayStringValue',
  excerpt: 'internationalizedArrayTextValue',
  body: 'internationalizedArrayBlockContentValue',
}

// ─── Helpers ─────────────────────────────────────────────────────────

function isAlreadyI18nArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    '_key' in (val[0] as any) &&
    'value' in (val[0] as any) &&
    (val[0] as any)._key?.length <= 5 // 'no' / 'en' — distinguishes from PT blocks
  )
}

function getEntryLanguage(entry: any): string | undefined {
  return entry?.language || entry?._key
}

function isPortableTextArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    (val[0] as any)._type !== undefined &&
    (val[0] as any)._key !== undefined &&
    (val[0] as any).value === undefined
  )
}

function makeI18nEntry(lang: 'no' | 'en', value: any, valueType: I18nValueType) {
  return { _type: valueType, language: lang, value }
}

// Strip _key from inner PT blocks so Sanity assigns fresh ones for EN copy
function cloneBlocksFresh(blocks: any[]): any[] {
  return JSON.parse(JSON.stringify(blocks)).map((b: any) => {
    delete b._key
    if (Array.isArray(b.children)) {
      b.children = b.children.map((c: any) => {
        delete c._key
        return c
      })
    }
    if (Array.isArray(b.markDefs)) {
      b.markDefs = b.markDefs.map((m: any) => {
        delete m._key
        return m
      })
    }
    return b
  })
}

// ─── AI translation (optional) ───────────────────────────────────────

async function translateString(text: string): Promise<string> {
  if (!TRANSLATE || !LOVABLE_API_KEY || !text?.trim()) return ''
  try {
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
              'You translate Norwegian (Bokmål) medical/clinical website content into natural, professional English. Return ONLY the translation, no quotes, no preamble. Preserve formatting characters like dashes, em-dashes, and punctuation. Keep brand names (CMedical, Livio Oslo) unchanged.',
          },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) {
      console.warn(`  ⚠ AI translate failed (${res.status}) — leaving EN empty`)
      return ''
    }
    const json = await res.json()
    return json?.choices?.[0]?.message?.content?.trim() || ''
  } catch (e) {
    console.warn('  ⚠ AI translate error:', (e as Error).message)
    return ''
  }
}

async function translateBlocks(blocks: any[]): Promise<any[]> {
  if (!TRANSLATE || !LOVABLE_API_KEY) return cloneBlocksFresh(blocks)
  const cloned = cloneBlocksFresh(blocks)
  // Translate each block's text spans in place
  for (const block of cloned) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim()) {
          // Skip pure whitespace / single chars
          if (child.text.trim().length < 2) continue
          const translated = await translateString(child.text)
          if (translated) child.text = translated
        }
      }
    }
  }
  return cloned
}

// ─── Field migration ─────────────────────────────────────────────────

async function migrateField(
  fieldName: string,
  currentValue: any
): Promise<{ changed: boolean; value: any }> {
  if (currentValue === undefined || currentValue === null) {
    return { changed: false, value: currentValue }
  }
  const valueType = VALUE_TYPE_BY_FIELD[fieldName]
  if (!valueType) return { changed: false, value: currentValue }

  // Already migrated?
  if (isAlreadyI18nArray(currentValue)) {
    // Backfill EN if missing and translation is enabled
    const normalizedValue = currentValue.map((entry: any) => {
      const language = getEntryLanguage(entry)
      return language ? { ...entry, language } : entry
    })
    const changedFormat = JSON.stringify(normalizedValue) !== JSON.stringify(currentValue)
    const hasEn = normalizedValue.some((e: any) => getEntryLanguage(e) === 'en')
    const noEntry = normalizedValue.find((e: any) => getEntryLanguage(e) === 'no')
    if (hasEn || !noEntry || !TRANSLATE) {
      return changedFormat
        ? { changed: true, value: normalizedValue }
        : { changed: false, value: currentValue }
    }

    let enValue: any = ''
    if (valueType === 'internationalizedArrayBlockContentValue' && Array.isArray(noEntry.value)) {
      enValue = await translateBlocks(noEntry.value)
    } else if (typeof noEntry.value === 'string') {
      enValue = await translateString(noEntry.value)
    }
    if (!enValue) return { changed: false, value: currentValue }
    return {
      changed: true,
      value: [...normalizedValue, makeI18nEntry('en', enValue, valueType)],
    }
  }

  // Plain-string / plain-PT-array → wrap as NO entry, optionally add EN
  let noValue = currentValue
  // For body (block content) ensure it's the PT array as-is
  if (valueType === 'internationalizedArrayBlockContentValue' && !isPortableTextArray(noValue)) {
    return { changed: false, value: currentValue }
  }

  let enValue: any = ''
  if (TRANSLATE) {
    if (valueType === 'internationalizedArrayBlockContentValue') {
      enValue = await translateBlocks(noValue)
    } else if (typeof noValue === 'string') {
      enValue = await translateString(noValue)
    }
  }

  const entries: any[] = [makeI18nEntry('no', noValue, valueType)]
  if (enValue) entries.push(makeI18nEntry('en', enValue, valueType))
  return { changed: true, value: entries }
}

// ─── Document migration ──────────────────────────────────────────────

async function migrateArticle(doc: any) {
  const patches: Record<string, any> = {}
  for (const field of ['title', 'excerpt', 'body'] as const) {
    const r = await migrateField(field, doc[field])
    if (r.changed) patches[field] = r.value
  }
  // primaryImage.alt is nested
  if (doc.primaryImage?.alt !== undefined) {
    const r = await migrateField('alt', doc.primaryImage.alt)
    if (r.changed) {
      patches['primaryImage'] = { ...doc.primaryImage, alt: r.value }
    }
  }
  return patches
}

async function migrateAbout(doc: any) {
  const patches: Record<string, any> = {}
  for (const field of ['title', 'subtitle', 'body'] as const) {
    const r = await migrateField(field, doc[field])
    if (r.changed) patches[field] = r.value
  }
  return patches
}

// ─── Main ────────────────────────────────────────────────────────────

async function run() {
  console.log(`▶ Sanity i18n migration`)
  console.log(`  Translate EN: ${TRANSLATE ? '✓ via Lovable AI' : '✗ (EN left empty)'}`)
  console.log(`  Dry run:      ${DRY_RUN ? '✓' : '✗'}`)
  console.log()

  // Articles
  const articles = await sanityClient.fetch<any[]>(
    `*[_type == "article"]{_id, _rev, title, excerpt, body, primaryImage}`
  )
  console.log(`📰 Found ${articles.length} article(s)`)
  for (const doc of articles) {
    const patches = await migrateArticle(doc)
    const fields = Object.keys(patches)
    if (fields.length === 0) {
      console.log(`  · ${doc._id} — already up to date`)
      continue
    }
    console.log(`  ✎ ${doc._id} — patching: ${fields.join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patches).commit({ autoGenerateArrayKeys: true })
    }
  }

  // About pages
  const abouts = await sanityClient.fetch<any[]>(
    `*[_type == "aboutPage"]{_id, _rev, title, subtitle, body}`
  )
  console.log(`\nℹ Found ${abouts.length} aboutPage document(s)`)
  for (const doc of abouts) {
    const patches = await migrateAbout(doc)
    const fields = Object.keys(patches)
    if (fields.length === 0) {
      console.log(`  · ${doc._id} — already up to date`)
      continue
    }
    console.log(`  ✎ ${doc._id} — patching: ${fields.join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patches).commit({ autoGenerateArrayKeys: true })
    }
  }

  console.log(`\n✓ Done`)
}

run().catch((e) => {
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
