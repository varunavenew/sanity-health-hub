/**
 * Phase 3 — Create Homepage FAQ Collection from legacy homepage.faqs[].
 *
 * Behaviour:
 *   1. Skip if faqCollection already assigned (published or draft)
 *   2. Skip if no usable legacy FAQ refs
 *   3. Create deterministic FAQ Collection with the same FAQ item refs
 *   4. Assign faqCollection on published + draft homepage
 *   5. Leave legacy faqs[] untouched (removed only after verification)
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-homepage-faq-collection.ts
 *   npx tsx sanity/migrate-homepage-faq-collection.ts
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const COLLECTION_ID = 'faq-collection.homepage'

type HomepageDoc = {
  _id: string
  faqCollection?: {_ref?: string} | null
  faqs?: Array<{_ref?: string; _key?: string} | null> | null
}

function publishedId(id: string): string {
  return id.replace(/^drafts\./, '')
}

async function main() {
  console.log(`Homepage FAQ collection migration — DRY_RUN=${DRY_RUN}`)

  const docs = await client.fetch<HomepageDoc[]>(
    `*[_type == "homepage"]{_id, faqCollection, faqs}`,
  )

  if (docs.length === 0) {
    console.error('No homepage documents found — STOP')
    process.exit(1)
  }

  const refs = new Map<string, string>()
  for (const doc of docs) {
    for (const row of doc.faqs || []) {
      if (row?._ref) refs.set(row._ref, row._key || row._ref)
    }
  }

  const faqRefs = [...refs.entries()].map(([ref, key]) => ({
    _type: 'reference' as const,
    _ref: ref,
    _key: key,
  }))

  if (faqRefs.length === 0) {
    console.error('Homepage has no legacy FAQ refs — STOP')
    process.exit(1)
  }

  const alreadyLinked = docs.some((d) => d.faqCollection?._ref)
  if (alreadyLinked) {
    console.log('Homepage already has faqCollection — skip create, ensure all docs linked')
  }

  const existing = await client.fetch(`*[_id == $id][0]._id`, {id: COLLECTION_ID})
  if (!existing && !alreadyLinked) {
    const collectionDoc = {
      _id: COLLECTION_ID,
      _type: 'faqCollection',
      title: 'Homepage FAQ',
      description: 'Migrated from homepage legacy faqs[] (Phase 3).',
      questions: faqRefs,
      sortOrder: 0,
      notes: 'Created by migrate-homepage-faq-collection.ts. Reversible: unset homepage.faqCollection.',
    }
    if (DRY_RUN) {
      console.log('[dry-run] create collection', collectionDoc._id, `questions=${faqRefs.length}`)
    } else {
      await client.createOrReplace(collectionDoc)
      console.log(`Created ${COLLECTION_ID} with ${faqRefs.length} questions`)
    }
  } else {
    console.log(`Collection ${COLLECTION_ID} already exists or homepage already linked`)
  }

  for (const doc of docs) {
    if (doc.faqCollection?._ref) {
      console.log(`skip ${doc._id}: already has faqCollection=${doc.faqCollection._ref}`)
      continue
    }
    if (DRY_RUN) {
      console.log(`[dry-run] set ${doc._id}.faqCollection → ${COLLECTION_ID}`)
      continue
    }
    await client
      .patch(doc._id)
      .set({faqCollection: {_type: 'reference', _ref: COLLECTION_ID}})
      .commit()
    console.log(`Linked ${doc._id} → ${COLLECTION_ID}`)
  }

  // Ensure draft mirrors published when only one side was patched
  const pub = docs.find((d) => !d._id.startsWith('drafts.'))
  const draft = docs.find((d) => d._id.startsWith('drafts.'))
  if (pub && !draft && !DRY_RUN) {
    // no draft — ok
  }
  if (draft && pub && !DRY_RUN) {
    await client
      .patch(draft._id)
      .set({faqCollection: {_type: 'reference', _ref: COLLECTION_ID}})
      .commit()
      .catch(() => undefined)
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        collectionId: COLLECTION_ID,
        faqCount: faqRefs.length,
        homepageIds: docs.map((d) => d._id),
        publishedId: publishedId(docs[0]._id),
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
