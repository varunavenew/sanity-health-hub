/**
 * Reusable Media object — single CMS shape for Image / Video heroes.
 *
 * Used by Homepage slides, Treatment Category, Treatment, Specialist, Clinic.
 * Do not duplicate these fields inline on page schemas.
 *
 * Video priority when both are set: Upload Video wins over Video URL.
 */
import {ImageIcon} from '@sanity/icons'
import type {ComponentType, ReactNode} from 'react'

type MediaParent = {
  mediaType?: 'image' | 'video'
  videoFile?: {asset?: {_ref?: string}}
  videoUrl?: string
}

function hasUploadedVideo(parent?: MediaParent): boolean {
  return Boolean(parent?.videoFile?.asset?._ref)
}

function hasVideoUrl(parent?: MediaParent): boolean {
  return typeof parent?.videoUrl === 'string' && parent.videoUrl.trim().length > 0
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
      title: 'Image Upload',
      type: 'image',
      options: {hotspot: true},
      description: 'Shown when Media Type is Image. Also used as video poster when helpful.',
      hidden: ({parent}: {parent?: MediaParent}) => parent?.mediaType === 'video',
    },
    {
      name: 'videoFile',
      title: 'Upload Video',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm,video/quicktime,video/*',
      },
      description:
        'MP4, WebM, or MOV (when supported). Stored as a Sanity asset. Takes priority over Video URL.',
      hidden: ({parent}: {parent?: MediaParent}) => (parent?.mediaType ?? 'image') !== 'video',
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description:
        'YouTube, Vimeo, or a direct MP4/WebM URL. Store the URL only — never embed HTML. Used when no uploaded video is set.',
      hidden: ({parent}: {parent?: MediaParent}) => (parent?.mediaType ?? 'image') !== 'video',
      validation: (Rule: any) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']}).custom(
          (value: string | undefined) => {
            if (!value?.trim()) return true
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
              // Allow any https URL that looks like a direct file, or known hosts
              if (okHost) return true
              // Direct CDN / asset URLs without extension still allowed if http(s)
              if (host.length > 0) return true
              return 'Use a YouTube, Vimeo, or direct video URL'
            } catch {
              return 'Invalid URL'
            }
          },
        ),
    },
  ],
  validation: (Rule: any) =>
    Rule.custom((value: MediaParent | undefined) => {
      if (!value || value.mediaType !== 'video') return true
      if (hasUploadedVideo(value) || hasVideoUrl(value)) return true
      return 'When Video is selected, add Upload Video or Video URL'
    }),
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
      videoUrl: 'videoUrl',
      videoFile: 'videoFile',
    },
    prepare({
      mediaType,
      image,
      videoUrl,
      videoFile,
    }: {
      mediaType?: string
      // Sanity preview.select values are untyped at the schema boundary.
      image?: ReactNode | ComponentType
      videoUrl?: string
      videoFile?: {asset?: {_ref?: string}}
    }) {
      const type = mediaType === 'video' ? 'Video' : 'Image'
      const detail =
        mediaType === 'video'
          ? videoFile?.asset?._ref
            ? 'Uploaded video'
            : videoUrl?.trim() || 'No video source'
          : 'Image'
      return {
        title: type,
        subtitle: detail,
        media: image,
      }
    },
  },
}

export default mediaObject
