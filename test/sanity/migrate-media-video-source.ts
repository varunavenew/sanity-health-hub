/**
 * Migrate shared `media` objects to set explicit `videoSource`.
 *
 * Rules (preserves current website visuals):
 *   mediaType == video → videoSource = "upload" by default
 *   mediaType == video && only videoUrl (no upload) → videoSource = "url"
 *   both upload + URL → "upload" (matches historical frontend preference)
 *
 * Does not delete videoFile / videoUrl. Idempotent.
 *
 * Usage:
 *   cd test
 *   npm run migrate:media-video-source:dry
 *   npm run migrate:media-video-source
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

type VideoSource = 'upload' | 'url'

type MediaValue = {
  _type?: 'media'
  mediaType?: 'image' | 'video'
  videoSource?: VideoSource
  image?: unknown
  videoFile?: {asset?: {_ref?: string}}
  videoUrl?: string
}

function fileRef(file: unknown): string | undefined {
  if (!file || typeof file !== 'object') return undefined
  const f = file as {asset?: {_ref?: string}; _ref?: string}
  return f.asset?._ref || f._ref
}

function inferVideoSource(media: MediaValue): VideoSource | null {
  if (media.mediaType !== 'video') return null
  if (media.videoSource === 'upload' || media.videoSource === 'url') {
    return null // already set
  }
  const hasFile = Boolean(fileRef(media.videoFile))
  const hasUrl = typeof media.videoUrl === 'string' && media.videoUrl.trim().length > 0
  // Only URL (no upload) → External Video URL; otherwise default to Uploaded Video
  if (hasUrl && !hasFile) return 'url'
  return 'upload'
}

function withVideoSource(media: MediaValue, source: VideoSource): MediaValue {
  return {...media, _type: media._type || 'media', videoSource: source}
}

async function patchDoc(id: string, set: Record<string, unknown>) {
  if (DRY_RUN) {
    console.log(`[dry-run] patch ${id}`, JSON.stringify(set, null, 2))
    return
  }
  await client.patch(id).set(set).commit({autoGenerateArrayKeys: true})
}

async function syncDraft(publishedId: string, set: Record<string, unknown>) {
  const draftId = publishedId.startsWith('drafts.') ? publishedId : `drafts.${publishedId}`
  if (draftId === publishedId) return
  const draft = await client.fetch(`*[_id == $id][0]._id`, {id: draftId})
  if (!draft) return
  await patchDoc(draftId, set)
}

type DocHit = {
  _id: string
  _type: string
  heroMedia?: MediaValue
  media?: MediaValue
  heroBanner?: {slides?: Array<{_key?: string; media?: MediaValue}>}
}

async function migrateHeroMediaDocs(type: string) {
  const docs = await client.fetch<DocHit[]>(
    `*[_type == $type && defined(heroMedia)]{_id, _type, heroMedia}`,
    {type},
  )

  let updated = 0
  for (const doc of docs) {
    const source = inferVideoSource(doc.heroMedia || {})
    if (!source || !doc.heroMedia) continue
    const next = withVideoSource(doc.heroMedia, source)
    const set = {heroMedia: next}
    console.log(`✎ ${doc._type} ${doc._id} → videoSource=${source}`)
    await patchDoc(doc._id, set)
    await syncDraft(doc._id, set)
    updated += 1
  }
  return updated
}

async function migrateHomepageSlides() {
  const docs = await client.fetch<DocHit[]>(
    `*[_type == "homepage"]{_id, _type, heroBanner}`,
  )

  let updated = 0
  for (const doc of docs) {
    const slides = doc.heroBanner?.slides
    if (!Array.isArray(slides) || slides.length === 0) continue

    let changed = false
    const nextSlides = slides.map((slide) => {
      const source = inferVideoSource(slide.media || {})
      if (!source || !slide.media) return slide
      changed = true
      return {...slide, media: withVideoSource(slide.media, source)}
    })
    if (!changed) continue

    const set = {'heroBanner.slides': nextSlides}
    console.log(`✎ homepage ${doc._id} slides → set videoSource where needed`)
    await patchDoc(doc._id, set)
    await syncDraft(doc._id, set)
    updated += 1
  }
  return updated
}

async function migratePrivacyAndGuide() {
  // Same heroMedia field name
  let n = 0
  n += await migrateHeroMediaDocs('guidePage')
  n += await migrateHeroMediaDocs('privacyPolicyPage')
  return n
}

async function main() {
  console.log(
    [
      '',
      'Migrate media.videoSource',
      `Dataset: ${process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || '(from config)'}`,
      `DRY_RUN: ${DRY_RUN}`,
      '',
    ].join('\n'),
  )

  let total = 0
  total += await migrateHomepageSlides()
  total += await migrateHeroMediaDocs('treatmentCategory')
  total += await migrateHeroMediaDocs('treatment')
  total += await migrateHeroMediaDocs('specialist')
  total += await migrateHeroMediaDocs('clinicPage')
  total += await migratePrivacyAndGuide()

  console.log(`\nDone. Documents patched: ${total}${DRY_RUN ? ' (dry-run)' : ''}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
