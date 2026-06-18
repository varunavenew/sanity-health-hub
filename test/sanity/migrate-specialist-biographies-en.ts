/**
 * Add English (`en`) translations for specialist `bio` and `shortBio`
 * by translating existing Norwegian content in Sanity.
 *
 * Uses free translator + `.translation-cache.json` (resumable).
 * Optional: LOVABLE_API_KEY for higher quality.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-biographies-en:dry
 *   cd test && npm run migrate:specialist-biographies-en
 *   cd test && FORCE=1 npm run migrate:specialist-biographies-en
 */
import { sanityClient } from './config'
import { slugFromSpecialistDoc, specialistSlugProjection } from './lib/specialist-slug-groq'
import {
  cloneBlocksFresh,
  mergeI18nBioEn,
  mergeI18nTextEn,
  needsEnBioTranslation,
  needsEnTranslation,
  readI18nNoBlocks,
  readI18nNoText,
} from './lib/specialist-bio-i18n'
import { saveCache, translateNoToEn } from './lib/translate-free'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY

type SpecialistDoc = {
  _id: string
  name?: string
  slug?: string
  shortBio?: unknown
  bio?: unknown
}

async function lovableTranslate(text: string): Promise<string> {
  if (!LOVABLE_API_KEY || !text?.trim()) return ''
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
            'Translate Norwegian (Bokmål) medical website content to professional English. Return ONLY the translation. Keep CMedical, Livio Oslo unchanged.',
        },
        { role: 'user', content: text },
      ],
    }),
  })
  if (!res.ok) return ''
  const json = await res.json()
  return json?.choices?.[0]?.message?.content?.trim() || ''
}

async function translateText(text: string): Promise<string> {
  if (LOVABLE_API_KEY) return lovableTranslate(text)
  return translateNoToEn(text)
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
          const translated = await translateText(child.text)
          if (translated) child.text = translated
        }
      }
    }
  }
  return cloned
}

async function run() {
  const docs = await sanityClient.fetch<SpecialistDoc[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name, ${specialistSlugProjection}, shortBio, bio
    }`,
  )

  console.log(`▶ Migrate specialist biography EN (${docs.length} docs)`)
  console.log(`  Translator: ${LOVABLE_API_KEY ? 'Lovable AI' : 'lingva/mymemory (cached)'}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite EN: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0
  let missingNo = 0

  for (const doc of docs) {
    const noShort = readI18nNoText(doc.shortBio)
    const noBlocks = readI18nNoBlocks(doc.bio)
    if (!noShort && !noBlocks) {
      missingNo++
      continue
    }

    const patch: Record<string, unknown> = {}
    const shouldShort =
      noShort && (FORCE || needsEnTranslation(noShort, doc.shortBio))
    const shouldBio =
      noBlocks && (FORCE || needsEnBioTranslation(noBlocks, doc.bio))

    if (shouldShort && noShort) {
      const enShort = await translateText(noShort)
      if (enShort) patch.shortBio = mergeI18nTextEn(doc.shortBio, enShort)
    }

    if (shouldBio && noBlocks) {
      const enBlocks = await translateBlocks(noBlocks)
      if (enBlocks.length > 0) patch.bio = mergeI18nBioEn(doc.bio, enBlocks)
    }

    if (Object.keys(patch).length === 0) {
      skipped++
      continue
    }

    const label = doc.name ?? slugFromSpecialistDoc(doc)
    console.log(`  ✎ ${label} → ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    updated++
  }

  saveCache()

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped (EN already set): ${skipped}`)
  console.log(`⚠ No Norwegian bio: ${missingNo}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
