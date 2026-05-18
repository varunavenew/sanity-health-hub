/**
 * Migrate legacy top-level fields on existing documents into sections[].
 *
 * Reads current Sanity content for treatmentCategory, treatment, and article
 * documents and packs the legacy fields into a sections[] array that the new
 * master template architecture renders via SectionRenderer.
 *
 * Idempotent: only writes sections[] when it's empty (or with FORCE=1 to
 * overwrite). Legacy fields are kept on the document for safety — clean up
 * in a later pass after frontend is verified.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-to-sections-template.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> npx tsx sanity/migrate-to-sections-template.ts
 *   FORCE=1   SANITY_TOKEN=<token> npx tsx sanity/migrate-to-sections-template.ts
 *   TYPE=treatmentCategory SANITY_TOKEN=<token> npx tsx sanity/migrate-to-sections-template.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'

const FORCE = process.env.FORCE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'
const ONLY_TYPE = process.env.TYPE // optional filter

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

// Wrap a primitive string into an internationalizedArrayString shape.
const i18nStr = (no?: string, en?: string) => {
  if (!no && !en) return undefined
  const arr: any[] = []
  if (no) arr.push({ _key: 'no', _type: 'internationalizedArrayStringValue', value: no })
  if (en) arr.push({ _key: 'en', _type: 'internationalizedArrayStringValue', value: en })
  return arr.length ? arr : undefined
}
const i18nText = (no?: string, en?: string) => {
  if (!no && !en) return undefined
  const arr: any[] = []
  if (no) arr.push({ _key: 'no', _type: 'internationalizedArrayTextValue', value: no })
  if (en) arr.push({ _key: 'en', _type: 'internationalizedArrayTextValue', value: en })
  return arr.length ? arr : undefined
}

// Some legacy fields are already internationalizedArray[]. Pass them through
// untouched (Sanity expects the same shape).
const passI18n = (val: any) => (Array.isArray(val) && val.length ? val : undefined)

/* ─────────────────────────  treatmentCategory  ───────────────────────── */

function buildCategorySections(doc: any) {
  const sections: any[] = []

  // Hero
  if (doc.title || doc.subtitle || doc.heroImage) {
    sections.push({
      _key: k(),
      _type: 'sectionHero',
      enabled: true,
      eyebrow: i18nStr(doc.subtitle),
      heading: passI18n(doc.title),
      subheading: passI18n(doc.description),
      image: doc.heroImage,
    })
  }

  // Stats
  if (Array.isArray(doc.stats) && doc.stats.length) {
    sections.push({
      _key: k(),
      _type: 'sectionStats',
      enabled: true,
      background: 'dark',
      items: doc.stats.map((s: any) => ({
        _key: k(),
        value: s.value,
        label: passI18n(s.label),
      })),
    })
  }

  // Services list (built from treatments references at render-time)
  if (doc.servicesHeading || doc.servicesIntro) {
    sections.push({
      _key: k(),
      _type: 'sectionServicesList',
      enabled: true,
      heading: i18nStr(doc.servicesHeading, doc.servicesHeading_en),
      intro: i18nText(doc.servicesIntro, doc.servicesIntro_en),
    })
  }

  // Service groups
  if (Array.isArray(doc.serviceGroups) && doc.serviceGroups.length) {
    sections.push({
      _key: k(),
      _type: 'sectionServiceGroups',
      enabled: true,
      groups: doc.serviceGroups.map((g: any) => ({
        _key: k(),
        label: i18nStr(g.label, g.label_en),
        caption: i18nStr(g.caption, g.caption_en),
        items: g.serviceNames || [],
      })),
    })
  }

  // Specialists (auto, filtered by categoryId)
  sections.push({
    _key: k(),
    _type: 'sectionSpecialists',
    enabled: true,
    heading: i18nStr('Møt spesialistene'),
    filterCategory: doc.categoryId,
    maxCount: 8,
    layout: 'carousel',
  })

  // Journey
  if (Array.isArray(doc.journey) && doc.journey.length) {
    sections.push({
      _key: k(),
      _type: 'sectionJourney',
      enabled: true,
      heading: i18nStr('Slik fungerer det'),
      steps: doc.journey.map((s: any) => ({
        _key: k(),
        icon: s.icon,
        label: s.label,
        title: i18nStr(s.title, s.title_en),
        body: i18nText(s.body, s.body_en),
      })),
    })
  }

  // Reviews
  sections.push({
    _key: k(),
    _type: 'sectionReviews',
    enabled: true,
    heading: i18nStr('Hva pasientene sier'),
    source: 'google',
    maxCount: 6,
  })

  // FAQ
  if (Array.isArray(doc.staticFaqs) && doc.staticFaqs.length) {
    sections.push({
      _key: k(),
      _type: 'sectionFaq',
      enabled: true,
      heading: i18nStr('Ofte stilte spørsmål'),
      items: doc.staticFaqs.map((f: any) => ({
        _key: k(),
        question: i18nStr(f.question, f.question_en),
        answer: i18nText(f.answer, f.answer_en),
      })),
    })
  }

  // Closing CTA
  if (doc.closingTitle || doc.closingBody) {
    sections.push({
      _key: k(),
      _type: 'sectionCta',
      enabled: true,
      background: 'dark',
      heading: i18nStr(doc.closingTitle, doc.closingTitle_en),
      body: i18nText(doc.closingBody, doc.closingBody_en),
      ctaLabel: i18nStr(doc.closingCta || 'Bestill time', doc.closingCta_en),
      ctaHref: doc.bookingPath || `/booking?kategori=${doc.categoryId || ''}`,
    })
  }

  return sections
}

/* ─────────────────────────  treatment  ───────────────────────── */

function buildTreatmentSections(doc: any) {
  const sections: any[] = []

  if (doc.title || doc.heroImage) {
    sections.push({
      _key: k(),
      _type: 'sectionHero',
      enabled: true,
      heading: passI18n(doc.title),
      subheading: passI18n(doc.subtitle),
      image: doc.heroImage,
    })
  }

  if (doc.description) {
    sections.push({
      _key: k(),
      _type: 'sectionIntro',
      enabled: true,
      body: passI18n(doc.description),
    })
  }

  if (Array.isArray(doc.benefits) && doc.benefits.length) {
    sections.push({
      _key: k(),
      _type: 'sectionBenefits',
      enabled: true,
      heading: passI18n(doc.benefitsTitle) || i18nStr('Fordeler'),
      items: doc.benefits,
    })
  }

  if (Array.isArray(doc.process) && doc.process.length) {
    sections.push({
      _key: k(),
      _type: 'sectionProcess',
      enabled: true,
      heading: i18nStr('Slik foregår det'),
      steps: doc.process.map((p: any) => ({
        _key: k(),
        title: passI18n(p.title),
        description: passI18n(p.description),
      })),
    })
  }

  if (Array.isArray(doc.sections) && doc.sections.length && doc.sections[0]?.heading) {
    // legacy `sections` accordion (different from new sections[] array)
    sections.push({
      _key: k(),
      _type: 'sectionAccordionContent',
      enabled: true,
      items: doc.sections.map((it: any) => ({
        _key: k(),
        id: it.id,
        heading: passI18n(it.heading),
        content: passI18n(it.content),
      })),
    })
  }

  if (Array.isArray(doc.linkedServices) && doc.linkedServices.length) {
    sections.push({
      _key: k(),
      _type: 'sectionLinkedServices',
      enabled: true,
      heading: i18nStr('Tverrfaglig team'),
      items: doc.linkedServices.map((l: any) => ({
        _key: k(),
        label: passI18n(l.label),
        description: passI18n(l.description),
        path: l.path,
      })),
    })
  }

  sections.push({
    _key: k(),
    _type: 'sectionSpecialists',
    enabled: true,
    heading: i18nStr('Dine behandlere'),
    maxCount: 6,
    layout: 'grid',
  })

  if (Array.isArray(doc.faqs) && doc.faqs.length) {
    sections.push({
      _key: k(),
      _type: 'sectionFaq',
      enabled: true,
      heading: i18nStr('Ofte stilte spørsmål'),
      items: doc.faqs.map((f: any) => ({
        _key: k(),
        question: passI18n(f.question),
        answer: passI18n(f.answer),
      })),
    })
  }

  sections.push({
    _key: k(),
    _type: 'sectionBookingCta',
    enabled: true,
    heading: i18nStr('Bestill time'),
    bookingPath: '/booking',
  })

  return sections
}

/* ─────────────────────────  article  ───────────────────────── */

function buildArticleSections(doc: any) {
  const sections: any[] = []
  sections.push({ _key: k(), _type: 'sectionArticleHero', enabled: true })
  if (doc.body) {
    sections.push({
      _key: k(),
      _type: 'sectionArticleBody',
      enabled: true,
      body: passI18n(doc.body),
    })
  }
  sections.push({ _key: k(), _type: 'sectionRelatedArticles', enabled: true, mode: 'auto', maxCount: 3 })
  return sections
}

/* ─────────────────────────  Runner  ───────────────────────── */

const MIGRATORS: Record<string, (doc: any) => any[]> = {
  treatmentCategory: buildCategorySections,
  treatment: buildTreatmentSections,
  article: buildArticleSections,
}

async function migrateType(type: string) {
  const builder = MIGRATORS[type]
  if (!builder) return
  const docs = await sanityClient.fetch(`*[_type == "${type}"]{ ..., "id": _id }`)
  console.log(`\n[${type}] found ${docs.length} document(s)`)
  for (const doc of docs) {
    const hasSections = Array.isArray(doc.sections) && doc.sections.length > 0
    // For treatment, legacy `sections` field IS the accordion content — not the same as new sections[].
    // We only skip if first item has _type starting with "section" (new shape).
    const hasNewSections = hasSections && doc.sections.some((s: any) => typeof s?._type === 'string' && s._type.startsWith('section'))
    if (hasNewSections && !FORCE) {
      console.log(`  ⏭  ${doc._id} already has sections[] (use FORCE=1 to overwrite)`)
      continue
    }
    const newSections = builder(doc)
    console.log(`  ✦ ${doc._id} → ${newSections.length} sections`)
    if (DRY_RUN) continue
    await sanityClient.patch(doc._id).set({ sections: newSections }).commit()
  }
}

async function main() {
  const types = ONLY_TYPE ? [ONLY_TYPE] : Object.keys(MIGRATORS)
  for (const t of types) await migrateType(t)
  console.log('\n✅ Done.', DRY_RUN ? '(dry-run, no writes)' : '')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
