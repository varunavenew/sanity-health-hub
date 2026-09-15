/**
 * Force-sync ONE treatment from developer → production:
 *   treatment-flere-fagomrader-robotkirurgi
 *
 * Overwrites production field content so it matches local Studio edits
 * (draft preferred over published on developer). Copies missing image/file
 * assets. Does not touch any other document.
 *
 * Usage (from test/):
 *   DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/sync-robotkirurgi-treatment-to-production.ts
 *   ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/sync-robotkirurgi-treatment-to-production.ts
 */
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {createClient, type SanityClient} from '@sanity/client'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const TREATMENT_ID = 'treatment-flere-fagomrader-robotkirurgi'

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

const SYSTEM_KEYS = new Set([
  '_id',
  '_rev',
  '_type',
  '_createdAt',
  '_updatedAt',
])

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: TOKEN,
  })
}

function collectAssetIds(value: unknown, out: Set<string>) {
  if (!value) return
  if (Array.isArray(value)) {
    for (const item of value) collectAssetIds(item, out)
    return
  }
  if (typeof value !== 'object') return
  const row = value as Record<string, unknown>
  const ref = row._ref
  if (
    typeof ref === 'string' &&
    (ref.startsWith('image-') || ref.startsWith('file-'))
  ) {
    out.add(ref)
  }
  for (const child of Object.values(row)) collectAssetIds(child, out)
}

function remapAssets(value: unknown, map: Map<string, string>): unknown {
  if (!value) return value
  if (Array.isArray(value)) return value.map((v) => remapAssets(v, map))
  if (typeof value !== 'object') return value
  const row = value as Record<string, unknown>
  const next: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(row)) {
    if (key === '_ref' && typeof child === 'string' && map.has(child)) {
      next[key] = map.get(child)
    } else {
      next[key] = remapAssets(child, map)
    }
  }
  return next
}

type RefRow = {_type?: string; _ref?: string; _key?: string}

function filterExistingRefs(
  items: unknown,
  existingIds: Set<string>,
): RefRow[] | undefined {
  if (!Array.isArray(items)) return undefined
  return items.filter((row): row is RefRow => {
    if (!row || typeof row !== 'object') return false
    const ref = (row as RefRow)._ref
    return Boolean(ref && existingIds.has(ref))
  })
}

function dropMissingRef(value: unknown, existingIds: Set<string>): unknown {
  if (!value || typeof value !== 'object') return value
  const ref = (value as RefRow)._ref
  if (typeof ref === 'string' && !existingIds.has(ref)) return undefined
  return value
}

function sanitizeDoc(
  doc: Record<string, unknown>,
  existingIds: Set<string>,
): Record<string, unknown> {
  const next = {...doc}
  if (next.relatedSection && typeof next.relatedSection === 'object') {
    const section = {...(next.relatedSection as Record<string, unknown>)}
    const filtered = filterExistingRefs(section.items, existingIds)
    if (filtered) section.items = filtered
    next.relatedSection = section
  }
  if (Array.isArray(next.pageSections)) {
    next.pageSections = next.pageSections.map((section) => {
      if (!section || typeof section !== 'object') return section
      const row = {...(section as Record<string, unknown>)}
      if (Array.isArray(row.specialists)) {
        row.specialists = filterExistingRefs(row.specialists, existingIds) || []
      }
      if (Array.isArray(row.reviews)) {
        row.reviews = filterExistingRefs(row.reviews, existingIds) || []
      }
      const cta = dropMissingRef(row.ctaCollection, existingIds)
      if (cta === undefined) delete row.ctaCollection
      else row.ctaCollection = cta
      const ins = dropMissingRef(row.insuranceCollection, existingIds)
      if (ins === undefined) delete row.insuranceCollection
      else row.insuranceCollection = ins
      return row
    })
  }
  const faq = dropMissingRef(next.faqCollection, existingIds)
  if (faq === undefined) delete next.faqCollection
  else next.faqCollection = faq
  if (Array.isArray(next.relatedSpecialists)) {
    next.relatedSpecialists =
      filterExistingRefs(next.relatedSpecialists, existingIds) || []
  }
  if (Array.isArray(next.googleReviews)) {
    next.googleReviews = filterExistingRefs(next.googleReviews, existingIds) || []
  }
  if (Array.isArray(next.legelistenReviews)) {
    next.legelistenReviews =
      filterExistingRefs(next.legelistenReviews, existingIds) || []
  }
  if (Array.isArray(next.categories)) {
    next.categories = filterExistingRefs(next.categories, existingIds) || []
  }
  return next
}

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'string') return value.trim().length === 0
  return false
}

function stableJson(value: unknown): string {
  return JSON.stringify(value ?? null)
}

async function ensureAssetsCopied(
  developer: SanityClient,
  production: SanityClient,
  assetIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (!assetIds.length) return map

  const existing = await production.fetch<string[]>(`*[_id in $ids]._id`, {
    ids: assetIds,
  })
  const existingSet = new Set(existing)
  for (const id of existing) map.set(id, id)

  const missing = assetIds.filter((id) => !existingSet.has(id))
  console.log(
    `Assets: ${assetIds.length} referenced, ${existing.length} already on production, ${missing.length} to copy`,
  )

  for (const id of missing) {
    const meta = await developer.fetch<{
      _id: string
      _type: string
      originalFilename?: string
      mimeType?: string
      url?: string
      extension?: string
    } | null>(
      `*[_id==$id][0]{_id,_type,originalFilename,mimeType,url,extension}`,
      {id},
    )
    if (!meta?.url) {
      console.warn(`  skip asset ${id}: missing url on developer`)
      continue
    }
    console.log(`  copy ${id}`)
    if (DRY_RUN) {
      map.set(id, id)
      continue
    }
    const res = await fetch(meta.url)
    if (!res.ok) throw new Error(`Asset download failed ${id}: ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const filename =
      meta.originalFilename ||
      `${id}.${meta.extension || (meta._type === 'sanity.fileAsset' ? 'bin' : 'jpg')}`
    const created = await production.assets.upload(
      meta._type === 'sanity.fileAsset' ? 'file' : 'image',
      buf,
      {filename, contentType: meta.mimeType || undefined},
    )
    map.set(id, created._id)
    if (created._id !== id) {
      console.log(`    → remapped ${id} -> ${created._id}`)
    }
  }
  return map
}

async function discardDraft(target: SanityClient, id: string) {
  const draftId = `drafts.${id}`
  const exists = await target.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  })
  if (exists) await target.delete(draftId)
}

async function main() {
  const source = clientFor('developer')
  const target = clientFor('production')

  console.log(
    `Sync ${TREATMENT_ID} developer → production (DRY_RUN=${DRY_RUN ? '1' : '0'})`,
  )

  const srcRaw = await source.fetch<(Record<string, unknown> & {_id: string}) | null>(
    `coalesce(
      *[_id == $draftId][0],
      *[_id == $id][0]
    )`,
    {id: TREATMENT_ID, draftId: `drafts.${TREATMENT_ID}`},
  )
  if (!srcRaw) {
    console.error(`Missing on developer: ${TREATMENT_ID}`)
    process.exit(1)
  }
  console.log(`Source: ${srcRaw._id}`)

  const dst = await target.fetch<(Record<string, unknown> & {_id: string}) | null>(
    `*[_id == $id][0]`,
    {id: TREATMENT_ID},
  )
  if (!dst) {
    console.error(`Missing on production: ${TREATMENT_ID}`)
    process.exit(1)
  }

  const assetIds = new Set<string>()
  collectAssetIds(srcRaw, assetIds)
  const assetMap = await ensureAssetsCopied(source, target, [...assetIds])

  const existingOnProd = new Set(
    await target.fetch<string[]>(
      `*[
        (
          _type in ["treatment", "specialist", "review", "ctaCollection", "insuranceCollection", "treatmentCategory", "faqCollection"] ||
          _type == "sanity.imageAsset" ||
          _type == "sanity.fileAsset"
        ) &&
        !(_id in path("drafts.**"))
      ]._id`,
    ),
  )
  for (const [from, to] of assetMap) {
    existingOnProd.add(to)
    existingOnProd.add(from)
  }

  const src = sanitizeDoc(
    remapAssets(srcRaw, assetMap) as Record<string, unknown>,
    existingOnProd,
  )

  const patch: Record<string, unknown> = {}
  const changed: string[] = []
  const unset: string[] = []

  const keys = new Set([...Object.keys(src), ...Object.keys(dst)])
  for (const key of keys) {
    if (SYSTEM_KEYS.has(key) || key.startsWith('_')) continue
    const nextValue = src[key]
    const prevValue = dst[key]
    if (nextValue === undefined) {
      if (!isEmpty(prevValue)) unset.push(key)
      continue
    }
    if (stableJson(nextValue) === stableJson(prevValue)) continue
    patch[key] = nextValue
    changed.push(key)
  }

  if (!changed.length && !unset.length) {
    console.log('No field differences. Production already matches local.')
    return
  }

  console.log(`→ set=[${changed.join(', ')}]`)
  console.log(`→ unset=[${unset.join(', ')}]`)

  if (DRY_RUN) {
    console.log('(dry-run) no writes')
    return
  }

  let p = target.patch(TREATMENT_ID)
  if (Object.keys(patch).length) p = p.set(patch)
  if (unset.length) p = p.unset(unset)
  await p.commit({autoGenerateArrayKeys: true})
  await discardDraft(target, TREATMENT_ID)
  console.log('Wrote production published document and discarded production draft.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
