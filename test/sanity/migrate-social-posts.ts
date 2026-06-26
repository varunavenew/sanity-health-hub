#!/usr/bin/env npx tsx
/**
 * Seed inline social posts on newsPage (Aktuelt).
 *
 * Run:
 *   cd test && npm run migrate:social-posts:dry
 *   cd test && npm run migrate:social-posts
 */
import * as fs from 'fs'
import * as path from 'path'
import { randomBytes } from 'crypto'
import { sanityClient } from './config'
import { patchSingletonFields } from './lib/patch-singleton'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'

const POSTS = [
  {
    _key: 'social-post-1',
    image: '../../src/assets/social/social-post-1.jpg',
    fallbackImage: '../../src/assets/hero/cmedical-hero-1.jpg',
    alt: 'CMedical team ready to help patients',
    caption:
      'Vårt team er klare for en ny uke med å hjelpe pasienter! 💛 #CMedical #Kvinnehelse',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _key: 'social-post-2',
    image: '../../src/assets/social/social-post-2.jpg',
    fallbackImage: '../../src/assets/hero/hero-technology.jpg',
    alt: 'Robot-assisted surgery at CMedical',
    caption: 'Vi er stolte av å annonsere vår nye robotassisterte kirurgienhet.',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _key: 'social-post-3',
    image: '../../src/assets/social/social-post-3.jpg',
    fallbackImage: '../../src/assets/hero/hero-family.jpg',
    alt: 'Nurse consultation about fertility',
    caption:
      'Visste du at vi tilbyr uforpliktende telefonsamtaler med sykepleier om fertilitet? 🤍',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
  {
    _key: 'social-post-4',
    image: '../../src/assets/social/social-post-4.jpg',
    fallbackImage: '../../src/assets/hero/hero-clinic-lounge.jpg',
    alt: 'Gynecologist specialising in endometriosis',
    caption:
      'Møt vår nye gynekolog som har spesialisering innen endometriose. Velkommen! 🩺',
    postUrl: 'https://www.instagram.com/cmedical.no',
  },
]

const uploadCache = new Map<string, string>()

async function uploadImage(filePath: string): Promise<string | null> {
  const absolutePath = path.resolve(__dirname, filePath)
  if (uploadCache.has(absolutePath)) return uploadCache.get(absolutePath)!

  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ Image not found: ${absolutePath}`)
    return null
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

function itemKey(seed: string): string {
  return seed || randomBytes(4).toString('hex')
}

async function run() {
  const socialPosts: Record<string, unknown>[] = []

  for (const post of POSTS) {
    const assetId =
      (await uploadImage(post.image)) ||
      (post.fallbackImage ? await uploadImage(post.fallbackImage) : null)
    if (!assetId) {
      console.warn(`  ⚠ Skipping ${post._key} — no image`)
      continue
    }

    socialPosts.push({
      _key: itemKey(post._key),
      _type: 'newsSocialPost',
      platform: 'instagram',
      caption: post.caption,
      alt: post.alt,
      postUrl: post.postUrl,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
    })
  }

  const patch = {
    showSocialSection: true,
    socialPostLimit: 4,
    socialPosts,
    socialSectionTitle: i18nString('Følg oss på sosiale medier', 'Follow us on social media'),
  }

  if (DRY_RUN) {
    console.log('\n[dry] Would patch newsPage with', socialPosts.length, 'inline posts')
    return
  }

  await patchSingletonFields('newsPage', patch, 'newsPage')
  console.log(`\n✅ Migrated ${socialPosts.length} social posts onto newsPage`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
