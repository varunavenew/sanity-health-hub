/**
 * Sync treatment page UI fields from developer → production.
 *
 * Idempotent: only fills empty / thin fields on production.
 * Does NOT overwrite non-empty production content.
 *
 * Usage (from test/):
 *   DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production \
 *     npx tsx sanity/sync-treatments-developer-to-production.ts
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production \
 *     npx tsx sanity/sync-treatments-developer-to-production.ts
 *   ONLY_IDS=treatment-fertilitet-assistert-befruktning ...
 */
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {createClient, type SanityClient} from '@sanity/client'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})

const DRY_RUN = process.env.DRY_RUN === '1'
const ONLY_IDS = (process.env.ONLY_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const PROJECT_ID =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  ''
const TOKEN = process.env.SANITY_TOKEN?.trim() || ''

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing SANITY_PROJECT_ID / SANITY_TOKEN')
  process.exit(1)
}
if (process.env.ALLOW_PRODUCTION_MIGRATION !== 'true') {
  console.error('Refusing: set ALLOW_PRODUCTION_MIGRATION=true')
  process.exit(1)
}

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: TOKEN,
  })
}

const DEFAULT_CONVERSATION_CTA = [
  {
    _key: 'no',
    _type: 'internationalizedArrayStringValue',
    language: 'no',
    value: 'Snakk med en av våre spesialister',
  },
  {
    _key: 'en',
    _type: 'internationalizedArrayStringValue',
    language: 'en',
    value: 'Talk to one of our specialists',
  },
]

const UI_FIELDS = [
  'heroTitle',
  'heroDescription',
  'description',
  'eyebrow',
  'rating',
  'heroPrice',
  'heroAvailability',
  'primaryCtaLabel',
  'bookingService',
  'heroThemes',
  'heroPoints',
  'reasonsTitle',
  'reasonsLead',
  'reasonsLead2',
  'reasonsLayout',
  'reasons',
  'flowTitle',
  'flow',
  'flowImage',
  'flowImageAlt',
  'flowLinkLabel',
  'flowLinkHref',
  'promises',
  'expertAreas',
  'textSection',
  'relatedSection',
  'conversationCtaTitle',
  'ctaTitle',
  'ctaDescription',
  'insuranceEyebrow',
  'insuranceTitle',
  'insurancePartners',
  'faqSectionTitle',
  'pageSections',
  'seePricesLabel',
  'seePricesHref',
  'callCtaLabel',
  'homeBreadcrumbLabel',
] as const

type Doc = Record<string, unknown> & {_id: string}

function i18nHasValue(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (!Array.isArray(value)) return false
  return value.some((row) => {
    if (!row || typeof row !== 'object') return false
    const v = (row as {value?: unknown}).value
    if (typeof v === 'string') return v.trim().length > 0
    if (v && typeof v === 'object' && 'current' in (v as object)) {
      return Boolean(String((v as {current?: unknown}).current || '').trim())
    }
    return Boolean(v)
  })
}

function arrayLen(value: unknown): number {
  return Array.isArray(value) ? value.length : 0
}

function isEmptyField(key: string, value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (key === 'heroThemes' || key === 'heroPoints' || key === 'reasons' || key === 'flow' || key === 'promises' || key === 'insurancePartners' || key === 'pageSections') {
    return arrayLen(value) === 0
  }
  if (key === 'relatedSection') {
    if (!value || typeof value !== 'object') return true
    const items = (value as {items?: unknown}).items
    return arrayLen(items) === 0
  }
  if (key === 'expertAreas') {
    if (!value || typeof value !== 'object') return true
    const items = (value as {items?: unknown}).items
    return arrayLen(items) === 0 && !i18nHasValue((value as {title?: unknown}).title)
  }
  if (key === 'textSection') {
    if (!value || typeof value !== 'object') return true
    const t = value as {title?: unknown; lead?: unknown; points?: unknown; image?: unknown}
    return (
      !i18nHasValue(t.title) &&
      !i18nHasValue(t.lead) &&
      arrayLen(t.points) === 0 &&
      !t.image
    )
  }
  if (typeof value === 'boolean' || typeof value === 'number') return false
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) {
    // i18n shells with empty values
    if (value.length === 0) return true
    if (value.every((row) => row && typeof row === 'object' && 'language' in (row as object))) {
      return !i18nHasValue(value)
    }
    return false
  }
  if (typeof value === 'object') {
    // image / reference
    if ('_type' in (value as object) || '_ref' in (value as object) || 'asset' in (value as object)) {
      return false
    }
    return !i18nHasValue(value) && Object.keys(value as object).length === 0
  }
  return false
}

function isRicher(key: string, source: unknown, target: unknown): boolean {
  if (!isEmptyField(key, target)) return false
  return !isEmptyField(key, source)
}

async function main() {
  const source = clientFor('developer')
  const target = clientFor('production')

  console.log(`Sync treatments developer → production (DRY_RUN=${DRY_RUN ? '1' : '0'})`)

  const projection = ['_id', ...UI_FIELDS].join(', ')
  let sourceDocs = await source.fetch<Doc[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{ ${projection} }`,
  )
  if (ONLY_IDS.length) {
    sourceDocs = sourceDocs.filter((d) => ONLY_IDS.includes(d._id))
  }

  const targetDocs = await target.fetch<Doc[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{ ${projection} }`,
  )
  const targetById = new Map(targetDocs.map((d) => [d._id, d]))

  let updated = 0
  let skippedMissing = 0
  let skippedNoChange = 0
  const report: Array<{id: string; fields: string[]}> = []

  for (const src of sourceDocs) {
    const dst = targetById.get(src._id)
    if (!dst) {
      skippedMissing++
      continue
    }

    const patch: Record<string, unknown> = {}
    for (const key of UI_FIELDS) {
      if (isRicher(key, src[key], dst[key])) {
        patch[key] = src[key]
      }
    }

    // Prefer richer reasons/promises even if production has thin stub (1 item vs many)
    for (const key of ['reasons', 'promises', 'heroPoints', 'flow'] as const) {
      const srcLen = arrayLen(src[key])
      const dstLen = arrayLen(dst[key])
      if (srcLen > dstLen && srcLen >= 2 && dstLen <= 1) {
        patch[key] = src[key]
        if (key === 'reasons') {
          if (src.reasonsLead !== undefined) patch.reasonsLead = src.reasonsLead
          if (src.reasonsLead2 !== undefined) patch.reasonsLead2 = src.reasonsLead2
          if (src.reasonsLayout !== undefined) patch.reasonsLayout = src.reasonsLayout
          if (src.reasonsTitle !== undefined && isEmptyField('reasonsTitle', dst.reasonsTitle)) {
            patch.reasonsTitle = src.reasonsTitle
          }
        }
      }
    }

    // relatedSection: replace empty / thin with developer curated list
    const srcRelated = src.relatedSection as {items?: unknown[]} | null
    const dstRelated = dst.relatedSection as {items?: unknown[]} | null
    if (arrayLen(srcRelated?.items) > arrayLen(dstRelated?.items)) {
      patch.relatedSection = src.relatedSection
    }

    // pageSections: if production missing booking CTA but developer has it, merge types
    const srcSections = (src.pageSections as Array<{_type?: string}> | undefined) || []
    const dstSections = (dst.pageSections as Array<{_type?: string}> | undefined) || []
    const dstTypes = new Set(dstSections.map((s) => s._type).filter(Boolean))
    const missingSections = srcSections.filter((s) => s._type && !dstTypes.has(s._type))
    if (missingSections.length > 0) {
      patch.pageSections = [...dstSections, ...missingSections]
    }

    // Mid-page conversion band title — promote hardcoded default into CMS when empty
    if (isEmptyField('conversationCtaTitle', patch.conversationCtaTitle ?? dst.conversationCtaTitle)) {
      const fromSrc = src.conversationCtaTitle
      patch.conversationCtaTitle = isEmptyField('conversationCtaTitle', fromSrc)
        ? DEFAULT_CONVERSATION_CTA
        : fromSrc
    }

    const fields = Object.keys(patch)
    if (!fields.length) {
      skippedNoChange++
      continue
    }

    report.push({id: src._id, fields})
    console.log(`→ ${src._id}: ${fields.join(', ')}`)
    if (!DRY_RUN) {
      await target.patch(src._id).set(patch).commit({autoGenerateArrayKeys: true})
      // Keep developer mid-page CTA CMS-driven too (was previously hardcoded in layout)
      if (
        patch.conversationCtaTitle &&
        isEmptyField('conversationCtaTitle', src.conversationCtaTitle)
      ) {
        await source
          .patch(src._id)
          .set({conversationCtaTitle: patch.conversationCtaTitle})
          .commit({autoGenerateArrayKeys: true})
      }
      updated++
    }
  }

  console.log('\nSummary')
  console.log(`  source treatments: ${sourceDocs.length}`)
  console.log(`  would update / updated: ${report.length}${DRY_RUN ? ' (dry-run)' : ` (wrote ${updated})`}`)
  console.log(`  missing on production: ${skippedMissing}`)
  console.log(`  already complete: ${skippedNoChange}`)
  console.log(JSON.stringify(report, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
