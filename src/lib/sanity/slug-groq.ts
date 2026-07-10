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
