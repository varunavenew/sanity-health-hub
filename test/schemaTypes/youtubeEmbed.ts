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
        'Lim inn en YouTube-lenke (f.eks. https://www.youtube.com/watch?v=…, https://youtu.be/… eller embed-URL).',
      validation: (Rule: any) =>
        Rule.required().custom((value: string | undefined) => {
          if (!value?.trim()) return 'URL er påkrevd'
          try {
            const host = new URL(value.trim()).hostname.replace(/^www\./, '')
            if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
              return true
            }
            return 'Må være en YouTube-lenke (youtube.com eller youtu.be)'
          } catch {
            return 'Ugyldig URL'
          }
        }),
    },
    {
      name: 'caption',
      title: 'Bildetekst (valgfritt)',
      type: 'string',
    },
  ],
  preview: {
    select: { url: 'url', caption: 'caption' },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      return {
        title: caption || 'YouTube-video',
        subtitle: url,
      }
    },
  },
}
