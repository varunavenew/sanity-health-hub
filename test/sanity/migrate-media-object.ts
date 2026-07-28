/**
 * Phase 3 — Migrate legacy hero media fields into the shared `media` object.
 *
 * Scope (developer dataset only):
 *   - homepage.heroBanner.slides[] → slides[].media
 *   - treatmentCategory → heroMedia
 *   - treatment → heroMedia
 *   - specialist → heroMedia
 *   - clinicPage → heroMedia
 *
 * Behaviour:
 *   - Skip when target media already has usable content
 *   - Never delete legacy fields
 *   - Idempotent; syncs drafts when present
 *   - Video priority after migration: videoFile upload > videoUrl
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-media-object.ts
 *   npx tsx sanity/migrate-media-object.ts
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type MediaValue = {
  _type: 'media'
  mediaType: 'image' | 'video'
  image?: unknown
  videoFile?: unknown
  videoUrl?: string
}

function hasMedia(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const m = value as MediaValue
  if (m.mediaType === 'video') {
    return Boolean(
      (m.videoFile as {asset?: {_ref?: string}} | undefined)?.asset?._ref ||
        (typeof m.videoUrl === 'string' && m.videoUrl.trim()),
    )
  }
  return Boolean((m.image as {asset?: {_ref?: string}} | undefined)?.asset?._ref)
}

function fromImage(image: unknown): MediaValue | null {
  if (!image || typeof image !== 'object') return null
  if (!(image as {asset?: {_ref?: string}}).asset?._ref) return null
  return {_type: 'media', mediaType: 'image', image}
}

function fromCategory(doc: {
  heroMediaType?: string
  heroImage?: unknown
  heroVideo?: unknown
}): MediaValue | null {
  if (doc.heroMediaType === 'video' && doc.heroVideo) {
    return {_type: 'media', mediaType: 'video', videoFile: doc.heroVideo, image: doc.heroImage}
  }
  return fromImage(doc.heroImage)
}

function fromTreatment(doc: {heroImage?: unknown; heroVideo?: string}): MediaValue | null {
  if (typeof doc.heroVideo === 'string' && doc.heroVideo.trim()) {
    return {
      _type: 'media',
      mediaType: 'video',
      videoUrl: doc.heroVideo.trim(),
      image: doc.heroImage,
    }
  }
  return fromImage(doc.heroImage)
}

function fromSlide(slide: {
  media?: unknown
  image?: unknown
  videoFile?: unknown
}): MediaValue | null {
  if (hasMedia(slide.media)) return null
  if (slide.videoFile && (slide.videoFile as {asset?: {_ref?: string}}).asset?._ref) {
    return {_type: 'media', mediaType: 'video', videoFile: slide.videoFile, image: slide.image}
  }
  return fromImage(slide.image)
}

async function patchDoc(id: string, set: Record<string, unknown>) {
  if (DRY_RUN) {
    console.log(`[dry-run] patch ${id}`, Object.keys(set))
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

async function migrateHomepage() {
  const docs = await client.fetch<
    Array<{
      _id: string
      heroBanner?: {slides?: Array<{media?: unknown; image?: unknown; videoFile?: unknown}>}
    }>
  >(`*[_type == "homepage"]{_id, heroBanner}`)

  let migrated = 0
  for (const doc of docs) {
    const slides = doc.heroBanner?.slides
    if (!Array.isArray(slides) || slides.length === 0) continue
    let changed = false
    const nextSlides = slides.map((slide) => {
      const media = fromSlide(slide)
      if (!media) return slide
      changed = true
      return {...slide, media}
    })
    if (!changed) continue
    const set = {heroBanner: {...doc.heroBanner, slides: nextSlides}}
    await patchDoc(doc._id, set)
    await syncDraft(doc._id, set)
    migrated += 1
    console.log(`homepage ${doc._id}: migrated ${nextSlides.filter((s) => s.media).length} slides`)
  }
  return migrated
}

async function migrateType(
  type: string,
  build: (doc: Record<string, unknown>) => MediaValue | null,
) {
  const docs = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type == $type]{_id, heroMedia, heroMediaType, heroImage, heroVideo, photo, primaryImage}`,
    {type},
  )
  let migrated = 0
  for (const doc of docs) {
    if (hasMedia(doc.heroMedia)) continue
    const media = build(doc)
    if (!media) continue
    const set = {heroMedia: media}
    await patchDoc(String(doc._id), set)
    await syncDraft(String(doc._id), set)
    migrated += 1
    console.log(`${type} ${doc._id}: mediaType=${media.mediaType}`)
  }
  return migrated
}

async function main() {
  console.log(`Media object migration — dataset guard via config — DRY_RUN=${DRY_RUN}`)
  const homepage = await migrateHomepage()
  const categories = await migrateType('treatmentCategory', (d) =>
    fromCategory({
      heroMediaType: d.heroMediaType as string | undefined,
      heroImage: d.heroImage,
      heroVideo: d.heroVideo,
    }),
  )
  const treatments = await migrateType('treatment', (d) =>
    fromTreatment({
      heroImage: d.heroImage,
      heroVideo: typeof d.heroVideo === 'string' ? d.heroVideo : undefined,
    }),
  )
  const specialists = await migrateType('specialist', (d) => fromImage(d.photo))
  const clinics = await migrateType('clinicPage', (d) => fromImage(d.primaryImage))

  console.log(
    JSON.stringify(
      {homepage, categories, treatments, specialists, clinics, dryRun: DRY_RUN},
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
