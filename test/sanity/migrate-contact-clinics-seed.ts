#!/usr/bin/env npx tsx
/**
 * Seed contactPage.clinicsSection.clinics with all published clinicPage refs
 * when the array is empty — so Studio matches what the website shows.
 *
 * - Does NOT overwrite a non-empty curated list
 * - Does NOT create duplicate refs
 * - Order matches frontend useClinics() (listingSortSettings.clinicsSort + sortOrder)
 * - Contact page only — does not touch aboutPage or other documents
 * - No frontend changes
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/migrate-contact-clinics-seed.ts
 *   npx tsx sanity/migrate-contact-clinics-seed.ts
 */
import {createHash} from 'crypto'
import {sanityClient} from './config'
import {singletonDocumentIds} from './lib/patch-singleton'
import {applyListingSort} from '../../src/lib/sanity/sort-utils'

const DRY_RUN = process.env.DRY_RUN === '1'
const CONTACT_ID = 'contactPage'

type ClinicRow = {
  _id: string
  _createdAt?: string
  sortOrder?: number | null
  address?: string | null
  label?: string | null
}

function refKey(clinicId: string): string {
  return createHash('sha1').update(`contact-clinic-${clinicId}`).digest('hex').slice(0, 12)
}

function toReferences(clinics: ClinicRow[]) {
  const seen = new Set<string>()
  const refs: Array<{_type: 'reference'; _ref: string; _key: string}> = []
  for (const clinic of clinics) {
    if (!clinic._id || seen.has(clinic._id)) continue
    seen.add(clinic._id)
    refs.push({
      _type: 'reference',
      _ref: clinic._id,
      _key: refKey(clinic._id),
    })
  }
  return refs
}

async function fetchOrderedPublishedClinics(): Promise<ClinicRow[]> {
  const [rawClinics, sortSettings] = await Promise.all([
    sanityClient.fetch<ClinicRow[]>(
      `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
        _id,
        _createdAt,
        sortOrder,
        address,
        "label": coalesce(
          title[language == "no"][0].value,
          title[_key == "no"][0].value,
          title[language == "en"][0].value,
          title[_key == "en"][0].value,
          title
        )
      }`,
    ),
    sanityClient.fetch<{clinicsSort?: string} | null>(
      `*[_type == "listingSortSettings" && !(_id in path("drafts.**"))][0]{ clinicsSort }`,
    ),
  ])

  // Mirror useClinics(): require label + address, then apply listing sort (no locale).
  const usable = (rawClinics || []).filter(
    (c) => Boolean(c._id) && Boolean(c.label?.trim()) && Boolean(c.address?.trim()),
  )

  return applyListingSort(
    usable,
    sortSettings?.clinicsSort,
    'no',
    (c) => c.label,
    (c) => c.sortOrder,
    (c) => c._createdAt,
  )
}

async function run() {
  console.log(`Seed contactPage clinicsSection.clinics (DRY_RUN=${DRY_RUN ? '1' : '0'})`)

  const ordered = await fetchOrderedPublishedClinics()
  if (!ordered.length) {
    console.error('✗ No published clinicPage documents with label+address — nothing to seed')
    process.exit(1)
  }

  const refs = toReferences(ordered)
  console.log(`Published clinics to seed (${refs.length}):`)
  for (const c of ordered) {
    console.log(`  - ${c.label} (${c._id}) sortOrder=${c.sortOrder ?? '—'}`)
  }

  const ids = singletonDocumentIds(CONTACT_ID)
  const docs = await sanityClient.fetch<
    Array<{
      _id: string
      clinicsSection?: {
        showSection?: boolean
        title?: unknown
        clinics?: unknown[]
      } | null
    }>
  >(`*[_id in $ids]{ _id, clinicsSection }`, {ids})

  if (!docs.length) {
    console.error(`✗ Missing ${CONTACT_ID}`)
    process.exit(1)
  }

  for (const doc of docs) {
    const existing = Array.isArray(doc.clinicsSection?.clinics)
      ? doc.clinicsSection!.clinics!
      : []

    if (existing.length > 0) {
      console.log(`✓ ${doc._id} — clinics already curated (${existing.length} items); skipping`)
      continue
    }

    const nextSection = {
      ...(doc.clinicsSection && typeof doc.clinicsSection === 'object' ? doc.clinicsSection : {}),
      showSection: doc.clinicsSection?.showSection !== false,
      clinics: refs,
    }

    console.log(`→ ${doc._id}: set clinicsSection.clinics → ${refs.length} references`)
    if (DRY_RUN) continue

    await sanityClient
      .patch(doc._id)
      .set({clinicsSection: nextSection})
      .commit({autoGenerateArrayKeys: true})
    console.log(`✓ patched ${doc._id}`)
  }

  // Ensure draft exists so Studio editors see the seeded list immediately
  if (!DRY_RUN) {
    const published = await sanityClient.fetch<Record<string, unknown> | null>(
      `*[_id == $id][0]`,
      {id: CONTACT_ID},
    )
    const draftId = `drafts.${CONTACT_ID}`
    const draftExists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, {
      id: draftId,
    })
    if (published && !draftExists) {
      await sanityClient.createOrReplace({...published, _id: draftId})
      console.log(`✓ synced ${draftId} from published`)
    }
  }

  const verify = await sanityClient.fetch(
    `*[_id in $ids]{
      _id,
      "clinicCount": count(clinicsSection.clinics),
      "clinicTitles": clinicsSection.clinics[]->{
        "title": coalesce(
          title[language == "no"][0].value,
          title[_key == "no"][0].value,
          title
        )
      }.title
    }`,
    {ids},
  )
  console.log('\nVerification:', JSON.stringify(verify, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
