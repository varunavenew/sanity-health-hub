/**
 * GROQ fragments for localized URL slugs (`internationalizedArraySlug`).
 * Supports legacy `slug.current` until migration completes.
 * Requires query param `$lang` (`"no"` | `"en"`) where noted.
 */

/** Project slug as a string for the active locale (with NO + legacy fallbacks). */
export const localizedSlug = `"slug": coalesce(
  slug[language == $lang][0].value.current,
  slug[_key == $lang][0].value.current,
  slug[language == "no"][0].value.current,
  slug[_key == "no"][0].value.current,
  slug[0].value.current,
  slug.current
)`;

/**
 * Sort key for localized slug. Requires GROQ param `$lang` (`"no"` | `"en"`).
 * Falls back to Norwegian, then legacy `slug.current`.
 */
export const orderSlugAsc = `coalesce(
  slug[language == $lang][0].value.current,
  slug[_key == $lang][0].value.current,
  slug[language == "no"][0].value.current,
  slug[_key == "no"][0].value.current,
  slug[0].value.current,
  slug.current
) asc`;

function slugMatchExpr(slugPath: string, paramName: string): string {
  return `(
    ${slugPath}.current == $${paramName}
    || defined(${slugPath}[value.current == $${paramName}][0])
    || ${slugPath}[language == $lang][0].value.current == $${paramName}
    || ${slugPath}[_key == $lang][0].value.current == $${paramName}
    || ${slugPath}[language == "no"][0].value.current == $${paramName}
    || ${slugPath}[_key == "no"][0].value.current == $${paramName}
    || ${slugPath}[language == "en"][0].value.current == $${paramName}
    || ${slugPath}[_key == "en"][0].value.current == $${paramName}
    || ${slugPath}[0].value.current == $${paramName}
  )`;
}

/** Match slug param on the document root `slug` field. */
export function slugMatchesParam(paramName: string): string {
  return slugMatchExpr("slug", paramName);
}

/** Match slug param on a reference path (e.g. `category->slug`). */
export function slugMatchesRefParam(refPath: string, paramName: string): string {
  return slugMatchExpr(`${refPath}->slug`, paramName);
}

/**
 * Dual-read: treatment belongs to category via `categories[]` or legacy `category`.
 * Matches category slug or categoryId against `$paramName`.
 */
export function treatmentBelongsToCategoryParam(paramName: string): string {
  return `(
    ${slugMatchesRefParam("category", paramName)}
    || category->categoryId == $${paramName}
    || count(categories[
      ${slugMatchExpr("@->slug", paramName)}
      || @->categoryId == $${paramName}
    ]) > 0
  )`;
}

/** Primary category ref: prefer categories[0], else legacy category. */
export const primaryCategoryRef = `coalesce(categories[0], category)`;

/** Project a referenced document's slug under a custom result key. */
export const localizedRefSlugField = (refPath: string, asName = "slug") =>
  `"${asName}": coalesce(
    ${refPath}->slug[language == $lang][0].value.current,
    ${refPath}->slug[_key == $lang][0].value.current,
    ${refPath}->slug[language == "no"][0].value.current,
    ${refPath}->slug[_key == "no"][0].value.current,
    ${refPath}->slug[0].value.current,
    ${refPath}->slug.current
  )`;

/** Dual-read primary category slug (categories[0] → legacy category). */
export const localizedPrimaryCategorySlugField = (asName = "slug") =>
  `"${asName}": coalesce(
    categories[0]->slug[language == $lang][0].value.current,
    categories[0]->slug[_key == $lang][0].value.current,
    categories[0]->slug[language == "no"][0].value.current,
    categories[0]->slug[_key == "no"][0].value.current,
    categories[0]->slug[0].value.current,
    categories[0]->slug.current,
    category->slug[language == $lang][0].value.current,
    category->slug[_key == $lang][0].value.current,
    category->slug[language == "no"][0].value.current,
    category->slug[_key == "no"][0].value.current,
    category->slug[0].value.current,
    category->slug.current
  )`;

/** Active locale only — used on treatment detail pages to avoid NO slug on EN. */
export const localizedPrimaryCategorySlugFieldLocale = (asName = "slug") =>
  `"${asName}": coalesce(
    categories[0]->slug[language == $lang][0].value.current,
    categories[0]->slug[_key == $lang][0].value.current,
    category->slug[language == $lang][0].value.current,
    category->slug[_key == $lang][0].value.current
  )`;
