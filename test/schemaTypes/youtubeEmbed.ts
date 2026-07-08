/** Inline YouTube embed for Portable Text (`blockContent`). */
export default {
  name: 'youtubeEmbed',
  title: 'YouTube',
  type: 'object',
  fields: [
    {
      name: 'url',
      title: 'YouTube-URL',
      type: 'url',
      description:
        'Paste a YouTube link (e.g. https://www.youtube.com/watch?v=..., https://youtu.be/... or embed URL).',
      validation: (Rule: any) =>
        Rule.required().custom((value: string | undefined) => {
          if (!value?.trim()) return 'URL is required'
          try {
            const host = new URL(value.trim()).hostname.replace(/^www\./, '')
            if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
              return true
            }
            return 'Must be a YouTube link (youtube.com or youtu.be)'
          } catch {
            return 'Ugyldig URL'
          }
        }),
    },
    {
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    },
  ],
  preview: {
    select: { url: 'url', caption: 'caption' },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      return {
        title: caption || 'YouTube Video',
        subtitle: url,
      }
    },
  },
}
