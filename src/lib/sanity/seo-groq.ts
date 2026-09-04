/**
 * GROQ fragments for `seo` objects with per-locale meta fields.
 * Requires query param `$lang` (`"no"` | `"en"`).
 * Falls back to Norwegian, then legacy plain strings from older migrations.
 */
export const localizedSeoObject = `
  "seo": {
    "metaTitle": coalesce(
      seo.metaTitle[language == $lang][0].value,
      seo.metaTitle[_key == $lang][0].value,
      seo.metaTitle[language == "no"][0].value,
      seo.metaTitle[_key == "no"][0].value,
      seo.metaTitle
    ),
    "metaDescription": coalesce(
      seo.metaDescription[language == $lang][0].value,
      seo.metaDescription[_key == $lang][0].value,
      seo.metaDescription[language == "no"][0].value,
      seo.metaDescription[_key == "no"][0].value,
      seo.metaDescription
    ),
    "ogImage": seo.ogImage,
    "ogImageAlt": coalesce(
      seo.ogImageAlt[language == $lang][0].value,
      seo.ogImageAlt[_key == $lang][0].value,
      seo.ogImageAlt[language == "no"][0].value,
      seo.ogImageAlt[_key == "no"][0].value,
      seo.ogImageAlt
    ),
    "useCustomOgImage": seo.useCustomOgImage,
    "noIndex": seo.noIndex
  }
`;

/**
 * Active locale only — no cross-language SEO fallback (treatment/category pages).
 */
export const localizedSeoObjectLocale = `
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
    "ogImageAlt": coalesce(
      seo.ogImageAlt[language == $lang][0].value,
      seo.ogImageAlt[_key == $lang][0].value,
      seo.ogImageAlt[language == "no"][0].value,
      seo.ogImageAlt[_key == "no"][0].value,
      seo.ogImageAlt
    ),
    "useCustomOgImage": seo.useCustomOgImage,
    "noIndex": seo.noIndex
  }
`;
