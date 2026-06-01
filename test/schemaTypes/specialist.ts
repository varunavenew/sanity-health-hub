// Schema: Specialist (Spesialist)
import { SpecialistIcon } from './icons'
import { i18nSlugFieldFromString, pickNo } from './i18n'
import { BOOKING_ACTIVITY_GROUP_IDS } from './bookingActivityGroups'

export default {
  name: 'specialist',
  title: 'Spesialist',
  type: 'document',
  icon: SpecialistIcon,
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Personnavn (oversettes ikke)',
    },
    i18nSlugFieldFromString('name'),
    {
      name: 'photo',
      title: 'Profilbilde',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'role',
      title: 'Tittel/rolle',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Gynekolog", "Urolog", "Ortoped"',
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Robotkirurg", "Spesialist", "Kirurg"',
    },
    {
      name: 'specialties',
      title: 'Spesialområder',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    {
      name: 'categories',
      title: 'Tilknyttede kategorier',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatmentCategory' }],
        },
      ],
    },
    {
      name: 'bookingCategoryIds',
      title: 'Booking kategori-IDer (Metodika)',
      type: 'array',
      of: [
        {
          type: 'number',
          title: 'Kategori-ID',
          validation: (Rule: any) =>
            Rule.required()
              .integer()
              .custom((id: number) => {
                if (BOOKING_ACTIVITY_GROUP_IDS.includes(id)) return true
                return `Ugyldig ID. Tillatte: ${BOOKING_ACTIVITY_GROUP_IDS.join(', ')}`
              }),
        },
      ],
      description:
        'Én eller flere numeriske wbactivitygroup-IDer (kun tall). Eksempel: 8=Gynekolog, 10=Fostermedisiner, 6=Urolog, 17=Ortoped, 1=Fertilitet.',
    },
    {
      name: 'treatments',
      title: 'Behandlinger',
      type: 'array',
      description:
        'Valgfritt: velg spesifikke behandlinger. Tom liste = alle behandlinger i tilknyttede kategorier (på nettsiden når det vises).',
      of: [
        {
          type: 'reference',
          to: [{ type: 'treatment' }],
        },
      ],
      options: {
        layout: 'grid',
        filter: ({ document }: { document?: { categories?: { _ref?: string }[] } }) => {
          const categoryIds = (document?.categories || [])
            .map((c) => c._ref)
            .filter(Boolean) as string[]
          if (!categoryIds.length) {
            return { filter: '_type == "treatment"' }
          }
          return {
            filter: '_type == "treatment" && category._ref in $categoryIds',
            params: { categoryIds },
          }
        },
      },
    },
    {
      name: 'clinics',
      title: 'Klinikker',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinicPage' }] }],
      description: 'Klinikker spesialisten jobber ved – velg fra eksisterende klinikkdokumenter.',
    },
    {
      name: 'bio',
      title: 'Biografi',
      type: 'internationalizedArrayBlockContent',
    },
    {
      name: 'shortBio',
      title: 'Kort biografi',
      type: 'internationalizedArrayText',
    },
    {
      name: 'education',
      title: 'Utdanning',
      type: 'array',
      of: [{ type: 'internationalizedArrayString' }],
    },
    {
      name: 'languages',
      title: 'Språk',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Språkkoder/navn (oversettes ikke)',
    },
    {
      name: 'bookingEnabled',
      title: 'Booking aktivert',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først. La stå tom for alfabetisk.',
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Navn (A–Å)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Rolle → Navn',
      name: 'roleName',
      by: [
        { field: 'role', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      media: 'photo',
      booking: 'bookingEnabled',
      bookingCategoryIds: 'bookingCategoryIds',
      t0: 'treatments.0->title',
      t1: 'treatments.1->title',
      t2: 'treatments.2->title',
    },
    prepare({ title, role, media, booking, bookingCategoryIds, t0, t1, t2 }: any) {
      const treatmentNames = [t0, t1, t2].map(pickNo).filter(Boolean)
      const roleLabel = pickNo(role) || 'Ingen rolle'
      const idPart =
        Array.isArray(bookingCategoryIds) && bookingCategoryIds.length
          ? ` · Booking #${bookingCategoryIds.join(', #')}`
          : ''
      const treatmentLine = treatmentNames.length
        ? ` · Behandlinger: ${treatmentNames.join(', ')}${treatmentNames.length === 3 ? '…' : ''}`
        : ''
      return {
        title: `${booking === false ? '🚫 ' : ''}${title || ''}`,
        subtitle: `${roleLabel}${idPart}${treatmentLine}`,
        media,
      }
    },
  },
}
