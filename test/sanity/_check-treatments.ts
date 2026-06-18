import { sanityClient } from './config'

async function main() {
  const ern = await sanityClient.fetch(
    `*[_type == "treatment" && (
      slug[language == "no"][0].value.current == "ernaringsfysiolog" ||
      slug[_key == "no"][0].value.current == "ernaringsfysiolog" ||
      slug[0].value.current == "ernaringsfysiolog"
    )]{ _id, "slugNb": slug[language == "no"][0].value.current, "slugEn": slug[language == "en"][0].value.current, "cat": category->categoryId }`,
  )
  console.log('ernaringsfysiolog:', JSON.stringify(ern, null, 2))

  const flere = await sanityClient.fetch(
    `*[_type == "treatment" && category->categoryId == "flere-fagomrader"]{ _id, "slugNb": slug[language == "no"][0].value.current, title } | order(slugNb asc)`,
  )
  console.log(`flere-fagomrader treatments (${flere.length}):`, flere.map((t: { slugNb?: string }) => t.slugNb).join(', '))

  const missingSlug = await sanityClient.fetch<number>(
    `count(*[_type == "treatment" && !defined(slug[0].value.current) && !defined(slug.current)])`,
  )
  console.log('treatments missing slug:', missingSlug)
  const cats = await sanityClient.fetch(
    `*[_type == "treatmentCategory"]{ categoryId, "slugNb": slug[language == "no"][0].value.current, "slugEn": slug[language == "en"][0].value.current }`,
  )
  console.log('categories:', JSON.stringify(cats, null, 2))

  const noSlugTreatments = await sanityClient.fetch(
    `*[_type == "treatment" && !coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current)]{ _id, title }`,
  )
  console.log('no slug:', noSlugTreatments)
}

main().catch(console.error)
