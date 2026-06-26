/**
 * Fix clinicPage documents so Sanity Studio can open them without crashing.
 *
 * Converts legacy shapes that break the form:
 * - slug: { current } → internationalizedArraySlug
 * - plain strings → internationalizedArray (title, description, hours, FAQs, …)
 *
 * Run:
 *   cd test && npm run migrate:clinic-page-studio-fix:dry
 *   cd test && npm run migrate:clinic-page-studio-fix
 */
import { randomBytes } from 'crypto'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type ValueType =
  | 'internationalizedArrayStringValue'
  | 'internationalizedArrayTextValue'

const HOURS_EN: Record<string, string> = {
  bekkestua: 'Mon–Fri 08:00–16:00',
  majorstuen: 'Mon–Fri 08:00–16:00',
  moelv: 'Mon–Fri 08:30–15:30',
  moss: 'Mon–Fri 08:00–15:30',
  ski: 'Mon–Fri 08:00–16:00',
}

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function isI18nArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    typeof (val[0] as { _type?: string })._type === 'string' &&
    String((val[0] as { _type: string })._type).startsWith('internationalizedArray')
  )
}

function isI18nSlugArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    String((val[0] as { _type?: string })._type).startsWith('internationalizedArraySlug')
  )
}

function pickNo(val: unknown): string {
  if (typeof val === 'string') return val.trim()
  if (!isI18nArray(val)) return ''
  const items = val as { language?: string; _key?: string; value?: string }[]
  const no = items.find((i) => (i.language ?? i._key) === 'no') || items[0]
  return typeof no?.value === 'string' ? no.value.trim() : ''
}

function wrapString(value: string, valueType: ValueType) {
  return [
    { _type: valueType, language: 'no', value },
    { _type: valueType, language: 'en', value: '' },
  ]
}

function wrapSlug(current: string) {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current },
    },
  ]
}

function slugFromDoc(doc: { _id: string; slug?: unknown }): string {
  const slug = doc.slug
  if (slug && typeof slug === 'object' && !Array.isArray(slug)) {
    const current = (slug as { current?: string }).current
    if (typeof current === 'string' && current.trim()) return current.trim()
  }
  if (isI18nSlugArray(slug)) {
    const entry = (slug as { value?: { current?: string } }[])[0]
    return entry?.value?.current?.trim() || ''
  }
  return doc._id.replace(/^drafts\./, '').replace(/^clinicPage-/, '')
}

type FieldMap = Record<string, ValueType>

function wrapObjectFields(obj: Record<string, unknown>, fieldMap: FieldMap): Record<string, unknown> {
  const out = { ...obj }
  for (const [key, valueType] of Object.entries(fieldMap)) {
    const cur = out[key]
    if (cur === undefined || cur === null || isI18nArray(cur)) continue
    if (typeof cur === 'string' && cur.trim()) {
      out[key] = wrapString(cur.trim(), valueType)
    }
  }
  return out
}

function buildPatch(doc: Record<string, unknown>): Record<string, unknown> | null {
  const patch: Record<string, unknown> = {}
  const slugKey = slugFromDoc(doc as { _id: string; slug?: unknown })

  if (!isI18nSlugArray(doc.slug)) {
    const current =
      doc.slug &&
      typeof doc.slug === 'object' &&
      !Array.isArray(doc.slug) &&
      typeof (doc.slug as { current?: string }).current === 'string'
        ? (doc.slug as { current: string }).current.trim()
        : slugKey
    if (current) patch.slug = wrapSlug(current)
  }

  const top = wrapObjectFields(doc, {
    title: 'internationalizedArrayStringValue',
    description: 'internationalizedArrayTextValue',
    contactDescription: 'internationalizedArrayTextValue',
    hours: 'internationalizedArrayStringValue',
  })
  for (const key of ['title', 'description', 'contactDescription', 'hours'] as const) {
    if (JSON.stringify(top[key]) !== JSON.stringify(doc[key])) {
      if (key === 'hours' && isI18nArray(top[key])) {
        const no = pickNo(top[key]) || pickNo(doc.hours)
        const en = HOURS_EN[slugKey] || no
        patch.hours = [
          { _type: 'internationalizedArrayStringValue', language: 'no', value: no },
          { _type: 'internationalizedArrayStringValue', language: 'en', value: en },
        ]
      } else {
        patch[key] = top[key]
      }
    }
  }

  if (doc.valueProposition && typeof doc.valueProposition === 'object') {
    const next = wrapObjectFields(doc.valueProposition as Record<string, unknown>, {
      valueProposition1: 'internationalizedArrayStringValue',
      socialProof: 'internationalizedArrayStringValue',
    })
    if (JSON.stringify(next) !== JSON.stringify(doc.valueProposition)) {
      patch.valueProposition = next
    }
  }

  if (doc.detail && typeof doc.detail === 'object') {
    const next = wrapObjectFields(doc.detail as Record<string, unknown>, {
      parking: 'internationalizedArrayTextValue',
      publicTransport: 'internationalizedArrayTextValue',
      accessibility: 'internationalizedArrayTextValue',
    })
    if (JSON.stringify(next) !== JSON.stringify(doc.detail)) {
      patch.detail = next
    }
  }

  if (Array.isArray(doc.faqs)) {
    const faqs = doc.faqs as Record<string, unknown>[]
    let changed = false
    const nextFaqs = faqs.map((faq, index) => {
      const item = { ...faq, _key: faq._key || `faq-${slugKey}-${index}` }
      const wrapped = wrapObjectFields(item, {
        question: 'internationalizedArrayStringValue',
        answer: 'internationalizedArrayTextValue',
      })
      if (JSON.stringify(wrapped) !== JSON.stringify(faq)) changed = true
      return wrapped
    })
    if (changed) patch.faqs = nextFaqs
  }

  if (doc.booking && typeof doc.booking === 'object') {
    const next = wrapObjectFields(doc.booking as Record<string, unknown>, {
      closedMessage: 'internationalizedArrayTextValue',
    })
    if (JSON.stringify(next) !== JSON.stringify(doc.booking)) {
      patch.booking = next
    }
  }

  return Object.keys(patch).length > 0 ? patch : null
}

async function run() {
  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "clinicPage"]{ ... }`,
  )

  console.log(`▶ Fix clinicPage Studio data (${docs.length} doc(s))`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let updated = 0
  for (const doc of docs) {
    const patch = buildPatch(doc)
    if (!patch) {
      console.log(`  · ${doc._id} — ok`)
      continue
    }

    console.log(`  ✎ ${doc._id} — ${Object.keys(patch).join(', ')}`)
    if (!DRY_RUN) {
      await sanityClient.patch(String(doc._id)).set(patch).commit({ autoGenerateArrayKeys: true })
    }
    updated++
  }

  console.log(`\n✓ Done (${updated} updated)`)
}

run().catch((error) => {
  console.error('✗ Migration failed:', error)
  process.exit(1)
})
