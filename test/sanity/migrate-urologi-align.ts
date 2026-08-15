/**
 * Align Urology category landing with Lovable reference.
 *
 * Developer is patched first (source of truth after alignment).
 * Production receives only missing/wrong refs & content that differ from Dev.
 *
 * - Expert card "Penis, forhud og potens" → urologi-forhud.jpg (asset already in both)
 * - servicesSection title/intro/groups match reference "Hva vi tilbyr"
 * - symptomsSection items
 * - pageSectionSpecialists: title, description, limit
 *
 * Usage:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-urologi-align.ts
 *   cd test && npx tsx sanity/migrate-urologi-align.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-urologi-align.ts --production
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

const DOC_ID = 'category-urologi'
const FORHUD_ID = 'image-a73db4eef8daed6d34ae96ae86eea453a827727e-1250x1080-jpg'
const URO = '/behandlinger/urologi'

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

function imgRef(assetId: string) {
  return {
    _type: 'image' as const,
    asset: {_type: 'reference' as const, _ref: assetId},
  }
}

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    token: TOKEN,
    useCdn: false,
  })
}

const SERVICES_GROUPS = [
  {
    _key: 'sg-utredning',
    label: i18nString('Undersøkelse og utredning', 'Examination and assessment'),
    items: [
      {
        _key: 's-prostata-sjekk',
        title: i18nString('Prostatasjekk', 'Prostate check'),
        description: i18nString('Utredning og PSA', 'Assessment and PSA'),
        href: `${URO}/prostata`,
      },
      {
        _key: 's-blaere',
        title: i18nString('Blære og urinveier', 'Bladder and urinary tract'),
        description: i18nString('Utredning og behandling', 'Assessment and treatment'),
        href: `${URO}/blaere`,
      },
      {
        _key: 's-nyrer',
        title: i18nString('Nyrer', 'Kidneys'),
        description: i18nString(
          'Cyster, tumor og nefrektomi',
          'Cysts, tumour and nephrectomy',
        ),
        href: `${URO}/nyrer`,
      },
      {
        _key: 's-kul',
        title: i18nString('Kul i pungen', 'Scrotal lump'),
        description: i18nString('Utredning og behandling', 'Assessment and treatment'),
        href: `${URO}/testikler`,
      },
      {
        _key: 's-smerter',
        title: i18nString('Smerter i testiklene', 'Testicular pain'),
        description: i18nString('Utredning og behandling', 'Assessment and treatment'),
        href: `${URO}/testikler`,
      },
      {
        _key: 's-infertilitet',
        title: i18nString('Mannlig infertilitet', 'Male infertility'),
        description: i18nString('Utredning og behandling', 'Assessment and treatment'),
        href: `${URO}/infertilitet`,
      },
    ],
  },
  {
    _key: 'sg-behandling',
    label: i18nString('Behandling og kirurgi', 'Treatment and surgery'),
    items: [
      {
        _key: 's-forstorret',
        title: i18nString('Forstørret prostata', 'Enlarged prostate'),
        description: i18nString('Medisinsk og kirurgisk', 'Medical and surgical'),
        href: `${URO}/prostata`,
      },
      {
        _key: 's-kreft',
        title: i18nString('Prostatakreft', 'Prostate cancer'),
        description: i18nString('Diagnose og behandling', 'Diagnosis and treatment'),
        href: `${URO}/prostata`,
      },
      {
        _key: 's-forhud',
        title: i18nString('Trang forhud (fimose)', 'Tight foreskin (phimosis)'),
        description: i18nString('Konservativ og kirurgisk', 'Conservative and surgical'),
        href: `${URO}/forhud`,
      },
      {
        _key: 's-steril',
        title: i18nString('Sterilisering (vasektomi)', 'Sterilization (vasectomy)'),
        description: i18nString('Trygt og raskt inngrep', 'Safe and quick procedure'),
        href: `${URO}/sterilisering`,
      },
      {
        _key: 's-refert',
        title: i18nString('Refertilisering', 'Vasectomy reversal'),
        description: i18nString('Mikrokirurgisk inngrep', 'Microsurgical procedure'),
        href: `${URO}/refertilisering`,
      },
      {
        _key: 's-robot',
        title: i18nString('Robotassistert kirurgi', 'Robot-assisted surgery'),
        description: i18nString(
          'Avansert minimalt invasiv',
          'Advanced minimally invasive',
        ),
        href: `${URO}/robotkirurgi`,
      },
    ],
  },
]

const SYMPTOM_ITEMS = [
  {
    _key: 's1',
    symptom: i18nString('Svak eller hyppig vannlating', 'Weak or frequent urination'),
    service: i18nString('Prostatautredning', 'Prostate investigation'),
    href: `${URO}/prostata`,
  },
  {
    _key: 's2',
    symptom: i18nString(
      'Forhøyet PSA eller mistanke om prostatakreft',
      'Elevated PSA or suspected prostate cancer',
    ),
    service: i18nString('Prostatasjekk', 'Prostate check'),
    href: `${URO}/prostata`,
  },
  {
    _key: 's3',
    symptom: i18nString(
      'Smerter, kul eller hevelse i pungen',
      'Pain, lump or swelling in the scrotum',
    ),
    service: i18nString('Testikkelutredning', 'Testicular investigation'),
    href: `${URO}/testikler`,
  },
  {
    _key: 's4',
    symptom: i18nString(
      'Plager fra blære eller urinveier',
      'Bladder or urinary tract issues',
    ),
    service: i18nString(
      'Blære- og urinveisutredning',
      'Bladder and urinary tract investigation',
    ),
    href: `${URO}/blaere`,
  },
  {
    _key: 's5',
    symptom: i18nString('Spørsmål om nyrene', 'Questions about the kidneys'),
    service: i18nString('Nyreutredning', 'Kidney investigation'),
    href: `${URO}/nyrer`,
  },
  {
    _key: 's6',
    symptom: i18nString(
      'Vurderer sterilisering (vasektomi)',
      'Considering sterilisation (vasectomy)',
    ),
    service: i18nString('Sterilisering', 'Sterilisation'),
    href: `${URO}/sterilisering`,
  },
]

async function ensureForhud(client: SanityClient, label: string): Promise<string> {
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && (
      _id == $id || sha1hash == "a73db4eef8daed6d34ae96ae86eea453a827727e" ||
      originalFilename == "urologi-forhud.jpg"
    )][0]._id`,
    {id: FORHUD_ID},
  )
  if (existing) {
    console.log(`  · ${label}: forhud asset ${existing}`)
    return existing
  }
  throw new Error(`${label}: urologi-forhud.jpg missing — upload once, do not duplicate blindly`)
}

async function patchUrologi(client: SanityClient, label: string, forhudId: string) {
  const snap = await client.fetch<{
    _id: string
    penisImageId?: string | null
    servicesTitle?: string | null
    specialists?: Array<{
      _key: string
      _type: string
      title?: Array<{language?: string; value?: string}>
      description?: Array<{language?: string; value?: string}>
      limit?: number
      seeAllLabel?: unknown
    }>
  } | null>(
    `*[_id == $id][0]{
      _id,
      "penisImageId": landingPage.expertAreasSection.areas[href match "*penis*"][0].image.asset->_id,
      "servicesTitle": coalesce(
        landingPage.servicesSection.title[language=="no"][0].value,
        landingPage.servicesSection.title[_key=="no"][0].value
      ),
      "specialists": pageSections[_type == "pageSectionSpecialists"]
    }`,
    {id: DOC_ID},
  )

  if (!snap) {
    console.log(`  ✗ ${label}: missing ${DOC_ID}`)
    return
  }

  console.log(`  ${label} before:`, {
    penisImageId: snap.penisImageId,
    servicesTitle: snap.servicesTitle,
    specialists: snap.specialists?.map((s) => ({
      _key: s._key,
      limit: s.limit,
    })),
  })

  const patch: Record<string, unknown> = {
    'landingPage.servicesSection.title': i18nString(
      'Hva vi tilbyr',
      'What we offer',
    ),
    'landingPage.servicesSection.description': i18nText(
      'Dette er utredningene, behandlingene og inngrepene vi utfører. Vet du allerede hva du trenger? Velg fra listen — eller les mer om den enkelte tjenesten.',
      'These are the assessments, treatments and procedures we perform. Already know what you need? Choose from the list — or read more about each service.',
    ),
    'landingPage.servicesSection.groups': SERVICES_GROUPS,
    'landingPage.symptomsSection.items': SYMPTOM_ITEMS,
  }

  // Update penis expert image by matching area href
  const areas = await client.fetch<
    Array<{_key: string; href?: string; imageId?: string}>
  >(
    `*[_id == $id][0].landingPage.expertAreasSection.areas[]{
      _key, href, "imageId": image.asset->_id
    }`,
    {id: DOC_ID},
  )
  const penis = areas?.find((a) => (a.href || '').includes('/penis'))
  if (penis && penis.imageId !== forhudId) {
    patch[
      `landingPage.expertAreasSection.areas[_key=="${penis._key}"].image`
    ] = imgRef(forhudId)
  }

  // Specialists section fields via keyed path
  const spec = snap.specialists?.[0]
  if (spec?._key) {
    patch[`pageSections[_key=="${spec._key}"].title`] = i18nString(
      'Urologene som følger deg.',
      'The urologists who support you.',
    )
    patch[`pageSections[_key=="${spec._key}"].description`] = i18nText(
      'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
      'Experience, specialist expertise and modern technology in one place.',
    )
    patch[`pageSections[_key=="${spec._key}"].limit`] = 8
    patch[`pageSections[_key=="${spec._key}"].seeAllLabel`] = i18nString(
      'Se alle urologer',
      'See all urologists',
    )
  }

  console.log(`  ${label} patch keys:`, Object.keys(patch))
  if (DRY_RUN) {
    console.log('  · DRY_RUN — skip write')
    return
  }
  await client.patch(DOC_ID).set(patch).commit({autoGenerateArrayKeys: false})
  console.log(`  ✓ ${label} patched`)
}

async function run() {
  console.log(DRY_RUN ? '🔍 DRY_RUN' : '✍️  WRITE')
  console.log(`Production writes: ${DO_PRODUCTION ? 'yes' : 'no'}`)

  const dev = clientFor('developer')
  const forhudDev = await ensureForhud(dev, 'developer')
  await patchUrologi(dev, 'developer', forhudDev)

  if (DO_PRODUCTION) {
    const prod = clientFor('production')
    const forhudProd = await ensureForhud(prod, 'production')
    await patchUrologi(prod, 'production', forhudProd)
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
