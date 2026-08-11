/**
 * Developer-only Insurance page normalization vs avenewdemo reference.
 * SAFETY: refuses non-developer datasets.
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'
import fs from 'fs'
import https from 'https'
import http from 'http'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() || process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
const DATASET = 'developer'
const DRY_RUN = process.env.DRY_RUN === '1'

console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=${DATASET}`)
if (!PROJECT_ID || !TOKEN) {
  console.error('Missing project/token')
  process.exit(1)
}
if (DATASET !== 'developer' || PROJECT_ID !== '9jhqpk3a') {
  throw new Error('Refusing non-developer / wrong project')
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

function i18nString(no: string, en: string) {
  return [
    {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: no},
    {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en},
  ]
}

function i18nText(no: string, en: string) {
  return [
    {_key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no},
    {_key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en},
  ]
}

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve, reject)
          return
        }
        const chunks: Buffer[] = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks)))
      })
      .on('error', reject)
  })
}

async function uploadHero(): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}}> {
  const localPath = path.join(process.cwd(), '..', 'tmp', 'insurance-hero-water-ref.jpg')
  let buf: Buffer
  if (fs.existsSync(localPath)) {
    buf = fs.readFileSync(localPath)
  } else {
    buf = await download(
      'https://avenewdemo.online/__l5e/assets-v1/24aa05f9-2741-4738-b371-d26a82626d42/insurance-hero-water.jpg',
    )
  }
  const asset = await client.assets.upload('image', buf, {filename: 'insurance-hero-water.jpg'})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

/** Reference partner list (NO names = brand labels). */
const PARTNERS = [
  {no: 'ERGO', en: 'ERGO'},
  {no: 'EuroAccident', en: 'EuroAccident'},
  {no: 'Falck', en: 'Falck'},
  {no: 'Fremtind', en: 'Fremtind'},
  {no: 'Gjensidige', en: 'Gjensidige'},
  {no: 'Tryg', en: 'Tryg'},
  {no: 'IF - Vertikal Helse', en: 'IF - Vertikal Helse'},
] as const

async function run() {
  const heroImage = DRY_RUN ? null : await uploadHero()
  if (heroImage) console.log('✓ Uploaded hero', heroImage.asset._ref)
  else console.log('DRY: would upload hero')

  const partnersLocalized = PARTNERS.map((p, i) => ({
    _type: 'object' as const,
    _key: `partner-${i + 1}`,
    name: i18nString(p.no, p.en),
  }))

  const steps = [
    {
      _key: 'is1',
      _type: 'object',
      title: i18nString('Få henvisning', 'Get a referral'),
      description: i18nText('Fra allmennlege eller spesialist', 'From a GP or specialist'),
    },
    {
      _key: 'is2',
      _type: 'object',
      title: i18nString('Send til forsikring', 'Submit to your insurer'),
      description: i18nText('For godkjenning av dekning', 'For coverage approval'),
    },
    {
      _key: 'is3',
      _type: 'object',
      title: i18nString('Velg CMedical', 'Choose CMedical'),
      description: i18nText('Be om behandling hos oss', 'Request treatment with us'),
    },
    {
      _key: 'is4',
      _type: 'object',
      title: i18nString('Bestill time', 'Book an appointment'),
      description: i18nText(
        'Vi fakturerer forsikringen direkte',
        'We invoice your insurer directly',
      ),
    },
  ]

  const benefits = [
    {
      _key: 'ib1',
      _type: 'object',
      title: i18nString('Ingen utlegg', 'No out-of-pocket costs'),
      description: i18nText(
        'Du slipper å betale selv – vi sender faktura direkte til forsikringsselskapet.',
        'You do not pay upfront – we invoice your insurance company directly.',
      ),
    },
    {
      _key: 'ib2',
      _type: 'object',
      title: i18nString('Enkelt å bruke', 'Easy to use'),
      description: i18nText(
        'Har du egenandel på forsikringen betaler du det på behandlingsstedet.',
        'If your insurance has a deductible, you pay it at the clinic.',
      ),
    },
    {
      _key: 'ib3',
      _type: 'object',
      title: i18nString('Alle forsikringer', 'All major insurers'),
      description: i18nText(
        'Vi har avtale med alle store forsikringsselskaper i Norge.',
        'We work with all major insurance providers in Norway.',
      ),
    },
  ]

  const set: Record<string, unknown> = {
    slug: [
      {
        _key: 'no',
        _type: 'internationalizedArraySlugValue',
        language: 'no',
        value: {_type: 'slug', current: 'forsikring'},
      },
      {
        _key: 'en',
        _type: 'internationalizedArraySlugValue',
        language: 'en',
        value: {_type: 'slug', current: 'insurance'},
      },
    ],
    title: i18nString('Helseforsikring', 'Health Insurance'),
    introText: i18nText(
      'Bruk forsikringen din til raskere behandling hos oss',
      'Use your insurance for faster treatment with us',
    ),
    partners: PARTNERS.map((p) => p.no),
    partnersLocalized,
    steps,
    benefits,
  }
  if (heroImage) set.heroImage = heroImage

  console.log('Patch insurancePage:', {
    slugEn: 'insurance',
    partners: PARTNERS.map((p) => p.no),
    benefit2: 'Enkelt å bruke',
    step1: 'Fra allmennlege eller spesialist',
    hasHero: Boolean(heroImage),
  })

  if (!DRY_RUN) {
    await client.patch('insurancePage').set(set).commit({autoGenerateArrayKeys: true})
    console.log('✓ Patched insurancePage')
    try {
      await client
        .patch('drafts.insurancePage')
        .set(set)
        .commit({autoGenerateArrayKeys: true})
      console.log('✓ Patched drafts.insurancePage')
    } catch {
      /* draft may not exist */
    }
  }

  console.log(
    DRY_RUN
      ? 'Dry-run complete'
      : 'Developer Insurance normalization complete. Production NOT touched.',
  )
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
