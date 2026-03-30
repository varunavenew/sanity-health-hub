import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SpecialistIcon} from './schemaTypes/icons'

const hiddenTypes = ['specialist', 'specialistsPage']

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // All other types (auto-generated, excluding hidden ones)
            ...S.documentTypeListItems().filter(
              (item) => !hiddenTypes.includes(item.getId() || '')
            ),
            S.divider(),
            // Custom Specialists group
            S.listItem()
              .title('Specialists')
              .icon(SpecialistIcon)
              .child(
                S.list()
                  .title('Specialists')
                  .items([
                    S.listItem()
                      .title('About our specialists')
                      .icon(SpecialistIcon)
                      .child(
                        S.document()
                          .schemaType('specialistsPage')
                          .documentId('specialistsPage')
                      ),
                    S.documentTypeListItem('specialist').title('Our specialists'),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
