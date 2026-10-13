/**
 * Upload stats-band texture and set landingPage.resultsSection.backgroundImage
 * on treatment categories (same asset as legacy blur-skin-mid.jpg).
 *
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-category-results-background-developer.ts
 *   cd test && npx tsx sanity/migrate-category-results-background-developer.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import {sanityClient} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const ASSETS_DIR = path.resolve(__dirname, '../../src/assets')
const TEXTURE_PATH = 'blur-skin-mid.jpg'

type CategoryRow = {
  _id: string
  categoryId?: string
  landingPage?: {
    resultsSection?: {
      backgroundImage?: unknown
    }
  }
}

async function uploadTexture(): Promise<{
  _type: 'image'
  asset: {_type: 'reference'; _ref: string}
} | null> {
  const fullPath = path.join(ASSETS_DIR, TEXTURE_PATH)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Missing ${fullPath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const res = await fetch(
    `https://${sanityClient.config().projectId}.api.sanity.io/v2024-01-01/assets/images/${sanityClient.config().dataset}?filename=${encodeURIComponent('stats-band-skin-texture.jpg')}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
      },
      body: fileBuffer,
    },
  )

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`)
  }

  const json = (await res.json()) as {document: {_id: string}}
  return {_type: 'image', asset: {_type: 'reference', _ref: json.document._id}}
}

function hasImage(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  return Boolean((value as {asset?: {_ref?: string}}).asset?._ref)
}

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId,
      landingPage { resultsSection { backgroundImage } }
    }`,
  )

  console.log(`▶ Results section background (${categories.length} categories)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let imageRef: Awaited<ReturnType<typeof uploadTexture>> = null
  if (!DRY_RUN) {
    imageRef = await uploadTexture()
    if (!imageRef) throw new Error('Upload failed')
    console.log(`  ↑ Uploaded ${TEXTURE_PATH}\n`)
  }

  let updated = 0
  let skipped = 0

  for (const doc of categories) {
    if (!FORCE && hasImage(doc.landingPage?.resultsSection?.backgroundImage)) {
      skipped++
      continue
    }

    console.log(`  ✎ ${doc.categoryId || doc._id}`)
    if (!DRY_RUN && imageRef) {
      await sanityClient
        .patch(doc._id)
        .set({'landingPage.resultsSection.backgroundImage': imageRef})
        .commit()
    }
    updated++
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}, skipped: ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
