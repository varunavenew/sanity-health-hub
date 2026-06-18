#!/usr/bin/env npx tsx
import { sanityClient } from './config'
import { buildPartnersLocalized, INSURANCE_PARTNERS } from './lib/insurance-page-defaults'
import { patchSingletonFields } from './lib/patch-singleton'

async function run() {
  const existing = await sanityClient.fetch<{ partners?: string[] } | null>(
    `*[_id == "insurancePage"][0]{ partners }`,
  )

  const partners =
    existing?.partners && existing.partners.length > 0
      ? existing.partners
      : [...INSURANCE_PARTNERS]

  const patched = await patchSingletonFields(
    'insurancePage',
    { partners, partnersLocalized: buildPartnersLocalized(partners) },
    'insurancePage',
  )

  console.log(`✓ insurancePage partnersLocalized — ${patched.join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
