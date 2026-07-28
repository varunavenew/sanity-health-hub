/**
 * One-time migration: convert legacy page `faqs[]` into FAQ Collections
 * for Medical Content document types.
 *
 * Scope:
 *   - treatmentCategory
 *   - treatment
 *   - specialist
 *   - clinicPage
 *   - servicesPage
 *   - pricingPage
 *
 * Behaviour (per published page):
 *   1. Skip if `faqCollection` already assigned
 *   2. Skip if no usable legacy FAQs
 *   3. Create FAQ Item docs for inline rows (deterministic IDs)
 *   4. Create exactly one FAQ Collection (deterministic ID) with ordered refs
 *   5. Assign `faqCollection` on the page
 *   6. Leave `faqs[]` and `faqSectionTitle` untouched
 *
 * Idempotent: safe to re-run — pages with a collection are skipped; deterministic
 * IDs prevent duplicate collections / inline FAQ Items for the same page.
 * Also syncs Studio drafts: when a draft exists, faqCollection is written there too
 * (Studio shows drafts, so published-only patches look “empty” in the editor).
 *
 * Dataset: developer only (config refuses production unless
 * ALLOW_PRODUCTION_MIGRATION=true).
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/migrate-faq-collections.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-faq-collections.ts
 */
import {sanityClient as client} from './config'
import {pickForLang, pickNo} from '../schemaTypes/i18n'

const DRY_RUN = process.env.DRY_RUN === '1'

const PAGE_TYPES = [
  'treatmentCategory',
  'treatment',
  'specialist',
  'clinicPage',
  'servicesPage',
  'pricingPage',
] as const

type PageType = (typeof PAGE_TYPES)[number]

type I18nEntry = {
  _type: string
  _key: string
  language: string
  value: string
}

type LegacyFaqRow = {
  _key?: string
  _type?: string | null
  _ref?: string
  question?: unknown
  answer?: unknown
}

type PageDoc = {
  _id: string
  _type: PageType
  title?: unknown
  name?: string
  faqCollection?: {_ref?: string} | null
  faqs?: LegacyFaqRow[] | null
}

type ResolvedRef = {
  kind: 'ref'
  ref: string
  key: string
}

type ResolvedInline = {
  kind: 'inline'
  key: string
  question: unknown
  answer: unknown
}

type ResolvedFaq = ResolvedRef | ResolvedInline

type Stats = {
  scanned: number
  migrated: number
  collectionsCreated: number
  faqItemsCreated: number
  skipped: number
  errors: number
  draftsSynced: number
  skipReasons: {
    alreadyHasCollection: number
    noLegacyFaqs: number
  }
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
  return cleaned.slice(0, 128) || `migrated-faq-${Date.now()}`
}

/** Deterministic FAQ Collection id for a page — never duplicates across re-runs. */
function collectionIdFor(type: PageType, pageId: string): string {
  return sanitizeId(`migrated-faq-collection.${type}.${pageId}`)
}

/** Deterministic FAQ Item id for an inline row on a page. */
function inlineFaqIdFor(type: PageType, pageId: string, key: string): string {
  return sanitizeId(`migrated-faq-inline.${type}.${pageId}.${key}`)
}

function pageTitle(doc: PageDoc): string {
  if (doc._type === 'specialist') {
    return String(doc.name || '').trim() || doc._id
  }
  return pickNo(doc.title)?.trim() || pickForLang(doc.title, 'en')?.trim() || doc._id
}

function readI18nValue(entry: unknown): string {
  if (typeof entry === 'string') return entry.trim()
  if (entry && typeof entry === 'object' && 'value' in entry) {
    const v = (entry as {value?: unknown}).value
    if (typeof v === 'string') return v.trim()
  }
  return ''
}

/**
 * Normalize question/answer into internationalized arrays.
 * Fills missing NO/EN from the other language so Studio validation can pass.
 */
function normalizeI18n(
  value: unknown,
  kind: 'string' | 'text',
): I18nEntry[] {
  const typeName =
    kind === 'string'
      ? 'internationalizedArrayStringValue'
      : 'internationalizedArrayTextValue'

  if (typeof value === 'string' && value.trim()) {
    const v = value.trim()
    return [
      {_type: typeName, _key: 'no', language: 'no', value: v},
      {_type: typeName, _key: 'en', language: 'en', value: v},
    ]
  }

  const rows = Array.isArray(value) ? value : []
  let no = ''
  let en = ''
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const lang = String(
      (row as {language?: string; _key?: string}).language ||
        (row as {_key?: string})._key ||
        '',
    )
    const text = readI18nValue(row)
    if (!text) continue
    if (lang === 'no' || lang.startsWith('nb')) no = text
    else if (lang === 'en') en = text
    else if (!no) no = text
  }

  if (!no && !en) return []
  if (!no) no = en
  if (!en) en = no

  return [
    {_type: typeName, _key: 'no', language: 'no', value: no},
    {_type: typeName, _key: 'en', language: 'en', value: en},
  ]
}

function hasUsableQuestionAnswer(question: unknown, answer: unknown): boolean {
  return (
    normalizeI18n(question, 'string').length > 0 &&
    normalizeI18n(answer, 'text').length > 0
  )
}

/**
 * Auto-detect reference rows and any inline object with question/answer
 * (clinicFaq, unnamed/`object`, `_type: null`, etc.). Preserve order.
 */
function resolveLegacyFaqs(faqs: LegacyFaqRow[] | null | undefined): ResolvedFaq[] {
  if (!Array.isArray(faqs) || faqs.length === 0) return []

  const out: ResolvedFaq[] = []
  faqs.forEach((row, index) => {
    if (!row || typeof row !== 'object') return

    const key = String(row._key || `faq-${index}`)
    const ref =
      typeof row._ref === 'string'
        ? row._ref
        : row._type === 'reference' && typeof (row as {_ref?: string})._ref === 'string'
          ? (row as {_ref: string})._ref
          : ''

    // Reference to an existing FAQ Item
    if (ref.trim()) {
      out.push({kind: 'ref', ref: ref.trim(), key})
      return
    }

    // Inline / legacy object (including `_type: null` or `object`)
    if (hasUsableQuestionAnswer(row.question, row.answer)) {
      out.push({
        kind: 'inline',
        key,
        question: row.question,
        answer: row.answer,
      })
    }
  })

  return out
}

async function migratePage(
  doc: PageDoc,
  stats: Stats,
  knownIds: Set<string>,
): Promise<void> {
  stats.scanned++

  if (doc.faqCollection?._ref) {
    stats.skipped++
    stats.skipReasons.alreadyHasCollection++
    console.log(`  ⏭  ${doc._type} ${doc._id} — already has faqCollection`)
    return
  }

  const resolved = resolveLegacyFaqs(doc.faqs)
  if (resolved.length === 0) {
    stats.skipped++
    stats.skipReasons.noLegacyFaqs++
    console.log(`  ⏭  ${doc._type} ${doc._id} — no legacy FAQs`)
    return
  }

  const title = `${pageTitle(doc)} FAQ`
  const collectionId = collectionIdFor(doc._type, doc._id)
  const questionRefs: Array<{_type: 'reference'; _ref: string; _key: string}> = []
  const newFaqDocs: Array<Record<string, unknown>> = []
  let newInlineCount = 0

  for (let i = 0; i < resolved.length; i++) {
    const item = resolved[i]
    if (item.kind === 'ref') {
      questionRefs.push({
        _type: 'reference',
        _ref: item.ref,
        _key: sanitizeId(item.key || `ref-${i}`),
      })
      continue
    }

    const faqItemId = inlineFaqIdFor(doc._type, doc._id, item.key || String(i))
    const question = normalizeI18n(item.question, 'string')
    const answer = normalizeI18n(item.answer, 'text')

    if (!question.length || !answer.length) {
      console.warn(`     ⚠ skip unusable inline at key=${item.key}`)
      continue
    }

    if (!knownIds.has(faqItemId)) {
      newFaqDocs.push({
        _id: faqItemId,
        _type: 'faq',
        question,
        answer,
        sortOrder: i,
      })
      knownIds.add(faqItemId)
      newInlineCount++
    }

    questionRefs.push({
      _type: 'reference',
      _ref: faqItemId,
      _key: sanitizeId(item.key || `inline-${i}`),
    })
  }

  if (questionRefs.length === 0) {
    stats.skipped++
    stats.skipReasons.noLegacyFaqs++
    console.log(`  ⏭  ${doc._type} ${doc._id} — no usable FAQs after filter`)
    return
  }

  const createCollection = !knownIds.has(collectionId)
  if (createCollection) knownIds.add(collectionId)

  console.log(
    `  ✎  ${doc._type} ${doc._id} — ${questionRefs.length} FAQ(s)` +
      ` (new items: ${newInlineCount}, new collection: ${createCollection ? 'yes' : 'reuse'})`,
  )

  if (DRY_RUN) {
    stats.faqItemsCreated += newInlineCount
    if (createCollection) stats.collectionsCreated++
    stats.migrated++
    return
  }

  const tx = client.transaction()
  for (const faqDoc of newFaqDocs) {
    tx.createIfNotExists(faqDoc)
  }

  if (createCollection) {
    tx.createIfNotExists({
      _id: collectionId,
      _type: 'faqCollection',
      title,
      description: `Auto-migrated from ${doc._type} (${doc._id}). Legacy faqs[] left intact for rollback.`,
      notes: [
        'migration: migrate-faq-collections.ts',
        `sourceType: ${doc._type}`,
        `sourceId: ${doc._id}`,
      ].join('\n'),
      questions: questionRefs,
      sortOrder: 0,
    })
  } else {
    const qCount = await client.fetch<number>(
      'count(*[_id == $id][0].questions)',
      {id: collectionId},
    )
    if (!qCount) {
      tx.patch(collectionId, (p) => p.set({questions: questionRefs, title}))
    }
  }

  tx.patch(doc._id, (p) =>
    p.set({
      faqCollection: {_type: 'reference', _ref: collectionId},
    }),
  )

  // Studio opens drafts when present — keep draft in sync with published assignment
  const draftId = `drafts.${doc._id}`
  const draftExists = await client.fetch<string | null>('*[_id == $id][0]._id', {
    id: draftId,
  })
  if (draftExists) {
    tx.patch(draftId, (p) =>
      p.set({
        faqCollection: {_type: 'reference', _ref: collectionId},
      }),
    )
    stats.draftsSynced++
  }

  await tx.commit({visibility: 'async'})

  stats.faqItemsCreated += newInlineCount
  if (createCollection) stats.collectionsCreated++
  stats.migrated++
}

/**
 * Repair: published docs already have faqCollection but Studio drafts do not.
 * Studio shows the draft when it exists, so refs look "empty" until drafts are synced.
 */
async function syncDraftFaqCollections(stats: Stats): Promise<void> {
  const mismatches = await client.fetch<
    Array<{_id: string; ref: string; draftId: string}>
  >(
    `*[
      _type in $types
      && !(_id in path("drafts.**"))
      && defined(faqCollection._ref)
      && count(*[
        _id == ("drafts." + ^._id)
        && (
          !defined(faqCollection._ref)
          || faqCollection._ref != ^.faqCollection._ref
        )
      ]) > 0
    ]{
      _id,
      "ref": faqCollection._ref,
      "draftId": "drafts." + _id
    }`,
    {types: [...PAGE_TYPES]},
  )

  if (!mismatches.length) {
    console.log('\nDraft sync: no published/draft mismatches')
    return
  }

  console.log(`\nDraft sync: ${mismatches.length} draft(s) missing faqCollection`)

  for (const row of mismatches) {
    console.log(`  ✎  sync ${row.draftId} → ${row.ref}`)
    if (DRY_RUN) {
      stats.draftsSynced++
      continue
    }
    try {
      await client
        .patch(row.draftId)
        .set({
          faqCollection: {_type: 'reference', _ref: row.ref},
        })
        .commit({visibility: 'async'})
      stats.draftsSynced++
    } catch (err) {
      stats.errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ❌ draft sync ${row.draftId}: ${msg}`)
    }
  }
}

async function run() {
  console.log('▶ Migrate legacy faqs[] → FAQ Collections')
  console.log(`  Types: ${PAGE_TYPES.join(', ')}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Legacy faqs[] will NOT be modified`)
  console.log(`  Also syncs existing Studio drafts so refs appear in the editor\n`)

  const pages = await client.fetch<PageDoc[]>(
    `*[
      _type in $types
      && !(_id in path("drafts.**"))
    ] | order(_type asc, _id asc) {
      _id,
      _type,
      title,
      name,
      faqCollection,
      faqs
    }`,
    {types: [...PAGE_TYPES]},
  )

  const existingMigratedIds = await client.fetch<string[]>(
    `*[
      _type in ["faq", "faqCollection"]
      && (
        _id match "migrated-faq-*"
      )
    ]._id`,
  )
  const knownIds = new Set(existingMigratedIds || [])

  const stats: Stats = {
    scanned: 0,
    migrated: 0,
    collectionsCreated: 0,
    faqItemsCreated: 0,
    skipped: 0,
    errors: 0,
    draftsSynced: 0,
    skipReasons: {
      alreadyHasCollection: 0,
      noLegacyFaqs: 0,
    },
  }

  const errorMessages: string[] = []

  for (const page of pages) {
    try {
      await migratePage(page, stats, knownIds)
    } catch (err) {
      stats.errors++
      const msg = err instanceof Error ? err.message : String(err)
      errorMessages.push(`${page._type} ${page._id}: ${msg}`)
      console.error(`  ❌ ${page._type} ${page._id}: ${msg}`)
    }
  }

  try {
    await syncDraftFaqCollections(stats)
  } catch (err) {
    stats.errors++
    const msg = err instanceof Error ? err.message : String(err)
    errorMessages.push(`draft sync: ${msg}`)
    console.error(`  ❌ draft sync: ${msg}`)
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`Pages scanned:        ${stats.scanned}`)
  console.log(`Pages migrated:       ${stats.migrated}`)
  console.log(`Collections created:  ${stats.collectionsCreated}`)
  console.log(`FAQ Items created:    ${stats.faqItemsCreated}`)
  console.log(`Drafts synced:        ${stats.draftsSynced}`)
  console.log(
    `Pages skipped:        ${stats.skipped}` +
      ` (already collection: ${stats.skipReasons.alreadyHasCollection},` +
      ` no FAQs: ${stats.skipReasons.noLegacyFaqs})`,
  )
  console.log(`Errors:               ${stats.errors}`)
  if (errorMessages.length) {
    console.log('\nError details:')
    for (const line of errorMessages) console.log(`  - ${line}`)
  }
  console.log('──────────────────────────────────────────')
  if (DRY_RUN) {
    console.log('Dry run only — no writes performed.')
  } else {
    console.log('Done. Legacy faqs[] preserved on all pages.')
  }

  if (stats.errors > 0) process.exitCode = 1
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
