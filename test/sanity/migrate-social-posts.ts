#!/usr/bin/env npx tsx
/**
 * Seed socialPost documents and wire the first four onto newsPage.
 *
 * Run:
 *   cd test && npx tsx sanity/migrate-social-posts.ts
 *
 * ENV:
 *   DRY_RUN=1 — preview only
 */
import * as fs from 'fs'
import * as path from 'path'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const POSTS = [
  {
    _id: 'social-post-1',
    sortOrder: 1,
    image: '../../src/assets/social/social-post-1.jpg',
    alt: 'Anatomisk modell av hjerne',
    caption: 'Faglig innsikt og moderne medisin — hver dag hos CMedical.',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _id: 'social-post-2',
    sortOrder: 2,
    image: '../../src/assets/social/social-post-2.jpg',
    alt: 'Helsepersonell i samtale med pasient',
    caption: 'Omsorgsfull oppfølging fra første time.',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _id: 'social-post-3',
    sortOrder: 3,
    image: '../../src/assets/social/social-post-3.jpg',
    alt: 'Lege ved datamaskin med stetoskop',
    caption: 'Trygg og effektiv journalføring — alltid med pasienten i fokus.',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _id: 'social-post-4',
    sortOrder: 4,
    image: '../../src/assets/social/social-post-4.jpg',
    alt: 'Smilende lege i hvitt kitel',
    caption: 'Møt spesialistene som følger deg gjennom hele forløpet.',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
]

const uploadCache = new Map<string, string>()

async function uploadImage(filePath: string): Promise<string> {
  const absolutePath = path.resolve(__dirname, filePath)
  if (uploadCache.has(absolutePath)) return uploadCache.get(absolutePath)!

  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ Image not found: ${absolutePath}`)
    return ''
  }

  const buffer = fs.readFileSync(absolutePath)
  const ext = path.extname(absolutePath).replace('.', '')
  const contentType =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : 'image/jpeg'

  console.log(`  📤 Uploading ${path.basename(absolutePath)}...`)
  const asset = await sanityClient.assets.upload('image', buffer, {
    filename: path.basename(absolutePath),
    contentType,
  })
  uploadCache.set(absolutePath, asset._id)
  return asset._id
}

async function run() {
  const postRefs: { _type: 'reference'; _ref: string; _key: string }[] = []

  for (const post of POSTS) {
    const assetId = await uploadImage(post.image)
    if (!assetId) {
      console.warn(`  ⚠ Skipping ${post._id} — no image`)
      continue
    }

    const doc = {
      _id: post._id,
      _type: 'socialPost',
      platform: 'instagram',
      caption: post.caption,
      alt: post.alt,
      postUrl: post.postUrl,
      sortOrder: post.sortOrder,
      published: true,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
    }

    if (DRY_RUN) {
      console.log(`  [dry] Would upsert ${post._id}`)
    } else {
      await sanityClient.createOrReplace(doc)
      console.log(`  ✓ ${post._id}`)
    }

    postRefs.push({
      _type: 'reference',
      _ref: post._id,
      _key: post._id,
    })
  }

  const newsPatch = {
    showSocialSection: true,
    socialDisplayMode: 'latest',
    socialPostLimit: 4,
    socialPosts: postRefs,
  }

  if (DRY_RUN) {
    console.log('\n[dry] Would patch newsPage:', newsPatch)
    return
  }

  await sanityClient.patch('newsPage').set(newsPatch).commit()
  await sanityClient.patch('drafts.newsPage').set(newsPatch).commit()
  console.log('\n✅ socialPost documents seeded and newsPage updated')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
