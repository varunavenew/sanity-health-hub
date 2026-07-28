/**
 * Phase 1 Task 1 — Remove ONLY Category A orphan fields (developer dataset).
 *
 * Category A = not in current schema AND never read by GROQ / React.
 * Category B/C are NEVER unset by this script.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/cleanup-unknown-fields-category-a.ts
 *   npx tsx sanity/cleanup-unknown-fields-category-a.ts
 *
 * Idempotent. Preserves documents, IDs, drafts, references, ordering.
 */
import {writeFileSync} from 'fs'
import {resolve} from 'path'
import {DATASET, PROJECT_ID, sanityClient} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

/** Root-level Category A fields by document type. */
const ROOT_CATEGORY_A: Record<string, string[]> = {
  homepage: ['heroImage'],
  article: ['pinned', 'featured'],
  bookingPage: [
    'step4DurationPrefix',
    'step4LoadingTimes',
    'step4NoDaysLabel',
    'step4PickTimeLabel',
    'step4TodayLabel',
  ],
  newsPage: [
    'filterAllLabel',
    'filterArticlesLabel',
    'filterMediaLabel',
    'filterPatientStoriesLabel',
    'filterUpdatesLabel',
    'featuredSpecialists',
    'showSocialSection',
  ],
  servicesPage: [
    'categories',
    'faqCategory',
    'loadingLabel',
    'pageErrorMessage',
  ],
}

type Change = {
  docId: string
  docType: string
  paths: string[]
  isDraft: boolean
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

/** Nested Category A: treatment.linkedServices[].image / imageAlt */
function linkedServicesImagePaths(doc: Record<string, unknown>): string[] {
  const list = doc.linkedServices
  if (!Array.isArray(list)) return []
  const paths: string[] = []
  for (const item of list) {
    if (!isRecord(item)) continue
    const key = typeof item._key === 'string' ? item._key : null
    if (!key) continue
    if ('image' in item) paths.push(`linkedServices[_key=="${key}"].image`)
    if ('imageAlt' in item) paths.push(`linkedServices[_key=="${key}"].imageAlt`)
  }
  return paths
}

async function main() {
  console.log(
    `\nCategory A unknown-field cleanup\n  Project: ${PROJECT_ID}\n  Dataset: ${DATASET}\n  Dry run: ${DRY_RUN}\n`,
  )

  if (DATASET !== 'developer') {
    throw new Error(`Refusing to mutate non-developer dataset: ${DATASET}`)
  }

  const types = Object.keys(ROOT_CATEGORY_A)
  const docs = await sanityClient.fetch<
    Array<Record<string, unknown> & {_id: string; _type: string}>
  >(`*[_type in $types]`, {types: [...types, 'treatment']})

  const changes: Change[] = []
  let patchCount = 0

  for (const doc of docs) {
    const paths: string[] = []
    const rootFields = ROOT_CATEGORY_A[doc._type] || []
    for (const field of rootFields) {
      if (Object.prototype.hasOwnProperty.call(doc, field)) {
        paths.push(field)
      }
    }

    if (doc._type === 'treatment') {
      paths.push(...linkedServicesImagePaths(doc))
    }

    if (!paths.length) continue

    const isDraft = doc._id.startsWith('drafts.')
    changes.push({
      docId: doc._id,
      docType: doc._type,
      paths: [...paths],
      isDraft,
    })

    console.log(
      `  ${DRY_RUN ? 'WOULD unset' : 'unset'} ${doc._type} ${doc._id}: ${paths.join(', ')}`,
    )

    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).unset(paths).commit({autoGenerateArrayKeys: false})
      patchCount += 1
    }
  }

  const byType = new Map<string, number>()
  const byField = new Map<string, number>()
  for (const c of changes) {
    byType.set(c.docType, (byType.get(c.docType) || 0) + 1)
    for (const p of c.paths) {
      const field = p.includes('.') ? p.split('.').pop()! : p.replace(/\[.*$/, '')
      // normalize linkedServices paths
      const label = p.includes('linkedServices')
        ? p.includes('imageAlt')
          ? 'linkedServices[].imageAlt'
          : 'linkedServices[].image'
        : p
      byField.set(label, (byField.get(label) || 0) + 1)
    }
  }

  const report = {
    cleanedAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    dryRun: DRY_RUN,
    documentsPatched: DRY_RUN ? 0 : patchCount,
    documentsWouldPatch: changes.length,
    byType: Object.fromEntries(byType),
    byField: Object.fromEntries(byField),
    changes,
  }

  const outPath = resolve(
    process.cwd(),
    '../docs/_unknown-fields-category-a-cleanup.json',
  )
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(
    `\n${DRY_RUN ? 'Dry run complete' : 'Cleanup complete'}: ${changes.length} document(s), ${changes.reduce((n, c) => n + c.paths.length, 0)} path(s)`,
  )
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
