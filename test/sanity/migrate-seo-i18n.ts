/**
 * Migration: Convert existing `seo.metaTitle` / `seo.metaDescription` plain
 * strings into `internationalizedArray` entries (seeded as Norwegian).
 *
 * Editors can then add the English translation in Studio. Optionally
 * auto-translate by setting TRANSLATE=1 (requires LOVABLE_API_KEY).
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-seo-i18n.ts
 *   DRY_RUN=1 npx ts-node --esm test/sanity/migrate-seo-i18n.ts
 *   TRANSLATE=1 LOVABLE_API_KEY=... npx ts-node --esm test/sanity/migrate-seo-i18n.ts
 */
import { sanityClient } from './config'

const TRANSLATE = process.env.TRANSLATE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY

const TYPES_WITH_SEO = [
  'homepage',
  'aboutPage',
  'contactPage',
  'pricingPage',
  'insurancePage',
  'servicesPage',
  'clinicPage',
  'treatmentCategory',
  'treatment',
  'themePage',
  'specialist',
  'specialistsPage',
  'privacyPolicyPage',
]

type ValueType =
  | 'internationalizedArrayStringValue'
  | 'internationalizedArrayTextValue'

const FIELD_VALUE_TYPE: Record<'metaTitle' | 'metaDescription', ValueType> = {
  metaTitle: 'internationalizedArrayStringValue',
  metaDescription: 'internationalizedArrayTextValue',
}

function isAlreadyI18n(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    'value' in (val[0] as any) &&
    typeof (val[0] as any)._type === 'string' &&
    (val[0] as any)._type.startsWith('internationalizedArray')
  )
}

async function translate(text: string): Promise<string> {
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
              'Translate Norwegian (Bokmål) SEO meta text into natural, professional English. Return ONLY the translation, no quotes or preamble. Keep brand names (CMedical) unchanged.',
          },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) return ''
    const json = await res.json()
    return json?.choices?.[0]?.message?.content?.trim() || ''
  } catch {
    return ''
  }
}

async function migrateField(
  field: 'metaTitle' | 'metaDescription',
  current: any
): Promise<{ changed: boolean; value: any }> {
  if (current == null) return { changed: false, value: current }
  if (isAlreadyI18n(current)) return { changed: false, value: current }
  if (typeof current !== 'string') return { changed: false, value: current }

  const valueType = FIELD_VALUE_TYPE[field]
  const entries: any[] = [{ _type: valueType, language: 'no', value: current }]
  if (TRANSLATE) {
    const en = await translate(current)
    if (en) entries.push({ _type: valueType, language: 'en', value: en })
  }
  return { changed: true, value: entries }
}

async function run() {
  console.log('▶ SEO i18n migration')
  console.log(`  Translate EN: ${TRANSLATE ? '✓' : '✗ (NO only — editors fill EN)'}`)
  console.log(`  Dry run:      ${DRY_RUN ? '✓' : '✗'}\n`)

  const filter = TYPES_WITH_SEO.map((t) => `_type == "${t}"`).join(' || ')
  const docs = await sanityClient.fetch<any[]>(
    `*[(${filter}) && defined(seo)]{_id, _type, seo}`
  )
  console.log(`Found ${docs.length} document(s) with seo\n`)

  for (const doc of docs) {
    const patches: Record<string, any> = {}
    const next = { ...doc.seo }
    let changed = false

    for (const field of ['metaTitle', 'metaDescription'] as const) {
      const r = await migrateField(field, doc.seo?.[field])
      if (r.changed) {
        next[field] = r.value
        changed = true
      }
    }

    if (!changed) {
      console.log(`  · ${doc._type}/${doc._id} — already up to date`)
      continue
    }
    patches.seo = next
    console.log(`  ✎ ${doc._type}/${doc._id} — patching seo`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set(patches)
        .commit({ autoGenerateArrayKeys: true })
    }
  }

  console.log('\n✓ Done')
}

run().catch((e) => {
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
