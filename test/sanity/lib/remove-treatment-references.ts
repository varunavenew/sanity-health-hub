import type {SanityClient} from '@sanity/client'

type RefRow = {_key?: string; _ref?: string}

export type RemoveTreatmentReferencesResult = {
  categories: number
  relatedSections: number
  clinics: number
  specialists: number
  pricingLines: number
}

function normalizeTreatmentId(id: string): string {
  return id.replace(/^drafts\./, '')
}

function matchesTreatmentRef(ref: string | undefined, publishedId: string): boolean {
  if (!ref) return false
  const base = normalizeTreatmentId(publishedId)
  return ref === publishedId || ref === base || ref === `drafts.${base}`
}

type ReferenceSnapshot = {
  categories: Array<{_id: string; treatments?: RefRow[]}>
  relatedParents: Array<{_id: string; items?: RefRow[]}>
  clinics: Array<{_id: string; treatments?: RefRow[]}>
  specialists: Array<{_id: string; treatments?: RefRow[]}>
  pricingPages: Array<{
    _id: string
    priceCategories?: Array<{
      _key?: string
      subcategories?: Array<{_key?: string; treatmentRef?: string}>
    }>
  }>
}

const REFERENCE_SNAPSHOT_QUERY = `{
  "categories": *[_type == "treatmentCategory" && references($id)]{
    _id,
    treatments[]{_key, _ref}
  },
  "relatedParents": *[
    _type == "treatment" &&
    _id != $id &&
    _id != $draftId &&
    references($id)
  ]{
    _id,
    "items": relatedSection.items[]{_key, _ref}
  },
  "clinics": *[_type == "clinicPage" && references($id)]{
    _id,
    treatments[]{_key, _ref}
  },
  "specialists": *[_type == "specialist" && references($id)]{
    _id,
    treatments[]{_key, _ref}
  },
  "pricingPages": *[_type == "pricingPage" && references($id)]{
    _id,
    priceCategories[]{
      _key,
      subcategories[]{
        _key,
        "treatmentRef": treatment._ref
      }
    }
  }
}`

async function unsetArrayRefs(
  client: SanityClient,
  docId: string,
  arrayField: string,
  rows: RefRow[] | undefined,
  treatmentId: string,
): Promise<number> {
  const keys = (rows || [])
    .filter((row) => matchesTreatmentRef(row._ref, treatmentId))
    .map((row) => row._key)
    .filter(Boolean) as string[]

  if (!keys.length) return 0

  let patch = client.patch(docId)
  for (const key of keys) {
    patch = patch.unset([`${arrayField}[_key=="${key}"]`])
  }
  await patch.commit()
  return keys.length
}

/**
 * Remove published treatment refs from category lists, related sections,
 * clinic/specialist arrays, and pricing subcategories so hide/unpublish succeeds.
 */
export async function removeTreatmentReferences(
  client: SanityClient,
  treatmentId: string,
): Promise<RemoveTreatmentReferencesResult> {
  const publishedId = normalizeTreatmentId(treatmentId)
  const draftId = `drafts.${publishedId}`

  const snapshot = await client.fetch<ReferenceSnapshot>(REFERENCE_SNAPSHOT_QUERY, {
    id: publishedId,
    draftId,
  })

  const result: RemoveTreatmentReferencesResult = {
    categories: 0,
    relatedSections: 0,
    clinics: 0,
    specialists: 0,
    pricingLines: 0,
  }

  for (const category of snapshot.categories || []) {
    result.categories += await unsetArrayRefs(
      client,
      category._id,
      'treatments',
      category.treatments,
      publishedId,
    )
  }

  for (const parent of snapshot.relatedParents || []) {
    result.relatedSections += await unsetArrayRefs(
      client,
      parent._id,
      'relatedSection.items',
      parent.items,
      publishedId,
    )
  }

  for (const clinic of snapshot.clinics || []) {
    result.clinics += await unsetArrayRefs(
      client,
      clinic._id,
      'treatments',
      clinic.treatments,
      publishedId,
    )
  }

  for (const specialist of snapshot.specialists || []) {
    result.specialists += await unsetArrayRefs(
      client,
      specialist._id,
      'treatments',
      specialist.treatments,
      publishedId,
    )
  }

  for (const page of snapshot.pricingPages || []) {
    let patch = client.patch(page._id)
    let touched = 0

    for (const category of page.priceCategories || []) {
      const catKey = category._key
      if (!catKey) continue

      for (const sub of category.subcategories || []) {
        const subKey = sub._key
        if (!subKey) continue
        if (!matchesTreatmentRef(sub.treatmentRef, publishedId)) continue

        patch = patch.unset([
          `priceCategories[_key=="${catKey}"].subcategories[_key=="${subKey}"].treatment`,
        ])
        touched += 1
      }
    }

    if (touched > 0) {
      await patch.commit()
      result.pricingLines += touched
    }
  }

  return result
}

export function summarizeReferenceCleanup(result: RemoveTreatmentReferencesResult): string {
  const parts: string[] = []
  if (result.categories) parts.push(`${result.categories} category list(s)`)
  if (result.relatedSections) parts.push(`${result.relatedSections} related section(s)`)
  if (result.clinics) parts.push(`${result.clinics} clinic list(s)`)
  if (result.specialists) parts.push(`${result.specialists} specialist list(s)`)
  if (result.pricingLines) parts.push(`${result.pricingLines} pricing link(s)`)
  return parts.length ? parts.join(', ') : 'no listing references'
}
