#!/usr/bin/env npx tsx
/**
 * Seed clinicPage.email inboxes for Contact form routing (idempotent).
 *
 * - Patches published + draft clinicPage documents
 * - Only updates when email is empty, null, or differs from the expected mapping
 * - Never overwrites a correct value
 *
 * Usage (from test/):
 *   npm run migrate:clinic-emails:dry
 *   npm run migrate:clinic-emails
 *
 * Production (Windows-safe):
 *   npm run migrate:clinic-emails:production:dry
 *   npm run migrate:clinic-emails:production
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

/** Slug → expected Contact form inbox. */
const CLINIC_EMAIL_BY_SLUG: Record<string, string> = {
  bekkestua: 'bekkestua@cmedical.no',
  majorstuen: 'majorstuen@cmedical.no',
  moelv: 'moelv@cmedical.no',
  moss: 'post@colosseumfaust.no',
}

type ClinicRow = {
  _id: string
  _type?: string
  email?: string | null
  slug?: string | null
  title?: string | null
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

function shouldPatch(current: unknown, expected: string): boolean {
  const cur = normalizeEmail(current)
  const exp = normalizeEmail(expected)
  if (!cur) return true
  return cur !== exp
}

async function run() {
  const forceDataset =
    process.env.SANITY_DATASET_FORCE?.trim() ||
    process.env.SANITY_STUDIO_FORCE_DATASET?.trim() ||
    '(none)'

  console.log('=== Clinic email migration ===')
  console.log(`  projectId: ${PROJECT_ID}`)
  console.log(`  dataset (resolved): ${DATASET}`)
  console.log(`  SANITY_DATASET_FORCE: ${forceDataset}`)
  console.log(`  ALLOW_PRODUCTION_MIGRATION: ${process.env.ALLOW_PRODUCTION_MIGRATION === 'true'}`)
  console.log(`  DRY_RUN: ${DRY_RUN}`)

  const slugs = Object.keys(CLINIC_EMAIL_BY_SLUG)
  const docs = await sanityClient.fetch<ClinicRow[]>(
    `*[_type == "clinicPage" && (
      _id in $ids ||
      slug.current in $slugs ||
      slug[language == "no"][0].value.current in $slugs ||
      slug[0].value.current in $slugs
    )]{
      _id,
      _type,
      email,
      "slug": coalesce(
        slug[language == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      ),
      "title": coalesce(
        title[language == "no"][0].value,
        title[0].value,
        title
      )
    }`,
    {
      slugs,
      ids: slugs.flatMap((slug) => [`clinicPage-${slug}`, `drafts.clinicPage-${slug}`]),
    },
  )

  if (!docs.length) {
    console.error('✗ No matching clinicPage documents found for mapped slugs.')
    process.exit(1)
  }

  console.log(`\nFound ${docs.length} clinic document(s) to inspect.`)

  let patched = 0
  let skipped = 0
  let missingSlug = 0

  for (const doc of docs) {
    const slug = (doc.slug || '').trim().toLowerCase()
    const expected = slug ? CLINIC_EMAIL_BY_SLUG[slug] : undefined

    if (!expected) {
      missingSlug++
      console.log(`⚠ ${doc._id} — slug "${doc.slug ?? '?'}" not in mapping (skipped)`)
      continue
    }

    const current = doc.email ?? null
    if (!shouldPatch(current, expected)) {
      skipped++
      console.log(
        `✓ ${doc._id} (${doc.title ?? slug}) — email already correct: ${normalizeEmail(current)}`,
      )
      continue
    }

    const reason = !normalizeEmail(current)
      ? 'empty/null'
      : `incorrect (was ${JSON.stringify(current)})`

    console.log(`→ ${doc._id} (${doc.title ?? slug}) — ${reason} → ${expected}`)

    if (DRY_RUN) {
      console.log(`  [dry-run] would set email on ${doc._id}`)
      patched++
      continue
    }

    const result = await sanityClient
      .patch(doc._id)
      .set({email: expected})
      .commit({autoGenerateArrayKeys: true})

    console.log(`  ✓ patched ${doc._id} (rev=${result._rev ?? 'n/a'})`)
    patched++
  }

  // Ensure draft exists for each published clinic we touched (Studio reads draft).
  if (!DRY_RUN && patched > 0) {
    for (const slug of slugs) {
      const publishedId = `clinicPage-${slug}`
      const draftId = `drafts.clinicPage-${slug}`
      const draftExists = await sanityClient.fetch<boolean>(
        `defined(*[_id == $id][0]._id)`,
        {id: draftId},
      )
      if (draftExists) continue

      const published = await sanityClient.fetch<Record<string, unknown> | null>(
        `*[_id == $id][0]`,
        {id: publishedId},
      )
      if (!published) continue

      await sanityClient.createOrReplace({
        ...published,
        _id: draftId,
      })
      console.log(`✓ synced ${draftId} from published`)
    }
  }

  const after = await sanityClient.fetch<ClinicRow[]>(
    `*[_type == "clinicPage" && (
      slug.current in $slugs ||
      slug[language == "no"][0].value.current in $slugs ||
      slug[0].value.current in $slugs
    )] | order(slug asc) {
      _id,
      email,
      "slug": coalesce(
        slug[language == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      ),
      "title": coalesce(
        title[language == "no"][0].value,
        title[0].value,
        title
      )
    }`,
    {slugs},
  )

  console.log('\n=== POST-MIGRATION VERIFICATION ===')
  console.log(`projectId=${PROJECT_ID} dataset=${DATASET}`)
  console.log(JSON.stringify(after, null, 2))

  let ok = true
  for (const slug of slugs) {
    const expected = CLINIC_EMAIL_BY_SLUG[slug]
    const rows = after.filter((r) => normalizeEmail(r.slug) === slug)
    if (!rows.length) {
      ok = false
      console.log(`✗ ${slug}: no document found`)
      continue
    }
    for (const row of rows) {
      const pass = normalizeEmail(row.email) === normalizeEmail(expected)
      if (!pass) ok = false
      console.log(
        `  ${pass ? '✓' : '✗'} ${row._id} (${slug}): ${JSON.stringify(row.email)} (want ${expected})`,
      )
    }
  }

  console.log(
    `\nSummary: patched/would-patch=${patched}, skipped=${skipped}, unmapped=${missingSlug}`,
  )

  if (!ok) {
    console.error('\n✗ Verification failed')
    process.exit(1)
  }

  if (DRY_RUN) {
    console.log('\n✓ Dry-run complete — no writes. Re-run without DRY_RUN to apply.')
    return
  }

  console.log('\n✓ Clinic emails populated as expected.')
  console.log(
    'Studio: Medical Content → Clinic Locations → [clinic] → General → Email',
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
