/**
 * Verify Shared Section collection-band preview labels (Studio-only logic).
 *
 * Usage: npx tsx test/sanity/verify-page-section-band-preview.ts
 */
import {pageSectionCollectionBandPreviewFromCollection} from '../schemaTypes/studioPreview'

const cases = [
  {
    name: 'Insurance — linked collection',
    input: {
      collection: {internalName: 'Standard Insurance Partners'},
      legacyTitle: [
        {_key: 'no', language: 'no', value: 'Vi samarbeider med de største forsikringsselskapene'},
        {_key: 'en', language: 'en', value: 'We work with the largest insurance companies'},
      ],
      bandTypeLabel: 'Insurance Collection',
      legacyFallback: 'Insurance Partners',
    },
    want: {
      title: 'Standard Insurance Partners',
      subtitle: 'Insurance Collection',
    },
  },
  {
    name: 'CTA — linked collection',
    input: {
      collection: {internalName: 'Gynecology Booking CTA'},
      legacyTitle: [
        {_key: 'no', language: 'no', value: 'Bestill time hos spesialist'},
        {_key: 'en', language: 'en', value: 'Book appointment with a specialist'},
      ],
      bandTypeLabel: 'CTA Collection',
      legacyFallback: 'Booking Call To Action',
    },
    want: {
      title: 'Gynecology Booking CTA',
      subtitle: 'CTA Collection',
    },
  },
  {
    name: 'Insurance — no collection (legacy)',
    input: {
      collection: null,
      legacyTitle: [
        {_key: 'no', language: 'no', value: 'Vi samarbeider med de største forsikringsselskapene'},
        {_key: 'en', language: 'en', value: 'We work with the largest insurance companies'},
      ],
      bandTypeLabel: 'Insurance Collection',
      legacyFallback: 'Insurance Partners',
    },
    want: {
      title: 'We work with the largest insurance companies',
      subtitle: 'Insurance Collection',
    },
  },
] as const

let failed = 0
for (const c of cases) {
  const got = pageSectionCollectionBandPreviewFromCollection(c.input)
  const ok =
    got.title === c.want.title && got.subtitle === c.want.subtitle
  if (!ok) {
    failed++
    console.error(`FAIL ${c.name}`)
    console.error('  want:', c.want)
    console.error('  got: ', got)
  } else {
    console.log(`OK   ${c.name}`)
  }
}

if (failed > 0) {
  process.exit(1)
}

console.log('\nAll page-section band preview cases passed.')
