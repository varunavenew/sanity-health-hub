// Schema: Booking flow copy (Bestill time)
import { CalendarIcon } from './icons'
import { geoSummaryField } from './geoSummary'
import { pickNo } from './i18n'

const i18n = (
  name: string,
  title: string,
  group: string,
  description?: string,
  type: 'internationalizedArrayString' | 'internationalizedArrayText' = 'internationalizedArrayString',
) => ({
  name,
  title,
  type,
  group,
  description,
})

export default {
  name: 'bookingPage',
  title: 'Book appointment',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'step1', title: 'Step 1 – Service' },
    { name: 'step2', title: 'Step 2 – Clinic' },
    { name: 'step3', title: 'Step 3 - Practitioner' },
    { name: 'step4', title: 'Step 4 - Time' },
    { name: 'step5', title: 'Step 5 - Confirm' },
    { name: 'success', title: 'Confirmed screen' },
    { name: 'form', title: 'Form' },
    { name: 'errors', title: 'Error messages' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    i18n('pageTitle', 'Page title (header)', 'general', 'E.g. \'Book appointment\''),
    i18n('closeAriaLabel', 'Close button (accessibility)', 'general'),
    i18n('backLabel', 'Back link', 'general'),
    i18n(
      'stepProgressTemplate',
      'Step indicator',
      'general',
      'Use {{step}} and {{total}}. E.g., \'Step {{step}} of {{total}}\'',
    ),
    i18n('stepLabelService', 'Step name: Service', 'general'),
    i18n('stepLabelClinic', 'Step name: Clinic', 'general'),
    i18n('stepLabelSpecialist', 'Step label: Practitioner', 'general'),
    i18n('stepLabelTime', 'Step label: Time', 'general'),
    i18n('stepLabelConfirm', 'Step label: Confirm', 'general'),
    i18n('summaryServiceLabel', 'Summary: Service', 'general'),
    i18n('summaryClinicLabel', 'Summary: Clinic', 'general'),
    i18n('summarySpecialistLabel', 'Summary: Practitioner', 'general'),
    {
      name: 'supportPhone',
      title: 'Phone (empty states)',
      type: 'string',
      group: 'general',
      description: 'Displayed in \'call us\' buttons when data is missing',
    },
    i18n('supportPhoneLabel', 'Phone button label', 'general'),

    i18n('step1Heading', 'Heading', 'step1'),
    i18n(
      'step1HeadingFiltered',
      'Heading (filtered category)',
      'step1',
      'Use {{category}} for category name',
    ),
    i18n('step1ShowAllServices', '"Show all services"', 'step1'),
    i18n('step1Loading', 'Loading text', 'step1'),
    i18n('step1AllClinicsBadge', '\'All clinics\' badge', 'step1'),
    i18n('step1EmptyTitle', 'Empty state – title', 'step1'),
    i18n('step1EmptyMessage', 'Empty state - message', 'step1', undefined, 'internationalizedArrayText'),
    i18n('step1PriceFree', 'Free price', 'step1'),
    i18n('step1PriceFrom', 'Price from (template)', 'step1', 'Use {{price}}. E.g., \'From NOK {{price}},-\''),
    i18n('step1LoadingDuration', 'Loading duration', 'step1'),
    {
      name: 'step1CategoryClinicBadges',
      title: 'Clinic Badges per Category',
      type: 'array',
      group: 'step1',
      description:
        'Displayed as small badges for each service category in step 1 (e.g. \'Majorstuen 10A\', \'Moss\'). Use activity group slugs as category keys.',
      of: [
        {
          type: 'object',
          name: 'step1CategoryClinicBadgeGroup',
          fields: [
            {
              name: 'categoryKeys',
              title: 'Category Keys',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
              description:
                'Slugs from booking API, e.g. fertility, gynecologist, physiotherapist-osteopath',
            },
            {
              name: 'badges',
              title: 'Clinic badges',
              type: 'array',
              validation: (Rule) => Rule.required().min(1),
              of: [
                {
                  type: 'object',
                  name: 'step1ClinicBadge',
                  fields: [
                    {
                      name: 'badgeKey',
                      title: 'Key',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'label',
                      title: 'Badge text',
                      type: 'internationalizedArrayString',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'sortOrder',
                      title: 'Sorting',
                      type: 'number',
                      initialValue: 10,
                    },
                    {
                      name: 'clinic',
                      title: 'Clinic (optional)',
                      type: 'reference',
                      to: [{ type: 'clinicPage' }],
                    },
                    {
                      name: 'metodikaLocationId',
                      title: 'Metodika location ID (optional)',
                      type: 'number',
                      description: 'Links the badge to the correct Metodika location in step 2',
                    },
                    {
                      name: 'badgeImage',
                      title: 'Image (optional)',
                      type: 'image',
                      options: { hotspot: true },
                    },
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'badgeKey' },
                    prepare({ title, subtitle }: { title?: unknown; subtitle?: string }) {
                      return {
                        title: pickNo(title) || subtitle || 'Clinic badge',
                        subtitle,
                      }
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { keys: 'categoryKeys', badges: 'badges' },
            prepare({
              keys,
              badges,
            }: {
              keys?: string[]
              badges?: { badgeKey?: string }[]
            }) {
              const keyList = (keys ?? []).slice(0, 3).join(', ')
              const badgeCount = badges?.length ?? 0
              return {
                title: keyList || 'Category',
                subtitle: `${badgeCount} badge${badgeCount === 1 ? '' : 's'}`,
              }
            },
          },
        },
      ],
    },

    i18n('step2Heading', 'Heading', 'step2'),
    i18n('step2Loading', 'Loading text', 'step2'),
    i18n('step2EmptyTitle', 'Empty state – title', 'step2'),
    i18n('step2EmptyMessage', 'Empty state - message', 'step2', undefined, 'internationalizedArrayText'),

    i18n('step3Heading', 'Heading', 'step3'),
    i18n('step3Subtitle', 'Subtitle', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3Loading', 'Loading text', 'step3'),
    i18n('step3FirstAvailableTitle', '\'First available\' – title', 'step3'),
    i18n('step3FirstAvailableSubtitle', '\'First available\' – subtitle', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3EmptyNoCaregiversTitle', 'No specialists – title', 'step3'),
    i18n('step3EmptyNoCaregiversMessage', 'No practitioners - message', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3EmptyFetchTitle', 'Could not fetch – title', 'step3'),
    i18n('step3EmptyFetchMessage', 'Could not fetch - message', 'step3', undefined, 'internationalizedArrayText'),

    i18n('step4Heading', 'Heading', 'step4'),
    i18n('step4SelectedDayLabel', '\'Selected day\' label', 'step4'),
    i18n('step4NotOnlineTitle', 'Not online – title', 'step4'),
    i18n('step4NotOnlineMessage', 'Not online - message', 'step4', undefined, 'internationalizedArrayText'),
    i18n('step4NoSlotsTitle', 'No appointments – title', 'step4'),
    i18n('step4NoSlotsMessage', 'No appointments - message', 'step4', undefined, 'internationalizedArrayText'),

    i18n('step5Heading', 'Heading', 'step5'),
    i18n('step5OrderTitle', 'Summary – title', 'step5'),
    i18n('step5LabelService', 'Label: Service', 'step5'),
    i18n('step5LabelPrice', 'Label: Price', 'step5'),
    i18n('step5LabelClinic', 'Label: Clinic', 'step5'),
    i18n('step5LabelDuration', 'Label: Duration', 'step5'),
    i18n('step5LabelDate', 'Label: Date', 'step5'),
    i18n('step5LabelTime', 'Label: Time', 'step5'),
    i18n('step5PriceFree', 'Free price', 'step5'),
    i18n('step5PriceFrom', 'Price from (template)', 'step5', 'Use {{price}}'),
    i18n('step5PriceNote', 'Price footnote', 'step5', undefined, 'internationalizedArrayText'),
    i18n('step5PersonalInfoTitle', 'Personal details – title', 'step5'),
    i18n('step5SubmitLabel', 'Confirm button', 'step5'),
    i18n('step5SubmittingLabel', 'Submit button', 'step5'),

    i18n('formFirstNameLabel', 'First name – label', 'form'),
    i18n('formFirstNamePlaceholder', 'First name - placeholder', 'form'),
    i18n('formLastNameLabel', 'Last name – label', 'form'),
    i18n('formLastNamePlaceholder', 'Last name - placeholder', 'form'),
    i18n('formBirthNumberLabel', 'Date of birth/ID – label', 'form'),
    i18n('formBirthNumberPlaceholder', 'Date of birth/ID – placeholder', 'form'),
    i18n('formBirthNumberHelp', 'Date of birth/ID – help text', 'form', undefined, 'internationalizedArrayText'),
    i18n('formPhoneLabel', 'Mobile – label', 'form'),
    i18n('formPhonePlaceholder', 'Mobile - placeholder', 'form'),
    i18n('formPhoneHelp', 'Mobile - help text', 'form', undefined, 'internationalizedArrayText'),
    i18n('formEmailLabel', 'Email – label', 'form'),
    i18n('formEmailPlaceholder', 'Email – placeholder', 'form'),
    i18n('formEmailHelp', 'Email – help text', 'form', undefined, 'internationalizedArrayText'),
    i18n('formCancellationRules', 'Cancellation rules', 'form', undefined, 'internationalizedArrayText'),
    i18n('formTermsPageTeaser', 'Terms paragraph', 'form', 'Use {{termsLink}} for link text'),
    i18n('formTermsLinkText', 'Terms link text (infobox)', 'form'),
    i18n('formTermsInlineLinkText', 'Terms link text (checkbox)', 'form'),
    i18n('formTermsCheckbox', 'Terms consent', 'form', 'Use {{termsLink}} for link text'),
    i18n('formPrivacyLinkText', 'Privacy link text', 'form'),
    i18n('formPrivacyCheckbox', 'Privacy consent', 'form', 'Use {{privacyLink}} for link text'),
    i18n('formMarketingCheckbox', 'Newsletter consent', 'form', undefined, 'internationalizedArrayText'),

    i18n('successTitle', 'Title', 'success'),
    i18n('successMessageSms', 'Bekreftelse (kun SMS)', 'success'),
    i18n('successMessageSmsEmail', 'Confirmation (SMS and email)', 'success'),
    i18n('successLabelTreatment', 'Label: Treatment', 'success'),
    i18n('successLabelClinic', 'Label: Clinic', 'success'),
    i18n('successClinicPrefix', 'Clinic prefix', 'success', 'E.g. \'CMedical – \''),
    i18n('successLabelDateTime', 'Label: Date and time', 'success'),
    i18n('successLabelSpecialist', 'Label: Specialist', 'success'),
    i18n('successBackHome', 'Back to homepage', 'success'),

    i18n('errorMissingData', 'Missing data', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorActivityType', 'Activity type', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorSubmit', 'Submission failed', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorSubmitNetwork', 'Network error', 'errors', undefined, 'internationalizedArrayText'),

    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
    { ...geoSummaryField, group: 'seo' },
  ],
  preview: {
    select: { title: 'pageTitle' },
    prepare({ title }: { title?: unknown }) {
      return { title: pickNo(title) || 'Book appointment' }
    },
  },
}
