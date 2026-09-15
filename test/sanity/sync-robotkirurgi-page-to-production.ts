/**
 * Sync robotkirurgiPage (+ FAQ pack) from developer → production.
 * Copies missing image/file assets. Creates the production singleton if missing.
 *
 * Usage (from test/):
 *   DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/sync-robotkirurgi-page-to-production.ts
 *   ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/sync-robotkirurgi-page-to-production.ts
 */
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {createClient, type SanityClient} from '@sanity/client'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const PAGE_ID = 'robotkirurgiPage'
const FAQ_COLLECTION_ID = 'faqCollection-robotkirurgi'

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

function dropMissingRef(value: unknown, existingIds: Set<string>): unknown {
  if (!value || typeof value !== 'object') return value
  const ref = (value as RefRow)._ref
  if (typeof ref === 'string' && !existingIds.has(ref)) return undefined
  return value
}

function contentFields(doc: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(doc)) {
    if (SYSTEM_KEYS.has(key) || key.startsWith('_')) continue
    next[key] = value
  }
  return next
}

async function fetchPreferred(
  client: SanityClient,
  id: string,
): Promise<(Record<string, unknown> & {_id: string; _type?: string}) | null> {
  return client.fetch(
    `coalesce(*[_id == $draftId][0], *[_id == $id][0])`,
    {id, draftId: `drafts.${id}`},
  )
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
  if (!exists) return
  if (DRY_RUN) {
    console.log(`  would discard ${draftId}`)
    return
  }
  await target.delete(draftId)
}

async function upsertPublished(
  target: SanityClient,
  id: string,
  type: string,
  fields: Record<string, unknown>,
) {
  const existing = await target.fetch<string | null>(`*[_id==$id][0]._id`, {id})
  if (DRY_RUN) {
    console.log(`  would ${existing ? 'patch' : 'create'} ${id}`)
    return
  }
  if (existing) {
    await target.patch(id).set(fields).commit({autoGenerateArrayKeys: true})
    return
  }
  await target.create({
    _id: id,
    _type: type,
    ...fields,
  })
}

async function main() {
  const source = clientFor('developer')
  const target = clientFor('production')

  console.log(
    `Sync ${PAGE_ID} + ${FAQ_COLLECTION_ID} developer → production (DRY_RUN=${DRY_RUN ? '1' : '0'})`,
  )

  const pageRaw = await fetchPreferred(source, PAGE_ID)
  if (!pageRaw) {
    console.error(`Missing on developer: ${PAGE_ID}`)
    process.exit(1)
  }
  console.log(`Page source: ${pageRaw._id}`)

  const faqRaw = await fetchPreferred(source, FAQ_COLLECTION_ID)
  if (faqRaw) {
    console.log(`FAQ source: ${faqRaw._id}`)
  } else {
    console.warn(`FAQ collection missing on developer: ${FAQ_COLLECTION_ID}`)
  }

  const assetIds = new Set<string>()
  collectAssetIds(pageRaw, assetIds)
  if (faqRaw) collectAssetIds(faqRaw, assetIds)
  const assetMap = await ensureAssetsCopied(source, target, [...assetIds])

  const existingOnProd = new Set(
    await target.fetch<string[]>(
      `*[
        (
          _type in ["faq", "faqCollection"] ||
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

  if (faqRaw) {
    const faqDoc = remapAssets(faqRaw, assetMap) as Record<string, unknown>
    const questions = Array.isArray(faqDoc.questions)
      ? faqDoc.questions.filter((row) => {
          if (!row || typeof row !== 'object') return false
          const ref = (row as RefRow)._ref
          if (!ref) return false
          if (existingOnProd.has(ref)) return true
          console.warn(`  drop FAQ ref missing on production: ${ref}`)
          return false
        })
      : []
    const faqFields = {
      ...contentFields(faqDoc),
      questions,
    }
    console.log(`FAQ questions kept: ${questions.length}`)
    await upsertPublished(target, FAQ_COLLECTION_ID, 'faqCollection', faqFields)
    await discardDraft(target, FAQ_COLLECTION_ID)
    existingOnProd.add(FAQ_COLLECTION_ID)
  }

  const pageDoc = remapAssets(pageRaw, assetMap) as Record<string, unknown>
  const faqRef = dropMissingRef(pageDoc.faqCollection, existingOnProd)
  if (faqRef === undefined) delete pageDoc.faqCollection
  else pageDoc.faqCollection = faqRef

  const pageFields = contentFields(pageDoc)
  await upsertPublished(
    target,
    PAGE_ID,
    typeof pageRaw._type === 'string' ? pageRaw._type : 'robotkirurgiPage',
    pageFields,
  )
  await discardDraft(target, PAGE_ID)

  console.log(DRY_RUN ? '(dry-run) no writes' : 'Wrote production published documents.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
