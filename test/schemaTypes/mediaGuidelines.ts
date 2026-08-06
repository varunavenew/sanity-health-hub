/**
 * Shared media upload guidelines for Sanity Studio.
 *
 * Single source of truth for editor descriptions + soft validation.
 * Schemas should call `mediaDescription(kind)` / `softImageRules(kind)` —
 * do not duplicate size/format copy inline.
 *
 * Note: Sanity stores originals; the website CDN serves optimized derivatives.
 * Recommended upload sizes are practical upper bounds for Studio uploads —
 * not the bytes delivered to end users.
 */

export type MediaGuidelineKind =
  | 'hero'
  | 'heroMobile'
  | 'specialist'
  | 'clinic'
  | 'card'
  | 'gallery'
  | 'article'
  | 'treatment'
  | 'category'
  | 'seo'
  | 'logo'
  | 'icon'
  | 'avatar'
  | 'background'
  | 'video'
  | 'poster'
  | 'general'

export type MediaGuideline = {
  /** Short label shown in description heading */
  title: string
  emoji: string
  width: number
  height: number
  aspectLabel: string
  /** Preferred orientation for soft orientation warnings */
  orientation: 'landscape' | 'portrait' | 'square' | 'any'
  formats: string
  /** Soft warning threshold (bytes) — never blocks publish */
  maxBytes: number
  maxBytesLabel: string
  minWidth?: number
  minHeight?: number
  tips: string[]
  /** MIME accept for image fields (optional) */
  accept?: string
}

/** Shown on every image upload field. */
export const SANITY_CDN_OPTIMIZATION_NOTE = [
  'Sanity stores the original uploaded media and automatically delivers optimized versions to the website through its CDN.',
  '',
  'The website automatically resizes, compresses and serves images in modern formats for better performance.',
  '',
  'You do not need to heavily compress images before uploading.',
  '',
  'However, avoid uploading unnecessarily large files (for example 20–50 MB photos) when a smaller export provides the same visual quality.',
].join('\n')

/** Shown on every video upload field. */
export const VIDEO_UPLOAD_NOTE = [
  'Large videos increase upload time.',
  '',
  'For long videos use an external video URL (YouTube/Vimeo).',
  '',
  'Background videos should ideally be short loops.',
].join('\n')

const MB = (n: number) => n * 1024 * 1024

export const MEDIA_GUIDELINES: Record<Exclude<MediaGuidelineKind, 'video'>, MediaGuideline> = {
  general: {
    title: 'Recommended Image',
    emoji: '📸',
    width: 1600,
    height: 900,
    aspectLabel: 'Match the field context (hero 16:9 · portrait 4:5 · card 4:3)',
    orientation: 'any',
    formats: 'JPG / WebP',
    maxBytes: MB(5),
    maxBytesLabel: '5 MB',
    minWidth: 600,
    minHeight: 400,
    tips: [
      'Follow the parent field guidance (hero, specialist, clinic, etc.).',
      'Set the hotspot on the main subject when available.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  hero: {
    title: 'Hero Images',
    emoji: '📸',
    width: 2400,
    height: 1350,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(5),
    maxBytesLabel: '5 MB',
    minWidth: 1200,
    minHeight: 675,
    tips: [
      'Keep the main subject centered (or set the hotspot).',
      'Avoid screenshots and UI captures.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  heroMobile: {
    title: 'Mobile Hero Images',
    emoji: '📱',
    width: 1200,
    height: 1600,
    aspectLabel: '3:4',
    orientation: 'portrait',
    formats: 'JPG / WebP',
    maxBytes: MB(3),
    maxBytesLabel: '3 MB',
    minWidth: 750,
    minHeight: 1000,
    tips: [
      'Crop for vertical phones — faces and subjects near the center.',
      'Optional: desktop keeps using the main hero media.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  specialist: {
    title: 'Specialist Images',
    emoji: '📸',
    width: 1200,
    height: 1500,
    aspectLabel: '4:5',
    orientation: 'portrait',
    formats: 'JPG / WebP',
    maxBytes: MB(3),
    maxBytesLabel: '3 MB',
    minWidth: 600,
    minHeight: 750,
    tips: [
      'Head and shoulders clearly visible.',
      'Set the hotspot on the face.',
      'Avoid wide landscape crops for specialist photos.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  clinic: {
    title: 'Clinic Images',
    emoji: '📸',
    width: 1600,
    height: 900,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(4),
    maxBytesLabel: '4 MB',
    minWidth: 1000,
    minHeight: 560,
    tips: [
      'Show the clinic interior or exterior clearly.',
      'Avoid dark or heavily filtered photos.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  card: {
    title: 'Card Images',
    emoji: '📸',
    width: 1200,
    height: 900,
    aspectLabel: '4:3',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(3),
    maxBytesLabel: '3 MB',
    minWidth: 600,
    minHeight: 450,
    tips: [
      'Subject should read clearly at small card sizes.',
      'Prefer simple backgrounds.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  gallery: {
    title: 'Gallery Images',
    emoji: '📸',
    width: 2000,
    height: 1333,
    aspectLabel: '1600–2400 px wide',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(5),
    maxBytesLabel: '5 MB',
    minWidth: 1200,
    minHeight: 800,
    tips: [
      'Use consistent lighting across gallery images.',
      'Add alt text for accessibility.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  article: {
    title: 'Article Images',
    emoji: '📸',
    width: 1600,
    height: 900,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(4),
    maxBytesLabel: '4 MB',
    minWidth: 1000,
    minHeight: 560,
    tips: [
      'Works as both listing thumbnail and article hero.',
      'Add descriptive alt text.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  treatment: {
    title: 'Treatment Images',
    emoji: '📸',
    width: 1600,
    height: 900,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(4),
    maxBytesLabel: '4 MB',
    minWidth: 1000,
    minHeight: 560,
    tips: [
      'Keep the focal subject clear for related-service cards.',
      'Set the hotspot if the subject is off-center.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  category: {
    title: 'Category Images',
    emoji: '📸',
    width: 1600,
    height: 900,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(4),
    maxBytesLabel: '4 MB',
    minWidth: 1000,
    minHeight: 560,
    tips: [
      'Should represent the specialty at a glance.',
      'Avoid text baked into the image.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  seo: {
    title: 'SEO / Open Graph Images',
    emoji: '🔗',
    width: 1200,
    height: 630,
    aspectLabel: '1.91:1',
    orientation: 'landscape',
    formats: 'JPG / PNG / WebP',
    maxBytes: MB(2),
    maxBytesLabel: '2 MB',
    minWidth: 600,
    minHeight: 315,
    tips: [
      'Safe area: keep important content away from edges.',
      'Text in the image should stay large and readable.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  logo: {
    title: 'Logos',
    emoji: '🏷️',
    width: 512,
    height: 512,
    aspectLabel: '1:1 or original logo ratio',
    orientation: 'any',
    formats: 'SVG preferred · PNG fallback',
    maxBytes: MB(1),
    maxBytesLabel: '1 MB',
    minWidth: 64,
    minHeight: 64,
    tips: [
      'SVG is preferred for sharpness at any size.',
      'PNG should use a transparent background when possible.',
    ],
    accept: 'image/svg+xml,image/png,image/webp',
  },
  icon: {
    title: 'Icons',
    emoji: '✳️',
    width: 256,
    height: 256,
    aspectLabel: '1:1',
    orientation: 'square',
    formats: 'SVG preferred · PNG',
    maxBytes: MB(1),
    maxBytesLabel: '1 MB',
    minWidth: 64,
    minHeight: 64,
    tips: [
      'Prefer the site icon system when possible (Lucide / custom icons).',
      'Uploaded icons should be simple and high-contrast.',
    ],
    accept: 'image/svg+xml,image/png,image/webp',
  },
  avatar: {
    title: 'Avatar Images',
    emoji: '👤',
    width: 400,
    height: 400,
    aspectLabel: '1:1',
    orientation: 'square',
    formats: 'JPG / WebP',
    maxBytes: MB(2),
    maxBytesLabel: '2 MB',
    minWidth: 96,
    minHeight: 96,
    tips: ['Crop tightly on the face.', 'Square images work best.'],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  background: {
    title: 'Background Images',
    emoji: '🎨',
    width: 2000,
    height: 1200,
    aspectLabel: '≈16:10',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(4),
    maxBytesLabel: '4 MB',
    minWidth: 1000,
    minHeight: 600,
    tips: [
      'Soft textures work best — avoid busy photos.',
      'Keep contrast low so text remains readable.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
  poster: {
    title: 'Video Poster Images',
    emoji: '🖼️',
    width: 1920,
    height: 1080,
    aspectLabel: '16:9',
    orientation: 'landscape',
    formats: 'JPG / WebP',
    maxBytes: MB(3),
    maxBytesLabel: '3 MB',
    minWidth: 960,
    minHeight: 540,
    tips: [
      'Should match the first frame or a representative still.',
      'Used before the video loads.',
    ],
    accept: 'image/jpeg,image/jpg,image/webp,image/png',
  },
}

export const VIDEO_GUIDELINE = {
  title: 'Videos',
  emoji: '🎥',
  width: 1920,
  height: 1080,
  formats: 'MP4 (H.264)',
  maxBytes: MB(50),
  maxBytesLabel: '50 MB',
  duration: '15–30 seconds',
  accept: 'video/mp4,video/webm,video/quicktime',
  tips: [
    'Short looping videos work best for heroes.',
    'Prefer external YouTube/Vimeo for longer content.',
  ],
} as const

function formatBytesLabel(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024)
    return mb >= 10 ? `${Math.round(mb)} MB` : `${mb.toFixed(1).replace(/\.0$/, '')} MB`
  }
  return `${Math.round(bytes / 1024)} KB`
}

/** Multi-line Studio description for an image guideline kind — max ~4 short lines. */
export function mediaDescription(
  kind: Exclude<MediaGuidelineKind, 'video'>,
  _prefix?: string,
  _options?: {hotspot?: boolean},
): string {
  const g = MEDIA_GUIDELINES[kind]

  if (kind === 'logo') {
    return [
      'Preferred Format: SVG',
      'PNG Supported',
      `Recommended Upload: Up to ${g.maxBytesLabel}`,
    ].join('\n')
  }

  if (kind === 'gallery') {
    return [
      'Recommended Size: 1600–2400 px wide',
      `Formats: ${g.formats}`,
      `Recommended Upload: Up to ${g.maxBytesLabel}`,
    ].join('\n')
  }

  if (kind === 'icon') {
    return [
      `Preferred Format: ${g.formats}`,
      `Recommended Size: ${g.width} × ${g.height} px`,
      `Recommended Upload: Up to ${g.maxBytesLabel}`,
    ].join('\n')
  }

  return [
    `Recommended Size: ${g.width.toLocaleString('en')} × ${g.height.toLocaleString('en')} px`,
    `Aspect Ratio: ${g.aspectLabel}`,
    `Formats: ${g.formats}`,
    `Recommended Upload: Up to ${g.maxBytesLabel}`,
  ].join('\n')
}

/** Studio description for video uploads — max 3 short lines. */
export function videoDescription(_prefix?: string): string {
  const g = VIDEO_GUIDELINE
  return [
    `Recommended Resolution: ${g.width} × ${g.height}`,
    `Format: ${g.formats}`,
    `Recommended Upload: Up to ${g.maxBytesLabel}`,
  ].join('\n')
}

type ImageAssetLike = {
  asset?: {_ref?: string; _id?: string}
}

type AssetMeta = {
  size?: number
  mimeType?: string
  metadata?: {dimensions?: {width?: number; height?: number}}
}

function orientationOf(width: number, height: number): 'landscape' | 'portrait' | 'square' {
  const ratio = width / height
  if (ratio > 1.08) return 'landscape'
  if (ratio < 0.92) return 'portrait'
  return 'square'
}

/**
 * Soft validation for image fields (warnings, not hard blocks).
 * Fetches asset metadata from Sanity when available.
 */
export function softImageRules(kind: Exclude<MediaGuidelineKind, 'video'>) {
  const g = MEDIA_GUIDELINES[kind]
  return (Rule: any) =>
    Rule.custom(async (value: ImageAssetLike | undefined, context: any) => {
      const ref = value?.asset?._ref
      if (!ref) return true

      try {
        const client = context.getClient({apiVersion: '2024-01-01'})
        const asset: AssetMeta | null = await client.fetch(
          `*[_id == $id][0]{size, mimeType, metadata{dimensions{width,height}}}`,
          {id: ref},
        )
        if (!asset) return true

        const warnings: string[] = []
        const w = asset.metadata?.dimensions?.width
        const h = asset.metadata?.dimensions?.height
        const size = asset.size
        const mime = (asset.mimeType || '').toLowerCase()

        if (g.accept && mime) {
          const allowed = g.accept.split(',').map((a) => a.trim().toLowerCase())
          const mimeOk =
            allowed.includes(mime) ||
            ((mime === 'image/jpeg' || mime === 'image/jpg') &&
              allowed.some((a) => a === 'image/jpeg' || a === 'image/jpg'))
          if (!mimeOk) {
            warnings.push(`Preferred formats: ${g.formats}. Current: ${mime}.`)
          }
        }

        if (typeof size === 'number' && size > g.maxBytes) {
          warnings.push(
            `File is ~${formatBytesLabel(size)} (recommended upload size up to ${g.maxBytesLabel}). Prefer a smaller export when visual quality is already good — Sanity will still optimize delivery automatically.`,
          )
        }

        if (typeof w === 'number' && typeof h === 'number') {
          if (g.minWidth && w < g.minWidth) {
            warnings.push(`Width ${w}px is below recommended minimum ${g.minWidth}px.`)
          }
          if (g.minHeight && h < g.minHeight) {
            warnings.push(`Height ${h}px is below recommended minimum ${g.minHeight}px.`)
          }

          const orient = orientationOf(w, h)
          if (g.orientation === 'landscape' && orient === 'portrait') {
            warnings.push(
              `This looks like a portrait image (${w}×${h}). Recommended for this field: ${g.aspectLabel} landscape.`,
            )
          }
          if (g.orientation === 'portrait' && orient === 'landscape') {
            warnings.push(
              `This looks like a landscape image (${w}×${h}). Recommended for this field: ${g.aspectLabel}.`,
            )
          }
          if (g.orientation === 'square' && orient !== 'square') {
            warnings.push(
              `This image is ${w}×${h}. Recommended for this field: square (${g.aspectLabel}).`,
            )
          }
        }

        if (warnings.length === 0) return true
        return warnings.join(' ')
      } catch {
        return true
      }
    }).warning()
}

/** Soft validation for uploaded video files. */
export function softVideoRules() {
  const g = VIDEO_GUIDELINE
  return (Rule: any) =>
    Rule.custom(async (value: ImageAssetLike | undefined, context: any) => {
      const ref = value?.asset?._ref
      if (!ref) return true
      try {
        const client = context.getClient({apiVersion: '2024-01-01'})
        const asset: AssetMeta | null = await client.fetch(
          `*[_id == $id][0]{size, mimeType}`,
          {id: ref},
        )
        if (!asset) return true
        const warnings: string[] = []
        const mime = (asset.mimeType || '').toLowerCase()
        if (mime && !mime.startsWith('video/')) {
          warnings.push(`Expected a video file. Current type: ${mime}.`)
        }
        if (typeof asset.size === 'number' && asset.size > g.maxBytes) {
          warnings.push(
            `Video is ~${formatBytesLabel(asset.size)} (recommended up to ${g.maxBytesLabel}). Prefer a shorter clip or an external YouTube/Vimeo URL.`,
          )
        }
        if (warnings.length === 0) return true
        return warnings.join(' ')
      } catch {
        return true
      }
    }).warning()
}

/** Image field `options` with hotspot + preferred accept list. */
export function mediaImageOptions(kind: Exclude<MediaGuidelineKind, 'video'>, hotspot = true) {
  const g = MEDIA_GUIDELINES[kind]
  return {
    hotspot,
    ...(g.accept ? {accept: g.accept} : {}),
  }
}

/**
 * Compose hard validation with soft media warnings.
 * Prefer warnings so editors are guided, not blocked.
 */
export function composeImageValidation(
  kind: Exclude<MediaGuidelineKind, 'video'>,
  hardValidation?: (Rule: any) => any,
) {
  const soft = softImageRules(kind)
  if (!hardValidation) return soft
  return (Rule: any) => [hardValidation(Rule), soft(Rule)]
}
