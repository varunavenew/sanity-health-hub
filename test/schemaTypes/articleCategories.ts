/**
 * Canonical article.category values — same strings the frontend displays.
 * Keep titles identical to stored values so Studio matches Aktuelt chips.
 */
export const ARTICLE_CATEGORY_OPTIONS = [
  {title: 'Pasienthistorier', value: 'Pasienthistorier'},
  {title: 'Oss i media', value: 'Oss i media'},
  {title: 'Fagartikler', value: 'Fagartikler'},
  {title: 'Nytt fra oss', value: 'Nytt fra oss'},
] as const

export type ArticleCategoryValue =
  (typeof ARTICLE_CATEGORY_OPTIONS)[number]['value']
