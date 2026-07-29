/**
 * Unify Treatment insurance with Treatment Category workflow.
 *
 * - Adds/updates pageSectionInsurance band on each treatment
 * - Links to existing insuranceCollection when partner pack matches (no duplicates)
 * - Copies legacy Page Content fields into band Legacy / Advanced for title override
 * - Never deletes top-level insuranceTitle / insurancePartners
 *
 * Usage:
 *   cd test
 *   npm run migrate:treatment-insurance:dry
 *   npm run migrate:treatment-insurance
 */
import {createHash} from 'crypto'
import {writeFileSync} from 'fs'
import path from 'path'
import {sanityClient as client, DATASET} from './config'
import {pickNo} from '../schemaTypes/i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const INSURANCE_BAND_KEY = 'ps-insurance'

type Partner = {
  _key?: string
  key?: string
  label?: unknown
}

type SectionRaw = {
  _key?: string
  _type?: string
  eyebrow?: unknown
  title?: unknown
  partners?: Partner[] | null
  insuranceCollection?: {_ref?: string} | null
  [extra: string]: unknown
}

type TreatmentDoc = {
  _id: string
  title?: unknown
  insuranceEyebrow?: unknown
  insuranceTitle?: unknown
  insurancePartners?: Partner[] | null
  pageSections?: SectionRaw[] | null
  categoryId?: string
}

type CollectionDoc = {
  _id: string
  internalName?: string
  title?: unknown
  partners?: Partner[] | null
}

type Report = {
  dataset: string
  dryRun: boolean
  startedAt: string
  finishedAt?: string
  collectionsReused: string[]
  collectionsCreated: string[]
  treatmentsPatched: number
  treatmentsSkipped: number
  bandsInserted: number
  bandsUpdated: number
  draftsSynced: number
  reusedCollectionId: string | null
  pagesMigrated: Array<{pageId: string; label: string; collectionId: string; action: string}>
  idempotency?: {secondPassPatches: number}
  usedOnVerification?: Array<{collectionId: string; incomingCount: number; expected: number}>
  errors: string[]
}

function plain(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  const fromI18n = pickNo(value)
  if (typeof fromI18n === 'string') return fromI18n.trim()
  return String(value).trim()
}

function fingerprintHash(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16)
}

function normalizePartners(partners: Partner[] | null | undefined) {
  return (partners || [])
    .map((p) => ({
      key: (p.key || '').trim(),
      label: plain(p.label),
    }))
    .filter((p) => p.key)
}

function contentFingerprint(title: unknown, partners: Partner[] | null | undefined) {
  const ps = normalizePartners(partners)
  return fingerprintHash({title: plain(title), partners: ps})
}

function partnersFingerprint(partners: Partner[] | null | undefined) {
  return fingerprintHash({partners: normalizePartners(partners)})
}

function clonePartners(partners: Partner[] | null | undefined): Partner[] {
  if (!Array.isArray(partners)) return []
  return partners
    .filter((p) => p && (p.key || '').trim())
    .map((p, i) => ({
      _type: 'object',
      _key: p._key || `partner-${i}-${(p.key || '').trim()}`,
      key: (p.key || '').trim(),
      label: p.label,
    }))
}

function pageLabel(doc: TreatmentDoc): string {
  return plain(doc.title) || doc._id
}

function matchCollectionId(
  treatment: TreatmentDoc,
  collections: CollectionDoc[],
): string | null {
  const partners = treatment.insurancePartners
  if (!normalizePartners(partners).length) return null

  const fullFp = contentFingerprint(treatment.insuranceTitle, partners)
  for (const col of collections) {
    if (contentFingerprint(col.title, col.partners) === fullFp) return col._id
  }

  const partnerFp = partnersFingerprint(partners)
  for (const col of collections) {
    if (partnersFingerprint(col.partners) === partnerFp) return col._id
  }

  return null
}

function buildInsuranceBand(treatment: TreatmentDoc, collectionId: string): SectionRaw {
  return {
    _key: INSURANCE_BAND_KEY,
    _type: 'pageSectionInsurance',
    insuranceCollection: {_type: 'reference', _ref: collectionId},
    eyebrow: treatment.insuranceEyebrow ?? undefined,
    title: treatment.insuranceTitle ?? undefined,
    partners: clonePartners(treatment.insurancePartners),
  }
}

function upsertInsuranceBand(
  sections: SectionRaw[] | null | undefined,
  band: SectionRaw,
): {sections: SectionRaw[]; changed: boolean; inserted: boolean; updated: boolean} {
  const next = Array.isArray(sections) ? [...sections] : []
  const idx = next.findIndex((s) => s?._type === 'pageSectionInsurance')

  if (idx >= 0) {
    const existing = next[idx]
    const sameRef = existing.insuranceCollection?._ref === band.insuranceCollection?._ref
    if (sameRef && existing._key) {
      return {sections: next, changed: false, inserted: false, updated: false}
    }
    next[idx] = {
      ...band,
      _key: existing._key || INSURANCE_BAND_KEY,
    }
    return {sections: next, changed: true, inserted: false, updated: true}
  }

  let insertAt = next.length
  for (let i = 0; i < next.length; i++) {
    const type = next[i]?._type
    if (type === 'pageSectionArticles' || type === 'pageSectionBookingCta') {
      insertAt = i
      break
    }
  }
  next.splice(insertAt, 0, band)
  return {sections: next, changed: true, inserted: true, updated: false}
}

async function patchTreatment(
  treatment: TreatmentDoc,
  collectionId: string,
  report: Report,
): Promise<void> {
  const band = buildInsuranceBand(treatment, collectionId)
  const pubResult = upsertInsuranceBand(treatment.pageSections, band)

  if (!pubResult.changed) {
    report.treatmentsSkipped++
    return
  }

  if (pubResult.inserted) report.bandsInserted++
  if (pubResult.updated) report.bandsUpdated++

  const draftId = `drafts.${treatment._id}`
  const draft = await client.fetch<{pageSections?: SectionRaw[] | null} | null>(
    `*[_id == $id][0]{ pageSections }`,
    {id: draftId},
  )

  if (DRY_RUN) {
    report.treatmentsPatched++
    report.pagesMigrated.push({
      pageId: treatment._id,
      label: pageLabel(treatment),
      collectionId,
      action: pubResult.inserted ? 'inserted-band' : 'updated-band',
    })
    if (draft) report.draftsSynced++
    return
  }

  const tx = client.transaction()
  tx.patch(treatment._id, (p) => p.set({pageSections: pubResult.sections}))

  if (draft) {
    const draftResult = upsertInsuranceBand(draft.pageSections, band)
    tx.patch(draftId, (p) =>
      p.set({pageSections: draftResult.sections}),
    )
    report.draftsSynced++
  }

  await tx.commit({visibility: 'async'})
  report.treatmentsPatched++
  report.pagesMigrated.push({
    pageId: treatment._id,
    label: pageLabel(treatment),
    collectionId,
    action: pubResult.inserted ? 'inserted-band' : 'updated-band',
  })
}

async function verifyUsedOn(
  collectionId: string,
  expected: number,
): Promise<{collectionId: string; incomingCount: number; expected: number}> {
  const incomingCount = await client.fetch<number>(
    `count(*[!(_id in path("drafts.**")) && references($id)])`,
    {id: collectionId},
  )
  return {collectionId, incomingCount, expected}
}

/**
 * When no existing pack matches this treatment's partners, create one from
 * Production inline partners (structure migration — never invents partners).
 */
async function ensureInsuranceCollection(
  treatment: TreatmentDoc,
  collections: CollectionDoc[],
  report: Report,
): Promise<string | null> {
  const matched = matchCollectionId(treatment, collections)
  if (matched) return matched

  const partners = normalizePartners(treatment.insurancePartners)
  if (!partners.length) return null

  const hash = partnersFingerprint(treatment.insurancePartners)
  const collectionId = `migrated-insurance-collection.treatment.${hash}`
  const existing = collections.find((c) => c._id === collectionId)
  if (existing) return existing._id

  const title =
    plain(treatment.insuranceTitle) ||
    `Treatment insurance pack ${hash.slice(0, 8)}`
  const doc = {
    _id: collectionId,
    _type: 'insuranceCollection',
    internalName: `Treatment partners ${hash.slice(0, 8)}`,
    title,
    partners: clonePartners(treatment.insurancePartners),
    description:
      'Created from Production treatment.insurancePartners (structure migration). Legacy fields preserved on treatments.',
    notes: `migration: migrate-treatment-insurance-unification.ts; fingerprint: ${hash}`,
  }

  if (DRY_RUN) {
    console.log(`[dry-run] create insuranceCollection ${collectionId} partners=${partners.length}`)
  } else {
    await client.createOrReplace(doc)
    console.log(`Created insuranceCollection ${collectionId} partners=${partners.length}`)
  }

  collections.push({
    _id: collectionId,
    internalName: doc.internalName,
    title: doc.title,
    partners: doc.partners,
  })
  if (!report.collectionsCreated.includes(collectionId)) {
    report.collectionsCreated.push(collectionId)
  }
  return collectionId
}

async function runPass(report: Report, collections: CollectionDoc[]): Promise<number> {
  const treatments = await client.fetch<TreatmentDoc[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      insuranceEyebrow,
      insuranceTitle,
      insurancePartners[]{ _key, key, label },
      pageSections[]{ _key, _type, eyebrow, title, partners[]{ _key, key, label }, insuranceCollection },
      "categoryId": category->categoryId
    }`,
  )

  let patches = 0
  for (const treatment of treatments) {
    const collectionId = await ensureInsuranceCollection(treatment, collections, report)
    if (!collectionId) {
      // Empty partners — nothing to link; not an error for structure migration
      report.treatmentsSkipped++
      continue
    }

    if (!report.reusedCollectionId) report.reusedCollectionId = collectionId
    if (
      !report.collectionsReused.includes(collectionId) &&
      !report.collectionsCreated.includes(collectionId)
    ) {
      report.collectionsReused.push(collectionId)
    }

    const before = report.treatmentsPatched
    await patchTreatment(treatment, collectionId, report)
    if (report.treatmentsPatched > before) patches++
  }

  return patches
}

async function main() {
  const report: Report = {
    dataset: DATASET,
    dryRun: DRY_RUN,
    startedAt: new Date().toISOString(),
    collectionsReused: [],
    collectionsCreated: [],
    treatmentsPatched: 0,
    treatmentsSkipped: 0,
    bandsInserted: 0,
    bandsUpdated: 0,
    draftsSynced: 0,
    reusedCollectionId: null,
    pagesMigrated: [],
    errors: [],
  }

  const collections = await client.fetch<CollectionDoc[]>(
    `*[_type == "insuranceCollection" && !(_id in path("drafts.**"))]{
      _id, internalName, title, partners[]{ key, label }
    }`,
  )

  console.log(`\nTreatment insurance unification — dataset: ${DATASET}`)
  console.log(`Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const firstPatches = await runPass(report, collections)

  if (!DRY_RUN) {
    const secondReport: Report = {
      ...report,
      treatmentsPatched: 0,
      treatmentsSkipped: 0,
      bandsInserted: 0,
      bandsUpdated: 0,
      draftsSynced: 0,
      pagesMigrated: [],
      errors: [],
    }
    const secondPatches = await runPass(secondReport, collections)
    report.idempotency = {secondPassPatches: secondPatches}
  }

  if (report.reusedCollectionId) {
    const categoryCount = await client.fetch<number>(
      `count(*[_type == "treatmentCategory" && !(_id in path("drafts.**")) && count(pageSections[_type == "pageSectionInsurance" && insuranceCollection._ref == $id]) > 0])`,
      {id: report.reusedCollectionId},
    )
    const treatmentCount = report.treatmentsPatched + report.treatmentsSkipped
    report.usedOnVerification = [
      await verifyUsedOn(report.reusedCollectionId, categoryCount + treatmentCount),
    ]
  }

  report.finishedAt = new Date().toISOString()

  const jsonPath = path.join(process.cwd(), '..', 'docs', 'TREATMENT_INSURANCE_UNIFICATION_REPORT.json')
  writeFileSync(jsonPath, JSON.stringify(report, null, 2))

  console.log(`Treatments patched:  ${report.treatmentsPatched}`)
  console.log(`Treatments skipped:  ${report.treatmentsSkipped} (already linked)`)
  console.log(`Bands inserted:      ${report.bandsInserted}`)
  console.log(`Bands updated:       ${report.bandsUpdated}`)
  console.log(`Collections reused:  ${report.collectionsReused.join(', ') || '(none)'}`)
  console.log(`Collections created: ${report.collectionsCreated.length}`)
  console.log(`Drafts synced:       ${report.draftsSynced}`)
  if (report.idempotency) {
    console.log(`Idempotency 2nd pass patches: ${report.idempotency.secondPassPatches}`)
  }
  if (report.usedOnVerification?.length) {
    for (const row of report.usedOnVerification) {
      console.log(
        `Used On ${row.collectionId}: ${row.incomingCount} (expected ≥ ${row.expected})`,
      )
    }
  }
  if (report.errors.length) {
    console.log(`Errors: ${report.errors.length}`)
    report.errors.forEach((e) => console.log(`  - ${e}`))
  }
  console.log(`\nJSON: ${jsonPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
