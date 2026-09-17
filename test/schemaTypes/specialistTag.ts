/**
 * Specialist Tag — reusable expertise keyword with optional page link.
 * Referenced from specialists so the same tag (e.g. Gynekologi) can be shared.
 */
import {defineIncomingReferenceDecoration} from 'sanity/structure'
import {CategoryIcon} from './icons'
import {pickStudioEn, pickStudioLabel} from './studioPreview'
import {requiredNoEnI18n} from './i18n'

export default {
  name: 'specialistTag',
  title: 'Specialist Tag',
  type: 'document',
  icon: CategoryIcon,
  fields: [
    {
      name: 'label',
      title: 'Text',
      type: 'internationalizedArrayString',
      description: 'Short keyword shown on specialist profiles and cards (NO + EN).',
      validation: requiredNoEnI18n('Text'),
    },
    {
      name: 'href',
      title: 'Link',
      type: 'internationalizedArrayString',
      description:
        'Optional. Internal path (e.g. /gynekologi) or full URL, per language (NO + EN). Leave empty for a non-clickable tag.',
    },
  ],
  renderMembers: (members: unknown[]) => [
    ...members,
    defineIncomingReferenceDecoration({
      name: 'usedOn',
      title: 'Used on',
      description: 'Specialists that use this tag.',
      types: [{type: 'specialist'}],
      creationAllowed: false,
    }),
  ],
  orderings: [
    {
      title: 'Text',
      name: 'labelAsc',
      by: [{field: 'label', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'label',
      href: 'href',
    },
    prepare({title, href}: {title?: unknown; href?: unknown}) {
      return {
        title: pickStudioLabel({title, fallback: 'Specialist tag'}),
        subtitle: pickStudioEn(href) || 'No link',
      }
    },
  },
}
