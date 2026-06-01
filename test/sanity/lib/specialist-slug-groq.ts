/** GROQ projection for specialist slug (internationalizedArraySlug + legacy). */
export const specialistSlugProjection = `"slug": coalesce(
  slug[language == "no"][0].value.current,
  slug[_key == "no"][0].value.current,
  slug[0].value.current,
  slug.current
)`

export const SPECIALISTS_WITH_SLUG_QUERY = `*[_type == "specialist"]{
  _id,
  name,
  ${specialistSlugProjection},
  bookingCategoryIds,
  categories
}`

/** Derive slug from _id (specialist-alenka-bindas) when projection is empty. */
export function slugFromSpecialistDoc(doc: {
  _id: string
  slug?: string
  name?: string
}): string | undefined {
  const fromField = typeof doc.slug === 'string' ? doc.slug.trim() : ''
  if (fromField) return fromField

  if (doc._id.startsWith('specialist-')) {
    return doc._id.slice('specialist-'.length)
  }

  return undefined
}
