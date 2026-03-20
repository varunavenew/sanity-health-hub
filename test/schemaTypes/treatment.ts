// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category

export default {
  name: 'treatment',
  title: 'Behandling',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Behandlingsnavn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
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
      type: 'string',
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
      type: 'text',
      rows: 6,
    },
    // Benefits
    {
      name: 'benefitsTitle',
      title: 'Fordeler-tittel',
      type: 'string',
      initialValue: 'Hvorfor velge oss',
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [{ type: 'string' }],
    },
    // Treatment Process
    {
      name: 'process',
      title: 'Behandlingsprosess',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Steg-tittel', type: 'string' },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
          ],
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
          fields: [
            { name: 'question', title: 'Spørsmål', type: 'string' },
            { name: 'answer', title: 'Svar', type: 'text', rows: 3 },
          ],
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
            { name: 'heading', title: 'Overskrift', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'content', title: 'Innhold', type: 'text', rows: 10, description: 'Støtter **bold**, _italic_, - lister, [lenke](url)' },
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    },
    // Related specialists (by slug)
    {
      name: 'relatedSpecialists',
      title: 'Relaterte spesialister',
      description: 'Slug-referanser til spesialister som vises på behandlingssiden',
      type: 'array',
      of: [{ type: 'string' }],
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
            { name: 'label', title: 'Tittel', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'description', title: 'Beskrivelse', type: 'text', rows: 2 },
            { name: 'path', title: 'URL-sti', type: 'string', validation: (Rule: any) => Rule.required() },
          ],
          preview: {
            select: { title: 'label' },
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
            { name: 'label', title: 'Tittel', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'anchor', title: 'Anker (valgfritt)', type: 'string', description: 'Anker-lenke på siden (#seksjon)' },
            { name: 'path', title: 'Egen URL (valgfritt)', type: 'string', description: 'Full URL hvis elementet skal lenke til en annen side' },
          ],
          preview: {
            select: { title: 'label' },
          },
        },
      ],
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'string',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parentCategoryLabel',
      media: 'heroImage',
    },
  },
}
