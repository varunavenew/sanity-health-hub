/**
 * Restore Homepage document on developer from production (read-only on production).
 *
 * Usage from repo root:
 *   node --env-file=.env.local --import tsx test/sanity/restore-homepage-from-production.ts
 *
 * Writes ONLY to developer. Never mutates production.
 */
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import {resolve} from 'path'

loadEnv({path: resolve(process.cwd(), '.env.local')})
loadEnv({path: resolve(process.cwd(), 'test/.env.local')})

const projectId =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const token = process.env.SANITY_TOKEN?.trim()

if (!projectId) throw new Error('SANITY_PROJECT_ID missing')
if (!token) throw new Error('SANITY_TOKEN missing (needed to write developer)')

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })
}

function stripSystem(doc: Record<string, unknown>) {
  const {_id, _type, _createdAt, _updatedAt, _rev, ...rest} = doc
  return rest
}

function slideCount(doc: Record<string, unknown> | null): number {
  const banner = doc?.heroBanner as {slides?: unknown[]} | undefined
  return Array.isArray(banner?.slides) ? banner!.slides!.length : 0
}

function summarize(doc: Record<string, unknown> | null) {
  if (!doc) return null
  return {
    _id: doc._id,
    slides: slideCount(doc),
    serviceCategories: Array.isArray(doc.serviceCategories)
      ? doc.serviceCategories.length
      : 0,
    faqs: Array.isArray(doc.faqs) ? doc.faqs.length : 0,
    googleReviews: Array.isArray(doc.googleReviews)
      ? doc.googleReviews.length
      : 0,
    pageSections: Array.isArray(doc.pageSections) ? doc.pageSections.length : 0,
    hasFaqCollection: Boolean(doc.faqCollection),
  }
}

async function main() {
  const production = clientFor('production')
  const developer = clientFor('developer')

  console.log('Reading homepage from production (read-only)...')
  const source = await production.fetch<Record<string, unknown> | null>(
    `*[_id == "homepage"][0]`,
  )

  if (!source) {
    throw new Error('No published homepage found in production')
  }

  const prodSummary = summarize(source)
  console.log('Production homepage:', prodSummary)

  if ((prodSummary?.slides ?? 0) < 1 && (prodSummary?.faqs ?? 0) < 1) {
    throw new Error(
      'Production homepage looks empty too — aborting restore to avoid wiping developer with empty data.',
    )
  }

  const before = await developer.fetch<Record<string, unknown> | null>(
    `*[_id == "homepage"][0]`,
  )
  console.log('Developer homepage BEFORE:', summarize(before))

  const body = stripSystem(source)
  const publishedDoc = {
    ...body,
    _id: 'homepage',
    _type: 'homepage',
  }

  console.log('Writing restored homepage → developer (published)...')
  await developer.createOrReplace(publishedDoc)

  // Remove empty/stale draft so Studio shows published content
  try {
    await developer.delete('drafts.homepage')
    console.log('Deleted drafts.homepage so Studio loads published content.')
  } catch (err) {
    console.warn('Could not delete drafts.homepage (may not exist):', err)
  }

  const after = await developer.fetch<Record<string, unknown> | null>(
    `*[_id == "homepage"][0]`,
  )
  const draft = await developer.fetch<Record<string, unknown> | null>(
    `*[_id == "drafts.homepage"][0]`,
  )

  console.log('Developer homepage AFTER:', summarize(after))
  console.log('Developer draft after:', summarize(draft))
  console.log('')
  console.log('Done. Hard-refresh Studio (Pages → Home). Production was not modified.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
