/**
 * Universal EN translation script for all Sanity document types.
 *
 * Strategy: Non-breaking — adds parallel `<field>_en` fields next to existing
 * Norwegian text fields. Frontend can read `field_en || field` based on locale.
 * (For `article` + `aboutPage`, fields already use `internationalizedArray`
 *  and are handled by `migrate-i18n-fields.ts` instead — those types are
 *  skipped here.)
 *
 * Covered document types:
 *   - treatment, treatmentCategory
 *   - specialist, specialistsPage
 *   - faq
 *   - themePage
 *   - homepage
 *   - servicesPage, insurancePage, pricingPage, contactPage, clinicPage
 *   - jobListing
 *   - product
 *   - testimonial
 *   - privacyPolicyPage
 *
 * Idempotent: skips documents where the `<field>_en` is already present
 * and non-empty (unless FORCE=1).
 *
 * ENV:
 *   SANITY_TOKEN     – required (write access)
 *   LOVABLE_API_KEY  – required (Lovable AI Gateway key)
 *   DRY_RUN=1        – preview without writing
 *   FORCE=1          – overwrite existing _en values
 *   ONLY=type1,type2 – limit to specific document types
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY
const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean)

if (!LOVABLE_API_KEY) {
  console.error('✗ LOVABLE_API_KEY is required')
  process.exit(1)
}

// ─── Translation helpers ─────────────────────────────────────────────

const SYSTEM_PROMPT =
  'You translate Norwegian (Bokmål) medical/clinical website content into natural, professional English. ' +
  'Return ONLY the translation — no quotes, no preamble, no explanation. ' +
  'Preserve formatting characters (dashes, em-dashes, punctuation, line breaks, markdown). ' +
  'Keep brand names (CMedical, Livio Oslo) unchanged. ' +
  'For very short labels, keep the translation concise and idiomatic.'

async function translateString(text: string): Promise<string> {
  if (!text || !text.trim()) return ''
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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) {
      console.warn(`    ⚠ AI ${res.status} — leaving empty`)
      return ''
    }
    const json = await res.json()
    return json?.choices?.[0]?.message?.content?.trim() || ''
  } catch (e) {
    console.warn(`    ⚠ AI error: ${(e as Error).message}`)
    return ''
  }
}

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

async function translateBlocks(blocks: any[]): Promise<any[]> {
  const cloned = cloneBlocksFresh(blocks)
  for (const block of cloned) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim().length > 1) {
          const t = await translateString(child.text)
          if (t) child.text = t
        }
      }
    }
  }
  return cloned
}

async function translateStringArray(arr: string[]): Promise<string[]> {
  const out: string[] = []
  for (const s of arr) {
    if (typeof s === 'string' && s.trim()) {
      out.push(await translateString(s))
    } else {
      out.push(s)
    }
  }
  return out
}

// ─── Field-level translation logic ───────────────────────────────────

function isPortableTextArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    (val[0] as any)._type !== undefined
  )
}

// Translate a single value (string | string[] | PT array | object | array of objects)
// Returns translated value. `objectFields` lists keys to translate inside objects.
async function translateValue(
  value: any,
  objectFields?: string[]
): Promise<any> {
  if (value == null) return value
  if (typeof value === 'string') return translateString(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return value
    if (typeof value[0] === 'string') return translateStringArray(value)
    if (isPortableTextArray(value)) return translateBlocks(value)
    // array of objects
    const out = []
    for (const item of value) {
      out.push(await translateObjectFields(item, objectFields))
    }
    return out
  }
  if (typeof value === 'object') return translateObjectFields(value, objectFields)
  return value
}

async function translateObjectFields(obj: any, fields?: string[]): Promise<any> {
  if (!obj || typeof obj !== 'object') return obj
  const out = { ...obj }
  const keys = fields || Object.keys(obj).filter((k) => typeof obj[k] === 'string')
  for (const k of keys) {
    if (typeof obj[k] === 'string' && obj[k].trim()) {
      out[k] = await translateString(obj[k])
    }
  }
  return out
}

// ─── Document type configurations ────────────────────────────────────
// For each type, list the fields we translate.
//   simple: top-level string / text / blockContent / string[]
//   nested: { path: 'fieldName.subPath', stringFields: [...] }
//   arrayOfObjects: { path: 'fieldName', stringFields: [...] }

interface SimpleField {
  name: string
  type?: 'string' | 'text' | 'blockContent' | 'stringArray'
}
interface ArrayObjField {
  name: string
  stringFields: string[] // string fields inside each object
  ptFields?: string[] // portable-text fields inside each object
  stringArrayFields?: string[] // string[] fields inside each object
}
interface DocTypeConfig {
  type: string
  query: string
  fields: SimpleField[]
  arrayObjects?: ArrayObjField[]
  // Nested object fields like address
  nested?: { path: string; stringFields: string[] }[]
}

const CONFIGS: DocTypeConfig[] = [
  {
    type: 'treatment',
    query: `*[_type == "treatment"]{...}`,
    fields: [
      { name: 'title' },
      { name: 'subtitle' },
      { name: 'parentCategoryLabel' },
      { name: 'description' },
      { name: 'benefitsTitle' },
      { name: 'benefits', type: 'stringArray' },
    ],
    arrayObjects: [
      { name: 'process', stringFields: ['title', 'description'] },
      { name: 'faqs', stringFields: ['question', 'answer'] },
      { name: 'sections', stringFields: ['heading', 'content'] },
      { name: 'linkedServices', stringFields: ['label', 'description'] },
      { name: 'subItems', stringFields: ['label'] },
    ],
  },
  {
    type: 'treatmentCategory',
    query: `*[_type == "treatmentCategory"]{...}`,
    fields: [
      { name: 'title' },
      { name: 'description' },
      { name: 'longDescription', type: 'blockContent' },
      { name: 'subtitle' },
      { name: 'servicesHeading' },
      { name: 'servicesIntro', type: 'text' },
      { name: 'closingTitle' },
      { name: 'closingBody', type: 'text' },
      { name: 'closingCta' },
    ],
    arrayObjects: [
      { name: 'stats', stringFields: ['value', 'label'] },
      { name: 'serviceGroups', stringFields: ['label', 'caption'] },
      { name: 'journey', stringFields: ['label', 'title', 'body'] },
      { name: 'staticFaqs', stringFields: ['question', 'answer'] },
    ],
  },
  {
    type: 'specialist',
    query: `*[_type == "specialist"]{...}`,
    fields: [
      { name: 'role' },
      { name: 'subtitle' },
      { name: 'shortBio' },
      { name: 'bio', type: 'blockContent' },
      { name: 'specialties', type: 'stringArray' },
      { name: 'education', type: 'stringArray' },
    ],
  },
  {
    type: 'specialistsPage',
    query: `*[_type == "specialistsPage"]{...}`,
    fields: [
      { name: 'title' },
      { name: 'subtitle' },
      { name: 'body', type: 'blockContent' },
    ],
  },
  {
    type: 'faq',
    query: `*[_type == "faq"]{...}`,
    fields: [{ name: 'question' }, { name: 'answer' }],
  },
  {
    type: 'themePage',
    query: `*[_type == "themePage"]{...}`,
    fields: [
      { name: 'title' },
      { name: 'introTexts', type: 'stringArray' },
      { name: 'ctaText' },
    ],
    arrayObjects: [
      {
        name: 'sections',
        stringFields: ['heading'],
        stringArrayFields: ['paragraphs', 'bulletPoints'],
      },
      { name: 'lifePhases', stringFields: ['title', 'text'] },
    ],
  },
  {
    type: 'homepage',
    query: `*[_type == "homepage"]{...}`,
    fields: [{ name: 'title' }, { name: 'tagline' }],
    arrayObjects: [
      { name: 'statsBar', stringFields: ['value', 'label'] },
      { name: 'valueBadges', stringFields: ['label'] },
      { name: 'promoBlocks', stringFields: ['title', 'description', 'ctaText'] },
    ],
    nested: [
      // heroBanner.slides[]
    ],
  },
  {
    type: 'servicesPage',
    query: `*[_type == "servicesPage"]{...}`,
    fields: [{ name: 'title' }, { name: 'introText' }],
  },
  {
    type: 'insurancePage',
    query: `*[_type == "insurancePage"]{...}`,
    fields: [{ name: 'title' }, { name: 'introText' }],
    arrayObjects: [
      { name: 'steps', stringFields: ['title', 'description'] },
      { name: 'benefits', stringFields: ['title', 'description'] },
    ],
  },
  {
    type: 'pricingPage',
    query: `*[_type == "pricingPage"]{...}`,
    fields: [{ name: 'title' }, { name: 'introText' }, { name: 'insuranceNote' }],
    arrayObjects: [
      // priceCategories[].items[].name handled below via custom logic
    ],
  },
  {
    type: 'contactPage',
    query: `*[_type == "contactPage"]{...}`,
    fields: [{ name: 'title' }, { name: 'introText' }],
    arrayObjects: [
      { name: 'ctaCards', stringFields: ['title', 'description', 'ctaText'] },
    ],
  },
  {
    type: 'clinicPage',
    query: `*[_type == "clinicPage"]{...}`,
    fields: [
      { name: 'description' },
      { name: 'contactDescription' },
    ],
    arrayObjects: [{ name: 'faqs', stringFields: ['question', 'answer'] }],
  },
  {
    type: 'jobListing',
    query: `*[_type == "jobListing"]{...}`,
    fields: [
      { name: 'excerpt' },
      { name: 'body', type: 'blockContent' },
    ],
  },
  {
    type: 'product',
    query: `*[_type == "product"]{...}`,
    fields: [
      { name: 'description' },
      { name: 'intent' },
      { name: 'results' },
      { name: 'howItWorks' },
      { name: 'benefits', type: 'stringArray' },
    ],
  },
  {
    type: 'testimonial',
    query: `*[_type == "testimonial"]{...}`,
    fields: [{ name: 'text' }],
  },
  {
    type: 'privacyPolicyPage',
    query: `*[_type == "privacyPolicyPage"]{...}`,
    fields: [
      { name: 'title' },
      { name: 'body', type: 'blockContent' },
    ],
  },
]

// ─── Per-document processing ─────────────────────────────────────────

function hasExistingTranslation(doc: any, fieldName: string): boolean {
  const v = doc[`${fieldName}_en`]
  if (v == null) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  return true
}

async function processDocument(cfg: DocTypeConfig, doc: any) {
  const patches: Record<string, any> = {}

  // Simple top-level fields
  for (const f of cfg.fields) {
    const src = doc[f.name]
    if (src == null) continue
    if (!FORCE && hasExistingTranslation(doc, f.name)) continue

    let translated: any
    if (f.type === 'blockContent') {
      if (!isPortableTextArray(src)) continue
      translated = await translateBlocks(src)
    } else if (f.type === 'stringArray') {
      if (!Array.isArray(src) || src.length === 0) continue
      translated = await translateStringArray(src)
    } else {
      if (typeof src !== 'string' || !src.trim()) continue
      translated = await translateString(src)
    }
    if (translated && (typeof translated !== 'string' || translated.trim())) {
      patches[`${f.name}_en`] = translated
    }
  }

  // Array of objects → store as <name>_en parallel array
  for (const arrCfg of cfg.arrayObjects || []) {
    const src = doc[arrCfg.name]
    if (!Array.isArray(src) || src.length === 0) continue
    if (!FORCE && hasExistingTranslation(doc, arrCfg.name)) continue

    const translatedArr = []
    for (const item of src) {
      const tItem: any = { ...item }
      // Generate stable key for the new array (Sanity requires _key on array objects)
      if (item._key) tItem._key = `${item._key}_en`
      for (const sf of arrCfg.stringFields) {
        if (typeof item[sf] === 'string' && item[sf].trim()) {
          tItem[sf] = await translateString(item[sf])
        }
      }
      for (const sa of arrCfg.stringArrayFields || []) {
        if (Array.isArray(item[sa])) {
          tItem[sa] = await translateStringArray(item[sa])
        }
      }
      for (const pt of arrCfg.ptFields || []) {
        if (isPortableTextArray(item[pt])) {
          tItem[pt] = await translateBlocks(item[pt])
        }
      }
      translatedArr.push(tItem)
    }
    patches[`${arrCfg.name}_en`] = translatedArr
  }

  // Special-case: pricingPage.priceCategories[].items[].name + .priceLabel + .note
  if (cfg.type === 'pricingPage' && Array.isArray(doc.priceCategories)) {
    if (FORCE || !hasExistingTranslation(doc, 'priceCategories')) {
      const translated = []
      for (const cat of doc.priceCategories) {
        const tCat: any = { ...cat }
        if (cat._key) tCat._key = `${cat._key}_en`
        if (typeof cat.categoryName === 'string') tCat.categoryName = await translateString(cat.categoryName)
        if (Array.isArray(cat.items)) {
          tCat.items = []
          for (const it of cat.items) {
            const tIt: any = { ...it }
            if (it._key) tIt._key = `${it._key}_en`
            if (typeof it.name === 'string') tIt.name = await translateString(it.name)
            if (typeof it.priceLabel === 'string') tIt.priceLabel = await translateString(it.priceLabel)
            if (typeof it.note === 'string') tIt.note = await translateString(it.note)
            tCat.items.push(tIt)
          }
        }
        translated.push(tCat)
      }
      patches.priceCategories_en = translated
    }
  }

  // Special-case: homepage.heroBanner.slides[]
  if (cfg.type === 'homepage' && doc.heroBanner?.slides) {
    if (FORCE || !doc.heroBanner_en) {
      const slides_en = []
      for (const slide of doc.heroBanner.slides) {
        const ts: any = { ...slide }
        if (slide._key) ts._key = `${slide._key}_en`
        for (const k of ['heading', 'subheading', 'ctaText']) {
          if (typeof slide[k] === 'string' && slide[k].trim()) {
            ts[k] = await translateString(slide[k])
          }
        }
        slides_en.push(ts)
      }
      patches.heroBanner_en = { slides: slides_en }
    }
  }

  // Special-case: clinicPage.valueProposition object
  if (cfg.type === 'clinicPage' && doc.valueProposition && typeof doc.valueProposition === 'object') {
    if (FORCE || !doc.valueProposition_en) {
      const v: any = {}
      for (const k of ['valueProposition1', 'valueProposition2', 'socialProof']) {
        if (typeof doc.valueProposition[k] === 'string' && doc.valueProposition[k].trim()) {
          v[k] = await translateString(doc.valueProposition[k])
        }
      }
      if (Object.keys(v).length) patches.valueProposition_en = v
    }
  }

  return patches
}

// ─── Main ────────────────────────────────────────────────────────────

async function run() {
  console.log(`▶ Universal EN translation`)
  console.log(`  Dry run: ${DRY_RUN ? '✓' : '✗'} | Force: ${FORCE ? '✓' : '✗'}`)
  if (ONLY.length) console.log(`  Limit:   ${ONLY.join(', ')}`)
  console.log()

  const targets = ONLY.length ? CONFIGS.filter((c) => ONLY.includes(c.type)) : CONFIGS

  for (const cfg of targets) {
    const docs = await sanityClient.fetch<any[]>(cfg.query)
    console.log(`\n📦 ${cfg.type} — ${docs.length} document(s)`)

    for (const doc of docs) {
      try {
        const patches = await processDocument(cfg, doc)
        const keys = Object.keys(patches)
        if (keys.length === 0) {
          console.log(`  · ${doc._id} — up to date`)
          continue
        }
        console.log(`  ✎ ${doc._id} — ${keys.join(', ')}`)
        if (!DRY_RUN) {
          await sanityClient
            .patch(doc._id)
            .set(patches)
            .commit({ autoGenerateArrayKeys: true })
        }
      } catch (e) {
        console.error(`  ✗ ${doc._id} failed:`, (e as Error).message)
      }
    }
  }

  console.log(`\n✓ Done`)
}

run().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
