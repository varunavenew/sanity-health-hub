import { defineField, defineType } from 'sanity'
import { SortIcon } from './icons'

export default defineType({
  name: 'listingSortSettings',
  title: 'Listing Sort Settings',
  type: 'document',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'specialistsSort',
      title: 'Specialists Sort Order',
      description: 'Select how lists of specialists should be ordered across the website.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Manual / Sort Order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse Alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest First', value: 'newest' },
          { title: 'Oldest First', value: 'oldest' },
          { title: 'Featured First', value: 'featured' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'clinicsSort',
      title: 'Clinics Sort Order',
      description: 'Select how clinics should be ordered across the website.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Manual / Sort Order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse Alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest First', value: 'newest' },
          { title: 'Oldest First', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'categoriesSort',
      title: 'Categories Sort Order',
      description: 'Select how treatment categories should be ordered across the website.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Manual / Sort Order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse Alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest First', value: 'newest' },
          { title: 'Oldest First', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'treatmentsSort',
      title: 'Treatments Sort Order',
      description: 'Select how treatments inside categories should be ordered across the website.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Manual / Sort Order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse Alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest First', value: 'newest' },
          { title: 'Oldest First', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Sorting Preferences',
      }
    }
  }
})
