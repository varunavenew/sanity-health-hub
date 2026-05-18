import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * UI translations — flat key/value store mirroring src/i18n/locales/*.json.
 * Singleton document (id = "uiTranslations"). Editors can change any UI label
 * (nav, hero, stats, CTAs, footer, forms, etc.) without code changes.
 */
export default defineType({
  name: 'uiTranslations',
  title: '🌐 UI-tekster',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tittel',
      initialValue: 'UI-tekster (nav, knapper, etiketter)',
      readOnly: true,
    }),
    defineField({
      name: 'entries',
      title: 'Tekster',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'entry',
          fields: [
            defineField({
              name: 'key',
              title: 'Nøkkel (i18n path, f.eks. nav.services)',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'nb',
              title: 'Norsk (bokmål)',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'note',
              title: 'Notat (kun for redaktør)',
              type: 'string',
            }),
          ],
          preview: {
            select: { key: 'key', nb: 'nb', en: 'en' },
            prepare: ({ key, nb, en }) => ({
              title: key || '(uten nøkkel)',
              subtitle: [nb, en].filter(Boolean).join('  |  '),
            }),
          },
        }),
      ],
      options: { sortable: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: '🌐 UI-tekster' }),
  },
})
