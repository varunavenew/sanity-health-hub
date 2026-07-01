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
  title: 'Bestill time',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'general', title: 'Generelt', default: true },
    { name: 'step1', title: 'Steg 1 – Tjeneste' },
    { name: 'step2', title: 'Steg 2 – Klinikk' },
    { name: 'step3', title: 'Steg 3 – Behandler' },
    { name: 'step4', title: 'Steg 4 – Tid' },
    { name: 'step5', title: 'Steg 5 – Bekreft' },
    { name: 'success', title: 'Bekreftet skjerm' },
    { name: 'form', title: 'Skjema' },
    { name: 'errors', title: 'Feilmeldinger' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    i18n('pageTitle', 'Sidetittel (header)', 'general', 'F.eks. «Bestill time»'),
    i18n('closeAriaLabel', 'Lukk-knapp (tilgjengelighet)', 'general'),
    i18n('backLabel', 'Tilbake-lenke', 'general'),
    i18n(
      'stepProgressTemplate',
      'Steg-indikator',
      'general',
      'Bruk {{step}} og {{total}}. F.eks. «Steg {{step}} av {{total}}»',
    ),
    i18n('stepLabelService', 'Stegnavn: Tjeneste', 'general'),
    i18n('stepLabelClinic', 'Stegnavn: Klinikk', 'general'),
    i18n('stepLabelSpecialist', 'Stegnavn: Behandler', 'general'),
    i18n('stepLabelTime', 'Stegnavn: Tid', 'general'),
    i18n('stepLabelConfirm', 'Stegnavn: Bekreft', 'general'),
    i18n('summaryServiceLabel', 'Oppsummering: Tjeneste', 'general'),
    i18n('summaryClinicLabel', 'Oppsummering: Klinikk', 'general'),
    i18n('summarySpecialistLabel', 'Oppsummering: Behandler', 'general'),
    {
      name: 'supportPhone',
      title: 'Telefon (tomme tilstander)',
      type: 'string',
      group: 'general',
      description: 'Vises i «ring oss»-knapper når data mangler',
    },
    i18n('supportPhoneLabel', 'Telefon-knapp etikett', 'general'),

    i18n('step1Heading', 'Overskrift', 'step1'),
    i18n(
      'step1HeadingFiltered',
      'Overskrift (filtrert kategori)',
      'step1',
      'Bruk {{category}} for kategorinavn',
    ),
    i18n('step1ShowAllServices', '«Vis alle tjenester»', 'step1'),
    i18n('step1Loading', 'Laster tekst', 'step1'),
    i18n('step1AllClinicsBadge', '«Alle klinikker»-merke', 'step1'),
    i18n('step1EmptyTitle', 'Tom tilstand – tittel', 'step1'),
    i18n('step1EmptyMessage', 'Tom tilstand – melding', 'step1', undefined, 'internationalizedArrayText'),
    i18n('step1PriceFree', 'Gratis-pris', 'step1'),
    i18n('step1PriceFrom', 'Pris fra (mal)', 'step1', 'Bruk {{price}}. F.eks. «Fra kr {{price}},-»'),
    i18n('step1LoadingDuration', 'Laster varighet', 'step1'),
    {
      name: 'step1CategoryClinicBadges',
      title: 'Klinikkmerker per kategori',
      type: 'array',
      group: 'step1',
      description:
        'Vises som små merker ved hver tjenestekategori i steg 1 (f.eks. «Majorstuen 10A», «Moss»). Bruk aktivitetsgruppe-slugs som kategori-nøkler.',
      of: [
        {
          type: 'object',
          name: 'step1CategoryClinicBadgeGroup',
          fields: [
            {
              name: 'categoryKeys',
              title: 'Kategori-nøkler',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
              description:
                'Slugs fra booking-API, f.eks. fertilitet, gynekolog, fysioterapeut-osteopat',
            },
            {
              name: 'badges',
              title: 'Klinikkmerker',
              type: 'array',
              validation: (Rule) => Rule.required().min(1),
              of: [
                {
                  type: 'object',
                  name: 'step1ClinicBadge',
                  fields: [
                    {
                      name: 'badgeKey',
                      title: 'Nøkkel',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'label',
                      title: 'Merketekst',
                      type: 'internationalizedArrayString',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'sortOrder',
                      title: 'Sortering',
                      type: 'number',
                      initialValue: 10,
                    },
                    {
                      name: 'clinic',
                      title: 'Klinikk (valgfritt)',
                      type: 'reference',
                      to: [{ type: 'clinicPage' }],
                    },
                    {
                      name: 'metodikaLocationId',
                      title: 'Metodika location-id (valgfritt)',
                      type: 'number',
                      description: 'Kobler merket til riktig Metodika-lokasjon i steg 2',
                    },
                    {
                      name: 'badgeImage',
                      title: 'Bilde (valgfritt)',
                      type: 'image',
                      options: { hotspot: true },
                    },
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'badgeKey' },
                    prepare({ title, subtitle }: { title?: unknown; subtitle?: string }) {
                      return {
                        title: pickNo(title) || subtitle || 'Klinikkmerke',
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
                title: keyList || 'Kategori',
                subtitle: `${badgeCount} merke${badgeCount === 1 ? '' : 'r'}`,
              }
            },
          },
        },
      ],
    },

    i18n('step2Heading', 'Overskrift', 'step2'),
    i18n('step2Loading', 'Laster tekst', 'step2'),
    i18n('step2EmptyTitle', 'Tom tilstand – tittel', 'step2'),
    i18n('step2EmptyMessage', 'Tom tilstand – melding', 'step2', undefined, 'internationalizedArrayText'),

    i18n('step3Heading', 'Overskrift', 'step3'),
    i18n('step3Subtitle', 'Undertittel', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3Loading', 'Laster tekst', 'step3'),
    i18n('step3FirstAvailableTitle', '«Første ledige» – tittel', 'step3'),
    i18n('step3FirstAvailableSubtitle', '«Første ledige» – undertittel', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3EmptyNoCaregiversTitle', 'Ingen behandlere – tittel', 'step3'),
    i18n('step3EmptyNoCaregiversMessage', 'Ingen behandlere – melding', 'step3', undefined, 'internationalizedArrayText'),
    i18n('step3EmptyFetchTitle', 'Kunne ikke hente – tittel', 'step3'),
    i18n('step3EmptyFetchMessage', 'Kunne ikke hente – melding', 'step3', undefined, 'internationalizedArrayText'),

    i18n('step4Heading', 'Overskrift', 'step4'),
    i18n('step4SelectedDayLabel', '«Valgt dag»-etikett', 'step4'),
    i18n('step4NoDaysLabel', 'Ingen ledige dager', 'step4'),
    i18n('step4TodayLabel', '«I dag» på kalender', 'step4'),
    i18n('step4PickTimeLabel', '«Velg en tid»-etikett', 'step4'),
    i18n('step4DurationPrefix', 'Varighet-prefiks', 'step4', 'F.eks. «Varighet» – vises foran varighet'),
    i18n('step4LoadingTimes', 'Laster tider', 'step4'),
    i18n('step4NotOnlineTitle', 'Ikke online – tittel', 'step4'),
    i18n('step4NotOnlineMessage', 'Ikke online – melding', 'step4', undefined, 'internationalizedArrayText'),
    i18n('step4NoSlotsTitle', 'Ingen timer – tittel', 'step4'),
    i18n('step4NoSlotsMessage', 'Ingen timer – melding', 'step4', undefined, 'internationalizedArrayText'),

    i18n('step5Heading', 'Overskrift', 'step5'),
    i18n('step5OrderTitle', 'Oppsummering – tittel', 'step5'),
    i18n('step5LabelService', 'Etikett: Tjeneste', 'step5'),
    i18n('step5LabelPrice', 'Etikett: Pris', 'step5'),
    i18n('step5LabelClinic', 'Etikett: Klinikk', 'step5'),
    i18n('step5LabelDuration', 'Etikett: Varighet', 'step5'),
    i18n('step5LabelDate', 'Etikett: Dato', 'step5'),
    i18n('step5LabelTime', 'Etikett: Tid', 'step5'),
    i18n('step5PriceFree', 'Gratis-pris', 'step5'),
    i18n('step5PriceFrom', 'Pris fra (mal)', 'step5', 'Bruk {{price}}'),
    i18n('step5PriceNote', 'Pris fotnote', 'step5', undefined, 'internationalizedArrayText'),
    i18n('step5PersonalInfoTitle', 'Personopplysninger – tittel', 'step5'),
    i18n('step5SubmitLabel', 'Bekreft-knapp', 'step5'),
    i18n('step5SubmittingLabel', 'Sender-knapp', 'step5'),

    i18n('formFirstNameLabel', 'Fornavn – etikett', 'form'),
    i18n('formFirstNamePlaceholder', 'Fornavn – placeholder', 'form'),
    i18n('formLastNameLabel', 'Etternavn – etikett', 'form'),
    i18n('formLastNamePlaceholder', 'Etternavn – placeholder', 'form'),
    i18n('formBirthNumberLabel', 'Fødselsnummer – etikett', 'form'),
    i18n('formBirthNumberPlaceholder', 'Fødselsnummer – placeholder', 'form'),
    i18n('formBirthNumberHelp', 'Fødselsnummer – hjelpetekst', 'form', undefined, 'internationalizedArrayText'),
    i18n('formPhoneLabel', 'Mobil – etikett', 'form'),
    i18n('formPhonePlaceholder', 'Mobil – placeholder', 'form'),
    i18n('formPhoneHelp', 'Mobil – hjelpetekst', 'form', undefined, 'internationalizedArrayText'),
    i18n('formEmailLabel', 'E-post – etikett', 'form'),
    i18n('formEmailPlaceholder', 'E-post – placeholder', 'form'),
    i18n('formEmailHelp', 'E-post – hjelpetekst', 'form', undefined, 'internationalizedArrayText'),
    i18n('formCancellationRules', 'Avbestillingsregler', 'form', undefined, 'internationalizedArrayText'),
    i18n('formTermsPageTeaser', 'Vilkår-avsnitt', 'form', 'Bruk {{termsLink}} for lenketekst'),
    i18n('formTermsLinkText', 'Vilkår-lenketekst (infoboks)', 'form'),
    i18n('formTermsInlineLinkText', 'Vilkår-lenketekst (avkryssing)', 'form'),
    i18n('formTermsCheckbox', 'Vilkår-samtykke', 'form', 'Bruk {{termsLink}} for lenketekst'),
    i18n('formPrivacyLinkText', 'Personvern-lenketekst', 'form'),
    i18n('formPrivacyCheckbox', 'Personvern-samtykke', 'form', 'Bruk {{privacyLink}} for lenketekst'),
    i18n('formMarketingCheckbox', 'Nyhetsbrev-samtykke', 'form', undefined, 'internationalizedArrayText'),

    i18n('successTitle', 'Tittel', 'success'),
    i18n('successMessageSms', 'Bekreftelse (kun SMS)', 'success'),
    i18n('successMessageSmsEmail', 'Bekreftelse (SMS og e-post)', 'success'),
    i18n('successLabelTreatment', 'Etikett: Behandling', 'success'),
    i18n('successLabelClinic', 'Etikett: Klinikk', 'success'),
    i18n('successClinicPrefix', 'Klinikk-prefiks', 'success', 'F.eks. «CMedical – »'),
    i18n('successLabelDateTime', 'Etikett: Dato og tid', 'success'),
    i18n('successLabelSpecialist', 'Etikett: Behandler', 'success'),
    i18n('successBackHome', 'Tilbake til forsiden', 'success'),

    i18n('errorMissingData', 'Manglende data', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorActivityType', 'Aktivitetstype', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorSubmit', 'Innsending feilet', 'errors', undefined, 'internationalizedArrayText'),
    i18n('errorSubmitNetwork', 'Nettverksfeil', 'errors', undefined, 'internationalizedArrayText'),

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
      return { title: pickNo(title) || 'Bestill time' }
    },
  },
}
