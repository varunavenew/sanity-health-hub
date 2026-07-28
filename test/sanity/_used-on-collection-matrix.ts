import {writeFileSync} from 'fs'
import path from 'path'
import {sanityClient as client, DATASET} from './config'

async function main() {
  const collections = await client.fetch<
    Array<{_id: string; _type: string; internalName?: string; title?: string}>
  >(
    `*[
      _type in ["ctaCollection", "insuranceCollection"]
      && (_id match "migrated-cta*" || _id match "migrated-insurance*")
    ]{
      _id,
      _type,
      internalName,
      title
    } | order(_type asc, internalName asc)`,
  )

  const rows = []
  for (const col of collections) {
    const referrers = await client.fetch<Array<{_id: string; _type: string}>>(
      `*[ !(_id in path("drafts.**")) && references($id) ]{ _id, _type } | order(_type asc)`,
      {id: col._id},
    )
    const byType = referrers.reduce(
      (acc, r) => {
        acc[r._type] = (acc[r._type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const onlyCategories =
      Object.keys(byType).length === 1 && Boolean(byType.treatmentCategory)
    const onlyTreatments =
      Object.keys(byType).length === 1 && Boolean(byType.treatment)
    const mixed = Object.keys(byType).length > 1

    rows.push({
      _id: col._id,
      _type: col._type,
      internalName: col.internalName,
      totalReferrers: referrers.length,
      byType,
      usedOnUiExpectation: onlyCategories
        ? 'Used On shows ONLY "Treatment category" group — EXPECTED'
        : onlyTreatments
          ? 'Used On shows ONLY "Treatment" group — EXPECTED'
          : mixed
            ? 'Used On shows multiple type groups'
            : referrers.length === 0
              ? 'Used On empty'
              : `Used On shows: ${Object.keys(byType).join(', ')}`,
      sampleReferrerIds: referrers.slice(0, 3).map((r) => r._id),
    })
  }

  const categoriesOnly = rows.filter((r) =>
    Object.keys(r.byType).length === 1 && r.byType.treatmentCategory,
  )

  const out = {
    dataset: DATASET,
    verifiedAt: new Date().toISOString(),
    schemaTypeTitles: {
      treatmentCategory: 'Treatment category (Studio group label for Used On)',
      treatment: 'Treatment (Studio group label for Used On)',
    },
    collectionsOnlyShowingCategoriesInUsedOn: categoriesOnly,
    allCollections: rows,
  }

  const jsonPath = path.join(process.cwd(), '..', 'docs', '_used-on-collection-matrix.json')
  writeFileSync(jsonPath, JSON.stringify(out, null, 2), 'utf8')
  console.log(JSON.stringify(out, null, 2))
}

main().catch(console.error)
