/**
 * Align Production category landings with Developer — missing pieces only.
 *
 * Safe rules:
 * - Copy heroMedia.videoFile + mediaType=video when Production lacks videoFile
 *   but Developer has it (gynekologi, fertilitet).
 * - Link fertilitet pageSectionInsurance to the existing Production insurance
 *   collection when the section exists but insuranceCollection is empty.
 * - Set urologi landingPage.sectionOrder so Results renders before Services
 *   (matches reference). Idempotent.
 *
 * Does NOT overwrite valid Production text, images, or existing refs.
 *
 *   cd test && DRY_RUN=1 SANITY_DATASET=production ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-category-landing-prod-gaps.ts
 *   cd test && SANITY_DATASET=production ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-category-landing-prod-gaps.ts
 *
 * Also updates Developer urologi sectionOrder (same order) when missing.
 */
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {assertMigrationDatasetAllowed, requireSanityProjectId} from './dataset-env'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const PROJECT_ID = requireSanityProjectId()
const TOKEN = process.env.SANITY_TOKEN?.trim()
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN')
  process.exit(1)
}

const UROLOGI_ORDER = [
  'segments',
  'why',
  'audiences',
  'expertAreas',
  'symptoms',
  'results',
  'services',
  'support',
  'reviews',
  'spotlight',
  'journey',
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

async function syncHeroVideoFromDeveloper(
  prod: SanityClient,
  dev: SanityClient,
  categoryId: string,
) {
  const [d, p] = await Promise.all([
    dev.fetch<{
      heroMedia?: {
        mediaType?: string
        videoFile?: {asset?: {_ref?: string}; _ref?: string}
      }
      heroVideo?: {asset?: {_ref?: string}; _ref?: string}
    } | null>(
      `*[_type == "treatmentCategory" && categoryId == $id][0]{
        heroMedia{
          mediaType,
          videoFile{ asset{_ref}, _ref }
        },
        heroVideo{ asset{_ref}, _ref }
      }`,
      {id: categoryId},
    ),
    prod.fetch<{
      _id: string
      heroMedia?: {
        _type?: string
        mediaType?: string
        image?: unknown
        videoFile?: {asset?: {_ref?: string}; _ref?: string}
        videoUrl?: string
      }
      heroVideo?: {asset?: {_ref?: string}; _ref?: string}
      heroMediaType?: string
    } | null>(
      `*[_type == "treatmentCategory" && categoryId == $id][0]{
        _id,
        heroMedia,
        heroVideo{ asset{_ref}, _ref },
        heroMediaType
      }`,
      {id: categoryId},
    ),
  ])

  if (!d || !p) {
    console.log(`  · ${categoryId} hero video — missing doc`)
    return
  }

  const fileRef = (v: {asset?: {_ref?: string}; _ref?: string} | undefined) =>
    v?.asset?._ref || v?._ref

  const devVideoRef = fileRef(d.heroMedia?.videoFile) || fileRef(d.heroVideo)
  const prodHasVideoFile = Boolean(fileRef(p.heroMedia?.videoFile))
  const prodMediaType = p.heroMedia?.mediaType || p.heroMediaType

  if (!devVideoRef) {
    console.log(`  · ${categoryId} hero video — Developer has no video; skip`)
    return
  }
  if (prodHasVideoFile && prodMediaType === 'video') {
    console.log(`  · ${categoryId} hero video — Production already video; skip`)
    return
  }

  const nextHeroMedia = {
    _type: p.heroMedia?._type || 'media',
    mediaType: 'video' as const,
    ...(p.heroMedia?.image ? {image: p.heroMedia.image} : {}),
    videoFile: {
      _type: 'file',
      asset: {_type: 'reference', _ref: devVideoRef},
    },
    ...(p.heroMedia?.videoUrl ? {videoUrl: p.heroMedia.videoUrl} : {}),
  }

  console.log(
    `  ✎ ${categoryId} — set heroMedia.mediaType=video + videoFile=${devVideoRef}`,
  )
  if (!DRY_RUN) {
    const patch: Record<string, unknown> = {
      heroMedia: nextHeroMedia,
      heroMediaType: 'video',
    }
    if (!fileRef(p.heroVideo)) {
      patch.heroVideo = {
        _type: 'file',
        asset: {_type: 'reference', _ref: devVideoRef},
      }
    }
    await prod.patch(p._id).set(patch).commit()
  }
}

async function fixFertilitetInsurance(prod: SanityClient) {
  const doc = await prod.fetch<{
    _id: string
    pageSections?: {
      _key?: string
      _type?: string
      insuranceCollection?: {_ref?: string}
    }[]
  } | null>(
    `*[_type == "treatmentCategory" && categoryId == "fertilitet"][0]{
      _id,
      pageSections[]{ _key, _type, insuranceCollection }
    }`,
  )
  if (!doc) return

  const insuranceSection = (doc.pageSections || []).find(
    (s) => s._type === 'pageSectionInsurance',
  )
  if (!insuranceSection) {
    console.log('  · fertilitet insurance — no insurance section; skip')
    return
  }
  if (insuranceSection.insuranceCollection?._ref) {
    console.log('  · fertilitet insurance — already linked; skip')
    return
  }

  const donor = await prod.fetch<{_ref?: string} | null>(
    `*[_type == "treatmentCategory" && categoryId in ["gynekologi","urologi"] && count(pageSections[_type == "pageSectionInsurance" && defined(insuranceCollection._ref)]) > 0][0]{
      "ref": pageSections[_type == "pageSectionInsurance" && defined(insuranceCollection._ref)][0].insuranceCollection._ref
    }.ref`,
  )

  if (!donor) {
    console.log('  · fertilitet insurance — no Production donor collection found')
    return
  }

  const key = insuranceSection._key
  if (!key) {
    console.log('  · fertilitet insurance — section missing _key; skip')
    return
  }

  console.log(`  ✎ fertilitet — link insuranceCollection → ${donor}`)
  if (!DRY_RUN) {
    await prod
      .patch(doc._id)
      .set({
        [`pageSections[_key=="${key}"].insuranceCollection`]: {
          _type: 'reference',
          _ref: donor,
        },
      })
      .commit()
  }
}

async function ensureUrologiOrder(client: SanityClient, dataset: string) {
  const doc = await client.fetch<{_id: string; sectionOrder?: string[]} | null>(
    `*[_type == "treatmentCategory" && categoryId == "urologi"][0]{
      _id,
      "sectionOrder": landingPage.sectionOrder
    }`,
  )
  if (!doc) return

  const current = doc.sectionOrder || []
  const same =
    current.length === UROLOGI_ORDER.length &&
    current.every((k, i) => k === UROLOGI_ORDER[i])
  if (same) {
    console.log(`  · urologi sectionOrder on ${dataset} — already set; skip`)
    return
  }

  console.log(`  ✎ urologi sectionOrder on ${dataset} — results before services`)
  if (!DRY_RUN) {
    await client.patch(doc._id).set({'landingPage.sectionOrder': UROLOGI_ORDER}).commit()
  }
}

async function run() {
  const target = assertMigrationDatasetAllowed()
  console.log(`\nCategory landing gap migration → active dataset guard: ${target}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY_RUN' : 'WRITE'}\n`)

  const prod = clientFor('production')
  const dev = clientFor('developer')

  // Developer SoT order fix (safe, additive)
  console.log('Urologi sectionOrder (Developer):')
  await ensureUrologiOrder(dev, 'developer')

  if (target === 'production') {
    console.log('\nHero video (Production ← Developer mediaType/videoFile only):')
    await syncHeroVideoFromDeveloper(prod, dev, 'gynekologi')
    await syncHeroVideoFromDeveloper(prod, dev, 'fertilitet')

    console.log('\nFertilitet insurance (Production missing ref only):')
    await fixFertilitetInsurance(prod)

    console.log('\nUrologi sectionOrder (Production):')
    await ensureUrologiOrder(prod, 'production')
  } else {
    console.log(
      '\nSkipping Production writes (set SANITY_DATASET=production ALLOW_PRODUCTION_MIGRATION=true).',
    )
  }

  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
