/**
 * Migration: Article body content (Portable Text)
 *
 * Converts the static `articleContent.ts` blocks (paragraph, heading,
 * subheading, author, bold-intro, quote, list, link, source) into
 * Sanity Portable Text and patches each existing article document
 * (created by `migrate-articles.ts`) with the `body` field.
 *
 * Mapping:
 *   paragraph    → block style "normal"
 *   heading      → block style "h2"
 *   subheading   → block style "h3"
 *   author       → block style "normal" with italic mark
 *   bold-intro   → block style "normal" with strong mark
 *   quote        → block style "blockquote"
 *   list         → block style "normal" with listItem "bullet"
 *   link         → block style "normal" with link mark
 *   source       → block style "normal" with strong + optional link
 *
 * Run:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-article-content.ts
 */
import { sanityClient } from './config'
import { articleContent, type ContentBlock } from '../../src/data/articleContent'

// Generate a stable-ish random key required by Sanity Portable Text
function key() {
  return Math.random().toString(36).slice(2, 14)
}

function span(text: string, marks: string[] = []) {
  return {
    _type: 'span',
    _key: key(),
    text,
    marks,
  }
}

function block(
  style: string,
  children: ReturnType<typeof span>[],
  extras: Record<string, unknown> = {},
) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [] as Array<Record<string, unknown>>,
    children,
    ...extras,
  }
}

function linkBlock(text: string, url: string) {
  const linkKey = key()
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: undefined,
    markDefs: [
      {
        _key: linkKey,
        _type: 'link',
        href: url,
        blank: url.startsWith('http'),
      },
    ],
    children: [span(text, [linkKey])],
  }
}

function toPortableText(blocks: ContentBlock[]) {
  const out: Array<Record<string, unknown>> = []

  for (const b of blocks) {
    switch (b.type) {
      case 'paragraph':
        out.push(block('normal', [span(b.text)]))
        break
      case 'heading':
        out.push(block('h2', [span(b.text)]))
        break
      case 'subheading':
        out.push(block('h3', [span(b.text)]))
        break
      case 'author':
        out.push(block('normal', [span(b.text, ['em'])]))
        break
      case 'bold-intro':
        out.push(block('normal', [span(b.text, ['strong'])]))
        break
      case 'quote':
        out.push(block('blockquote', [span(b.text)]))
        break
      case 'list':
        for (const item of b.items) {
          out.push(
            block('normal', [span(item)], {
              listItem: 'bullet',
              level: 1,
            }),
          )
        }
        break
      case 'link':
        out.push(linkBlock(b.text, b.url))
        break
      case 'source': {
        if (b.url) {
          const linkKey = key()
          out.push({
            _type: 'block',
            _key: key(),
            style: 'normal',
            markDefs: [
              {
                _key: linkKey,
                _type: 'link',
                href: b.url,
                blank: true,
              },
            ],
            children: [span(b.text, ['strong', linkKey])],
          })
        } else {
          out.push(block('normal', [span(b.text, ['strong'])]))
        }
        break
      }
    }
  }

  return out
}

async function migrate() {
  console.log('📝 Migrating article body content to Sanity Portable Text...')
  console.log('='.repeat(60))

  const slugs = Object.keys(articleContent)
  let patched = 0
  let missing = 0
  let failed = 0

  for (const slug of slugs) {
    const docId = `article-${slug}`
    const blocks = articleContent[slug]
    const body = toPortableText(blocks)

    try {
      // Confirm article exists before patching
      const existing = await sanityClient.fetch(
        `*[_id == $id][0]{_id, title}`,
        { id: docId },
      )

      if (!existing) {
        console.warn(`  ⚠ Article not found in Sanity: ${docId} — skipping`)
        missing++
        continue
      }

      await sanityClient
        .patch(docId)
        .set({ body })
        .commit()

      console.log(`  ✓ ${slug} (${body.length} blocks)`)
      patched++
    } catch (err) {
      console.error(`  ✗ Failed to patch ${slug}:`, err)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ Done.`)
  console.log(`   Patched: ${patched}`)
  console.log(`   Missing: ${missing}`)
  console.log(`   Failed:  ${failed}`)
  if (missing > 0) {
    console.log(`\n💡 Run 'migrate-articles.ts' first to create missing article stubs.`)
  }
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
