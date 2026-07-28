#!/usr/bin/env npx tsx
/**
 * Developer-only: repair newsPage.filters so Studio + Aktuelt chips match
 * the intended five chips (All, Patient Stories, Media, Professional Articles,
 * News from us). Does not touch production.
 *
 *   cd test && npx tsx sanity/seed-news-page-filters-developer.ts
 */
import {randomBytes} from 'crypto'
import {DATASET, sanityClient} from './config'
import {i18nString} from './lib/category-landing-i18n'
import {expandBusinessCategoriesToStored} from '../schemaTypes/newsFilterCategories'

function key(): string {
  return randomBytes(6).toString('hex')
}

const FILTERS = [
  {
    _key: key(),
    _type: 'newsFilter',
    key: 'all',
    label: i18nString('Alle', 'All'),
    acceptedArticleCategories: [] as string[],
  },
  {
    _key: key(),
    _type: 'newsFilter',
    key: 'patientStories',
    label: i18nString('Pasienthistorier', 'Patient Stories'),
    acceptedArticleCategories: expandBusinessCategoriesToStored(['patientStories']),
  },
  {
    _key: key(),
    _type: 'newsFilter',
    key: 'media',
    label: i18nString('Oss i media', 'Media'),
    acceptedArticleCategories: expandBusinessCategoriesToStored(['media']),
  },
  {
    _key: key(),
    _type: 'newsFilter',
    key: 'professional',
    label: i18nString('Fagartikler', 'Professional Articles'),
    acceptedArticleCategories: expandBusinessCategoriesToStored(['professional']),
  },
  {
    _key: key(),
    _type: 'newsFilter',
    key: 'newsFromUs',
    label: i18nString('Nytt fra oss', 'News from us'),
    acceptedArticleCategories: expandBusinessCategoriesToStored(['newsFromUs']),
  },
]

async function main() {
  if (DATASET !== 'developer') {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`)
  }

  const ids = ['newsPage', 'drafts.newsPage']
  for (const id of ids) {
    const existing = await sanityClient.fetch(`*[_id == $id][0]{_id}`, {id})
    if (!existing) {
      console.log(`⏭ Skip missing ${id}`)
      continue
    }
    await sanityClient.patch(id).set({filters: FILTERS}).commit()
    console.log(`✓ Patched filters on ${id}`)
  }
  console.log('\nDone. Production untouched.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
