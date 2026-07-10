// Schema: Job Listing
// Job listings for the careers page
import { JobIcon } from './icons'
import { i18nSlugFieldFromString } from './i18n'
import { pageSectionsField } from './pageSections'

export default {
  name: 'jobListing',
  title: 'Job Listing',
  type: 'document',
  icon: JobIcon,
  fields: [
    {
      name: 'title',
      title: 'Job title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromString('title'),
    {
      name: 'department',
      title: 'Department / Service area',
      type: 'string',
      options: {
        list: [
          { title: 'Gynecology', value: 'gynekologi' },
          { title: 'Fertility', value: 'fertilitet' },
          { title: 'Urology', value: 'urologi' },
          { title: 'Orthopedics', value: 'ortopedi' },
          { title: 'Skin', value: 'hud' },
          { title: 'Administration', value: 'administrasjon' },
          { title: 'IT / Technology', value: 'it' },
          { title: 'Other', value: 'annet' },
        ],
      },
    },
    {
      name: 'location',
      title: 'Workplace',
      type: 'string',
      description: 'E.g. "Oslo Majorstuen", "Bekkestua", "Moss"',
    },
    {
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {
        list: [
          { title: 'Permanent position', value: 'fast' },
          { title: 'Part-time', value: 'deltid' },
          { title: 'Temporary substitute', value: 'vikar' },
          { title: 'Fixed-term engagement', value: 'engasjement' },
        ],
      },
    },
    {
      name: 'excerpt',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Displayed in the job list',
    },
    {
      name: 'body',
      title: 'Full description',
      type: 'blockContent',
    },
    {
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'deadline',
      title: 'Application deadline',
      type: 'date',
      description: 'Leave blank for \'Ongoing\'',
    },
    {
      name: 'contactName',
      title: 'Contact person',
      type: 'string',
    },
    {
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
    },
    {
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string',
    },
    {
      name: 'applyUrl',
      title: 'Application link (external)',
      type: 'url',
      description: 'External URL for application form. Leave blank if the application is sent via email.',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Deactivate to hide the job listing without deleting it.',
    },
    pageSectionsField,
  ],
  orderings: [
    {
      title: 'Publishing date (newest first)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      active: 'active',
    },
    prepare({ title, subtitle, active }: any) {
      return {
        title: `${active === false ? '🔴 ' : ''}${title}`,
        subtitle: subtitle || 'No location',
      };
    },
  },
};
