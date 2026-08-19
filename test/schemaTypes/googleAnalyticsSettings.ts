import { defineField, defineType } from 'sanity'
import { AnalyticsIcon } from './icons'
import { requiredNoEnI18n } from './i18n'

const DEFAULT_GTM_CONTAINER_ID = 'GTM-PNNR898W'

const DEFAULT_CONSENT_HEAD_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);`

const DEFAULT_GTM_HEAD_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${DEFAULT_GTM_CONTAINER_ID}');`

const DEFAULT_GTM_BODY_NOSCRIPT = `<iframe src="https://www.googletagmanager.com/ns.html?id=${DEFAULT_GTM_CONTAINER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`

/** Default NO + EN values for new documents. */
const i18nDefault = (no: string, en: string) => [
  { _key: 'no', language: 'no', value: no },
  { _key: 'en', language: 'en', value: en },
]

export default defineType({
  name: 'googleAnalyticsSettings',
  title: 'Google Analytics',
  type: 'document',
  icon: AnalyticsIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'consent', title: 'Consent (head)' },
    { name: 'gtmHead', title: 'GTM (head)' },
    { name: 'gtmBody', title: 'GTM (body)' },
    { name: 'cookiebot', title: 'Cookiebot' },
    { name: 'privacy', title: 'Privacy' },
  ],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enable tracking scripts',
      type: 'boolean',
      group: 'general',
      initialValue: true,
      description:
        'When off, consent + GTM snippets are not injected on the public site, for both languages.',
    }),
    defineField({
      name: 'gtmContainerId',
      title: 'GTM container ID',
      type: 'internationalizedArrayString',
      group: 'general',
      initialValue: i18nDefault(DEFAULT_GTM_CONTAINER_ID, DEFAULT_GTM_CONTAINER_ID),
      description: 'One container ID per language. Set different values if NO and EN use separate GTM containers.',
      validation: requiredNoEnI18n('GTM container ID'),
    }),
    defineField({
      name: 'consentHeadScript',
      title: 'Consent defaults (head)',
      type: 'internationalizedArrayText',
      group: 'consent',
      initialValue: i18nDefault(DEFAULT_CONSENT_HEAD_SCRIPT, DEFAULT_CONSENT_HEAD_SCRIPT),
      description:
        'JavaScript placed in the first <script> in <head>, before GTM, per language. Cookiebot updates these states after the user chooses. Required for GA4/Google Ads in the EEA.',
    }),
    defineField({
      name: 'gtmHeadScript',
      title: 'Google Tag Manager (head)',
      type: 'internationalizedArrayText',
      group: 'gtmHead',
      initialValue: i18nDefault(DEFAULT_GTM_HEAD_SCRIPT, DEFAULT_GTM_HEAD_SCRIPT),
      description:
        'GTM bootstrap script for <head>, per language. Leave a language empty to auto-generate from that language\'s Container ID on the frontend.',
    }),
    defineField({
      name: 'gtmBodyNoscript',
      title: 'Google Tag Manager (body noscript)',
      type: 'internationalizedArrayText',
      group: 'gtmBody',
      initialValue: i18nDefault(DEFAULT_GTM_BODY_NOSCRIPT, DEFAULT_GTM_BODY_NOSCRIPT),
      description:
        'HTML inside <noscript> immediately after <body> (usually the GTM iframe), per language. Leave a language empty to auto-generate from that language\'s Container ID.',
    }),
    defineField({
      name: 'cookiebotHeadScript',
      title: 'Cookiebot (head, optional)',
      type: 'internationalizedArrayText',
      group: 'cookiebot',
      description:
        'Optional Cookiebot snippet for <head>, per language. When added, it should load after consent defaults and before GTM.',
    }),
    defineField({
      name: 'privacyNotes',
      title: 'Privacy requirements (reference)',
      type: 'text',
      group: 'privacy',
      readOnly: true,
      rows: 8,
      initialValue: [
        '• transaction_id must be Metodika booking ID only — never fødselsnummer, phone, email, or hashes.',
        '• No booking form field values (names, DOB, symptoms) in dataLayer or URL params.',
        '• Block Microsoft Clarity on /booking (site sends block_clarity via booking_page_context).',
        '• Event tracking uses src/lib/tracking.ts — params are PII-sanitized in code.',
      ].join('\n'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Google Analytics' }
    },
  },
})
