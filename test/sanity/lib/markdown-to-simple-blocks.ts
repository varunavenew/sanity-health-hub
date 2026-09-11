import { randomBytes } from 'node:crypto'

function key(): string {
  return randomBytes(4).toString('hex')
}

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type MarkDef = {_type: 'link'; _key: string; href: string}

function parseInline(text: string): {children: Span[]; markDefs: MarkDef[]} {
  const children: Span[] = []
  const markDefs: MarkDef[] = []
  const re = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text))) {
    if (match.index > last) {
      children.push({
        _type: 'span',
        _key: key(),
        text: text.slice(last, match.index),
        marks: [],
      })
    }
    if (match[0].startsWith('**')) {
      children.push({
        _type: 'span',
        _key: key(),
        text: match[2] ?? '',
        marks: ['strong'],
      })
    } else {
      const markKey = key()
      markDefs.push({_type: 'link', _key: markKey, href: (match[4] ?? '').trim()})
      children.push({
        _type: 'span',
        _key: key(),
        text: match[3] ?? '',
        marks: [markKey],
      })
    }
    last = match.index + match[0].length
  }

  if (last < text.length) {
    children.push({
      _type: 'span',
      _key: key(),
      text: text.slice(last),
      marks: [],
    })
  }
  if (children.length === 0) {
    children.push({_type: 'span', _key: key(), text: '', marks: []})
  }

  return {children, markDefs}
}

function bulletLine(line: string): string | null {
  const trimmed = line.trim()
  const match = trimmed.match(/^[-*]\s+(.*)$/)
  return match ? (match[1] ?? '') : null
}

function numberLine(line: string): string | null {
  const trimmed = line.trim()
  const match = trimmed.match(/^\d+[.)]\s+(.*)$/)
  return match ? (match[1] ?? '') : null
}

/** Convert CMS markdown (lists, **bold**, [label](url)) into simple Portable Text. */
export function markdownToSimpleBlocks(input: string): Record<string, unknown>[] {
  const text = input.replace(/\r\n/g, '\n').trim()
  if (!text) return []

  const blocks: Record<string, unknown>[] = []
  const paragraphs = text.split(/\n{2,}/)

  for (const para of paragraphs) {
    const lines = para.split('\n').map((line) => line.trimEnd())
    const nonEmpty = lines.filter((line) => line.trim())
    const allBullets = nonEmpty.length > 0 && nonEmpty.every((line) => bulletLine(line) != null)
    const allNumbers = nonEmpty.length > 0 && nonEmpty.every((line) => numberLine(line) != null)

    if (allBullets || allNumbers) {
      for (const line of nonEmpty) {
        const body = allBullets ? bulletLine(line)! : numberLine(line)!
        const inline = parseInline(body)
        blocks.push({
          _type: 'block',
          _key: key(),
          style: 'normal',
          listItem: allBullets ? 'bullet' : 'number',
          level: 1,
          markDefs: inline.markDefs,
          children: inline.children,
        })
      }
      continue
    }

    const inline = parseInline(lines.join('\n'))
    blocks.push({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: inline.markDefs,
      children: inline.children,
    })
  }

  return blocks
}
