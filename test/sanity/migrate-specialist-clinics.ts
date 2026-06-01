/**
 * Convert specialist.clinics from string[] → reference[] (clinicPage).
 * Fixes Studio error: "Some items in this list are not objects".
 *
 * Run: cd test && npm run migrate:specialist-clinics
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type StringOrRef = string | { _ref: string; _type: 'reference'; _key?: string }

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Static site labels from migrate-content / specialists.ts → published clinicPage _id */
const LABEL_TO_CLINIC_ID: Record<string, string> = {
  majorstuen: 'clinicPage-majorstuen',
  'oslo majorstuen': 'clinicPage-majorstuen',
  moelv: 'clinicPage-moelv',
  bekkestua: 'clinicPage-bekkestua',
  moss: 'clinicPage-moss',
  ski: 'clinicPage-ski',
}

function pickNoTitle(title: unknown): string {
  if (typeof title === 'string') return title.trim()
  if (!Array.isArray(title)) return ''
  const no =
    title.find(
      (t: { language?: string; _key?: string }) =>
        t.language === 'no' || t._key === 'no',
    ) || title[0]
  return typeof no?.value === 'string' ? no.value.trim() : ''
}

function pickSlug(slug: unknown, docId: string): string {
  if (typeof slug === 'string') return slug
  if (slug && typeof slug === 'object' && 'current' in slug) {
    return String((slug as { current?: string }).current || '')
  }
  if (Array.isArray(slug)) {
    const no =
      slug.find(
        (s: { language?: string; value?: { current?: string } }) =>
          s.language === 'no',
      ) || slug[0]
    return no?.value?.current || ''
  }
  if (docId.startsWith('clinicPage-')) return docId.replace(/^clinicPage-/, '')
  return ''
}

async function run() {
  console.log('▶ Migrate specialist.clinics → clinicPage references')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const specialists: { _id: string; name: string; clinics?: StringOrRef[] }[] =
    await sanityClient.fetch(
      `*[_type == "specialist" && defined(clinics) && count(clinics) > 0]{
        _id, name, clinics
      }`,
    )

  const clinicPages: { _id: string; title: unknown; slug: unknown }[] =
    await sanityClient.fetch(
      `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{ _id, title, slug }`,
    )

  console.log(`   ${specialists.length} specialist(s) with clinics`)
  console.log(`   ${clinicPages.length} published clinicPage doc(s)\n`)

  const clinicIndex = clinicPages.map((c) => ({
    _id: c._id,
    title: pickNoTitle(c.title),
    slug: pickSlug(c.slug, c._id),
  }))

  for (const c of clinicIndex) {
    const key = slugify(c.title)
    if (key && !LABEL_TO_CLINIC_ID[key]) LABEL_TO_CLINIC_ID[key] = c._id
    if (c.slug && !LABEL_TO_CLINIC_ID[c.slug]) LABEL_TO_CLINIC_ID[c.slug] = c._id
  }

  const findClinicId = (name: string): string | null => {
    const n = name.trim().toLowerCase()
    const slug = slugify(name)
    if (LABEL_TO_CLINIC_ID[n]) return LABEL_TO_CLINIC_ID[n]
    if (LABEL_TO_CLINIC_ID[slug]) return LABEL_TO_CLINIC_ID[slug]

    let hit = clinicIndex.find((c) => c.title?.toLowerCase() === n)
    if (hit) return hit._id
    hit = clinicIndex.find((c) => c.slug?.toLowerCase() === slug)
    if (hit) return hit._id
    hit = clinicIndex.find((c) => c.title?.toLowerCase().includes(n))
    if (hit) return hit._id
    return null
  }

  let converted = 0
  let skipped = 0
  const unresolved: { specialist: string; clinic: string }[] = []

  for (const s of specialists) {
    const list = s.clinics || []
    const allRefs = list.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        (item as { _type?: string })._type === 'reference' &&
        typeof (item as { _ref?: string })._ref === 'string',
    )
    if (allRefs) {
      skipped++
      continue
    }

    const refs = list
      .map((item, idx) => {
        if (typeof item === 'string') {
          const id = findClinicId(item)
          if (!id) {
            unresolved.push({ specialist: s.name || s._id, clinic: item })
            return null
          }
          return {
            _type: 'reference' as const,
            _ref: id,
            _key: `clinic-${slugify(item)}-${idx}`,
          }
        }
        if (
          typeof item === 'object' &&
          item !== null &&
          (item as { _type?: string })._type === 'reference'
        ) {
          const ref = item as { _ref: string; _key?: string }
          return {
            _type: 'reference' as const,
            _ref: ref._ref,
            _key: ref._key || `clinic-${idx}-${ref._ref.slice(-6)}`,
          }
        }
        return null
      })
      .filter(
        (x): x is { _type: 'reference'; _ref: string; _key: string } => !!x,
      )

    console.log(`  ✎ ${s._id} (${s.name}) → ${refs.length} ref(s)`)
    if (!DRY_RUN) {
      await sanityClient.patch(s._id).set({ clinics: refs }).commit({
        autoGenerateArrayKeys: true,
      })
    }
    converted++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✓ Converted: ${converted}`)
  console.log(`· Skipped (already references): ${skipped}`)
  if (unresolved.length) {
    console.log(`⚠ Unresolved (${unresolved.length}):`)
    unresolved.forEach((u) =>
      console.log(`    "${u.clinic}" on ${u.specialist}`),
    )
  }
}

run().catch((err) => {
  console.error('✗ Migration failed:', err)
  process.exit(1)
})
