/**
 * Migration: Wrap legacy plain-string / plain-text / plain-PT fields on all
 * newly-internationalized public-facing schemas into internationalizedArray
 * shape, and (optionally) auto-translate to English via the Lovable AI Gateway.
 *
 * Covers schemas: homepage, servicesPage, pricingPage, insurancePage,
 * contactPage, themePage, clinicPage, specialist, specialistsPage,
 * treatment, treatmentCategory, privacyPolicyPage, faq, siteSettings.
 *
 * Idempotent — already-migrated fields are skipped.
 *
 * ENV:
 *   SANITY_TOKEN     – required, write access
 *   LOVABLE_API_KEY  – optional, enables EN auto-translation
 *   TRANSLATE        – '1' to call AI; default leaves EN empty
 *   DRY_RUN          – '1' to log only, no writes
 *
 * Run:
 *   SANITY_TOKEN=... LOVABLE_API_KEY=... TRANSLATE=1 \
 *     npx tsx test/sanity/migrate-i18n-all-pages.ts
 */
import { sanityClient } from './config'

const TRANSLATE = process.env.TRANSLATE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY

type ValueType =
  | 'internationalizedArrayStringValue'
  | 'internationalizedArrayTextValue'
  | 'internationalizedArrayBlockContentValue'

// ─── AI translation ──────────────────────────────────────────────────

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
              'You translate Norwegian (Bokmål) medical/clinical website content into natural, professional English. Return ONLY the translation, no quotes, no preamble. Preserve formatting, dashes, and punctuation. Keep brand names (CMedical, Livio Oslo) unchanged.',
          },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) {
      console.warn(`    ⚠ AI translate failed (${res.status})`)
      return ''
    }
    const json = await res.json()
    return json?.choices?.[0]?.message?.content?.trim() || ''
  } catch (e) {
    console.warn('    ⚠ AI translate error:', (e as Error).message)
    return ''
  }
}

function cloneBlocksFresh(blocks: any[]): any[] {
  return JSON.parse(JSON.stringify(blocks)).map((b: any) => {
    delete b._key
    if (Array.isArray(b.children)) b.children.forEach((c: any) => delete c._key)
    if (Array.isArray(b.markDefs)) b.markDefs.forEach((m: any) => delete m._key)
    return b
  })
}

async function translateBlocks(blocks: any[]): Promise<any[]> {
  const cloned = cloneBlocksFresh(blocks)
  if (!TRANSLATE || !LOVABLE_API_KEY) return cloned
  for (const block of cloned) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child._type === 'span' && typeof child.text === 'string' && child.text.trim().length >= 2) {
          const t = await translateString(child.text)
          if (t) child.text = t
        }
      }
    }
  }
  return cloned
}

// ─── Generic i18n wrapping ───────────────────────────────────────────

function isI18nArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    typeof (val[0] as any)._type === 'string' &&
    (val[0] as any)._type.startsWith('internationalizedArray') &&
    'value' in (val[0] as any)
  )
}

function isPortableTextArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    typeof (val[0] as any)._type === 'string' &&
    (val[0] as any).value === undefined &&
    ((val[0] as any)._type === 'block' || (val[0] as any)._type === 'image')
  )
}

async function wrapValue(value: any, valueType: ValueType): Promise<any[]> {
  const noEntry = { _type: valueType, language: 'no', value }
  const entries: any[] = [noEntry]
  if (TRANSLATE) {
    let en: any = ''
    if (valueType === 'internationalizedArrayBlockContentValue' && Array.isArray(value)) {
      en = await translateBlocks(value)
    } else if (typeof value === 'string') {
      en = await translateString(value)
    }
    if (en) entries.push({ _type: valueType, language: 'en', value: en })
  }
  return entries
}

/**
 * Recursively walk an object/array, converting plain values to i18n arrays
 * based on the field-name → value-type map at each level. Returns the
 * (possibly mutated) value plus a `changed` flag.
 *
 * We never mutate references (`_ref`), images, slugs, or other nested
 * Sanity types automatically — we only wrap when the field name is in
 * the explicit map for the current schema/object.
 */
type FieldMap = Record<string, ValueType>

async function wrapObjectFields(
  obj: any,
  fieldMap: FieldMap,
  nestedFieldMaps: Record<string, FieldMap> = {}
): Promise<{ changed: boolean; value: any }> {
  if (!obj || typeof obj !== 'object') return { changed: false, value: obj }
  let changed = false
  const out: any = Array.isArray(obj) ? [...obj] : { ...obj }

  for (const [key, vt] of Object.entries(fieldMap)) {
    const cur = out[key]
    if (cur === undefined || cur === null) continue
    if (isI18nArray(cur)) continue

    // Single i18n value object (not in array) — wrap into array
    if (
      cur &&
      typeof cur === 'object' &&
      !Array.isArray(cur) &&
      typeof (cur as any)._type === 'string' &&
      (cur as any)._type.startsWith('internationalizedArray') &&
      'value' in (cur as any)
    ) {
      const inner = (cur as any).value
      const lang = (cur as any).language || 'no'
      out[key] = [{ _type: vt, language: lang, value: inner }]
      changed = true
      continue
    }

    if (vt === 'internationalizedArrayBlockContentValue') {
      if (!isPortableTextArray(cur)) continue
      out[key] = await wrapValue(cur, vt)
      changed = true
    } else if (typeof cur === 'string') {
      if (!cur.trim()) continue
      out[key] = await wrapValue(cur, vt)
      changed = true
    } else if (Array.isArray(cur) && cur.every((x) => typeof x === 'string')) {
      // arrays of strings → array of i18n strings (one entry per string)
      const wrapped: any[] = []
      for (const s of cur) {
        if (!s?.trim()) {
          wrapped.push(s)
          continue
        }
        const w = await wrapValue(s, vt)
        wrapped.push(...w)
      }
      out[key] = wrapped
      changed = true
    }
  }

  // Recurse into nested objects/arrays where we have a field map
  for (const [key, nestedMap] of Object.entries(nestedFieldMaps)) {
    const cur = out[key]
    if (!cur) continue
    if (Array.isArray(cur)) {
      const newArr: any[] = []
      let arrChanged = false
      for (const item of cur) {
        if (item && typeof item === 'object' && !item._ref) {
          const r = await wrapObjectFields(item, nestedMap)
          newArr.push(r.value)
          if (r.changed) arrChanged = true
        } else {
          newArr.push(item)
        }
      }
      if (arrChanged) {
        out[key] = newArr
        changed = true
      }
    } else if (typeof cur === 'object' && !cur._ref) {
      const r = await wrapObjectFields(cur, nestedMap)
      if (r.changed) {
        out[key] = r.value
        changed = true
      }
    }
  }

  return { changed, value: out }
}

// ─── Per-schema field maps ───────────────────────────────────────────

const SCHEMAS: Array<{
  type: string
  topFields: FieldMap
  nested?: Record<string, FieldMap>
  /** Top-level arrays where each item is an internationalizedArrayString */
  arrayOfI18nStringFields?: string[]
}> = [
  {
    type: 'homepage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      tagline: 'internationalizedArrayStringValue',
      promoBlocksTitle: 'internationalizedArrayStringValue',
    },
    nested: {
      'heroBanner.slides': {
        heading: 'internationalizedArrayStringValue',
        subheading: 'internationalizedArrayStringValue',
        ctaText: 'internationalizedArrayStringValue',
        ctaLink: 'internationalizedArrayStringValue',
      },
      statsBar: { label: 'internationalizedArrayStringValue' },
      valueBadges: { label: 'internationalizedArrayStringValue' },
      promoBlocks: {
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
        ctaText: 'internationalizedArrayStringValue',
      },
    },
  },
  {
    type: 'servicesPage',
    topFields: {
      breadcrumbHome: 'internationalizedArrayStringValue',
      title: 'internationalizedArrayStringValue',
      eyebrow: 'internationalizedArrayStringValue',
      introText: 'internationalizedArrayTextValue',
      searchPlaceholder: 'internationalizedArrayStringValue',
      featuredSectionTitle: 'internationalizedArrayStringValue',
      faqSectionTitle: 'internationalizedArrayStringValue',
    },
    nested: {
      badges: { label: 'internationalizedArrayStringValue' },
      moreServicesSection: {
        eyebrow: 'internationalizedArrayStringValue',
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
      },
      faqs: {
        question: 'internationalizedArrayStringValue',
        answer: 'internationalizedArrayTextValue',
      },
    },
  },
  {
    type: 'pricingPage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      introText: 'internationalizedArrayTextValue',
      insuranceNote: 'internationalizedArrayTextValue',
    },
    nested: {
      priceCategories: { categoryName: 'internationalizedArrayStringValue' },
      'priceCategories[].items': {
        name: 'internationalizedArrayStringValue',
        priceLabel: 'internationalizedArrayStringValue',
        note: 'internationalizedArrayStringValue',
      },
    },
  },
  {
    type: 'insurancePage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      introText: 'internationalizedArrayTextValue',
    },
    nested: {
      steps: {
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
      },
      benefits: {
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
      },
    },
  },
  {
    type: 'contactPage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      introText: 'internationalizedArrayTextValue',
    },
    nested: {
      openingHours: { days: 'internationalizedArrayStringValue' },
      ctaCards: {
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
        ctaText: 'internationalizedArrayStringValue',
      },
    },
  },
  {
    type: 'themePage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      ctaText: 'internationalizedArrayStringValue',
    },
    nested: {
      sections: { heading: 'internationalizedArrayStringValue' },
      lifePhases: {
        title: 'internationalizedArrayStringValue',
        text: 'internationalizedArrayTextValue',
      },
    },
  },
  {
    type: 'clinicPage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      description: 'internationalizedArrayTextValue',
      contactDescription: 'internationalizedArrayTextValue',
    },
    nested: {
      valueProposition: {
        valueProposition1: 'internationalizedArrayStringValue',
        socialProof: 'internationalizedArrayStringValue',
      },
      detail: {
        parking: 'internationalizedArrayTextValue',
        publicTransport: 'internationalizedArrayTextValue',
        accessibility: 'internationalizedArrayTextValue',
      },
      faqs: {
        question: 'internationalizedArrayStringValue',
        answer: 'internationalizedArrayTextValue',
      },
      booking: {
        closedMessage: 'internationalizedArrayTextValue',
      },
    },
  },
  {
    type: 'specialist',
    topFields: {
      // NOTE: `name` is a person name → never translated, stays as plain string.
      role: 'internationalizedArrayStringValue',
      subtitle: 'internationalizedArrayStringValue',
      bio: 'internationalizedArrayBlockContentValue',
      shortBio: 'internationalizedArrayTextValue',
    },
  },
  {
    type: 'specialistsPage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      subtitle: 'internationalizedArrayTextValue',
      body: 'internationalizedArrayBlockContentValue',
    },
  },
  {
    type: 'treatment',
    topFields: {
      title: 'internationalizedArrayStringValue',
      parentCategoryLabel: 'internationalizedArrayStringValue',
      description: 'internationalizedArrayTextValue',
      benefitsTitle: 'internationalizedArrayStringValue',
      subtitle: 'internationalizedArrayStringValue',
    },
    arrayOfI18nStringFields: ['benefits'],
    nested: {
      process: {
        title: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
      },
      faqs: {
        question: 'internationalizedArrayStringValue',
        answer: 'internationalizedArrayTextValue',
      },
      sections: {
        heading: 'internationalizedArrayStringValue',
        content: 'internationalizedArrayTextValue',
      },
      linkedServices: {
        label: 'internationalizedArrayStringValue',
        description: 'internationalizedArrayTextValue',
      },
      subItems: {
        label: 'internationalizedArrayStringValue',
      },
    },
  },
  {
    type: 'treatmentCategory',
    topFields: {
      title: 'internationalizedArrayStringValue',
      description: 'internationalizedArrayTextValue',
      longDescription: 'internationalizedArrayBlockContentValue',
      faqSectionTitle: 'internationalizedArrayStringValue',
    },
    nested: {
      bottomCta: {
        title: 'internationalizedArrayStringValue',
        subtitle: 'internationalizedArrayTextValue',
        primaryLabel: 'internationalizedArrayStringValue',
        secondaryLabel: 'internationalizedArrayStringValue',
      },
    },
  },
  {
    type: 'privacyPolicyPage',
    topFields: {
      title: 'internationalizedArrayStringValue',
      body: 'internationalizedArrayBlockContentValue',
    },
  },
  {
    type: 'faq',
    topFields: {
      question: 'internationalizedArrayStringValue',
      answer: 'internationalizedArrayTextValue',
    },
  },
  {
    type: 'googleReview',
    topFields: {
      text: 'internationalizedArrayTextValue',
    },
  },
  {
    type: 'googleReviewSettings',
    topFields: {
      heading: 'internationalizedArrayStringValue',
      subheading: 'internationalizedArrayStringValue',
      ctaTitle: 'internationalizedArrayStringValue',
      ctaSubtitle: 'internationalizedArrayStringValue',
    },
  },
  {
    type: 'siteSettings',
    nested: {
      mainNavigation: {
        label: 'internationalizedArrayStringValue',
        path: 'internationalizedArrayStringValue',
      },
      footerAboutLinks: {
        label: 'internationalizedArrayStringValue',
        path: 'internationalizedArrayStringValue',
      },
      ctaButton: {
        label: 'internationalizedArrayStringValue',
        path: 'internationalizedArrayStringValue',
      },
    },
  },
]

// ─── Special handling for dotted nested paths (heroBanner.slides) ────

function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj)
}
function setByPath(obj: any, path: string, value: any) {
  const keys = path.split('.')
  const last = keys.pop()!
  let cur = obj
  for (const k of keys) {
    if (cur[k] === undefined || cur[k] === null) cur[k] = {}
    cur = cur[k]
  }
  cur[last] = value
}

async function wrapArrayOfI18nStrings(
  arr: unknown[],
  valueType: ValueType = 'internationalizedArrayStringValue'
): Promise<{ changed: boolean; value: any[] }> {
  const out: any[] = []
  let changed = false
  for (const item of arr) {
    if (typeof item === 'string' && item.trim()) {
      out.push(await wrapValue(item, valueType))
      changed = true
    } else if (isI18nArray(item)) {
      out.push(item)
    } else if (
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      typeof (item as any)._type === 'string' &&
      (item as any)._type.startsWith('internationalizedArray') &&
      'value' in (item as any)
    ) {
      const inner = (item as any).value
      const lang = (item as any).language || 'no'
      out.push([{ _type: valueType, language: lang, value: inner }])
      changed = true
    } else {
      out.push(item)
    }
  }
  return { changed, value: out }
}

async function migrateDoc(doc: any, schema: (typeof SCHEMAS)[number]) {
  const patches: Record<string, any> = {}

  // Top-level fields
  const top = await wrapObjectFields(doc, schema.topFields)
  if (top.changed) {
    for (const k of Object.keys(schema.topFields)) {
      if (JSON.stringify(top.value[k]) !== JSON.stringify(doc[k])) {
        patches[k] = top.value[k]
      }
    }
  }

  if (schema.arrayOfI18nStringFields) {
    for (const key of schema.arrayOfI18nStringFields) {
      const cur = doc[key]
      if (!Array.isArray(cur)) continue
      const r = await wrapArrayOfI18nStrings(cur)
      if (r.changed) patches[key] = r.value
    }
  }

  // Nested arrays / objects (supports dotted paths like heroBanner.slides
  // and array-wildcard paths like priceCategories[].items)
  if (schema.nested) {
    for (const [path, nestedMap] of Object.entries(schema.nested)) {
      // Wildcard array path: parent[].child
      if (path.includes('[].')) {
        const [parentKey, childKey] = path.split('[].')
        const parentArr = doc[parentKey]
        if (!Array.isArray(parentArr)) continue
        const newParent = JSON.parse(JSON.stringify(parentArr))
        let parentChanged = false
        for (let i = 0; i < newParent.length; i++) {
          const childArr = newParent[i]?.[childKey]
          if (!Array.isArray(childArr)) continue
          for (let j = 0; j < childArr.length; j++) {
            const item = childArr[j]
            if (item && typeof item === 'object') {
              const r = await wrapObjectFields(item, nestedMap)
              if (r.changed) {
                childArr[j] = r.value
                parentChanged = true
              }
            }
          }
        }
        if (parentChanged) {
          // Merge with any existing patch on the same top-level key
          patches[parentKey] = newParent
        }
        continue
      }

      const cur = getByPath(doc, path)
      if (!cur) continue

      if (Array.isArray(cur)) {
        const newArr: any[] = []
        let changed = false
        for (const item of cur) {
          if (item && typeof item === 'object') {
            const r = await wrapObjectFields(item, nestedMap)
            newArr.push(r.value)
            if (r.changed) changed = true
          } else {
            newArr.push(item)
          }
        }
        if (changed) {
          const topKey = path.split('.')[0]
          if (path.includes('.')) {
            const container = JSON.parse(JSON.stringify(doc[topKey] || {}))
            setByPath({ [topKey]: container }, path, newArr)
            patches[topKey] = container
          } else {
            // If a wildcard pass already wrote this key, merge categoryName onto it
            if (patches[path]) {
              for (let i = 0; i < newArr.length; i++) {
                patches[path][i] = { ...patches[path][i], ...newArr[i] }
              }
            } else {
              patches[path] = newArr
            }
          }
        }
      } else if (typeof cur === 'object') {
        const r = await wrapObjectFields(cur, nestedMap)
        if (r.changed) {
          const topKey = path.split('.')[0]
          if (path.includes('.')) {
            const container = JSON.parse(JSON.stringify(doc[topKey] || {}))
            setByPath({ [topKey]: container }, path, r.value)
            patches[topKey] = container
          } else {
            patches[path] = r.value
          }
        }
      }
    }
  }

  return patches
}

// ─── Main ────────────────────────────────────────────────────────────

const ONLY = process.env.ONLY?.split(',').map((s) => s.trim()).filter(Boolean)

async function run() {
  const schemas = ONLY?.length
    ? SCHEMAS.filter((s) => ONLY.includes(s.type))
  : SCHEMAS

  console.log(`▶ Sanity i18n migration — all public-facing schemas`)
  console.log(`  Translate EN: ${TRANSLATE ? '✓ via Lovable AI' : '✗ (EN left empty)'}`)
  console.log(`  Dry run:      ${DRY_RUN ? '✓' : '✗'}`)
  if (ONLY?.length) console.log(`  Only types:   ${ONLY.join(', ')}`)
  console.log()

  for (const schema of schemas) {
    const docs = await sanityClient.fetch<any[]>(`*[_type == "${schema.type}"]`)
    console.log(`\n📄 ${schema.type} — ${docs.length} doc(s)`)
    for (const doc of docs) {
      try {
        const patches = await migrateDoc(doc, schema)
        const fields = Object.keys(patches)
        if (fields.length === 0) {
          console.log(`  · ${doc._id} — up to date`)
          continue
        }
        console.log(`  ✎ ${doc._id} — patching: ${fields.join(', ')}`)
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
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
