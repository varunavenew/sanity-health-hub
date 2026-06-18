/**
 * Upload why-section lounge image and set on all treatmentCategory landing pages.
 *
 * Usage:
 *   cd test && npm run migrate:category-why-image:dry
 *   cd test && npm run migrate:category-why-image
 */
import * as fs from 'fs'
import * as path from 'path'
import { pickForLang, pickNo } from '../schemaTypes/i18n'
import { i18nString } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const ASSETS_DIR = path.resolve(__dirname, '../../src/assets')
const WHY_IMAGE_PATH = 'hero/hero-clinic-lounge.jpg'
const imageCache = new Map<string, string>()

type CategoryRow = {
  _id: string
  categoryId?: string
  landingPage?: {
    whySection?: {
      image?: unknown
      imageAlt?: unknown
    }
    hero?: {
      secondaryImageAlt?: unknown
    }
  }
}

async function uploadImage(
  relativePath: string,
  label?: string,
): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath)

  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`)
    return null
  }

  if (imageCache.has(relativePath)) {
    const cachedRef = imageCache.get(relativePath)!
    return { _type: 'image', asset: { _type: 'reference', _ref: cachedRef } }
  }

  const fileBuffer = fs.readFileSync(fullPath)
  const ext = path.extname(fullPath).slice(1).toLowerCase()
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  }
  const contentType = mimeTypes[ext] || 'application/octet-stream'
  const filename = label ? `${label}.${ext}` : path.basename(fullPath)

  const res = await fetch(
    `https://${sanityClient.config().projectId}.api.sanity.io/v2024-01-01/assets/images/${sanityClient.config().dataset}?filename=${encodeURIComponent(filename)}&label=${encodeURIComponent(label || '')}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${process.env.SANITY_TOKEN}`,
      },
      body: fileBuffer,
    },
  )

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status}): ${await res.text()}`)
  }

  const json = (await res.json()) as { document: { _id: string } }
  const assetId = json.document._id
  imageCache.set(relativePath, assetId)
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

function hasImage(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const asset = (value as { asset?: { _ref?: string } }).asset
  return Boolean(asset?._ref)
}

function resolveImageAlt(doc: CategoryRow): ReturnType<typeof i18nString> {
  const fromWhy = doc.landingPage?.whySection?.imageAlt
  if (pickNo(fromWhy)?.trim() && pickForLang(fromWhy, 'en')?.trim()) {
    return i18nString(pickNo(fromWhy)!, pickForLang(fromWhy, 'en')!)
  }

  const legacy = doc.landingPage?.hero?.secondaryImageAlt
  if (pickNo(legacy)?.trim() && pickForLang(legacy, 'en')?.trim()) {
    return i18nString(pickNo(legacy)!, pickForLang(legacy, 'en')!)
  }

  return i18nString('CMedical klinikk', 'CMedical clinic')
}

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId,
      landingPage {
        whySection { image, imageAlt },
        hero { secondaryImageAlt }
      }
    }`,
  )

  console.log(`▶ Migrate why-section image (${categories.length} categories)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let imageRef: Awaited<ReturnType<typeof uploadImage>> = null
  if (!DRY_RUN) {
    imageRef = await uploadImage(WHY_IMAGE_PATH, 'category-why-section-lounge')
    if (!imageRef) {
      throw new Error(`Could not upload ${WHY_IMAGE_PATH}`)
    }
    console.log(`  ↑ Uploaded ${WHY_IMAGE_PATH}\n`)
  }

  let updated = 0
  let skipped = 0

  for (const doc of categories) {
    const alreadyHasImage = hasImage(doc.landingPage?.whySection?.image)
    if (!FORCE && alreadyHasImage && pickNo(doc.landingPage?.whySection?.imageAlt)?.trim()) {
      skipped++
      continue
    }

    const patch: Record<string, unknown> = {
      'landingPage.whySection.imageAlt': resolveImageAlt(doc),
    }
    if (imageRef) {
      patch['landingPage.whySection.image'] = imageRef
    }

    console.log(`  ✎ ${doc.categoryId || doc._id}`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set(patch)
        .unset(['landingPage.hero.secondaryImageAlt'])
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} categories: ${updated}`)
  console.log(`⏭  Skipped (already set): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
