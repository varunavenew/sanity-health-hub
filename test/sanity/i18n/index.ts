/**
 * Studio UI localization for CMedical's own Studio components.
 *
 * Built-in Sanity strings (Publish, Delete, History, Inspect, dialogs, menus)
 * come from the locale plugins — `@sanity/locale-nb-no` in the Norwegian
 * workspace, Sanity's bundled en-US in the English one. This namespace only
 * covers text that *our* custom inputs and document actions render.
 *
 * This has nothing to do with website content localization: `SUPPORTED_LANGUAGES`
 * in sanity.config.ts drives the no/en content fields and is untouched here.
 */
import {defineLocaleResourceBundle, useTranslation} from 'sanity'
import {enUSStudioResources} from './resources.en-US'
import {nbNOStudioResources} from './resources.nb-NO'

export const CMEDICAL_STUDIO_NAMESPACE = 'cmedical'

export type StudioResourceKey = keyof typeof enUSStudioResources

/** Registered on every workspace via `i18n.bundles`. */
export const cmedicalStudioLocaleBundles = [
  defineLocaleResourceBundle({
    locale: 'en-US',
    namespace: CMEDICAL_STUDIO_NAMESPACE,
    resources: enUSStudioResources,
  }),
  defineLocaleResourceBundle({
    locale: 'nb-NO',
    namespace: CMEDICAL_STUDIO_NAMESPACE,
    resources: nbNOStudioResources,
  }),
]

type StudioTranslate = (
  key: StudioResourceKey,
  values?: Record<string, string | number>,
) => string

/**
 * `useTranslation` scoped to the CMedical namespace, narrowed to the keys we
 * actually define so a typo fails the build instead of rendering a raw key.
 */
export function useStudioText(): StudioTranslate {
  const {t} = useTranslation(CMEDICAL_STUDIO_NAMESPACE)
  return t as unknown as StudioTranslate
}
