// Schema: Contact Page
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
    { name: 'content', title: 'Content', default: true },
    { name: 'contactDialog', title: 'Contact Modal' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      group: 'content',
      validation: (Rule: any) => Rule.required(),
    },
    i18nSlugFieldFromTitle('title'),
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    },
    {
      name: 'introText',
      title: 'Intro text',
      type: 'internationalizedArrayText',
      group: 'content',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'content',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'content',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'street', title: 'Gateadresse', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'zip', title: 'Postal code', type: 'string' },
      ],
    },
    {
      name: 'openingHours',
      title: 'Opening hours',
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
      title: 'Help cards (CTA section)',
      type: 'array',
      group: 'content',
      description: 'The three cards displayed under the clinic list',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (Calendar, Shield, Phone, Mail, MessageCircle)',
            },
            { name: 'title', title: 'Title', type: 'internationalizedArrayString' },
            { name: 'description', title: 'Description', type: 'internationalizedArrayText' },
            { name: 'ctaText', title: 'Button Text', type: 'internationalizedArrayString' },
            {
              name: 'ctaAction',
              title: 'Handling',
              type: 'string',
              options: {
                list: [
                  { title: 'Open contact modal', value: 'openContactDialog' },
                  { title: 'Navigate to link', value: 'navigate' },
                ],
                layout: 'radio',
              },
              initialValue: 'navigate',
            },
            { name: 'ctaLink', title: 'CTA link (if navigate)', type: 'string' },
            {
              name: 'variant',
              title: 'Button variant',
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
    crI18n('dialogTitle', 'Modal – title'),
    crI18n('dialogDescription', 'Modal – ingress', undefined, 'internationalizedArrayText'),
    crI18n('nameLabel', 'Field – name (label)'),
    crI18n('namePlaceholder', 'Field – name (placeholder)'),
    crI18n('phoneLabel', 'Field – phone (label)'),
    crI18n('phonePlaceholder', 'Field – phone (placeholder)'),
    crI18n('clinicLabel', 'Field – clinic (label)'),
    crI18n('clinicPlaceholder', 'Field – clinic (placeholder)'),
    crI18n('categoryLabel', 'Field – specialty (label)'),
    crI18n('categoryPlaceholder', 'Field – specialty (placeholder)'),
    crI18n('categoryOtherLabel', 'Felt – annet / vet ikke'),
    crI18n('timingLabel', 'When to contact – heading'),
    crI18n('timingAsapLabel', 'Valg – snarest mulig'),
    crI18n('timingSpecificLabel', 'Choice – select day and time'),
    crI18n('dayLabel', 'Felt – dag'),
    crI18n('timeOfDayLabel', 'Field – time slot (label)'),
    crI18n('timeOfDayPlaceholder', 'Felt – tidspunkt (placeholder)'),
    crI18n('timeMorningLabel', 'Tid – formiddag'),
    crI18n('timeAfternoonLabel', 'Tid – ettermiddag'),
    crI18n('timeEveningLabel', 'Tid – kveld'),
    crI18n('detailsLabel', 'Field – elaborate (label)'),
    crI18n('detailsOptionalSuffix', 'Field – elaborate (optional suffix)', 'E.g. \'(optional)\''),
    crI18n('detailsPlaceholder', 'Felt – utdyp (placeholder)'),
    crI18n('cancelButton', 'Button – cancel'),
    crI18n('submitButton', 'Button – send'),
    crI18n('submittingButton', 'Button – sending'),
    crI18n('privacyNote', 'Privacy footnote', undefined, 'internationalizedArrayText'),
    crI18n('toastValidationTitle', 'Validation – toast title'),
    crI18n('toastValidationDescription', 'Validering – toast melding (generell)'),
    crI18n('validationNameRequired', 'Validation – name'),
    crI18n('validationPhoneRequired', 'Validation – phone'),
    crI18n('validationClinicRequired', 'Validation – clinic'),
    crI18n('validationCategoryRequired', 'Validation – specialty'),
    crI18n('toastSuccessTitle', 'Success – toast title'),
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
        ? (title.find((t: any) => (t.language || t._key) === 'no')?.value || title[0]?.value || 'Contact')
        : (title || 'Contact')
      return { title: titleStr }
    },
  },
}
