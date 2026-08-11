/**
 * Developer-only Clinics normalization vs avenewdemo reference.
 * SAFETY: refuses non-developer datasets.
 *
 * - Deletes clinicPage-ski (+ draft)
 * - Updates clinic addresses/descriptions/sortOrder from reference
 * - Clears clinicsPage heroEyebrow (reference has none)
 * - Uploads reference clinic images and attaches them
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
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
const DATASET = 'developer'
const DRY_RUN = process.env.DRY_RUN === '1'

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing project/token')
  process.exit(1)
}

console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=${DATASET}`)
if (DATASET !== 'developer') {
  throw new Error('Refusing non-developer dataset')
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

const REF_IMAGES = {
  majorstuen: 'https://avenewdemo.online/assets/majorstuen-CMRqWSiw.jpg',
  bekkestua: 'https://avenewdemo.online/assets/bekkestua-Cmpd10np.jpg',
  moss: 'https://avenewdemo.online/assets/moss-BetJ801u.jpg',
  moelv: 'https://avenewdemo.online/assets/moelv-DTTTH4qN.jpg',
} as const

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

async function uploadImage(url: string, filename: string) {
  const buf = await download(url)
  const asset = await client.assets.upload('image', buf, {filename})
  return {
    _type: 'image' as const,
    asset: {_type: 'reference' as const, _ref: asset._id},
  }
}

async function unsetSkiRefs() {
  const refs = await client.fetch<{_id: string; _type: string}[]>(
    `*[references("clinicPage-ski")]{_id,_type}`,
  )
  console.log(
    'Ski references:',
    refs.map((r) => `${r._type}:${r._id}`),
  )
  for (const doc of refs) {
    if (DRY_RUN) {
      console.log(`DRY: would unset Ski refs from ${doc._id}`)
      continue
    }
    if (doc._type === 'contactPage') {
      await client
        .patch(doc._id)
        .unset(['clinicsSection.clinics[_ref=="clinicPage-ski"]'])
        .commit()
      console.log(`✓ Unset contactPage clinicsSection Ski ref`)
      continue
    }
    if (doc._type === 'specialist') {
      await client.patch(doc._id).unset(['clinics[_ref=="clinicPage-ski"]']).commit()
      console.log(`✓ Unset specialist clinics[] Ski ref from ${doc._id}`)
      continue
    }
    await client
      .patch(doc._id)
      .unset([
        `clinics[_ref=="clinicPage-ski"]`,
        `clinicsSection.clinics[_ref=="clinicPage-ski"]`,
      ])
      .commit()
    console.log(`✓ Fallback unset Ski refs from ${doc._id}`)
  }
}

async function run() {
  // 1) Verify Ski doc and remove inbound references first
  const ski = await client.fetch<{_id: string; title?: unknown} | null>(
    `*[_id == "clinicPage-ski"][0]{_id, title}`,
  )
  console.log('Ski doc:', JSON.stringify(ski))

  if (ski?._id === 'clinicPage-ski') {
    await unsetSkiRefs()
  }

  if (!DRY_RUN && ski?._id === 'clinicPage-ski') {
    await client.delete('clinicPage-ski')
    console.log('✓ Deleted clinicPage-ski')
    try {
      await client.delete('drafts.clinicPage-ski')
      console.log('✓ Deleted drafts.clinicPage-ski')
    } catch {
      /* ok */
    }
  } else if (DRY_RUN) {
    console.log('DRY: would delete clinicPage-ski')
  }

  // 2) Upload images
  const imageBySlug: Record<string, { _type: 'image'; asset: {_type: 'reference'; _ref: string} }> = {}
  for (const [slug, url] of Object.entries(REF_IMAGES)) {
    if (DRY_RUN) {
      console.log(`DRY: would upload ${slug} from ${url}`)
      continue
    }
    imageBySlug[slug] = await uploadImage(url, `${slug}-ref.jpg`)
    console.log(`✓ Uploaded ${slug} → ${imageBySlug[slug].asset._ref}`)
  }

  // 3) Patch clinics
  const patches: {
    id: string
    slug: keyof typeof REF_IMAGES
    sortOrder: number
    address: string
    phone: string
    hoursNo: string
    hoursEn: string
    descriptionNo: string
    descriptionEn: string
    titleNo: string
    titleEn: string
    clearBadGeo?: boolean
  }[] = [
    {
      id: 'clinicPage-majorstuen',
      slug: 'majorstuen',
      sortOrder: 1,
      address: 'Sørkedalsveien 10 B, 0369 Oslo',
      phone: '22 60 00 50',
      hoursNo: 'Man–Fre 08:00–16:00',
      hoursEn: 'Mon–Fri 08:00–16:00',
      titleNo: 'Oslo Majorstuen',
      titleEn: 'Oslo Majorstuen',
      clearBadGeo: true,
      descriptionNo:
        'CMedical Majorstuen er vår hovedklinikk i Oslo, sentralt plassert i Sørkedalsveien 10 B. Her tilbyr vi det bredeste spekteret av spesialisthelsetjenester, fra gynekologi og fertilitet til ortopedi og urologi. Klinikken er moderne innredet med pasientkomfort i fokus.',
      descriptionEn:
        'CMedical Majorstuen is our main clinic in Oslo, centrally located at Sørkedalsveien 10 B. Here we offer the broadest range of specialist healthcare services, from gynaecology and fertility to orthopaedics and urology. The clinic is modern and designed with patient comfort in mind.',
    },
    {
      id: 'clinicPage-bekkestua',
      slug: 'bekkestua',
      sortOrder: 2,
      address: 'Gamle Ringeriksvei 36, 1357 Bekkestua',
      phone: '22 60 00 50',
      hoursNo: 'Man–Fre 08:00–16:00',
      hoursEn: 'Mon–Fri 08:00–16:00',
      titleNo: 'Bekkestua',
      titleEn: 'Bekkestua',
      descriptionNo:
        'CMedical Bekkestua ligger sentralt på Bekkestua i Bærum. Klinikken tilbyr gynekologi og hudhelse i moderne og rolige omgivelser.',
      descriptionEn:
        'CMedical Bekkestua is centrally located in Bekkestua, Bærum. The clinic offers gynaecology and dermatology in modern, calm surroundings.',
    },
    {
      id: 'clinicPage-moss',
      slug: 'moss',
      sortOrder: 3,
      address: 'Lilleengveien 8, 1523 Moss',
      phone: '69 25 40 00',
      hoursNo: 'Man–Fre 08:00–15:30',
      hoursEn: 'Mon–Fri 08:00–15:30',
      titleNo: 'Moss',
      titleEn: 'Moss',
      descriptionNo:
        'CMedical Moss holder til i Lilleengveien 8 og tilbyr et bredt spekter av tjenester inkludert gynekologi, ortopedi, gastrokirurgi og fysioterapi.',
      descriptionEn:
        'CMedical Moss is located at Lilleengveien 8 and offers a wide range of services including gynaecology, orthopaedics, gastrointestinal surgery and physiotherapy.',
    },
    {
      id: 'clinicPage-moelv',
      slug: 'moelv',
      sortOrder: 4,
      address: 'Storgata 60, 2390 Moelv',
      phone: '23 60 00 50',
      hoursNo: 'Man–Fre 08:30–15:30',
      hoursEn: 'Mon–Fri 08:30–15:30',
      titleNo: 'Moelv',
      titleEn: 'Moelv',
      descriptionNo:
        'CMedical Moelv ligger i Storgata 60 og er vår klinikk i Innlandet. Her tilbyr vi gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin.',
      descriptionEn:
        'CMedical Moelv is located at Storgata 60 and is our clinic in Innlandet. Here we offer gynaecology, orthopaedics, urology, vascular surgery and general practice.',
    },
  ]

  for (const p of patches) {
    const image = imageBySlug[p.slug]
    const set: Record<string, unknown> = {
      sortOrder: p.sortOrder,
      address: p.address,
      phone: p.phone,
      title: [
        {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: p.titleNo},
        {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: p.titleEn},
      ],
      hours: [
        {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: p.hoursNo},
        {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: p.hoursEn},
      ],
      description: [
        {_key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: p.descriptionNo},
        {_key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: p.descriptionEn},
      ],
    }
    if (image) {
      set.primaryImage = image
      // Keep heroMedia in sync as image dual-read prefers it when present
      set.heroMedia = {
        _type: 'media',
        mediaType: 'image',
        image,
      }
    }

    console.log(`Patch ${p.id}:`, {
      sortOrder: p.sortOrder,
      address: p.address,
      hasImage: Boolean(image),
    })
    if (!DRY_RUN) {
      let patch = client.patch(p.id).set(set)
      if (p.clearBadGeo) {
        // Corrupt lat/lng was producing invalid maps links; address-based maps URL is used instead.
        patch = patch.unset(['locationSearch'])
      }
      await patch.commit({autoGenerateArrayKeys: true})
      console.log(`✓ Patched ${p.id}`)
    }
  }

  // 4) clinicsPage hero: no eyebrow on reference; update SEO title; hero image = majorstuen
  const pageSet: Record<string, unknown> = {
    heroEyebrow: [],
    heroTitle: [
      {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: 'Finn din nærmeste klinikk'},
      {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: 'Find your nearest clinic'},
    ],
    heroDescription: [
      {
        _key: 'no',
        _type: 'internationalizedArrayTextValue',
        language: 'no',
        value: 'Våre klinikker i Norge tilbyr spesialisthjelp uten henvisning og med kort ventetid.',
      },
      {
        _key: 'en',
        _type: 'internationalizedArrayTextValue',
        language: 'en',
        value: 'Our clinics in Norway offer specialist care without referral and with short waiting times.',
      },
    ],
    'seo.metaTitle': [
      {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: 'Våre klinikker | CMedical'},
      {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: 'Our clinics | CMedical'},
    ],
  }
  if (imageBySlug.majorstuen) {
    pageSet.heroImage = imageBySlug.majorstuen
  }

  console.log('Patch clinicsPage hero/seo', {clearEyebrow: true, hasHeroImage: Boolean(imageBySlug.majorstuen)})
  if (!DRY_RUN) {
    await client.patch('clinicsPage').set(pageSet).unset(['heroEyebrow']).commit({autoGenerateArrayKeys: true})
    // ensure eyebrow cleared
    await client.patch('clinicsPage').unset(['heroEyebrow']).commit()
    console.log('✓ Patched clinicsPage')

    // Clinics Booking CTA band — match reference Norwegian "bestilling"
    const bookingSubtitleNo =
      'Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.'
    const bookingSubtitleEn =
      'Choose service, clinic and practitioner – all in one simple booking.'
    await client
      .patch('clinicsPage')
      .set({
        'pageSections[_key=="clinicsPage-booking-cta"].subtitle': [
          {
            _key: 'no',
            _type: 'internationalizedArrayTextValue',
            language: 'no',
            value: bookingSubtitleNo,
          },
          {
            _key: 'en',
            _type: 'internationalizedArrayTextValue',
            language: 'en',
            value: bookingSubtitleEn,
          },
        ],
      })
      .commit({autoGenerateArrayKeys: true})
    console.log('✓ Patched clinicsPage booking CTA subtitle')
  }

  console.log(DRY_RUN ? 'Dry-run complete' : 'Developer Clinics normalization complete. Production NOT touched.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
