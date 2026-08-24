/**
 * Seed content for trackingEventsReference singleton.
 * Source: CMedical tracking implementation brief (Aug 2026) — implemented events only.
 */

export type TrackingEventSeed = {
  _key: string
  eventName: string
  priority: 'priority1' | 'priority2' | 'preserve' | 'gtmOnly'
  implementationStatus: 'implemented' | 'partial' | 'pending' | 'na'
  summary: string
  whereItFires: string
  parameters: string
  examplePayload?: string
  verifyCommand?: string
  developerNotes?: string
}

export const TRACKING_REFERENCE_OVERVIEW = `Norwegian site (cmedical.no /no) uses GTM container GTM-PNNR898W.
GA4 measurement ID: G-TNK2WNL0QD · Google Ads conversion ID: AW-11476524292

The site pushes events to window.dataLayer. GTM tags/triggers map them to GA4 and Google Ads.
Consent Mode v2, PII denylist, and block_clarity on /booking are enforced in code.

This document lists events that are implemented in the website codebase.`

export const TRACKING_PARAMETER_KEYS = `page_type · entry_point · category · service_area · service_name · price_from
clinic · practitioner · step_number · step_name · from_step · to_step
appointment_date · duration_minutes · transaction_id · value · currency
booking_lead_days · error_type · phone_number · link_location · preferred_time
subject · form_name · form_location · provider_name · specialist_name · specialty · email_type

Send unknown fields as null (not empty string). Never send PII (name, phone, email, fødselsnummer, free text).`

export const TRACKING_OWNERSHIP_SPLIT = `Website code (src/lib/tracking/)
  · When events fire and non-PII parameter values

GTM / GA4 / Google Ads (SEO team)
  · Tags, triggers, custom dimensions, conversion actions

Sanity (this Studio)
  · This reference list — read-only documentation`

export const TRACKING_EVENTS_SEED: TrackingEventSeed[] = [
  {
    _key: 'booking-completed',
    eventName: 'booking_completed',
    priority: 'priority1',
    implementationStatus: 'implemented',
    summary:
      'Primary Google Ads conversion. Fires once when Metodika or Pasientsky booking succeeds.',
    whereItFires:
      'Metodika: after POST /api/booking/complete returns ok + appointmentId.\nPasientsky: iframe postMessage booking-completed.',
    parameters:
      'transaction_id · value · currency · booking_method · clinic · service_name · category · practitioner · appointment_date · duration_minutes · booking_lead_days',
    examplePayload: `window.dataLayer.push({
  event: 'booking_completed',
  transaction_id: '8842193',
  value: 2100,
  currency: 'NOK',
  booking_method: 'metodika',
  clinic: 'Majorstuen 10B',
  service_name: 'Fertilitetsutredning for eggfrys',
  category: 'Gynekolog',
  practitioner: 'Jackson Tok',
  appointment_date: '2026-09-01',
  duration_minutes: 30,
  booking_lead_days: 8
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_completed')",
  },
  {
    _key: 'booking-menu-start',
    eventName: 'booking_menu_start',
    priority: 'priority1',
    implementationStatus: 'implemented',
    summary: 'Fires on every entry into booking from all entry points.',
    whereItFires:
      'header_cta · price_page · service_page_cta · clinic_page · specialist_page · insurance_page · contact_page · deep_link',
    parameters: 'entry_point · category · service_name · price_from · clinic · practitioner · specialty',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_menu_start')",
  },
  {
    _key: 'virtual-page-view',
    eventName: 'virtual_page_view',
    priority: 'priority1',
    implementationStatus: 'implemented',
    summary: 'Fires on first load and every client-side route change (GA4 send_page_view: false).',
    whereItFires: 'All public routes — SeoAnalyticsListeners in PageLayout.',
    parameters: 'page_path (includes query on /booking) · page_title · page_type',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'virtual_page_view')",
  },
  {
    _key: 'click-phone',
    eventName: 'click_phone',
    priority: 'priority1',
    implementationStatus: 'implemented',
    summary: 'Site-wide tel: link clicks outside /booking.',
    whereItFires: 'Header · footer · clinic · contact · other pages (not /booking).',
    parameters: 'clinic · phone_number · link_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'click_phone')",
  },
  {
    _key: 'booking-start',
    eventName: 'booking_start',
    priority: 'priority1',
    implementationStatus: 'implemented',
    summary: 'First active service choice in booking step 1.',
    whereItFires: 'BookingDemo step 1 — first service selection.',
    parameters: 'booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_start')",
  },
  {
    _key: 'booking-page-context',
    eventName: 'booking_page_context',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'Signals GTM to block Microsoft Clarity on booking.',
    whereItFires: 'Once when /booking loads.',
    parameters: 'page_type · block_clarity',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_page_context')",
  },
  {
    _key: 'booking-init',
    eventName: 'booking_init',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'Booking funnel opened.',
    whereItFires: 'Metodika · Pasientsky iframe · external handoff.',
    parameters: 'booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_init')",
  },
  {
    _key: 'booking-step',
    eventName: 'booking_step',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'Each booking step change with funnel context.',
    whereItFires: 'BookingDemo on step change.',
    parameters: 'step_number · step_name · booking_method · service_name · category · clinic',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_step')",
  },
  {
    _key: 'booking-select-clinic',
    eventName: 'booking_select_clinic',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'User selected a clinic in booking.',
    whereItFires: 'Booking step 2 clinic selection.',
    parameters: 'clinic · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_select_clinic')",
  },
  {
    _key: 'booking-select-category',
    eventName: 'booking_select_category',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Service area / treatment chosen in step 1.',
    whereItFires: 'BookingDemo handleSelectService.',
    parameters: 'category · service_name · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_select_category')",
  },
  {
    _key: 'booking-back',
    eventName: 'booking_back',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Back button or step indicator navigation.',
    whereItFires: 'BookingDemo resetStep / progress back.',
    parameters: 'from_step · to_step · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_back')",
  },
  {
    _key: 'booking-close',
    eventName: 'booking_close',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'User closed booking (X button).',
    whereItFires: 'BookingDemo header close.',
    parameters: '—',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_close')",
  },
  {
    _key: 'booking-unavailable',
    eventName: 'booking_unavailable',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Clinic without online Metodika booking (external handoff).',
    whereItFires: 'ExternalBookingHandoff component.',
    parameters: 'clinic · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_unavailable')",
  },
  {
    _key: 'booking-phone-click',
    eventName: 'booking_phone_click',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Phone link click inside /booking (separate from click_phone).',
    whereItFires: 'tel: links on /booking routes.',
    parameters: 'link_location · clinic',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_phone_click')",
  },
  {
    _key: 'booking-submitted',
    eventName: 'booking_submitted',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Booking request sent to Metodika API.',
    whereItFires: 'BookingDemo step 5 submit (after validation, before response).',
    parameters: 'booking_method · clinic · service_name',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_submitted')",
  },
  {
    _key: 'booking-failed',
    eventName: 'booking_failed',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Metodika booking error or network failure.',
    whereItFires: 'Failed POST /api/booking/complete or network error.',
    parameters: 'error_type · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_failed')",
  },
  {
    _key: 'callback-request',
    eventName: 'callback_request',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Callback request dialog submitted successfully.',
    whereItFires: 'ContactRequestDialog success.',
    parameters: 'form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'callback_request')",
  },
  {
    _key: 'contact-message',
    eventName: 'contact_message',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Contact page message form submitted successfully.',
    whereItFires: 'Contact page form success.',
    parameters: 'form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'contact_message')",
  },
  {
    _key: 'form-start',
    eventName: 'form_start',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'First field interaction in a form (once per form).',
    whereItFires: 'Contact message form · callback request dialog.',
    parameters: 'form_name · form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'form_start')",
  },
  {
    _key: 'form-submit',
    eventName: 'form_submit',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Form submitted successfully.',
    whereItFires: 'Contact message form · callback request dialog.',
    parameters: 'form_name · form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'form_submit')",
  },
  {
    _key: 'click-email',
    eventName: 'click_email',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'mailto: link click site-wide.',
    whereItFires: 'SeoAnalyticsListeners global mailto click.',
    parameters: 'link_location · email_type',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'click_email')",
  },
  {
    _key: 'specialist-view',
    eventName: 'specialist_view',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Specialist profile page viewed.',
    whereItFires: 'SpecialistProfile mount.',
    parameters: 'specialist_name · specialty · clinic',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'specialist_view')",
  },
  {
    _key: 'insurance-provider-click',
    eventName: 'insurance_provider_click',
    priority: 'priority2',
    implementationStatus: 'implemented',
    summary: 'Insurance provider name clicked on /forsikring.',
    whereItFires: 'Insurance page company list.',
    parameters: 'provider_name',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'insurance_provider_click')",
  },
]
