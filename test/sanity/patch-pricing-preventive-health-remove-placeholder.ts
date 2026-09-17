#!/usr/bin/env npx tsx
/**
 * Strip the leaked internal word "placeholder" / "plassholder" from the 3
 * "Preventive health" / "Forebyggende helse" pricing line items (Health check,
 * Blood test package, Lifestyle and risk assessment). Price stays unset
 * (price: null / priceLabel: "") — only wording changes, sentence structure
 * otherwise unchanged.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/patch-pricing-preventive-health-remove-placeholder.ts
 *   npx tsx sanity/patch-pricing-preventive-health-remove-placeholder.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/patch-pricing-preventive-health-remove-placeholder.ts
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')

type I18nVal = {_key?: string; _type?: string; language?: string; value?: string}

/** _key → new NO/EN text, stripping "placeholder"/"plassholder" only. */
const NAME_FIXES: Record<string, {no: string; en: string}> = {
  'cb02866f269e': {
    no: 'Helsesjekk (pris kommer)',
    en: 'Health check (price to follow). Final price to be provided by the client. Contact us',
  },
  '0442abb63f14': {
    no: 'Blodprøvepakke (pris kommer)',
    en: 'Blood test package (price to follow). Final price to be provided by the client. Contact us',
  },
  'a2763e197de5': {
    no: 'Livsstils- og risikovurdering (pris kommer)',
    en: 'Lifestyle and risk assessment (price to follow). Final price to be provided by the client. Contact us',
  },
}

const NOTE_FIX = {no: 'Endelig pris leveres av kunden.', en: 'Endelig pris leveres av kunden.'}

function setLang(arr: I18nVal[] | undefined, lang: 'no' | 'en', value: string): I18nVal[] {
  const base = Array.isArray(arr) ? [...arr] : []
  const idx = base.findIndex((x) => x.language === lang || x._key === lang)
  const row: I18nVal = {_type: 'internationalizedArrayStringValue', _key: lang, language: lang, value}
  if (idx >= 0) base[idx] = {...base[idx], ...row}
  else base.push(row)
  return base
}

async function main() {
  console.log(`\n[patch-pricing-preventive-health] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`)

  const page = await sanityClient.fetch<{_id: string; priceCategories: any[]}>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{_id, priceCategories}`,
  )
  if (!page?._id) throw new Error('pricingPage missing')

  let changed = 0
  const nextCats = (page.priceCategories || []).map((cat: any) => ({
    ...cat,
    subcategories: (cat.subcategories || []).map((sub: any) => ({
      ...sub,
      items: (sub.items || []).map((item: any) => {
        const fix = NAME_FIXES[item._key]
        if (!fix) return item
        changed += 1
        console.log(`  ~ ${item._key}: "${item.name?.find((x: I18nVal) => x.language === 'no')?.value}" → "${fix.no}"`)
        return {
          ...item,
          name: setLang(setLang(item.name, 'no', fix.no), 'en', fix.en),
          note: setLang(setLang(item.note, 'no', NOTE_FIX.no), 'en', NOTE_FIX.en),
        }
      }),
    })),
  }))

  console.log(`\n${changed} item(s) to update.`)

  if (DRY_RUN) {
    console.log('\n(dry run — no writes). Re-run without DRY_RUN to apply.\n')
    return
  }
  if (changed === 0) {
    console.log('\nNothing to patch.\n')
    return
  }

  await sanityClient.patch(page._id).set({priceCategories: nextCats}).commit()
  console.log(`\nDone. Patched ${page._id}.\n`)
}

main().catch((err) => {
  console.error('❌ Patch failed:', err)
  process.exit(1)
})
