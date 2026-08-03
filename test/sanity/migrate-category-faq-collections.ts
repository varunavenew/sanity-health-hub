/**
 * Populate Treatment Category `faqCollection` references.
 *
 * Root cause (verified):
 * - Every treatmentCategory has faqCollection = null
 * - Every treatmentCategory has no legacy faqs[] either
 * - migrate-faq-collections.ts correctly skipped categories (nothing to migrate)
 * - Schema/query/dual-read are fine; Studio is empty because the field is empty
 * - Frontend FaqSection is hidden (dual-read returns [])
 *
 * This script:
 * 1. Finds existing FAQ Items matching the category (canonical faq-{id}-* / category field)
 * 2. Falls back to faq-generelt-* (historical category landing FAQs)
 * 3. Creates one deterministic FAQ Collection per category (createIfNotExists)
 * 4. Sets faqCollection reference on the category (+ draft sync)
 * 5. Does NOT modify legacy faqs[], does NOT duplicate FAQ Items
 *
 * Usage:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-category-faq-collections.ts
 *   cd test && npx tsx sanity/migrate-category-faq-collections.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-category-faq-collections.ts --production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {requireSanityProjectId} from './dataset-env'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const DO_PRODUCTION =
  process.argv.includes('--production') ||
  process.env.ALLOW_PRODUCTION_MIGRATION === 'true'

const PROJECT_ID = requireSanityProjectId()
const TOKEN = process.env.SANITY_TOKEN?.trim()
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN')
  process.exit(1)
}

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    token: TOKEN,
    useCdn: false,
  })
}

function i18nString(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function collectionIdFor(categoryDocId: string): string {
  return `faq-collection.treatmentCategory.${categoryDocId}`
}

type FaqHit = {_id: string; sortOrder?: number}

async function findFaqsForCategory(
  client: SanityClient,
  categoryId: string,
  categoryDocId: string,
): Promise<FaqHit[]> {
  // 1) Canonical dedicated items (migrate-faqs.ts style) + category field
  const dedicated = await client.fetch<FaqHit[]>(
    `*[
      _type == "faq"
      && !(_id in path("drafts.**"))
      && (
        category == $categoryId
        || _id match $idPrefix
        || relatedTreatmentCategory._ref == $categoryDocId
      )
      && !(_id match "migrated-faq-inline.*")
    ] | order(coalesce(sortOrder, 999) asc, _id asc) { _id, sortOrder }`,
    {
      categoryId,
      idPrefix: `faq-${categoryId}-*`,
      categoryDocId,
    },
  )
  if (dedicated.length > 0) return dedicated

  // 2) Historical category landing FAQs = general set
  return client.fetch<FaqHit[]>(
    `*[
      _type == "faq"
      && !(_id in path("drafts.**"))
      && (
        category == "generelt"
        || _id match "faq-generelt-*"
      )
      && !(_id match "migrated-faq-inline.*")
    ] | order(coalesce(sortOrder, 999) asc, _id asc) { _id, sortOrder }`,
  )
}

async function ensureCollection(
  client: SanityClient,
  collectionId: string,
  title: string,
  faqIds: string[],
): Promise<{created: boolean; reused: boolean}> {
  const existing = await client.fetch<{
    _id: string
    questionCount: number
  } | null>(
    `*[_id == $id][0]{ _id, "questionCount": count(questions) }`,
    {id: collectionId},
  )

  const questions = faqIds.map((id, i) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: `q${i}-${id.replace(/[^a-zA-Z0-9]/g, '').slice(-12)}`,
  }))

  if (existing) {
    if (!existing.questionCount && faqIds.length > 0) {
      if (!DRY_RUN) {
        await client
          .patch(collectionId)
          .set({questions, title})
          .commit({visibility: 'async'})
      }
      console.log(`    · filled empty existing collection ${collectionId}`)
    } else {
      console.log(
        `    · reuse collection ${collectionId} (q=${existing.questionCount})`,
      )
    }
    return {created: false, reused: true}
  }

  console.log(`    · create collection ${collectionId} with ${faqIds.length} FAQs`)
  if (!DRY_RUN) {
    await client.createIfNotExists({
      _id: collectionId,
      _type: 'faqCollection',
      title,
      description: `Category landing FAQ pack for ${title.replace(/ FAQ$/, '')}.`,
      notes: [
        'migration: migrate-category-faq-collections.ts',
        'source: existing FAQ Items (canonical category / generelt fallback)',
      ].join('\n'),
      questions,
      sortOrder: 0,
    })
  }
  return {created: true, reused: false}
}

async function migrateDataset(dataset: string) {
  console.log(`\n========== ${dataset} ==========`)
  const client = clientFor(dataset)

  const cats = await client.fetch<
    Array<{
      _id: string
      categoryId?: string
      titleNo?: string
      faqCollectionRef?: string | null
      hasFaqSectionTitle?: boolean
    }>
  >(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))] | order(categoryId asc) {
      _id,
      categoryId,
      "titleNo": coalesce(title[language=="no"][0].value, title[_key=="no"][0].value),
      "faqCollectionRef": faqCollection._ref,
      "hasFaqSectionTitle": defined(faqSectionTitle)
    }`,
  )

  let linked = 0
  let created = 0
  let skipped = 0

  for (const cat of cats) {
    const categoryId = cat.categoryId || cat._id
    const title = `${cat.titleNo || categoryId} FAQ`

    if (cat.faqCollectionRef) {
      console.log(`  ⏭  ${categoryId} — already has ${cat.faqCollectionRef}`)
      skipped++
      continue
    }

    const faqs = await findFaqsForCategory(client, categoryId, cat._id)
    if (faqs.length === 0) {
      console.log(`  ✗  ${categoryId} — no matching FAQ Items found; skip`)
      skipped++
      continue
    }

    console.log(
      `  ✎  ${categoryId} — ${faqs.length} FAQ Item(s): ${faqs.map((f) => f._id).join(', ')}`,
    )

    const collectionId = collectionIdFor(cat._id)
    const result = await ensureCollection(
      client,
      collectionId,
      title,
      faqs.map((f) => f._id),
    )
    if (result.created) created++

    const patch: Record<string, unknown> = {
      faqCollection: {_type: 'reference', _ref: collectionId},
    }
    if (!cat.hasFaqSectionTitle) {
      patch.faqSectionTitle = i18nString(
        'Ofte stilte spørsmål',
        'Frequently asked questions',
      )
    }

    if (!DRY_RUN) {
      const tx = client.transaction()
      tx.patch(cat._id, (p) => p.set(patch))

      const draftId = `drafts.${cat._id}`
      const draftExists = await client.fetch<string | null>(
        '*[_id == $id][0]._id',
        {id: draftId},
      )
      if (draftExists) {
        tx.patch(draftId, (p) => p.set(patch))
        console.log(`    · synced draft ${draftId}`)
      }

      await tx.commit({visibility: 'async'})
    }

    linked++
  }

  console.log(
    `\n${dataset} summary: linked=${linked} collectionsCreated=${created} skipped=${skipped} dryRun=${DRY_RUN}`,
  )
}

async function run() {
  console.log('▶ Populate treatmentCategory faqCollection refs')
  console.log(DRY_RUN ? '🔍 DRY_RUN' : '✍️  WRITE')
  console.log(`Production: ${DO_PRODUCTION ? 'yes' : 'no'}`)

  await migrateDataset('developer')
  if (DO_PRODUCTION) {
    await migrateDataset('production')
  } else {
    console.log(
      '\n· Skipping Production (pass --production or ALLOW_PRODUCTION_MIGRATION=true)',
    )
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
