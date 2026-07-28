import {createClient} from '@sanity/client'
import {readFileSync, writeFileSync} from 'fs'
import path from 'path'

const ROOT = process.cwd()
const env = Object.fromEntries(
  readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const DATASET = env.SANITY_DATASET || env.SANITY_STUDIO_DATASET
if (DATASET !== 'developer') {
  throw new Error(`Safety check failed: dataset must be developer, got ${DATASET}`)
}

const client = createClient({
  projectId: env.SANITY_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: env.SANITY_TOKEN,
  useCdn: false,
})

const SENSITIVE_FIELDS = new Set([
  'slug',
  'heroImage',
  'title',
  'description',
  'heroPoints',
  'reasons',
  'promises',
  'relatedSection',
  'insuranceTitle',
  'insuranceEyebrow',
  'insurancePartners',
  'pageSections',
  'seo',
  'bookingService',
  'faqCollection',
  'faqs',
  'faqSectionTitle',
  'bottomCta',
  'primaryCtaLabel',
  'callCtaLabel',
  'geoSummary',
])

function stripMeta(doc) {
  if (!doc) return null
  const {_id, _rev, _updatedAt, _createdAt, _type, _system, ...rest} = doc
  return rest
}

// Normalize for semantic comparison:
// - ignore _key/_type noise
// - drop empty i18n entries
// - drop empty arrays/objects (Studio normalization)
function normalize(value) {
  if (Array.isArray(value)) {
    const mapped = value
      .map((item) => {
        if (
          item &&
          typeof item === 'object' &&
          ('language' in item || (typeof item._type === 'string' && item._type.includes('internationalized')))
        ) {
          const raw = item.value
          const current = raw && typeof raw === 'object' && 'current' in raw ? raw.current : raw
          if (current === undefined || current === null || current === '') return undefined
          return {language: item.language, value: normalize(current)}
        }
        if (item && typeof item === 'object') {
          const o = {...item}
          delete o._key
          delete o._type
          return normalize(o)
        }
        return normalize(item)
      })
      .filter((x) => x !== undefined)
    return mapped.length ? mapped : undefined
  }

  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === '_key' || k === '_type' || k === '_strengthenOnPublish') continue
      const nv = normalize(v)
      if (nv === undefined) continue
      out[k] = nv
    }
    return Object.keys(out).length ? out : undefined
  }

  return value
}

function diffTop(a, b) {
  const keys = [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])].sort()
  const diffs = []
  for (const k of keys) {
    const av = a?.[k]
    const bv = b?.[k]
    if (JSON.stringify(av) === JSON.stringify(bv)) continue
    let kind = 'changed'
    if (av !== undefined && bv === undefined) kind = 'added-in-draft'
    else if (av === undefined && bv !== undefined) kind = 'removed-in-draft'
    diffs.push({field: k, kind})
  }
  return diffs
}

function reasonForSkip(diffs) {
  if (!diffs.length) return 'No semantic changes'
  const sensitive = diffs.filter((d) => SENSITIVE_FIELDS.has(d.field)).map((d) => d.field)
  if (sensitive.length) {
    return `Sensitive semantic field changes: ${[...new Set(sensitive)].join(', ')}`
  }
  return `Non-benign semantic changes: ${diffs.map((d) => d.field).join(', ')}`
}

async function publishDraftPair(pubId, draftDoc) {
  const publishedDoc = {
    ...draftDoc,
    _id: pubId,
  }
  delete publishedDoc._rev
  delete publishedDoc._updatedAt
  delete publishedDoc._createdAt

  await client
    .transaction()
    .createOrReplace(publishedDoc)
    .delete(`drafts.${pubId}`)
    .commit()
}

function pickTitle(doc) {
  const t = doc?.title
  if (Array.isArray(t)) {
    const no = t.find((x) => (x.language || x._key) === 'no') || t[0]
    return no?.value?.current || no?.value || doc?._id
  }
  return doc?._id
}

async function run() {
  const drafts = await client.fetch('*[_type == "treatment" && _id in path("drafts.**")]')
  const report = {
    dataset: DATASET,
    runAt: new Date().toISOString(),
    totalDraftsScanned: drafts.length,
    autoPublished: [],
    skipped: [],
    remainingDraftCount: 0,
  }

  for (const draftDoc of drafts) {
    const pubId = draftDoc._id.replace(/^drafts\./, '')
    const pubDoc = await client.fetch('*[_id == $id][0]', {id: pubId})

    if (!pubDoc) {
      report.skipped.push({
        id: pubId,
        title: pickTitle(draftDoc),
        reason: 'No published twin exists (draft-only document).',
      })
      continue
    }

    const a = normalize(stripMeta(draftDoc))
    const b = normalize(stripMeta(pubDoc))
    const diffs = diffTop(a, b)

    // Only semantic no-op drafts are auto-published.
    if (diffs.length === 0) {
      await publishDraftPair(pubId, draftDoc)
      report.autoPublished.push({
        id: pubId,
        title: pickTitle(draftDoc),
        reason: 'Semantic no-op draft (key/i18n/studio normalization only).',
      })
    } else {
      report.skipped.push({
        id: pubId,
        title: pickTitle(draftDoc),
        reason: reasonForSkip(diffs),
        changedFields: diffs,
      })
    }
  }

  report.remainingDraftCount = await client.fetch(
    'count(*[_type == "treatment" && _id in path("drafts.**")])',
  )

  const reportJsonPath = path.join(ROOT, 'docs', 'TREATMENT_AUTO_RESOLVE_REPORT.json')
  writeFileSync(reportJsonPath, JSON.stringify(report, null, 2))

  const reportMdPath = path.join(ROOT, 'docs', 'TREATMENT_AUTO_RESOLVE_REPORT.md')
  const md = [
    '# Treatment Draft Auto Resolve Report',
    '',
    `- Dataset: \`${report.dataset}\``,
    `- Run at: ${report.runAt}`,
    `- Drafts scanned: **${report.totalDraftsScanned}**`,
    `- Auto-published: **${report.autoPublished.length}**`,
    `- Skipped: **${report.skipped.length}**`,
    `- Remaining draft count: **${report.remainingDraftCount}**`,
    '',
    '## Auto-published documents',
    '',
    ...(report.autoPublished.length
      ? report.autoPublished.map((x) => `- \`${x.id}\` — ${x.title}: ${x.reason}`)
      : ['- None']),
    '',
    '## Skipped documents',
    '',
    ...(report.skipped.length
      ? report.skipped.map((x) =>
          `- \`${x.id}\` — ${x.title}: ${x.reason}${x.changedFields ? ` (fields: ${x.changedFields.map((f) => f.field).join(', ')})` : ''}`,
        )
      : ['- None']),
    '',
    '_This script is idempotent: reruns only publish semantic no-op drafts and leave semantic changes untouched._',
  ].join('\n')
  writeFileSync(reportMdPath, md)

  console.log(JSON.stringify({
    totalDraftsScanned: report.totalDraftsScanned,
    autoPublished: report.autoPublished.length,
    skipped: report.skipped.length,
    remainingDraftCount: report.remainingDraftCount,
    reportMdPath,
    reportJsonPath,
  }, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
