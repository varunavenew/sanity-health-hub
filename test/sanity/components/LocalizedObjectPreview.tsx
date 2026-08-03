/**
 * Studio list/array preview that follows the active Studio UI language.
 * Expects prepare() to pass through raw i18n fields as `i18nTitle` / `i18nSubtitle`.
 */
import {type PreviewProps, useCurrentLocale} from 'sanity'
import {
  resolveLocalizedPreview,
  studioLocaleToContentLang,
  truncatePreview,
} from '../../schemaTypes/i18n'

export type LocalizedObjectPreviewProps = PreviewProps & {
  i18nTitle?: unknown
  i18nSubtitle?: unknown
  i18nFallback?: string
}

export function LocalizedObjectPreview(props: LocalizedObjectPreviewProps) {
  const locale = useCurrentLocale()
  const lang = studioLocaleToContentLang(locale?.id)

  const fallback = props.i18nFallback?.trim() || 'Untitled'
  const hasRawTitle = 'i18nTitle' in props
  const hasRawSubtitle = 'i18nSubtitle' in props

  const title = hasRawTitle
    ? resolveLocalizedPreview(props.i18nTitle, lang) || fallback
    : props.title

  const subtitleRaw = hasRawSubtitle
    ? resolveLocalizedPreview(props.i18nSubtitle, lang)
    : undefined
  const subtitle = hasRawSubtitle
    ? subtitleRaw
      ? truncatePreview(subtitleRaw)
      : undefined
    : props.subtitle

  return props.renderDefault({
    ...props,
    title,
    subtitle,
  })
}
