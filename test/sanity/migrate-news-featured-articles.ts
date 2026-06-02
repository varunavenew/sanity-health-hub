#!/usr/bin/env npx tsx
import {sanityClient} from './config'

type ArticlePick = {
  _id: string
  slug?: string
  title?: string
  pinned?: boolean
  featured?: boolean
  publishedAt?: string
}

const NEWS_PAGE_IDS = ['newsPage', 'drafts.newsPage']

async function run() {
  const articles = await sanityClient.fetch<ArticlePick[]>(
    `*[_type == "article"] | order(pinned desc, publishedAt desc){
      _id,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
      "title": coalesce(title[language == "no"][0].value, title[0].value, title),
      pinned,
      featured,
      publishedAt
    }`,
  )

  if (!articles.length) {
    console.log('No article documents found. Nothing to migrate.')
    return
  }

  // Match current site behavior on Aktuelt when "featuredArticles" is empty:
  // prefer `featured == true`, otherwise fallback to first 4 sorted entries.
  const explicitlyFeatured = articles.filter((a) => Boolean(a.featured)).slice(0, 4)
  const selected = (explicitlyFeatured.length > 0 ? explicitlyFeatured : articles.slice(0, 4)).filter(
    (a) => a?._id,
  )

  if (!selected.length) {
    console.log('Could not resolve any candidate article IDs.')
    return
  }

  const featuredRefs = selected.map((a, i) => ({
    _type: 'reference',
    _ref: a._id,
    _key: `featured-${i + 1}-${a._id.replace(/\./g, '-')}`,
  }))

  for (const id of NEWS_PAGE_IDS) {
    await sanityClient.createIfNotExists({_id: id, _type: 'newsPage'})
    await sanityClient.patch(id).set({featuredArticles: featuredRefs}).commit()
  }

  console.log('✓ Updated newsPage featuredArticles with:')
  selected.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title || '(untitled)'} (${a.slug || 'no-slug'})`)
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
