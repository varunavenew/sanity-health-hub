#!/usr/bin/env npx tsx
/**
 * Seeds bookingPage.step1CategoryClinicBadges — step 1 clinic badges per category.
 * Run: npm run migrate:booking-step1-clinics --prefix test
 */
import { sanityClient } from './config'

const i18nString = (no: string, en: string) => [
  { _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no },
  { _type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en },
]

const S = i18nString

const clinicRef = (slug: string) => ({
  _type: 'reference' as const,
  _ref: `clinicPage-${slug}`,
  _weak: true,
})

type BadgeSeed = {
  badgeKey: string
  labelNo: string
  sortOrder: number
  clinicSlug?: string
}

function badge({ badgeKey, labelNo, sortOrder, clinicSlug }: BadgeSeed) {
  return {
    _key: badgeKey,
    badgeKey,
    label: S(labelNo, labelNo),
    sortOrder,
    ...(clinicSlug ? { clinic: clinicRef(clinicSlug) } : {}),
  }
}

const B = {
  majorstuen10a: (sortOrder = 10) =>
    badge({ badgeKey: 'majorstuen-10a', labelNo: 'Majorstuen 10A', sortOrder }),
  majorstuen10b: (sortOrder = 20) =>
    badge({ badgeKey: 'majorstuen-10b', labelNo: 'Majorstuen 10B', sortOrder }),
  moss: (sortOrder = 30) =>
    badge({ badgeKey: 'moss', labelNo: 'Moss', sortOrder, clinicSlug: 'moss' }),
  bekkestua: (sortOrder = 40) =>
    badge({
      badgeKey: 'bekkestua',
      labelNo: 'Bekkestua',
      sortOrder,
      clinicSlug: 'bekkestua',
    }),
  moelv: (sortOrder = 50) =>
    badge({ badgeKey: 'moelv', labelNo: 'Moelv', sortOrder, clinicSlug: 'moelv' }),
}

const step1CategoryClinicBadges = [
  {
    _key: 'fertilitet',
    categoryKeys: ['fertilitet'],
    badges: [B.majorstuen10a()],
  },
  {
    _key: 'fysioterapeut-osteopat',
    categoryKeys: ['fysioterapeut-osteopat', 'fysioterapeut'],
    badges: [B.majorstuen10a(10), B.moss(20)],
  },
  {
    _key: 'gastrokirurg',
    categoryKeys: ['gastrokirurg'],
    badges: [B.moss(10)],
  },
  {
    _key: 'gynekolog',
    categoryKeys: ['gynekolog'],
    badges: [B.bekkestua(10), B.majorstuen10b(20), B.moelv(30), B.moss(40)],
  },
  {
    _key: 'hudlege',
    categoryKeys: ['hudlege'],
    badges: [B.bekkestua(10)],
  },
  {
    _key: 'ortoped',
    categoryKeys: ['ortoped'],
    badges: [B.majorstuen10a(10), B.moelv(20), B.moss(30)],
  },
  {
    _key: 'psykolog',
    categoryKeys: ['psykolog'],
    badges: [B.majorstuen10a()],
  },
  {
    _key: 'sexolog',
    categoryKeys: ['sexolog'],
    badges: [B.majorstuen10a()],
  },
  {
    _key: 'urolog',
    categoryKeys: ['urolog'],
    badges: [B.majorstuen10a(10), B.moelv(20)],
  },
  {
    _key: 'areknuter',
    categoryKeys: ['areknuter'],
    badges: [B.moelv(10)],
  },
]

async function run() {
  const existing = await sanityClient.getDocument('bookingPage')
  if (!existing) {
    console.error('bookingPage document not found — run migrate:booking-page first')
    process.exit(1)
  }

  await sanityClient
    .patch('bookingPage')
    .set({ step1CategoryClinicBadges })
    .commit()

  console.log(
    `Updated bookingPage with ${step1CategoryClinicBadges.length} step 1 category clinic badge groups`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
