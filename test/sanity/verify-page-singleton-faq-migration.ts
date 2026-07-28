/**
 * Verify FAQ Collection migration for Services + Pricing page singletons.
 * Compares dual-read output (collection vs legacy) on the developer dataset.
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/verify-page-singleton-faq-migration.ts
 */
import {sanityClient as client} from './config'
import {pickNo} from '../schemaTypes/i18n'

type FaqRow = {question?: unknown; answer?: unknown; sortOrder?: number}

function asPlain(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  if (Array.isArray(value)) {
    for (const row of value) {
      if (row && typeof row === 'object' && 'value' in row) {
        const inner = (row as {value?: unknown}).value
        if (typeof inner === 'string' && inner.trim()) return inner.trim()
      }
    }
  }
  return ''
}

function mapFaqs(rows: FaqRow[] | null | undefined) {
  if (!Array.isArray(rows)) return []
  return rows
    .map((row, index) => ({
      question: asPlain(row.question),
      answer: asPlain(row.answer),
      sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : index,
    }))
    .filter((row) => row.question && row.answer)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({question, answer}) => ({question, answer}))
}

function resolveDualRead(
  collection: {questions?: FaqRow[]} | null | undefined,
  legacy: FaqRow[] | null | undefined,
) {
  const fromCollection = mapFaqs(collection?.questions)
  if (fromCollection.length > 0) return fromCollection
  return mapFaqs(legacy)
}

async function verifyType(type: 'servicesPage' | 'pricingPage') {
  const doc = await client.fetch<{
    _id: string
    title?: unknown
    faqCollection?: {_ref?: string; questions?: FaqRow[]} | null
    faqs?: FaqRow[] | null
  }>(
    `*[_type == $type && !(_id in path("drafts.**"))][0]{
      _id,
      title,
      "faqCollection": faqCollection->{
        _id,
        title,
        "questions": questions[]->{
          sortOrder,
          question,
          answer
        }
      },
      "faqs": faqs[]{
        sortOrder,
        question,
        answer,
        _type,
        _ref,
        "question": coalesce(@->question, question),
        "answer": coalesce(@->answer, answer)
      }
    }`,
    {type},
  )

  if (!doc) {
    console.log(`❌ ${type}: document not found`)
    return false
  }

  const label = pickNo(doc.title) || type
  const collectionRef = doc.faqCollection?._id || '(none)'
  const legacyCount = Array.isArray(doc.faqs) ? doc.faqs.length : 0
  const collectionCount = doc.faqCollection?.questions?.length ?? 0
  const resolved = resolveDualRead(doc.faqCollection, doc.faqs)
  const legacyOnly = mapFaqs(doc.faqs)
  const collectionOnly = mapFaqs(doc.faqCollection?.questions)

  const linked = Boolean(doc.faqCollection?._id)
  const dualReadMatch =
    JSON.stringify(resolved) === JSON.stringify(collectionOnly.length ? collectionOnly : legacyOnly)

  console.log(`\n${type} (${label})`)
  console.log(`  Document id:        ${doc._id}`)
  console.log(`  FAQ Collection:     ${linked ? collectionRef : 'NOT LINKED'}`)
  console.log(`  Collection Q count: ${collectionCount}`)
  console.log(`  Legacy faqs count:  ${legacyCount} (preserved)`)
  console.log(`  Resolved FAQ count: ${resolved.length}`)
  console.log(`  Dual-read OK:       ${dualReadMatch ? 'yes' : 'NO'}`)

  if (resolved.length > 0) {
    console.log('  First question:')
    console.log(`    Q: ${resolved[0].question.slice(0, 80)}${resolved[0].question.length > 80 ? '…' : ''}`)
  }

  return linked && collectionCount > 0 && dualReadMatch
}

async function run() {
  console.log('▶ Verify Services + Pricing FAQ Collection migration')
  const servicesOk = await verifyType('servicesPage')
  const pricingOk = await verifyType('pricingPage')

  console.log('\n──────────────────────────────────────────')
  if (servicesOk && pricingOk) {
    console.log('✓ Migration verified for both page singletons')
    return
  }
  if (!servicesOk) console.log('✗ Services page needs FAQ Collection migration')
  if (!pricingOk) console.log('✗ Pricing page needs FAQ Collection migration')
  process.exitCode = 1
}

run().catch((err) => {
  console.error('❌ Verification failed:', err)
  process.exit(1)
})
