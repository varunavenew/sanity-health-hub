/**
 * Seed content for trackingEventsReference singleton.
 * Source: CMedical tracking implementation brief (Aug 2026) + codebase audit.
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
Do not change Consent Mode v2 stub, PII denylist, or block_clarity on /booking without developer review.

Swedish /se uses a legacy container — out of scope for this document.`

export const TRACKING_PARAMETER_KEYS = `page_type · entry_point · category · service_area · service_name · price_from
clinic · practitioner · step_number · step_name · from_step · to_step
appointment_date · duration_minutes · transaction_id · value · currency
booking_lead_days · error_type · phone_number · link_location · preferred_time
subject · form_name · form_location · provider_name · specialist_name · specialty · email_type

Send unknown fields as null (not empty string). Never send PII (name, phone, email, fødselsnummer, free text).`

export const TRACKING_OWNERSHIP_SPLIT = `Sanity (this Studio)
  · GTM container ID, consent scripts, Cookiebot — Google Analytics document
  · This reference list (read-only event specs)

Website code (src/lib/tracking/)
  · When events fire and non-PII parameter values from booking flow / navigation
  · PII sanitization before dataLayer.push

GTM / GA4 / Google Ads (SEO team)
  · Tags, triggers, custom dimensions, conversion actions, Smart Bidding
  · No code deploy needed when remapping parameters — keys must match this doc`

export const TRACKING_EVENTS_SEED: TrackingEventSeed[] = [
  {
    _key: 'booking-completed',
    eventName: 'booking_completed',
    priority: 'priority1',
    implementationStatus: 'partial',
    summary:
      'Primary Google Ads conversion. Fires once when Metodika or Pasientsky booking succeeds. transaction_id must be Metodika appointment ID only.',
    whereItFires:
      'Metodika: after POST /api/booking/complete returns ok + appointmentId (BookingDemo step 5).\nPasientsky: iframe postMessage booking-completed.',
    parameters:
      'transaction_id · value · currency · booking_method · clinic · service_name · category · practitioner',
    examplePayload: `window.dataLayer.push({
  event: 'booking_completed',
  transaction_id: 'MET-8842193',
  value: 2100,
  currency: 'NOK',
  booking_method: 'metodika',
  clinic: 'Majorstuen 10B',
  service_name: 'Fertilitetsutredning for eggfrys',
  category: 'Gynekolog',
  practitioner: 'Jackson Tok'
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_completed')",
    developerNotes:
      'Metodika payload uses booking state snapshot + appointmentId. Deduped per transaction_id. value null when price unknown. Do not fire on confirmation refresh.',
  },
  {
    _key: 'booking-menu-start',
    eventName: 'booking_menu_start',
    priority: 'priority1',
    implementationStatus: 'pending',
    summary:
      'Largest volume Google Ads signal. Fire on every entry into booking from all entry points.',
    whereItFires:
      'header_cta · price_page · service_page_cta · clinic_page · specialist_page · insurance_page · contact_page · deep_link (/booking?…)',
    parameters: 'entry_point · category · service_name · price_from · clinic · practitioner · specialty',
    examplePayload: `window.dataLayer.push({
  event: 'booking_menu_start',
  entry_point: 'price_page',
  category: 'Gynekolog',
  service_name: 'Endometriose',
  price_from: 3200,
  clinic: null,
  practitioner: null,
  specialty: null
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_menu_start')",
    developerNotes: 'Known bugs: specialist “Bestill time hos …” CTA; /booking?klinikk= deep link.',
  },
  {
    _key: 'virtual-page-view',
    eventName: 'virtual_page_view',
    priority: 'priority1',
    implementationStatus: 'pending',
    summary:
      'Required because GA4 tag uses send_page_view: false. Fire on first load and every client-side route change.',
    whereItFires: 'All public routes in Next.js app router (Norwegian flow).',
    parameters: 'page_path (include query string on /booking) · page_title · page_type',
    examplePayload: `window.dataLayer.push({
  event: 'virtual_page_view',
  page_path: '/no/booking?kategori=gynekolog',
  page_title: document.title,
  page_type: 'booking'
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'virtual_page_view')",
    developerNotes:
      'page_type: home | service | prices | clinic | specialist | article | insurance | contact | booking. Coordinate go-live with SEO to avoid double page views.',
  },
  {
    _key: 'click-phone',
    eventName: 'click_phone',
    priority: 'priority1',
    implementationStatus: 'pending',
    summary: 'Secondary Google Ads conversion. Use click_phone only — not legacy phone_click.',
    whereItFires: 'Phone links: header · footer · clinic_page · contact_page · booking',
    parameters: 'clinic · phone_number (public clinic number) · link_location',
    examplePayload: `window.dataLayer.push({
  event: 'click_phone',
  clinic: 'Bekkestua',
  phone_number: '+4767123456',
  link_location: 'header'
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'click_phone')",
  },
  {
    _key: 'booking-start',
    eventName: 'booking_start',
    priority: 'priority1',
    implementationStatus: 'pending',
    summary:
      'Secondary conversion. First active choice in booking step 1 — not on page load. Name is booking_start (not booking_started).',
    whereItFires: 'Booking step 1: first service/category selection.',
    parameters: 'booking_method',
    examplePayload: `window.dataLayer.push({
  event: 'booking_start',
  booking_method: 'metodika'
});`,
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_start')",
  },
  {
    _key: 'booking-page-context',
    eventName: 'booking_page_context',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'Signals GTM to block Microsoft Clarity on booking (health data). Keep as-is.',
    whereItFires: 'Once when /booking loads (BookingPageAnalytics).',
    parameters: 'page_type · block_clarity',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_page_context')",
    developerNotes: 'Do not remove block_clarity: true on /booking.',
  },
  {
    _key: 'booking-init',
    eventName: 'booking_init',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'Booking funnel opened. Keep as-is.',
    whereItFires: 'Metodika booking page mount · Pasientsky iframe · external handoff.',
    parameters: 'booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_init')",
  },
  {
    _key: 'booking-step',
    eventName: 'booking_step',
    priority: 'preserve',
    implementationStatus: 'partial',
    summary: 'Step changes in booking funnel. Priority 2: add service_name, category, clinic.',
    whereItFires: 'Each booking step change (BookingDemo).',
    parameters: 'step_number · step_name · booking_method (+ service_name, category, clinic planned)',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_step')",
  },
  {
    _key: 'booking-select-clinic',
    eventName: 'booking_select_clinic',
    priority: 'preserve',
    implementationStatus: 'implemented',
    summary: 'User selected a clinic in booking. Keep as-is.',
    whereItFires: 'Booking step 2 clinic selection.',
    parameters: 'clinic · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_select_clinic')",
  },
  {
    _key: 'booking-select-category',
    eventName: 'booking_select_category',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Service area chosen in booking.',
    whereItFires: 'Booking step 1 category/service area selection.',
    parameters: 'category · service_name (per brief)',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_select_category')",
  },
  {
    _key: 'booking-back',
    eventName: 'booking_back',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Back button or step indicator navigation.',
    whereItFires: 'Booking back control.',
    parameters: 'from_step · to_step',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_back')",
  },
  {
    _key: 'booking-close',
    eventName: 'booking_close',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'User closed booking modal/page.',
    whereItFires: 'Booking close (X) button.',
    parameters: '—',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_close')",
  },
  {
    _key: 'booking-unavailable',
    eventName: 'booking_unavailable',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Clinic without online booking selected (e.g. Moss).',
    whereItFires: 'External / unavailable clinic path.',
    parameters: 'clinic · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_unavailable')",
  },
  {
    _key: 'booking-phone-click',
    eventName: 'booking_phone_click',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Phone link inside booking flow (separate from site-wide click_phone).',
    whereItFires: 'Phone links within /booking.',
    parameters: 'link_location · clinic',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_phone_click')",
  },
  {
    _key: 'booking-submitted',
    eventName: 'booking_submitted',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Booking request sent to Metodika (before confirmation).',
    whereItFires: 'Submit click / API request start.',
    parameters: 'booking_method · clinic · service_name',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_submitted')",
  },
  {
    _key: 'booking-failed',
    eventName: 'booking_failed',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Metodika booking error response.',
    whereItFires: 'Failed POST /api/booking/complete.',
    parameters: 'error_type · booking_method',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'booking_failed')",
  },
  {
    _key: 'callback-request',
    eventName: 'callback_request',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: '“Vil du at vi skal kontakte deg?” submitted successfully.',
    whereItFires: 'Contact / callback form success.',
    parameters: 'form_location (per brief)',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'callback_request')",
  },
  {
    _key: 'contact-message',
    eventName: 'contact_message',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: '“Send oss en melding” submitted successfully.',
    whereItFires: 'Contact page message form success.',
    parameters: 'form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'contact_message')",
  },
  {
    _key: 'form-start',
    eventName: 'form_start',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'First field filled in a form. Once per form, not per keystroke.',
    whereItFires: 'Forms site-wide.',
    parameters: 'form_name · form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'form_start')",
  },
  {
    _key: 'form-submit',
    eventName: 'form_submit',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Generic form submitted.',
    whereItFires: 'Forms site-wide.',
    parameters: 'form_name · form_location',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'form_submit')",
  },
  {
    _key: 'click-email',
    eventName: 'click_email',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Email link click.',
    whereItFires: 'mailto links site-wide.',
    parameters: 'link_location · email_type',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'click_email')",
  },
  {
    _key: 'specialist-view',
    eventName: 'specialist_view',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Specialist profile viewed.',
    whereItFires: '/spesialister/<navn>',
    parameters: 'specialist_name · specialty · clinic',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'specialist_view')",
  },
  {
    _key: 'insurance-provider-click',
    eventName: 'insurance_provider_click',
    priority: 'priority2',
    implementationStatus: 'pending',
    summary: 'Insurance provider link clicked.',
    whereItFires: '/forsikring',
    parameters: 'provider_name',
    verifyCommand: "window.dataLayer.filter(e => e.event === 'insurance_provider_click')",
  },
  {
    _key: 'view-search-results',
    eventName: 'view_search_results',
    priority: 'gtmOnly',
    implementationStatus: 'na',
    summary: 'GA4 enhanced measurement event — wire header search to query param; GTM picks it up.',
    whereItFires: 'Site search results (header search).',
    parameters: 'search_term (GA4 default)',
    developerNotes: 'Requires URL/query wiring in code; mapping in GTM.',
  },
]
