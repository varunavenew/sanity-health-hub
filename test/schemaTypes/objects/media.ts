/**
 * Reusable Media object — single CMS shape for Image / Video heroes.
 *
 * Used by Homepage slides, Treatment Category, Treatment, Specialist, Clinic.
 * Do not duplicate these fields inline on page schemas.
 *
 * Video Source is explicit: editors pick Uploaded Video OR External Video URL.
 * The frontend follows `videoSource` — it does not silently prefer upload.
 */
import {ImageIcon} from '@sanity/icons'
import type {ComponentType, ReactNode} from 'react'
import {
  composeImageValidation,
  mediaDescription,
  mediaImageOptions,
  softVideoRules,
  videoDescription,
  VIDEO_GUIDELINE,
} from '../mediaGuidelines'

export type MediaType = 'image' | 'video'
export type VideoSource = 'upload' | 'url'

type MediaParent = {
  mediaType?: MediaType
  videoSource?: VideoSource
  image?: {asset?: {_ref?: string}}
  videoFile?: {asset?: {_ref?: string}}
  videoUrl?: string
}

function isVideo(parent?: MediaParent): boolean {
  return parent?.mediaType === 'video'
}

function isImage(parent?: MediaParent): boolean {
  return (parent?.mediaType ?? 'image') === 'image'
}

/** Missing videoSource behaves as Uploaded Video (schema default). */
function effectiveVideoSource(parent?: MediaParent): VideoSource {
  return parent?.videoSource === 'url' ? 'url' : 'upload'
}

function isUploadSource(parent?: MediaParent): boolean {
  return isVideo(parent) && effectiveVideoSource(parent) === 'upload'
}

function isUrlSource(parent?: MediaParent): boolean {
  return isVideo(parent) && effectiveVideoSource(parent) === 'url'
}

function hasUploadedVideo(parent?: MediaParent): boolean {
  return Boolean(parent?.videoFile?.asset?._ref)
}

function hasVideoUrl(parent?: MediaParent): boolean {
  return typeof parent?.videoUrl === 'string' && parent.videoUrl.trim().length > 0
}

function hasImage(parent?: MediaParent): boolean {
  return Boolean(parent?.image?.asset?._ref)
}

export const mediaObject = {
  name: 'media',
  title: 'Media',
  type: 'object',
  icon: ImageIcon,
  fields: [
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: mediaImageOptions('general'),
      description: mediaDescription(
        'general',
        'Shown when Media Type is Image. Match dimensions to the parent field (hero, specialist, clinic, etc.).',
      ),
      hidden: ({parent}: {parent?: MediaParent}) => isVideo(parent),
      validation: composeImageValidation('general', (Rule: any) =>
        Rule.custom((value: unknown, context: {parent?: MediaParent}) => {
          if (!isImage(context.parent)) return true
          if ((value as {asset?: {_ref?: string}} | undefined)?.asset?._ref) return true
          return 'Image is required when Media Type is Image'
        }),
      ),
    },
    {
      name: 'videoSource',
      title: 'Video Source',
      type: 'string',
      options: {
        list: [
          {title: 'Uploaded Video', value: 'upload'},
          {title: 'External Video URL', value: 'url'},
        ],
        layout: 'radio',
      },
      initialValue: 'upload',
      description: 'Choose how this video is provided. Only one source is used on the website.',
      hidden: ({parent}: {parent?: MediaParent}) => !isVideo(parent),
      validation: (Rule: any) =>
        Rule.custom((value: string | undefined, context: {parent?: MediaParent}) => {
          if (!isVideo(context.parent)) return true
          if (value === 'upload' || value === 'url') return true
          return 'Select Uploaded Video or External Video URL'
        }),
    },
    {
      name: 'videoFile',
      title: 'Upload Video',
      type: 'file',
      options: {
        accept: VIDEO_GUIDELINE.accept,
      },
      description: videoDescription(
        'Stored as a Sanity asset. Prefer external YouTube/Vimeo for longer videos.',
      ),
      hidden: ({parent}: {parent?: MediaParent}) => !isUploadSource(parent),
      validation: (Rule: any) => [
        Rule.custom((value: unknown, context: {parent?: MediaParent}) => {
          if (!isUploadSource(context.parent)) return true
          if ((value as {asset?: {_ref?: string}} | undefined)?.asset?._ref) return true
          return 'Upload a video file when Video Source is Uploaded Video'
        }),
        softVideoRules()(Rule),
      ],
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'YouTube, Vimeo, or a direct MP4/WebM URL. Store the URL only — never embed HTML.\n\nPrefer external URLs for videos longer than ~30 seconds.',
      hidden: ({parent}: {parent?: MediaParent}) => !isUrlSource(parent),
      validation: (Rule: any) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']})
          .custom((value: string | undefined, context: {parent?: MediaParent}) => {
            if (!isUrlSource(context.parent)) return true
            if (!value?.trim()) return 'Video URL is required when Video Source is External Video URL'
            try {
              const host = new URL(value.trim()).hostname.replace(/^www\./, '')
              const path = new URL(value.trim()).pathname.toLowerCase()
              const okHost =
                host === 'youtube.com' ||
                host === 'm.youtube.com' ||
                host === 'youtu.be' ||
                host === 'vimeo.com' ||
                host === 'player.vimeo.com' ||
                path.endsWith('.mp4') ||
                path.endsWith('.webm') ||
                path.endsWith('.mov')
              if (okHost || host.length > 0) return true
              return 'Use a YouTube, Vimeo, or direct video URL'
            } catch {
              return 'Invalid URL'
            }
          }),
    },
  ],
  validation: (Rule: any) =>
    Rule.custom((value: MediaParent | undefined) => {
      if (!value) return true
      if (isImage(value)) {
        if (hasImage(value)) return true
        return 'Image is required when Media Type is Image'
      }
      if (!isVideo(value)) return true
      if (value.videoSource !== 'upload' && value.videoSource !== 'url') {
        return 'Select a Video Source'
      }
      if (value.videoSource === 'upload' && !hasUploadedVideo(value)) {
        return 'Upload a video file when Video Source is Uploaded Video'
      }
      if (value.videoSource === 'url' && !hasVideoUrl(value)) {
        return 'Add a Video URL when Video Source is External Video URL'
      }
      return true
    }),
  preview: {
    select: {
      mediaType: 'mediaType',
      videoSource: 'videoSource',
      image: 'image',
      videoUrl: 'videoUrl',
      videoFile: 'videoFile',
    },
    prepare({
      mediaType,
      videoSource,
      image,
      videoUrl,
      videoFile,
    }: {
      mediaType?: string
      videoSource?: string
      image?: ReactNode | ComponentType
      videoUrl?: string
      videoFile?: {asset?: {_ref?: string}}
    }) {
      if (mediaType === 'video') {
        const source =
          videoSource === 'url'
            ? videoUrl?.trim()
              ? 'External URL'
              : 'External URL (missing)'
            : videoFile?.asset?._ref
              ? 'Uploaded video'
              : 'Uploaded video (missing)'
        return {
          title: 'Video',
          subtitle: source,
          media: image,
        }
      }
      return {
        title: 'Image',
        subtitle: 'Image',
        media: image,
      }
    },
  },
}

export default mediaObject
