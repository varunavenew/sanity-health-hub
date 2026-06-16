// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category
import { TreatmentIcon } from './icons'
import { i18nFaqItemPreview, i18nSlugFieldFromTitle, i18nTitleItemPreview, pickNo } from './i18n'
import { pageSectionsField } from './pageSections'
import { subTreatmentLayoutType } from './subTreatmentLayout'

export default {
  name: 'treatment',
  title: 'Behandling',
  type: 'document',
  icon: TreatmentIcon,
  fields: [
    {
      name: 'title',
      title: 'Behandlingsnavn',
      type: 'internationalizedArrayString',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'parentCategoryLabel',
      title: 'Overordnet kategori (visningsnavn)',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Gynekologi" — vises som breadcrumb',
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
    },
    // Benefits
    {
      name: 'benefitsTitle',
      title: 'Fordeler-tittel',
      type: 'internationalizedArrayString',
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    // Treatment Process
    {
      name: 'process',
      title: 'Behandlingsprosess',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'treatmentProcessStep',
          title: 'Prosessteg',
          fields: [
            { name: 'title', title: 'Steg-tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
          ],
          preview: i18nTitleItemPreview,
        },
      ],
    },
    // FAQs
    {
      name: 'faqs',
      title: 'Vanlige spørsmål',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'treatmentFaq',
          title: 'FAQ',
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'internationalizedArrayString' },
            { name: 'answer', title: 'Svar', type: 'internationalizedArrayText' },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    // Content sections (accordion items on treatment page)
    {
      name: 'sections',
      title: 'Innholdsseksjoner',
      description: 'Detaljerte seksjoner som vises som trekkspill på behandlingssiden',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', title: 'Anker-ID', type: 'string', description: 'Brukes for scroll-til-seksjon' },
            { name: 'heading', title: 'Overskrift', type: 'internationalizedArrayString', validation: (Rule: any) => Rule.required() },
            { name: 'content', title: 'Innhold', type: 'internationalizedArrayText', description: 'Støtter **bold**, _italic_, - lister, [lenke](url)' },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
    },
    // Related specialists (true references)
    {
      name: 'relatedSpecialists',
      title: 'Relaterte spesialister',
      description: 'Velg spesialister som skal vises på denne behandlingssiden. Hvis tom, vises alle spesialister i kategorien automatisk.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'specialist' }],
        },
      ],
    },
    // Linked services (cross-links to other treatments)
    {
      name: 'linkedServices',
      title: 'Koblede tjenester',
      description: 'Lenker til relaterte tjenester/behandlinger',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tittel', type: 'internationalizedArrayString', validation: (Rule: any) => Rule.required() },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'path', title: 'URL-sti', type: 'string', validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
    },
    // Sub-items (shown in 3rd column of service dropdown)
    {
      name: 'subItems',
      title: 'Undermeny-elementer',
      description: 'Vises som tredje kolonne i tjeneste-dropdown i menyen',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tittel', type: 'internationalizedArrayString', validation: (Rule: any) => Rule.required() },
            { name: 'anchor', title: 'Anker (valgfritt)', type: 'string', description: 'Anker-lenke på siden (#seksjon)' },
            { name: 'path', title: 'Egen URL (valgfritt)', type: 'string', description: 'Full URL hvis elementet skal lenke til en annen side' },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først innenfor kategorien.',
    },
    {
      name: 'layout',
      title: 'Sidelayout',
      description: 'Hero, forløp, symptomer og relaterte behandlinger (SubTreatmentLayout)',
      type: 'subTreatmentLayout',
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        // title is internationalizedArray — sort by slug (derived from Behandlingsnavn)
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
    {
      title: 'Tittel (A–Å)',
      name: 'titleAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parentCategoryLabel',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title: pickNo(title) || 'Behandling',
        subtitle: pickNo(subtitle) || 'Ingen kategori',
        media,
      }
    },
  },
}
