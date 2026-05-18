/**
 * GROQ fragments for `seo` objects with per-locale meta fields.
 * Requires query param `$lang` (`"no"` | `"en"`). Does not fall back to other locales.
 */
export const localizedSeoObject = `
  "seo": {
    "metaTitle": coalesce(
      seo.metaTitle[language == $lang][0].value,
      seo.metaTitle[_key == $lang][0].value
    ),
    "metaDescription": coalesce(
      seo.metaDescription[language == $lang][0].value,
      seo.metaDescription[_key == $lang][0].value
    ),
    "ogImage": seo.ogImage,
    "noIndex": seo.noIndex
  }
`;
