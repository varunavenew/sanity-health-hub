// Schema: Treatment (sub-treatment page)
// Individual treatment pages under each category
import { TreatmentIcon } from './icons'
import {
  i18nFaqItemPreview,
  i18nSlugFieldFromTitle,
  i18nTitleItemPreview,
  pickForLang,
  pickNo,
  requiredNoEnI18n,
  requiredNoEnSeo,
} from './i18n'
import { pageSectionsField } from './pageSections'
import { geoSummaryField } from './geoSummary'

const reqI18n = requiredNoEnI18n
const reqStr = (label: string) => (Rule: any) => Rule.required().error(`${label} er påkrevd`)

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
      validation: reqI18n('Behandlingsnavn'),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'treatmentCategory' }],
      validation: (Rule: any) => Rule.required().error('Kategori er påkrevd'),
    },
    {
      name: 'parentCategoryLabel',
      title: 'Overordnet kategori (visningsnavn)',
      type: 'internationalizedArrayString',
      description: 'F.eks. "Gynekologi" — vises som breadcrumb',
      validation: reqI18n('Overordnet kategori'),
    },
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required().error('Hero-bilde er påkrevd'),
    },
    {
      name: 'heroImageAlt',
      title: 'Hero-bilde — alt-tekst',
      type: 'internationalizedArrayString',
      validation: reqI18n('Hero-bilde — alt-tekst'),
    },
    {
      name: 'description',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
      validation: reqI18n('Introduksjonstekst'),
    },
    // Benefits
    {
      name: 'benefitsTitle',
      title: 'Fordeler-tittel',
      type: 'internationalizedArrayString',
      validation: reqI18n('Fordeler-tittel'),
    },
    {
      name: 'benefits',
      title: 'Fordeler',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'treatmentBenefit',
          title: 'Fordel',
          fields: [
            {
              name: 'title',
              title: 'Fordel',
              type: 'internationalizedArrayString',
              validation: reqI18n('Fordel'),
            },
          ],
          preview: i18nTitleItemPreview,
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én fordel'),
    },
    {
      name: 'processSectionTitle',
      title: 'Overskrift: behandlingsprosess',
      type: 'internationalizedArrayString',
      description: 'Vises som trekkspill-tittel over prosesstegene på behandlingssiden.',
      validation: reqI18n('Overskrift: behandlingsprosess'),
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
            {
              name: 'title',
              title: 'Steg-tittel',
              type: 'internationalizedArrayString',
              validation: reqI18n('Steg-tittel'),
            },
            {
              name: 'description',
              title: 'Beskrivelse',
              type: 'internationalizedArrayText',
              validation: reqI18n('Beskrivelse'),
            },
          ],
          preview: i18nTitleItemPreview,
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst ett prosessteg'),
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
            {
              name: 'question',
              title: 'Spørsmål',
              type: 'internationalizedArrayString',
              validation: reqI18n('Spørsmål'),
            },
            {
              name: 'answer',
              title: 'Svar',
              type: 'internationalizedArrayText',
              validation: reqI18n('Svar'),
            },
          ],
          preview: i18nFaqItemPreview,
        },
      ],
    },
    {
      name: 'quickInfoItems',
      title: 'Hurtiginfo',
      type: 'array',
      of: [{
        type: 'object',
        name: 'treatmentQuickInfoItem',
        fields: [
          {
            name: 'iconKey',
            title: 'Ikon',
            type: 'string',
            options: {
              list: [
                {title: 'Dokument', value: 'file-text'},
                {title: 'Klokke', value: 'clock'},
                {title: 'Skjold', value: 'shield'},
                {title: 'Informasjon', value: 'info'},
              ],
            },
            validation: reqStr('Ikon'),
          },
          {
            name: 'label',
            title: 'Tekst',
            type: 'internationalizedArrayString',
            validation: reqI18n('Hurtiginfo-tekst'),
          },
        ],
        preview: {
          select: {title: 'label', subtitle: 'iconKey'},
          prepare({title, subtitle}: any) {
            return {title: pickNo(title), subtitle}
          },
        },
      }],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst ett hurtiginfo-punkt'),
    },
    {
      name: 'faqSectionTitle',
      title: 'FAQ-overskrift',
      type: 'internationalizedArrayString',
      description: 'Vises over FAQ-listen på behandlingssiden.',
      validation: reqI18n('FAQ-overskrift'),
    },
    {
      name: 'bottomCta',
      title: 'Bunn-CTA',
      type: 'object',
      description: 'Handlingsboks nederst på behandlingssiden.',
      validation: (Rule: any) => Rule.required().error('Bunn-CTA er påkrevd'),
      fields: [
        {
          name: 'title',
          title: 'Overskrift',
          type: 'internationalizedArrayString',
          validation: reqI18n('Overskrift'),
        },
        {
          name: 'subtitle',
          title: 'Ingress',
          type: 'internationalizedArrayText',
          validation: reqI18n('Ingress'),
        },
        {
          name: 'primaryLabel',
          title: 'Primærknapp',
          type: 'internationalizedArrayString',
          validation: reqI18n('Primærknapp'),
        },
        {
          name: 'secondaryLabel',
          title: 'Sekundærknapp',
          type: 'internationalizedArrayString',
          validation: reqI18n('Sekundærknapp'),
        },
        {
          name: 'primaryPath',
          title: 'Primær lenke',
          type: 'string',
          validation: reqStr('Primær lenke'),
        },
        {
          name: 'secondaryPath',
          title: 'Sekundær lenke',
          type: 'string',
          initialValue: '/kontakt',
          validation: reqStr('Sekundær lenke'),
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
            {
              name: 'id',
              title: 'Anker-ID',
              type: 'string',
              description: 'Brukes for scroll-til-seksjon',
              validation: reqStr('Anker-ID'),
            },
            {
              name: 'heading',
              title: 'Overskrift',
              type: 'internationalizedArrayString',
              validation: reqI18n('Overskrift'),
            },
            {
              name: 'content',
              title: 'Innhold',
              type: 'internationalizedArrayText',
              description: 'Støtter **bold**, _italic_, - lister, [lenke](url)',
              validation: reqI18n('Innhold'),
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én innholdsseksjon'),
    },
    // Related specialists (true references)
    {
      name: 'relatedSpecialists',
      title: 'Relaterte spesialister',
      description: 'Velg spesialister som skal vises på denne behandlingssiden.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'specialist' }],
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Velg minst én spesialist'),
    },
    {
      name: 'linkedServicesSectionTitle',
      title: 'Overskrift: koblede tjenester',
      type: 'internationalizedArrayString',
      description: 'Vises som trekkspill-tittel over koblede tjenester på behandlingssiden.',
      validation: reqI18n('Overskrift: koblede tjenester'),
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
            {
              name: 'label',
              title: 'Tittel',
              type: 'internationalizedArrayString',
              validation: reqI18n('Tittel'),
            },
            {
              name: 'description',
              title: 'Beskrivelse',
              type: 'internationalizedArrayText',
              validation: reqI18n('Beskrivelse'),
            },
            {
              name: 'path',
              title: 'URL-sti',
              type: 'string',
              validation: reqStr('URL-sti'),
            },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst én koblet tjeneste'),
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
            {
              name: 'label',
              title: 'Tittel',
              type: 'internationalizedArrayString',
              validation: reqI18n('Tittel'),
            },
            {
              name: 'anchor',
              title: 'Anker (valgfritt)',
              type: 'string',
              description: 'Anker-lenke på siden (#seksjon)',
            },
            {
              name: 'path',
              title: 'Egen URL (valgfritt)',
              type: 'string',
              description: 'Full URL hvis elementet skal lenke til en annen side',
            },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: any) {
              return { title: pickNo(title) }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1).error('Legg til minst ett undermeny-element'),
    },
    {
      name: 'subtitle',
      title: 'Undertittel',
      type: 'internationalizedArrayString',
      validation: reqI18n('Undertittel'),
    },
    {
      name: 'sortOrder',
      title: 'Sorteringsrekkefølge',
      type: 'number',
      description: 'Lavere tall vises først innenfor kategorien.',
      validation: (Rule: any) => Rule.required().error('Sorteringsrekkefølge er påkrevd'),
    },
    {
      name: 'layout',
      title: 'Sidelayout (SubTreatment)',
      description:
        'Valgfritt. Hero, forløp, symptomer og relaterte behandlinger — kun for gynekologi/fertilitet sub-sider. Standard behandlingssider bruker feltene over.',
      type: 'subTreatmentLayout',
      options: { collapsible: true, collapsed: true },
    },
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: requiredNoEnSeo,
    },
    {
      ...geoSummaryField,
      validation: reqI18n('GEO-sammendrag'),
    },
  ],
  orderings: [
    {
      title: 'Manuell rekkefølge',
      name: 'sortOrderAsc',
      by: [
        { field: 'sortOrder', direction: 'asc' },
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
  validation: (Rule: any) =>
    Rule.custom((document: Record<string, unknown> | undefined) => {
      if (!document) return true
      const issues: string[] = []
      if (!pickNo(document.title)?.trim()) issues.push('Behandlingsnavn (norsk) mangler')
      if (!pickForLang(document.title, 'en')?.trim()) {
        issues.push('Behandlingsnavn (engelsk) mangler')
      }
      if (!document.heroImage) issues.push('Hero-bilde mangler')
      if (!document.category) issues.push('Kategori mangler')
      if (!pickNo(document.description)?.trim()) issues.push('Introduksjonstekst (norsk) mangler')
      if (!pickForLang(document.description, 'en')?.trim()) {
        issues.push('Introduksjonstekst (engelsk) mangler')
      }
      const benefits = document.benefits as unknown[] | undefined
      if (!Array.isArray(benefits) || benefits.length === 0) {
        issues.push('Minst én fordel må legges til')
      }
      const process = document.process as unknown[] | undefined
      if (!Array.isArray(process) || process.length === 0) {
        issues.push('Minst ett prosessteg må legges til')
      }
      if (!pickNo(document.processSectionTitle)?.trim()) {
        issues.push('Overskrift behandlingsprosess (norsk) mangler')
      }
      if (!pickForLang(document.processSectionTitle, 'en')?.trim()) {
        issues.push('Overskrift behandlingsprosess (engelsk) mangler')
      }
      const faqs = document.faqs as unknown[] | undefined
      const hasFaqs = Array.isArray(faqs) && faqs.length > 0
      const quickInfo = document.quickInfoItems as unknown[] | undefined
      if (!Array.isArray(quickInfo) || quickInfo.length === 0) {
        issues.push('Minst ett hurtiginfo-punkt må legges til')
      }
      if (hasFaqs && !pickNo(document.faqSectionTitle)?.trim()) {
        issues.push('FAQ-overskrift (norsk) mangler')
      }
      if (hasFaqs && !pickForLang(document.faqSectionTitle, 'en')?.trim()) {
        issues.push('FAQ-overskrift (engelsk) mangler')
      }
      const bottomCta = document.bottomCta as Record<string, unknown> | undefined
      if (!pickNo(bottomCta?.title)?.trim()) issues.push('Bunn-CTA overskrift (norsk) mangler')
      if (!pickForLang(bottomCta?.title, 'en')?.trim()) {
        issues.push('Bunn-CTA overskrift (engelsk) mangler')
      }
      if (!pickNo(bottomCta?.subtitle)?.trim()) issues.push('Bunn-CTA ingress (norsk) mangler')
      if (!pickForLang(bottomCta?.subtitle, 'en')?.trim()) {
        issues.push('Bunn-CTA ingress (engelsk) mangler')
      }
      if (!pickNo(bottomCta?.primaryLabel)?.trim()) {
        issues.push('Bunn-CTA primærknapp (norsk) mangler')
      }
      if (!pickForLang(bottomCta?.primaryLabel, 'en')?.trim()) {
        issues.push('Bunn-CTA primærknapp (engelsk) mangler')
      }
      if (!pickNo(bottomCta?.secondaryLabel)?.trim()) {
        issues.push('Bunn-CTA sekundærknapp (norsk) mangler')
      }
      if (!pickForLang(bottomCta?.secondaryLabel, 'en')?.trim()) {
        issues.push('Bunn-CTA sekundærknapp (engelsk) mangler')
      }
      if (!String(bottomCta?.secondaryPath || '').trim()) {
        issues.push('Bunn-CTA sekundær lenke mangler')
      }
      const sections = document.sections as unknown[] | undefined
      if (!Array.isArray(sections) || sections.length === 0) {
        issues.push('Minst én innholdsseksjon må legges til')
      }
      const specialists = document.relatedSpecialists as unknown[] | undefined
      if (!Array.isArray(specialists) || specialists.length === 0) {
        issues.push('Minst én relatert spesialist må velges')
      }
      const linked = document.linkedServices as unknown[] | undefined
      if (!Array.isArray(linked) || linked.length === 0) {
        issues.push('Minst én koblet tjeneste må legges til')
      }
      if (!pickNo(document.linkedServicesSectionTitle)?.trim()) {
        issues.push('Overskrift koblede tjenester (norsk) mangler')
      }
      if (!pickForLang(document.linkedServicesSectionTitle, 'en')?.trim()) {
        issues.push('Overskrift koblede tjenester (engelsk) mangler')
      }
      const subItems = document.subItems as unknown[] | undefined
      if (!Array.isArray(subItems) || subItems.length === 0) {
        issues.push('Minst ett undermeny-element må legges til')
      }
      if (document.sortOrder == null || document.sortOrder === '') {
        issues.push('Sorteringsrekkefølge mangler')
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
      if (issues.length === 0) return true
      return issues.join('. ')
    }),
}
