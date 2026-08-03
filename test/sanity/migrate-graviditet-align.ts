/**
 * Align Pregnancy (graviditet) category landing with Lovable reference.
 *
 * Production already holds the correct landing content (verified vs Lovable).
 * Developer is outdated — copy Production landing/stats into Developer, but
 * KEEP Developer's existing spotlight image (media must not change).
 *
 * Also on BOTH datasets:
 *  - sectionOrder with FAQ after segments (Lovable order)
 *  - pregnancy-specific FAQ Collection questions + title/description
 *  - specialists title "Jordmødre og spesialistene som følger deg."
 *
 * Usage:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-graviditet-align.ts
 *   cd test && npx tsx sanity/migrate-graviditet-align.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-graviditet-align.ts --production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {requireSanityProjectId} from './dataset-env'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const DO_PRODUCTION =
  process.argv.includes('--production') ||
  process.env.ALLOW_PRODUCTION_MIGRATION === 'true'

const PROJECT_ID = requireSanityProjectId()
const TOKEN = process.env.SANITY_TOKEN?.trim()
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN')
  process.exit(1)
}

const DOC_ID = 'category-graviditet'
const COLLECTION_ID = 'faq-collection.treatmentCategory.category-graviditet'
const CTA_COLLECTION_ID = 'cta-collection.treatmentCategory.category-graviditet'

/** Lovable order: segments → FAQ → why → experts → services → results → reviews → spotlight → specialists → journey */
const SECTION_ORDER = [
  'segments',
  'faq',
  'why',
  'expertAreas',
  'services',
  'results',
  'reviews',
  'spotlight',
  'specialists',
  'journey',
]

const FAQ_ITEMS = [
  {
    id: 'faq-graviditet-henvisning',
    qNo: 'Trenger jeg henvisning fra fastlege?',
    qEn: 'Do I need a referral from my GP?',
    aNo: 'Nei. Du kan ta direkte kontakt med oss uten henvisning. Har du allerede en utredning eller prøvesvar, tar vi gjerne imot dem i forkant så vi sparer tid.',
    aEn: 'No. You can contact us directly without a referral. If you already have assessments or test results, we are happy to receive them in advance so we can save time.',
  },
  {
    id: 'faq-graviditet-ultralyd-nipt',
    qNo: 'Når bør jeg ta tidlig ultralyd og NIPT?',
    qEn: 'When should I have an early ultrasound and NIPT?',
    aNo: 'Tidlig ultralyd og NIPT gjøres vanligvis mellom uke 10 og 14. Vi anbefaler å bestille time tidlig i svangerskapet så vi finner et tidspunkt som gir deg svar når du trenger dem.',
    aEn: 'Early ultrasound and NIPT are usually done between weeks 10 and 14. We recommend booking early in pregnancy so we can find a time that gives you answers when you need them.',
  },
  {
    id: 'faq-graviditet-ventetid',
    qNo: 'Hvor lang ventetid har dere?',
    qEn: 'How long is the waiting time?',
    aNo: 'Vi har som regel kort ventetid på første konsultasjon — ofte innen 1–2 uker. Akutt behov søker vi alltid å imøtekomme samme uke.',
    aEn: 'We usually have a short wait for the first consultation — often within 1–2 weeks. For urgent needs we always try to accommodate within the same week.',
  },
  {
    id: 'faq-graviditet-pris',
    qNo: 'Hva koster svangerskapsoppfølging hos dere?',
    qEn: 'What does pregnancy follow-up cost with you?',
    aNo: 'Prisene varierer med hvilken kontroll eller undersøkelse du trenger. Prisene på siden er «fra»-priser og en grundig prisoversikt får du i første konsultasjon.',
    aEn: 'Prices vary depending on which check-up or examination you need. Prices on the site are “from” prices; you get a thorough price overview at the first consultation.',
  },
  {
    id: 'faq-graviditet-forsikring',
    qNo: 'Kan jeg bruke helseforsikring?',
    qEn: 'Can I use health insurance?',
    aNo: 'Mange forsikringer dekker deler av svangerskapsoppfølgingen. Vi hjelper deg med å sjekke hva din avtale dekker før vi starter.',
    aEn: 'Many insurance plans cover parts of pregnancy follow-up. We help you check what your policy covers before we start.',
  },
]

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    token: TOKEN,
    useCdn: false,
  })
}

function i18nString(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function i18nText(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function sameOrder(a: unknown, b: string[]) {
  if (!Array.isArray(a) || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

async function upsertFaqItems(client: SanityClient, label: string) {
  for (let i = 0; i < FAQ_ITEMS.length; i++) {
    const item = FAQ_ITEMS[i]
    const doc = {
      _id: item.id,
      _type: 'faq',
      sortOrder: i + 1,
      question: i18nString(item.qNo, item.qEn),
      answer: i18nText(item.aNo, item.aEn),
      category: 'graviditet',
    }
    if (DRY_RUN) {
      console.log(`  · ${label}: dry-run upsert ${item.id}`)
      continue
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${label}: FAQ item ${item.id}`)
  }
}

async function upsertCtaCollection(client: SanityClient, label: string) {
  const doc = {
    _id: CTA_COLLECTION_ID,
    _type: 'ctaCollection',
    internalName: 'Graviditet Booking CTA (Lovable)',
    description: 'Pregnancy category landing CTA — Lovable-aligned copy.',
    title: i18nString(
      'Bestill time hos spesialist',
      'Book an appointment with a specialist',
    ),
    subtitle: i18nText(
      'Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.',
      'Book an appointment easily online. No referral required, and we have short waiting times.',
    ),
    primaryLabel: i18nString('Bestill time', 'Book appointment'),
    secondaryLabel: i18nString('Kontakt oss', 'Contact us'),
    secondaryPath: '/kontakt',
    showSecondaryButton: true,
    quickInfoItems: [
      {_key: 'qi1', label: i18nString('Ingen henvisning', 'No referral required')},
      {_key: 'qi2', label: i18nString('Kort ventetid', 'Short waiting times')},
      {_key: 'qi3', label: i18nString('Forsikring godkjent', 'Insurance accepted')},
    ],
  }
  if (DRY_RUN) {
    console.log(`  · ${label}: dry-run upsert CTA collection ${CTA_COLLECTION_ID}`)
    return
  }
  await client.createOrReplace(doc)
  console.log(`  ✓ ${label}: CTA collection ${CTA_COLLECTION_ID}`)
}

async function upsertCollection(client: SanityClient, label: string) {
  const doc = {
    _id: COLLECTION_ID,
    _type: 'faqCollection',
    title: 'Graviditet og fostermedisin FAQ',
    description: 'Pregnancy category landing FAQs (Lovable-aligned).',
    questions: FAQ_ITEMS.map((item, i) => ({
      _type: 'reference',
      _key: `q${i + 1}`,
      _ref: item.id,
    })),
  }
  if (DRY_RUN) {
    console.log(`  · ${label}: dry-run upsert collection ${COLLECTION_ID}`)
    return
  }
  await client.createOrReplace(doc)
  console.log(`  ✓ ${label}: FAQ collection ${COLLECTION_ID}`)
}

async function patchSharedFields(client: SanityClient, label: string) {
  const snap = await client.fetch<{
    sectionOrder?: string[] | null
    faqTitle?: string | null
    faqDesc?: string | null
    faqOpenFirst?: boolean | null
    faqCollectionRef?: string | null
    specialists?: Array<{
      _key: string
      titleNo?: string | null
      seeAllLabelNo?: string | null
    }>
    booking?: Array<{
      _key: string
      titleNo?: string | null
      primaryLabelNo?: string | null
      collectionRef?: string | null
    }>
  } | null>(
    `*[_id == $id][0]{
      "sectionOrder": landingPage.sectionOrder,
      "faqTitle": coalesce(faqSectionTitle[language=="no"][0].value, faqSectionTitle[_key=="no"][0].value),
      "faqDesc": coalesce(faqSectionDescription[language=="no"][0].value, faqSectionDescription[_key=="no"][0].value),
      faqOpenFirst,
      "faqCollectionRef": faqCollection._ref,
      "specialists": pageSections[_type == "pageSectionSpecialists"]{
        _key,
        "titleNo": coalesce(title[language=="no"][0].value, title[_key=="no"][0].value),
        "seeAllLabelNo": coalesce(seeAllLabel[language=="no"][0].value, seeAllLabel[_key=="no"][0].value)
      },
      "booking": pageSections[_type == "pageSectionBookingCta"]{
        _key,
        "titleNo": coalesce(title[language=="no"][0].value, title[_key=="no"][0].value),
        "primaryLabelNo": coalesce(primaryLabel[language=="no"][0].value, primaryLabel[_key=="no"][0].value),
        "collectionRef": ctaCollection._ref
      }
    }`,
    {id: DOC_ID},
  )

  if (!snap) {
    console.log(`  ✗ ${label}: missing ${DOC_ID}`)
    return
  }

  const patch: Record<string, unknown> = {}

  if (!sameOrder(snap.sectionOrder, SECTION_ORDER)) {
    patch['landingPage.sectionOrder'] = SECTION_ORDER
  }

  const wantTitle = 'Det du lurer på — fordelt så det er enkelt å finne.'
  if (snap.faqTitle !== wantTitle) {
    patch.faqSectionTitle = i18nString(
      wantTitle,
      'What you wonder about — organised so it is easy to find.',
    )
  }

  const wantDesc =
    'Mange spørsmål dukker opp i et svangerskap. Her har vi samlet de vanligste — så du raskt finner svaret som er relevant for akkurat deg.\n\nFørste punkt er åpent som standard, så det viktigste alltid møter leseren først.'
  if (snap.faqDesc !== wantDesc) {
    patch.faqSectionDescription = i18nText(
      wantDesc,
      'Many questions come up during pregnancy. We have collected the most common ones — so you quickly find the answer that is relevant for you.\n\nThe first item is open by default, so the most important always meets the reader first.',
    )
  }

  if (snap.faqOpenFirst !== true) {
    patch.faqOpenFirst = true
  }

  if (snap.faqCollectionRef !== COLLECTION_ID) {
    patch.faqCollection = {_type: 'reference', _ref: COLLECTION_ID}
  }

  const spec = snap.specialists?.[0]
  if (spec?._key) {
    const wantSpecTitle = 'Jordmødre og spesialistene som følger deg.'
    if (spec.titleNo !== wantSpecTitle) {
      patch[`pageSections[_key=="${spec._key}"].title`] = i18nString(
        wantSpecTitle,
        'The midwives and specialists who support you.',
      )
    }
    if (spec.seeAllLabelNo !== 'Se alle spesialister') {
      patch[`pageSections[_key=="${spec._key}"].seeAllLabel`] = i18nString(
        'Se alle spesialister',
        'See all specialists',
      )
    }
    // Pregnancy care is delivered by gynecology specialists in CMS.
    patch[`pageSections[_key=="${spec._key}"].displayMode`] = 'category'
    patch[`pageSections[_key=="${spec._key}"].categorySlug`] = 'gynekologi'
    patch[`pageSections[_key=="${spec._key}"].seeAllHref`] =
      '/spesialister?kategori=gynekologi'
    // Keep description if already set; set default if missing
    patch[`pageSections[_key=="${spec._key}"].description`] = i18nText(
      'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
      'Experience, specialist expertise and modern technology in one place.',
    )
  }

  const booking = snap.booking?.[0]
  if (booking?._key) {
    const wantCtaTitle = 'Bestill time hos spesialist'
    if (booking.titleNo !== wantCtaTitle) {
      patch[`pageSections[_key=="${booking._key}"].title`] = i18nString(
        wantCtaTitle,
        'Book an appointment with a specialist',
      )
    }
    if (booking.primaryLabelNo !== 'Bestill time') {
      patch[`pageSections[_key=="${booking._key}"].primaryLabel`] = i18nString(
        'Bestill time',
        'Book appointment',
      )
    }
    if (booking.collectionRef !== CTA_COLLECTION_ID) {
      patch[`pageSections[_key=="${booking._key}"].ctaCollection`] = {
        _type: 'reference',
        _ref: CTA_COLLECTION_ID,
      }
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`  · ${label}: shared fields already aligned`)
    return
  }

  console.log(`  ${label} shared patch keys:`, Object.keys(patch))
  if (DRY_RUN) {
    console.log('  · DRY_RUN — skip write')
    return
  }
  await client.patch(DOC_ID).set(patch).commit({autoGenerateArrayKeys: false})
  console.log(`  ✓ ${label}: shared fields patched`)
}

/**
 * Copy Production landing content → Developer.
 * Uses production spotlight image (Lovable Media band = ultralyd image).
 */
async function syncDeveloperFromProduction(
  prod: SanityClient,
  dev: SanityClient,
) {
  const prodDoc = await prod.fetch<{
    landingPage?: Record<string, unknown> | null
    stats?: unknown
  } | null>(`*[_id == $id][0]{landingPage, stats}`, {id: DOC_ID})

  if (!prodDoc?.landingPage) {
    throw new Error('Production missing landingPage')
  }

  const landing = structuredClone(prodDoc.landingPage) as Record<string, unknown>
  landing.sectionOrder = SECTION_ORDER

  // Lovable typography: trailing spaces so block emphasis / titleLine2 join cleanly.
  const hero = (landing.hero || {}) as Record<string, unknown>
  hero.heading = i18nString('Et svangerskap er noe av ', 'A pregnancy is one of ')
  landing.hero = hero
  const segments = (landing.segmentsSection || {}) as Record<string, unknown>
  segments.title = i18nString(
    'Fortell oss hvor du er — ',
    'Tell us where you are — ',
  )
  segments.titleLine2 = i18nString(
    'vi finner veien videre.',
    'we will find the way forward.',
  )
  landing.segmentsSection = segments

  // Ensure Media (spotlight) uses the ultralyd image matching Lovable —
  // never keep a developer hero duplicate that previously broke Media parity.
  const spotlight = (landing.spotlightSection || {}) as Record<string, unknown>
  const spotlightImage = spotlight.image as {asset?: {_ref?: string}} | undefined
  const spotlightRef = spotlightImage?.asset?._ref || ''
  if (!spotlightRef || spotlightRef.includes('e55959c1bba9e0f3fb41e4d5809646a99e228178')) {
    spotlight.image = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-6893f0255aad53fa5a76dcc0bc0582155ed92440-1250x1080-jpg',
      },
    }
    console.log('  · Spotlight image set to Lovable ultralyd media asset')
  }
  landing.spotlightSection = spotlight

  const patch: Record<string, unknown> = {
    landingPage: landing,
  }
  if (Array.isArray(prodDoc.stats) && prodDoc.stats.length > 0) {
    patch.stats = prodDoc.stats
  }

  console.log('  developer sync from production: landingPage + stats')
  if (DRY_RUN) {
    console.log('  · DRY_RUN — skip developer sync write')
    return
  }
  await dev.patch(DOC_ID).set(patch).commit({autoGenerateArrayKeys: false})
  console.log('  ✓ developer: landing synced from production (spotlight image kept)')
}

async function run() {
  console.log(DRY_RUN ? '🔍 DRY_RUN' : '✍️  WRITE')
  console.log(`Production writes: ${DO_PRODUCTION ? 'yes' : 'no'}`)

  const prod = clientFor('production')
  const dev = clientFor('developer')

  // 1) Align Developer landing from Production (source of correct content)
  await syncDeveloperFromProduction(prod, dev)

  // 2) FAQ items + collection + shared fields on Developer
  await upsertFaqItems(dev, 'developer')
  await upsertCollection(dev, 'developer')
  await upsertCtaCollection(dev, 'developer')
  await patchSharedFields(dev, 'developer')

  // 3) Production: FAQ + specialists + sectionOrder only (landing already correct)
  if (DO_PRODUCTION) {
    await upsertFaqItems(prod, 'production')
    await upsertCollection(prod, 'production')
    await upsertCtaCollection(prod, 'production')
    await patchSharedFields(prod, 'production')
  } else {
    console.log(
      '  · Skipping Production (pass --production or ALLOW_PRODUCTION_MIGRATION=true)',
    )
  }

  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
