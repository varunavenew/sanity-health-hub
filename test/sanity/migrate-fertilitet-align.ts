/**
 * Align Fertility category landing with Lovable reference.
 *
 * Developer is source of truth for content that is already correct.
 * This script:
 *  - Uploads missing hero-clinic-lounge to Developer (present in Production)
 *  - Patches Developer why + spotlight image refs when wrong
 *  - Sets full sectionOrder on Developer (partial order breaks merge order)
 *  - Copies only missing/wrong media refs + sectionOrder to Production
 *  - Does NOT change hero video (already byte-identical to reference)
 *  - Does NOT overwrite valid audience media/text
 *
 * Usage:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-fertilitet-align.ts
 *   cd test && npx tsx sanity/migrate-fertilitet-align.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-fertilitet-align.ts --production
 */
import * as fs from 'fs'
import * as path from 'path'
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
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

const DOC_ID = 'category-fertilitet'
const SPOTLIGHT_IMAGE_ID =
  'image-4edd4aeb66ce467804f4511c6bc53616dbbd02e9-1920x829-jpg'
const WHY_LOUNGE_SHA = 'a10d662ed7492fa325314e63f353239a7be9b874'
const WHY_LOUNGE_FILENAME = 'hero-clinic-lounge.jpg'

const SECTION_ORDER = [
  'segments',
  'why',
  'audiences',
  'expertAreas',
  'symptoms',
  'services',
  'support',
  'results',
  'reviews',
  'spotlight',
  'journey',
]

const LOUNGE_CANDIDATES = [
  path.resolve(__dirname, '../../src/assets/hero/hero-clinic-lounge.jpg'),
  path.resolve(__dirname, '../../src/assets/hero1/hero/hero-clinic-lounge.jpg'),
  path.resolve(__dirname, '../../src/assets/hero1/hero-clinic-lounge.jpg'),
  path.resolve(__dirname, '../../src/assets/hero copy/hero-clinic-lounge.jpg'),
  path.resolve(__dirname, '../../backups/_tmp-export/fert-ref-why.jpg'),
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

function imgRef(assetId: string) {
  return {_type: 'image' as const, asset: {_type: 'reference' as const, _ref: assetId}}
}

function sameOrder(a: unknown, b: string[]) {
  if (!Array.isArray(a) || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

async function findAssetByShaOrName(
  client: SanityClient,
  sha1: string,
  filename: string,
): Promise<string | null> {
  const bySha = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && sha1hash == $sha][0]._id`,
    {sha: sha1},
  )
  if (bySha) return bySha
  return client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $fn][0]._id`,
    {fn: filename},
  )
}

async function ensureLoungeOnDeveloper(dev: SanityClient): Promise<string> {
  const existing = await findAssetByShaOrName(
    dev,
    WHY_LOUNGE_SHA,
    WHY_LOUNGE_FILENAME,
  )
  if (existing) {
    console.log(`  · Developer already has lounge: ${existing}`)
    return existing
  }

  let buf: Buffer | null = null
  let from = ''
  for (const p of LOUNGE_CANDIDATES) {
    if (fs.existsSync(p)) {
      buf = fs.readFileSync(p)
      from = p
      break
    }
  }
  if (!buf) {
    // Fall back: download from Production CDN if asset exists there
    const prod = clientFor('production')
    const prodId = await findAssetByShaOrName(
      prod,
      WHY_LOUNGE_SHA,
      WHY_LOUNGE_FILENAME,
    )
    if (!prodId) {
      throw new Error('hero-clinic-lounge not found locally or in Production')
    }
    const url = await prod.fetch<string | null>(
      `*[_id == $id][0].url`,
      {id: prodId},
    )
    if (!url) throw new Error('Production lounge has no url')
    console.log(`  · Downloading lounge from Production CDN…`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to download lounge: ${res.status}`)
    buf = Buffer.from(await res.arrayBuffer())
    from = url
  }

  console.log(`  · Uploading lounge to Developer from ${from}`)
  if (DRY_RUN) return `dry-run-${WHY_LOUNGE_SHA}`
  const asset = await dev.assets.upload('image', buf, {
    filename: WHY_LOUNGE_FILENAME,
    contentType: 'image/jpeg',
  })
  console.log(`  ✓ Uploaded ${asset._id}`)
  return asset._id
}

async function ensureAssetOnProduction(
  prod: SanityClient,
  sourceUrl: string,
  filename: string,
  sha1: string,
): Promise<string> {
  const existing = await findAssetByShaOrName(prod, sha1, filename)
  if (existing) {
    console.log(`  · Production already has ${filename}: ${existing}`)
    return existing
  }
  console.log(`  · Copying ${filename} to Production…`)
  if (DRY_RUN) return `dry-run-${sha1}`
  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`Download failed ${sourceUrl}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await prod.assets.upload('image', buf, {
    filename,
    contentType: 'image/jpeg',
  })
  console.log(`  ✓ Uploaded ${asset._id}`)
  return asset._id
}

type LandingSnap = {
  _id: string
  sectionOrder?: string[]
  whyImageId?: string | null
  spotlightImageId?: string | null
  heroVideoId?: string | null
  heroImageId?: string | null
}

const SNAP_Q = `*[_id == $id][0]{
  _id,
  "sectionOrder": landingPage.sectionOrder,
  "whyImageId": landingPage.whySection.image.asset->_id,
  "spotlightImageId": landingPage.spotlightSection.image.asset->_id,
  "heroVideoId": coalesce(heroMedia.videoFile.asset->_id, heroVideo.asset->_id),
  "heroImageId": coalesce(heroMedia.image.asset->_id, heroImage.asset->_id)
}`

async function patchFertility(
  client: SanityClient,
  label: string,
  loungeId: string,
  spotlightId: string,
) {
  const snap = await client.fetch<LandingSnap | null>(SNAP_Q, {id: DOC_ID})
  if (!snap) {
    console.log(`  ✗ ${label}: missing ${DOC_ID}`)
    return
  }

  console.log(`  ${label} before:`, {
    sectionOrder: snap.sectionOrder,
    whyImageId: snap.whyImageId,
    spotlightImageId: snap.spotlightImageId,
    heroVideoId: snap.heroVideoId,
  })

  const patch: Record<string, unknown> = {}
  if (!sameOrder(snap.sectionOrder, SECTION_ORDER)) {
    patch['landingPage.sectionOrder'] = SECTION_ORDER
  }
  if (snap.whyImageId !== loungeId) {
    patch['landingPage.whySection.image'] = imgRef(loungeId)
  }
  if (snap.spotlightImageId !== spotlightId) {
    patch['landingPage.spotlightSection.image'] = imgRef(spotlightId)
  }

  if (Object.keys(patch).length === 0) {
    console.log(`  · ${label}: already aligned`)
    return
  }

  console.log(`  ${label} patch keys:`, Object.keys(patch))
  if (DRY_RUN) {
    console.log(`  · DRY_RUN — skip write`)
    return
  }
  await client.patch(DOC_ID).set(patch).commit({autoGenerateArrayKeys: true})
  console.log(`  ✓ ${label} patched`)
}

async function run() {
  console.log(DRY_RUN ? '🔍 DRY_RUN' : '✍️  WRITE')
  console.log(`Production writes: ${DO_PRODUCTION ? 'yes' : 'no'}`)

  const dev = clientFor('developer')
  const loungeDevId = await ensureLoungeOnDeveloper(dev)

  // Spotlight asset already exists on both datasets with same id pattern
  const spotlightDev =
    (await findAssetByShaOrName(
      dev,
      '4edd4aeb66ce467804f4511c6bc53616dbbd02e9',
      'hero-fertilitet.jpg',
    )) || SPOTLIGHT_IMAGE_ID

  await patchFertility(dev, 'developer', loungeDevId, spotlightDev)

  if (DO_PRODUCTION) {
    const prod = clientFor('production')
    let loungeProd = await findAssetByShaOrName(
      prod,
      WHY_LOUNGE_SHA,
      WHY_LOUNGE_FILENAME,
    )
    if (!loungeProd) {
      const localLounge =
        LOUNGE_CANDIDATES.find((p) => fs.existsSync(p)) ||
        path.resolve(__dirname, '../../backups/_tmp-export/fert-ref-why.jpg')
      const url = fs.existsSync(localLounge)
        ? null
        : `https://cdn.sanity.io/images/${PROJECT_ID}/production/a10d662ed7492fa325314e63f353239a7be9b874-1333x1499.jpg`
      if (url) {
        loungeProd = await ensureAssetOnProduction(
          prod,
          url,
          WHY_LOUNGE_FILENAME,
          WHY_LOUNGE_SHA,
        )
      } else {
        console.log(`  · Uploading lounge to Production from ${localLounge}`)
        if (DRY_RUN) {
          loungeProd = `dry-run-${WHY_LOUNGE_SHA}`
        } else {
          const asset = await prod.assets.upload(
            'image',
            fs.readFileSync(localLounge),
            {filename: WHY_LOUNGE_FILENAME, contentType: 'image/jpeg'},
          )
          loungeProd = asset._id
          console.log(`  ✓ Uploaded ${loungeProd}`)
        }
      }
    }

    const spotlightProd =
      (await findAssetByShaOrName(
        prod,
        '4edd4aeb66ce467804f4511c6bc53616dbbd02e9',
        'hero-fertilitet.jpg',
      )) || SPOTLIGHT_IMAGE_ID

    await patchFertility(prod, 'production', loungeProd!, spotlightProd)
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
