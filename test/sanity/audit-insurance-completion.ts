/**
 * Phase 4 Insurance completion audit — definitive read-only report.
 * Audits pageSectionInsurance bands AND treatment top-level insurance fields.
 */
import {createHash} from 'crypto'
import {writeFileSync} from 'fs'
import path from 'path'
import {sanityClient as client, DATASET} from './config'
import {pickNo} from '../schemaTypes/i18n'

type Partner = {key?: string; label?: unknown}

function plain(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  const fromI18n = pickNo(value)
  if (typeof fromI18n === 'string') return fromI18n.trim()
  return String(value).trim()
}

function pageLabel(doc: {title?: unknown; name?: string; _id: string}): string {
  return plain(doc.title) || doc.name?.trim() || doc._id
}

function fingerprintHash(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16)
}

function insuranceContentFingerprint(title: unknown, partners: Partner[] | null | undefined) {
  const normalizedPartners = (partners || [])
    .map((p) => ({
      key: (p.key || '').trim(),
      label: plain(p.label),
    }))
    .filter((p) => p.key)

  const payload = {
    title: plain(title),
    partners: normalizedPartners,
  }

  return {
    hash: fingerprintHash(payload),
    usable: normalizedPartners.length > 0,
    payload,
    summary: normalizedPartners.length
      ? `${payload.title || '(no title)'} · ${normalizedPartners.length} partners [${normalizedPartners.map((p) => p.key).join(', ')}]`
      : '(empty partners)',
  }
}

async function main() {
  const bandDocs = await client.fetch<
    Array<{
      _id: string
      _type: string
      title?: unknown
      name?: string
      pageSections?: Array<{
        _key?: string
        _type?: string
        eyebrow?: unknown
        title?: unknown
        partners?: Partner[]
        insuranceCollection?: {_ref?: string}
      }>
    }>
  >(
    `*[defined(pageSections) && count(pageSections) > 0 && !(_id in path("drafts.**"))]{
      _id,
      _type,
      title,
      name,
      pageSections[]{
        _key,
        _type,
        eyebrow,
        title,
        partners[]{ key, label },
        insuranceCollection
      }
    }`,
  )

  const treatments = await client.fetch<
    Array<{
      _id: string
      title?: unknown
      insuranceEyebrow?: unknown
      insuranceTitle?: unknown
      insurancePartners?: Partner[]
      pageSectionTypes?: string[]
    }>
  >(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      insuranceEyebrow,
      insuranceTitle,
      insurancePartners[]{ key, label },
      "pageSectionTypes": pageSections[]._type
    }`,
  )

  const treatmentWithInsuranceBand = treatments.filter((t) =>
    (t.pageSectionTypes || []).includes('pageSectionInsurance'),
  ).length

  const collections = await client.fetch<
    Array<{
      _id: string
      internalName?: string
      title?: unknown
      partners?: Partner[]
    }>
  >(
    `*[_type == "insuranceCollection" && !(_id in path("drafts.**"))]{
      _id,
      internalName,
      title,
      partners[]{ key, label }
    }`,
  )

  const collectionByHash = new Map<string, (typeof collections)[0]>()
  for (const col of collections) {
    const fp = insuranceContentFingerprint(col.title, col.partners)
    collectionByHash.set(fp.hash, col)
  }

  type BandHit = {
    pageId: string
    pageType: string
    pageLabel: string
    sectionKey: string
    eyebrow: string
    fingerprint: string
    summary: string
    linkedRef: string | null
    expectedCollectionId: string
    reusableCollectionId: string | null
    reusableCollectionName: string | null
    needsLink: boolean
  }

  const bands: BandHit[] = []
  const bandsByType: Record<string, number> = {}
  let emptyBands = 0

  for (const doc of bandDocs) {
    for (const section of doc.pageSections || []) {
      if (section._type !== 'pageSectionInsurance') continue

      bandsByType[doc._type] = (bandsByType[doc._type] || 0) + 1
      const fp = insuranceContentFingerprint(section.title, section.partners)
      if (!fp.usable) {
        emptyBands++
        continue
      }

      const linkedRef = section.insuranceCollection?._ref?.trim() || null
      const existing = collectionByHash.get(fp.hash)
      const expectedId = `migrated-insurance-collection.${fp.hash}`

      bands.push({
        pageId: doc._id,
        pageType: doc._type,
        pageLabel: pageLabel(doc),
        sectionKey: section._key || '',
        eyebrow: plain(section.eyebrow),
        fingerprint: fp.hash,
        summary: fp.summary,
        linkedRef,
        expectedCollectionId: expectedId,
        reusableCollectionId: existing?._id || null,
        reusableCollectionName: existing?.internalName || null,
        needsLink: !linkedRef && Boolean(existing),
      })
    }
  }

  const bandClusters = new Map<string, {bands: BandHit[]; byType: Record<string, number>}>()
  for (const band of bands) {
    const cluster = bandClusters.get(band.fingerprint) || {bands: [], byType: {}}
    cluster.bands.push(band)
    cluster.byType[band.pageType] = (cluster.byType[band.pageType] || 0) + 1
    bandClusters.set(band.fingerprint, cluster)
  }

  const treatmentClusters = new Map<
    string,
    {count: number; ids: string[]; title: string; partnersOnlyHash: string}
  >()

  for (const t of treatments) {
    const fp = insuranceContentFingerprint(t.insuranceTitle, t.insurancePartners)
    if (!fp.usable) continue

    const partnersOnlyHash = fingerprintHash({partners: fp.payload.partners})
    const cluster = treatmentClusters.get(fp.hash) || {
      count: 0,
      ids: [],
      title: String(fp.payload.title),
      partnersOnlyHash,
    }
    cluster.count++
    cluster.ids.push(t._id)
    treatmentClusters.set(fp.hash, cluster)
  }

  const standardCollection = collectionByHash.get('48bdfe01f72a4925')
  const graviditetCollection = collectionByHash.get('9b0c4e7de35caafd')

  const patchPlan = bands.filter((b) => b.needsLink)
  const unlinkedBands = bands.filter((b) => !b.linkedRef)
  const wrongLinks = bands.filter(
    (b) => b.linkedRef && b.linkedRef !== b.expectedCollectionId,
  )

  const newlyRequiredCollections = [...bandClusters.entries()].filter(([hash, cluster]) => {
    const hasExisting = collectionByHash.has(hash)
    const hasUnlinked = cluster.bands.some((b) => !b.linkedRef)
    return !hasExisting && hasUnlinked
  })

  const existingWithUsedOn = await Promise.all(
    collections.map(async (c) => {
      const fp = insuranceContentFingerprint(c.title, c.partners)
      const cluster = bandClusters.get(fp.hash)
      const usedOn = await client.fetch<number>(
        `count(*[!(_id in path("drafts.**")) && references($id)])`,
        {id: c._id},
      )
      return {
        _id: c._id,
        internalName: c.internalName,
        fingerprint: fp.hash,
        summary: insuranceContentFingerprint(c.title, c.partners).summary,
        bandsInAudit: cluster?.bands.length || 0,
        bandsByType: cluster?.byType || {},
        usedOnCount: usedOn,
      }
    }),
  )

  const report = {
    dataset: DATASET,
    auditedAt: new Date().toISOString(),
    fingerprintRules: {
      included: ['title', 'partners (key + label)', 'partner ordering'],
      excluded: ['eyebrow', 'page id', 'section key', 'document id'],
    },
    pageSectionInsurance: {
      totalBandsAllTypes: Object.values(bandsByType).reduce((a, b) => a + b, 0) + emptyBands,
      totalBandsUsable: bands.length,
      emptyBands,
      bandsByDocumentType: bandsByType,
      linkedBands: bands.filter((b) => b.linkedRef).length,
      unlinkedBands: unlinkedBands.length,
      uniqueFingerprints: bandClusters.size,
      clusters: [...bandClusters.entries()].map(([hash, cluster]) => ({
        fingerprint: hash,
        summary: cluster.bands[0]?.summary,
        bandCount: cluster.bands.length,
        byType: cluster.byType,
        collectionId: collectionByHash.get(hash)?._id || `migrated-insurance-collection.${hash}`,
        collectionName: collectionByHash.get(hash)?.internalName || null,
        allLinked: cluster.bands.every((b) => b.linkedRef),
        pages: cluster.bands.map((b) => ({
          pageId: b.pageId,
          pageType: b.pageType,
          pageLabel: b.pageLabel,
          sectionKey: b.sectionKey,
          linkedRef: b.linkedRef,
          eyebrow: b.eyebrow,
        })),
      })),
    },
    treatmentLegacyInsurance: {
      note:
        'Treatment pages store insurance in Page Content fields (insuranceTitle, insurancePartners), not in pageSectionInsurance bands. Frontend renders via SubTreatmentLayout — not PageSectionsRenderer / dual-read.',
      totalTreatments: treatments.length,
      withTopLevelPartners: [...treatmentClusters.values()].reduce((a, c) => a + c.count, 0),
      withPageSectionInsuranceBand: treatmentWithInsuranceBand,
      uniqueFingerprints: treatmentClusters.size,
      clusters: [...treatmentClusters.entries()].map(([hash, cluster]) => {
        const partnersMatchStandard =
          cluster.partnersOnlyHash ===
          fingerprintHash({
            partners: insuranceContentFingerprint(
              standardCollection?.title,
              standardCollection?.partners,
            ).payload.partners,
          })
        return {
          fingerprint: hash,
          title: cluster.title,
          treatmentCount: cluster.count,
          partnersMatchStandardCollection: partnersMatchStandard,
          matchesStandardFingerprint: hash === '48bdfe01f72a4925',
          matchesGraviditetFingerprint: hash === '9b0c4e7de35caafd',
          nearestCollection: partnersMatchStandard
            ? standardCollection?.internalName
            : hash === '9b0c4e7de35caafd'
              ? graviditetCollection?.internalName
              : null,
          sampleTreatmentIds: cluster.ids.slice(0, 5),
        }
      }),
    },
    existingInsuranceCollections: existingWithUsedOn,
    newlyRequiredInsuranceCollections: newlyRequiredCollections.map(([hash]) => ({
      fingerprint: hash,
      proposedId: `migrated-insurance-collection.${hash}`,
      reason: 'No published collection matches this fingerprint',
    })),
    patchPlan,
    wrongLinks,
    previousMigrationAssessment: {
      missedTreatmentPageSectionInsurance:
        treatmentWithInsuranceBand > 0 && unlinkedBands.some((b) => b.pageType === 'treatment'),
      treatmentPageSectionInsuranceBandsExist: treatmentWithInsuranceBand > 0,
      pageSectionInsuranceBandsComplete:
        unlinkedBands.length === 0 && wrongLinks.length === 0 && newlyRequiredCollections.length === 0,
      explanation:
        treatmentWithInsuranceBand === 0
          ? 'No treatment documents contain pageSectionInsurance bands on developer. Category insurance migration is complete. Treatment insurance uses a separate top-level legacy field path.'
          : 'Treatment pageSectionInsurance bands exist and require review.',
    },
    migrationRequired: {
      newCollections: newlyRequiredCollections.length,
      linkPatches: patchPlan.length,
      verdict:
        patchPlan.length === 0 && newlyRequiredCollections.length === 0
          ? 'NO_MIGRATION_REQUIRED — all pageSectionInsurance bands are linked; no new fingerprints'
          : 'MIGRATION_REQUIRED',
    },
    idempotencyNote:
      'Insurance link patches are idempotent: existing matching insuranceCollection refs are skipped.',
    draftSyncNote:
      'No new patches in this completion pass. Prior migration synced drafts on band patch.',
  }

  const jsonPath = path.join(process.cwd(), '..', 'docs', 'PHASE_4_INSURANCE_COMPLETION_AUDIT.json')
  writeFileSync(jsonPath, JSON.stringify(report, null, 2))

  console.log(JSON.stringify(report.migrationRequired, null, 2))
  console.log('\nBands by type:', report.pageSectionInsurance.bandsByDocumentType)
  console.log('\nTreatment legacy:', report.treatmentLegacyInsurance.clusters)
  console.log(`\nJSON: ${jsonPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
