/**
 * Frontend media delivery defaults — mirrors Studio guidelines.
 * Used by image URL builder / ResponsiveImage srcset.
 * Keep in sync with `test/schemaTypes/mediaGuidelines.ts` docs.
 */

export type ImageDeliveryPreset = 'hero' | 'card' | 'profile' | 'gallery' | 'og' | 'thumb'

export const IMAGE_QUALITY = 78

/** Default responsive widths for srcset generation */
export const IMAGE_SRCSET_WIDTHS = [480, 640, 768, 960, 1200, 1600, 1920, 2400] as const

/** Suggested display widths / sizes attribute per preset */
export const IMAGE_PRESET: Record<
  ImageDeliveryPreset,
  { widths: number[]; sizes: string; defaultWidth: number }
> = {
  hero: {
    widths: [960, 1280, 1600, 1920, 2400],
    sizes: '100vw',
    defaultWidth: 1920,
  },
  card: {
    widths: [400, 600, 800, 1200],
    sizes: '(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 400px',
    defaultWidth: 800,
  },
  profile: {
    widths: [400, 600, 800, 1200],
    sizes: '(max-width: 768px) 90vw, 480px',
    defaultWidth: 800,
  },
  gallery: {
    widths: [640, 960, 1280, 1600, 2000],
    sizes: '(max-width: 768px) 100vw, 50vw',
    defaultWidth: 1600,
  },
  og: {
    widths: [1200],
    sizes: '1200px',
    defaultWidth: 1200,
  },
  thumb: {
    widths: [160, 240, 320, 480],
    sizes: '160px',
    defaultWidth: 320,
  },
}

/** Map media UI variants → delivery presets */
export function presetForVariant(
  variant?: 'hero' | 'profile' | 'card' | 'background' | 'gallery',
): ImageDeliveryPreset {
  switch (variant) {
    case 'profile':
      return 'profile'
    case 'card':
      return 'card'
    case 'gallery':
      return 'gallery'
    case 'background':
      return 'hero'
    case 'hero':
    default:
      return 'hero'
  }
}
