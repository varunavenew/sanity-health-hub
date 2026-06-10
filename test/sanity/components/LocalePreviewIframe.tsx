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
        document={props.document}
        options={{
          // Required when multiple iframe panes exist (see sanity-plugin-iframe-pane)
          key: `preview-${locale}`,
          url: (doc) =>
            buildPreviewUrl(schemaType, (doc as SanityPreviewDoc | undefined) ?? undefined, locale),
          reload: { button: true },
        }}
      />
    )
  }

  LocalePreviewPane.displayName = locale === 'nb' ? 'LocalePreviewNb' : 'LocalePreviewEn'
  return LocalePreviewPane
}
