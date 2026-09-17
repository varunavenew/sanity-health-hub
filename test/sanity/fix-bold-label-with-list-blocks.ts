#!/usr/bin/env npx tsx
/**
 * Second corrective pass, sibling to fix-embedded-linebreaks-in-blocks.ts.
 *
 * Handles the one remaining block shape that script intentionally skipped:
 * a bold "label" span (e.g. **Stressinkontinens**, **Forberedelser:**)
 * immediately followed by a plain (marks: []) span whose text starts with
 * \n and holds the rest of the content — either one continuation
 * paragraph, or a bullet list still written as literal "- line\n- line"
 * text instead of real list blocks.
 *
 * Verified (read-only) against every remaining flagged block before
 * writing this: all of them are exactly
 *   [ (optional 1-char whitespace span) , strong span , plain span with \n ]
 * with no other mark types (no links) — see conversation. Splits into:
 *   - the strong span as its own paragraph block
 *   - the following lines as either separate paragraph blocks, or, when
 *     every line starts with "- "/"* ", real bullet listItem blocks
 *     (matching the listItem:'bullet' shape already used natively
 *     elsewhere in these same documents).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/fix-bold-label-with-list-blocks.ts
 *   cd test && npx tsx sanity/fix-bold-label-with-list-blocks.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/fix-bold-label-with-list-blocks.ts
 */
import { randomBytes } from 'node:crypto'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

function key(): string {
  return randomBytes(4).toString('hex')
}

type Span = { _key?: string; _type?: string; text?: string; marks?: string[] }
type Block = {
  _key?: string
  _type?: string
  children?: Span[]
  markDefs?: unknown[]
  style?: string
  listItem?: string
  level?: number
}

function paragraphBlock(text: string): Block {
  return {
    _key: key(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: key(), _type: 'span', marks: [], text }],
  }
}

function bulletBlock(text: string): Block {
  return {
    _key: key(),
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _key: key(), _type: 'span', marks: [], text }],
  }
}

function boldParagraphBlock(text: string): Block {
  return {
    _key: key(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _key: key(), _type: 'span', marks: ['strong'], text }],
  }
}

/** Matches: [optional trivial whitespace span], one strong span, one plain span with embedded \n — nothing else. */
function matchLabelListShape(block: Block): { label: string; rest: string } | null {
  if (block._type !== 'block' || (block.markDefs?.length ?? 0) > 0) return null
  const children = block.children || []
  if (children.length < 2 || children.length > 3) return null

  const strongSpans = children.filter((c) => (c.marks || []).includes('strong'))
  const otherSpans = children.filter((c) => !(c.marks || []).includes('strong'))
  if (strongSpans.length !== 1) return null
  if (otherSpans.some((s) => (s.marks?.length ?? 0) > 0)) return null

  const last = children[children.length - 1]
  if (last !== strongSpans[0] && last.marks?.length === 0 && (last.text || '').includes('\n')) {
    // last span holds the newline content — good
  } else {
    return null
  }

  // Every non-last "other" span must be trivial whitespace/empty (stray leading space).
  const leadingOthers = otherSpans.filter((s) => s !== last)
  if (leadingOthers.some((s) => (s.text || '').trim().length > 0)) return null

  return { label: strongSpans[0].text || '', rest: last.text || '' }
}

function splitIntoBlocks(block: Block): { blocks: Block[]; changed: boolean } {
  const match = matchLabelListShape(block)
  if (!match) return { blocks: [block], changed: false }

  const lines = match.rest.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return { blocks: [block], changed: false }

  const bulletLines = lines
    .map((l) => /^[-*]\s+(.*)$/.exec(l))
    .filter((m): m is RegExpExecArray => m !== null)
  const allBullets = bulletLines.length === lines.length

  const out: Block[] = [boldParagraphBlock(match.label)]
  if (allBullets) {
    for (const m of bulletLines) out.push(bulletBlock(m[1]))
  } else {
    for (const line of lines) out.push(paragraphBlock(line))
  }
  return { blocks: out, changed: true }
}

function fixBlockArray(blocks: unknown): { next: Block[]; changed: boolean } {
  if (!Array.isArray(blocks)) return { next: blocks as Block[], changed: false }
  let changed = false
  const next: Block[] = []
  for (const raw of blocks as Block[]) {
    const { blocks: split, changed: didChange } = splitIntoBlocks(raw)
    if (didChange) changed = true
    next.push(...split)
  }
  return { next, changed }
}

async function run() {
  console.log('▶ Fix bold-label + embedded list blocks in reasons[].desc')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type in ["treatment", "subTreatmentLayout"] && defined(reasons)]{_id, reasons}`,
  )

  let patched = 0
  for (const doc of docs) {
    const id = doc._id as string
    const reasons = Array.isArray(doc.reasons) ? (doc.reasons as Record<string, unknown>[]) : []
    let docChanged = false
    const nextReasons = reasons.map((row) => {
      const entries = row.desc
      if (!Array.isArray(entries)) return row
      let rowChanged = false
      const nextEntries = entries.map((entry: Record<string, unknown>) => {
        const result = fixBlockArray(entry.value)
        if (!result.changed) return entry
        rowChanged = true
        return { ...entry, value: result.next }
      })
      if (!rowChanged) return row
      docChanged = true
      return { ...row, desc: nextEntries }
    })

    if (!docChanged) continue

    console.log(`  ${id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(id).set({ reasons: nextReasons }).commit()
    }
    patched += 1
  }

  console.log(`\n${DRY_RUN ? 'Would patch' : 'Patched'} ${patched} document(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
