import { Iframe, type IframeProps } from 'sanity-plugin-iframe-pane'
import { buildPreviewUrl, type PreviewLocale, type SanityPreviewDoc } from '../previewUrls'

type LocalePreviewOptions = {
  locale: PreviewLocale
  schemaType: string
}

/** Separate component per locale so Studio remounts the iframe when switching View tabs. */
export function createLocalePreviewPane({ locale, schemaType }: LocalePreviewOptions) {
  function LocalePreviewPane(props: IframeProps) {
    return (
      <Iframe
        key={`preview-iframe-${schemaType}-${locale}`}
        document={props.document}
        options={{
          key: `preview-${schemaType}-${locale}`,
          url: (doc) =>
            buildPreviewUrl(schemaType, (doc as SanityPreviewDoc | undefined) ?? undefined, locale),
          reload: { button: true },
        }}
      />
    )
  }

  LocalePreviewPane.displayName = locale === 'no' ? 'LocalePreviewNo' : 'LocalePreviewEn'
  return LocalePreviewPane
}
