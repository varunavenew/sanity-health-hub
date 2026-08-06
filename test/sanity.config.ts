if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return originalRemoveChild.call(child.parentNode, child) as T;
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return originalInsertBefore.call(referenceNode.parentNode, newNode, referenceNode) as T;
      }
      return originalInsertBefore.call(this, newNode, null) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

import {defineConfig, type SchemaTypeDefinition} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import TranslateToEnglishAction from './sanity/actions/translateToEnglish'
import {
  NAV_SYNC_PAGE_TYPES,
  PublishWithNavSync,
} from './sanity/actions/publishWithNavSync'
import {createSpecialistDeleteAction} from './sanity/actions/safeDeleteSpecialist'
import {EnglishFlagIcon, NorwegianFlagIcon} from './sanity/components/FlagIcons'
import {createLocalePreviewPane} from './sanity/components/LocalePreviewIframe'
import {deskStructure} from './sanity/deskStructure'
import {
  requireSanityDataset,
  requireSanityProjectId,
} from './sanity/dataset-env'
import {DatasetBadgeNavbar} from './sanity/components/DatasetBadgeNavbar'
import {uniqueReferenceFormInput} from './sanity/components/uniqueReferenceInputs'

// Languages enabled for field-level localization across the project.
// Add SE here later if/when Swedish content is added.
export const SUPPORTED_LANGUAGES = [
  {id: 'no', title: 'Norwegian'},
  {id: 'en', title: 'English'},
] as const

// Default document node with locale-specific preview panes (no + en)
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const previewableTypes = [
    'article', 'treatment', 'treatmentCategory', 'specialist',
    'themePage', 'homepage', 'aboutPage', 'contactPage',
    'pricingPage', 'insurancePage', 'servicesPage', 'clinicPage', 'jobListing',
    'newsPage',
    'privacyPolicyPage',
    'guidePage',
    'careersPage',
  ]

  if (previewableTypes.includes(schemaType)) {
    const PreviewNo = createLocalePreviewPane({locale: 'no', schemaType})
    const PreviewEn = createLocalePreviewPane({locale: 'en', schemaType})

    return S.document().views([
      S.view.form().title('About'),
      S.view
        .component(PreviewNo)
        .id('preview-no')
        .title('View')
        .icon(NorwegianFlagIcon),
      S.view
        .component(PreviewEn)
        .id('preview-en')
        .title('View')
        .icon(EnglishFlagIcon),
    ])
  }

  return S.document().views([
    S.view.form().title('About'),
  ])
}

const studioDataset = requireSanityDataset()

export default defineConfig({
  name: 'default',
  // Always "CMedical" — never surface Developer/Production dataset names in Studio chrome.
  title: 'CMedical',
  // `/` for sanity.studio + sanity.io/@…/studio/… links; `/studio` when embedded in Next.js (see next.config.ts env).
  basePath: process.env.SANITY_STUDIO_BASEPATH || '/',

  projectId: requireSanityProjectId(),
  dataset: studioDataset,

  studio: {
    components: {
      // Badge only on localhost + developer dataset — never on hosted/production Studio.
      navbar: DatasetBadgeNavbar,
    },
  },

  form: {
    components: {
      input: uniqueReferenceFormInput,
    },
  },

  plugins: [
    structureTool({
      defaultDocumentNode,
      structure: deskStructure,
    }),
    visionTool(),
    internationalizedArray({
      languages: SUPPORTED_LANGUAGES.map((l) => ({id: l.id, title: l.title})),
      defaultLanguages: ['no'],
      // The base types we want a localized variant of.
      // Studio will register: internationalizedArrayString, internationalizedArrayText,
      // internationalizedArrayBlockContent, internationalizedArraySlug
      fieldTypes: ['string', 'text', 'blockContent', 'slug'],
    }),
  ],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
    templates: (prev) => [
      ...prev,
      {
        id: 'faqCollection-homepage',
        title: 'Homepage FAQ',
        schemaType: 'faqCollection',
        value: {
          title: 'Homepage FAQ',
        },
      },
      {
        id: 'faqCollection-treatmentCategory',
        title: 'Category FAQ',
        schemaType: 'faqCollection',
        value: {
          title: 'Category FAQ',
        },
      },
      {
        id: 'faqCollection-treatment',
        title: 'Treatment FAQ',
        schemaType: 'faqCollection',
        value: {
          title: 'Treatment FAQ',
        },
      },
      {
        id: 'faqCollection-specialist',
        title: 'Specialist FAQ',
        schemaType: 'faqCollection',
        value: {
          title: 'Specialist FAQ',
        },
      },
      {
        id: 'faqCollection-clinic',
        title: 'Clinic FAQ',
        schemaType: 'faqCollection',
        value: {
          title: 'Clinic FAQ',
        },
      },
      {
        id: 'ctaCollection-default-booking',
        title: 'Default Booking CTA',
        schemaType: 'ctaCollection',
        value: {
          internalName: 'Default Booking CTA',
          primaryPath: '/booking',
          showSecondaryButton: true,
        },
      },
      {
        id: 'ctaCollection-category-booking',
        title: 'Category Booking CTA',
        schemaType: 'ctaCollection',
        value: {
          internalName: 'Category Booking CTA',
          primaryPath: '/booking',
          showSecondaryButton: true,
        },
      },
      {
        id: 'insuranceCollection-standard',
        title: 'Standard Insurance Partners',
        schemaType: 'insuranceCollection',
        value: {
          internalName: 'Standard Insurance Partners',
        },
      },
      {
        id: 'insuranceCollection-corporate',
        title: 'Corporate Partners',
        schemaType: 'insuranceCollection',
        value: {
          internalName: 'Corporate Partners',
        },
      },
    ],
  },

  document: {
    actions: (prev, context) => {
      let actions = prev

      if (NAV_SYNC_PAGE_TYPES.has(context.schemaType)) {
        actions = actions.map((action) =>
          action.action === 'publish' ? PublishWithNavSync : action,
        )
      }

      // Specialist Delete: wrap native Delete — cleanup refs, then delete (no wizard).
      if (context.schemaType === 'specialist') {
        actions = actions.map((action) =>
          action.action === 'delete'
            ? createSpecialistDeleteAction(action)
            : action,
        )
      }

      const i18nTypes = new Set([
        'article', 'aboutPage', 'treatment', 'treatmentCategory',
        'homepage', 'contactPage', 'clinicPage', 'clinicsPage', 'servicesPage',
        'insurancePage', 'themePage', 'pricingPage', 'specialistsPage', 'specialistsListingPage', 'newsPage',
        'specialist',
        'siteSettings',
        'guidePage',
        'careersPage',
      ])
      if (!i18nTypes.has(context.schemaType)) return actions
      return [...actions, TranslateToEnglishAction]
    },
  },
})
