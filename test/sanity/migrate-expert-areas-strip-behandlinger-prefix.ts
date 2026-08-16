#!/usr/bin/env npx tsx
/**
 * Strip the legacy "/behandlinger" prefix from treatmentCategory
 * landingPage.expertAreasSection.areas[].href values.
 *
 * The router already treats "/behandlinger/{rest}" as a legacy alias that
 * resolves "{rest}" directly (src/lib/routing/resolve-route.ts), so the
 * canonical href is "{rest}" without the prefix.
 *
 * Usage (from test/):
 *   npm run migrate:expert-areas-prefix:dry
 *   npm run migrate:expert-areas-prefix
 *
 * Production (Windows-safe):
 *   npm run migrate:expert-areas-prefix:production:dry
 *   npm run migrate:expert-areas-prefix:production
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const PREFIX_RE = /^\/behandlinger(\/|$)/

type Area = {_key: string; href?: string | null}
type CategoryRow = {
  _id: string
  title?: unknown
  areas: Area[] | null
}

function stripPrefix(href: string): string {
  return href.replace(PREFIX_RE, '/')
}

async function run() {
  console.log('=== Expert areas href prefix migration ===')
  console.log(`  projectId: ${PROJECT_ID}`)
  console.log(`  dataset (resolved): ${DATASET}`)
  console.log(`  DRY_RUN: ${DRY_RUN}`)

  const docs = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && defined(landingPage.expertAreasSection.areas)]{
      _id,
      title,
      "areas": landingPage.expertAreasSection.areas[]{_key, href}
    }`,
  )

  console.log(`\nFound ${docs.length} treatmentCategory document(s) with expert area cards.`)

  let patchedDocs = 0
  let patchedFields = 0
  let skippedDocs = 0

  for (const doc of docs) {
    const areas = doc.areas ?? []
    const changes = areas
      .filter((area) => typeof area.href === 'string' && PREFIX_RE.test(area.href))
      .map((area) => ({
        _key: area._key,
        from: area.href as string,
        to: stripPrefix(area.href as string),
      }))

    if (!changes.length) {
      skippedDocs++
      console.log(`✓ ${doc._id} — no "/behandlinger" prefixed hrefs, skipping`)
      continue
    }

    console.log(`→ ${doc._id} — ${changes.length} href(s) to fix:`)
    for (const change of changes) {
      console.log(`    [${change._key}] ${change.from}  →  ${change.to}`)
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] would patch ${doc._id}`)
      patchedDocs++
      patchedFields += changes.length
      continue
    }

    let patch = sanityClient.patch(doc._id)
    for (const change of changes) {
      patch = patch.set({
        [`landingPage.expertAreasSection.areas[_key=="${change._key}"].href`]: change.to,
      })
    }
    await patch.commit()

    patchedDocs++
    patchedFields += changes.length
    console.log(`  ✔ patched ${doc._id}`)
  }

  console.log('\n=== Summary ===')
  console.log(`  Documents patched: ${patchedDocs}`)
  console.log(`  Hrefs fixed:       ${patchedFields}`)
  console.log(`  Documents skipped: ${skippedDocs}`)
  if (DRY_RUN) console.log('\n(dry run — no writes were made)')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
