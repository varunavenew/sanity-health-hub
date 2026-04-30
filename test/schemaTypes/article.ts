import {defineField, defineType} from 'sanity'
import { ArticleIcon } from './icons'

export default defineType({
  name: 'article',
  title: 'Artikkel / Side',
  type: 'document',
  icon: ArticleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube/Vimeo embed eller direktelenke til .mp4)',
      description: 'Lim inn en YouTube/Vimeo embed-URL (f.eks. https://www.youtube.com/embed/XXXX) eller en direktelenke til en .mp4-fil. Vises over artikkelinnholdet.',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'videoThumbnail',
      title: 'Video thumbnail (valgfritt, brukes for .mp4)',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => !parent?.videoUrl || !parent.videoUrl.endsWith('.mp4'),
    }),
    defineField({
      name: 'videoCaption',
      title: 'Videotekst (valgfritt)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          {title: 'Fagartikkel', value: 'fagartikkel'},
          {title: 'Nytt fra oss', value: 'nyheter'},
          {title: 'Prisliste', value: 'prisliste'},
          {title: 'Stillingsutlysning', value: 'stillingsutlysning'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinned',
      title: 'Festet (fremhevet øverst i Aktuelt)',
      description: 'Inntil 4 festede artikler vises i topp-griden på /aktuelt',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet',
      description: 'Brukes for utvalgte fremhevninger på forsiden / kampanjer',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Festet + nyeste først',
      name: 'pinnedThenDate',
      by: [
        {field: 'pinned', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
    {
      title: 'Publiseringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Publiseringsdato (eldste først)',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'primaryImage',
      category: 'category',
      pinned: 'pinned',
      featured: 'featured',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, category, pinned, featured, publishedAt}) {
      const categoryLabels: Record<string, string> = {
        fagartikkel: 'Fagartikkel',
        nyheter: 'Nytt fra oss',
        prisliste: 'Prisliste',
        stillingsutlysning: 'Stillingsutlysning',
      }
      const flags = [pinned && '📌', featured && '⭐'].filter(Boolean).join(' ')
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('nb-NO') : 'Ingen dato'
      const cat = categoryLabels[category] || category || 'Ingen kategori'
      return {
        title: `${flags ? flags + ' ' : ''}${title}`,
        subtitle: `${cat} · ${date}`,
        media,
      }
    },
  },
})
