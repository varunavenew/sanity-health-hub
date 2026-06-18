/**
 * Seed `layout` (SubTreatmentLayout) on treatment documents from static sub-page files.
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/migrate-sub-treatment-layout.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-sub-treatment-layout.ts
 *   ONLY_CATEGORY=gynekologi npx tsx sanity/migrate-sub-treatment-layout.ts
 */
import { isValidElement, type ReactNode } from 'react'
import type { SubTreatmentContent } from '../../src/components/layout/SubTreatmentLayout'
import { gynekologiSubPages } from '../../src/data/gynekologiSubPages'
import { fertilitetSubPages } from '../../src/data/fertilitetSubPages'
import { patchTreatmentFields, treatmentIdFromKey } from './lib/patch-treatment'
import { i18nString, i18nText } from './lib/treatment-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const ONLY_CATEGORY = (process.env.ONLY_CATEGORY || '').trim()

function reactNodeToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactNodeToText).join('')
  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children
    return reactNodeToText(children)
  }
  return ''
}

function noString(value: string | undefined) {
  const v = value?.trim()
  return v ? i18nString(v, v) : undefined
}

function noText(value: string | undefined) {
  const v = value?.trim()
  return v ? i18nText(v, v) : undefined
}

function mapLayout(content: SubTreatmentContent) {
  return {
    eyebrow: noString(content.eyebrow),
    heroTitle: noString(reactNodeToText(content.heroTitle) || content.title),
    heroDescription: noText(content.heroDescription),
    heroPoints: content.heroPoints.map((p, i) => ({
      _key: `hp${i}`,
      _type: 'object',
      title: noString(p.title),
      desc: noText(p.desc),
    })),
    rating: noString(content.rating),
    primaryCtaLabel: noString(content.primaryCtaLabel),
    bookingService: content.booking.tjeneste || undefined,
    flowEyebrow: noString(content.flowEyebrow),
    flowTitle: noString(content.flowTitle),
    flow: content.flow.map((step, i) => ({
      _key: `flow${i}`,
      _type: 'object',
      n: noString(step.n),
      title: noString(step.title),
      desc: noText(step.desc),
    })),
    reasonsEyebrow: noString(content.reasonsEyebrow),
    reasonsTitle: noString(content.reasonsTitle),
    reasonsLead: noText(content.reasonsLead),
    reasonsLead2: noText(content.reasonsLead2),
    reasons: content.reasons.map((r, i) => ({
      _key: `reason${i}`,
      _type: 'object',
      n: noString(r.n),
      title: noString(r.title),
      desc: noText(r.desc),
    })),
    promises: content.promises.map((p, i) => ({
      _key: `promise${i}`,
      _type: 'object',
      eyebrow: noString(p.eyebrow),
      title: noString(p.title),
      desc: noText(p.desc),
    })),
    relatedEyebrow: noString(content.relatedEyebrow),
    relatedTitle: noString(content.relatedTitle),
    related: content.related.map((r, i) => ({
      _key: `rel${i}`,
      _type: 'object',
      eyebrow: noString(r.eyebrow),
      title: noString(r.title),
      desc: noText(r.desc),
      path: r.href,
    })),
    ctaTitle: noString(content.ctaTitle),
    ctaDescription: noText(content.ctaDescription),
    specialistCtaLabel: noString(content.specialistCtaLabel),
    specialistCtaHref: content.specialistCtaHref,
  }
}

const SOURCES: Record<string, Record<string, SubTreatmentContent>> = {
  gynekologi: gynekologiSubPages,
  fertilitet: fertilitetSubPages,
}

async function run() {
  console.log(`▶ Migrate SubTreatment layout${DRY_RUN ? ' (dry run)' : ''}`)

  for (const [category, pages] of Object.entries(SOURCES)) {
    if (ONLY_CATEGORY && ONLY_CATEGORY !== category) continue

    for (const [slug, content] of Object.entries(pages)) {
      const docId = treatmentIdFromKey(`${category}/${slug}`)
      const layout = mapLayout(content)

      console.log(`  ✎ ${docId}`)

      if (DRY_RUN) continue

      const patched = await patchTreatmentFields(docId, { layout })
      if (patched.length === 0) {
        console.warn(`    ⚠ document not found — skipped`)
      }
    }
  }

  console.log('\n✓ Done')
}

run().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
