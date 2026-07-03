#!/usr/bin/env npx tsx
/**
 * Ensures `siteSettings.mainNavigation` includes Klinikker (clinics).
 * Run: npm run migrate:site-settings-nav-clinics --prefix test
 */
import { sanityClient } from './config'

const SETTINGS_ID = 'siteSettings'

function i18nString(no: string, en: string) {
  return [
    { _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no },
    { _type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en },
  ]
}

const clinicsNavItem = {
  _key: 'nav-klinikker',
  _type: 'navItem',
  navId: 'clinics',
  label: i18nString('Klinikker', 'Clinics'),
  path: i18nString('/klinikker', '/clinics'),
  isServicesDropdown: false,
}

async function run() {
  const settings = await sanityClient.fetch<{
    mainNavigation?: Array<{ _key?: string; navId?: string }>
  }>(`*[_id == $id][0]{ mainNavigation }`, { id: SETTINGS_ID })

  if (!settings) {
    console.error('siteSettings document not found')
    process.exit(1)
  }

  const nav = settings.mainNavigation ?? []
  const hasClinics = nav.some((item) => item.navId === 'clinics')

  if (hasClinics) {
    console.log('mainNavigation already includes Klinikker — no changes needed')
    return
  }

  const contactIndex = nav.findIndex((item) => item.navId === 'contact')
  const nextNav =
    contactIndex >= 0
      ? [...nav.slice(0, contactIndex), clinicsNavItem, ...nav.slice(contactIndex)]
      : [...nav, clinicsNavItem]

  await sanityClient.patch(SETTINGS_ID).set({ mainNavigation: nextNav }).commit()

  console.log('Added Klinikker to siteSettings.mainNavigation')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
