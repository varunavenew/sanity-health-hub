#!/usr/bin/env npx tsx
/**
 * Corrective follow-up to migrate-reason-desc-to-blocks.ts and
 * migrate-reasons-lead-to-blocks.ts.
 *
 * Those migrations split paragraphs on blank lines (\n\n) but left single
 * line breaks (\n) as literal characters inside one span's text — which
 * HTML/Portable Text render as nothing (collapsed whitespace), so
 * multi-line content that used single \n between lines still shows as one
 * squished run-on paragraph.
 *
 * This script finds every "simple" block (exactly one span child, no marks,
 * no markDefs) in reasons[].desc / reasonsLead / reasonsLead2 whose text
 * contains \n, and splits it into one block per line. Blocks with marks/
 * multiple children (formatted text, e.g. **bold** or links) are left
 * alone and reported for manual review, since auto-splitting could break
 * which mark applies to which line.
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/fix-embedded-linebreaks-in-blocks.ts
 *   cd test && npx tsx sanity/fix-embedded-linebreaks-in-blocks.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/fix-embedded-linebreaks-in-blocks.ts
 */
import { randomBytes } from 'node:crypto'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

function key(): string {
  return randomBytes(4).toString('hex')
}

type Span = { _key?: string; _type?: string; text?: string; marks?: string[] }
type Block = { _key?: string; _type?: string; children?: Span[]; markDefs?: unknown[]; style?: string }
type I18nEntry = { _key?: string; _type?: string; language?: string; value?: unknown }

/** True when a block is a single plain-text span with no marks/markDefs — safe to auto-split. */
function isSimpleTextBlock(block: Block): boolean {
  if (block._type !== 'block') return false
  if ((block.markDefs?.length ?? 0) > 0) return false
  if (!Array.isArray(block.children) || block.children.length !== 1) return false
  const span = block.children[0]
  return span._type === 'span' && (span.marks?.length ?? 0) === 0 && typeof span.text === 'string'
}

function splitBlock(block: Block): { blocks: Block[]; changed: boolean } {
  if (!isSimpleTextBlock(block)) return { blocks: [block], changed: false }
  const text = block.children![0].text!
  if (!text.includes('\n')) return { blocks: [block], changed: false }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length <= 1) return { blocks: [block], changed: false }

  return {
    changed: true,
    blocks: lines.map((line) => ({
      _key: key(),
      _type: 'block',
      style: block.style || 'normal',
      markDefs: [],
      children: [{ _key: key(), _type: 'span', marks: [], text: line }],
    })),
  }
}

/** Splits any simple blocks with embedded \n; reports non-simple blocks that still contain \n. */
function fixBlockArray(
  blocks: unknown,
  label: string,
): { next: Block[]; changed: boolean; skipped: string[] } {
  if (!Array.isArray(blocks)) return { next: blocks as Block[], changed: false, skipped: [] }
  let changed = false
  const skipped: string[] = []
  const next: Block[] = []
  for (const raw of blocks as Block[]) {
    const text = (raw.children || []).map((c) => c.text || '').join('')
    if (text.includes('\n') && !isSimpleTextBlock(raw)) {
      skipped.push(`${label}: block ${raw._key} has marks/multiple children AND embedded \\n — needs manual review`)
      next.push(raw)
      continue
    }
    const { blocks: split, changed: didChange } = splitBlock(raw)
    if (didChange) changed = true
    next.push(...split)
  }
  return { next, changed, skipped }
}

function fixI18nField(field: unknown, label: string): { next: I18nEntry[] | undefined; changed: boolean; skipped: string[] } {
  if (!Array.isArray(field)) return { next: field as I18nEntry[] | undefined, changed: false, skipped: [] }
  let changed = false
  const skipped: string[] = []
  const next = (field as I18nEntry[]).map((entry) => {
    const result = fixBlockArray(entry.value, `${label}[${entry.language || entry._key}]`)
    skipped.push(...result.skipped)
    if (!result.changed) return entry
    changed = true
    return { ...entry, value: result.next }
  })
  return { next, changed, skipped }
}

async function run() {
  console.log('▶ Fix embedded line breaks in reasons[].desc / reasonsLead / reasonsLead2')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type in ["treatment", "subTreatmentLayout"] && (defined(reasons) || defined(reasonsLead) || defined(reasonsLead2))]{_id, reasons, reasonsLead, reasonsLead2}`,
  )

  let patched = 0
  const allSkipped: string[] = []

  for (const doc of docs) {
    const id = doc._id as string
    const patch: Record<string, unknown> = {}
    const changes: string[] = []

    const leadResult = fixI18nField(doc.reasonsLead, `${id}.reasonsLead`)
    allSkipped.push(...leadResult.skipped)
    if (leadResult.changed) {
      patch.reasonsLead = leadResult.next
      changes.push('reasonsLead')
    }

    const lead2Result = fixI18nField(doc.reasonsLead2, `${id}.reasonsLead2`)
    allSkipped.push(...lead2Result.skipped)
    if (lead2Result.changed) {
      patch.reasonsLead2 = lead2Result.next
      changes.push('reasonsLead2')
    }

    const reasons = Array.isArray(doc.reasons) ? (doc.reasons as Record<string, unknown>[]) : []
    let reasonsChanged = false
    const nextReasons = reasons.map((row) => {
      const result = fixI18nField(row.desc, `${id}.reasons[${row._key}].desc`)
      allSkipped.push(...result.skipped)
      if (!result.changed) return row
      reasonsChanged = true
      return { ...row, desc: result.next }
    })
    if (reasonsChanged) {
      patch.reasons = nextReasons
      changes.push('reasons[].desc')
    }

    if (changes.length === 0) continue

    console.log(`  ${id} (${changes.join(', ')})`)
    if (!DRY_RUN) {
      await sanityClient.patch(id).set(patch).commit()
    }
    patched += 1
  }

  console.log(`\n${DRY_RUN ? 'Would patch' : 'Patched'} ${patched} document(s).`)

  if (allSkipped.length > 0) {
    console.log(`\n${allSkipped.length} block(s) skipped (marks/links + embedded newline — review manually):`)
    for (const line of allSkipped) console.log(`  ! ${line}`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
