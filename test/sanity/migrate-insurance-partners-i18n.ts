#!/usr/bin/env npx tsx
import {sanityClient} from './config'

type InsurancePageDoc = {
  _id: string
  partners?: string[]
}

const PAGES = ['insurancePage', 'drafts.insurancePage']

const toI18nString = (no: string, en: string) => [
  {_type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no},
  {_type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en},
]

const EN_NAME_MAP: Record<string, string> = {
  EuroAccident: 'EuroAccident',
  Falck: 'Falck',
  Fremtind: 'Fremtind Insurance',
  Gjensidige: 'Gjensidige Insurance',
  If: 'If Insurance',
  Storebrand: 'Storebrand Insurance',
  Tryg: 'Tryg Insurance',
}

async function run() {
  const existing = await sanityClient.fetch<InsurancePageDoc>(
    `*[_id in ["insurancePage", "drafts.insurancePage"]][0]{_id, partners}`,
  )

  const partners =
    existing?.partners && existing.partners.length > 0
      ? existing.partners
      : ['EuroAccident', 'Falck', 'Fremtind', 'Gjensidige', 'If', 'Storebrand', 'Tryg']

  const partnersLocalized = partners.map((partner, index) => ({
    _type: 'object',
    _key: `partner-${index + 1}`,
    name: toI18nString(partner, EN_NAME_MAP[partner] || partner),
  }))

  for (const id of PAGES) {
    await sanityClient.createIfNotExists({_id: id, _type: 'insurancePage'})
    await sanityClient.patch(id).set({partnersLocalized}).commit()
  }

  console.log('✓ insurancePage partnersLocalized updated (published + draft)')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
