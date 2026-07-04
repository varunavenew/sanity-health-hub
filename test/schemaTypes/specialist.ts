// Schema: Specialist (Spesialist)
import { SpecialistIcon } from './icons'
import {
  hasNoEnBlockContent,
  hasSpecialtyWithEnText,
  hasSpecialtyWithNoText,
  requiredNoEnBlockContent,
  i18nSlugFieldFromString,
  pickForLang,
  pickNo,
  pickSpecialtyLabel,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { geoSummaryField } from './geoSummary'
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
      validation: (Rule: any) => Rule.required().error('Navn er påkrevd for publisering'),
      description: 'Personnavn (oversettes ikke)',
    },
    i18nSlugFieldFromString('name'),
    {
      name: 'photo',
      title: 'Profilbilde',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required().error('Profilbilde er påkrevd for publisering'),
    },
    {
      name: 'role',
      title: 'Tittel/rolle',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Gynekolog", "Urolog", "Ortoped"',
      validation: requiredNoEnI18n('Tittel/rolle'),
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Robotkirurg", "Spesialist", "Kirurg"',
    },
    {
      name: 'specialties',
      title: 'Expertise / Spesialområder',
      type: 'array',
      options: { layout: 'list' },
      of: [
        {
          type: 'object',
          name: 'specialtyItem',
          title: 'Spesialområde',
          fields: [
            {
              name: 'label',
              title: 'Tekst',
              type: 'internationalizedArrayString',
              validation: requiredNoEnI18n('Spesialområde'),
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }: { label?: unknown }) {
              return { title: pickSpecialtyLabel({ label }) || 'Nytt spesialområde' }
            },
          },
        },
      ],
      description:
        'Korte stikkord som vises på profilsiden og i spesialistkort (på nettsiden: «expertise»). F.eks. «Robotkirurgi», «Fertilitet». Klikk + Add item, fyll inn norsk (NO) og engelsk (EN) tekst.',
      validation: (Rule: any) =>
        Rule.custom((items: unknown[] | undefined) => {
          if (!Array.isArray(items) || items.length === 0) {
            return 'Legg til minst ett spesialområde'
          }
          if (!hasSpecialtyWithNoText(items)) {
            return 'Fyll inn norsk (NO) tekst for minst ett spesialområde'
          }
          if (!hasSpecialtyWithEnText(items)) {
            return 'Fyll inn engelsk (EN) tekst for minst ett spesialområde'
          }
          return true
        }),
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
      validation: (Rule: any) =>
        Rule.required().min(1).error('Velg minst én behandlingskategori'),
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
                if ((BOOKING_ACTIVITY_GROUP_IDS as readonly number[]).includes(id)) return true
                return `Ugyldig ID. Tillatte: ${BOOKING_ACTIVITY_GROUP_IDS.join(', ')}`
              }),
        },
      ],
      description:
        'Én eller flere numeriske wbactivitygroup-IDer (kun tall). Eksempel: 8=Gynekolog, 10=Fostermedisiner, 6=Urolog, 17=Ortoped, 1=Fertilitet.',
      validation: (Rule: any) =>
        Rule.required().min(1).error('Velg minst én booking kategori-ID'),
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
      validation: (Rule: any) => Rule.required().min(1).error('Velg minst én klinikk'),
    },
    {
      name: 'bio',
      title: 'Biografi',
      type: 'internationalizedArrayBlockContent',
      description: 'Utvidet biografi på profilsiden. Må fylles ut på norsk og engelsk.',
      validation: requiredNoEnBlockContent('Biografi'),
    },
    {
      name: 'shortBio',
      title: 'Kort biografi',
      type: 'internationalizedArrayText',
      description: 'Vises på profilsiden og i spesialistkort.',
      validation: requiredNoEnI18n('Kort biografi'),
    },
    {
      name: 'education',
      title: 'Utdanning',
      type: 'array',
      options: { layout: 'list' },
      of: [
        {
          type: 'object',
          name: 'educationItem',
          title: 'Utdanningslinje',
          fields: [
            {
              name: 'label',
              title: 'Tekst',
              type: 'internationalizedArrayString',
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }: { label?: unknown }) {
              return { title: pickSpecialtyLabel({ label }) || 'Ny linje' }
            },
          },
        },
      ],
    },
    {
      name: 'languages',
      title: 'Språk',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Språkkoder/navn (oversettes ikke)',
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ-overskrift',
      type: 'internationalizedArrayString',
      description: 'Overskrift over FAQ-seksjonen (f.eks. «Ofte stilte spørsmål»). Må fylles ut på norsk og engelsk.',
      validation: requiredNoEnI18n('FAQ-overskrift'),
    },
    {
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      description:
        'Valgfrie FAQ-elementer som vises på profilsiden. Hvert FAQ-dokument må ha spørsmål og svar på norsk og engelsk.',
    },
    {
      name: 'relatedSpecialistsSection',
      title: 'Relaterte spesialister',
      type: 'object',
      description:
        'Seksjonen «Andre spesialister» nederst på profilsiden. Velg minst én annen spesialist som skal vises.',
      options: { collapsible: true, collapsed: false },
      validation: (Rule: any) => Rule.required().error('Relaterte spesialister må fylles ut'),
      fields: [
        {
          name: 'eyebrow',
          title: 'Undertekst',
          type: 'internationalizedArrayString',
          description: 'F.eks. «Samme fagområde». Må fylles ut på norsk og engelsk.',
          validation: requiredNoEnI18n('Undertekst'),
        },
        {
          name: 'heading',
          title: 'Overskrift',
          type: 'internationalizedArrayString',
          description: 'F.eks. «Andre spesialister». Må fylles ut på norsk og engelsk.',
          validation: requiredNoEnI18n('Overskrift'),
        },
        {
          name: 'ctaLabel',
          title: 'Lenketekst',
          type: 'internationalizedArrayString',
          description: 'F.eks. «Se alle». Må fylles ut på norsk og engelsk.',
          validation: requiredNoEnI18n('Lenketekst'),
        },
        {
          name: 'ctaPath',
          title: 'Lenke',
          type: 'string',
          description: 'Intern sti uten språkprefix, f.eks. /spesialister',
          initialValue: '/spesialister',
          validation: (Rule: any) => Rule.required().error('Lenke er påkrevd'),
        },
        {
          name: 'specialists',
          title: 'Spesialister',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'specialist' }] }],
          description:
            'Velg hvilke spesialister som vises (rekkefølgen fra Studio beholdes). Minst én påkrevd.',
          validation: (Rule: any) =>
            Rule.required()
              .min(1)
              .error('Velg minst én spesialist')
              .custom((refs: Array<{ _ref?: string }> | undefined, context: { document?: { _id?: string } }) => {
                if (!Array.isArray(refs) || refs.length === 0) return true
                const docId = String(context.document?._id || '').replace(/^drafts\./, '')
                if (!docId) return true
                const includesSelf = refs.some((ref) => ref?._ref === docId)
                return includesSelf ? 'Velg andre spesialister — ikke profilen du redigerer' : true
              }),
        },
      ],
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
    {
      name: 'patientReviews',
      title: 'Pasientanmeldelser',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'googleReview' }] }],
      description:
        'Velg Google-anmeldelser som vises i «Hva pasientene sier» på profilsiden. Rekkefølgen fra Studio beholdes. Tom liste = automatisk utvalg basert på navn og fagområde.',
      validation: (Rule: any) => Rule.max(6).error('Velg maks seks anmeldelser'),
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Meta-tittel og meta-beskrivelse for spesialistens profilside',
      validation: requiredNoEnSeo,
    },
    geoSummaryField,
  ],
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!String(document.name || '').trim()) issues.push('Navn mangler')
      if (!document.photo) issues.push('Profilbilde mangler')
      if (!pickNo(document.role)?.trim()) issues.push('Tittel/rolle (norsk) mangler')
      if (!pickForLang(document.role, 'en')?.trim()) issues.push('Tittel/rolle (engelsk) mangler')
      if (!pickNo(document.shortBio)?.trim()) issues.push('Kort biografi (norsk) mangler')
      if (!pickForLang(document.shortBio, 'en')?.trim()) {
        issues.push('Kort biografi (engelsk) mangler')
      }
      if (!hasNoEnBlockContent(document.bio)) {
        issues.push('Biografi (norsk og engelsk) mangler')
      }
      if (!hasSpecialtyWithNoText(document.specialties)) {
        issues.push('Minst ett spesialområde med norsk tekst mangler')
      }
      if (!hasSpecialtyWithEnText(document.specialties)) {
        issues.push('Minst ett spesialområde med engelsk tekst mangler')
      }
      const categories = document.categories as unknown[] | undefined
      if (!Array.isArray(categories) || categories.length === 0) {
        issues.push('Minst én behandlingskategori må velges')
      }
      const clinics = document.clinics as unknown[] | undefined
      if (!Array.isArray(clinics) || clinics.length === 0) {
        issues.push('Minst én klinikk må velges')
      }
      const bookingIds = document.bookingCategoryIds as unknown[] | undefined
      if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        issues.push('Minst én booking kategori-ID må velges')
      }
      const faqs = document.faqs as unknown[] | undefined
      if (!Array.isArray(faqs) || faqs.length === 0) {
        issues.push('Minst ett FAQ-element må velges')
      }
      if (!pickNo(document.faqSectionTitle)?.trim()) {
        issues.push('FAQ-overskrift (norsk) mangler')
      }
      if (!pickForLang(document.faqSectionTitle, 'en')?.trim()) {
        issues.push('FAQ-overskrift (engelsk) mangler')
      }
      const related = document.relatedSpecialistsSection as Record<string, unknown> | undefined
      if (!related || typeof related !== 'object') {
        issues.push('Relaterte spesialister-seksjonen mangler')
      }
      if (!pickNo(related?.eyebrow)?.trim()) {
        issues.push('Relaterte spesialister: undertekst (norsk) mangler')
      }
      if (!pickForLang(related?.eyebrow, 'en')?.trim()) {
        issues.push('Relaterte spesialister: undertekst (engelsk) mangler')
      }
      if (!pickNo(related?.heading)?.trim()) {
        issues.push('Relaterte spesialister: overskrift (norsk) mangler')
      }
      if (!pickForLang(related?.heading, 'en')?.trim()) {
        issues.push('Relaterte spesialister: overskrift (engelsk) mangler')
      }
      if (!pickNo(related?.ctaLabel)?.trim()) {
        issues.push('Relaterte spesialister: lenketekst (norsk) mangler')
      }
      if (!pickForLang(related?.ctaLabel, 'en')?.trim()) {
        issues.push('Relaterte spesialister: lenketekst (engelsk) mangler')
      }
      if (!String(related?.ctaPath || '').trim()) {
        issues.push('Relaterte spesialister: lenke mangler')
      }
      const relatedSpecialists = related?.specialists as unknown[] | undefined
      if (!Array.isArray(relatedSpecialists) || relatedSpecialists.length === 0) {
        issues.push('Relaterte spesialister: velg minst én spesialist')
      }
      const seo = document.seo as Record<string, unknown> | undefined
      if (!pickNo(seo?.metaTitle)?.trim()) issues.push('SEO meta-tittel (norsk) mangler')
      if (!pickForLang(seo?.metaTitle, 'en')?.trim()) {
        issues.push('SEO meta-tittel (engelsk) mangler')
      }
      if (!pickNo(seo?.metaDescription)?.trim()) {
        issues.push('SEO meta-beskrivelse (norsk) mangler')
      }
      if (!pickForLang(seo?.metaDescription, 'en')?.trim()) {
        issues.push('SEO meta-beskrivelse (engelsk) mangler')
      }
      return issues.length ? issues.join('. ') : true
    }),
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
