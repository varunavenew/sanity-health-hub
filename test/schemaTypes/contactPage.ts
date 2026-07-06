// Schema: Contact Page (Kontakt)
// Aligned with migration data: title, introText, phone, email, address, openingHours, seo
import { ContactIcon } from './icons'
import { i18nSlugFieldFromTitle } from './i18n'
import { geoSummaryField } from './geoSummary'
import { pageSectionsField } from './pageSections'

const crI18n = (
  name: string,
  title: string,
  description?: string,
  type: 'internationalizedArrayString' | 'internationalizedArrayText' = 'internationalizedArrayString',
) => ({
  name,
  title,
  type,
  group: 'contactDialog',
  description,
})

export default {
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: ContactIcon,
  groups: [
    { name: 'content', title: 'Innhold', default: true },
    { name: 'contactDialog', title: 'Kontakt-modal' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Sidetittel',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroImage',
      title: 'Hero-bilde',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    },
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'internationalizedArrayText',
      group: 'content',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      group: 'content',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      group: 'content',
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'street', title: 'Gateadresse', type: 'string' },
        { name: 'city', title: 'By', type: 'string' },
        { name: 'zip', title: 'Postnummer', type: 'string' },
      ],
    },
    {
      name: 'openingHours',
      title: 'Åpningstider',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', title: 'Dager', type: 'internationalizedArrayString' },
            { name: 'hours', title: 'Timer', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'ctaCards',
      title: 'Hjelpekort (CTA-seksjon)',
      type: 'array',
      group: 'content',
      description: 'De tre kortene som vises under klinikkoversikten',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Ikon',
              type: 'string',
              description: 'Lucide ikon-navn (Calendar, Shield, Phone, Mail, MessageCircle)',
            },
            { name: 'title', title: 'Tittel', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Beskrivelse', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'Knappetekst', type: 'internationalizedArrayString' },
            {
              name: 'ctaAction',
              title: 'Handling',
              type: 'string',
              options: {
                list: [
                  { title: 'Åpne kontakt-modal', value: 'openContactDialog' },
                  { title: 'Naviger til lenke', value: 'navigate' },
                ],
                layout: 'radio',
              },
              initialValue: 'navigate',
            },
            { name: 'ctaLink', title: 'CTA-lenke (hvis naviger)', type: 'string' },
            {
              name: 'variant',
              title: 'Knappevariant',
              type: 'string',
              options: {
                list: [
                  { title: 'Solid (hvit fyll)', value: 'solid' },
                  { title: 'Outline (kun kant)', value: 'outline' },
                ],
                layout: 'radio',
              },
              initialValue: 'solid',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'ctaText' },
            prepare({ title, subtitle }: any) {
              const pick = (v: any) =>
                Array.isArray(v)
                  ? (v.find((x: any) => (x.language || x._key) === 'no')?.value || v[0]?.value || '')
                  : (v || '')
              return { title: pick(title), subtitle: pick(subtitle) }
            },
          },
        },
      ],
    },
    crI18n('dialogTitle', 'Modal – tittel'),
    crI18n('dialogDescription', 'Modal – ingress', undefined, 'internationalizedArrayText'),
    crI18n('nameLabel', 'Felt – navn (etikett)'),
    crI18n('namePlaceholder', 'Felt – navn (placeholder)'),
    crI18n('phoneLabel', 'Felt – telefon (etikett)'),
    crI18n('phonePlaceholder', 'Felt – telefon (placeholder)'),
    crI18n('clinicLabel', 'Felt – klinikk (etikett)'),
    crI18n('clinicPlaceholder', 'Felt – klinikk (placeholder)'),
    crI18n('categoryLabel', 'Felt – fagområde (etikett)'),
    crI18n('categoryPlaceholder', 'Felt – fagområde (placeholder)'),
    crI18n('categoryOtherLabel', 'Felt – annet / vet ikke'),
    crI18n('timingLabel', 'Når kontakte – overskrift'),
    crI18n('timingAsapLabel', 'Valg – snarest mulig'),
    crI18n('timingSpecificLabel', 'Valg – velg dag og tid'),
    crI18n('dayLabel', 'Felt – dag'),
    crI18n('timeOfDayLabel', 'Felt – tidspunkt (etikett)'),
    crI18n('timeOfDayPlaceholder', 'Felt – tidspunkt (placeholder)'),
    crI18n('timeMorningLabel', 'Tid – formiddag'),
    crI18n('timeAfternoonLabel', 'Tid – ettermiddag'),
    crI18n('timeEveningLabel', 'Tid – kveld'),
    crI18n('detailsLabel', 'Felt – utdyp (etikett)'),
    crI18n('detailsOptionalSuffix', 'Felt – utdyp (valgfritt-suffiks)', 'F.eks. «(valgfritt)»'),
    crI18n('detailsPlaceholder', 'Felt – utdyp (placeholder)'),
    crI18n('cancelButton', 'Knapp – avbryt'),
    crI18n('submitButton', 'Knapp – send'),
    crI18n('submittingButton', 'Knapp – sender'),
    crI18n('privacyNote', 'Personvern fotnote', undefined, 'internationalizedArrayText'),
    crI18n('toastValidationTitle', 'Validering – toast tittel'),
    crI18n('toastValidationDescription', 'Validering – toast melding (generell)'),
    crI18n('validationNameRequired', 'Validering – navn'),
    crI18n('validationPhoneRequired', 'Validering – telefon'),
    crI18n('validationClinicRequired', 'Validering – klinikk'),
    crI18n('validationCategoryRequired', 'Validering – fagområde'),
    crI18n('toastSuccessTitle', 'Suksess – toast tittel'),
    crI18n('toastSuccessDescription', 'Suksess – toast melding', undefined, 'internationalizedArrayText'),
    pageSectionsField,
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: any) {
      const titleStr = Array.isArray(title)
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Kontakt')
        : (title || 'Kontakt')
      return { title: titleStr }
    },
  },
}
