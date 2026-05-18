import { defineField, defineType } from 'sanity'
import { ArticleIcon } from './icons'
import { allowedSectionsForNews } from './sections'

// Schema: News Item (kort aktualitet)
// Mastermal — bruker `sections[]` for fleksibel layout. Holdt enklere enn
// `article`: ingen kategori-velger (alltid nyhet), ingen pinned, kortere oppsett.
// Frontend mapper /aktuelt/[slug] til både article og newsItem.

export default defineType({
  name: 'newsItem',
  title: 'Nyhet',
  type: 'document',
  icon: ArticleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: {
        source: (doc: any) => {
          const t = (doc?.title || []).find((x: any) => (x.language || x._key) === 'no')?.value
          return t || ''
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Hovedbilde',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt-tekst', type: 'internationalizedArrayString' }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'sections',
      title: 'Sideoppbygging (mastermal)',
      description:
        'Bygg nyheten av seksjoner. Slå av/på, sorter med dra-og-slipp, eller legg til nye fra biblioteket.',
      type: 'array',
      of: allowedSectionsForNews.map((t) => ({ type: t })),
      options: { sortable: true },
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet',
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
      title: 'Publiseringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'primaryImage',
      publishedAt: 'publishedAt',
      featured: 'featured',
    },
    prepare({ title, media, publishedAt, featured }) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Uten tittel')
        : (title || 'Uten tittel')
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('nb-NO') : 'Ingen dato'
      return {
        title: `${featured ? '⭐ ' : ''}${titleStr}`,
        subtitle: `Nyhet · ${date}`,
        media,
      }
    },
  },
})
