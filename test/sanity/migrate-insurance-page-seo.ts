#!/usr/bin/env npx tsx
/**
 * Seed insurancePage SEO (NO + EN). Does not create empty drafts.
 *
 * Usage (from test/):
 *   npm run migrate:insurance-page-seo:dry
 *   npm run migrate:insurance-page-seo
 */
import { sanityClient } from './config'
import { DEFAULT_INSURANCE_SEO } from './lib/insurance-page-defaults'
import { patchSingletonFields } from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

async function run() {
  const published = await sanityClient.fetch<{ seo?: unknown } | null>(
    `*[_id == "insurancePage"][0]{ seo }`,
  )

  if (!FORCE && published?.seo) {
    console.log('– Skipped (seo already set on published; use FORCE=1 to overwrite)')
    return
  }

  if (DRY_RUN) {
    console.log('DRY — would set seo on insurancePage (published + draft, no empty draft)')
    return
  }

  const patched = await patchSingletonFields(
    'insurancePage',
    { seo: DEFAULT_INSURANCE_SEO },
    'insurancePage',
  )
  console.log(`✓ insurancePage seo — ${patched.join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
